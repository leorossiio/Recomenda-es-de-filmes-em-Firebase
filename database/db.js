import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRTtqe0QR7HQO099mBDy7eyCd4wAya7D0",
  authDomain: "rfilmes-b6dae.firebaseapp.com",
  databaseURL: "https://rfilmes-b6dae-default-rtdb.firebaseio.com",
  projectId: "rfilmes-b6dae",
  storageBucket: "rfilmes-b6dae.firebasestorage.app",
  messagingSenderId: "178796516518",
  appId: "1:178796516518:web:5ce40a615d4cf0784a9067",
  measurementId: "G-YY7JL98HQ9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);