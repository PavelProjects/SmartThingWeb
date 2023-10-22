<script>    
    import { DeviceApi } from "../../../api/DeviceApi.js"
    import RequestButton from '../../controls/RequestButton.vue'

    export default {
        name: "ActionsView",
        components: {
            RequestButton
        },
        props: {
            ip: String
        },
        data() {
            return {
                actions: null
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
                await DeviceApi.executeDeviceAcion(this.ip, action, "execute_" + action)
            }
        }
    }
</script>

<template>
    <h1 class="title">Device actions</h1>
    <div class="buttons-panel" v-if="actions">
        <div v-for="(caption, name) in actions" :key="name">
            <RequestButton 
                :requestId="'execute_' + name"
                @click="sendAction(name)"
            >
                <h1>{{ caption }}</h1>
            </RequestButton>
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