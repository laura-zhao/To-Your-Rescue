/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Button, Col, DatePicker, Divider, Form, FormInstance, Input, InputNumber, message, Modal, Row, Select, Switch, Tooltip, Typography, Upload,
} from 'antd';
import {
  InfoCircleOutlined, UploadOutlined, LoadingOutlined, ExclamationCircleOutlined, PlusOutlined, EditOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './AnimalsAddModal.less';
import Cookies from 'universal-cookie';
import { AnimalLocationTooltip, AssignedIDValidationTooltip } from 'src/shared/constants/tooltips.data';
import moment, { Moment } from 'moment';
import { isEqual } from 'lodash';
import { apiCall } from '../../../shared/api/apiWrapper';
import { pluralToSingular } from '../../../utils/pluralToSingular';
import SingleAvatarUpload from '../../../shared/components/Inputs/SingleAvatarUpload';
import PCOMinifiedScreen from './minifiedPcoScreen';

const { confirm } = Modal;

export interface AnimalsAddModalProps {
  pcoList?: any;
  editRecord?: any | null;
  visible: boolean;
  addAnimalLoading: boolean,
  updateAnimalLoading: boolean;
  getAnimalFilter: any,
  selectedPcoId: string,
  setSelectedPcoId: any;
  setSearchKey: any;
  setSearchKeyFinal: any;
  setSelectedAnimal: any;
  selectedAnimalId: any;
  updateAnimalCall: (data: object, callbackFunction: any) => void;
  setEditRecord: (data: any) => void,
  setAddModalVisibility: (isModalVisible: boolean) => void;
  getAnimalListCall: (data: object, callbackFunction: any) => void;
  addAnimalCall: any;
  uploadImageCall?: any,
  deleteImageCall?: any,
  handleCancel: () => void;
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
/* eslint-enable no-template-curly-in-string */

const DEFAULT_LABEL_GENERATE_BTN = 'Let Computer Suggest';
const MODIFIED_LABEL_GENERATE_BTN = 'Select another';

export const AnimalsAddModal = (props: AnimalsAddModalProps) => {
  const {
    addAnimalCall, getAnimalListCall, setAddModalVisibility, getAnimalFilter, addAnimalLoading, editRecord,
    updateAnimalCall, updateAnimalLoading, selectedPcoId, visible, setEditRecord, pcoList, setSelectedPcoId,
    setSearchKey, setSearchKeyFinal, setSelectedAnimal, selectedAnimalId, uploadImageCall, deleteImageCall,
  } = props;
  const [imageState, setImageState] = useState<any>();
  const [existedImageUrl, setExistedImageUrl] = useState<any>();
  const [existedImageId, setExistedImageId] = useState<any>();
  const [, forceUpdate] = useState({});
  const [saveAnother, setSaveAnother] = useState(false);
  const [saveAndClone, setSaveAndClone] = useState(false);
  const [loading, setLoading] = useState(false);
  const newAnimalType: AnimalType[] = [];
  const newAcquisitionWay: AcquisitionWay[] = [];
  const [animalType, setAnimalType] = useState(newAnimalType);
  const [howAcquired, setHowAcquired] = useState(newAcquisitionWay);
  const [otherRescueShelter, setOtherRescueShelter] = useState<any>([]);
  const [aqusitionNameToId, setAqusitionNameToId] = useState<any>({});
  const [aqusitionIdToName, setAqusitionIdToName] = useState<any>({});
  const [currentAcquistionWayId, setCurrentAcquistionWayId] = useState('');
  const [generateNameBtn, setGenerateNameBtn] = useState(DEFAULT_LABEL_GENERATE_BTN);
  const [noOfAnimal, setNoOfAnimal] = useState(1);
  const [firstError, setFirstError] = useState<any>('');
  const [highlightKey, setHighlightKey] = useState<any>('');
  const [flagReasonKey, setFlagReasonKey] = useState<any>('');
  const [nameSuggestionLoading, setNameSuggestionLoading] = useState(false);
  const [form] = Form.useForm();

  const ifEditMode: boolean = Boolean(props.editRecord && props.editRecord.key) || false;
  const modalTitle: string = editRecord ? 'Edit Animal'
    : 'Add Animal';

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

  useEffect(() => {
    setSelectedPcoId('');
    setFirstError('');
    setCurrentAcquistionWayId('');
    setFlagReasonKey(Date.now());
    form.setFieldsValue({ ...editRecord });
    if (!visible) {
      setNoOfAnimal(1);
      setImageState('');
      setExistedImageUrl('');
      setExistedImageId('');
      form.resetFields();
      setEditRecord(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!editRecord?.id) {
      return;
    }
    apiCall(`artifact-attachment/get-artifactattachment-byanimal/${editRecord?.id}`, 'GET', {})
      .then((resp: any) => {
        setExistedImageUrl(resp?.data?.data?.artifactAttachment?.blobUrl);
        setExistedImageId(resp?.data?.data?.artifactAttachment?.id);
      });
  }, [editRecord]);

  if (ifEditMode) {
    form.setFieldsValue({
      ...props.editRecord,
    });
  }

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

  const generateName = () => {
    const { males, females } = form.getFieldsValue();
    setNameSuggestionLoading(true);
    // eslint-disable-next-line no-nested-ternary
    apiCall(`animal/get-animalname-suggestions?gender=${males ? 'male' : (females ? 'female' : 'unknown')}`, 'GET', {})
      .then((resp: any) => {
        setNameSuggestionLoading(false);
        if (resp.status === 200) {
          form.setFieldsValue({
            animalName: resp?.data?.data,
          });
          setGenerateNameBtn(MODIFIED_LABEL_GENERATE_BTN);
        }
      });
  };

  const handleUpdate = () => {
    const data = form.getFieldsValue();

    updateAnimalCall({
      ...data,
      id: editRecord?.id,
      spayedOrNeutered: data.spayedOrNeutered ? data.spayedOrNeutered : false,
      flag: data?.flag,
    }, () => {
      if (imageState) {
        uploadImageCall({
          imageState,
          animalId: [editRecord?.id],
          Entity: 'Animal',
          PublicityRank: 0,
          AttachmentDate: new Date(),
          AttachmentType: 'Photo',
        }, () => {
          setAddModalVisibility(false);
        });
      } else if (!imageState && existedImageId) {
        deleteImageCall({ id: existedImageId }, () => {
          setAddModalVisibility(false);
        });
      } else {
        setAddModalVisibility(false);
      }
    });
  };

  const onSave = () => {
    const data = form.getFieldsValue();
    const { yrs, mos, days } = data;

    const newNewData = {
      animal: {
        // assignedAnimalId: data?.assignedAnimalId || 0,
        animalName: data?.animalName,
        available: true,
        breed: data?.breed,
        color: data?.color,
        sex: 'male',
        spayedOrNeutered: data.spayedOrNeutered ? data.spayedOrNeutered : false,
        lastMilestone: 'string',
        lastMilestoneDate: data?.intakeDate,
        description: data?.description,
        otherIDNo: data?.otherRescueID,
        flag: data?.flag,
        flagReason: data?.flagReason,
        location: data?.location,
        isDeleted: false,
        pcoId: data?.personOrRescueId ? data?.personOrRescueId : null,
        animalTypeId: data?.animalTypeId,
        tenantId: cookies.get('loginDetails').tenantId,
      },
      intakeMileStone: {
        milestoneType: 'intake',
        milestoneDate: data?.intakeDate,
        otherRescueShelterId: data?.otherRescueShelterId,
        otherRescueIDNo: data?.otherRescueID,
        amountPaidFee: data?.amountPaid || 0,
        amountReceivedFee: data?.amountRecieved || 0,
        notes: data?.intakeNote,
        acquisitionWayId: data?.acquisitionWayId,
        acquisitionWayName: aqusitionIdToName[data?.acquisitionWayId],
        isDeleted: false,
        pcoId: data?.personOrRescueId ? data?.personOrRescueId : null,
      },
      birthMilestone: {
        isApproxDOB: !data?.birthDateFlag,
        milestoneType: 'birth',
        milestoneDate: getActualBirthdate(yrs, mos, days) || data?.birthDate,
        notes: data?.birthNote,
      },
    };
    const {
      numberOfAnimals, males, females, unknown,
    } = data;

    setSearchKey('');
    setSearchKeyFinal('');

    addAnimalCall({
      formData: newNewData, noOfAnimal: numberOfAnimals, noOfMale: males || 0, noOfFemale: females || 0, noOfUnknown: unknown || 0,
    }, (animalIds: any) => {
      uploadImageCall({
        imageState,
        animalId: animalIds,
        Entity: 'Animal',
        PublicityRank: 0,
        AttachmentDate: '2022-02-21 20:14:37.2420000',
        AttachmentType: 'Photo',
      }, () => {

      });
      setSelectedAnimal(animalIds);
      getAnimalListCall({ ...getAnimalFilter, searchText: '' }, () => console.log('get list of pco'));
      if (saveAnother) {
        form.resetFields();
        setImageState('');
        setCurrentAcquistionWayId('');
      } else if (saveAndClone) {
        console.log('Nothing Happen');
      } else {
        setAddModalVisibility(false);
        setImageState('');
        form.resetFields();
        setCurrentAcquistionWayId('');
      }
      setSaveAnother(false);
      setSaveAndClone(false);
    });
  };

  const getActualBirthdate = (yrs: number, mos: number, days: number) => {
    const birthDate = moment().subtract(yrs, 'years').subtract(mos, 'months').subtract(days, 'days');
    return birthDate;
  };

  const onCancel = () => {
    const data = form.getFieldsValue();
    let isFormChanged = false;
    if (!editRecord) {
      isFormChanged = (data?.animalName || data?.breed || data?.color || data.spayedOrNeutered || data?.description
        || data?.otherRescueID || data?.flag || data?.flagReason || data?.location || data?.personOrRescue
        || data?.otherRescueID || data?.otherRescueID || data?.amountPaid || data?.amountRecieved
        || data?.intakeNote || data?.personOrRescue || data?.actualAge || data?.birthNote);
    } else {
      const {
        animalName, animalTypeId, breed, sex, color, spayedOrNeutered, location, flag, flagReason, description, upload,
      } = editRecord;
      const intialRecord = {
        animalName, animalTypeId, breed, sex, color, spayedOrNeutered, location, flag, flagReason, description, upload,
      };
      isFormChanged = !(isEqual(intialRecord, form.getFieldsValue())) || imageState || (!existedImageUrl && existedImageId);
    }
    if (!isFormChanged) {
      setImageState('');
      form.resetFields();
      props.handleCancel();
      return;
    }

    confirm({
      title: 'Do you want to save your changes?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        editRecord ? handleUpdate() : form.submit();
      },
      onCancel() {
        setImageState('');
        form.resetFields();
        props.handleCancel();
      },
    });
  };

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
    const formField = form.getFieldsValue();
    form.setFieldsValue({ ...formField, personOrRescueId: selectedPcoId });
  }, [selectedPcoId]);

  const modalContent = (
    <Form
      id="animal-form"
      className={`${cssPrefix}__form`}
      form={form}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...layout}
      onFinish={() => { editRecord ? handleUpdate() : onSave(); }}
      name="nest-messages"
      scrollToFirstError
      validateMessages={validateMessages}
      size={'small' as SizeType}
    >
      <Row>
        <Col className={`${cssPrefix}__two-col-lyt`}>
          {!editRecord && (
            <Form.Item
              name="numberOfAnimals"
              label="Number of Animals"
              initialValue={1}
              rules={[{ required: true, type: 'number', min: 1 }]}
            >
              <InputNumber
                ref={(ref) => (firstError === 'numberOfAnimals') && ref && ref.focus()}
                onChange={(data) => setNoOfAnimal(data)}
                defaultValue={1}
                min={1}
              />
            </Form.Item>
          )}
          <Form.Item name="animalName" label="Name or Group Name" rules={[{ required: true }]}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="animalName" style={{ marginBottom: '0px' }}>
                  <Input
                    ref={(ref) => (firstError === 'animalName') && ref && ref.focus({ cursor: 'end' })}
                    placeholder="Enter Animal/Group Name"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button disabled={(noOfAnimal > 1)} key="generateName" type="default" loading={loading} onClick={() => generateName()}>
                  {generateNameBtn}
                  {nameSuggestionLoading && <LoadingOutlined spin />}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item initialValue={animalType[0]?.id} name="animalTypeId" label="Animal Type" rules={[{ required: true }]}>
            <Select
              ref={(ref) => (firstError === 'animalTypeId') && ref && ref.focus()}
              placeholder="Select a Animal Type"
            >
              {animalType.map((data) => (
                <Option key={data.id} value={data.id} onChange={() => forceUpdate({})}>{(noOfAnimal > 1) ? data.typeName : pluralToSingular(data.typeName)}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="breed" label="Breed or Species" rules={[{ required: true }]}>
            <Input
              ref={(ref) => (firstError === 'breed') && ref && ref.focus()}
              placeholder="Enter Breed or Species"
            />
            {/* <Select>
              {animalBreed.dog.map(({ key, value }: any) => (
                <Option key={kebabCase(key)} value={key}>{value}</Option>
              ))}
            </Select> */}
          </Form.Item>
          {!editRecord && (
            <Form.Item
              name="gender"
              label="Sex"
              style={{ marginBottom: 10 }}
              dependencies={['numberOfAnimals']}
              rules={[
                sexValidator,
              ]}
            >
              <Row>
                <Col style={{ marginRight: '5px', marginBottom: '5px' }}>
                  <div>Males</div>
                  <Form.Item name="males" style={{ marginBottom: '0px' }}>
                    <InputNumber
                      defaultValue={0}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col style={{ marginRight: '5px', marginBottom: '5px' }}>
                  <div>Females</div>
                  <Form.Item name="females" style={{ marginBottom: '0px' }}>
                    <InputNumber
                      defaultValue={0}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col style={{ marginBottom: '5px' }}>
                  <div>Unknown</div>
                  <Form.Item name="unknown" style={{ marginBottom: '0px' }}>
                    <InputNumber
                      defaultValue={0}
                      min={0}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          )}
          {editRecord && (
            <Form.Item name="sex" label="Sex" rules={[{ required: true }]}>
              <Select>
                {[{ id: 'Male', label: 'Male' }, { id: 'Female', label: 'Female' }, { id: 'Unknown', label: 'Unknown' }].map((data) => (
                  <Option key={data.id} value={data.id} onChange={() => forceUpdate({})}>{data.label}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
          {/* <Form.Item
            name="assignedAnimalId"
            label="Your Assigned ID"
            rules={[
              {
                pattern: /^[0-9]{1,40}$/,
                message: 'Assigned ID should be number',
              },
            ]}
          >
            <Input
              placeholder="Enter ID"
              suffix={(
                <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="bottom" title={AssignedIDValidationTooltip}>
                  <Typography.Link><InfoCircleOutlined /></Typography.Link>
                </Tooltip>
              )}
            />
          </Form.Item> */}
          <Form.Item name="color" label="Color" rules={[{ type: 'string', max: 30 }]}>
            <Input placeholder="Enter Color" />
          </Form.Item>
          <Form.Item name="description" label="My Story">
            <Input.TextArea placeholder="Input a story" />
          </Form.Item>
        </Col>
        <Col className={`${cssPrefix}__two-col-lyt`}>
          {/* <Form.Item
            name="upload"
            label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>Browse for Picture</Button>
            </Upload>
          </Form.Item> */}
          <SingleAvatarUpload
            setExistedImageUrl={setExistedImageUrl}
            existedImageUrl={existedImageUrl}
            visible={props.visible}
            setImageState={setImageState}
            imageState={imageState}
          />
          <Form.Item name="spayedOrNeutered" label="Spayed or Neutered" valuePropName="checked">
            <Switch onChange={() => forceUpdate({})} />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ type: 'string', max: 30 }]}>
            <Input
              placeholder="Enter Location"
              suffix={(
                <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="bottom" title={AnimalLocationTooltip} overlayInnerStyle={{ minWidth: '250px', maxWidth: '250px' }}>
                  <Typography.Link><InfoCircleOutlined /></Typography.Link>
                </Tooltip>
              )}
            />
          </Form.Item>
          <Form.Item label="Flag" style={{ marginBottom: 0 }}>
            <Row gutter={8}>
              <Col span={4}>
                <Form.Item name="flag" label="" valuePropName="checked">
                  <Switch
                    onChange={(data: any) => {
                      forceUpdate({});
                      setFlagReasonKey(Date.now());
                      if (!data) {
                        const formField = form.getFieldsValue();
                        form.setFieldsValue({ ...formField, flagReason: '' });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={20}>
                <Form.Item key={flagReasonKey} name="flagReason" label="Reason" rules={[{ required: form.getFieldValue('flag'), type: 'string' }]}>
                  <Input
                    key={flagReasonKey}
                    disabled={!(form.getFieldValue('flag'))}
                    placeholder="Reason For Flag"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>

      {!editRecord && (<Divider className={`${cssPrefix}__form__divider`} orientation="left">Birth Milestone</Divider>)}
      {!editRecord && (
        <Row>
          <Col className={`${cssPrefix}__two-col-lyt`}>
            <Form.Item
              name="approxAge"
              label="Approximate Age"
              style={{ marginBottom: 10 }}
              key={form.getFieldValue('birthDateFlag')}
              rules={[
                ({ getFieldValue }) => ({
                  required: !getFieldValue('birthDateFlag'),
                  validator() {
                    const actualDataflag = getFieldValue('birthDateFlag');
                    if (actualDataflag) {
                      return Promise.resolve();
                    }
                    const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                    const birthDate = moment().subtract(yrs, 'years').subtract(mos, 'months').subtract(days, 'days');
                    if (!birthDate) {
                      return Promise.reject(new Error('At least fill any one input'));
                    }
                    // if (!Number(yrs) || !Number(mos) || !Number(days)) {
                    //   return Promise.reject(new Error('All inputs should be number'));
                    // }
                    const [flag] = [getFieldValue('birthDateFlag')];
                    if (flag || (!flag && (yrs > 0 || mos > 0 || days > 0))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Either Approximate Age or Birth Date must be specified'));
                  },
                }),
              ]}
            >
              <Row>
                <Col style={{ marginRight: '5px', marginBottom: '5px' }}>
                  <div>yrs</div>
                  <Form.Item
                    name="yrs"
                    style={{ marginBottom: '0px' }}
                  >
                    <InputNumber ref={(ref) => (firstError === 'yrs') && ref && ref.focus()} defaultValue={0} min={0} max={100} disabled={form.getFieldValue('birthDateFlag')} />
                  </Form.Item>
                </Col>
                <Col style={{ marginRight: '5px', marginBottom: '5px' }}>
                  <div>mos</div>
                  <Form.Item
                    name="mos"
                    style={{ marginBottom: '0px' }}
                  >
                    <InputNumber defaultValue={0} min={0} max={12} disabled={form.getFieldValue('birthDateFlag')} />
                  </Form.Item>
                </Col>
                <Col style={{ marginBottom: '5px' }}>
                  <div>days</div>
                  <Form.Item
                    name="days"
                    style={{ marginBottom: '0px' }}
                  >
                    <InputNumber defaultValue={0} min={0} max={31} disabled={form.getFieldValue('birthDateFlag')} />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              name="actualAge"
              label="or Actual Birth Date"
              style={{ marginBottom: 0 }}
              key={`${form.getFieldValue('birthDateFlag')}-key`}
              rules={[
                ({ getFieldValue }) => ({
                  required: getFieldValue('birthDateFlag'),
                  validator() {
                    // const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                    const [flag, date] = [getFieldValue('birthDateFlag'), getFieldValue('birthDate')];
                    if ((flag && date) || !flag) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Either Approximate Age or Birth Date must be specified'));
                  },
                }),
              ]}
            >
              <Row gutter={8}>
                <Col span={4} style={{ marginBottom: '5px' }}>
                  <Form.Item name="birthDateFlag" label="" valuePropName="checked" style={{ marginBottom: '0px' }}>
                    <Switch defaultChecked={false} onChange={() => forceUpdate({})} />
                  </Form.Item>
                </Col>
                <Col span={20} style={{ marginBottom: '5px' }}>
                  <Form.Item name="birthDate" label="" rules={[{ type: 'date' }]} style={{ marginTop: 2, marginBottom: 0 }}>
                    <DatePicker format="MM-DD-yyyy" disabledDate={disabledDate} disabled={!form.getFieldValue('birthDateFlag')} />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col className={`${cssPrefix}__two-col-lyt`}>
            <Form.Item name="birthNote" label="Birth Notes">
              <Input.TextArea placeholder="Input any birth notes" />
            </Form.Item>
          </Col>
        </Row>
      )}

      {!editRecord && (<Divider className={`${cssPrefix}__form__divider`} orientation="left">Intake Milestone</Divider>)}
      {!editRecord && (
        <Row>
          <Col className={`${cssPrefix}__two-col-lyt`}>
            <Form.Item
              name="intakeDate"
              label="Date of Intake"
              initialValue={moment()}
              rules={[
                ({ getFieldValue }) => ({
                  required: true,
                  type: 'date',
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('Enter date of intake'));
                    }
                    const [yrs, mos, days] = [getFieldValue('yrs') || 0, getFieldValue('mos') || 0, getFieldValue('days') || 0];
                    const actualBirthDate = getActualBirthdate(yrs, mos, days);
                    const isBirthDate = getFieldValue('birthDateFlag');
                    if (isBirthDate && (getFieldValue('birthDate') >= value)) {
                      return Promise.reject(new Error('Intake date must be greater or same as Birth Date'));
                    }
                    if (!isBirthDate && (actualBirthDate >= value)) {
                      return Promise.reject(new Error('Intake date must be greater or same as Birth Date'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker format="MM-DD-yyyy" disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item
              initialValue={howAcquired[0]?.id}
              name="acquisitionWayId"
              label="How Acquired"
              rules={[{ required: true }]}
            >
              <Select
                ref={(ref) => (firstError === 'acquisitionWayId') && ref && ref.focus()}
                placeholder="Select a Acquistion Type"
                onChange={(data: any) => setCurrentAcquistionWayId(data)}
              >
                {howAcquired.map((data) => (
                  <Option key={data.id} value={data.id}>{data.acquisitionWayName}</Option>
                ))}
              </Select>
            </Form.Item>
            <Row>
              <Col lg={24}>
                {[aqusitionNameToId['Owner Surrender'], aqusitionNameToId?.Person, aqusitionNameToId?.Public].includes(currentAcquistionWayId) && (
                  <>
                    <PCOMinifiedScreen setFirstError={setFirstError} />
                    <Form.Item
                      name="personOrRescueId"
                      key={currentAcquistionWayId}
                      style={{ minHeight: '0px !important', marginBottom: '20px' }}
                      rules={[
                        {
                          required: [aqusitionNameToId['Owner Surrender'], aqusitionNameToId?.Person].includes(currentAcquistionWayId),
                          message: 'Person Or Rescue is required',
                        },
                      ]}
                    >
                      <Select
                        style={{ display: 'none' }}
                        disabled
                        ref={(ref) => (firstError === 'personOrRescue') && ref && ref.focus()}
                        placeholder="Select a Person or Rescue"
                        value={selectedPcoId}
                      >
                        {pcoList.map((data: any) => (
                          <Option
                            key={data?.id}
                            value={data?.id}
                            onChange={() => forceUpdate({})}
                          >
                            {`${data?.lastName} ${data?.firstName} / ${data?.street} / ${data?.city} / ${data?.state}`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                )}
              </Col>
              {/* <PlusOutlined style={{ marginLeft: '10px', marginTop: '5px', cursor: 'pointer' }} />
              <EditOutlined style={{ marginLeft: '10px', marginTop: '5px', cursor: 'pointer' }} /> */}
            </Row>
            {(currentAcquistionWayId === aqusitionNameToId['Other Rescue/Shelter/Sanctuary']) && (
              <Form.Item
                initialValue={otherRescueShelter[0]?.id}
                name="otherRescueShelterId"
                label="Other Rescue Shelters"
                rules={[
                  { required: true },
                ]}
              >
                <Select
                  ref={(ref) => (firstError === 'otherRescueShelterId') && ref && ref.focus()}
                  placeholder="Select a Other Rescue Shelters"
                >
                  {otherRescueShelter?.map((data: any) => (
                    <Option
                      key={data?.id}
                      value={data?.id}
                      onChange={() => forceUpdate({})}
                    >
                      {data?.otherRescueShelterName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item name="otherRescueID" label="ID No. at Other Rescue">
              <Input
                disabled={(currentAcquistionWayId !== aqusitionNameToId['Other Rescue/Shelter/Sanctuary'])}
                placeholder="Enter ID No. used at other rescue"
              />
            </Form.Item>
          </Col>
          <Col className={`${cssPrefix}__two-col-lyt`}>
            <Form.Item
              name="amountPaid"
              label="Amount Paid By You"
              rules={[
                ({ getFieldValue }) => ({
                  type: 'number',
                  validator(_, value) {
                    // Either amountPaid should be there or amountRecieved
                    const amountPaid = getFieldValue('amountPaid');
                    const amountRecieved = getFieldValue('amountRecieved');
                    if (amountRecieved) {
                      return Promise.resolve();
                    }
                    if (!amountPaid && !amountRecieved) {
                      return Promise.resolve();
                    }
                    if (Number(amountPaid) && Number(amountRecieved)) {
                      return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                    }
                    if (!Number(amountPaid) && !Number(amountRecieved)) {
                      return Promise.reject(new Error('Amount Received By You must be numeric'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                name="amountPaid"
                onClick={() => setFirstError('')}
                onChange={() => forceUpdate({})}
                disabled={form.getFieldValue('amountRecieved')}
                ref={(ref) => (firstError === 'amountPaid') && ref && ref.focus()}
              />
            </Form.Item>
            <Form.Item
              name="amountRecieved"
              label="Or Amount Received By You"
              rules={[
                ({ getFieldValue }) => ({
                  type: 'number',
                  validator(_, value) {
                    // Either amountPaid should be there or amountRecieved
                    const amountPaid = getFieldValue('amountPaid');
                    const amountRecieved = getFieldValue('amountRecieved');
                    if (amountPaid) {
                      return Promise.resolve();
                    }
                    if (!amountPaid && !amountRecieved) {
                      return Promise.resolve();
                    }
                    if (Number(amountPaid) && Number(amountRecieved)) {
                      return Promise.reject(new Error('Either Amount Paid or Received should be specified. Not Both.'));
                    }
                    if (!Number(amountPaid) && !Number(amountRecieved)) {
                      return Promise.reject(new Error('Amount Received By You must be numeric'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input
                name="amountRecieved"
                onClick={() => setFirstError('')}
                onChange={() => forceUpdate({})}
                disabled={form.getFieldValue('amountPaid')}
                ref={(ref) => (firstError === 'amountReceived') && ref && ref.focus()}
              />
            </Form.Item>
            <Form.Item name="intakeNote" label="Intake Notes">
              <Input.TextArea placeholder="Enter any Intake Notes" />
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form>
  );

  const footerContent = [
    <Button key="back" onClick={onCancel}>
      Cancel
    </Button>,
    <Button
      style={{ display: editRecord ? 'none' : 'inline' }}
      key="saveAndClone"
      type="primary"
      loading={loading}
      onClick={() => {
        setSaveAndClone(true);
        form.submit();
      }}
    >
      Save and Clone
      {saveAndClone && addAnimalLoading && <LoadingOutlined spin />}
    </Button>,
    <Button
      style={{ display: editRecord ? 'none' : 'inline' }}
      key="saveAnother"
      type="primary"
      loading={loading}
      onClick={() => {
        setSaveAnother(true);
        form.submit();
      }}
    >
      Save and Add Another
      {saveAnother && addAnimalLoading && <LoadingOutlined spin />}
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
      {(!saveAndClone && !saveAnother) && (updateAnimalLoading || addAnimalLoading) && <LoadingOutlined spin />}
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
        visible={props.visible}
        onOk={() => onSave()}
        onCancel={onCancel}
        footer={footerContent}
      >
        {modalContent}
      </Modal>
    </div>
  );
};
