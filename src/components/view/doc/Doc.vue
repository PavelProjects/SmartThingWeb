<script>
    import CloudInfoView from './CloudInfoView.vue';

    export default {
        name: "Doc",
        components: {
            CloudInfoView
        }
    }
</script>

<template>
    <div class="doc">
        <h1 class="green">SmartThing</h1>
        <CloudInfoView class="cloud-info"/>
    </div>
</template>

<style scoped>
    .doc {
        width: 100%;
        height: var(--doc-height);
        background-color: var(--color-background-mute);
        display: flex;
        flex-direction: row;
    }
    .cloud-info {
        margin-left: auto;
        margin-right: 10px;
    }
</style>