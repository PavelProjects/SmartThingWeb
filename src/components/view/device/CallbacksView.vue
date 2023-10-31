<script>
    import { systemNameToNormal } from "../../../utils/StringUtils.js"
    import CallbackView from '../device/CallbackView.vue'
    import { DeviceApi } from "../../../api/DeviceApi.js"
    import Combobox from "../../fields/Combobox.vue"

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
                templates: {},
                selectedType: null
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
                this.callbacks = await DeviceApi.getCallbacks(this.ip, this.observable) || []
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
            addCallback(type) {
                if (this.callbacks && this.callbacks.length > 0 && this.callbacks[0].id == NEW_CALLBACK_ID) {
                    this.callbacks.shift()
                }
                if (!type) {
                    return
                }
                const template = {...this.templates[type], ...this.templates["default"]}
                const callbackFromTemplate = Object.entries(template)
                    .reduce((acc, [key, info]) => {
                        acc[key] = info["default"] || ""
                        return acc
                    }, {id: NEW_CALLBACK_ID, type})
                this.callbacks.unshift(callbackFromTemplate)
            }
        }
    }
</script>

<template>
    <h1 class="title">Callbacks</h1>
    <Combobox
        label="Add callback of type "
        :items="callbackTypes"
        @input="addCallback($event.target.value)"
    />
    <div 
        v-if="callbacks"
        class="callbacks-list-view list"
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
    .callbacks-list-view {
        max-height: 80vh;
        overflow-y: auto;
        margin-top: var(--list-item-gap);
    }
</style>