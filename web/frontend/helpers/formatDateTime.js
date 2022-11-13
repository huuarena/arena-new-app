import moment from 'moment'

/**
 *
 * @param {String | Number} datetime
 * @param {String} type
 * @returns String
 */
const formatDateTime = (datetime, type = 'YYYY-MM-DD') => {
  switch (type) {
    case 'MM/DD/YYYY':
    case 'L':
      return moment(new Date(datetime)).format('L')

    case 'Month DD, YYYY':
    case 'LL':
      // Month DD, YYYY
      return moment(new Date(datetime)).format('LL')

    case 'LLL':
      // Month DD, YYYY HH:MM AM
      return moment(new Date(datetime)).format(type)

    case 'LLLL':
      // Day, Month DD, YYYY HH:MM AM
      return moment(new Date(datetime)).format(type)

    default:
      // YYYY/MM/DD
      let date = new Date(datetime)

      let yyyy = date.getFullYear()
      let mm = date.getMonth() + 1
      mm = (mm < 10 ? '0' : '') + mm
      let dd = date.getDate()
      dd = (dd < 10 ? '0' : '') + dd

      return `${yyyy}/${mm}/${dd}`
  }
}

export default formatDateTime
