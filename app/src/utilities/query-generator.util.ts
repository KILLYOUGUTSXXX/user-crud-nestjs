import * as moment from 'moment'

export function queryGenerator (
  attributes: any = [],
  query: any = {},
  pagings: boolean = false
): { filtered: any, limit?: number, offset: number, page: number } {
  try {
    let where = {}
    let tmpWhere = {}
    let attr = null
    const { _page: page = 1, _pageSize: pageSize = 20, ...others } = query
    let paging = { offset: null, limit: null, page }
    const filtered = Object.getOwnPropertyNames(others || {}) || []

    filtered.map(items => {
      let tmpItem = items || ''
      attr = tmpItem
      tmpWhere = {}
      
      if(!!tmpItem.match(/\$[RNGDT]+/g)) {
        attr = tmpItem.split(':')[1]
        const fromDate: string = (others[tmpItem][0] || '')
        const toDate: string = (others[tmpItem][1] || '')
        if(attr) {
          tmpWhere = { [attr]: { $gte: new Date(moment(fromDate).startOf('day').unix() * 1000), $lte: new Date(moment(toDate).endOf('day').unix() * 1000) } }
        }
      } else if (!!tmpItem.match(/\$[PERIOD]+/g)) {
        attr = tmpItem.split(':')[1]
        const fromDate = others[tmpItem] ? new Date(moment(others[tmpItem]).startOf('month').unix() * 1000) : null
        const toDate = others[tmpItem] ? new Date(moment(others[tmpItem]).endOf('month').unix() * 1000) : null
        tmpWhere = { [attr]: { $gte: new Date(moment(fromDate).startOf('day').unix() * 1000), $lte: new Date(moment(toDate).endOf('day').unix() * 1000) } }
      } else if (!!tmpItem.match(/\$[BOOL]+/g)) {
        attr = tmpItem.split(':')[1]
        const trueStatus = (others[tmpItem] || '').match(/Y/g) ? [true] : []
        const falseStatus = (others[tmpItem] || '').match(/N/g) ? [false] : [] 
        tmpWhere = { [attr]: { $in: [...trueStatus, ...falseStatus] } }
      } else if (!!tmpItem.match(/(IN):+/g)) {
        attr = tmpItem.split(':')[1]
        if(!Array.isArray(others[tmpItem])) {
          tmpWhere = { [attr]: { $in: [] } }
        } else {
          tmpWhere = { [attr]: { $in: others[tmpItem] } }
        }
      } else {
        const newVal = (others[tmpItem] || '').replace(/(\(|\{|\[).*/g, '')
        tmpWhere = { [attr]: { $regex: new RegExp(`${newVal}`, 'i') } }
      }

      if(attributes.indexOf(attr) !== -1) {
        where = {
          ...where,
          ...tmpWhere
        }
      }
    })

    if(pagings) {
      paging = {
        limit: +(pageSize || 20),
        offset: +(page - 1 || 0) * +(pageSize || 20),
        page: +page
      }
    }

    return { filtered: where, ...paging }
  } catch (er) {
    throw new Error('[GQ-01] Something went wrong')
  }
}