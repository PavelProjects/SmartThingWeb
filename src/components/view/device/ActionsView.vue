<script>    
    import { DeviceApi } from "../../../api/device/DeviceApi.js"
    import LoadingButton from '../../controls/LoadingButton.vue'

    export default {
        name: "ActionsView",
        components: {
            LoadingButton
        },
        props: {
            ip: String,
            gateway: Object
        },
        data() {
            return {
                actions: null,
                loading: false
            }
        },
        created() {
            this.loadActions()
        },
        methods: {
            async loadActions() {
                this.actions = await DeviceApi.getDeviceActionsInfo(this.ip, this.gateway)
            },
            async sendAction(action) {
                this.loading = true
                try {
                    await DeviceApi.executeDeviceAcion(this.ip, action, this.gateway)
                } finally {
                    this.loading = false
                }
            }
        }
    }
</script>

<template>
    <h1 class="title">Device actions</h1>
    <div class="buttons-panel" v-if="actions">
        <div v-for="(caption, name) in actions" :key="name">
            <LoadingButton 
                :loading="loading"
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