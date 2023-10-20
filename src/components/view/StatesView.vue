<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import TabsView from '../tabs/TabsView.vue'
    import CallbacksView from './CallbacksView.vue'
    import { DeviceApi } from "../../api.js"
   
    export default {
        name: "StatesView",
        components: {
            SyncLoader,
            TabsView,
            CallbacksView
        },
        props: {
            ip: String
        },
        data() {
            return {
                states: null,
                loading: false
            }
        },
        created() {
            this.loadStates()
        },
        computed: {
            tabs() {
                if (!this.states) {
                    return {}
                }
                return Object.entries(this.states).reduce(
                    (acc, [name, value]) => {
                        acc[name] = {
                            class: CallbacksView,
                            caption:`${name}: ${value}`,
                            props: {
                                key: "state_" + name,
                                ip: this.ip,
                                observable: {
                                    name,
                                    type: "state"
                                }
                            }
                        };
                        return acc;
                    }, {})
            }
        },
        methods: {
            async loadStates() {
                this.states = await DeviceApi.getDeviceStates(this.ip)
            },
            update() {
                this.loadStates()
            }
        }
    }
</script>

<template>
    <h1>Device states</h1>
    <sync-loader class="spinner" :loading="loading"></sync-loader>
    <TabsView
        :tabs="tabs"
        tabTitle="Click to open callbacks"
    />
</template>

<style scoped>
    h1 {
        text-align: center;
    }
    .spinner {
        text-align: center;
    }
</style>