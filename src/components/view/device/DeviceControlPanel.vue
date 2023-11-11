<script>
    import DeviceInfoView from './DeviceInfoView.vue'
    import ActionsView from './ActionsView.vue'
    import SensorsView from './SensorsView.vue'
    import StatesView from './StatesView.vue'
    import ConfigView from './ConfigView.vue'
    import TabsView from '../../tabs/TabsView.vue'
    import { h } from 'vue'

    export default {
        name: 'DeviceControlPanel',
        components: {
            DeviceInfoView,
            ActionsView,
            SensorsView,
            StatesView,
            ConfigView,
            TabsView
        },
        props: {
            ip: String,
            gateway: Object
        },
        data() {
            const props = {
                ip: this.ip,
                gateway: this.gateway
            }
            return {
                currentTab: null,
                tabs: {
                    "info": {
                        class: DeviceInfoView,
                        caption: "Information",
                        props
                    },
                    "actions": {
                        class: ActionsView,
                        caption: "Actions",
                        props
                    },
                    "sensors": {
                        class: SensorsView,
                        caption: "Sensors",
                        props
                    },
                    "states": {
                        class: StatesView,
                        caption: "States",
                        props
                    },
                    "config": {
                        class: ConfigView,
                        caption: "Configuration",
                        props
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
            default-tab="info"
        />
    </div>
</template>

<style>
    .control-panel {
        width: 1000px;
    }
</style>