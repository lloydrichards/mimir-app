import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyATtD1MmPJo9bdSRQuPghzPwI3ROcdSfE0',
  authDomain: 'mimir-app-dev.firebaseapp.com',
  projectId: 'mimir-app-dev',
  storageBucket: 'mimir-app-dev.appspot.com',
  messagingSenderId: '999550951543',
  appId: '1:999550951543:web:7de270e5d9a566c0d36672',
  measurementId: 'G-RK2NFW74Z2',
});
if (typeof window !== 'undefined') firebase.analytics();

export const auth = app.auth();
export const storage = app.storage();
export const db = app.firestore();
export const functions = app.functions();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
export default app;
