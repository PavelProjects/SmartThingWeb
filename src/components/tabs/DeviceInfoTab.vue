<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

    const INFO_URL = "/info/system";

    export default {
        name: "DeviceInfoTab",
        components: {
            SyncLoader
        },
        props: {
            ip: String
        },  
        data() {
            return {
                info: null,
                loading: false,
                baseUrl: "http://" + this.ip
            }
        },
        created() {
            this.loadInfo()
        },
        methods: {
            async loadInfo() {
                this.loading = true
                try {
                    const response = await fetch(this.baseUrl + INFO_URL)
                    if (response.status == 200) {
                        this.info = await response.json()
                    } else {
                        console.error("Failed to load device info")
                    }
                } finally {
                    this.loading = false
                }
            }
        }
    }
</script>

<template>
    <h1>Device information</h1>
    <sync-loader :loading="loading"></sync-loader>
    <div v-if="!loading && info" class="info-block">
        <!-- todo add change name implementation -->
        <p>Device name</p><input :value="info.name" disabled="true"/> 
        <p>Device type</p><input :value="info.type" disabled="true"/>
        <p>Firmware version</p><input :value="info.version" disabled="true"/>
        <p>Chip model</p><input :value="info.chip_model" disabled="true"/>
        <p>Chip revision</p><input :value="info.chip_revision" disabled="true"/>
    </div>
</template>

<style scoped>
    h1 {
        text-align: center;
    }
    .info-block {
        display: grid;
    }
    .info-block p {
        grid-column: 1;
        text-align: center;
    }
    .info-block input {
        grid-column: 2;
        background-color: transparent;
        color: grey;
        margin: 5px;
        border-radius: 10px;
    }
</style>