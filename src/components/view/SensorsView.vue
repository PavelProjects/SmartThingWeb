<script>
    import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
    import { DeviceApi } from "../../api.js"
    
    export default {
        name: "SensorsView",
        components: {
            SyncLoader
        },
        props: {
            ip: String
        },
        data() {
            return {
                sensors: null,
                loading: false
            }
        },
        created() {
            this.loadSensors()
        },
        methods: {
            async loadSensors() {
                this.sensors = await DeviceApi.getDeviceSensors(this.ip)
            }
        }
    }
</script>

<template>
    <h1>Sensors values</h1>
    <sync-loader class="spinner" :loading="loading"></sync-loader>
    <div v-if="!loading && sensors">
        <h2
            v-for="[name, {type, value}] in Object.entries(this.sensors)"
            :key="name"
            class="bordered"
        >
            {{ name }} ({{ type }}): {{  value }}
        </h2>
    </div>
</template>

<style scoped>
    h1 {
        text-align: center;
    }
    .spinner {
        text-align: center;
    }
    h2 {
        margin-bottom: var(--list-item-gap);
    }
</style>