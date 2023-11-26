<script>
    import {EventBus, NOTIFY} from "../../utils/EventBus.js"
    import Notifification from "./Notifification.vue"

    export default {
        name: "NotificationsView",
        components: {
            Notifification
        },
        data() {
            return {
                notifications: {},
                idSequence: 0
            }
        },
        mounted() {
            EventBus.on(NOTIFY, this.addNotification)
        },
        methods: {
            getId() {
                this.idSequence++
                return this.idSequence
            },
            addNotification(payload) {
                const id = this.getId()
                this.notifications[id] = payload
            },
            closeNotification(id) {
                delete this.notifications[id]
            }
        }
    }
</script>

<template scoped>
    <div class="list panel">
        <Notifification
            v-for="[id, {gateway, device, notification}] in Object.entries(notifications)"
            :key="id"
            :id="id"
            :gateway="gateway"
            :device="device"
            :notification="notification"
            :autoClose="autoClose"
            @close="closeNotification"
        />
    </div>
</template>