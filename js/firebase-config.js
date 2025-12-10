// js/firebase-config.js

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCb-ud8qAUBzzY889IxVuiCdMB956J6RyU",
  authDomain: "naviya-47243.firebaseapp.com",
  projectId: "naviya-47243",
  storageBucket: "naviya-47243.appspot.com",
  messagingSenderId: "44463634410",
  appId: "1:44463634410:web:d79ffe554bf9d86ba9e493",
  measurementId: "G-3L000Z5D0V"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
