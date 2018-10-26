import {OPERATION_CURRENT_BALANCE, OPERATION_ACCOUNTS, OPERATION_NEW_TRANSFER,
 OPERATION_CONTACTS} from './state/actions/operations';

export const routes = [
  {
    id: null,
    name: 'Start',
    href: ''
  },
  {
    id: OPERATION_CURRENT_BALANCE,
    name: 'Current balance',
    href: '/balance/:accountId'
  },
  {
    id: OPERATION_ACCOUNTS,
    name: 'Accounts',
    href: '/accounts',
    inMainMenu: true
  },
  {
    id: OPERATION_NEW_TRANSFER,
    name: 'Create new cash transfer',
    href: '/transfer(?accountId=:accountId)(?iban=:iban)',
    inMainMenu: true
  },
  {
    id: OPERATION_CONTACTS,
    name: 'Your contacts',
    href: '/contacts',
    inMainMenu: true
  }
];

export const getRouteById = (id) => routes.find(route => route.id === id);
