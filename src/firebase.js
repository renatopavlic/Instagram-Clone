import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAohbpty7wsvaTV2rK_wvBLnRU24wOHjj8",
  authDomain: "instagram-clone-9e9e6.firebaseapp.com",
  projectId: "instagram-clone-9e9e6",
  storageBucket: "instagram-clone-9e9e6.appspot.com",
  messagingSenderId: "265633962961",
  appId: "1:265633962961:web:e1a50fdc61e6a61de11ef0",
  measurementId: "G-HYWCZ1BMC1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

/*
import firebase from "firebase";



const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };

*/