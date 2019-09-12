import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

import { appendOnFocus, objectMap } from '../../common'

const castValue = (target) => {
  switch (target.type) {
  case 'checkbox':
    return target.checked ? true : null
  case 'number':
    return parseFloat(target.value)
  case 'integer':
    return parseInt(target.value, 10)
  default:
    return target.value
  }
}

const Input = ({
  type, name, value, setValue, errors, property, title, className, translate,
  shouldFormComponentFocus, formId, required, placeholder, description,
}) => (
  <div className={`Input ${type} ${property || ''} ${className} ${errors.length ? 'hasError' : ''}`.trim()}>
    <label
      htmlFor={`${formId}-${name}`}
      dangerouslySetInnerHTML={
        {
          __html: translate(title)
              + (required
                ? `<span class="asterisk" title="${translate('This is a required field!')}">*</span>`
                : ''),
        }}
      className={required ? 'required' : ''}
    />
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
    <input
      type={type}
      name={name}
      value={value}
      id={`${formId}-${name}`}
      placeholder={translate(placeholder)}
      autoFocus={shouldFormComponentFocus}
      onFocus={appendOnFocus}
      onChange={e => setValue(castValue(e.target))}
    />
  </div>
)

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  property: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  translate: PropTypes.func.isRequired,
  shouldFormComponentFocus: PropTypes.bool,
  formId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  description: PropTypes.string,
}

Input.defaultProps = {
  type: 'text',
  value: '',
  errors: [],
  property: undefined,
  title: '',
  className: '',
  shouldFormComponentFocus: false,
  required: false,
  placeholder: undefined,
  description: undefined,
}

export default withFormData(Input)
