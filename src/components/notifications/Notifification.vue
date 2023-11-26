<script>
    export const WARNING_TYPE = "warning"
    export const ERROR_TYPE = "error"
    export const INFO_TYPE = "info"
    export const SUCCESS_TYPE = "success"

    const LIFE_TIME = 5000

    export default {
        name: "Notification",
        props: {
            id: String,
            notification: Object,
            device: Object,
            gateway: Object
        },
        computed: {
            color() {
                switch(this.notification.type) {
                    case ERROR_TYPE:
                        return "rgb(171, 12, 12)"
                    case SUCCESS_TYPE:
                        return "rgb(2, 147, 74)"
                    case WARNING_TYPE:
                        return "rgb(147, 106, 2)"
                    default:
                        return "rgb(0, 112, 122)"
                }
            },
            from() {
                let txt = '';
                if (this.gateway) {
                    txt = this.gateway.name + "@"
                }
                if (this.device) {
                    txt += this.device.name
                }
                return txt
            }
        },
        created() {
            if (this.notification.autoClose) {
                setTimeout(this.close, LIFE_TIME)
            }
        },
        methods: {
            close() {
                this.$emit('close', this.id)
            }
        }
    }
</script>

<template>
    <div class="notification" :style="{backgroundColor: color}">
        <div v-if="from">From: {{ from }}</div>
        <h2>{{ notification.caption }}</h2>
        <div style="word-wrap: break-word;">{{ notification.description }}</div>
        <button @click="close">X</button>
    </div>
</template>

<style scoped>
    .notification {
        position: relative;
        background-color: var(--color-background-mute);
        border-radius: var(--border-radius);
        width: var(--notification-width);
        min-height: var(--notification-min-height);
        padding: 10px 5px 5px 5px;
        z-index: 1000;
        transition: 0.4s;
    }
    .notification button {
        background-color: transparent;
        position: absolute;
        top: 0px;
        right: 0px;
        outline: none;
        user-select: none;
    }
    .notification h2, h3 {
        text-align: center;
    }
</style>