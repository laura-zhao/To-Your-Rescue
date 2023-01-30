import { TableFilterOptions } from './PCO.types';

export const PERSON = 'Person';
export const ORG = 'CorO';

export const mockMenu1 = [
  { key: 'history', value: 'History' },
  { key: 'donate', value: 'Donate' },
  { key: 'volunteer', value: 'Volunteer' },
  { key: 'attachement', value: 'Attachments' },
];

export const filterOptions: TableFilterOptions[] = [
  { id: 'all', name: 'All' },
  { id: PERSON, name: 'People' },
  { id: ORG, name: 'Organizations' },
];

export const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
  },
  {
    title: 'Street',
    dataIndex: 'street',
  },
  {
    title: 'Street 2',
    dataIndex: 'street2',
  },
  {
    title: 'City',
    dataIndex: 'city',
    width: 100,
  },
  {
    title: 'State',
    dataIndex: 'state',
  },
  {
    title: 'Zip',
    dataIndex: 'zip',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: 220,
  },
];
