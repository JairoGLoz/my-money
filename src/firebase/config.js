import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBo9Ou7TFc97JE0rqJnVKywP8IMI9bEgDk",
    authDomain: "mymoney-1d7a3.firebaseapp.com",
    projectId: "mymoney-1d7a3",
    storageBucket: "mymoney-1d7a3.appspot.com",
    messagingSenderId: "314987524509",
    appId: "1:314987524509:web:399ed8a2a6cac4c259ff74"
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init service
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export{projectFirestore, projectAuth, timestamp}