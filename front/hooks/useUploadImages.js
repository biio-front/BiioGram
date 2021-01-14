import { useCallback, useRef, useState } from 'react';

const useUploadImages = (initialState) => {
  const [images, setImage] = useState(initialState);
  const onFileChange = useCallback((e) => {
    const { files } = e.target;
    let imageArr = [];
    Array.prototype.forEach.call(files, (file, i) => {
      const reader = new FileReader();
      reader.onload = (finishedEvent) => {
        const { result } = finishedEvent.currentTarget;
        imageArr.push({ id: i, src: result });
        setImage([...imageArr]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const imageInput = useRef();
  const onImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  return [images, onFileChange, imageInput, onImageUpload];
};

export default useUploadImages;
