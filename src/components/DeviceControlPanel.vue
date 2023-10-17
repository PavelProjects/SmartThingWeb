<script>
    import DeviceInfoView from './view/DeviceInfoView.vue'
    import DeviceActionsView from './view/DeviceActionsView.vue'
    import SensorsView from './view/SensorsView.vue'
    import StatesView from './view/StatesView.vue'
    import TabsView from './tabs/TabsView.vue'
    import { h } from 'vue'

    export default {
        name: 'DeviceControlPanel',
        components: {
            DeviceInfoView,
            DeviceActionsView,
            SensorsView,
            StatesView,
            TabsView
        },
        props: {
            ip: String
        },
        data() {
            return {
                currentTab: null,
                tabs: {
                    "info": {
                        class: DeviceInfoView,
                        caption: "Information",
                        props: {ip: this.ip}
                    },
                    "actions": {
                        class: DeviceActionsView,
                        caption: "Actions",
                        props: {ip: this.ip}
                    },
                    "sensors": {
                        class: SensorsView,
                        caption: "Sensors",
                        props: {ip: this.ip}
                    },
                    "states": {
                        class: StatesView,
                        caption: "States",
                        props: {ip: this.ip}
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
    <div class="control-panel bordered">
        <TabsView
            :tabs="tabs"
            label="Tabs"
            default-tab="info"
        />
    </div>
</template>

<style>
    .control-panel {
        height: auto;
        width: auto;
    }
</style>