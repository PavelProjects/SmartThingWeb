<script>
    import GatewayInfoView from './GatewayInfoView.vue';
    import CloudAuthDialog from "../../dialogs/CloudAuthDialog.vue";

    export default {
        name: "Doc",
        components: {
            GatewayInfoView,
            CloudAuthDialog
        },
        props: {
            mode: String
        }
    }
</script>

<template>
    <div class="doc">
        <h1 class="green" style="flex: 1 1 auto;">SmartThing</h1>
        <GatewayInfoView v-if="mode == 'gateway'" class="log-in-info"/>
    </div>
</template>

<style scoped>
    .doc {
        width: auto;
        height: var(--doc-height);
        background-color: var(--color-background-mute);
        display: flex;
        flex-direction: row;
        padding-left: 15px;
        padding-right: 15px;
    }
    .log-in-info {
        margin-left: auto;
        margin-right: 10px;
    }
</style>