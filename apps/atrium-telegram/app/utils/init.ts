import type { ThemeParams } from '@tma.js/sdk-vue'
import {
  backButton,
  closingBehavior,
  emitEvent,
  initData,
  init as initSDK,
  miniApp,
  mockTelegramEnv,
  postEvent,
  retrieveLaunchParams,
  setDebug,
  swipeBehavior,
  themeParams,
  viewport,
} from '@tma.js/sdk-vue'

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
  if (options.eruda) {
    import('eruda').then(({ default: eruda }) => {
      eruda.init()
      eruda.position({ x: window.innerWidth - 50, y: 0 })
    })
  }

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
    let firstThemeSent = false
    mockTelegramEnv({
      onEvent(event, next) {
        if (event.name === 'web_app_request_theme') {
          let tp: ThemeParams = {}
          if (firstThemeSent) {
            tp = themeParams.state()
          } else {
            firstThemeSent = true
            tp ||= retrieveLaunchParams().tgWebAppThemeParams
          }
          return emitEvent('theme_changed', { theme_params: tp })
        }

        if (event.name === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          })
        }

        next()
      },
    })
  }

  // Mount all components used in the project.
  backButton.mount.ifAvailable()
  initData.restore()

  if (miniApp.mount.isAvailable()) {
    themeParams.mount()
    miniApp.mount()
    themeParams.bindCssVars()
  }

  if (viewport.mount.isAvailable()) {
    viewport.mount().then(() => {
      viewport.bindCssVars()

      if (viewport.requestFullscreen.isAvailable()) {
        viewport.requestFullscreen().finally(() => {
          // Wait
          setTimeout(() => {
            // The app is now in fullscreen
            if (window.innerWidth > 600) {
              // Application should be in fullscreen mode only on small screens!
              viewport.exitFullscreen()
            }
          }, 50)
        })
      }
    })
  }

  closingBehavior.mount.ifAvailable()
  closingBehavior.enableConfirmation.ifAvailable()

  // Disable vertical swipes to prevent app close
  swipeBehavior.mount.ifAvailable()
  swipeBehavior.disableVertical.ifAvailable()

  // Orientation lock
  postEvent('web_app_toggle_orientation_lock', {
    locked: true,
  })

  // Gyroscope
  postEvent('web_app_start_gyroscope', {
    refresh_rate: 80,
  })
}
