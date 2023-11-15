<script>
import { DeviceApi } from '../../../../api/device/DeviceApi'
import InputWithLabel from '../../../fields/InputWithLabel.vue'
import TreeList from '../../../fields/TreeList.vue'

export default {
    name: "MetricsView",
    props: {
        ip: String,
        gateway: Object
    },
    components: {
        InputWithLabel,
        TreeList
    },
    data() {
        return {
            metrics: {}
        }
    },
    mounted() {
        this.update()
    },
    methods: {
        async update() {
            this.metrics = await DeviceApi.metrics(this.ip, this.gateway)
        },
    }
}
</script>

<template>
    <h1 class="title">Device metrics</h1>
   <div class="list">
        <TreeList
            :values="metrics"
        />
   </div> 
</template>