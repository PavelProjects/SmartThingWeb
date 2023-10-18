<script>
    import { systemNameToNormal } from "../../utils/StringUtils.js"
    import CallbackView from './CallbackView.vue'
    import { DeviceApi } from "../../api.js"
    import Combobox from "../fields/Combobox.vue"

    export const NEW_CALLBACK_ID = "New"

    export default {
        name: "CallbacksView",
        components: {
            CallbackView,
            Combobox
        },
        props: {
            ip: String,
            observable: Object
        },
        data() {
            return {
                selectedTemplate: null,
                callbacks: [],
                templates: {}
            }
        },
        computed: {
            callbackTypes() {
                return Object.keys(this.templates)
                    .filter(key => key !== 'default')
                    .reduce((acc, key) => {
                        acc[key] = systemNameToNormal(key)
                        return acc
                    }, {})
            }
        },
        async created() {
            await this.loadTemplates()
            this.loadCallbacks()
        },
        methods: {
            update() {
                this.loadCallbacks()
            },
            async loadCallbacks() {                
                this.callbacks = await DeviceApi.getCallbacks(this.ip, this.observable)
            },
            async loadTemplates() {
                this.templates = await DeviceApi.getCallbacksTemplates(this.ip)
            },
            async reloadCallback(callback) {
                if (callback.id === NEW_CALLBACK_ID) {
                    this.callbacks.shift()
                } else {
                    const index = this.callbacks.indexOf(callback)
                    if (index >= 0) {
                        this.callbacks[index] = await DeviceApi.getCallbackById(this.ip, this.observable, callback.id)
                    }
                }
            },
            addCallback() {
                if (!this.selectedTemplate) {
                    return
                }
                if (this.callbacks[0].id == NEW_CALLBACK_ID) {
                    this.callbacks.shift()
                }
                const template = {...this.templates[this.selectedTemplate], ...this.templates["default"]}
                const callbackFromTemplate = Object.entries(template)
                    .reduce((acc, [key, info]) => {
                        acc[key] = info["default"] || ""
                        return acc
                    }, {id: NEW_CALLBACK_ID, type: this.selectedTemplate})
                this.callbacks.unshift(callbackFromTemplate)
            }
        }
    }
</script>

<template>
    <h1>Callbacks</h1>
    <div class="add-callback-view">
        <Combobox
            label="Type"
            :items="callbackTypes"
            @input="selectedTemplate = $event.target.value"
        />
        <button
            @click="addCallback"
            class="add-callback"
        >
            <h2>Add callback</h2>
        </button>
    </div>
    <div 
        v-if="callbacks"
        class="callbacks-list-view"
    >
        <CallbackView
            v-for="callback in callbacks"
            :ip="ip"
            :key="callback.id"
            :observable="observable"
            :callback="callback"
            :template="{...templates[callback.type], ...templates['default']}"
            @update="update"
            @reload-callback="reloadCallback"
        />
    </div>
</template>

<style scoped>
    h1 {
        text-align: center;
    }
    .callbacks-list-view {
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        row-gap: var(--list-item-gap);
        overflow-y: auto;
        margin-top: var(--list-item-gap);
    }
    .add-callback-view {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: var(--list-item-gap);
    }
    .add-callback-view * {
        width: 100%;
    }
</style>