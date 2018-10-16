import React from 'react'
import PropTypes from 'prop-types'

import TransferOption from './TransferOption';

import FormGroup from '../../FormGroup/FormGroup';

import { FaAward, FaMailBulk, FaGlobeAmericas } from 'react-icons/fa';
import { IoIosPhonePortrait } from 'react-icons/io';

import './NewTransfer.scss';

const NewTransfer = (props) => {
  return (
    <div className="new-transfer">
      <div className="new-transfer-options">
        <TransferOption icon={FaAward} label="Send the tax transfer" />
        <TransferOption icon={IoIosPhonePortrait} label="Send the foreign transfer" />
        <TransferOption icon={FaGlobeAmericas} label="Charge phone with the money" />
        <TransferOption icon={FaMailBulk} label="Send transfer using SMS Message" />
      </div>
      <div className="new-transfer-form">
        <form>
          <h2 className="new-transfer-header">Sending of the regular transfer</h2>

          <div className="transfer-data">
            <FormGroup label="From account">
              <select type="text"
                     className="banking-input"
                     placeholder="Enter the sender's account number">

                  <option>Bank account 1</option>
                  <option>Bank account 2</option>
              </select>
            </FormGroup>

            <FormGroup label="To account">
              <input type="text"
                     className="banking-input"
                     placeholder="Enter the recipient's account number" />
            </FormGroup>

            <FormGroup label="Amount">

              <input type="text"
                     className="banking-input"
                     placeholder="0.00"  />

              USD
            </FormGroup>

            <FormGroup label="Description">
              <input type="text"
                     className="banking-input"
                     placeholder="Enter the decription, eg. to Tom for Diner" />
            </FormGroup>
          </div>

          <div className="new-transfer-send">
            <button type="submit" className="banking-button active banking-button-big">Send</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default NewTransfer
