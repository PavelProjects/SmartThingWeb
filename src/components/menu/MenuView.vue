<script>
import { h } from 'vue'
import UpdateButton from '../controls/UpdateButton.vue'
import MenuItem from './MenuItem.vue'

export default {
  name: 'MenuView',
  components: {
    UpdateButton,
    MenuItem
  },
  props: {
    tabs: Object,
    tab: String,
    vertical: {
      type: Boolean,
      default: () => false
    },
    header: String,
    tabTitle: String
  },
  data() {
    return {
      currentTab: undefined,
      haveUpdateButton: this.haveUpdateMethod(this.tab),
      loading: false,
      renders: {}
    }
  },
  computed: {
    panelStyle() {
      return { 'flex-direction': this.vertical ? 'column' : 'row' }
    },
    itemsStyle() {
      return { 'flex-direction': this.vertical ? 'row' : 'column' }
    }
  },
  mounted() {
    this.switchTab(this.currentTab || this.getDefaultTab())
  },
  watch: {
    tabs() {
      if (this.tabs[this.currentTab]) {
        this.switchTab(this.currentTab, true)
      } else {
        this.switchTab(this.getDefaultTab(), true)
      }
    },
    tab() {
      this.currentTab = this.tab
      this.switchTab(this.currentTab, true)
    }
  },
  methods: {
    getDefaultTab() {
      return this.tab || Object.keys(this.tabs)[0]
    },
    switchTab(name, forceRender = false) {
      if (this.currentTab == name && !forceRender) {
        this.updateContent()
        return
      }
      if (this.tabs[name]) {
        if (!this.renders[name] || forceRender) {
          this.renders[name] = h(this.tabs[name].class, this.tabs[name].props)
        }
        this.haveUpdateButton = this.haveUpdateMethod(name)
        this.currentTab = name
      }
    },
    haveUpdateMethod(name) {
      if (!this.tabs[name] || !this.tabs[name].class.methods) {
        return false
      }
      return !!this.tabs[name].class.methods.update
    },
    async updateContent() {
      if (this.$refs.content && this.$refs.content.update) {
        this.loading = true
        try {
          await this.$refs.content.update()
        } finally {
          this.loading = false
        }
      } else {
        console.error("Content don't have update method")
      }
    }
  }
}
</script>

<template>
  <div class="list menu">
    <h1 v-if="header" class="title">{{ header }}</h1>
    <div v-if="tabs" class="menu-panel" :style="panelStyle">
      <div class="menu-items bordered" :style="itemsStyle">
        <MenuItem
          v-for="[name, { caption }] in Object.entries(tabs)"
          :key="name"
          :id="name"
          :title="tabTitle"
          :caption="caption"
          :selected="currentTab === name"
          @click="switchTab(name)"
        />
      </div>
      <div v-if="renders[currentTab]" class="menu-item-content">
        <UpdateButton
          class="update-button"
          v-if="haveUpdateButton"
          :loading="loading"
          :onClick="updateContent"
        />
        <KeepAlive>
          <component ref="content" :key="currentTab" :is="renders[currentTab]" v-bind="$attrs" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  flex: 1 0 auto;
}
.update-button {
  position: absolute;
  top: 0px;
  right: 0px;
}
.menu-panel {
  display: flex;
  gap: var(--default-gap);
}
.menu-items {
  display: flex;
  height: fit-content;
}
.menu-item-content {
  position: relative;
  flex: 1 0 auto;
}
</style>
