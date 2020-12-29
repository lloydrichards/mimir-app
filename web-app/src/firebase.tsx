import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';

try {
  firebase.initializeApp({
    apiKey: 'AIzaSyATtD1MmPJo9bdSRQuPghzPwI3ROcdSfE0',
    authDomain: 'mimir-app-dev.firebaseapp.com',
    projectId: 'mimir-app-dev',
    storageBucket: 'mimir-app-dev.appspot.com',
    messagingSenderId: '999550951543',
    appId: '1:999550951543:web:7de270e5d9a566c0d36672',
    measurementId: 'G-RK2NFW74Z2',
  });
  if (typeof window !== 'undefined') firebase.analytics();
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default firebase;
