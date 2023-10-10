<script>
    export default {
        name: 'DeviceInfoBlock',
        props: {
            ip: String,
            deviceInfo: Object,
            selected: Boolean
        },
    }
</script>

<template>
    <div :class="{box: true, bordered: true, selected: selected}" v-if="deviceInfo && deviceInfo.name">
        <h1>{{ deviceInfo.name }} ({{ deviceInfo.type }})</h1>
        <h2>Ip <a v-bind:href="'http://' + ip" target=”_blank”>{{ ip }}</a></h2>
    </div>
</template>

<style scoped>    
    .box {
        padding: 5px;
    }
    .selected {
        background-color: var(--vt-c-black-mute);
    }
</style>