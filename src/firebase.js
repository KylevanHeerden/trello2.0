import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/storage";
import "@firebase/functions";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGEINSENDERID,
  appId: process.env.VUE_APP_FIREBASE_APPID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENTID,
};

firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

// collection references
const usersCollection = db.collection("users");
const programmesCollection = db.collection("programmes");
const productsCollection = db.collection("products");
const listsCollection = db.collection("lists");
const cardsCollection = db.collection("cards");
const suppliersCollection = db.collection("suppliers");
const commentsCollection = db.collection("comments");
const teamsCollection = db.collection("teams");
const lineItemsCollection = db.collection("line_items");
const notificationsCollection = db.collection("notifications");

// export utils/refs
export {
  firebase,
  db,
  auth,
  storage,
  functions,
  usersCollection,
  programmesCollection,
  productsCollection,
  listsCollection,
  cardsCollection,
  suppliersCollection,
  commentsCollection,
  teamsCollection,
  lineItemsCollection,
  notificationsCollection,
};
