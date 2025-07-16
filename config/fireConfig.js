// // Use compat version for Expo Go compatibility
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBpP0yUT7e8UvMPZNiXA_IZOYY7wEbJCNs",
//   authDomain: "cheforumreal.firebaseapp.com",
//   projectId: "cheforumreal",
//   storageBucket: "cheforumreal.appspot.com",
//   messagingSenderId: "441077080510",
//   appId: "1:441077080510:web:6df2e74dfdb214e17bd9ef",
//   measurementId: "G-HCCPEMB9D7",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export const auth = firebase.auth();
// const app = firebase.app();
// export const db = app.firestore();

// config/fireConfig.js

import { getApps, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

if (!getApps().length) {
  initializeApp(); // ✅ no config keys here
}

export { auth, firestore };
