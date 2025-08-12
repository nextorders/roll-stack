import type { WeightUnit } from '~~/shared/services/common'
import type { UserGender } from '~~/shared/types'

export function getCategoryInfo(category: string) {
  if (category === 'development') {
    return {
      title: 'Разработка',
      icon: 'i-lucide-cog',
    }
  }
  if (category === 'milestone') {
    return {
      title: 'Значимая веха',
      icon: 'i-lucide-flag',
    }
  }
}

export function getWeightLocalizedUnit<WeightUnitLiteral = string & object>(unit?: WeightUnit | WeightUnitLiteral): string {
  const { t } = useI18n()

  switch (unit as WeightUnit) {
    case 'G':
      return t('common.abbreviation.g')
    case 'KG':
      return t('common.abbreviation.kg')
    case 'ML':
      return t('common.abbreviation.ml')
    case 'L':
      return t('common.abbreviation.l')
    case 'LB':
      return t('common.abbreviation.lb')
    case 'OZ':
      return t('common.abbreviation.oz')
    default:
      return ''
  }
}

export function getLocalizedWeightUnitsForSelect(): { value: WeightUnit, label: string }[] {
  const { t } = useI18n()

  return [
    { value: 'KG', label: t('common.weight-unit.kg') },
    { value: 'G', label: t('common.weight-unit.g') },
    { value: 'L', label: t('common.weight-unit.l') },
    { value: 'ML', label: t('common.weight-unit.ml') },
    // { value: 'OZ', label: t('common.weight-unit.oz') },
    // { value: 'LB', label: t('common.weight-unit.lb') },
  ]
}

export function getLocalizedGenderForSelect(): { value: UserGender, label: string }[] {
  const { t } = useI18n()

  return [
    { value: 'male', label: t('common.gender.male') },
    { value: 'female', label: t('common.gender.female') },
    { value: 'unknown', label: t('common.gender.unknown') },
  ]
}

