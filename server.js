require("dotenv").config();
const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();

// Initialize Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // download from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const dbAdmin = admin.firestore();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Expose your client Firebase config
app.get("/config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  });
});

// Parse JSON bodies
app.use(express.json());

// Protected endpoint: create registration doc
app.post("/api/register", async (req, res) => {
  try {
    // 1) Verify the Firebase ID token from the client
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) return res.status(401).json({ error: "Missing auth token" });
    const decoded = await admin.auth().verifyIdToken(idToken);

    // 2) Only allow a user to create their own doc
    if (decoded.uid !== req.body.uid) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // 3) Write the registration document as admin
    await dbAdmin.collection("registrations").doc(decoded.uid).set({
      name: req.body.name,
      username: req.body.username,
      email: decoded.email,
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("API register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
