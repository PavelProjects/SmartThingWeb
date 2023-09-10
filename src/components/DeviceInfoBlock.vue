<script>
    export default {
        name: 'DeviceInfoBlock',
        props: {
            deviceIp: String,
            deviceInfo: Object
        },
        methods: {
            openDeviceWebPage() {
                window.open("http://" + this.deviceIp, '_blank').focus();
            },
        },
    }
</script>

<template>
    <Transition name="slide-fade">
        <div class="box" v-if="deviceInfo && deviceInfo.name" v-on:click="$emit('selected')">
            <h1>Device <a v-on:click="$emit('selected')">{{ deviceInfo.name }}</a></h1>
            <ul v-for="[key, value] in Object.entries(deviceInfo)">
                <li>{{ key }} = {{ value }}</li>
            </ul>
        </div>
    </Transition>
</template>

<style>
    .slide-fade-enter-active {
        transition: all 0.5s ease-in;
    }
  
    .slide-fade-enter-from{
        transform: translateX(30px);
        opacity: 0;
    }
    
    .box {
        border: solid;
        border-color: rgb(70, 70, 70);
        border-radius: 10px;
        padding: 5px;
        transition: 0.5s;
    }
</style>