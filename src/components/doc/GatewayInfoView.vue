<script>
    import { GatewayApi } from '../../api/GatewayApi.js';
    import InputWithLabel from '../fields/InputWithLabel.vue';
    import LoadingButton from '../controls/LoadingButton.vue';

    export default {
        name: "GatewayInfoView",
        components: {
            InputWithLabel,
            LoadingButton
        },
        data() {
            return {
                cloudPopupVisible: false,
                statusIntervalId: null,
                gateway: {},
                user: {},
                cloudInfo: {},
                isConnected: false,
                loading: false,
            }
        },
        created() {
            this.loadCloudInfo()
            this.loadAuthorization()
        },
        async mounted() {
            this.isConnected = await GatewayApi.getConnectionStatus();
        },
        computed: {
            authorizedShortInfo() {
                if (!this.gateway || !this.user) {
                    return null;
                }
                return `${this.user.login}@${this.gateway.name}`
            }
        },
        methods: {
            async loadCloudInfo() {
                this.cloudInfo = await GatewayApi.getCloudInfo()
                this.isConnected = await GatewayApi.getConnectionStatus();
            },
            async loadAuthorization() {
                this.loading = true
                try {
                    this.parseAuthorizedUser(await GatewayApi.getCloudAuthorization())
                } finally {
                    this.loading = false
                }
            },
            async saveAuthorization() {
                this.loading = true
                try {
                    this.parseAuthorizedUser(await GatewayApi.cloudAuthorize("saveAuthorization", this.cloudInfo))
                } finally {
                    this.loading = false
                }
            },
            async connectToCloud() {
                if (this.isConnected) {
                    return;
                }
                this.loading = true
                try {
                    this.isConnected = await GatewayApi.cloudConnect("cloudConnect");
                } finally {
                    this.loading = false
                }
            },
            openCloudInfoEditor() {
                this.cloudPopupVisible = !this.cloudPopupVisible
            },
            parseAuthorizedUser(authorizedUser) {
                if (!authorizedUser || Object.keys(authorizedUser) === 0) {
                    this.gateway = null
                    this.user = null
                    return;
                }
                this.gateway = authorizedUser["gateway"]
                this.user = authorizedUser["user"]
            }
        }
    }
</script>

<template>
    <div>
        <h2 class="status title"
            @click="openCloudInfoEditor"
        >
            {{ authorizedShortInfo ? authorizedShortInfo : "Log in" }}
        </h2>
        <div v-if="cloudPopupVisible">
            <div class="overlay" @click="cloudPopupVisible = false"></div>
            <div class="cloud-popup">
                <div v-if="authorizedShortInfo">
                    <InputWithLabel
                        label="Connection status"
                        :value="isConnected ? 'Connected' : 'Connection lost'"
                        :disabled="true"
                    >
                        <LoadingButton
                            v-if="!isConnected"
                            :loading="loading"
                            @click="connectToCloud"
                        >
                            <h3>reconnect</h3>
                        </LoadingButton>
                    </InputWithLabel>
                    <InputWithLabel
                        label="User login"
                        :value="user.login"
                        :disabled="true"
                    />
                    <h2 class="title">Gateway</h2>
                    <InputWithLabel
                        label="Name"
                        :value="gateway.name"
                        :disabled="true"
                    />
                    <InputWithLabel
                        label="Description"
                        :value="gateway.description"
                        :disabled="true"
                    />
                </div>

                <h2 class="title">Cloud authorization info</h2>
                <InputWithLabel
                    label="Token"
                    :value="cloudInfo.token"
                    @input="cloudInfo.token = $event.target.value"
                />
                <InputWithLabel
                    label="Cloud ip"
                    :value="cloudInfo.cloudIp"
                    @input="cloudInfo.cloudIp = $event.target.value"
                />
                <InputWithLabel
                    label="Cloud port"
                    :value="cloudInfo.cloudPort"
                    @input="cloudInfo.cloudPort = $event.target.value"
                />
                <LoadingButton
                    :loading="loading"
                    @click="saveAuthorization"
                >
                    <h2>Authorize</h2>
                </LoadingButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .status {
        cursor: pointer;
        user-select: none;
    }
    .overlay {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: calc(100vh - var(--doc-height));
        background-color: var(--background-tilt);
    }
    .cloud-popup {
        position: absolute;
        top: calc(var(--doc-height) + var(--default-gap));
        right: var(--default-gap);
        width: 400px;
        display: flex;
        flex-direction: column;
        row-gap: var(--default-gap);
        text-align: center;
        background-color: var(--color-background-mute);
        border-radius: var(--border-radius);
        padding: 5px;
    }
</style>