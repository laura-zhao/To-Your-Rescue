import { upperFirst } from 'lodash';
import moment from 'moment';
import { message } from 'antd';

export const FORMER = 'former';
export const CURRENT = 'current';

export const actionsMenu1 = (navigate: any, selectedAnimalId: any) => [
  {
    key: 'milestones',
    value: 'Milestones*',
    actionFunction: () => {
      if (selectedAnimalId.length < 1 || selectedAnimalId.length > 1) {
        message.warn({
          content: (selectedAnimalId.length < 1) ? 'Please select at least one animal' : 'Please select only one animal',
          style: {
            marginTop: '2vh',
          },
          key: 'deletedable',
        });
        return;
      }
      navigate('/animals/milestone');
    },
  },
  { key: 'behaviors', value: 'Behaviors*', url: '' },
  { key: 'relocate', value: 'Relocate*', url: '' },
  { key: 'attachment', value: 'Attachments', url: '' },
];

export const actionsMenu2 = [
  { key: 'vaccinations', value: 'Vaccinations*' },
  { key: 'procedures', value: 'Procedure & Tests*' },
  { key: 'prescriptions', value: 'Prescriptions*' },
  { key: 'meds', value: 'Meds*' },
  { key: 'soaps', value: 'SOAPs' },
  { key: 'notes', value: 'Notes*' },
  { key: 'reminders', value: 'Set Reminders*' },
  { key: 'healthHistory', value: 'Health History' },
];

export const actionsMenu3 = [
  { key: 'animalReport', value: 'Animal Report*' },
  { key: 'animalHealthReport', value: 'Animal Health Report*' },
];

export const actionsMenu4 = [
  // { key: 'copySelection', value: 'Copy Selection*' },
  { key: 'wideExposure', value: 'Wide Exposure' },
];

export const RESPONSES = {
  network_error: 'Error while fetching data.',
  server_error: 'Internal Server error! Please try again.',
  animal_delete_success: 'Animal entry has been deleted.',
  animal_delete_error: 'Error occurred while deleting animal.',
};

export const columns = [
  {
    title: 'Breed/Species',
    dataIndex: 'breed',
    sorter: (a: any, b: any) => a.breed.localeCompare(b.breed),
  },
  {
    title: 'Sex',
    dataIndex: 'sex',
    sorter: (a: any, b: any) => a.sex.localeCompare(b.sex),
    render: (data: any) => upperFirst(data),
  },
  {
    title: 'Birth Date',
    dataIndex: ['birthMilestone', 'milestoneDate'],
    sorter: (a: any, b: any) => a?.birthMilestone?.milestoneDate?.localeCompare(b?.birthMilestone?.milestoneDate),
    render: (data: any) => (data ? moment(data).format('MMM DD YYYY') : ''),
  },
  {
    title: 'Location',
    dataIndex: 'location',
    sorter: (a: any, b: any) => a?.location?.localeCompare(b?.location),
  },
  {
    title: 'Last Milestone',
    dataIndex: 'lastMilestone',
  },
  {
    title: 'Last Milestone Date',
    dataIndex: ['intakeMilestone', 'milestoneDate'],
    sorter: (a: any, b: any) => a?.intakeMilestone?.milestoneDate?.localeCompare(b?.intakeMilestone?.milestoneDate),
    render: (data: any) => (data ? moment(data).format('MMM DD YYYY') : ''),
  },
];
