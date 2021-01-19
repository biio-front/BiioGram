import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImagesRequest } from '../redux/post/postSlice';

const useUploadImages = () => {
  const dispatch = useDispatch();
  const onFileChange = useCallback((e) => {
    const { files } = e.target;
    const imageFormData = new FormData();
    [].forEach.call(files, (file) => {
      imageFormData.append('image', file);
    });
    dispatch(uploadImagesRequest(imageFormData));
  }, []);

  const imageInput = useRef();
  const onImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  return [onFileChange, imageInput, onImageUpload];
};

export default useUploadImages;
