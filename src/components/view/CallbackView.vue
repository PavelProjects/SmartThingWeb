<script>
    import { systemNameToNormal } from "../../utils/StringUtils.js"
    import InputWithLabel from "../fields/InputWithLabel.vue"
    import Combobox from "../fields/Combobox.vue"
    import { DeviceApi } from "../../api.js"
    import { NEW_CALLBACK_ID } from "./CallbacksView.vue"
    import { h } from "vue"
    
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
            Combobox
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
                    return
                }
                let res = false
                if (this.callback.id !== NEW_CALLBACK_ID) {
                    res = await DeviceApi.updateCallback(this.ip, this.observable, this.callback)
                    this.$emit("reloadCallback", this.callback)
                } else { 
                    res = await DeviceApi.createCallback(this.ip, this.observable, this.callback)
                    this.$emit("update")
                }

                if (res) {
                    console.info("Callback was saved")
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
                    const res = await DeviceApi.deleteCallback(this.ip, this.observable, this.callback.id)
                    if (res) {
                        console.info("Callback was deleted")
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
                            finalValue = Number.parseInt(value)
                            break
                        case "string":
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
                <button v-if="!editing" v-on:click="deleteCallback">Delete</button>
                <button v-if="editing" v-on:click="cancel">Cancel</button>

                <button v-if="!editing" v-on:click="editing = true">Edit</button>
                <button v-if="editing" v-on:click="saveCallback">Save</button>
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
                v-for="{key, value, render, required} in fieldsComponents"
                :is="render"
                :key="key"
                :label="systemNameToNormal(key)"
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