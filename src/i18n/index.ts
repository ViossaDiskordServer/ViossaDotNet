import { createI18n } from 'vue-i18n'
import en_US from '../locales/en_US'
import vp_VL from '../locales/vp_VL'
import type { MessageSchema } from './types'

const i18n = createI18n<[MessageSchema], 'en_US' | 'vp_VL'>({
  legacy: false,
  locale: 'vp_VL',
  fallbackLocale: 'en_US',
  messages: {
    en_US,
    vp_VL
  }
})

export default i18n