export function getCategoryIconsForSelect(): { value: string, label: string, icon?: string }[] {
  return [
    { value: '', icon: '', label: 'Без иконки' },
    { value: 'fluent-emoji-flat:avocado', icon: 'fluent-emoji-flat:avocado', label: 'Авокадо' },
    { value: 'fluent-emoji-flat:bacon', icon: 'fluent-emoji-flat:bacon', label: 'Бекон' },
    { value: 'fluent-emoji-flat:bagel', icon: 'fluent-emoji-flat:bagel', label: 'Бейгл' },
    { value: 'fluent-emoji-flat:banana', icon: 'fluent-emoji-flat:banana', label: 'Банан' },
    { value: 'fluent-emoji-flat:baguette-bread', icon: 'fluent-emoji-flat:baguette-bread', label: 'Багет' },
    { value: 'fluent-emoji-flat:bento-box', icon: 'fluent-emoji-flat:bento-box', label: 'Бенто' },
    { value: 'fluent-emoji-flat:pancakes', icon: 'fluent-emoji-flat:pancakes', label: 'Блины' },
    { value: 'fluent-emoji-flat:broccoli', icon: 'fluent-emoji-flat:broccoli', label: 'Брокколи' },
    { value: 'fluent-emoji-flat:bubble-tea', icon: 'fluent-emoji-flat:bubble-tea', label: 'Бабл-ти' },
    { value: 'fluent-emoji-flat:burrito', icon: 'fluent-emoji-flat:burrito', label: 'Буррито' },
    { value: 'fluent-emoji-flat:hamburger', icon: 'fluent-emoji-flat:hamburger', label: 'Бургер' },
    { value: 'fluent-emoji-flat:fork-and-knife', icon: 'fluent-emoji-flat:fork-and-knife', label: 'Вилка' },
    { value: 'fluent-emoji-flat:brown-mushroom', icon: 'fluent-emoji-flat:brown-mushroom', label: 'Гриб' },
    { value: 'fluent-emoji-flat:sparkles', icon: 'fluent-emoji-flat:sparkles', label: 'Звездочки' },
    { value: 'fluent-emoji-flat:candy', icon: 'fluent-emoji-flat:candy', label: 'Конфета' },
    { value: 'fluent-emoji-flat:carrot', icon: 'fluent-emoji-flat:carrot', label: 'Морковь' },
    { value: 'fluent-emoji-flat:shortcake', icon: 'fluent-emoji-flat:shortcake', label: 'Кусок торта' },
    { value: 'fluent-emoji-flat:cocktail-glass', icon: 'fluent-emoji-flat:cocktail-glass', label: 'Коктейль' },
    { value: 'fluent-emoji-flat:cooked-rice', icon: 'fluent-emoji-flat:cooked-rice', label: 'Рис' },
    { value: 'fluent-emoji-flat:crown', icon: 'fluent-emoji-flat:crown', label: 'Корона' },
    { value: 'fluent-emoji-flat:crab', icon: 'fluent-emoji-flat:crab', label: 'Краб' },
    { value: 'fluent-emoji-flat:croissant', icon: 'fluent-emoji-flat:croissant', label: 'Круассан' },
    { value: 'fluent-emoji-flat:curry-rice', icon: 'fluent-emoji-flat:curry-rice', label: 'Карри' },
    { value: 'fluent-emoji-flat:pretzel', icon: 'fluent-emoji-flat:pretzel', label: 'Крендель' },
    { value: 'fluent-emoji-flat:french-fries', icon: 'fluent-emoji-flat:french-fries', label: 'Картошка фри' },
    { value: 'fluent-emoji-flat:fried-shrimp', icon: 'fluent-emoji-flat:fried-shrimp', label: 'Креветка во фритюре' },
    { value: 'fluent-emoji-flat:hot-beverage', icon: 'fluent-emoji-flat:hot-beverage', label: 'Кофе' },
    { value: 'fluent-emoji-flat:stuffed-flatbread', icon: 'fluent-emoji-flat:stuffed-flatbread', label: 'Лепешка' },
    { value: 'fluent-emoji-flat:ice-cream', icon: 'fluent-emoji-flat:ice-cream', label: 'Мороженое' },
    { value: 'fluent-emoji-flat:fire', icon: 'fluent-emoji-flat:fire', label: 'Огонь' },
    { value: 'fluent-emoji-flat:rice-ball', icon: 'fluent-emoji-flat:rice-ball', label: 'Онигири' },
    { value: 'fluent-emoji-flat:pizza', icon: 'fluent-emoji-flat:pizza', label: 'Пицца' },
    { value: 'fluent-emoji-flat:hot-pepper', icon: 'fluent-emoji-flat:hot-pepper', label: 'Перец' },
    { value: 'fluent-emoji-flat:cookie', icon: 'fluent-emoji-flat:cookie', label: 'Печенька' },
    { value: 'fluent-emoji-flat:popcorn', icon: 'fluent-emoji-flat:popcorn', label: 'Попкорн' },
    { value: 'fluent-emoji-flat:cupcake', icon: 'fluent-emoji-flat:cupcake', label: 'Пирожное' },
    { value: 'fluent-emoji-flat:doughnut', icon: 'fluent-emoji-flat:doughnut', label: 'Пончик' },
    { value: 'fluent-emoji-flat:beverage-box', icon: 'fluent-emoji-flat:beverage-box', label: 'Сок' },
    { value: 'fluent-emoji-flat:canned-food', icon: 'fluent-emoji-flat:canned-food', label: 'Соус' },
    { value: 'fluent-emoji-flat:green-salad', icon: 'fluent-emoji-flat:green-salad', label: 'Салат' },
    { value: 'fluent-emoji-flat:sandwich', icon: 'fluent-emoji-flat:sandwich', label: 'Сэндвич' },
    { value: 'fluent-emoji-flat:pot-of-food', icon: 'fluent-emoji-flat:pot-of-food', label: 'Суп' },
    { value: 'fluent-emoji-flat:cheese-wedge', icon: 'fluent-emoji-flat:cheese-wedge', label: 'Сыр' },
    { value: 'fluent-emoji-flat:spaghetti', icon: 'fluent-emoji-flat:spaghetti', label: 'Спагетти' },
    { value: 'fluent-emoji-flat:cut-of-meat', icon: 'fluent-emoji-flat:cut-of-meat', label: 'Стейк' },
    { value: 'fluent-emoji-flat:steaming-bowl', icon: 'fluent-emoji-flat:steaming-bowl', label: 'Рамен' },
    { value: 'fluent-emoji-flat:sushi', icon: 'fluent-emoji-flat:sushi', label: 'Суши' },
    { value: 'fluent-emoji-flat:taco', icon: 'fluent-emoji-flat:taco', label: 'Тако' },
    { value: 'fluent-emoji-flat:tamale', icon: 'fluent-emoji-flat:tamale', label: 'Тамале' },
    { value: 'fluent-emoji-flat:birthday-cake', icon: 'fluent-emoji-flat:birthday-cake', label: 'Торт' },
    { value: 'fluent-emoji-flat:bread', icon: 'fluent-emoji-flat:bread', label: 'Хлеб' },
    { value: 'fluent-emoji-flat:hot-dog', icon: 'fluent-emoji-flat:hot-dog', label: 'Хот-дог' },
    { value: 'fluent-emoji-flat:fish-cake-with-swirl', icon: 'fluent-emoji-flat:fish-cake-with-swirl', label: 'Хосомаки' },
    { value: 'fluent-emoji-flat:top-hat', icon: 'fluent-emoji-flat:top-hat', label: 'Шляпа' },
    { value: 'fluent-emoji-flat:chocolate-bar', icon: 'fluent-emoji-flat:chocolate-bar', label: 'Шоколад' },
    { value: 'fluent-emoji-flat:teacup-without-handle', icon: 'fluent-emoji-flat:teacup-without-handle', label: 'Чай' },
    { value: 'fluent-emoji-flat:cooking', icon: 'fluent-emoji-flat:cooking', label: 'Яичница' },
  ]
}

export function getSocialInfo(type: string | undefined) {
  switch (type) {
    case 'vk':
      return {
        icon: 'i-simple-icons:vk',
        color: 'text-[#0077FF]',
        title: 'ВКонтакте',
      }
    case 'telegram':
      return {
        icon: 'i-simple-icons:telegram',
        color: 'text-[#27a7e7]',
        title: 'Telegram',
      }
    default:
      return {
        icon: '',
        color: '',
        title: '',
      }
  }
}

export function getLocalizedPostStatus(status: string) {
  switch (status) {
    case 'scheduled':
      return 'Запланировано'
    case 'published':
      return 'Опубликовано'
    case 'draft':
      return 'Черновик'
    default:
      return ''
  }
}

export function getFeedbackPointDataByType(type: string) {
  if (type === 'yandex_map') {
    return {
      icon: 'i-lucide-map-pin',
      color: 'text-[#f43]',
      tooltip: 'Яндекс',
    }
  }
  if (type === '2gis_map') {
    return {
      icon: 'i-lucide-map-pin',
      color: 'text-[#19aa1e]',
      tooltip: '2ГИС',
    }
  }
  if (type === 'vk_group') {
    return {
      icon: 'simple-icons-vk',
      color: 'text-[#0077FF]',
      tooltip: 'ВКонтакте',
    }
  }

  return {
    icon: 'i-lucide-message-circle',
    color: 'primary',
    tooltip: 'Отзывы',
  }
}
