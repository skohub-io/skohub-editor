import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'
import { objectMap } from '../../common'

const Fieldset = ({
  name, children, errors, property, title, className, translate, formId, required, description,
}) => (
  <div
    className={`Fieldset ${property || ''} ${className} ${errors.length ? 'hasError' : ''}`.trim()}
    role="group"
    aria-labelledby={`${formId}-${name}-label`}
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
    {children}
  </div>
)

Fieldset.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  property: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  translate: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  description: PropTypes.string,
}

Fieldset.defaultProps = {
  errors: [],
  property: undefined,
  title: '',
  className: '',
  required: false,
  description: undefined,
}

export default withFormData(Fieldset)
