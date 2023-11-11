<script>
import { CloudApi } from '../../api/CloudApi';
import { notify } from '../../utils/EventBus';
import LoadingButton from '../controls/LoadingButton.vue';
import InputWithLabel from '../fields/InputWithLabel.vue';
import Dialog from './Dialog.vue';

export default {
    name: "CloudAuthDialog",
    components: {
        InputWithLabel,
        LoadingButton,
        Dialog
    },
    data() {
        return {
            login: "",
            password: "",
            loading: false
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
            if (!this.login || !this.password) {
                notify({
                    type: "error",
                    caption: "Login and password are required!"
                })
                return
            }
            this.loading = true;
            try {
                const auth = await CloudApi.authUser(this.login, this.password);
                this.emitAuthorization(auth);
            } finally {
                this.loading = false
            }
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
        <LoadingButton
            :loading="loading"
            @click="auth"
        >
            Log in
        </LoadingButton>
    </Dialog>
</template>