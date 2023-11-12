<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import TabsView from '../../tabs/TabsView.vue'
    import CallbacksView from './CallbacksView.vue'
    import { DeviceApi } from "../../../api/device/DeviceApi.js"
   
    export default {
        name: "StatesView",
        components: {
            SyncLoader,
            TabsView,
            CallbacksView
        },
        props: {
            ip: String,
            gateway: Object
        },
        data() {
            return {
                states: null,
                loading: false,
                tabs: {}
            }
        },
        created() {
            this.loadStates()
        },
        methods: {
            async loadStates() {
                this.loading = true
                try {
                    this.states = await DeviceApi.getDeviceStates(this.ip, this.gateway) || {}
                    Object.entries(this.states).forEach(([name, value]) => {
                        if (this.tabs[name]) {
                            this.tabs[name].caption = `${name}: ${value}`
                        } else {
                            this.tabs[name] = {
                                class: CallbacksView,
                                caption:`${name}: ${value}`,
                                props: {
                                    key: "state_" + name,
                                    ip: this.ip,
                                    observable: {
                                        name,
                                        type: "state"
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
                await this.loadStates()
            }
        }
    }
</script>

<template>
    <h1 class="title">Device states</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <TabsView
        :tabs="tabs"
        tabTitle="Click to open callbacks"
    />
</template>