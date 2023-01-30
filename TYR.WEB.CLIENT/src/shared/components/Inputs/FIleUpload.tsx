/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Upload, Form, Button, Image, Modal, Row,
} from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './SingleAvatarUpload.less';

const cssPrefix = 'single-avatar';

const AttachementFileUpload = () => {
  const [imageState, setImageState] = useState<any>();
  const [imageDimension, setImageDimension] = useState({
    height: 0,
    width: 0,
  });
  const [preview, setPreview] = useState(false);

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

  const handleCancel = () => setImageState({ previewVisible: false });

  const handleDelete = () => {
    setImageState('');
  };

  const handlePreview = () => {
    setPreview(true);
  };

  const handleChange = async ({ file }: { file: any }) => {
    const image = await getBase64(file.originFileObj);
    setImageState(image);
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
            {imageState ? (
              <>
                <Image
                  onLoad={
                    ({ target: img }: { target: any }) => {
                      setImageDimension({ height: img?.height, width: img?.width });
                    }
                  }
                  preview={false}
                  src={imageState}
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
            )}
          </span>
        </div>
      </Form.Item>
      <Modal title="Image Preview" footer={false} visible={preview} onCancel={() => setPreview(false)}>
        <Row justify="center">
          <Image
            preview={false}
            src={imageState}
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

export default AttachementFileUpload;
