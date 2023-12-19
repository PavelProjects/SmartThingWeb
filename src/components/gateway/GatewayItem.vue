<script>
import DeleteButton from '../controls/DeleteButton.vue'
import EditButton from '../controls/EditButton.vue'

export default {
    name: 'GatewayItem',
    props: {
        gateway: Object,
        updateGateway: Function,
        deleteGateway: Function,
        generateToken: Function,
        showControlPanel: Function,
    },
    components: {
        DeleteButton,
        EditButton,
    }
}
</script>

<template>
    <div class="gateway-item">
        <div 
            class="dot" 
            :style="{background: gateway.online ? 'green' : 'red'}"
            :title="gateway.online ? 'Online' : 'Offline'"
        ></div>
        <div class="header-actions">
            <EditButton
                :onClick="() => $emit('updateGateway')"
                title="Edit gateway"
            />
            <DeleteButton
                :onClick="() => $emit('deleteGateway')"
            />
        </div>
        <h2>{{ gateway.name }}</h2>
        <h2>{{ gateway.description }}</h2>
        <div class="footer-actions" @click="(event) => event.stopPropagation()">
            <button @click="() => $emit('generateToken')">Token</button>
            <button @click="() => $emit('logout')">Logout</button>
        </div>
        <button @click="() => $emit('showControlPanel')">Control panel</button>
    </div>
</template>

<style scoped>
    .gateway-item {
        text-align: center;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--default-gap);
    }
    .header-actions {
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        flex-direction: row;
    }
    .footer-actions {
        display: flex;
        flex-direction: row;
        gap: var(--default-gap);
    }
    .footer-actions button {
        width: 50%;
    }
    .dot {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }
</style>