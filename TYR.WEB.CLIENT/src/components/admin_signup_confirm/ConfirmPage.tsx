/* eslint-disable no-template-curly-in-string */
import {
  useEffect, useRef, FC, useState,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Row, Col, Button,
} from 'antd';
import { InviteProps } from './ConfirmPage.types';
import './ConfirmPage.less';

const cssPrefix = 'ftr-invite';

// eslint-disable-next-line no-unused-vars
export const ConfirmPage: FC<InviteProps> = (newInviteProps) => {
  const {
    verifySignupByToken, verifySignupByTokenLoading,
  } = newInviteProps;
  const [errorMessage, setErrorMessage] = useState<any>('');
  const navigate = useNavigate();

  const titleRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    titleRef.current?.scrollIntoView();
  }, [titleRef]);

  const callbackAfterGettingDetail = (currentMessage: string) => {
    setErrorMessage(currentMessage);
  };

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    verifySignupByToken({ token, email }, (currentMessage: string) => { callbackAfterGettingDetail(currentMessage); });
  }, []);

  return (
    <div className={`${cssPrefix}`} ref={titleRef}>
      {verifySignupByTokenLoading && (<Row justify="center"><p>Verifying Account ...</p></Row>)}
      {(!verifySignupByTokenLoading && !errorMessage) && (
        <div>
          <Row justify="center">
            <Col className="text-muted">Account Confirmed, Thank You !</Col>
          </Row>
          <br />
          <Row justify="center">
            <Button onClick={() => navigate('/login')}>Back To Login</Button>
          </Row>
        </div>
      )}
      {(!verifySignupByTokenLoading && errorMessage) && (
        <Row justify="center" style={{ color: 'red' }}>
          <Col className="text-muted">{errorMessage || 'Verification Failed !'}</Col>
        </Row>
      )}
    </div>
  );
};
