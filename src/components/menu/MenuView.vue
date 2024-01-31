<script>
import MenuItem from './MenuItem.vue'
import { h } from 'vue'
import UpdateButton from '../controls/UpdateButton.vue'

export default {
  name: "MenuView",
  components: {
    MenuItem,
    UpdateButton
  },
  props: {
    tabs: Object,
    defaultTab: String,
    header: String,
    tabTitle: String,
    updateTabs: Function,
  },
  data() {
    return {
      currentTab: undefined,
      haveUpdateButton: this.haveUpdateMethod(this.defaultTab),
      loading: false
    }
  },
  watch: {
    tabs() {
      if (this.tabs[this.currentTab]) {
        this.switchTab(this.currentTab, true)
      } else {
        this.switchTab(this.defaultTab || Object.keys(this.tabs)[0], true)
      }
    }
  },
  methods: {
    switchTab(name, forceRender=false) {
      if (this.currentTab == name && !forceRender) {
        this.updateContent()
        return
      } 
      if (this.tabs[name]) {
        if (!this.tabs[name]["render"] || forceRender) {
          this.tabs[name]["render"] = h(
            this.tabs[name].class,
            this.tabs[name].props
          )
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
  <div class="list">
    <h1 v-if="header" class="title">{{ header }}</h1>
    <UpdateButton 
      class="update-button"
      v-if="updateTabs"
      :loading="loading"
      :onClick="updateTabs"
    />
    <div v-if="tabs" class="menu-panel">
      <div class="menu-items list bordered">
        <h2 v-for="[name, { caption }] in Object.entries(tabs)" 
          :key="name"
          :id="name"
          :title="tabTitle"
          :class="{ 'menu-selected': currentTab == name }" 
          @click="switchTab(name)">
          {{ caption }}
        </h2>
      </div>
      <div v-if="currentTab && tabs[currentTab]['render']" class="menu-item-content">
        <UpdateButton class="update-button" v-if="haveUpdateButton" :loading="loading" :onClick="updateContent" />
        <KeepAlive>
          <component 
            :key="currentTab"
            ref="content"
            :is="tabs[currentTab]['render']"
            @updateTabs="updateTabs"
          />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-panel {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.menu-items {
  width: var(--menu-item-widht);
  height: fit-content;
}

.menu-items h2 {
  transition: 0.5s;
  cursor: pointer;
  border-radius: var(--border-radius);
  ;
  padding: 5px;
  text-align: center;
}

.menu-item-content {
  position: relative;
  width: calc(100% - var(--menu-item-widht));
  margin-left: 5px;
}

.menu-selected {
  background-color: var(--vt-c-black-mute);
}
</style>