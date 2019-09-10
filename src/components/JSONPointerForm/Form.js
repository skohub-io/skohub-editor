import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'
import {
  forOwn, isUndefined, isNull,
  isNaN, isString, isEmpty, isObject, isArray, pull, uniqueId,
} from 'lodash'

const prune = (current) => {
  forOwn(current, (value, key) => {
    if (isUndefined(value) || isNull(value) || isNaN(value)
      || (isString(value) && isEmpty(value.trim()))
      || (isObject(value) && isEmpty(prune(value)))) {
      delete current[key]
    }
  })
  if (isArray(current)) {
    pull(current, undefined)
  }
  return current
}

class Form extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: props.data,
      formErrors: [],
    }
    this.submitCallbacks = {}
    this.id = props.id || uniqueId()
    this.lastUpdate = ''
    this.lastOp = null
  }

  getChildContext() {
    return {
      formId: this.id,
      setValue: this.setValue.bind(this),
      getValue: this.getValue.bind(this),
      getValidationErrors: this.getValidationErrors.bind(this),
      shouldFormComponentUpdate: this.shouldFormComponentUpdate.bind(this),
      shouldFormComponentFocus: this.shouldFormComponentFocus.bind(this),
      registerSubmitCallback: this.registerSubmitCallback.bind(this),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      formData: nextProps.data,
      formErrors: [],
    })
  }

  setValue(name, value, _prune = true) {
    this.setState((prevState) => {
      this.lastOp = value && jsonPointer.has(prevState.formData, name)
        ? 'changed' : value ? 'added' : 'removed'
      this.lastUpdate = name
      jsonPointer.set(prevState.formData, name, value)
      const formData = _prune ? prune(prevState.formData) : prevState.formData
      this.props.onChange(formData)
      return { formData }
    })
  }

  getValue(name) {
    const { formData } = this.state

    return jsonPointer.has(formData, name)
      ? jsonPointer.get(formData, name)
      : undefined
  }

  getValidationErrors(name) {
    const { formErrors } = this.state

    return formErrors.filter(error => error.keyword !== 'anyOf' && (error.keyword === 'required'
      ? `${error.dataPath}/${error.params.missingProperty}` === name
      : error.dataPath === name))
  }

  shouldFormComponentUpdate(name) {
    return !name
      || this.lastUpdate.startsWith(name)
      || name.startsWith(this.lastUpdate)
      || (this.lastOp !== 'changed'
          && jsonPointer.parse(this.lastUpdate).shift() === jsonPointer.parse(name).shift())
      || this.getValidationErrors(name).length
  }

  shouldFormComponentFocus(name) {
    return this.lastUpdate === name
  }

  registerSubmitCallback(name, callback) {
    this.submitCallbacks[name] = callback
  }

  render() {
    const {
      action, method, validate, onError, onSubmit, children,
    } = this.props
    const { formData } = this.state

    return (
      <form
        className="Form"
        action={action}
        method={method}
        onSubmit={(e) => {
          e.preventDefault()
          this.lastUpdate = ''
          this.lastOp = null
          if (validate(prune(formData))) {
            onSubmit(formData)
            Object.values(this.submitCallbacks).forEach(callback => callback(formData))
          } else {
            this.setState({ formErrors: validate.errors }, () => onError(validate.errors))
          }
        }}
      >
        {children}
      </form>
    )
  }
}

Form.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  action: PropTypes.string,
  method: PropTypes.string,
  id: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  validate: PropTypes.func,
  children: PropTypes.node.isRequired,
}

Form.defaultProps = {
  data: {},
  action: '',
  method: 'get',
  id: undefined,
  onSubmit: formData => console.log(formData),
  onChange: formData => console.info(formData),
  onError: formErrors => console.error(formErrors),
  validate: () => true,
}

Form.childContextTypes = {
  formId: PropTypes.string,
  setValue: PropTypes.func,
  getValue: PropTypes.func,
  getValidationErrors: PropTypes.func,
  shouldFormComponentUpdate: PropTypes.func,
  shouldFormComponentFocus: PropTypes.func,
  registerSubmitCallback: PropTypes.func,
}

export default Form
