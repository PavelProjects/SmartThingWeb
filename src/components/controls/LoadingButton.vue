<script>
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
    
    export default {
        name: "LoadingButton",
        props: {
            testId: String,
            loading: Boolean
        },
        components: {
            PulseLoader
        }
    }
</script>

<template>
    <button
        :id="testId"
        :disabled="loading"
        @click="handle"
        class="btn"
    >
        <slot v-if="!loading"></slot>
        <pulse-loader :loading="loading"></pulse-loader>
    </button>
</template>