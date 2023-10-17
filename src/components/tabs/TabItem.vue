<script>
    export default {
        name: 'TabItem',
        props: {
            selected: Boolean
        },
    }
</script>

<template>
    <div :class="{tab: true, bordered: true, selected: selected}">
        <slot></slot>
    </div>
</template>

<style>
    .tab {
        transition: 0.5s;
        cursor: pointer;
    }
    .selected {
        background-color: var(--vt-c-black-mute);
    }
</style>