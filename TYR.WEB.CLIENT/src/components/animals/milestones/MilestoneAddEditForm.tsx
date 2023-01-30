/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Button, Form, FormInstance, message, Modal, Row, Select,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import '../FtrAnimals.less';
import Cookies from 'universal-cookie';
import moment, { Moment } from 'moment';
import { isEqual } from 'lodash';
import { apiCall } from '../../../shared/api/apiWrapper';
import { BirthMilestoneForm } from '../components/forms/AnimalBirthMilestone';
import { AnimalIntakeMilestone } from '../components/forms/AnimalIntakeMilestone';

const { confirm } = Modal;

export interface AnimalsAddModalProps {
  editRecord: any;
  visible: boolean;
  setVisible: any;
  animalDetail: any;
  animalMilestoneList: any;
  updateAnimalMilestoneListCall: any;
  getAnimalMilestoneListCall: any;
  setSelectedPco: any;
  animalMilestoneFilter: any;
  selectedPcoId: any;
  selectedAnimalId: any;
  updateAnimalMilestoneLoading: boolean;
}

interface AnimalType {
  id: string;
  typeName: string;
}

interface AcquisitionWay {
  id: string;
  acquisitionWayName: string;
}

const cssPrefix = 'animals-add-modal';
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

type SizeType = Parameters<typeof Form>[0]['size'];

