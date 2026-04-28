import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNMR0-Pxs8Gu6aXlxmgdByRf-yz7GcsHU",
    authDomain: "indai-authentication.firebaseapp.com",
    projectId: "indai-authentication",
    storageBucket: "indai-authentication.firebasestorage.app",
    messagingSenderId: "28397937512",
    appId: "1:28397937512:web:8f2f566061e0648e21ecdd",
    measurementId: "G-GFB5EHKGHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
