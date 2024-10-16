import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';  // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyA3_VdOBBNaMdm-FtXAzjQA9LVXhmwzdtg",
    authDomain: "talentcafe-solutions.firebaseapp.com",
    databaseURL: "https://talentcafe-solutions-default-rtdb.firebaseio.com",
    projectId: "talentcafe-solutions",
    storageBucket: "talentcafe-solutions.appspot.com",
    messagingSenderId: "353018385177",
    appId: "1:353018385177:web:b96c20c4f6503bc409ab88"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();  

export { db, auth, storage };
