<script>
    import TabItem from './TabItem.vue'
    import { h } from 'vue'
    import UpdateButton from '../controls/UpdateButton.vue'


    export default {
        name: "TabsView",
        components: {
            TabItem,
            UpdateButton
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
                haveUpdateButton: this.haveUpdateMethod(this.defaultTab),
                loading: false
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
                    this.haveUpdateButton = this.haveUpdateMethod(name)
                    this.currentTab = name
                }
            },
            haveUpdateMethod(name) {
                if (!this.tabs[name]) {
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
    <div v-if="tabs" class="tabs-panel">
        <div class="tabs-view list">
            <h1 v-if="label" class="tabs-view-label">{{ label }}</h1>
            <TabItem
                v-for="[name, { caption }] in Object.entries(tabs)"
                :key="name"
                :selected="currentTab == name"
                :title="tabTitle"
                v-on:click="switchTab(name)" 
            >
                <h2 class="tab-label">{{ caption }}</h2>
            </TabItem>
        </div>
        <div v-if="currentTab && tabs[currentTab]['render']" class="tab-content">
            <UpdateButton 
                class="update-button"
                v-if="haveUpdateButton"
                :loading="loading"
                :onClick="updateContent"
            />
            <KeepAlive>
                <component 
                    ref="content" 
                    :is="tabs[currentTab]['render']"
                ></component>
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
        position: relative;
        width: calc(100% - 250px);
        margin-left: 5px;
        display: flex;
        flex-direction: column;
    }
    .update-button {
        position: absolute;
        top: 0px;
        right: 0px;
    }
</style>