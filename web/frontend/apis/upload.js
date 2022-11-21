import apiCaller from '../helpers/apiCaller'

const UploadApi = {
  upload: async (data) => {
    let formData = new FormData()

    if (data?.files) {
      for (let file of data.files) {
        formData.append('file', file)
      }
    }

    return await apiCaller(`/upload`, 'POST', formData)
  },
}

export default UploadApi
