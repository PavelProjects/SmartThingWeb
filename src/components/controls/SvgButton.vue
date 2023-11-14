<script>
import MoonLoader from 'vue-spinner/src/MoonLoader.vue';

export default {
    name: "SvgButton",
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        onClick: {
            type: Function,
            default: () => {}
        }
    },
    components: {
        MoonLoader
    },
    methods: {
        handleClick() {
            if (this.loading || !this.onClick) {
                return;
            }
            this.onClick()
        }
    }
}
</script>

<template>
    <div class="svg-button" @click.prevent="handleClick">
        <moon-loader :loading="loading" size="25px"/>
        <slot v-if="!loading"></slot>
    </div>
</template>

<style>
    .svg-button {
        width: var(--icon-size);
        height: var(--icon-size);
    }
    .svg-button:hover {
        cursor: pointer;
    }
    .svg-button svg {
        width: var(--icon-size);
        height: var(--icon-size);
    }
    .svg-button path {
        fill: var(--vt-c-svg-fill);
    }
</style>