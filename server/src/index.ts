// server/index.js
import admin from "firebase-admin";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = require("../service-account-file.json");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

interface QuizHistoryInput {
  userId: string;
  category: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  [key: string]: any;
}

app.get("/api/histories/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const snapshot = await db
      .collection("histories")
      .where("userId", "==", userId)
      .orderBy("date", "desc")
      .get();

    const histories: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      histories.push({
        id: doc.id,
        ...data,
        date:
          data.date && typeof data.date.toDate === "function"
            ? data.date.toDate().toISOString()
            : new Date().toISOString(),
      });
    });

    res.status(200).json(histories);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/histories", async (req: Request, res: Response) => {
  try {
    const data: QuizHistoryInput = req.body;
    const docRef = await db.collection("histories").add({
      ...data,
      date: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newDoc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...newDoc.data() });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/histories", async (req: Request, res: Response) => {
  try {
    const { ids }: { ids: string[] } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid IDs format" });
    }
    const batch = db.batch();

    ids.forEach((id) => {
      const ref = db.collection("histories").doc(id);
      batch.delete(ref);
    });

    await batch.commit();
    res.status(200).json({ ids });
  } catch (error: any) {
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
