import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'

const withFormData = (BaseComponent) => {
  const formComponent = class FormComponent extends React.Component {
    constructor(props, context) {
      super(props)
      const parents = context.path || []
      this.path = props.property != null
        ? [...parents, props.property]
        : parents
      this.name = jsonPointer.compile(this.path)
    }

    getChildContext() {
      return {
        path: this.path,
      }
    }

    shouldComponentUpdate() {
      const { shouldFormComponentUpdate } = this.context
      return shouldFormComponentUpdate(this.name)
    }

    render() {
      const {
        getValue, formId, setValue, getValidationErrors, shouldFormComponentFocus,
      } = this.context

      return (
        <BaseComponent
          name={this.name}
          value={getValue(this.name)}
          formId={formId}
          setValue={(value, prune) => setValue(this.name, value, prune)}
          errors={getValidationErrors(this.name)}
          shouldFormComponentFocus={shouldFormComponentFocus(this.name)}
          {...this.props}
        />
      )
    }
  }

  formComponent.propTypes = {
    property: PropTypes.string,
  }

  formComponent.defaultProps = {
    property: undefined,
  }

  formComponent.childContextTypes = {
    path: PropTypes.arrayOf(PropTypes.any),
  }

  formComponent.contextTypes = {
    path: PropTypes.arrayOf(PropTypes.any),
    setValue: PropTypes.func,
    getValue: PropTypes.func,
    getValidationErrors: PropTypes.func,
    shouldFormComponentUpdate: PropTypes.func,
    shouldFormComponentFocus: PropTypes.func,
    formId: PropTypes.string,
  }

  return formComponent
}

export default withFormData
