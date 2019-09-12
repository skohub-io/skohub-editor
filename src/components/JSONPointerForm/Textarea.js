import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

import { appendOnFocus, objectMap } from '../../common'

const Textarea = ({
  name, value, setValue, errors, property, title, className, translate, shouldFormComponentFocus,
  formId, required, description,
}) => (
  <div className={`Textarea ${property || ''} ${className} ${errors.length ? 'hasError' : ''}`.trim()}>
    <label
      htmlFor={`${formId}-${name}`}
      className={required ? 'required' : ''}
    >
      {translate(title)}
      &nbsp;
      {required ? <span className="asterisk" title={translate('This is a required field!')}>*</span> : ''}
    </label>
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
    <textarea
      name={name}
      value={value}
      id={`${formId}-${name}`}
      placeholder={translate(title)}
      autoFocus={shouldFormComponentFocus}
      onFocus={appendOnFocus}
      onChange={e => setValue(e.target.value)}
    />
  </div>
)

Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  property: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  translate: PropTypes.func.isRequired,
  shouldFormComponentFocus: PropTypes.bool,
  formId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  description: PropTypes.string,
}

Textarea.defaultProps = {
  value: '',
  errors: [],
  property: undefined,
  title: '',
  className: '',
  shouldFormComponentFocus: false,
  required: false,
  description: undefined,
}

export default withFormData(Textarea)
