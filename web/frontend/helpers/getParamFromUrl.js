const getParamFromUrl = (url) => {
  try {
    if (!url) throw new Error('Invalid url')

    let param = url.split('/')[url.split('/').length - 1]
    param = param.split('?')[0]

    return param
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default getParamFromUrl
