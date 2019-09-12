import React from 'react'
import Highlight from 'react-highlight'
import 'highlight.js/styles/github-gist.css'

import '../styles/components/Preview.pcss'

const Preview = ({id, json, clear}) => {
  return (
    <section className="Preview">
      <div
        className="options"
      >
        <input
          type="button"
          onClick={clear}
          value="Clear"
        />

        <input
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

export default Preview
