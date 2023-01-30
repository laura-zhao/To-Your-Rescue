/* eslint-disable no-unused-vars */
import { message } from 'antd';
import { apiCall } from '../../shared/api/apiWrapper';
import { commonActionTypes } from './types';

const getCountLoading = (data: any) => ({
  type: commonActionTypes.GET_COUNT_LOADING,
  payload: data,
});

const getCountSuccess = (data: any) => ({
  type: commonActionTypes.GET_COUNT_SUCCESS,
  payload: data,
});

export const getCountCall = (data: any, callbackFunction: () => void) => {
  console.log(data);

  return (dispatch: any, getSate: any) => {
    dispatch(getCountLoading(true));
    apiCall('dashboard/get-count', 'GET', data)
      .then((resp: any) => {
        dispatch(getCountLoading(false));
        if (resp.status !== 200) {
          getCountSuccess(false);
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        // resp?.data?.message && message.success({
        //   content: resp?.data?.message,
        //   style: {
        //     marginTop: '2vh',
        //   },
        //   key: 'updatable',
        // });
        dispatch(getCountSuccess(resp?.data?.data));
        callbackFunction();
      });
  };
};

const uploadImageLoading = (data: any) => ({
  type: commonActionTypes.UPLOAD_IMAGE_LOADING,
  payload: data,
});

const uploadImageSuccess = (data: any) => ({
  type: commonActionTypes.UPLOAD_IMAGE_SUCCESS,
  payload: data,
});

export const uploadImageCall = (data: any, callbackFunction: () => void) => {
  const {
    imageState,
    animalId,
    pcoId,
    Entity,
    PublicityRank,
    AttachmentDate,
    AttachmentType,
  } = data;

  return (dispatch: any, getSate: any) => {
    if (!imageState) {
      return;
    }
    let url = 'artifact-attachment/create-artifactattachment';
    dispatch(uploadImageLoading(true));
    const newFormData = new FormData();
    newFormData.set('Imagefiles', imageState);
    if (pcoId) {
      newFormData.set('pcoId', pcoId);
    }
    if (animalId) {
      if (animalId.length > 1) {
        url = 'artifact-attachment/create-maultiple-artifactattachment';
        // eslint-disable-next-line array-callback-return
        animalId.map((id: any) => {
          newFormData.append('ListAnimalId', id);
        });
      } else {
        newFormData.set('animalId', animalId?.[0]);
      }
    }
    newFormData.set('Entity', Entity);
    newFormData.set('PublicityRank', PublicityRank);
    newFormData.set('AttachmentDate', new Date().toDateString());
    newFormData.set('AttachmentType', AttachmentType);

    apiCall(url, 'POST', newFormData)
      .then((resp: any) => {
        dispatch(uploadImageSuccess(resp?.data?.data?.id));
        // if (!resp?.data?.success && imageState.entityType === 'Person') {
        //   resp?.data?.errors?.[0] && message.error({
        //     content: addConfirmPco(resp.data.errors[0]),
        //     style: {
        //       marginTop: '2vh',
        //     },
        //     key: 'updatable',
        //     duration: 15,
        //   });
        //   return;
        // }
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction();
        resp?.data?.message && message.success({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };
};

const deleteImageLoading = (data: any) => ({
  type: commonActionTypes.DELETE_IMAGE_LOADING,
  payload: data,
});

const deleteImageSuccess = (data: any) => ({
  type: commonActionTypes.DELETE_IMAGE_SUCCESS,
  payload: data,
});

export const deleteImageCall = (data: any, callbackFunction: () => void) => {
  const {
    id,
  } = data;

  return (dispatch: any, getSate: any) => {
    if (!id) {
      return;
    }

    dispatch(deleteImageLoading(true));
    apiCall(`artifact-attachment/delete-artifactattachment/${id}`, 'PATCH', {})
      .then((resp: any) => {
        dispatch(deleteImageSuccess(resp?.data?.data?.id));
        // if (!resp?.data?.success && imageState.entityType === 'Person') {
        //   resp?.data?.errors?.[0] && message.error({
        //     content: addConfirmPco(resp.data.errors[0]),
        //     style: {
        //       marginTop: '2vh',
        //     },
        //     key: 'updatable',
        //     duration: 15,
        //   });
        //   return;
        // }
        if (resp.status !== 200) {
          resp?.data?.message && message.error({
            content: resp?.data?.message,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
          return;
        }
        callbackFunction();
        resp?.data?.message && message.success({
          content: resp?.data?.message,
          style: {
            marginTop: '2vh',
          },
          key: 'updatable',
        });
      });
  };
};
