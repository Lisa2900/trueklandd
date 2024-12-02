import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHQRBnXFeyGOqqrslQNwYE4mhQANjbhrU",
  authDomain: "truekland-6ea20.firebaseapp.com",
  projectId: "truekland-6ea20",
  storageBucket: "truekland-6ea20.appspot.com",
  messagingSenderId: "931792877390",
  appId: "1:931792877390:web:0442eb9939b36b97f3501f",
  measurementId: "G-PFSYJXHNF6",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
