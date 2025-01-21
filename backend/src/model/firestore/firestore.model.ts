import admin from "firebase-admin";
import { serviceAccount } from "../../config/firebase";
import { cert } from "firebase-admin/app";
import type { ServiceAccount } from "firebase-admin";

const db = admin
  .initializeApp({ credential: cert(serviceAccount as ServiceAccount) })
  .firestore();

class FirestoreModel {
  private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;

  constructor(collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  async create(data: FirebaseFirestore.DocumentData): Promise<string> {
    const docRef = await this.collection.add(data);
    return docRef.id;
  }

  async getById(docId: string): Promise<FirebaseFirestore.DocumentData | null> {
    const doc = await this.collection.doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }
}

export default FirestoreModel;
