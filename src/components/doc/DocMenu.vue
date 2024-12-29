<script>
import { useIntl } from 'vue-intl'
import BaseContainer from '../base/BaseContainer.vue'
import BuildInfoDialog from './BuildInfoDialog.vue'

const menuItems = {
  panel:
    'M7 3H5V9H7V3M19 3H17V13H19V3M3 13H5V21H7V13H9V11H3V13M15 7H13V3H11V7H9V9H15V7M11 21H13V11H11V21M15 15V17H17V21H19V17H21V15H15Z',
  settings:
    'M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z',
  logs: 'M5,3C3.89,3 3,3.89 3,5V19C3,20.11 3.89,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3H5M5,5H19V19H5V5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z'
}

if (import.meta.env.VITE_MODE === 'gateway') {
  menuItems['ota'] =
    'M12 6C8.62 6 5.5 7.12 3 9L1.2 6.6C4.21 4.34 7.95 3 12 3S19.79 4.34 22.8 6.6L21 9C18.5 7.12 15.38 6 12 6M12 15C10.65 15 9.4 15.45 8.4 16.2L12 21L13.26 19.32C13.1 18.74 13 18.13 13 17.5C13 16.69 13.16 15.91 13.43 15.19C12.97 15.08 12.5 15 12 15M15.23 12.61C16.19 11.77 17.38 11.22 18.7 11.05C16.78 9.76 14.5 9 12 9C9.3 9 6.81 9.89 4.8 11.4L6.6 13.8C8.1 12.67 9.97 12 12 12C13.14 12 14.23 12.22 15.23 12.61M19 20C17.62 20 16.5 18.88 16.5 17.5C16.5 17.1 16.59 16.72 16.76 16.38L15.67 15.29C15.25 15.92 15 16.68 15 17.5C15 19.71 16.79 21.5 19 21.5V23L21.25 20.75L19 18.5V20M19 13.5V12L16.75 14.25L19 16.5V15C20.38 15 21.5 16.12 21.5 17.5C21.5 17.9 21.41 18.28 21.24 18.62L22.33 19.71C22.75 19.08 23 18.32 23 17.5C23 15.29 21.21 13.5 19 13.5Z'
}

export default {
  name: 'DocMenu',
  components: {
    BaseContainer,
    BuildInfoDialog
  },
  props: {
    visible: Boolean
  },
  emits: ['close', 'open'],
  data() {
    const intl = useIntl()
    return {
      intl,
      menuItems,
      buildInfoVisible: false
    }
  }
}
</script>

<template>
  <div class="menu">
    <svg
      fill="currentColor"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      @click.stop="() => $emit(visible ? 'close' : 'open')"
    >
      <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path>
    </svg>

    <Transition name="slide-right">
      <div v-if="visible" class="overlay" @click="() => $emit('close')">
        <div class="menu-items bordered">
          <BaseContainer
            v-for="([item, icon], index) of Object.entries(menuItems)"
            :key="index"
            gap="10px"
            class="menu-item"
          >
            <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 24 24">
              <path :d="icon" />
            </svg>
            <router-link :to="{ name: item, params: { gateway: gatewayId } }">
              <h2>{{ intl.formatMessage({ id: 'doc.menu' }, { item }) }}</h2>
            </router-link>
          </BaseContainer>

          <BaseContainer gap="10px" class="menu-item">
            <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 24 24">
              <path
                d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
              />
            </svg>
            <a>
              <h2 @click="() => (buildInfoVisible = true)">Build info</h2>
            </a>
          </BaseContainer>
        </div>
      </div>
    </Transition>
    <BuildInfoDialog :open="buildInfoVisible" @close="() => (buildInfoVisible = false)" />
  </div>
</template>

<style scoped>
.menu {
  cursor: pointer;
  display: flex;
  height: 100%;
  align-items: center;
  gap: var(--default-gap);
}

.menu-items {
  position: absolute;
  top: 0px;
  left: 2px;
  padding: 5px;
  box-shadow: rgba(95, 98, 104, 0.35) 13px 16px 20px 0px;
  background-color: var(--color-background);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  z-index: 998;
}

.menu-items a {
  width: 100%;
}

.menu-items h2:hover {
  opacity: 0.5;
}

.menu-item {
  align-items: center;
  text-align: center;
}
</style>
