import React from 'react'
import { connect } from 'react-redux';

import { FaAward, FaMailBulk, FaGlobeAmericas } from 'react-icons/fa';
import { IoIosPhonePortrait } from 'react-icons/io';

import Error from '../../Error/Error';
import TransferOption from './TransferOption';
import FormGroup from '../../FormGroup/FormGroup';
import DescriptionEditor from './DescriptionEditor/DescriptionEditor';
import HtmlDescriptionEditor from './DescriptionEditor/HtmlDescriptionEditor';
import { setInputTransferData, initTransferSend, setDescriptionMode } from '../../state/actions/newTransfer';
import { ERROR_TRANSFER_FAILED, ERROR_NEW_TRANSFER_ACCOUNTS_FETCH_FAILED } from '../../state/actions/errors';


import './NewTransfer.scss';

const NewTransfer = ({
  targetBankAccountNumber,
  amount,
  description,
  senderBankAccount,
  accounts,
  setField,
  initTransferSend,
  descriptionMode,
  setDescriptionMode,
  descriptionHtml
}) => {
  return (
    <div className="new-transfer">
      <div className="new-transfer-options">
        <TransferOption icon={FaAward} label="Send the tax transfer" />
        <TransferOption icon={FaGlobeAmericas} label="Send the foreign transfer" />
        <TransferOption icon={IoIosPhonePortrait} label="Charge phone with the money" />
        <TransferOption icon={FaMailBulk} label="Send transfer using SMS Message" />
      </div>
      <div className="new-transfer-form">
        <form onSubmit={e => {e.preventDefault(); initTransferSend()}}>
          <h2 className="new-transfer-header">Sending of the regular transfer</h2>

          <Error codes={[
              ERROR_NEW_TRANSFER_ACCOUNTS_FETCH_FAILED
            ]} />
          <div className="transfer-data">
            <FormGroup label="From account">
              <select type="text"
                     required
                     className="banking-input"
                     placeholder="Enter the sender's account number"
                     value={senderBankAccount && senderBankAccount.toString()}
                     onChange={e => setField('senderBankAccount', e.target.value)}>
                { accounts.map((account, key) => (
                  <option key={key}
                          value={account.id.toString()}>
                    { account.account_name } ({account.currency}) - {account.iban}
                  </option>
                )) }
              </select>
            </FormGroup>

            <FormGroup label="To account">
              <input type="text"
                     required
                     className="banking-input"
                     placeholder="Enter the recipient's account number"
                     value={targetBankAccountNumber}
                     onChange={e => setField('targetBankAccountNumber', e.target.value)} />
            </FormGroup>

            <FormGroup label="Amount">

              <input type="text"
                     required
                     className="banking-input"
                     placeholder="0.00"
                     value={amount}
                     onChange={e => setField('amount', e.target.value)}  />

                   { senderBankAccount && accounts.find(a => a.id === parseInt(senderBankAccount)).currency }
            </FormGroup>

            <FormGroup label="Description" noHtmlLabel="true">
              { descriptionMode === 'visual' && <DescriptionEditor state={description}
                                 onChange={value => setField('description', value)}
                                 onGoToHtmlMode={() => setDescriptionMode('html')} /> }

              { descriptionMode === 'html' && <HtmlDescriptionEditor state={descriptionHtml}
                                 onChange={value => setField('descriptionHtml', value)}
                                 onGoToVisualMode={() => setDescriptionMode('visual')} /> }
            </FormGroup>
          </div>

          <Error codes={[ERROR_TRANSFER_FAILED]} />

          <div className="new-transfer-send">
            <button type="submit" className="banking-button active banking-button-big">Send</button>
          </div>

        </form>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const {
    targetBankAccountNumber,
    amount,
    description,
    senderBankAccount,
    accounts,
    descriptionMode,
    descriptionHtml
  } = state.newTransfer;

  return {
    targetBankAccountNumber,
    amount,
    description,
    senderBankAccount,
    accounts,
    descriptionMode,
    descriptionHtml
  }
};

const mapDispatchToProps = dispatch => ({
  setField: (...props) => dispatch(setInputTransferData(...props)),
  initTransferSend: () => dispatch(initTransferSend()),
  setDescriptionMode: (...props) => dispatch(setDescriptionMode(...props))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTransfer);
