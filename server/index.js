// server/index.js

const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const serviceAccount = require("./service-account-file.json"); // ダウンロードしたファイル名
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
// これで db.collection('histories').get() などがサーバーから可能になります！

app.get("/api/histories/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const snapshot = await db
      .collection("histories")
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get();

    const histories = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      histories.push({
        id: doc.id,
        ...data,
        date: data.date
          ? data.date.toDate().toISOString()
          : new Date().toISOString(),
      });
    });

    res.status(200).json(histories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/histories", async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("histories").add({
      ...data,
      date: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newDoc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...newDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/histories", async (req, res) => {
  try {
    const { ids } = req.body;
    const batch = db.batch();

    ids.forEach((id) => {
      const ref = db.collection("histories").doc(id);
      batch.delete(ref);
    });

    await batch.commit();
    res.status(200).json({ ids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`----------------------------------------`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Firebase Admin SDK initialized`);
  console.log(`----------------------------------------`);
});
