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
        <h1 class="green" style="margin-left: 25px">SmartThing</h1>
        <CloudInfoView class="cloud-info"/>
    </div>
</template>

<style scoped>
    .doc {
        width: auto;
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