<script>
    import { DeviceApi } from "../../api.js"
    import InputWithLabel from "../fields/InputWithLabel.vue"
   
    export default {
        name: "ConfigView",
        props: {
            ip: String
        },
        components: { 
            InputWithLabel 
        },
        data() {
            return {
                values: {},
                configInfo: {}
            };
        },
        created() {
            this.update();
        },
        computed: {
            inputs() {
                return Object.entries(this.configInfo).map(([key, {caption, type}]) => {
                    const value = this.values[key] || ""
                    return {key, caption, value, type}
                })
            }
        },
        methods: {
            async update() {
                await this.loadConfigInfo();
                this.loadConfigValues();
            },
            async loadConfigInfo() {
                this.configInfo = await DeviceApi.getDeviceConfigInfo(this.ip);
            },
            async loadConfigValues() {
                this.values = await DeviceApi.getConfig(this.ip);
            },
            async saveConfig() {
                await DeviceApi.saveConfigValues(this.ip, this.values)
                this.loadConfigValues()
            },
            async deleteAllValues() {
                if (confirm("Are you sure you want to delete all configuration values?")) {
                    await DeviceApi.deleteAllConfigValues(this.ip)
                    this.loadConfigValues()
                }
            },
            setValue(key, value) {
                if (!key) {
                    console.error("Key is missing")
                    return
                }
                let finalValue = value
                const type = this.configInfo[key]["type"]
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
                this.values[key] = finalValue
            }
        },
    }
</script>

<template>
    <h1>Configuration</h1>
    <div class="controls-holder"> 
        <button class="delete" @click="deleteAllValues"><h2>Delete all values</h2></button>
        <button @click="saveConfig"><h2>Save</h2></button>
    </div>
    <InputWithLabel
        v-for="{key, caption, value, type} in inputs"
        :key="key"
        :label="caption"
        :value="value"
        :type="type"
        @input="setValue(key, $event.target.value)"
        class="labeled-input"
    />
</template>

<style scoped>
    h1, h2 {
        text-align: center;
    }
    .controls-holder {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: var(--list-item-gap);
        width: 100%;
        margin-bottom: var(--list-item-gap);
    }
    .controls-holder button {
        width: 100%;
    }
    .delete {
        background-color: hsla(0, 100%, 37%, 0.2);
    }
    .labeled-input {
        margin-bottom: var(--list-item-gap)
    }
</style>