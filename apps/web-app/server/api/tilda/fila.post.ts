export default defineEventHandler(async (event) => {
  try {
    const logger = useLogger('api:tilda:fila')

    const body = await readBody(event) as TildaFilaBody
    if (!body.phone || !body.payment) {
      throw createError({ statusCode: 400, message: 'Missing body' })
    }

    logger.success('data from tilda', JSON.stringify(body, null, 2))

    const result = await sendToIntegration(body)

    logger.success('result from iiko', JSON.stringify(result, null, 2))

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})

interface TildaFilaBody {
  name: string // "Иван"
  phone: string // "+7 (995) 999-99-99"
  email: string
  time: string // "13:00"
  comment: string
  address: string // "Ленина 25 кв 71"
  changeFrom: string // "5000"
  payment: {
    orderid: string // "1107354040"
    amount: string // "3748"
    products: TildaFilaProduct[]
  }
}

interface TildaFilaProduct {
  externalid: string
  name: string
  quantity: number
  amount: number
  price: string
}

interface IIKOCreateDeliveryBody {
  organizationId: string
  terminalGroupId: string
  createOrderSettings: {
    transportToFrontTimeout: number
    checkStopList: boolean
  }
  order: IIKOOrder
}

interface IIKOOrder {
  menuId: number
  phone: string
  comment: string
  orderServiceType: 'DeliveryByCourier'
  deliveryPoint: IIKOOrderDeliveryPoint
  items: IIKOOrderItem[]
}

interface IIKOOrderDeliveryPoint {
  address: {
    street: {
      name: string
      city: string
    }
    house: string
    type: 'legacy'
  }
  comment: string
}

interface IIKOOrderItem {
  productId: string
  price: number
  type: 'Product'
  amount: number
  comment: string
}

async function createAccessToken(): Promise<{ token: string, correlationId: string }> {
  const { iiko } = useRuntimeConfig()

  const apiUrl = 'https://api-ru.iiko.services/api/1/access_token'
  const body = {
    apiLogin: iiko.filaApiToken,
  }

  return fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())
}

async function sendToIntegration(data: TildaFilaBody) {
  const logger = useLogger('api:tilda:fila')
  const { iiko } = useRuntimeConfig()

  try {
    const { token } = await createAccessToken()

    const apiUrl = 'https://api-ru.iiko.services/api/1/deliveries/create'

    // Remove all except numbers
    const phone = `+${data.phone.replace(/\D/g, '')}`

    const deliveryPoint: IIKOOrderDeliveryPoint = {
      address: {
        street: {
          name: data.address,
          city: 'Калининград',
        },
        house: '<',
        type: 'legacy',
      },
      comment: data.address,
    }

    const items: IIKOOrderItem[] = data.payment.products.map((product) => ({
      productId: product.externalid,
      price: Number(product.price),
      type: 'Product',
      amount: product.quantity,
      comment: product.name,
    }))

    const body: IIKOCreateDeliveryBody = {
      organizationId: iiko.filaOrganizationId,
      terminalGroupId: iiko.filaTerminalGroupId,
      createOrderSettings: {
        transportToFrontTimeout: 120,
        checkStopList: true,
      },
      order: {
        menuId: iiko.filaMenuId,
        phone,
        items,
        orderServiceType: 'DeliveryByCourier',
        deliveryPoint,
        comment: `${data.comment}; Время ${data?.time ?? ''}; Имя ${data.name}; Email ${data?.email ?? ''}; Сдача с ${data?.changeFrom ?? ''}; Адрес ${data.address}; Сумма с сайта ${data.payment?.amount ?? ''}`,
      },
    }

    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json())
  } catch (error) {
    logger.error(error)
  }
}
