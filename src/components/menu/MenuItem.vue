<script>
    export default {
        name: 'MenuItem',
        props: {
            selected: Boolean
        },
    }
</script>

<template>
    <div :class="{bordered: true, 'menu-selected': selected}">
        <slot></slot>
    </div>
</template>

<style>
    .tab {
        transition: 0.5s;
        cursor: pointer;
    }
</style>