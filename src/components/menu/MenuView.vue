<script>
import { h } from 'vue'
import UpdateButton from '../controls/UpdateButton.vue'

export default {
  name: "MenuView",
  components: {
    UpdateButton
  },
  props: {
    tabs: Object,
    tab: String,
    header: String,
    tabTitle: String,
  },
  data() {
    return {
      currentTab: undefined,
      haveUpdateButton: this.haveUpdateMethod(this.tab),
      loading: false
    }
  },
  mounted() {
    this.switchTab(this.currentTab || this.getDefaultTab());
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
      return this.tab || Object.keys(this.tabs)[0];
    },
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
  <div class="list" style="position: relative">
    <h1 v-if="header" class="title">{{ header }}</h1>
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
      <div v-if="tabs[currentTab] && tabs[currentTab]['render']" class="menu-item-content">
        <UpdateButton class="update-button" v-if="haveUpdateButton" :loading="loading" :onClick="updateContent" />
        <KeepAlive>
          <component 
            ref="content"
            :key="currentTab"
            :is="tabs[currentTab]['render']"
            v-bind="$attrs"
          />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<style scoped>
.update-button {
  position: absolute;
  top: 0px;
  right: 0px;
}
.menu-panel {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.menu-items {
  width: var(--menu-item-width);
  height: fit-content;
  padding: 2px;
}

.menu-items h2 {
  transition: 0.5s;
  cursor: pointer;
  border-radius: var(--border-radius);
  padding: 5px;
  text-align: center;
  word-wrap: break-word;
}

.menu-item-content {
  position: relative;
  width: calc(100% - var(--menu-item-width));
  margin-left: 5px;
}
</style>