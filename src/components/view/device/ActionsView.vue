<script>    
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../../api/device/DeviceApi.js"
    import LoadingButton from '../../controls/LoadingButton.vue'

    export default {
        name: "ActionsView",
        components: {
            LoadingButton,
            SyncLoader
        },
        props: {
            ip: String,
            gateway: Object
        },
        data() {
            return {
                actions: null,
                loading: false,
                loadingAction: false
            }
        },
        created() {
            this.loadActions()
        },
        methods: {
            async loadActions() {
                this.loading = true
                this.actions = await DeviceApi.getDeviceActionsInfo(this.ip, this.gateway)
                this.loading = false
            },
            async sendAction(action) {
                this.loadingAction = true
                try {
                    await DeviceApi.executeDeviceAcion(this.ip, action, this.gateway)
                } finally {
                    this.loadingAction = false
                }
            }
        }
    }
</script>

<template>
    <h1 class="title">Device actions</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div class="buttons-panel" v-if="actions">
        <div v-for="(caption, name) in actions" :key="name">
            <LoadingButton 
                :loading="loadingAction"
                @click="sendAction(name)"
            >
                <h1>{{ caption }}</h1>
            </LoadingButton>
        </div>
    </div>
    <div v-else-if="!loading">
        <h2>There is not device actions :(</h2>
    </div>
</template>

<style scoped>
    * {
        text-align: center;
    }
    .buttons-panel {
        display: grid;
        row-gap: 5px;
        padding: 5px;
    }
    .buttons-panel button{
        width: 100%;
        height: 100%;
    }
</style>