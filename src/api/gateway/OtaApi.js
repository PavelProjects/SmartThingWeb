import { gatewayAxiosInstance } from './GatewayFetch'

const BASE_PATH = '/api/ota/firmware'

const OtaApi = {
  getSavedFirmwares: async () => {
    return (await gatewayAxiosInstance.get(BASE_PATH)).data
  },
  addFirmware: async (info, file) => {
    const form = new FormData()
    form.append('info', JSON.stringify(info))
    form.append('file', file)
    return (await gatewayAxiosInstance.post(BASE_PATH, form)).data
  },
  updateFirmware: async (info) => {
    return (await gatewayAxiosInstance.put(BASE_PATH, info)).data
  },
  deleteFirmware: async (id) => {
    return (await gatewayAxiosInstance.delete(BASE_PATH, { params: { id } })).status === 200
  },
  uploadFirmware: async (id, device) => {
    return (
      (await gatewayAxiosInstance.post(BASE_PATH + '/upload', device, { params: { id } }))
        .status === 200
    )
  },
  uploadFirmwareBatch: async (id, devices) => {
    return (
      await gatewayAxiosInstance.post(BASE_PATH + '/upload/batch', devices, { params: { id } })
    ).data
  },
  abortFirmwareUpload: async (id) => {
    return (
      (await gatewayAxiosInstance.delete(BASE_PATH + '/upload', { params: { id } })).status === 200
    )
  },
  getRunningUploads: async () => {
    return (await gatewayAxiosInstance.get(BASE_PATH + '/upload')).data
  },
  getSupportedBoards: async () => {
    return (await gatewayAxiosInstance.get(BASE_PATH + '/boards')).data
  },
  buildDownloadFirmwareLink: (id) => {
    const { origin } = window.location
    return `${origin}${BASE_PATH}/download?id=${id}`
  }
}

export { OtaApi }
