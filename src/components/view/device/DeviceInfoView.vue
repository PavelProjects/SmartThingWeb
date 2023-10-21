<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../../api/DeviceApi.js"
    import InputWithLabel from "../../fields/InputWithLabel.vue"

    const NAME_ERROR = "Name can't be empty!"

    export default {
        name: "DeviceInfoView",
        components: {
            SyncLoader,
            InputWithLabel
        },
        props: {
            ip: String
        },
        data() {
            return {
                info: null,
                loading: false,
                deviceName: "",
                validName: true,
                NAME_ERROR // bruh
            }
        },
        created() {
            this.loadInfo()
        },
        watch: {
            deviceName(value) {
                this.validName = value.length != 0
            }
        },
        methods: {
            async loadInfo() {
                this.info = await DeviceApi.getDeviceInfo(this.ip)
                this.deviceName = this.info.name
            },
            async saveName() {
                if (!this.validName) {
                    console.error("Not valid name")
                    return
                }
                if (await DeviceApi.saveName(this.ip, this.deviceName)) {
                    this.loadInfo()
                }
            },
        }
    }
</script>

<template>
    <h1 class="title">Device information</h1>
    <sync-loader class="spinner" :loading="loading"></sync-loader>
    <div v-if="!loading && info" class="list">
        <InputWithLabel
            label="Device name"
            :title="validName ? '' : NAME_ERROR"
            :value="deviceName"
            :validationFailed="!validName"
            @input="deviceName = $event.target.value.trim()"
        >
            <button @click="saveName"><h3>save</h3></button>
        </InputWithLabel>
        <InputWithLabel
            label="Device type"
            :value="info.type"
            :disabled="true"
        />
        <InputWithLabel
            label="Firmware version"
            :value="info.version"
            :disabled="true"
        />
        <InputWithLabel
            label="Chip model"
            :value="info.chip_model"
            :disabled="true"
        />
        <InputWithLabel
            label="Chip revision"
            :value="info.chip_revision"
            :disabled="true"
        />
    </div>
</template>

<style scoped>
    h2 {
        text-align: center;
    }
</style>