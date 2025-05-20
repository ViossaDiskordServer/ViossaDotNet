import { createI18n } from 'vue-i18n'
import en_US from '../locales/en_US'
import type { MessageSchema } from './types'

const i18n = createI18n<[MessageSchema], 'en_US'>({
  legacy: false,
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: {
    en_US: en_US
  }
})

export default i18n