<script>
    import GatewayInfoView from './GatewayInfoView.vue';
    import CloudAuthDialog from "../dialogs/CloudAuthDialog.vue";

    export default {
        name: "Doc",
        components: {
            GatewayInfoView,
            CloudAuthDialog,
        },
        data() {
            const mode = import.meta.env.VITE_MODE
            return {
                mode,
                openMenu: false,
            }
        },
    }
</script>

<template>
    <div class="doc">
        <router-link to="/">
            <h1 class="green">SmartThing</h1>
        </router-link>
        <router-link to="/logs">
            <h2>Devices logs</h2>
        </router-link>
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
        align-items: center;
    }
    .log-in-info {
        margin-left: auto;
        margin-right: 10px;
    }
</style>