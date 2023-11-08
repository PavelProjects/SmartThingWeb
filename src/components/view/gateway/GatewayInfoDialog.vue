<script>
import RequestButton from '../../controls/RequestButton.vue';
import Dialog from '../../dialogs/Dialog.vue'
import InputWithLabel from '../../fields/InputWithLabel.vue';

export default {
    name: 'GatewayInfoDialog',
    components: {
    Dialog,
    InputWithLabel,
    RequestButton,
    },
    props: {
        gateway: Object,
        save: Function
    },
    computed: {
        buttonTitle() {
            return this.gateway.id ? "Update" : "Create"
        }
    },
    methods: {
        handleSave() {
            this.save(this.gateway, {
                name: this.name || this.gateway.name,
                description: this.description
            })
        }
    }
}
</script>

<template>
    <Dialog>
        <InputWithLabel
            label="Name"
            :value="this.gateway.name"
            @input="(event) => name = event.target.value.trim()"
        />
        <InputWithLabel
            label="Description"
            :value="this.gateway.description"
            @input="(event) => description = event.target.value.trim()"
        />
        <RequestButton @click="handleSave">
            {{ buttonTitle }}
        </RequestButton>
    </Dialog>
</template>