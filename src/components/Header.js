import React from 'react'

import '../styles/components/Header.pcss'

const Header = ({setSchema}) => {
  return (
    <header className="Header">
      <h1>
        <a href="/">Skohub Editor</a>
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          const schemaURL = formData.get('schemaURL')
          setSchema(schemaURL)
        }}
      >
        <input
          type="url"
          list="schemas"
          id="schemaURL"
          name="schemaURL"
          placeholder="Schema URL"
        />

        <datalist id="schemas">
          <option value="https://raw.githubusercontent.com/dini-ag-kim/oer-metadata-schemas/master/course.json" />
          <option value="https://raw.githubusercontent.com/dini-ag-kim/oer-metadata-schemas/master/service-card.json" />
        </datalist>

        <input
          type="submit"
          value="Load Schema"
          className="alternativeButton"
        />
      </form>

    </header>
  )
}

export default Header
