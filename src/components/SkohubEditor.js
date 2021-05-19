/* global window, localStorage, fetch, confirm */

import React from 'react'
import refParser from 'json-schema-ref-parser';

import Form from './JSONPointerForm/Form'
import Builder from './JSONPointerForm/Builder'
import validate from './JSONPointerForm/validate'
import SkohubLookup from './JSONPointerForm/SkohubLookup'

import Header from './Header'
import Preview from './Preview'
import '../styles/components/FormsStructure.pcss'
import '../styles/formStyle.pcss'

const DEFAULT_SCHEMA = 'https://skohub-io.github.io/metadata-profiles/lrmi-profile/schema.json'

class SkohubEditor extends React.Component {
  constructor (props) {
    super(props)
    const url = new URL(window.location.href)

    var parameters = [...url.searchParams].filter(([key]) => key !== 'schema')
    const json = parameters.reduce((obj, item) => {
      try {
        obj[item[0]] = JSON.parse(decodeURIComponent(item[1]))
      } catch (e) {
        obj[item[0]] = decodeURIComponent(item[1])
      }
      return obj
    }, {})

    let savedSchemaURL
    try {
      // Empty try/catch to avoid the extension crash on Firefox
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1323228
      savedSchemaURL = localStorage.getItem('schemaURL')
    } catch (error) {
      console.error(error)
    }

    this.state = {
      json,
      schema: null,
      schemaURL: url.searchParams.get('schema') ||
        savedSchemaURL ||
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
        refParser.dereference(schema, (err, schema) => {
          if (err) throw err
          const json = Object.assign({}, schema.default, this.state.json)
          this.setState({ schema, json })
        })
      })
    }).catch(err => console.error(err))
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

    let error
    let validateSchema = null

    try {
      validateSchema = schema && validate(schema)
    } catch (err) {
      error = err
    }

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
          {schema && validateSchema && (
            <>
              <Form
                data={json}
                onChange={data => {
                  this.setState({ json: data })
                }}
                validate={validateSchema}
                onSubmit={(data) => {
                  console.log(data)
                  this.setState({ json: data })
                }}
              >
                <Builder
                  schema={schema}
                  widgets={{ SkohubLookup }}
                />
                <div className="buttons">
                  <button className="btn" type="submit">Publish</button>
                </div>
              </Form>

              {Object.values(json).length ? (
                <Preview
                  json={json}
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

          {error && (
            <div className='error'>
              <h2>{error.message}</h2>
            </div>
          )}
        </main>
      </div>
    )
  }
}

export default SkohubEditor
