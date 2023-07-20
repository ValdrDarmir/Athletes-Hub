import {initializeApp} from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import {initializeAuth, browserLocalPersistence} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyD60JSFx_EdfuQbsw5gtCkW3AcBr_asiF8",
    authDomain: "athletes-a02f3.firebaseapp.com",
    projectId: "athletes-a02f3",
    storageBucket: "athletes-a02f3.appspot.com",
    messagingSenderId: "274650458417",
    appId: "1:274650458417:web:0b070f727bcce0f8d46810",
    measurementId: "G-ZQFMTW4WT5"
};

export const firebase = initializeApp(firebaseConfig);
export const firestore = initializeFirestore(firebase, {})
export const auth = initializeAuth(firebase, {persistence: browserLocalPersistence})
