import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth"; // for authentication
import "firebase/storage"; // for storage
import "firebase/firestore"; // for cloud firestore
import firebaseCf from "./setting/firebase/key.json";

const firebaseConfig = firebaseCf.firebaseConfig;
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebaseApp.firestore();

export { firebase, db, auth };
