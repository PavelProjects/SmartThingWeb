<script>
import { DeviceApi } from '../../api.js'
    import { systemNameToNormal } from "../../utils/StringUtils.js"
    
    const SYSTEM_FIELDS = ["id", "type", "readonly"]

    export default {
        name: "CallbackView",
        props: {
            ip: String,
            callback: Object,
            observable: Object,
            templates: Array
        },
        data() {
            return {
                editing: false,
                defaultTemplate: this.templates["default"] || {},
                validationFailed: []
            }
        },
        computed: {
            fields() {
                return Object.entries(this.callback)
                    .filter(([key, _]) => !this.isDefaultField(key))
                    .reverse()
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
                const template = this.templates[this.callback.type || ""]
                return !(key in template)
            },
            saveCallback() {
                if (this.validate) {
                    this.$emit("saveCallback", this.callback)
                    this.editing = false
                } else {
                    console.error("Validation failed: " + this.validationFailed)
                }
            },
            validate() {
                this.validationFailed = []
                const template = this.templates[this.callback.type]
                if (!template) {
                    console.error("Template missing for type " + this.callback.type)
                    return false
                }

                Object.entries(template).forEach(([key, {required}]) => {
                    if (required) {
                        const value = this.callback[key]
                        if (!(value || value === 0)) {
                            this.validationFailed.push(key)
                        }
                    }
                })
                return this.validationFailed.length == 0
            }
        }
    }
</script>

<template>
    <div class="bordered">
        <div class="callback-header">
            <h3>[{{callback.id}}] {{ callback.caption || systemNameToNormal(callback.type) }}</h3>
            <div v-if="!callback.readonly" class="callback-view-controls">
                <button>Delete</button>
                <button v-if="!editing" v-on:click="editing = true">Edit</button>
                <button v-if="editing" v-on:click="saveCallback">Save</button>
            </div>
            <div v-else>
                <h3 style="text-align: center;">Readonly</h3>
            </div>
        </div>
        <div>
            <div class="callback-entry">
                <h2>type</h2>
                <input key="type" :value="callback.type" disabled="true" class="legit"/>
            </div>
            <div v-for="[key, value] in fields" :key="key" class="callback-entry">
                <h2>{{ systemNameToNormal(key) }}</h2>
                <input 
                    :ref="key" 
                    :value="value"
                    @input="callback[key] = $event.target.value"
                    :disabled="isFieldDisabled(key)"
                    :class="{legit:true, required: validationFailed.includes(key)}"
                />
            </div>
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
    .callback-entry {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    .callback-entry h2 {
        text-align: center;
    }
    .callback-entry input {
        border-radius: 10px;
        color: var(--color-text);
    }
    .legit {
        background-color: transparent;
    }
    .required {
        background-color: red;
    }
</style>