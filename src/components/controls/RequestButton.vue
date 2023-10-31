<script>
    import {EventBus, REQUEST} from "../../EventBus.js"
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
    
    export default {
        name: "RequestButton",
        props: {
            requestId: String
        },
        components: {
            PulseLoader
        },
        data() {
            return {
                loading: false
            }
        },
        created() {
            if (this.requestId) {
                EventBus.on(REQUEST, this.onEvent)
            }
        },
        methods: {
            onEvent(payload) {
                const {id, loading} = payload || {}
                console.debug(`RequestButton event :: id=${id} loading=${loading}`)
                if (id === this.requestId) {
                    this.loading = loading
                }
            }
        }
    }
</script>

<template>
    <button>
        <slot v-if="!loading"></slot>
        <pulse-loader :loading="loading"></pulse-loader>
    </button>
</template>

<style scoped>
    button {
        min-width: 90px;
        min-height: 30px;
    }
</style>