import * as admin from 'firebase-admin';

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const helloWorld = () => console.log('Hello World!');

helloWorld();
