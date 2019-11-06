export const appendOnFocus = e => {
  const tmp = e.target.value
  e.target.value = ''
  e.target.value = tmp
}

export const getURL = (route) => {
  let url = route.path
  let params = []
  for (const param in route.params) {
    const value = route.params[param]
    if (Array.isArray(value)) {
      value && (params = params.concat(value.map(value => `${param}=${encodeURIComponent(value)}`)))
    } else {
      value && params.push(`${param}=${encodeURIComponent(value)}`)
    }
  }
  if (params) {
    url += `?${params.join('&')}`
  }
  if (route.hash) {
    url += `#${route.hash}`
  }
  return url
}

export const objectMap = (obj, fn) => (
  Object.keys(obj).reduce((result, key) => {
    result[key] = fn(obj[key])
    return result
  }, {})
)

export const triggerClick = (e, code) => {
  if (e.keyCode === (code || 32)) {
    e.target.click()
  }
}
