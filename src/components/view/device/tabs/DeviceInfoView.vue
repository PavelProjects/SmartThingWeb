<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../../../api/device/DeviceApi.js"
    import InputWithLabel from "../../../fields/InputWithLabel.vue"
    import LoadingButton from '../../../controls/LoadingButton.vue'

    const NAME_ERROR = "Name can't be empty!"

    export default {
        name: "DeviceInfoView",
        components: {
            SyncLoader,
            InputWithLabel,
            LoadingButton
        },
        props: {
            ip: String,
            gateway: Object
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
            async update() {
                await this.loadInfo()
            },
            async loadInfo() {
                this.info = await DeviceApi.getDeviceInfo(this.ip, this.gateway) || {}
                this.deviceName = this.info["name"] || ""
            },
            async saveName() {
                if (!this.validName) {
                    console.error("Not valid name")
                    return
                }
                this.loading = true
                try {
                    if (await DeviceApi.saveName(this.ip, this.deviceName, this.gateway)) {
                        this.loadInfo()
                    }
                } finally {
                    this.loading = false
                }
            },
        }
    }
</script>

<template>
    <h1 class="title">Device information</h1>
    <div v-if="info" class="list">
        <InputWithLabel
            label="Device name"
            :title="validName ? '' : NAME_ERROR"
            :value="deviceName"
            :validationFailed="!validName"
            @input="deviceName = $event.target.value.trim()"
        >
            <LoadingButton
                :loading="loading"
                @click="saveName"
            >
                <h3>save</h3>
            </LoadingButton>
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
    <sync-loader v-else class="loading-spinner" :loading="true"></sync-loader>
</template>