import { hapticFeedback } from '@telegram-apps/sdk-vue'

function _useFeedback() {
  function vibrate(type: 'light' | 'success' | 'error' = 'light') {
    if (type === 'light' && hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light')
    }

    if (type === 'success' && hapticFeedback.notificationOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }

    if (type === 'error' && hapticFeedback.notificationOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('error')
    }
  }

  return {
    vibrate,
  }
}

export const useFeedback = createSharedComposable(_useFeedback)
