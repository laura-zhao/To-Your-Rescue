/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Col, DatePicker, Form, Input, Row, Select,
} from 'antd';
import { useEffect, useState } from 'react';
import '../AnimalsAddModal.less';
import moment, { Moment } from 'moment';
import { isEqual } from 'lodash';
import { apiCall } from '../../../../shared/api/apiWrapper';
import PCOMinifiedScreen from '../minifiedPcoScreen';

interface AnimalBirthMilestoneProps {
  form: any;
  firstError: any;
  setFirstError: any;
  animalMilestoneList: any;
}

interface AcquisitionWay {
  id: string;
  acquisitionWayName: string;
}

const { Option } = Select;
const cssPrefix = 'animals-add-modal';

export const AnimalIntakeMilestone = (props: AnimalBirthMilestoneProps) => {
  // eslint-disable-next-line no-empty-pattern
  const {
    form, firstError, setFirstError, animalMilestoneList,
  } = props;
  const newAcquisitionWay: AcquisitionWay[] = [];
  const [, forceUpdate] = useState({});
  const [howAcquired, setHowAcquired] = useState(newAcquisitionWay);
  const [otherRescueShelter, setOtherRescueShelter] = useState<any>([]);
  const [aqusitionNameToId, setAqusitionNameToId] = useState<any>({});
  const [aqusitionIdToName, setAqusitionIdToName] = useState<any>({});
  const [currentAcquistionWayId, setCurrentAcquistionWayId] = useState('');

  // Can not select days after today
  const disabledDate = (current: Moment) => current && current > moment().endOf('day');

  useEffect(() => {
    forceUpdate({});
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
    setCurrentAcquistionWayId(animalMilestoneList[1]?.acquisitionWayId || '');
  }, [animalMilestoneList]);

  return (
    <div className="">
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
                    return Promise.reject(new Error('Enter Date in Intake'));
                  }
                  const birthDate = moment(animalMilestoneList?.[0]?.milestoneDate).format('MM-DD-yyyy');
                  const newIntakeDate = moment(value).format('MM-DD-yyyy');
                  console.log(birthDate, '------=====-----', newIntakeDate);
                  if (moment(newIntakeDate).isBefore(birthDate)) {
                    return Promise.reject(new Error('Intake date must be greater than or same as Birth Date'));
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
    </div>
  );
};
