import React from 'react'
import moment from 'moment'

const translate = key => key && (
  (typeof key === 'string')
    ? key
    : (Object.entries(key).filter(([, value]) => !!value).shift() || []).pop() || key
)

const withI18n = (BaseComponent) => {
  const LocalizedComponent = (props) => (
    <BaseComponent
      translate={translate}
      locales={['en']}
      moment={moment}
      {...props}
    />
  )

  return LocalizedComponent
}

export default withI18n
