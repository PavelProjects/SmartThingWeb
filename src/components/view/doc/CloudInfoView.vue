<script>
    import { GatewayApi } from '../../../api/GatewayApi.js';
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
                cloudInfo: {}
            }
        },
        created() {
            this.loadCloudInfo()
            this.loadAuthorization()
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
            },
            async loadAuthorization() {
                this.parseAuthorizedUser(await GatewayApi.getCloudAuthorization())
            },
            async saveAuthorization() {
                this.parseAuthorizedUser(await GatewayApi.cloudAuthorize("saveAuthorization", this.cloudInfo))
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
                    label="User login"
                    :value="user.login"
                    :disabled="true"
                />
                <InputWithLabel
                    label="Gateway name"
                    :value="gateway.name"
                    :disabled="true"
                />
                <InputWithLabel
                    label="Gateway description"
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