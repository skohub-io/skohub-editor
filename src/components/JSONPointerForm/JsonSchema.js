/* eslint no-use-before-define: 0 */
import jsonPointer from 'json-pointer'
import merge from 'deepmerge'

const JsonSchema = (schema) => {
  const cloneSchema = schema => JSON.parse(JSON.stringify(schema))

  return {
    get: ptr => cloneSchema(jsonPointer.get(schema, ptr.slice(1)))
  }
}

export default JsonSchema
