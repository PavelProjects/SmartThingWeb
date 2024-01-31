<script>
    import DeviceInfoView from './tabs/DeviceInfoView.vue'
    import ActionsView from './tabs/ActionsView.vue'
    import SensorsView from './tabs/SensorsView.vue'
    import StatesView from './tabs/StatesView.vue'
    import ConfigView from './tabs/ConfigView.vue'
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
            device: Object,
            gateway: Object
        },
        data() {
            const props = {
                device: this.device,
                gateway: this.gateway
            }
            return {
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
    }
</script>

<template>
    <MenuView
        id="control-panel"
        class="bordered"
        :tabs="tabs"
        default-tab="info"
    />
</template>