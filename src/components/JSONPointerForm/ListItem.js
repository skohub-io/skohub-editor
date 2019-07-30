import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

const ListItem = ({ children }) => (
  <li>{children}</li>
)

ListItem.propTypes = {
  children: PropTypes.element.isRequired,
}

export default withFormData(ListItem)
