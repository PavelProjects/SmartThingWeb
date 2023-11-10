<script>  
    import SearchDeviceInfo from './SearchDeviceInfo.vue'
    import DeviceControlPanel from './DeviceControlPanel.vue'
    import TabItem from '../../tabs/TabItem.vue'
    import { h } from 'vue'
    import LoadingButton from '../../controls/LoadingButton.vue';
    import { SearchApi } from '../../../api/SearchDevicesApi';

    export default {
        components: {
            SearchDeviceInfo,
            DeviceControlPanel,
            LoadingButton,
            TabItem
        },
        props: {
            gateway: Object
        },
        data() {
            return {
                tabs: {},
                devices: {},
                selectedIp: null,
                client: null,
                loading: false
            }
        },
        watch: {
            gateway() {
                this.devices = {}
                this.search();
            }
        },
        mounted() {
            this.search();
        },
        methods: {
            search() {
                SearchApi.searchDevices((deviceInfo) => {
                    if (!this.devices[deviceInfo.ip]) {
                        this.devices[deviceInfo.ip] = deviceInfo
                    }
                }, this.gateway);
            },
            switchTab(ip) {
                if (!this.tabs[ip]) {
                    this.tabs[ip] = h(
                        DeviceControlPanel,
                        {
                            key: ip, 
                            ip,
                            gateway: this.gateway
                        }
                    );
                }
                this.selectedIp = ip;
            },
        },
    }
</script>

<template>
  <div class="devices-table">
    <div class="side-search">
        <h1 class="title">Found devices</h1>
        <div class="search-results">
            <div v-for="[ip, deviceInfo] in Object.entries(devices)" v-bind:key="ip">
                <Transition name="slide-left">
                    <TabItem v-if="deviceInfo && deviceInfo.name" v-bind:selected="selectedIp == ip">
                        <SearchDeviceInfo
                            v-bind:ip="ip" 
                            v-bind:deviceInfo="deviceInfo"
                            v-on:click="switchTab(ip)"
                        />
                    </TabItem>
                </Transition>
            </div>
            <LoadingButton
                :loading="loading"
                v-on:click="search"
            >
                <h1>Refresh</h1>
            </LoadingButton>
        </div>
    </div>
    <div class="main-tab" v-if="selectedIp">
        <h1 class="title">Control panel</h1>
        <KeepAlive>
            <component v-bind:is="tabs[selectedIp]"></component>
        </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
    .devices-table {
        display: flex;
        flex-direction: row;
        width: 1500px;
    }
    .side-search{
        width: 400px;
        margin-right: 5px;
    }
    .search-results {
        display: grid;
        row-gap: var(--default-gap);
        height: fit-content;
    }
    .main-tab {
        width: calc(100% - 400px);
        height: 70%;
    }
    
</style>
