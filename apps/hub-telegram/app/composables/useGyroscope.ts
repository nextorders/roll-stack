import type { EventListener } from '@tma.js/sdk-vue'
import { off, on } from '@tma.js/sdk-vue'

function _useGyroscope() {
  const x = ref(0)
  const y = ref(0)
  const z = ref(0)

  const listener: EventListener<'gyroscope_changed'> = (payload) => {
    x.value = payload.x
    y.value = payload.y
    z.value = payload.z
  }

  onMounted(() => {
    on('gyroscope_changed', listener)
  })

  onUnmounted(() => {
    off('gyroscope_changed', listener)
  })

  return {
    x,
    y,
    z,
  }
}

export const useGyroscope = createSharedComposable(_useGyroscope)
