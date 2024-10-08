import axios from 'axios'
import { GATEWAY_URL } from './GatewayFetch'

const axiosInstance = axios.create({
  baseURL: GATEWAY_URL + '/ota/firmware',
  timeout: 5000
})

const OtaApi = {
  getSavedFirmwares: async () => {
    return (await axiosInstance.get()).data
  },
  addFirmware: async (info, file) => {
    const form = new FormData();
    form.append('info', JSON.stringify(info))
    form.append('file', file)
    return (await axiosInstance.post('', form)).data
  },
  updateFirmware: async (info) => {
    return (await axiosInstance.put('', info)).data
  },
  deleteFirmware: async (id) => {
    return (await axiosInstance.delete('', { params: { id }})).status == 200
  },
  uploadFirmware: async (id, device) => {
    return (await axiosInstance.post('/upload', device, { params: { id }})).status == 200
  },
  getRunningUploads: async () => {
    return (await axiosInstance.get('/upload')).data
  },
  getSupportedBoards: async () => {
    return (await axiosInstance.get('/boards')).data
  },
  buildDownloadFirmwareLink: (id) => {
    return `${GATEWAY_URL}/ota/firmware/download?id=${id}`
  }
}

export { OtaApi }