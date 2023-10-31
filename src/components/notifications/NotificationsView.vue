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
            v-for="[id, {caption, description, type}] in Object.entries(notifications)"
            :key="id"
            :id="id"
            :caption="caption"
            :description="description"
            :type="type"
            @close="closeNotification"
        />
    </div>
</template>