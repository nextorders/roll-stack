import { backButton } from '@telegram-apps/sdk-vue'

function _useBackButton() {
  let offClick: () => void = () => {}

  const router = useRouter()

  watch(router.currentRoute, () => {
    if (router.currentRoute.value.name === 'index') {
      backButton.hide()
      offClick()
    } else if (!backButton.isVisible()) {
      backButton.show()
      offClick = backButton.onClick(onBackButtonClick)
    }
  })

  function onBackButtonClick(): void {
    router.go(-1)
  }
}

export const useBackButton = createSharedComposable(_useBackButton)
