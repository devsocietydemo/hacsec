import React from 'react'
import PropTypes from 'prop-types'
import './DescriptionEditor.scss';

const HtmlDescriptionEditor = ({onGoToVisualMode, onChange, state}) => {
  return (
    <div className="description-editor">
      <button type="button"
              className="description-editor-button toggle-mode"
              onClick={() => onGoToVisualMode()}>Go to Visual mode</button>
      <textarea className="banking-input description-editor-html" onChange={e => onChange(e.target.value)}
                value={state} />
    </div>
  )
}

export default HtmlDescriptionEditor
