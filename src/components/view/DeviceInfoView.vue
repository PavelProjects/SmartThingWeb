<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../api.js"

    export default {
        name: "DeviceInfoView",
        components: {
            SyncLoader
        },
        props: {
            ip: String
        },
        data() {
            return {
                info: null,
                loading: false
            }
        },
        created() {
            this.loadInfo()
        },
        methods: {
            async loadInfo() {
                this.info = await DeviceApi.getDeviceInfo(this.ip)
            }
        }
    }
</script>

<template>
    <h1>Device information</h1>
    <sync-loader class="spinner" :loading="loading"></sync-loader>
    <div v-if="!loading && info" class="info-block">
        <!-- todo add change name implementation -->
        <h2>Device name</h2><input :value="info.name" disabled="true"/> 
        <h2>Device type</h2><input :value="info.type" disabled="true"/>
        <h2>Firmware version</h2><input :value="info.version" disabled="true"/>
        <h2>Chip model</h2><input :value="info.chip_model" disabled="true"/>
        <h2>Chip revision</h2><input :value="info.chip_revision" disabled="true"/>
    </div>
</template>

<style scoped>
    h1, h2 {
        text-align: center;
    }
    .spinner {
        text-align: center;
    }
    .info-block {
        display: grid;
    }
    .info-block p {
        grid-column: 1;
    }
    .info-block input {
        grid-column: 2;
        background-color: transparent;
        color: grey;
        margin: var(--list-item-gap);
        border-radius: 10px;
    }
</style>