import React from 'react'
import PropTypes from 'prop-types'
import Highlight from 'react-highlight'

import 'highlight.js/styles/github-gist.css'

import '../styles/components/Preview.pcss'

const Preview = ({ json, clear }) => {
  return (
    <section className="Preview block">
      <div
        className="options"
      >
        <input
          className="btn"
          type="button"
          onClick={clear}
          value="Clear"
        />

        <input
          className="btn"
          type="button"
          onClick={() => {
            var range = document.createRange()
            range.selectNode(document.querySelector('code'))
            window.getSelection().addRange(range)
            document.execCommand('copy')
            window.getSelection().removeAllRanges()
          }}
          value="Copy to clipboard"
        />
      </div>
      <Highlight language="javascript">
        {JSON.stringify(json, null, 2)}
      </Highlight>
    </section>
  )
}

Preview.propTypes = {
  json: PropTypes.objectOf(PropTypes.any).isRequired,
  clear: PropTypes.func.isRequired
}

export default Preview
