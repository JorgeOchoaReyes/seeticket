import firebase from "firebase/compat/app";
import {type FirebaseOptions} from "firebase/app";   
import {getFirestore} from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import "firebase/compat/auth";  

const firebaseConfig = (JSON.parse(process.env.NEXT_PUBLIC_FIREBASE ?? "{}") ?? {}) as FirebaseOptions;  

const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app); 

const x = { auth, db, firebase, app,   };

export default x;