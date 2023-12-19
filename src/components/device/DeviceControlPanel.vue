<script>
    import DeviceInfoView from './tabs/DeviceInfoView.vue'
    import ActionsView from './tabs/ActionsView.vue'
    import SensorsView from './tabs/SensorsView.vue'
    import StatesView from './tabs/StatesView.vue'
    import ConfigView from './tabs/ConfigView.vue'
    import { h } from 'vue'
    import MetricsViewVue from './tabs/MetricsView.vue'
    import MenuView from '../menu/MenuView.vue'

    export default {
        name: 'DeviceControlPanel',
        components: {
            DeviceInfoView,
            ActionsView,
            SensorsView,
            StatesView,
            ConfigView,
            MenuView
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
                    },
                    "metrics": {
                        class: MetricsViewVue,
                        caption: "Metrics",
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
    <div id="control-panel" class="bordered">
        <MenuView
            :tabs="tabs"
            default-tab="info"
        />
    </div>
</template>