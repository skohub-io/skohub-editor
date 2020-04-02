/* global _paq */
import React from 'react'
import PropTypes from 'prop-types'
import merge from 'deepmerge'
import { isString } from 'lodash'

import Fieldset from './Fieldset'
import Input from './Input'
import List from './List'
import DropdownSelect from './DropdownSelect'
import RemoteSelect from './RemoteSelect'
import Textarea from './Textarea'
import KeywordSelect from './KeywordSelect'
import DateTime from './DateTime'

import withI18n from '../withI18n'

class Builder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showOptionalFields: props.showOptionalFields
    }
    this.getComponent = this.getComponent.bind(this)
  }

  getComponent (schema) {
    schema.allOf && (schema = merge.all(schema.allOf.concat(schema))) && (delete schema.allOf)
    schema.anyOf && (schema = merge.all(schema.anyOf.concat(schema))) && (delete schema.anyOf)
    schema.oneOf && (schema = merge.all(schema.oneOf.concat(schema))) && (delete schema.oneOf)

    const {
      translate, config, widgets, locales
    } = this.props
    const widgetsObj = Object.assign(
      {
        Fieldset,
        Input,
        List,
        DropdownSelect,
        RemoteSelect,
        Textarea,
        KeywordSelect,
        DateTime
      },
      widgets
    )
    const className = schema._display ? schema._display.className : undefined

    // FIXME: not rendering form components for hidden fields due to performance issues
    // when handling long lists. This works because the corresponding data is still present
    // in the underlying formdata; non-js clients will send incomplete data, though.
    if (className === 'hidden') {
      return <React.Fragment />
    }

    const props = {
      title: schema.title,
      description: schema.description,
      // placeholder: schema._display && schema._display.placeholder,
      display: schema._display || {},
      config,
      className,
      translate,
      locales
    }

    if (schema._widget) {
      const [widgetType, widgetOptions] = isString(schema._widget)
        ? [schema._widget, {}]
        : [schema._widget.type, schema._widget.options || {}]
      if (widgetsObj[widgetType]) {
        const Widget = widgetsObj[widgetType]
        return <Widget {...props} options={widgetOptions} schema={schema} />
      } else {
        console.warn('Widget not found', widgetType)
      }
    }

    switch (schema.type) {
      case 'string':
        return schema.enum
          ? <DropdownSelect {...props} options={schema.enum} />
          : schema._display && schema._display.rows > 1
            ? <Textarea {...props} />
            : <Input {...props} type={(schema._display && schema._display.type) || 'text'} />
      case 'integer':
      case 'number':
        return <Input {...props} type="number" />
      case 'boolean':
        return <Input {...props} type="checkbox" />
      case 'array':
        return <List {...props} maxItems={schema.maxItems}>{this.getComponent(schema.items)}</List>
      case 'object':
        return schema.properties ? (
          <Fieldset {...props}>
            <div className="requiredFields">
              {schema.required && Object.keys(schema.properties)
                .filter(property => schema.required.includes(property))
                .map(property => React.cloneElement(
                  this.getComponent(schema.properties[property]), {
                    property,
                    key: property,
                    required: true
                  }
                ))
              }
            </div>
            <div className="optionalFields">
              {Object.keys(schema.properties)
                .filter(property => !schema.required || !schema.required.includes(property))
                .map(property => React.cloneElement(
                  this.getComponent(schema.properties[property]), {
                    property,
                    key: property,
                    required: false
                  }
                ))
              }
            </div>
          </Fieldset>
        ) : <React.Fragment />
      case 'null':
      default:
        console.warn('Could not determine form component for', schema)
        return <Input {...props} type="text" />
    }
  }

  render () {
    const { schema, translate } = this.props
    const { showOptionalFields } = this.state
    const optionalFieldsClass = showOptionalFields
      ? 'optionalFieldsVisible'
      : 'optionalFieldsHidden'
    return (
      <div className={`Builder ${optionalFieldsClass}`}>
        {this.getComponent(schema)}
        {!showOptionalFields && (
          <button
            className="btn"
            onClick={(event) => {
              typeof _paq !== 'undefined' && _paq.push(['trackEvent', 'AddFormOverlay', 'ShowOptionalFieldsClick'])
              event.preventDefault() || this.setState({ showOptionalFields: true })
            }}
          >
            {translate('form.showOptionalFields', { title: translate(schema.title) })}
          </button>
        )}
      </div>
    )
  }
}

Builder.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  widgets: PropTypes.objectOf(PropTypes.any),
  config: PropTypes.objectOf(PropTypes.any),
  showOptionalFields: PropTypes.bool,
  locales: PropTypes.arrayOf(PropTypes.any).isRequired
}

Builder.defaultProps = {
  widgets: {},
  config: null,
  showOptionalFields: true
}

export default withI18n(Builder)
