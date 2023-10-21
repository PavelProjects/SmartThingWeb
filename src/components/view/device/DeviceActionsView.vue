<script>    
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../../api/DeviceApi.js"
    import {EventBus, NOTIFY} from '../../../EventBus.js'

    export default {
        name: "DeviceActionsView",
        components: {
            SyncLoader
        },
        props: {
            ip: String
        },
        data() {
            return {
                loading: false,
                actions: null,
                baseUrl: "http://" + this.ip
            }
        },
        created() {
            this.loadActions()
        },
        methods: {
            async loadActions() {
                this.actions = await DeviceApi.getDeviceActionsInfo(this.ip)
            },
            async sendAction(action) {
                await DeviceApi.executeDeviceAcion(this.ip, action)
            }
        }
    }
</script>

<template>
    <h1 class="title">Device actions</h1>
    <sync-loader :loading="loading"></sync-loader>
    <div class="buttons-panel" v-if="actions">
        <div v-for="(caption, name) in actions" :key="name">
            <button @click="sendAction(name)">
                <h1>{{ caption }}</h1>
            </button>
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