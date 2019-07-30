/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

import withFormData from './withFormData'
import Icon from '../Icon'
import withApi from '../withApi'
import withI18n from '../withI18n'
import { getURL, triggerClick, objectMap } from '../../common'

class RemoteSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      options: [],
    }
    this.handleChange = this.handleChange.bind(this)
    this.updateOptions = debounce(this.updateOptions.bind(this), 200)
    this.optionList = this.optionList.bind(this)
    this.showOption = this.showOption.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick)
  }

  handleClick(e) {
    if (!this.wrapper.contains(e.target)) {
      this.setState({ options: [] })
    }
  }

  handleChange(e) {
    const { schema } = this.props

    this.setState({ filter: e.target.value })
    e.target.value || schema.properties.inScheme
      ? this.updateOptions()
      : this.setState({ options: [] })
  }

  updateOptions() {
    const { schema, api } = this.props
    const { filter } = this.state

    let apiCall

    if (schema.properties.inScheme) {
      apiCall = api.vocab(schema.properties.inScheme.properties['@id'].enum[0])
    } else {
      const params = {
        q: `${filter}*`,
        'filter.about.@type': schema.properties['@type'].enum,
      }
      const url = getURL({
        path: '/resource/',
        params,
      })
      apiCall = api.get(url)
    }
    apiCall.then(result => this.setState({ options: result.member.map(member => member.about) }))
  }

  showOption(option) {
    const { schema, translate } = this.props
    const { filter } = this.state

    return !schema.properties.inScheme
      || option['@type'] !== 'Concept'
      || translate(option.name).toLowerCase().search(filter.trim().toLowerCase()) !== -1
  }

  optionList(options) {
    const {
      name, translate, setValue, formId,
    } = this.props

    return (
      <ul>
        {options.map(option => (
          <li key={option['@id']}>
            <input
              type="checkbox"
              name={`${name}/@id`}
              value={option['@id']}
              id={`${formId}-${name}-${option['@id']}`}
              onChange={e => setValue(e.target.checked ? option : undefined)}
            />
            <label
              htmlFor={`${formId}-${name}-${option['@id']}`}
              tabIndex="0"
              role="button"
              className={this.showOption(option) ? null : 'hidden'}
              onKeyDown={e => triggerClick(e, 13)}
            >
              <Icon type={option['@type']} />
              &nbsp;
              {translate(option.name)}
              {option.alternateName ? ` (${translate(option.alternateName)})` : ''}
            </label>
            {option.narrower && this.optionList(option.narrower)}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {
      name, property, value, setValue, errors, title,
      translate, className, formId, required, schema, description,
    } = this.props
    const { filter, options } = this.state

    return (
      <div
        ref={el => this.wrapper = el}
        className={`RemoteSelect ${property || ''} ${className} ${errors.length ? 'hasError' : ''}`.trim()}
        aria-labelledby={`${formId}-${name}-label`}
        onKeyDown={(e) => {
          if (e.keyCode === 27) {
            this.setState({ options: [] })
          }
        }}
        role="button"
        tabIndex="0"
      >
        <div
          className={`label ${required ? 'required' : ''}`.trim()}
          id={`${formId}-${name}-label`}
        >
          {translate(title)}
        </div>
        <span className="fieldDescription">
          {(description
          && translate(description)
          !== description)
            ? translate(description)
            : ''}
        </span>
        {errors.map((error, index) => (
          <div className="error" key={index}>
            {translate(`Error.${error.keyword}`, objectMap(error.params, translate))}
          </div>
        ))}
        {value ? (
          <div className="selectedContainer">
            <input
              type="checkbox"
              name={`${name}/@id`}
              value={value['@id']}
              id={`${formId}-${name}-${value['@id']}`}
              checked
              onChange={e => setValue(e.target.checked ? value : undefined)}
            />
            <label htmlFor={`${formId}-${name}-${value['@id']}`} tabIndex="0" role="button">
              <Icon type={value['@type']} />
              &nbsp;
              {translate(value.name)}
            </label>
          </div>
        ) : (
          <div className="selectContainer">
            <div className="filterContainer">
              <input
                type="text"
                name={`${name}/@id`}
                value={filter}
                className="filter"
                onFocus={() => schema.properties.inScheme && this.updateOptions()}
                placeholder={
                  translate('ClientTemplates.resource_typehead.search')
                    .concat(' ')
                    .concat((schema.properties['@type'].enum || [])
                      .map(type => translate(type)).join(' or '))
                }
                onChange={this.handleChange}
              />
            </div>
            {options.length > 0 && (
              <div className="optionsContainer">
                {this.optionList(options)}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

RemoteSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.objectOf(PropTypes.any),
  property: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  translate: PropTypes.func.isRequired,
  schema: PropTypes.objectOf(PropTypes.any).isRequired,
  api: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  formId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  description: PropTypes.string,
}

RemoteSelect.defaultProps = {
  value: undefined,
  property: undefined,
  errors: [],
  title: '',
  className: '',
  required: false,
  description: undefined,
}

export default withI18n(withApi(withFormData(RemoteSelect)))
