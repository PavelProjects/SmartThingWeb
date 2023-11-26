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
            addNotification(notification) {
                const id = this.getId()
                this.notifications[id] = notification
                /**
                 * todo
                 * refactore Notification view just pass notification object
                 * add device and gateway info display
                 * all device notifications - autoClosed = false
                 */
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
            v-for="[id, {caption, description, type, autoClose}] in Object.entries(notifications)"
            :key="id"
            :id="id"
            :caption="caption"
            :description="description"
            :type="type"
            :autoClose="autoClose"
            @close="closeNotification"
        />
    </div>
</template>