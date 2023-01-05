// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7NhJomL0LYR3xF6KcJo-erMtcXGL-SFw",
  authDomain: "natours-30b9e.firebaseapp.com",
  projectId: "natours-30b9e",
  storageBucket: "natours-30b9e.appspot.com",
  messagingSenderId: "559295262800",
  appId: "1:559295262800:web:989e1a663d09af833b6155",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