const cookies = new Cookies();

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required',
  types: {
    email: '${label} is not a valid email',
    number: '${label} is not a valid number',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export const MilestoneAddEditForm = (props: AnimalsAddModalProps) => {
  const {
    editRecord, visible, setVisible, animalDetail, animalMilestoneList, updateAnimalMilestoneListCall,
    getAnimalMilestoneListCall, updateAnimalMilestoneLoading, setSelectedPco, selectedPcoId, selectedAnimalId,
  } = props;
  const [, forceUpdate] = useState({});
  const [loading, setLoading] = useState(false);
  const newAnimalType: AnimalType[] = [];
  const newAcquisitionWay: AcquisitionWay[] = [];
  const [animalType, setAnimalType] = useState(newAnimalType);
  const [howAcquired, setHowAcquired] = useState(newAcquisitionWay);
  const [otherRescueShelter, setOtherRescueShelter] = useState<any>([]);
  const [aqusitionNameToId, setAqusitionNameToId] = useState<any>({});
  const [aqusitionIdToName, setAqusitionIdToName] = useState<any>({});
  const [firstError, setFirstError] = useState<any>('');
  const [form] = Form.useForm();

  // const ifEditMode: boolean = Boolean(props.editRecord && props.editRecord.key) || false;
  const modalTitle: string = (editRecord?.milestoneType.toLowerCase() === 'intake') ? 'Edit Intake Milestone'
    : 'Edit Birth Milestone';

  useEffect(() => {
    const data = {};
    apiCall('animaltype/get-animal-types', 'GET', data)
      .then((resp: any) => {
        if (resp?.status === 200) {
          setAnimalType(resp?.data?.data?.animalTypes);
        }
      });
  }, []);

  useEffect(() => {
    const data = {};
    apiCall('acquisition-way/get-acquisition-way', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setHowAcquired(resp?.data?.data?.acquisitionWays);
          const tempAcquistionWay = resp?.data?.data?.acquisitionWays;
          const newObj: any = {};
          const newAcquistionWayIdToName: any = {};
          tempAcquistionWay.map((currentAcqWay: any, i: any) => {
            newObj[currentAcqWay.acquisitionWayName] = currentAcqWay.id;
            newAcquistionWayIdToName[currentAcqWay.id] = currentAcqWay.acquisitionWayName;
            return newObj;
          });
          setAqusitionNameToId(newObj);
          setAqusitionIdToName(newAcquistionWayIdToName);
        }
      });
    apiCall('other-rescue-shelter/get-other-rescue-shelter', 'GET', {})
      .then((resp: any) => {
        setOtherRescueShelter(resp?.data?.data?.otherRescueShelters);
      });
  }, []);

  // useEffect(() => {
  //   setFirstError('');
  //   setCurrentAcquistionWayId('');
  //   setFlagReasonKey(Date.now());
  //   form.setFieldsValue({ ...editRecord });
  //   if (!visible) {
  //     setNoOfAnimal(1);
  //     form.resetFields();
  //     setEditRecord(null);
  //   }
  // }, [visible]);

  // if (ifEditMode) {
  //   form.setFieldsValue({
  //     ...props.editRecord,
  //   });
  // }

  // Can not select days after today
  const disabledDate = (current: Moment) => current && current > moment().endOf('day');

  // eslint-disable-next-line no-unused-vars
  const sexValidator: any = ({ getFieldValue }: FormInstance) => ({
    required: true,
    validator() {
      const totalAnimals = Number(getFieldValue('numberOfAnimals') || 0);
      const maleCnt = Number(getFieldValue('males') || 0);
      const femaleCnt = Number(getFieldValue('females') || 0);
      const uknCnt = Number(getFieldValue('unknown') || 0);

      if ((maleCnt + femaleCnt + uknCnt) === totalAnimals) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Total Count Must Equal the Number of Animals'));
    },
  });

  const handleUpdate = () => {
    const data = form.getFieldsValue();
    let newData: any = {};
    if (editRecord?.milestoneType?.toLowerCase() === 'intake') {
      const {
        acquisitionWayId, amountPaid, amountRecieved, intakeDate, intakeNote, otherRescueID,
      } = data;
      newData = {
        acquisitionWayId,
        amountPaidFee: parseInt(amountPaid, 10),
        amountReceivedFee: parseInt(amountRecieved, 10),
        milestoneDate: moment(intakeDate),
        notes: intakeNote,
        otherRescueIDNo: otherRescueID,
        otherRescueShelterId: data?.otherRescueShelterId,
        pcoId: [aqusitionNameToId['Owner Surrender'], aqusitionNameToId?.Person, aqusitionNameToId?.Public].includes(acquisitionWayId) ? selectedPcoId : null,
        acquisitionWayName: aqusitionIdToName[data?.acquisitionWayId],
      };
    } else {
      const {
        birthDate, birthNote, isApproxDOB,
      } = data;
      newData = {
        isApproxDOB: JSON.parse(isApproxDOB) || false,
        milestoneDate: moment(birthDate),
        notes: birthNote,
      };
    }

    updateAnimalMilestoneListCall({
      ...newData,
      milestoneId: editRecord?.id,
    }, () => {
      getAnimalMilestoneListCall({ page: 1, length: 15, animalId: selectedAnimalId?.[0] || localStorage.getItem('selectedAnimalId') }, () => {
        setVisible(false);
      });
    });
  };

  const getActualBirthdate = (yrs: number, mos: number, days: number) => {
    const birthDate = moment().subtract(yrs, 'years').subtract(mos, 'months').subtract(days, 'days');
    return birthDate;
  };

  // const onCancel = () => {
  //   const data = form.getFieldsValue();
  //   let isFormChanged = false;
  //   if (!editRecord) {
  //     isFormChanged = (data?.animalName || data?.breed || data?.color || data.spayedOrNeutered || data?.description
  //       || data?.otherRescueID || data?.flag || data?.flagReason || data?.location || data?.personOrRescue
  //       || data?.otherRescueID || data?.otherRescueID || data?.amountPaid || data?.amountRecieved
  //       || data?.intakeNote || data?.personOrRescue || data?.actualAge || data?.birthNote);
  //   } else {
  //     const {
  //       animalName, animalTypeId, breed, sex, color, spayedOrNeutered, location, flag, flagReason, description, upload,
  //     } = editRecord;
  //     const intialRecord = {
  //       animalName, animalTypeId, breed, sex, color, spayedOrNeutered, location, flag, flagReason, description, upload,
  //     };
  //     isFormChanged = !(isEqual(intialRecord, form.getFieldsValue()));
  //   }
  //   if (!isFormChanged) {
  //     form.resetFields();
  //     props.handleCancel();
  //     return;
  //   }

  //   confirm({
  //     title: 'Do you want to save your changes?',
  //     icon: <ExclamationCircleOutlined />,
  //     okText: 'Yes',
  //     okType: 'danger',
  //     cancelText: 'No',
  //     onOk() {
  //       editRecord ? handleUpdate() : form.submit();
  //     },
  //     onCancel() {
  //       form.resetFields();
  //       props.handleCancel();
  //     },
  //   });
  // };

  const validationCheck = () => {
    let errorField = '';
    setFirstError('');
    setTimeout(() => {
      form.getFieldsError()?.map((data: any) => {
        if (errorField) {
          return '';
        }
        if (data?.errors[0]) {
          errorField = data?.name[0];
          setFirstError(data?.name[0]);
        }
        return '';
      });
      if (errorField) {
        message.error({
          content: 'Correct Highlighted Fields',
          style: {
            marginTop: '2vh',
          },
          key: 'deletedable',
        });
      }
    }, 500);
  };

  useEffect(() => {
    if (editRecord?.milestoneType?.toLowerCase() === 'intake') {
      const intakeMilestone: any = animalMilestoneList[1];

      form.setFieldsValue({
        acquisitionWayId: intakeMilestone?.acquisitionWayId,
        amountPaid: (intakeMilestone?.amountPaidFee) ? (intakeMilestone?.amountPaidFee) : '',
        amountRecieved: (intakeMilestone?.amountReceivedFee) ? (intakeMilestone?.amountReceivedFee) : '',
        intakeDate: moment(intakeMilestone?.milestoneDate),
        intakeNote: intakeMilestone?.notes,
        otherRescueID: intakeMilestone?.otherRescueIDNo,
      });

      if (intakeMilestone?.pcoId) {
        setSelectedPco(intakeMilestone?.pcoId);
      }
    } else {
      const birthMilestone: any = animalMilestoneList[0];

      form.setFieldsValue({
        actualAge: '',
        birthDate: moment(birthMilestone?.milestoneDate),
        birthDateFlag: false,
        birthNote: birthMilestone?.notes,
        isApproxDOB: birthMilestone?.isApproxDOB ? 'true' : 'false',
      });
    }
  }, [visible]);

  useEffect(() => {
    console.log(form.getFieldsValue(), '()()()()()()()');
  }, [form.getFieldsValue()]);

  const footerContent = [
    <Button key="back" onClick={() => setVisible(false)}>
      Cancel
    </Button>,
    <Button
      form="animal-form"
      key="submit"
      type="primary"
      htmlType="submit"
      loading={loading}
      onClick={() => {
        validationCheck();
      }}
    >
      Save
      {updateAnimalMilestoneLoading && <LoadingOutlined spin />}
    </Button>,
  ];

  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <div className={`${cssPrefix}`}>
      <Modal
        className={`${cssPrefix}__modal`}
        centered
        title={<span className={`${cssPrefix}__modal__title`}>{modalTitle}</span>}
        visible={visible}
        onOk={() => alert('fhghj')}
        onCancel={() => setVisible(false)}
        footer={footerContent}
      >
        <Form
          id="animal-form"
          className={`${cssPrefix}__form`}
          form={form}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...layout}
          onFinish={() => handleUpdate()}
          name="nest-messages"
          scrollToFirstError
          validateMessages={validateMessages}
          size={'small' as SizeType}
        >
          {(editRecord?.milestoneType?.toLowerCase() === 'intake') ? (
            <AnimalIntakeMilestone
              animalMilestoneList={animalMilestoneList}
              setFirstError={setFirstError}
              form={form}
              firstError={firstError}
            />
          ) : (
            <BirthMilestoneForm
              animalMilestoneList={animalMilestoneList}
              form={form}
              firstError={firstError}
            />
          )}
        </Form>
      </Modal>
    </div>
  );
};
