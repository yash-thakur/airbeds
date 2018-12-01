import { MongoClient } from "mongodb";

const connectionUrl = `mongodb://yash-thakur:${encodeURIComponent("Yash4527")}@ds063889.mlab.com:63889/airbeds`;
const dbName = "airbeds";

let database = null;

export default async () => {
  if (database) return database;
  const client = await MongoClient.connect(connectionUrl, { useNewUrlParser: true });
  let clientClosed = false;


  database = client.db(dbName);
  process.on("exit", () => {
    if (clientClosed) return;

    clientClosed = true;
    // eslint-disable-next-line
    console.info("Closing database connection...");
    client.close();
  });

  process.on("beforeExit", () => {
    if (clientClosed) return;
    clientClosed = true;
    // eslint-disable-next-line
    console.info("Closing database connection...");
    client.close();
  });
  return database;
};
