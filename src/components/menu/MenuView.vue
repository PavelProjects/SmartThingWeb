<script>
import { h } from 'vue'
import UpdateButton from '../base/controls/UpdateButton.vue'
import MenuItem from './MenuItem.vue'
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'MenuView',
  components: {
    UpdateButton,
    MenuItem,
    BaseContainer
  },
  props: {
    tabs: Object,
    tab: String,
    vertical: {
      type: Boolean,
      default: () => false
    },
    header: String,
    tabTitle: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      currentTab: undefined,
      renders: {}
    }
  },
  computed: {
    panelStyle() {
      return { 'flex-direction': this.vertical ? 'column' : 'row' }
    },
    itemsListClass() {
      return { vertical: this.vertical, horizontal: !this.vertical }
    }
  },
  mounted() {
    this.switchTab(this.currentTab || this.tab)
  },
  watch: {
    tabs() {
      if (this.tabs[this.currentTab]) {
        this.switchTab(this.currentTab, true)
      } else {
        this.switchTab(this.tab, true)
      }
    },
    tab() {
      this.currentTab = this.tab
      this.switchTab(this.currentTab, true)
    }
  },
  methods: {
    switchTab(name, forceRender = false) {
      if (this.disabled) {
        return
      }
      if (this.currentTab == name || forceRender) {
        this.updateContent()
        return
      }
      if (this.tabs[name]) {
        if (!this.renders[name] || forceRender) {
          this.renders[name] = h(this.tabs[name].class, this.tabs[name].props)
        }
        this.currentTab = name
      }
    },
    async updateContent() {
      if (this.$refs.content && this.$refs.content.update) {
        await this.$refs.content.update()
      }
    }
  }
}
</script>

<template>
  <BaseContainer :vertical="true">
    <h1 v-if="header" class="header">{{ header }}</h1>
    <div v-if="tabs" class="menu-panel" :style="panelStyle">
      <div class="menu-items" :class="itemsListClass">
        <MenuItem
          v-for="[name, { caption, icon }] of Object.entries(tabs)"
          :key="name"
          :id="name"
          :title="tabTitle"
          :caption="caption ?? name"
          :icon="icon"
          :selected="currentTab === name"
          @select="() => switchTab(name)"
        />
      </div>
      <div v-if="renders[currentTab]" class="menu-item-content">
        <KeepAlive>
          <component ref="content" :key="currentTab" :is="renders[currentTab]" v-bind="$attrs" />
        </KeepAlive>
      </div>
      <div v-else-if="placeholder" class="placeholder">
        <h2 class="header">
          {{ placeholder }}
        </h2>
      </div>
    </div>
  </BaseContainer>
</template>

<style scoped>
.update-button {
  position: absolute;
  top: 0px;
  right: 0px;
}
.menu-panel {
  display: flex;
}
.menu-items {
  display: flex;
  gap: var(--default-gap);
  overflow: auto;
  padding: var(--default-padding);
  min-width: 200px;
}
.menu-items:last-child {
  border-right: none;
  border-bottom: none;
}
.menu-item-content {
  position: relative;
  flex: 1 0 auto;
}
.placeholder {
  margin: auto;
}
.vertical {
  flex-direction: row;
  border-bottom: 2px solid var(--color-border);
}
.horizontal {
  flex-direction: column;
  border-right: 2px solid var(--color-border);
}
.vertical .menu-item {
  flex: 1 0 auto;
}
</style>
