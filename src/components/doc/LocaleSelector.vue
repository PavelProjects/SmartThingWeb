<script>
import Container from '../base/Container.vue'
import { currentLocale, switchLocale, SUPPORTED_LOCALES } from '../../intlConfig'

export default {
  name: 'LocaleSelector',
  components: {
    Container
  },
  data() {
    return {
      currentLocale,
      SUPPORTED_LOCALES,
      switchLocale,
      expanded: false
    }
  }
}
</script>

<template>
  <div>
    <p class="locale" @click.stop="() => (expanded = !expanded)">{{ currentLocale }}</p>
    <div v-if="expanded" class="overlay" @click.stop="() => (expanded = false)">
      <Container :vertical="true" class="locales-list">
        <p
          v-for="locale of SUPPORTED_LOCALES.filter((l) => l !== currentLocale)"
          :key="locale"
          @click.stop="() => switchLocale(locale)"
          class="locale"
        >
          {{ locale }}
        </p>
      </Container>
    </div>
  </div>
</template>

<style>
.locale {
  cursor: pointer;
}
.locales-list {
  position: absolute;
  top: var(--default-gap);
  right: 8px;
  width: fit-content;
  padding: var(--default-gap);
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius);
}
</style>
