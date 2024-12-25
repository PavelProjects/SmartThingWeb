import { defineStore } from 'pinia'
import { defaultThemes } from '../themes/themes'

const THEME_STORAGE_KEY = 'color-theme'

const applyTheme = (theme) => {
  const resolvedTheme = { ...defaultThemes.dark, ...theme }

  const bodyStyles = document.body.style
  bodyStyles.setProperty('--color-background', resolvedTheme.background)
  bodyStyles.setProperty('--color-background-mute', resolvedTheme.backgroundMute)
  bodyStyles.setProperty('--color-background-soft', resolvedTheme.backgroundSoft)
  bodyStyles.setProperty('--color-background-tilt', resolvedTheme.backgroundTilt)
  bodyStyles.setProperty('--color-accent', resolvedTheme.colorAccent)
  bodyStyles.setProperty('--color-text', resolvedTheme.text)
  bodyStyles.setProperty('--color-text-button', resolvedTheme.textButton)
  bodyStyles.setProperty('--color-border', resolvedTheme.border)
}

// add custom themes support
export const useThemeStore = defineStore({
  id: 'theme_store',
  state: () => {
    let theme = 'light'
    const fromStorage = localStorage.getItem(THEME_STORAGE_KEY)
    if (fromStorage) {
      theme = fromStorage
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark'
    }

    applyTheme(defaultThemes[theme] ?? {})

    return {
      theme
    }
  },
  actions: {
    setTheme(themeKey) {
      applyTheme(defaultThemes[themeKey] ?? {})

      localStorage.setItem(THEME_STORAGE_KEY, themeKey)
      this.theme = themeKey
    }
  }
})
