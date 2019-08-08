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
              setValue({
                id: item.id,
                prefLabel: item.prefLabel
              })
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

  const { schema, value, setValue, title, property, errors, name, required, formId, translate } = props
  const inScheme = schema.properties.inScheme.properties.id.enum.shift()

  useEffect(() => {
    fetch(inScheme, {
      headers: {
        "Accept": "application/json"
      }
    }).then(response => response.json())
      .then(setScheme)

    fetch(inScheme, {
      headers: {
        "Accept": "text/index"
      }
    }).then(response => response.json())
      .then(serialized => {
        const idx = FlexSearch.create()
        idx.import(serialized)
        setIndex(idx)
        console.log("index loaded", idx.info())
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
      {scheme &&
        <div>
          {value ? (
            <div onClick={() => setValue(undefined)}>{t(value.prefLabel)}</div>
          ) : (
            <div>
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
                    setValue={setValue}
                    setQuery={setQuery}
                    setExpanded={setExpanded}
                    translate={translate}
                  />
              }
            </div>
          )}
        </div>
      }
    </div>
  )
}

export default withFormData(SkohubLookup)
