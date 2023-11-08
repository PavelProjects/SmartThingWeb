<script>
import TrashIcon from '../../icons/IconTrash.vue'

export default {
    name: 'GatewayItem',
    components: {
        TrashIcon
    },
    props: {
        gateway: Object,
        updateGateway: Function,
        deleteGateway: Function,
        generateToken: Function,
        showControlPanel: Function,
    }
}
</script>

<template>
    <div class="gateway-item">
        <div class="dot" :style="{background: gateway.online ? 'green' : 'red'}"></div>
        <h2>{{ gateway.name }}</h2>
        <h2>{{ gateway.description }}</h2>
        <div class="controls" @click="(event) => event.stopPropagation()">
            <button @click="() => generateToken(gateway)">token</button>
            <button @click="() => updateGateway(gateway)">update</button>
            <button @click="() => deleteGateway(gateway)" style="background-color: var(--color-danger);">delete</button>
        </div>
        <button @click="() => showControlPanel(gateway)">Control panel</button>
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
    .controls {
        display: flex;
        flex-direction: row;
        gap: var(--default-gap);
    }
    .controls button {
        flex: 1 1 auto;
    }
    .dot {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }
</style>