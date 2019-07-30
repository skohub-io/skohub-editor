/* eslint no-use-before-define: 0 */
import jsonPointer from 'json-pointer'
import merge from 'deepmerge'

const JsonSchema = (schema) => {
  const cloneSchema = schema => JSON.parse(JSON.stringify(schema))

  const get = ptr => expandSchema(
    cloneSchema(jsonPointer.get(schema, ptr.slice(1))),
  )

  const expandSchema = (schema) => {
    schema = resolveRefs(schema)
    if ('items' in schema) {
      schema.items = expandSchema(schema.items)
    }
    ['allOf', 'anyOf', 'oneOf'].forEach((property) => {
      if (property in schema) {
        schema[property] = schema[property].map(subSchema => expandSchema(subSchema))
      }
    })
    if ('properties' in schema) {
      Object.keys(schema.properties).forEach((property) => {
        schema.properties[property] = expandSchema(
          schema.properties[property],
        )
      })
    }
    return schema
  }

  const resolveRefs = (schema) => {
    if ('$ref' in schema) {
      schema = merge(get(schema.$ref), schema)
      delete schema.$ref
    }
    return schema
  }

  return {
    get,
  }
}

export default JsonSchema
