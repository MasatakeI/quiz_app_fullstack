// server/index.js

const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const serviceAccount = require("./service-account-file.json"); // ダウンロードしたファイル名
const app = express();
const PORT = process.env.PORT || 5000;

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
      // .where("userId", "==", userId)
      // .orderBy("createdAt", "desc")
      .get();

    const histories = [];
    snapshot.forEach((doc) => {
      histories.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(histories);
  } catch (error) {
    console.error("Firebase Admin 詳細エラー:", error);

    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      code: error.code, // これで 'permission-denied' 以外の詳細がわかるかもしれません
    });
  }
});

app.listen(PORT, () => {
  console.log(`----------------------------------------`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ Firebase Admin SDK initialized`);
  console.log(`----------------------------------------`);
});
