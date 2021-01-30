import { LinearProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Picture } from '../../types/GenericType';
import useStorage from '../helper/useStorage';

interface Props {
  file: File;
  customRef?: string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPicture: React.Dispatch<React.SetStateAction<Picture | null>>;
  onComplete: () => void;
}
const UploadProgressBar: React.FC<Props> = ({
  file,
  setFile,
  customRef,
  setPicture,
  onComplete,
}) => {
  const { url, progress, ref } = useStorage(file, customRef);

  useEffect(() => {
    if (url && ref) {
      setFile(null);
      setPicture({ url, ref, thumb: '' });
      onComplete();
    }
  }, [url, ref, setFile, setPicture, onComplete]);

  return <LinearProgress variant='determinate' value={progress} />;
};

export default UploadProgressBar;
