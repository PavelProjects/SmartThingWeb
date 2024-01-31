<script>
    import GatewayInfoView from './GatewayInfoView.vue';
    import CloudAuthDialog from "../dialogs/CloudAuthDialog.vue";
    import Menu from 'vue-material-design-icons/Menu.vue'
    import SvgButton from '../controls/SvgButton.vue';

    export default {
        name: "Doc",
        components: {
            GatewayInfoView,
            CloudAuthDialog,
            SvgButton,
            Menu,
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
        <SvgButton :onClick="() => openMenu = !openMenu">
            <Menu />
        </SvgButton>
        <div v-if="openMenu" class="menu bordered">
            <router-link to="/">
                <h2>Home</h2>
            </router-link>
            <router-link v-if="mode === 'gateway'" to="/devices/settings">
                <h2>Devices settings</h2>
            </router-link>
            <router-link v-if="mode === 'gateway'" to="/devices/logs">
                <h2>Devices logs</h2>
            </router-link>
        </div>

        <router-link to="/">
            <h1 class="green">SmartThing</h1>
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
        column-gap: var(--default-gap);
        padding-left: 15px;
        padding-right: 15px;
        align-items: center;
    }
    .menu {
        position: absolute;
        top: calc(var(--doc-height) + var(--default-gap));
        left: var(--default-gap);
        background-color: var(--color-background-mute);
        border-radius: var(--border-radius);
        text-align: center;
    }
    .log-in-info {
        margin-left: auto;
        margin-right: 10px;
    }
</style>