<script>
import { currentLocale, switchLocale } from '../../intlConfig'
import { useIntl } from 'vue-intl'

export default {
  name: 'LocaleSelector',
  data() {
    const intl = useIntl()
    const otherLocale = currentLocale === 'en' ? 'ru' : 'en'
    return {
      intl,
      otherLocale
    }
  },
  methods: {
    switchLocale
  }
}
</script>

<template>
  <div>
    <p
      class="locale"
      :title="intl.formatMessage({ id: 'locale.switch' })"
      @click.stop="() => switchLocale(otherLocale)"
    >
      {{ otherLocale }}
    </p>
  </div>
</template>

<style>
.locale {
  cursor: pointer;
  user-select: none;
  text-align: center;
}
</style>
