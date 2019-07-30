import React from 'react'
import PropTypes from 'prop-types'

import Api from '../api'

class ApiProvider extends React.Component {

  getChildContext() {
    return { api: new Api(this.props.config) }
  }

  render() {
    return React.Children.only(this.props.children)
  }

}

ApiProvider.childContextTypes = {
  api: PropTypes.objectOf(PropTypes.any).isRequired
}

ApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.objectOf(PropTypes.any).isRequired
}

export default ApiProvider
