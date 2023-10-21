<script>
    export const ERROR_TYPE = "error"
    export const INFO_TYPE = "info"
    export const SUCCESS_TYPE = "success"

    const LIFE_TIME = 5000

    export default {
        name: "Notification",
        props: {
            id: String,
            caption: String,
            description: String,
            type: {
                type: String,
                default: INFO_TYPE
            }
        },
        computed: {
            isInfo() {
                return this.type === INFO_TYPE
            },
            isError() {
                return this.type === ERROR_TYPE
            },
            isSuccess() {
                return this.type === SUCCESS_TYPE
            }
        },
        mounted() {
            setTimeout(this.close, LIFE_TIME)
        },
        methods: {
            close() {
                this.$emit('close', this.id)
            }
        }
    }
</script>

<template>
    <div class="notification" :class="{info: isInfo, error: isError, success: isSuccess}">
        <h2>{{ caption }}</h2>
        <h3>{{ description }}</h3>
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
        padding: 5px;
    }
    .notification button {
        background-color: transparent;
        position: absolute;
        top: 0px;
        right: 1px;
        outline: none;
        user-select: none;
    }
    .error {
      background-color: rgb(171, 12, 12);
      transition: 0.4s;
    }
    .info {
      background-color: rgb(0, 112, 122);
      transition: 0.4s;
    }
    .success {
      background-color: rgb(2, 147, 74);
      transition: 0.4s;
    }
</style>