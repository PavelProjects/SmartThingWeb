<script>
export default {
    name: "Dialog",
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        clickOutside(event) {
            event.stopPropagation();
            this.$emit('close')
        },
        clickDialog(event) {
            event.stopPropagation();
        }
    }
}
</script>

<template>
    <div v-if="visible">
        <div class="overlay" @click="clickOutside"></div>
        <div class="dialog" @click="clickDialog">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .overlay {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: var(--background-tilt);
        z-index: 997;
    }
    .dialog {
        position: fixed;
        width: 450px;
        height: fit-content;
        left: calc(50% - 200px);
        top: calc(50% - 50px);
        z-index: 998;
        display: flex;
        flex-direction: column;
        border: solid 1px var(--color-border);
        border-radius: var(--border-radius);
        row-gap: var(--default-gap);
        background-color: var(--vt-c-black-mute);
        padding: 5px;
    }
</style>