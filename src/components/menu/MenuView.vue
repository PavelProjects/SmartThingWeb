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
    <div v-if="tabs" class="menu-panel">
        <div class="menu-items list">
            <h1 v-if="label" class="tabs-view-label">{{ label }}</h1>
            <h2 
                v-for="[name, { caption }] in Object.entries(tabs)"
                :key="name"
                :id="name"
                :title="tabTitle"
                :class="{'menu-selected': currentTab == name}"
                @click="switchTab(name)" 
            >
                {{ caption }}
            </h2>
        </div>
        <div v-if="currentTab && tabs[currentTab]['render']" class="menu-item-content">
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