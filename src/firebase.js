import firebase from "firebase/app";
import "firebase/firestore";
var config = {
  apiKey: "AIzaSyAyYROVbDBPv1Kij31XWGsOTPIXHCGeq2Q",
  authDomain: "absensi-yukngaji.firebaseapp.com",
  databaseURL: "https://absensi-yukngaji.firebaseio.com",
  projectId: "absensi-yukngaji",
  storageBucket: "",
  messagingSenderId: "122540413848"
};

const app = firebase.initializeApp(config);

export const getFirebaseApp = () => app;
