import { useState, useEffect } from 'react';
import { storage } from '../../firebase';
import firebase from 'firebase';

const useStorage = (file: File, custom?: string) => {
  const [progress, setProgress] = useState<number>(0);
  const [
    error,
    setError,
  ] = useState<firebase.storage.FirebaseStorageError | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    const storageRef = storage.ref(custom ? custom : file.name);
    setRef(storageRef.fullPath);

    storageRef.put(file).on(
      'state_changed',
      (snap) => {
        setProgress((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (err) => setError(err),
      async () => {
        const url = await storageRef.getDownloadURL();
        setUrl(url);
      }
    );
  }, [file, custom]);

  return { progress, url, error, ref };
};

export default useStorage;
