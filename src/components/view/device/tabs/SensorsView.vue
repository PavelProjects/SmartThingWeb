<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../../../api/device/DeviceApi.js"
    import CallbacksView from './CallbacksView.vue'
    import TabsView from '../../../tabs/TabsView.vue'
    
    export default {
        name: "SensorsView",
        components: {
            SyncLoader,
            CallbacksView,
            TabsView
        },
        props: {
            ip: String,
            gateway: Object
        },
        data() {
            return {
                sensors: null,
                loading: false,
                tabs: {}
            }
        },
        created() {
            this.loadSensors()
        },
        methods: {
            async loadSensors() {
                this.loading = true
                try {
                    this.sensors = await DeviceApi.getDeviceSensors(this.ip, this.gateway)
                    Object.entries(this.sensors).forEach(([name, { type, value }]) => {
                        const caption = `${name} (${type}): ${value}`
                        if (this.tabs[name]) {
                            this.tabs[name].caption = caption
                        } else {
                            this.tabs[name] = {
                                class: CallbacksView,
                                caption,
                                props: {
                                    key: "sensor_" + name,
                                    ip: this.ip,
                                    observable: {
                                        name,
                                        type: "sensor"
                                    },
                                    gateway: this.gateway
                                }
                            };
                        }
                    });
                } finally {
                    this.loading = false
                }
            },
            async update() {
                await this.loadSensors()
            }
        }
    }
</script>

<template>
    <h1 class="title">Sensors values</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <TabsView
        :tabs="tabs"
        tabTitle="Click to open callbacks"
    />
</template>