import React from 'react'
import { Editor, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './DescriptionEditor.scss';

class DescriptionEditor extends React.Component {
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _onBoldClick() {
    this.props.onChange(RichUtils.toggleInlineStyle(this.props.state, 'BOLD'));
  }

  _onItalicClick() {
    this.props.onChange(RichUtils.toggleInlineStyle(this.props.state, 'ITALIC'));
  }

  render() {
    return (
      <div className="description-editor">
        <div className="description-editor-tools">
          <button type="button"
                  className="description-editor-button bold"
                  onClick={() => this._onBoldClick()}>
                    B
          </button>
          <button type="button"
                  className="description-editor-button italic"
                  onClick={() => this._onItalicClick()}>
                    I
          </button>
          <button type="button"
                  className="description-editor-button toggle-mode"
                  onClick={() => this.props.onGoToHtmlMode()}>
                    Go to HTML mode
          </button>
        </div>
        <div className="description-editor-workspace">
          <Editor editorState={this.props.state}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.props.onChange} />
        </div>
      </div>
    );
  }
}

export default DescriptionEditor;
