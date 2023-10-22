<script>
    import { systemNameToNormal } from "../../../utils/StringUtils.js"
    import InputWithLabel from "../../fields/InputWithLabel.vue"
    import Combobox from "../../fields/Combobox.vue"
    import { DeviceApi } from "../../../api/DeviceApi.js"
    import { NEW_CALLBACK_ID } from "./CallbacksView.vue"
    import { h } from "vue"
    import {EventBus, NOTIFY} from '../../../EventBus.js'
    import RequestButton from "../../controls/RequestButton.vue"

    const SYSTEM_FIELDS = ["id", "type", "readonly"]

    export default {
        name: "CallbackView",
        props: {
            ip: String,
            callback: Object,
            observable: Object,
            template: Array
        },
        components: {
            InputWithLabel,
            Combobox,
            RequestButton
        },
        data() {
            return {
                editing: this.callback.id == NEW_CALLBACK_ID,
                haveChanges: this.callback.id == NEW_CALLBACK_ID,
                validationFailed: []
            }
        },
        computed: {
            visibleFields() {
                return Object.entries(this.callback)
                    .filter(([key, _]) => !this.isDefaultField(key))
                    .reverse()
            },
            fieldsComponents() {
                return this.visibleFields.map(([field, value]) => {
                    const { required } = this.template[field] || false
                    return {
                        key: field, 
                        label: this.systemNameToNormal(field),
                        required,
                        value, 
                        render: this.getFieldComponent(field)
                    }
                })
            }
        },
        methods: {
            systemNameToNormal,
            isDefaultField(key) {
                return SYSTEM_FIELDS.includes(key)
            },
            isFieldDisabled(key) {
                if (!this.editing || this.isDefaultField(key)) {
                    return true
                }
                return !(key in this.template)
            },
            getFieldComponent(field) {
                if (this.template[field] && this.template[field]["values"]) {
                    return h(
                        Combobox,
                        {items: this.template[field]["values"]}
                    )
                }
                return h(InputWithLabel, {})
            },
            async saveCallback() {
                if (!this.haveChanges) {
                    console.error("No changes were made")
                    return
                }
                if (!this.validate()) {
                    console.error("Validation failed: " + this.validationFailed)
                    EventBus.emit(NOTIFY, {
                        caption: "Validation failed",
                        description: `This fields cannot be empty: ${this.validationFailed}`,
                        type: "error"
                    })
                    return
                }
                let res = false
                let emitAction = ""
                if (this.callback.id !== NEW_CALLBACK_ID) {
                    res = await DeviceApi.updateCallback(this.ip, this.observable, this.callback, "saveCallback")
                    emitAction = "reloadCallback"
                } else { 
                    res = await DeviceApi.createCallback(this.ip, this.observable, this.callback, "saveCallback")
                    emitAction = "update"
                }

                if (res) {
                    console.info("Callback was saved")
                    this.$emit(emitAction, this.callback)
                    this.editing = false
                    this.haveChanges = false
                }
            },
            async deleteCallback() {
                if (this.callback.id !== 0 && !this.callback.id) {
                    console.error("Callback id is missing")
                    return
                }
                if (confirm("Are you sure you wan to delete callback " + this.callback.id + "?")) {
                    if (await DeviceApi.deleteCallback(this.ip, this.observable, this.callback.id, "deleteCallback")) {
                        this.$emit("update")
                    }
                }
            },
            cancel() {
                this.validationFailed = []
                this.editing = false
                this.$emit('reloadCallback', this.callback)
            },
            validate() {
                this.validationFailed = []
                Object.entries(this.template).forEach(([key, {required}]) => {
                    if (required) {
                        const value = this.callback[key]
                        if (!value && value !== 0) {
                            this.validationFailed.push(key)
                        }
                    }
                })
                return this.validationFailed.length == 0
            },
            setValue(key, value) {
                if (!key) {
                    console.error("Key is missing")
                    return
                }
                let finalValue = value
                const type = this.template[key]["type"]
                if (type) {
                    switch(type) {
                        case "boolean":
                            finalValue = value == "true"
                            break
                        case "integer":
                        case "number":    
                            finalValue = Number.parseInt(value)
                            break
                        case "string":
                        case "text":    
                            finalValue = value
                        default:
                            console.error("Type " + type + " not supported yet")
                    }
                }
                this.callback[key] = finalValue
                this.haveChanges = true
            }
        }
    }
</script>

<template>
    <div class="bordered">
        <div class="callback-header">
            <h3>[{{callback.id}}] {{ callback.caption || systemNameToNormal(callback.type) }}</h3>
            <div v-if="!callback.readonly" class="callback-view-controls">
                <RequestButton 
                    v-if="!editing" 
                    v-on:click="deleteCallback"
                    requestId="deleteCallback"
                >
                    <h3>Delete</h3>
                </RequestButton>
                <RequestButton v-if="editing" v-on:click="cancel"><h3>Cancel</h3></RequestButton>

                <RequestButton v-if="!editing" v-on:click="editing = true"><h3>Edit</h3></RequestButton>
                <RequestButton 
                    v-if="editing" 
                    v-on:click="saveCallback"
                    requestId="saveCallback"
                >
                    <h3>Save</h3>
                </RequestButton>
            </div>
            <div v-else>
                <h3 style="text-align: center;">Readonly</h3>
            </div>
        </div>  
        <div>
            <InputWithLabel
                label="type"
                :value="callback.type"
                disabled=true
            />
            <component
                v-for="{key, label, value, render, required} in fieldsComponents"
                :is="render"
                :key="key"
                :label="label"
                :value="value"
                :notBlank="required"
                @input="setValue(key, $event.target.value)"
                :disabled="isFieldDisabled(key)"
                :validationFailed="validationFailed.includes(key)"
            />
        </div>
    </div>
</template>

<style scoped>
    .callback-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    .callback-view-controls {
        display: flex;
        flex-direction: row-reverse;
        column-gap: var(--list-item-gap);
        margin-bottom: 5px;
    }
</style>