import React from 'react'

import Form from './JSONPointerForm/Form'
import Builder from './JSONPointerForm/Builder'
import JsonSchema from './JSONPointerForm/JsonSchema'
import validate from './JSONPointerForm/validate'

import Header from './Header'
import Preview from './Preview'
import '../styles/components/FormsStructure.pcss'
import '../styles/formStyle.pcss'

class SkohubEditor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      json: {},
      schema: null
    }
  }

  render() {
    const {json, schema} = this.state

    return (
      <div className="wrapper">
        <Header
          setSchema={(schemaURL) => {
            console.log(schemaURL)
            fetch(schemaURL).then(response => {
              response.json().then(schema => {
                this.setState({schema})
              })
            }).catch(err => console.log(err))
          }}
        />
        <main className="content">
            {schema && (
              <>
              <Form
                data={json}
                onChange={data => {
                  this.setState({json: data})
                }}
                validate={validate(JsonSchema(schema).get(`/`))}
                onSubmit={(data) => {
                  console.log(data)
                  this.setState({json: data})
                }}
              >
                <Builder
                  schema={JsonSchema(schema).get(`/`)}
                />
                {/* <div className="buttons">
                  <button className="btn" type="submit">Save</button>
                </div> */}
              </Form>

              {Object.values(json).length ? (
                <Preview
                  json={json}

                  validate={validate(JsonSchema(schema).get(`/`))}
                  clear={() => {
                    if (confirm("Any unsaved progress will be lost")) {
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