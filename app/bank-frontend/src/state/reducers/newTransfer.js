import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import { SET_INPUT_TRANSFER_DATA, SET_ACCOUNTS_FOR_TRANSFER, SET_DESCRIPTION_MODE } from '../actions/newTransfer';
import { START_LOADING } from '../actions/spinner';

const defaultState = {
  accounts: [],
  senderBankAccount: '',
  targetBankAccountNumber: '',
  amount: '',
  description: EditorState.createEmpty(),
  descriptionHtml: '',
  descriptionMode: 'visual'
};

const newTransfer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_INPUT_TRANSFER_DATA:
      return {
        ...state,
        ...action.values
      };

    case SET_ACCOUNTS_FOR_TRANSFER:
      return {
        ...defaultState,
        accounts: action.accounts,
        senderBankAccount: action.senderBankAccount
      };

    case SET_DESCRIPTION_MODE:
      const currentState = {
        ...state,
        descriptionMode: action.mode
      };

      if (action.mode === 'html') {
        currentState.descriptionHtml = stateToHTML(state.description.getCurrentContent())
      }

      if (action.mode === 'visual') {
        const blocksFromHTML = convertFromHTML(currentState.descriptionHtml);
        if (blocksFromHTML.contentBlocks) {
          const editorState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          currentState.description = EditorState.createWithContent(editorState)
        } else {
          currentState.description = EditorState.createEmpty();
        }
      }

      return currentState;

    case START_LOADING:
      return {
        ...defaultState
      };

    default:
      return state;
  }
};

export default newTransfer;
