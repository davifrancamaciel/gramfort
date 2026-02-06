import React, { useEffect, useState } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PropTypes } from './interfaces';

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function resize(file: any) {
  return new Promise((resolve, reject) => {
    var MAX_WIDTH = 800;
    var MAX_HEIGHT = 600;

    const img = new Image();
    img.src = file;

    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    img.onload = () => {
      // cria canvas com dimensões desejadas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      // desenha a imagem redimensionada
      ctx?.drawImage(img, 0, 0, width, height);

      // retorna como base64 (pode usar toBlob se preferir)
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = (err) => reject(err);
  });
}

const UploadImages: React.FC<PropTypes> = (props) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [maxCount, setMaxCount] = useState(1);

  useEffect(() => {
    props.maxCount && setMaxCount(props.maxCount);
  }, [props.maxCount]);

  const handleChange = async (file: any) => {
    var files = [];
    if (file.file.status == 'done') {
      for (let i = 0; i < file.fileList.length; i++) {
        const element = file.fileList[i];
        const preview = await getBase64(element.originFileObj);
        // const d = await resize(preview);
        // console.log(d)
        files.push({ ...element, preview, thumbUrl: preview });
      }
      props.setFileList(files);
    } else {
      props.setFileList(file.fileList);
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const customRequest = (file: any) => {
    setTimeout(() => {
      file.onSuccess('ok');
    }, 0);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={props.fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={true}
        accept="image/x-png,image/jpeg,image/jeg"
        maxCount={props.maxCount}
        customRequest={customRequest}
      >
        {props.fileList.length < maxCount && uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadImages;
