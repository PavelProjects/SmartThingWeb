<script>
    import { DeviceApi } from "../../../api/device/DeviceApi.js"
    import InputWithLabel from "../../fields/InputWithLabel.vue"
    import LoadingButton from "../../controls/LoadingButton.vue";
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

    export default {
        name: "ConfigView",
        props: {
            ip: String,
            gateway: Object
        },
        components: { 
            InputWithLabel,
            LoadingButton,
            SyncLoader,
        },
        data() {
            return {
                values: {},
                configInfo: {},
                loading: false,
                saveLoading: false,
                deleteLoading: false
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
                this.loading = true
                try {
                    await this.loadConfigInfo();
                    await this.loadConfigValues();
                } finally {
                    this.loading = false
                }
            },
            async loadConfigInfo() {
                this.configInfo = await DeviceApi.getDeviceConfigInfo(this.ip, this.gateway);
            },
            async loadConfigValues() {
                this.values = await DeviceApi.getConfig(this.ip, this.gateway);
            },
            async saveConfig() {
                this.saveLoading = true
                try {
                    if (await DeviceApi.saveConfigValues(this.ip, this.values, this.gateway)) {
                        this.loadConfigValues()
                    }
                } finally {
                    this.saveLoading = false
                }
            },
            async deleteAllValues() {
                if (confirm("Are you sure you want to delete all configuration values?")) {
                    this.deleteLoading = true
                    try {
                        if (await DeviceApi.deleteAllConfigValues(this.ip, this.gateway)) {
                            this.loadConfigValues()
                        }
                    } finally {
                        this.deleteLoading = false
                    }
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
    <h1 class="title">Configuration</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div class="config-inputs list">
        <InputWithLabel
            v-for="{key, caption, value, type} in inputs"
            :key="key"
            :label="caption"
            :value="value"
            :type="type"
            @input="setValue(key, $event.target.value)"
        />
        <div class="controls-holder">
            <LoadingButton
                class="delete"
                :loading="deleteLoading"
                @click="deleteAllValues"
            >
                <h2>Delete all values</h2>
            </LoadingButton>
            <LoadingButton
                :loading="saveLoading"
                @click="saveConfig"
            >
                <h2>Save</h2>
            </LoadingButton>
        </div>
    </div>
</template>

<style scoped>
    h2 {
        text-align: center;
    }
    .controls-holder {
        position: absolute;
        bottom: 0px;
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: var(--default-gap);
    }
    .controls-holder button {
        width: 50%;
    }
    .config-inputs {
        padding-bottom: calc(40px + var(--default-gap));
    }
    .delete {
        background-color: var(--color-danger);
    }
</style>