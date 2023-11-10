<script>
    import {EventBus, REQUEST} from "../../utils/EventBus.js"
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
    
    export default {
        name: "LoadingButton",
        props: {
            loading: Boolean
        },
        components: {
            PulseLoader
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