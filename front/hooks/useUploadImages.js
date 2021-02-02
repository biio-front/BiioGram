import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  uploadAvatarImageRequest,
  uploadPostImagesRequest,
} from '../redux/image/imageSlice';

const useUploadImages = (what) => {
  const dispatch = useDispatch();
  const onFileChange = useCallback((e) => {
    const { files } = e.target;
    const imageFormData = new FormData();
    [].forEach.call(files, (file) => {
      imageFormData.append('image', file);
    });
    if (what === 'post') {
      dispatch(uploadPostImagesRequest(imageFormData));
    } else if (what === 'avatar') {
      dispatch(uploadAvatarImageRequest(imageFormData));
    }
  }, []);

  const imageInput = useRef();
  const onImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  return [onFileChange, imageInput, onImageUpload];
};

export default useUploadImages;
