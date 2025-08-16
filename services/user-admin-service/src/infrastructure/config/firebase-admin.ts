import { config } from "./env";
import admin from "firebase-admin";


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    clientEmail: config.firebase.clientEmail,
    privateKey: config.firebase.privateKey
  })
});

export default admin;