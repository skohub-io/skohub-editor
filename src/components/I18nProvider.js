import React from 'react'
import PropTypes from 'prop-types'

class I18nProvider extends React.Component {
  getChildContext() {
    return {
      locales: this.props.i18n.locales,
      translate: this.props.i18n.translate,
      moment: this.props.i18n.moment
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

I18nProvider.childContextTypes = {
  locales: PropTypes.arrayOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  moment: PropTypes.func.isRequired,
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
  i18n: PropTypes.objectOf(PropTypes.any).isRequired
}

export default I18nProvider
