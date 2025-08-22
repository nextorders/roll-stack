import { initDataRaw as _initDataRaw, initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-vue'

function _useTelegram() {
  const initDataRaw = useSignal(_initDataRaw)
  const initDataState = useSignal(_initDataState)

  return {
    initDataRaw,
    initDataState,
  }
}

export const useTelegram = createSharedComposable(_useTelegram)
