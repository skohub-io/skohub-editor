import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FlexSearch from 'flexsearch'

import withFormData from './withFormData'

const getNestedItems = item => {
  let ids = [item.id]
  if (item.narrower) {
    item.narrower.forEach(narrower => {
      ids = ids.concat(getNestedItems(narrower))
    })
  }
  return ids
}

const NestedList = ({ items, filter, highlight, setValue, setQuery, setExpanded, translate }) => {
  const filteredItems = filter
    ? items.filter(item => !filter || filter.some(filter => getNestedItems(item).includes(filter)))
    : items

  return (
    <ul>
      {filteredItems.map(item => (
        <li
          key={item.id}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: translate(item.prefLabel).replace(highlight, str => `<strong>${str}</strong>`)
            }}
            onClick={() => {
              setValue(item)
              setQuery(null)
              setExpanded(false)
            }}
          />
          {item.narrower &&
            <NestedList
              items={item.narrower}
              filter={filter}
              highlight={highlight}
              setValue={setValue}
              setQuery={setQuery}
              setExpanded={setExpanded}
              translate={translate}
            />
          }
        </li>
      ))}
    </ul>
  )
}

const SkohubLookup = (props) => {
  const [index, setIndex] = useState(FlexSearch.create('speed'))
  const [query, setQuery] = useState(null)
  const [scheme, setScheme] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const {
    schema, value, setValue, title, property, errors, name, required, formId, translate,
    registerSubmitCallback, options
  } = props
  const schemaLocation = (options.url || schema.properties.inScheme.properties.id.enum[0]).replace(/^https?:/, '')

  value && registerSubmitCallback(data => {
    fetch(value.id.replace(/^http:/, '')).then(response => {
      const actor = new URL(response.url).pathname.substring(1)
      const label = translate(value.prefLabel)
      fetch(`/inbox?actor=${actor}`, {
        method: 'post',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/ld+json'
        },
        body: JSON.stringify(data)
      }).then(res => alert(res.ok ? `Published to ${label}` : `Could not publish to ${label}`))
        .catch(e => alert(`An error has occured: ${e.message}`))
    })
  })

  useEffect(() => {
    fetch(schemaLocation, {
      headers: {
        Accept: 'application/json'
      }
    }).then(response => response.json())
      .then(setScheme)

    fetch(schemaLocation, {
      headers: {
        Accept: 'text/index'
      }
    }).then(response => response.json())
      .then(serialized => {
        const idx = FlexSearch.create()
        idx.import(serialized)
        setIndex(idx)
        console.log('index loaded', idx.info())
      })
  }, [])

  return (
    <div
      className={`SkohubLookup ${property || ''} ${errors.length ? 'hasError' : ''}`.trim()}
      role="group"
      aria-labelledby={`${formId}-${name}-label`}
    >
      <div
        className={`label ${required ? 'required' : ''}`.trim()}
        id={`${formId}-${name}-label`}
      >
        {title}
      </div>
      {scheme && (
        value ? (
          <div className="skohubLookupSelectedValue" onClick={() => setValue(undefined)}>
            {translate(value.prefLabel)}
          </div>
        ) : (
          <div className="skohubLookupContent">
            <input
              value={query || ''}
              type="text"
              onChange={e => {
                setQuery(e.target.value || null)
                setExpanded(true)
              }}
              onFocus={() => setExpanded(true)}
              onBlur={() => setTimeout(() => {
                setExpanded(false)
                setQuery(null)
              }, 250
              )}
              placeholder={title}
            />
            {expanded &&
                <NestedList
                  items={scheme.hasTopConcept}
                  filter={query ? index.search(query) : null}
                  highlight={RegExp(query, 'gi')}
                  setValue={item => setValue({
                    id: item.id,
                    prefLabel: item.prefLabel,
                    type: 'Concept',
                    inScheme: {
                      id: schema.properties.inScheme.properties.id.enum[0]
                    }
                  })}
                  setQuery={setQuery}
                  setExpanded={setExpanded}
                  translate={translate}
                />
            }
          </div>
        )
      )}
    </div>
  )
}

NestedList.propTypes = {
  translate: PropTypes.func.isRequired,
  setQuery: PropTypes.func,
  setValue: PropTypes.func,
  setExpanded: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.any),
  filter: PropTypes.arrayOf(PropTypes.any),
  highlight: PropTypes.objectOf(PropTypes.instanceOf(RegExp))
}

SkohubLookup.propTypes = {
  translate: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.any),
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  value: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string,
  name: PropTypes.string,
  property: PropTypes.string,
  formId: PropTypes.string,
  setValue: PropTypes.func,
  registerSubmitCallback: PropTypes.func,
  required: PropTypes.bool,
  options: PropTypes.objectOf(PropTypes.any)
}

export default withFormData(SkohubLookup)
