<script>
import { CloudApi } from '../../api/CloudApi';
import RequestButton from '../controls/RequestButton.vue';
import InputWithLabel from '../fields/InputWithLabel.vue';
import Dialog from './Dialog.vue';

export default {
    name: "CloudAuthDialog",
    components: {
        InputWithLabel,
        RequestButton,
        Dialog
    },
    data() {
        return {
            login: "test_user",
            password: "1",
        };
    },
    mounted() {
        this.getAuthorization();
    },
    methods: {
        async getAuthorization() {
            this.emitAuthorization(await CloudApi.getAuthorization());
        },
        async auth() {
            this.emitAuthorization(await CloudApi.authUser(this.login, this.password));
        },
        emitAuthorization(authorization) {
            this.$emit("authorized", authorization)
        }
    },
}
</script>

<template>
    <Dialog>
        <InputWithLabel
            label="Login"
            :value="login"
            @input="login = $event.target.value.trim()"
            type="login"
        />
        <InputWithLabel
            label="Password"
            :value="password"
            @input="password = $event.target.value.trim()"
            type="password"
        />
        <RequestButton
            @click="auth"
        >
            Log in
        </RequestButton>
    </Dialog>
</template>