<script>
    const INFO_URL = "/info"
    const ACTIONS_URL = INFO_URL + "/actions"

    export default {
        name: 'DeviceControlPanel',
        props: {
            deviceIp: String,
            deviceInfo: Object
        },
        data() {
            return {
                baseUrl: "http://" + this.deviceIp,
                actions: null
            }
        },
        created() {
            if (this.deviceIp) {
                this.loadActions();
            } else {
                console.error("Device ip is missing!");
            }
        },
        methods: {
            async loadActions() {
                this.actions = await (await fetch(this.baseUrl + ACTIONS_URL)).json()
            },
            async sendAction(action) {
                const url = this.baseUrl + "/action?action=" + action
                await fetch(url, {
                    method: "PUT"
                })
            }
        }
    }
</script>

<template>
    <div>
        <h1>{{deviceInfo.name}}</h1>
        <h1>{{deviceIp}}</h1>
        
        <div class="buttons-panel">
            <h1>Actions</h1>
            <div v-if="actions" v-for="(caption, name) in actions">
                <button @click="sendAction(name)">
                    <h1>{{ caption }}</h1>
                </button>
            </div>
        </div>
    </div>
</template>

<style>
    .buttons-panel {
        display: grid;
        row-gap: 5px;
        width: 50%;
        text-align: center;
        border: solid;
        border-color: rgb(70, 70, 70);
        border-radius: 10px;
        padding: 5px;
    }
    .buttons-panel button{
        width: 100%;
        height: 100%;
    }
</style>