<script>
    import CallbackView from './CallbackView.vue'
    import { DeviceApi } from "../../api.js"

    export default {
        name: "CallbacksView",
        components: {
            CallbackView
        },
        props: {
            ip: String,
            observable: Object
        },
        data() {
            return {
                callbacks: [],
                templates: {}
            }
        },
        async created() {
            await this.loadTemplates()
            this.loadCallbacks()
        },
        methods: {
            async loadCallbacks() {                
                this.callbacks = await DeviceApi.getCallbacks(this.ip, this.observable.type, this.observable.name)
            },
            async loadTemplates() {
                this.templates = await DeviceApi.getCallbacksTemplates(this.ip)
            },
            update() {
                this.loadCallbacks()
            },
            async saveCallback(callback) {
                if (!callback) {
                    console.error("Callback object missing")
                }
                const res = await DeviceApi.updateCallback(this.ip, this.observable, callback)
                if (res) {
                    this.reloadCallback(callback)
                }
            },
            async reloadCallback(callback) {
                const index = this.callbacks.indexOf(callback)
                if (index >= 0) {
                    this.callbacks[index] = await DeviceApi.getCallbackById(this.ip, this.observable.type, this.observable.name, callback.id)
                }
            }
        }
    }
</script>

<template>
    <h1>Callbacks</h1>
    <div v-if="callbacks" class="callbacks-list-view">
        <CallbackView
            v-for="callback in callbacks"
            :ip="ip"
            :key="callback.id"
            :observable="observable"
            :callback="callback"
            :templates="templates"
            @save-callback="saveCallback"
        />
    </div>
</template>

<style>
    h1 {
        text-align: center;
    }
    .callbacks-list-view {
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        row-gap: var(--list-item-gap);
        overflow-y: auto;
    }
</style>