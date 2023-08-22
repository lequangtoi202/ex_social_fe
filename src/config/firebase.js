import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDG8jC7YwaXDa3XzllQpSeg6vmHdJSU-Kk',
  authDomain: 'almasocial-c3a37.firebaseapp.com',
  databaseURL: 'https://almasocial-c3a37-default-rtdb.firebaseio.com',
  projectId: 'almasocial-c3a37',
  storageBucket: 'almasocial-c3a37.appspot.com',
  messagingSenderId: '843546995179',
  appId: '1:843546995179:web:ec092d497bbcf49a8c91ae',
  measurementId: 'G-LJMN7SQZ71',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence);
