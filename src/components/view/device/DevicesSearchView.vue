<script>  
    import SearchDeviceInfo from './SearchDeviceInfo.vue'
    import DeviceControlPanel from './DeviceControlPanel.vue'
    import TabItem from '../../tabs/TabItem.vue'
    import { h } from 'vue'
    import { SearchApi } from '../../../api/SearchDevicesApi';
    import { EventBus, REQUEST } from '../../../utils/EventBus';
    import UpdateButton from '../../controls/UpdateButton.vue';

    export default {
        components: {
            SearchDeviceInfo,
            DeviceControlPanel,
            UpdateButton,
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
                this.loading = true;
                const foundDevices = []
                SearchApi.searchDevices((deviceInfo) => {
                    if (!this.devices[deviceInfo.ip]) {
                        this.devices[deviceInfo.ip] = deviceInfo
                        foundDevices.push(deviceInfo.ip)
                        console.debug(`Found new device: ${deviceInfo.name}`)
                    }
                }, this.gateway);
                EventBus.on(REQUEST, ({id, loading}) => {
                    if (id == 'search') {
                        this.loading = loading;
                        if (!this.loading) {
                            Object.keys(this.devices).forEach((key) => {
                                if (!key in foundDevices) {
                                    delete this.devices[key]
                                    if (this.selectedIp == key) {
                                        this.selectedIp = undefined
                                    }
                                }
                            })
                        }
                    }
                })
            },
            switchTab(ip) {
                if (!this.tabs[ip]) {
                    this.tabs[ip] = h(
                        DeviceControlPanel, { 
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
    <div style="width: 400px;">
        <div style="position: relative;">
            <h1 class="title">Found devices</h1>
            <UpdateButton
                class="update"
                :loading="loading"
                :onClick="search"
            />
        </div>
        <div class="search-results">
            <div v-for="[ip, deviceInfo] in Object.entries(devices)" v-bind:key="ip">
                <Transition name="slide-left">
                    <TabItem v-if="deviceInfo && deviceInfo.name" v-bind:selected="selectedIp == ip">
                        <SearchDeviceInfo
                            :ip="ip" 
                            :deviceInfo="deviceInfo"
                            @click="switchTab(ip)"
                        />
                    </TabItem>
                </Transition>
            </div>
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
    .update {
        position: absolute;
        right: 0px;
        top: 5px;
    }
    .devices-table {
        display: flex;
        flex-direction: row;
        gap: var(--default-gap);
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
