import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth"; // for authentication
import "firebase/storage"; // for storage
import "firebase/database"; // for storage
import "firebase/firestore"; // for cloud firestore
import firebaseCf from "./setting/firebase/firestore.json";
import realtimeDB from "./setting/firebase/firestore.json";

// const firebaseStore = firebase.initializeApp(firebaseCf.firebaseConfig);
// const db = firebaseStore.firestore();

const firebaseApp = firebase.initializeApp(realtimeDB.firebaseConfig);

const realTimeDb = firebaseApp.database();
// const realTimeDb = firebaseRTApp;

const auth = firebase.auth();

export { firebase, auth, realTimeDb };
