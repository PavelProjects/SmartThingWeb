<script>
    import { GatewayApi } from '../../../api/GatewayApi.js';
    import { AuthorizationApi } from '../../../api/AuthorizationApi';
    import InputWithLabel from '../../fields/InputWithLabel.vue';
    import RequestButton from '../../controls/RequestButton.vue';

    export default {
        name: "CloudInfoView",
        components: {
            InputWithLabel,
            RequestButton
        },
        data() {
            return {
                cloudPopupVisible: false,
                statusIntervalId: null,
                gateway: {},
                user: {},
                cloudInfo: {},
                isConnected: false,
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
                this.parseAuthorizedUser(await AuthorizationApi.getCloudAuthorization())
            },
            async saveAuthorization() {
                this.parseAuthorizedUser(await AuthorizationApi.cloudAuthorize("saveAuthorization", this.cloudInfo))
            },
            async connectToCloud() {
                if (this.isConnected) {
                    return;
                }
                this.isConnected = await GatewayApi.cloudConnect("cloudConnect");
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
        <div v-if="cloudPopupVisible" class="overlay" @click="cloudPopupVisible = false"></div>
        <div v-if="cloudPopupVisible" class="cloud-popup">
            <div v-if="authorizedShortInfo">
                <InputWithLabel
                    label="Connection status"
                    :value="isConnected ? 'Connected' : 'Connection lost'"
                    :disabled="true"
                >
                    <RequestButton
                        v-if="!isConnected"
                        requestId="cloudConnect"
                        @click="connectToCloud"
                    >
                        <h3>reconnect</h3>
                    </RequestButton>
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
            <RequestButton
                requestId="saveAuthorization"
                @click="saveAuthorization"
            >
                <h2>Authorize</h2>
            </RequestButton>
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
        left: 0px;
        width: 100vw;
        height: calc(100vh - var(--doc-height));
    }
    .cloud-popup {
        position: absolute;
        top: calc(var(--doc-height) + var(--list-item-gap));
        right: var(--list-item-gap);
        width: 400px;
        display: flex;
        flex-direction: column;
        row-gap: var(--list-item-gap);
        text-align: center;
        background-color: var(--color-background-soft);
        border-radius: var(--border-radius);
        padding: 5px;
    }
</style>