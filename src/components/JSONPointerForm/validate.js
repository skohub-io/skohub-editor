import Ajv from 'ajv'

const validate = (schema) => {
  const ajv = new Ajv({
    schemaId: 'auto',
    allErrors: true,
    jsonPointers: true
  })
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))
  return ajv.compile(schema)
}

export default validate
