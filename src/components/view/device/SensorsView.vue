<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../../api/device/DeviceApi.js"
    import CallbacksView from './CallbacksView.vue'
    import TabsView from '../../tabs/TabsView.vue'
    
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
                loading: false
            }
        },
        created() {
            this.loadSensors()
        },
        computed: {
            tabs() {
                if (!this.sensors) {
                    return {}
                }
                return Object.entries(this.sensors).reduce(
                    (acc, [name, { type, value }]) => {
                        acc[name] = {
                            class: CallbacksView,
                            caption:`${name} (${type}): ${value}`,
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
                        return acc;
                    }, {})
            }
        },
        methods: {
            async loadSensors() {
                this.sensors = await DeviceApi.getDeviceSensors(this.ip, this.gateway)
            },
            async update() {
                await this.loadSensors()
            }
        }
    }
</script>

<template>
    <h1 class="title">Sensors values</h1>
    <sync-loader class="spinner" :loading="loading"></sync-loader>
    <TabsView
        :tabs="tabs"
        tabTitle="Click to open callbacks"
    />
</template>

<style scoped>
    .spinner {
        text-align: center;
    }
</style>