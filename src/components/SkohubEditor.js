import React from 'react'

import Form from './JSONPointerForm/Form'
import Builder from './JSONPointerForm/Builder'
import JsonSchema from './JSONPointerForm/JsonSchema'
import validate from './JSONPointerForm/validate'
import SkohubLookup from './JSONPointerForm/SkohubLookup'

import Header from './Header'
import Preview from './Preview'
import '../styles/components/FormsStructure.pcss'
import '../styles/formStyle.pcss'

const DEFAULT_SCHEMA = 'https://raw.githubusercontent.com/literarymachine/oer-metadata-schemas/generic-OER/oer.json'

class SkohubEditor extends React.Component {
  constructor (props) {
    super(props)
    const url = new URL(window.location.href)

    var parameters = [...url.searchParams].filter(([key]) => key !== 'schema')
    const json = parameters.reduce((obj, item) => {
      obj[item[0]] = decodeURIComponent(item[1])
      return obj
    }, {})

    this.state = {
      json,
      schema: null,
      schemaURL: url.searchParams.get('schema') ||
        localStorage.getItem('schemaURL') ||
        DEFAULT_SCHEMA,
      view: 'Editor'
    }
    this.setSchema = this.setSchema.bind(this)
    this.setSchemaURL = this.setSchemaURL.bind(this)
  }

  componentDidMount () {
    const { setSchema, state: { schemaURL } } = this
    schemaURL && setSchema(schemaURL)
  }

  setSchema (schemaURL) {
    fetch(schemaURL).then(response => {
      response.json().then(schema => {
        this.setState({ schema })
      })
    }).catch(err => console.log(err))
  }

  setSchemaURL (url) {
    this.setState({ schemaURL: url })
  }

  render () {
    const {
      setSchema,
      setSchemaURL,
      state: { json, schema, schemaURL, view }
    } = this

    return (
      <div className="wrapper">
        <Header
          setSchema={setSchema}
          schemaURL={schemaURL}
          setSchemaURL={setSchemaURL}
        />

        <div className="mobileViewSwitch">
          <button
            className="btn"
            onClick={() => {
              view === 'Editor'
                ? this.setState({ view: 'Preview' })
                : this.setState({ view: 'Editor' })
            }}
          >Show the {view === 'Editor' ? 'Preview' : 'Editor'}</button>
        </div>

        <main className={`content ${view}`}>
          {schema && (
            <>
              <Form
                data={json}
                onChange={data => {
                  this.setState({ json: data })
                }}
                validate={validate(JsonSchema(schema).get('/'))}
                onSubmit={(data) => {
                  console.log(data)
                  this.setState({ json: data })
                }}
              >
                <Builder
                  schema={JsonSchema(schema).get('/')}
                  widgets={{ SkohubLookup }}
                />
                <div className="buttons">
                  <button className="btn" type="submit">Publish</button>
                </div>
              </Form>

              {Object.values(json).length ? (
                <Preview
                  json={json}

                  validate={validate(JsonSchema(schema).get('/'))}
                  clear={() => {
                    if (confirm('Any unsaved progress will be lost')) {
                      this.setState({
                        json: {}
                      })
                    }
                  }}
                />
              ) : (
                <div className="noPreview">
                  <span>👈</span>&nbsp;Use the form
                </div>
              )}
            </>
          )}
        </main>
      </div>
    )
  }
}

export default SkohubEditor
