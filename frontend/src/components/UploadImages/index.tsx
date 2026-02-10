import React, { useEffect, useState } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PropTypes } from './interfaces';

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // reader.onload = () => resolve(reader.result);
    reader.onload = () => resize(file, resolve);
    reader.onerror = (error) => reject(error);
  });
}

var MAX_WIDTH = 800;
var MAX_HEIGHT = 600;

function resize(image: any, callback: any) {
  //criamos img que será a nossa imagem nova
  const img = new Image();

  //criamos um reader que lerá a nossa imagem
  const reader = new FileReader();


  //vamos escrever o método do onload do reader
  //porque ele é chamado no momento em que é finalizado a carregamento da imagem
  reader.onload = (e: any) => {
    img.src = e.target.result;

    //quando a imagem fora carregada após receber o a linha superior
    img.onload = () => {
      //criamos um canvas
      const canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      //desenhamos a imagem na posição (0,0)
      ctx?.drawImage(img, 0, 0);

      //fazemos calculos para saber  qual lado é maior e reduzir na propoção certa
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
      //definimos tamanho do canvas no mesmo tamanho que a imagem já reduzida
      canvas.width = width;
      canvas.height = height;
      //pegamos o contexto do canvas
      ctx = canvas.getContext('2d');

      //desenhamos a nova imagem passando a imagem, a posição de inicio e o tamanho
      ctx?.drawImage(img, 0, 0, width, height);

      //aqui é onde a magia acontece,

      // primeiro convertemos a imagem desenhada pelo canvas para o formato Blob
      // o primeiro parametro é a função de callback que ele irá chamar após converte,
      // o segundo o type da imagem
      // e o terceiro é a qualidade variando de 0 a 1   
      callback(ctx?.canvas.toDataURL(image.type, 0.8));
    };
  };

  reader.readAsDataURL(image);
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
