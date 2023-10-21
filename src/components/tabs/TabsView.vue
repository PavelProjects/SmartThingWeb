<script>
    import TabItem from './TabItem.vue'
    import { h } from 'vue'

    export default {
        name: "TabsView",
        components: {
            TabItem
        },
        props: {
            tabs: Object,
            defaultTab: String,
            label: String,
            tabTitle: String
        },
        data() {
            return {
                currentTab: this.defaultTab,
                haveUpdateButton: false
            }
        },
        methods: {
            switchTab(name) {
                if (this.currentTab == name) {
                    this.updateContent()
                } else if (this.tabs[name]) {
                    if (!this.tabs[name]["render"]) {
                        this.tabs[name]["render"] = h(
                            this.tabs[name].class,
                            this.tabs[name].props
                        )
                    }
                    this.haveUpdateButton = this.tabs[name].class.methods.update ? true : false
                    this.currentTab = name
                }
            },
            updateContent() {
                if (this.$refs.content && this.$refs.content.update) {
                    this.$refs.content.update()
                } else {
                    console.error("Content don't have update method")
                }
            }
        }
    }
</script>

<template>
    <div v-if="tabs" class="tabs-panel">
        <div class="tabs-view list">
            <h1 v-if="label" class="tabs-view-label">{{ label }}</h1>
            <TabItem
                v-for="[name, { caption }] in Object.entries(tabs)"
                :key="name"
                :selected="currentTab == name"
                v-on:click="switchTab(name)" 
                :title="tabTitle"
            >
                <h2 class="tab-label">{{ caption }}</h2>
            </TabItem>
        </div>
        <div v-if="currentTab && tabs[currentTab]['render']" class="tab-content">
            <button 
                class="update-button"
                v-if="haveUpdateButton"
                v-on:click.prevent="updateContent()"
            >
                <h3>Update</h3>
            </button>
            <KeepAlive>
                <component ref="content" :is="tabs[currentTab]['render']"></component>
            </KeepAlive>
        </div>
    </div>
</template>

<style scoped>
    .tabs-panel {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .tabs-view {
        width: 250px;
    }
    .tab-content {
        width: calc(100% - 250px);
        margin-left: 5px;
        display: flex;
        flex-direction: column;
    }
    .update-button {
        margin-left: auto;
    }
</style>