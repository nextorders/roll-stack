import { hapticFeedback } from '@telegram-apps/sdk-vue'

function _useFeedback() {
  function vibrate() {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light')
    }
  }

  return {
    vibrate,
  }
}

export const useFeedback = createSharedComposable(_useFeedback)
