import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as fs from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: process.env.API_KEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER_ID,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MESUREMENT_ID,
// };

const firebaseConfig = {
    apiKey: "AIzaSyDxp1MOfs-UDb3U3zVx-1iSwTsLRW6XGdI",
    authDomain: "honey-93b09.firebaseapp.com",
    projectId: "honey-93b09",
    storageBucket: "honey-93b09.appspot.com",
    messagingSenderId: "149588387127",
    appId: "1:149588387127:web:78cdab4371fda6d992a6b2",
    measurementId: "G-SPC2H7JPX5",
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
