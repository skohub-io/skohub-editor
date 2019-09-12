import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const withI18n = (BaseComponent) => {
  const LocalizedComponent = (props) => (
    <BaseComponent
      translate={(key) => typeof key === 'string' ? key : JSON.stringify(key)}
      locales={['en']}
      moment={moment}
      {...props}
    />
  )

  return LocalizedComponent
}

export default withI18n
