/**
 *
 * @param {Object} data
 */
const validateParams = (data) => {
  try {
    let keys = Object.keys(data)

    for (let i = 0, leng = keys.length; i < leng; i++) {
      let key = keys[i]

      if (data[key] === undefined) {
        throw { message: `Bad request. Field "${keys[i]}" is required`, field: keys[i] }
      }
    }
  } catch (error) {
    throw error
  }
}

export default validateParams
