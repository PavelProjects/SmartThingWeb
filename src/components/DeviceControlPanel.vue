<script>
    import DeviceInfoTab from './tabs/DeviceInfoTab.vue'
    import DeviceActionsTab from './tabs/DeviceActionsTab.vue'
    import { h } from 'vue'

    export default {
        name: 'DeviceControlPanel',
        components: {
            DeviceInfoTab,
            DeviceActionsTab
        },
        props: {
            ip: String
        },
        data() {
            return {
                currentTab: null,
                tabs: {
                    "info": {
                        class: DeviceInfoTab,
                        caption: "Device information",
                        props: {
                            ip: this.ip
                        }
                    },
                    "actions": {
                        class: DeviceActionsTab,
                        caption: "Device actions",
                        props: {
                            ip: this.ip
                        }
                    }
                }
            }
        },
        created() {
            this.switchTab("info")
        },
        methods: {
            switchTab(name) {
                if (!this.tabs[name]["render"]) {
                    const tabInfo = this.tabs[name]
                    this.tabs[name]["render"] = h(
                        tabInfo.class,
                        tabInfo.props
                    )
                }
                this.currentTab = name
            }
        }
    }
</script>

<template>
    <div class="tab-view bordered">
        <div class="tabs">
            <h1>Tabs</h1>
            <button v-for="[name, { caption }] in Object.entries(tabs)" :key="name" v-on:click="switchTab(name)">
                <h2>{{ caption }}</h2>
            </button>
        </div>
        <div class="wrapper">
            <div v-if="currentTab && tabs[currentTab]['render']" class="view bordered">
                <component :is="tabs[currentTab]['render']"></component>
            </div>
            <div v-else>
                <h1>Select tab</h1>
            </div>
        </div>
    </div>
</template>

<style scoped>
    h1 {
        text-align: center;
    }
    .tab-view {
        display:grid;
        grid-template-columns: 1fr 4fr;
        column-gap: 5px;
    }
    .tabs {
        grid-column: 1;
        height: 100%;
    }
    .tabs button {
        width: 100%;
        margin-bottom: 5px;
    }
    .view {
        grid-column: 2;
    }
</style>