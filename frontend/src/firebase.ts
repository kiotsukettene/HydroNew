import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDexGi8GHcp4A8c6SXUUsRis5gZ5uKaK6U",
  databaseURL: "https://hydronew-iot-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "hydronew-iot",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app);
