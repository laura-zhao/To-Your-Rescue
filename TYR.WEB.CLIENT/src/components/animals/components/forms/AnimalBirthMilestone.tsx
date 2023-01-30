/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import {
  Col, DatePicker, Form, Input, InputNumber, Row, Switch, Radio,
} from 'antd';
import { useEffect, useState } from 'react';
import '../AnimalsAddModal.less';
import moment, { Moment } from 'moment';
import { isEqual } from 'lodash';

interface AnimalBirthMilestoneProps {
  form: any;
  firstError: any;
  animalMilestoneList: any;
}

const cssPrefix = 'animals-add-modal';

export const BirthMilestoneForm = (props: AnimalBirthMilestoneProps) => {
  // eslint-disable-next-line no-empty-pattern
  const { form, firstError, animalMilestoneList } = props;
  const [, forceUpdate] = useState({});

  // Can not select days after today
  const disabledDate = (current: Moment) => current && current > moment().endOf('day');

  useEffect(() => {
    console.log(form, '---------');
  }, [form]);

  useEffect(() => {
    forceUpdate({});
  }, []);

  return (
    <div className="">
      <Row>
        <Col className={`${cssPrefix}__two-col-lyt`}>
          <Form.Item
            name="actualAge"
            label={`${JSON.parse(form.getFieldValue('isApproxDOB')) ? 'Approximate' : 'Actual'} Birth Date`}
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
              <Col span={10} style={{ marginBottom: '5px' }}>
                <Form.Item
                  name="birthDate"
                  label=""
                  style={{ marginTop: 2, marginBottom: 0 }}
                  rules={[
                    ({ getFieldValue }) => ({
                      required: true,
                      type: 'date',
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(new Error('Enter Birth Date'));
                        }
                        const newIntakeDate = moment(animalMilestoneList?.[1]?.milestoneDate);
                        const birthDate = moment(value);
                        console.log(newIntakeDate, '--------', birthDate, '--------', newIntakeDate.isBefore(birthDate));

                        if (moment(newIntakeDate).isBefore(birthDate)) {
                          return Promise.reject(new Error('Birth Date must be less than or same as Intake Date'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker format="MM-DD-yyyy" disabledDate={disabledDate} />
                </Form.Item>
              </Col>
              <Col span={12} style={{ marginBottom: '5px' }}>
                <Form.Item name="isApproxDOB">
                  <Radio.Group defaultValue="false">
                    <Row>
                      <Col>
                        <Radio onChange={() => forceUpdate({})} value="true">Approximate Birth Date</Radio>
                      </Col>
                      <Col>
                        <Radio onChange={() => forceUpdate({})} value="false">Actual Birth Date</Radio>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col />
        <Col className={`${cssPrefix}__two-col-lyt`}>
          <Form.Item name="birthNote" label="Birth Notes">
            <Input.TextArea placeholder="Input any birth notes" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
