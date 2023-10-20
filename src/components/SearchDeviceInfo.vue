<script>
    export default {
        name: 'SearchDeviceInfo',
        props: {
            ip: String,
            deviceInfo: Object
        },
    }
</script>

<template>
    <div v-if="deviceInfo && deviceInfo.name">
        <h1>{{ deviceInfo.name }} {{ deviceInfo.type ? "(" + deviceInfo.type + ")" : '' }}</h1>
        <h2>Ip <a v-bind:href="'http://' + ip" target=”_blank”>{{ ip }}</a></h2>
    </div>
</template>