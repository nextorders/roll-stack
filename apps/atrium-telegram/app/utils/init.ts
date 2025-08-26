import type { ThemeParams } from '@telegram-apps/sdk-vue'
import {
  bindThemeParamsCssVars,
  bindViewportCssVars,
  emitEvent,
  exitFullscreen,
  init as initSDK,
  mockTelegramEnv,
  mountBackButton,
  mountClosingBehavior,
  mountMiniAppSync,
  mountViewport,
  requestFullscreen,
  restoreInitData,
  retrieveLaunchParams,
  setDebug,
  themeParamsState,
} from '@telegram-apps/sdk-vue'

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
  debug: boolean
  eruda: boolean
  mockForMacOS: boolean
}): Promise<void> {
  setDebug(options.debug)
  initSDK()

  // Add Eruda if needed.
  options.eruda
  && void import('eruda').then(({ default: eruda }) => {
    eruda.init()
    eruda.position({ x: window.innerWidth - 50, y: 0 })
  })

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
    let firstThemeSent = false
    mockTelegramEnv({
      onEvent(event, next) {
        if (event[0] === 'web_app_request_theme') {
          let tp: ThemeParams = {}
          if (firstThemeSent) {
            tp = themeParamsState()
          } else {
            firstThemeSent = true
            tp ||= retrieveLaunchParams().tgWebAppThemeParams
          }
          emitEvent('theme_changed', { theme_params: tp })
          return
        }

        if (event[0] === 'web_app_request_safe_area') {
          emitEvent('safe_area_changed', {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          })
          return
        }

        next()
      },
    })
  }

  // Mount all components used in the project.
  mountBackButton.ifAvailable()
  restoreInitData()

  if (mountMiniAppSync.isAvailable()) {
    mountMiniAppSync()
    bindThemeParamsCssVars()
  }

  mountClosingBehavior.ifAvailable()

  if (mountViewport.isAvailable()) {
    mountViewport().then(() => {
      bindViewportCssVars()

      if (requestFullscreen.isAvailable()) {
        requestFullscreen().finally(() => {
          // Wait
          setTimeout(() => {
            // The app is now in fullscreen
            if (window.innerWidth > 600) {
              // Application should be in fullscreen mode only on small screens!
              exitFullscreen()
            }
          }, 50)
        })
      }
    })
  }
}
