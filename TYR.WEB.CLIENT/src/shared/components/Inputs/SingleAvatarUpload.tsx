/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Upload, Form, Button, Image, Modal, Row, Spin,
} from 'antd';
import {
  UploadOutlined, DeleteOutlined, EyeOutlined, Loading3QuartersOutlined,
} from '@ant-design/icons';
import { apiCall } from '../../../shared/api/apiWrapper';
import './SingleAvatarUpload.less';

const cssPrefix = 'single-avatar';

export interface SingleAvatarUploadProps {
  imageState: any,
  setImageState: any,
  visible?: boolean,
  setExistedImageUrl?: any,
  existedImageUrl?: any,
}

const SingleAvatarUpload = (props: SingleAvatarUploadProps) => {
  const {
    imageState, setImageState, visible, existedImageUrl, setExistedImageUrl,
  } = props;
  const [currentImageState, setCurrentImageState] = useState<any>();
  const [imageDimension, setImageDimension] = useState({
    height: 0,
    width: 0,
  });
  const [preview, setPreview] = useState(false);

  const LoaderIcon = <Loading3QuartersOutlined style={{ fontSize: 24 }} spin />;

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target: img }: { target: any }) => {
        resolve(reader.result);
      };
      reader.onerror = (error: any) => reject(error);
    });
  }

  // useEffect(() => {
  //   setCurrentImageState('');
  //   setImageState('');
  // }, [visible]);

  useEffect(() => {
    setCurrentImageState(existedImageUrl);
  }, [existedImageUrl]);

  useEffect(() => {
    setCurrentImageState('');
  }, [imageState]);

  const handleCancel = () => setCurrentImageState({ previewVisible: false });

  const handleDelete = () => {
    setCurrentImageState('');
    setExistedImageUrl('');
  };

  const handlePreview = () => {
    setPreview(true);
  };

  const handleChange = async ({ file }: { file: any }) => {
    const image = await getBase64(file.originFileObj);
    setCurrentImageState(image);
    setImageState(file.originFileObj);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <Form.Item
        name="upload"
        label={(
          <Upload
            onChange={handleChange}
            showUploadList={false}
            name="logo"
          >
            <Button icon={<UploadOutlined />}>Browse for Picture</Button>
          </Upload>
        )}
        className="form-div-avatar"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <div
          className="container-div"
          style={{
            display: 'flex',
            justifyContent: 'end',
            height: imageDimension?.height ? (imageDimension?.height + 18) : 180,
            marginBottom: '5px',
          }}
        >
          <span className="image-wrapper" style={{ position: 'absolute', width: 175 }}>
            {
              currentImageState ? (
                <>
                  <Image
                    onLoad={
                      ({ target: img }: { target: any }) => {
                        setImageDimension({ height: img?.height, width: img?.width });
                      }
                    }
                    preview={false}
                    src={currentImageState}
                    className="image-container"
                    style={{
                      objectFit: 'contain',
                      border: '0px dashed #8F8F8F',
                      maxWidth: 175,
                    }}
                  />
                  <div className="action-item" style={{ position: 'absolute', left: ((imageDimension?.width - 60) / 2), bottom: ((imageDimension?.height / 2) + 40) }}>
                    <Button onClick={() => handleDelete()} style={{ marginRight: '10px' }}>
                      <DeleteOutlined />
                    </Button>
                    <Button onClick={() => handlePreview()}>
                      <EyeOutlined />
                    </Button>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    Hover on image to perform action
                  </div>
                </>
              ) : (
                false ? (
                  <div
                    className="image-container"
                    style={{
                      border: '0px dashed #8F8F8F',
                      height: 175,
                      width: 175,
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      color: 'white',
                      fontSize: '15px',
                    }}
                  >
                    <div className="text-center">
                      <Spin indicator={LoaderIcon} />
                    </div>
                  </div>
                ) : (
                  <div
                    className="image-container"
                    style={{
                      border: '0px dashed #8F8F8F',
                      height: 175,
                      width: 175,
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      color: 'white',
                      fontSize: '15px',
                    }}
                  >
                    <div className="text-center">
                      <div className="text-center">
                        To Upload Image
                      </div>
                      <div className="text-center">
                        Click On Button
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </span>
        </div>
      </Form.Item>
      <Modal title="Image Preview" footer={false} visible={preview} onCancel={() => setPreview(false)}>
        <Row justify="center">
          <Image
            preview={false}
            src={currentImageState}
            className=""
            style={{
              objectFit: 'contain',
              border: '0px dashed #8F8F8F',
            }}
          />
        </Row>
      </Modal>
    </>
  );
};

export default SingleAvatarUpload;
