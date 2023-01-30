/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { FieldData } from 'rc-field-form/es/interface';
import {
  Button, Col, Form, Input, Select, Modal, Radio, Row, Switch, Tooltip, Typography, Upload, message,
} from 'antd';
import { isEqual, kebabCase } from 'lodash';
import {
  InfoCircleOutlined, UploadOutlined, LoadingOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { WebsiteValidationTooltip, PhoneValidationTooltip } from 'src/shared/constants/tooltips.data';
import alertConstant from '../../../shared/constants/alert.json';
import { AddFormData, TableData } from '../PCO.types';
import './PcoAddModal.less';
import CustomPhoneInput from '../../../shared/components/Inputs/CustomPhoneInput';
import { PERSON, ORG } from '../Pco.data';
import SingleAvatarUpload from '../../../shared/components/Inputs/SingleAvatarUpload';
import { apiCall } from '../../../shared/api/apiWrapper';

const { confirm } = Modal;

const { Option } = Select;

export interface PcoAddModalProps {
  minifiedVersion: boolean;
  editRecord?: TableData | null;
  visible: boolean;
  addPcoLoading: boolean;
  updatePcoLoading: boolean;
  getPcoFilter: any;
  userCountryCode: String;
  setSearchKey: (searchKey: string) => void;
  setSearchKeyFinal: (searchKey: string) => void;
  setAddModalVisibility: (isVisible: boolean) => void;
  setEditRecord: (data: any) => void;
  addPCOCall: (data: object, callbackFunction: any) => void;
  updatePCOCall: (data: object, callbackFunction: any) => void;
  getPcoListCall: (data: object, callbackFunction: any) => void;
  uploadImageCall?: any;
  deleteImageCall?: any,
  selectedPcoId?: any,
  setSelectedPco: (data: any) => void;
  handleCancel: () => void;
}

const cssPrefix = 'pco-add-modal';

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

const normFile = (e: any) => {
  /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
  // console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

interface CountryNameInterface {
  id: string;
  countryName: string;
}

export const PcoAddModal = (props: PcoAddModalProps) => {
  const newCountryNameInterface: CountryNameInterface[] = [];
  const [imageState, setImageState] = useState<any>();
  const [existedImageUrl, setExistedImageUrl] = useState<any>();
  const [existedImageId, setExistedImageId] = useState<any>();
  const [entityType, setEntityType] = useState(PERSON);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryList, setCountryList] = useState(newCountryNameInterface);
  const [selectCountry, setSelectCountry] = useState('');
  const [saveAnother, setSaveAnother] = useState(false);
  const [otherPhoneNumber, setOtherPhoneNumber] = useState('');
  const [flagReasonKey, setFlagReasonKey] = useState(Date.now());
  const [highlightKey, setHighlightKey] = useState<any>('');
  const [hightlightField, setHighlightField] = useState<any>();
  const [, forceUpdate] = useState({});
  const [tempForm, setTempForm] = useState<any>({});

  const {
    addPCOCall, updatePCOCall, getPcoListCall, setAddModalVisibility,
    addPcoLoading, updatePcoLoading, visible, editRecord, getPcoFilter,
    setEditRecord, userCountryCode, minifiedVersion, setSearchKeyFinal,
    setSearchKey, setSelectedPco, uploadImageCall, selectedPcoId, deleteImageCall,
  } = props;

  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  };

  useEffect(() => {
    let errorField = '';
    setTimeout(() => {
      form.getFieldsError()?.map((data: any) => {
        if (errorField) {
          return '';
        }
        if (data?.errors[0]) {
          errorField = data?.name[0];
          setHighlightField(data?.name[0]);
        }
        return '';
      });
    }, 500);
  }, [highlightKey]);

  useEffect(() => {
    if (!editRecord?.id) {
      return;
    }
    apiCall(`artifact-attachment/get-artifactattachment-bypco/${editRecord?.id}`, 'GET', {})
      .then((resp: any) => {
        setExistedImageUrl(resp?.data?.data?.artifactAttachment?.blobUrl);
        setExistedImageId(resp?.data?.data?.artifactAttachment?.id);
      });
  }, [editRecord]);

  const countryId = localStorage.getItem('countryId');

  const ifEditMode: boolean = Boolean(props.editRecord && props.editRecord.key) || false;
  const modalTitle: string = editRecord ? `Edit ${props.editRecord!.firstName} ${props.editRecord!.lastName}`
    : `Add Person${!minifiedVersion ? ', Company or Organization' : ''}`;

  const [form] = Form.useForm();

  useEffect(() => {
    onEntityChange(editRecord?.entityType || 'Person');
    setHighlightField('firstName');
    forceUpdate({});
    form.setFieldsValue({ countryCode: userCountryCode });
    form.setFieldsValue({ ...editRecord });
    if (!visible) {
      setImageState('');
      setExistedImageUrl('');
      setExistedImageId('');
      form.resetFields();
      setEditRecord(null);
    } else {
      setSelectedPco('');
    }
  }, [visible]);

  useEffect(() => {
    const data = {};
    apiCall('country/get-country', 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setCountryList(resp?.data?.data?.countries);
        }
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    const selectedCountryName = countryList.find(o => o.id == countryId);
    setSelectCountry(selectedCountryName?.countryName || '');
  }, [countryList]);

  const onSearch = (val: string) => {
    // const searchedCountries = countryList.filter((o) => {
    //   const regex = new RegExp(val, 'g');
    //   return (o.countryName.match(regex));
    // });
    // setCountryList([...searchedCountries]);
  };

  const onChangeDropDown = (e: any) => {
    setSelectCountry(e);
  };

  const onEntityChange = (currentEntityType: string) => {
    setEntityType(currentEntityType);
    if (currentEntityType === ORG) {
      form.setFieldsValue({
        firstName: '',
        rescueContact: '',
        contact: '',
        hospital: false,
        rescue: false,
      });
    }
    const updatedFields = form.getFieldsError()
      .filter((field) => field.errors.length > 0)
      .map((field) => ({ name: field.name, errors: [] }));
    form.setFields(updatedFields as unknown as FieldData[]);
  };

  const onFlagChange = (flag: boolean) => {
    setFlagReasonKey(Date.now());
    if (!flag) {
      form.setFieldsValue({
        flagReason: '',
      });
    }
    forceUpdate({});
  };

  const addConfirmPco = (addPcoMessage: string) => (
    <div className="">
      <p>
        {addPcoMessage}
      </p>
      <Button type="primary" onClick={() => onSave({ addAnother: false, forceAdd: true })}>
        Add Anyway
        {addPcoLoading && <LoadingOutlined spin />}
      </Button>
    </div>
  );

  const onSave = ({ addAnother, forceAdd }: { addAnother?: boolean, forceAdd?: boolean } = { addAnother: false, forceAdd: false }) => {
    const data = form.getFieldsValue();
    const formData = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      street: data?.street,
      street2: data?.street2,
      city: data?.city,
      state: data?.state,
      zip: data?.zip,
      countryId: localStorage.getItem('countryId'),
      phone: phoneNumber,
      otherPhone: otherPhoneNumber,
      email: data?.email,
      // eslint-disable-next-line no-unneeded-ternary
      mailList: data?.mailList ? true : false,
      website: data?.website,
      contact: data?.contact || '',
      rescueContact: data?.rescueContact || '',
      notes: data?.notes,
      entityType: entityType ?? data?.entityType,
      hospital: true,
      rescue: true,
      flag: data?.flag,
      flagReason: data?.flagReason || '',
      isDeleted: false,
    };

    addPCOCall({ formData, forceAdd, addConfirmPco }, (pcoId: any) => {
      uploadImageCall({
        imageState,
        pcoId,
        Entity: 'PCO',
        PublicityRank: 0,
        AttachmentDate: new Date(),
        AttachmentType: 'Photo',
      }, () => {

      });
      getPcoListCall({ ...getPcoFilter }, () => console.log('get list of pco'));
      if (addAnother) {
        form.resetFields();
        setImageState('');
      } else {
        setAddModalVisibility(false);
      }
    });
  };

  const onFinishFailed = () => {
    message.error({
      content: alertConstant.validation_error_massage,
      style: {
        marginTop: '2vh',
      },
      key: 'updatable',
    });
  };

  const onUpdate = () => {
    const data = form.getFieldsValue();
    const newEditRecord = {
      id: editRecord?.id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      street: data?.street,
      street2: data?.street2,
      city: data?.city,
      state: data?.state,
      zip: data?.zip,
      countryId: data?.countryId,
      phone: phoneNumber,
      otherPhone: otherPhoneNumber,
      email: data?.email,
      // eslint-disable-next-line no-unneeded-ternary
      mailList: data?.mailList ? true : false,
      website: data?.website,
      contact: data?.contact || '',
      rescueContact: data?.rescueContact || '',
      notes: data?.notes,
      entityType: data?.entityType,
      hospital: true,
      rescue: true,
      flag: data?.flag,
      flagReason: data?.flagReason || '',
      isDeleted: false,
    };

    updatePCOCall(newEditRecord, () => {
      console.log(imageState, '---------', existedImageId);
      if (imageState) {
        uploadImageCall({
          imageState,
          pcoId: editRecord?.id,
          Entity: 'PCO',
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

  const onCancel = () => {
    const currentFormData = form.getFieldsValue();
    let isFormChanged = false;
    if (!editRecord) {
      isFormChanged = (
        currentFormData?.city || currentFormData?.email || currentFormData?.entityType || currentFormData?.firstName
        || currentFormData?.lastName || currentFormData?.notes || currentFormData?.otherPhone
        || currentFormData?.phone || currentFormData?.state || currentFormData?.street || currentFormData?.street2
        || currentFormData?.zip || imageState
      );
    } else {
      const {
        city, email, firstName, id, lastName, mailList, notes, otherPhone, phone,
        state, street, street2, zip, flag, flagReason, contact, rescueContact, website,
      } = currentFormData;
      const intialRecord = {
        city,
        email,
        entityType: editRecord?.entityType,
        firstName,
        lastName,
        mailList,
        notes,
        otherPhone,
        phone,
        state,
        street,
        street2,
        zip,
        flag,
        flagReason,
        contact,
        rescueContact,
        countryId: currentFormData?.countryId,
        website,
      };
      console.log(imageState, '-------------', existedImageId);
      isFormChanged = !(isEqual(editRecord, { ...intialRecord, id: editRecord?.id })) || imageState || (!existedImageUrl && existedImageId);
    }
    if (!isFormChanged) {
      form.resetFields();
      setImageState('');
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
        (editRecord?.id) ? onUpdate() : onSave();
      },
      onCancel() {
        form.resetFields();
        setImageState('');
        props.handleCancel();
      },
    });
  };

  const footerContent = [
    <Button key="back" onClick={onCancel}>
      Cancel
    </Button>,
    <Button
      style={{ display: (editRecord || minifiedVersion) ? 'none' : 'inline' }}
      htmlType="submit"
      key="saveAnother"
      type="primary"
      // loading={loading}
      onClick={() => {
        setSaveAnother(true);
        form.submit();
      }}
    >
      Save and Add Another
      {saveAnother && addPcoLoading && <LoadingOutlined spin />}
    </Button>,
    <Button
      form="pco-form"
      htmlType="submit"
      key="submit"
      type="primary"
      onClick={() => {
        setSaveAnother(false);
        setHighlightKey(Date.now());
      }}
    >
      Save
      {!saveAnother && (addPcoLoading || updatePcoLoading) && <LoadingOutlined spin />}
    </Button>,
  ];

  const modalContent = (
    <Form
      id="pco-form"
      className={`${cssPrefix}__form`}
      form={form}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...layout}
      onFinish={() => { editRecord ? onUpdate() : onSave({ addAnother: saveAnother, forceAdd: false }); }}
      name="nest-messages"
      validateMessages={validateMessages}
      onFinishFailed={onFinishFailed}
      scrollToFirstError
      size="small"
    >
      <Row justify="start" style={{ paddingRight: '20px' }}>
        <Col lg={12}>
          {!minifiedVersion && (
            <Form.Item name="entityType" label="Entity Type">
              <Radio.Group onChange={(e) => onEntityChange(e.target.value)} defaultValue={entityType}>
                <Row>
                  <Col>
                    <Radio value={PERSON}>Person</Radio>
                  </Col>
                  <Col>
                    <Radio value={ORG}>Company or Organization</Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item name="firstName" label="First Name">
            <Input
              disabled={entityType === ORG}
              placeholder="Enter First Name"
              ref={(ref) => (hightlightField === 'firstName') && ref && ref.focus()}
            />
          </Form.Item>
          <Form.Item name="lastName" label={entityType === ORG ? 'Name' : 'Last Name'} rules={[{ required: true }]}>
            <Input
              placeholder={entityType === ORG ? 'Enter Company/Organization Name' : 'Enter Last Name'}
              ref={(ref) => (hightlightField === 'lastName') && ref && ref.focus()}
            />
          </Form.Item>
          <Form.Item name="street" label="Street">
            <Input placeholder="Enter Street Info" />
          </Form.Item>
          {!minifiedVersion && (
            <Form.Item name="street2" label="Street 2">
              <Input placeholder="Enter Additional Street Info" />
            </Form.Item>
          )}
          <Form.Item name="city" label="City">
            <Input placeholder="Enter City Name" />
          </Form.Item>
          <Form.Item
            name="countryId"
            key="countryId"
            label="Country"
          >
            <Select
              onSearch={onSearch}
              showSearch
              onChange={onChangeDropDown}
              defaultValue={selectCountry}
              filterOption={(input, option) => option?.children.toLowerCase().startsWith(input.toLowerCase())}
            >
              {countryList?.map((data) => (
                <Option key={kebabCase(data.id)} value={data?.id}>{data?.countryName}</Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Input.Group>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name={['countryCode']}
                  label="Country Code"
                  required
                  rules={[
                    {
                      required: true,
                    },
                    {
                      pattern: /^[A-Za-z]{2,3}$/,
                      message: 'Country code should be text with two or three character',
                    },
                  ]}
                >
                  <Input
                    disabled
                    name="countryCode"
                    key="countryCode"
                    placeholder="Enter Country Code"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['country']}
                  label="Country Name"
                >
                  <Input
                    name="country"
                    key="country"
                    placeholder="Enter Country Name"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Input.Group> */}
          {/* <Form.Item name="country" label="Country">
            <Input placeholder="Country" />
          </Form.Item> */}
          <Form.Item
            name="state"
            label="State, Province, or Locality Code"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^.{1,2}$/,
                message: 'State must not be more than two characters',
              },
            ]}
          >
            <Input placeholder="Enter State" ref={(ref) => (hightlightField === 'state') && ref && ref.focus()} />
          </Form.Item>
          <Form.Item
            name="zip"
            label="Zip/Postal Code"
          >
            <Input placeholder="Enter ZIP Code" />
          </Form.Item>
          <CustomPhoneInput required={false} name="phone" label="Phone" phoneNumber={phoneNumber} setPhoneNumber={(e) => setPhoneNumber(e)} />
          {!minifiedVersion && <CustomPhoneInput required={false} name="otherPhone" label="Other Phone" phoneNumber={otherPhoneNumber} setPhoneNumber={(e) => setOtherPhoneNumber(e)} />}
          <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
            <Input placeholder="Enter Email" />
          </Form.Item>
        </Col>
        <Col lg={12}>
          {!minifiedVersion && (
            <SingleAvatarUpload
              setExistedImageUrl={setExistedImageUrl}
              existedImageUrl={existedImageUrl}
              visible={visible}
              imageState={imageState}
              setImageState={setImageState}
            />
          )}
          <Form.Item name="mailList" initialValue label="Mail List?" valuePropName="checked" rules={[{ type: 'boolean' }]}>
            <Switch defaultChecked />
          </Form.Item>
          {!minifiedVersion && (
            <>
              <Form.Item name="website" label="Website, Facebook, or other URL">
                <Input
                  suffix={(
                    <Tooltip overlayClassName={`${cssPrefix}__form__tooltip`} placement="bottom" title={WebsiteValidationTooltip}>
                      <Typography.Link><InfoCircleOutlined /></Typography.Link>
                    </Tooltip>
                  )}
                  className={`${cssPrefix}__form__input`}
                  placeholder="Enter Website, Facebook, or any other URL"
                />
              </Form.Item>
              <Form.Item name="rescueContact" label=" Rescue Contact">
                <Input disabled={entityType === PERSON} placeholder="Enter Rescue Contact Information" />
              </Form.Item>
              <Form.Item name="contact" label=" Contact Person at Company or Organization">
                <Input disabled={entityType === PERSON} placeholder="Contact Person at Company or Organization" />
              </Form.Item>
              <Form.Item name="flag" label=" Flag" valuePropName="checked">
                <Switch onChange={onFlagChange} />
              </Form.Item>
              <Form.Item key={flagReasonKey} name="flagReason" label="Flag Reason" rules={[{ required: form.getFieldValue('flag'), type: 'string' }]}>
                <Input.TextArea disabled={!form.getFieldValue('flag')} ref={(ref) => (hightlightField === 'flagReason') && ref && ref.focus()} placeholder="Reason to Flag Person/Organization" />
              </Form.Item>
              <Form.Item name="notes" label=" Notes">
                <Input.TextArea placeholder="Additional Notes or Any Other Texts" />
              </Form.Item>
            </>
          )}
        </Col>
      </Row>
    </Form>
  );

  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <div className={`${cssPrefix}`}>
      <Modal
        className={`${cssPrefix}${minifiedVersion ? '__modal_minified' : '__modal'}`}
        centered
        title={<span className={`${cssPrefix} __modal__title`}>{modalTitle}</span>}
        visible={props.visible}
        okText="Save"
        onOk={form.submit}
        onCancel={onCancel}
        footer={footerContent}
      >
        {modalContent}
      </Modal>
    </div>
  );
};
