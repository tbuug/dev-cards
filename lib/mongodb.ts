import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  // Not throwing so project can still run without env during dev; API will error if used.
  console.warn("MONGODB_URI not set. API routes using MongoDB will fail until it's configured.");
}

const uri = process.env.MONGODB_URI || "";
let cached: { client: MongoClient | null } = (global as any)._mongoClientCache || { client: null };

if (!cached.client) {
  cached.client = uri ? new MongoClient(uri) : null;
  (global as any)._mongoClientCache = cached;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!cached.client) throw new Error("MongoClient not configured. Set MONGODB_URI.");
  if (typeof (cached.client as any).connect === "function") {
    await (cached.client as MongoClient).connect();
  }
  return cached.client as MongoClient;
}

export async function getSettingsCollection() {
  const client = await getMongoClient();
  const db = client.db(process.env.MONGODB_DB || "devcards");
  return db.collection("settings");
}
