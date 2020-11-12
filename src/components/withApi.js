import React from 'react'

const getParams = (qstring) => {
  const params = {}
  if (qstring) {
    const q = qstring.replace('?', '').split('&')
    for (let i = 0; i < q.length; ++i) {
      const [param, val] = q[i].split('=', 2).map(
        s => decodeURIComponent(s).replace(/\+/g, ' ')
      )
      if (!val) {
        params[param] = ''
      } else if (params[param] instanceof Array) {
        params[param].push(val)
      } else if (params[param]) {
        params[param] = [params[param], val]
      } else {
        params[param] = val
      }
    }
  }
  return params
}

class Api {
  get (url) {
    const params = getParams(url)
    console.log(params)

    if (params['filter.about.@type']) {

      // SET TO EVENT JUST FOR TEST
      // ADD SEARCH FOR STARTS WITH
      // db.dbData
      //   .where({type: "Event"})
      //   .toArray()
      //   .then((elements) => {
      //     console.log(elements)
      //     return Promise.resolve({member: elements})
      //   })
      //   .catch(e => console.log(e))

      // db.dbData
      //   .where({type: params["filter.about.@type"]})
      //   .toArray()
      //   .then((elements) => {
      //     console.log(elements)
      //   })
      //   .catch(e => console.log(e))

    }

    console.info('%c Trying to get:', 'color: limegreen; font-weight: bold', url)
    return Promise.resolve({ member: [] })
  }

  vocab () {
    return Promise.resolve({ member: [] })
  }
}

const withApi = (BaseComponent) => {
  const ApiComponent = (props) => (
    <BaseComponent
      // api={{
      //   get: () => Promise.resolve({member: []}),
      //   vocab: () => Promise.resolve({member: []})
      // }}
      api={new Api()}
      {...props}
    />
  )

  return ApiComponent
}

export default withApi
