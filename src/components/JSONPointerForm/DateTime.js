import React from 'react'
import PropTypes from 'prop-types'
import Cleave from 'cleave.js/react'
import moment from 'moment'

import withFormData from './withFormData'
import { objectMap } from '../../common'

const DateTime = ({
  name, value, setValue, errors, title, className,
  translate, formId, required, placeholder, description,
}) => (
  <div className={`DateTime ${className}${errors.length ? ' hasErrors' : ''}`}>
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
    <div className="Inputs">
      <Cleave
        placeholder={placeholder}
        options={{
          date: true,
          datePattern: ['Y', 'm', 'd'],
          delimiter: '-',
        }}
        value={value}
        onChange={(e) => {
          const date = e.target.value
          setValue(date.endsWith('-') ? date.slice(0, -1) : date)
        }}
      />

      {value
        && moment(value.split('T')[0], 'YYYY-MM-DD', true).isValid() && (
        <Cleave
          placeholder={`hh:mm ${translate('(Optional)')}`} // USE SECOND PLACEHOLDER?
          options={{
            time: true,
            timePattern: ['h', 'm'],
          }}
          value={
            (value.includes('T')
            && value.split('T')[1].split('.')[0]) || ''
          }
          onChange={(e) => {
            const time = e.target.value
            const date = `${value.split('T')[0]}${time ? `T${time}` : ''}`
            setValue(date)
          }}
        />
      )}
    </div>
    <input
      type="hidden"
      name={name}
      value={value}
      id={`${formId}-${name}`}
    />
  </div>
)

DateTime.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  className: PropTypes.string,
  translate: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  description: PropTypes.string,
}

DateTime.defaultProps = {
  value: '',
  errors: [],
  title: '',
  className: '',
  required: false,
  placeholder: undefined,
  description: undefined,
}

export default withFormData(DateTime)
