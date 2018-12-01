import api from "./api";
import DatabaseClient from "./api/database";
export default class Server {
  constructor({ addMiddleware }) {
    addMiddleware(api);
  }

  apply(serverHandler) {
    serverHandler.hooks.beforeStart.tapPromise("InitializeDatabase", async (serverConfig, appOptions) => {
      if (appOptions.getAppLocal("database")) return;

      try {
        const db = await DatabaseClient();
        appOptions.setAppLocal("database", db);
      } catch (ex) {
        // eslint-disable-next-line
        console.error("Database connection failed!");
        // eslint-disable-next-line
        console.error(ex);
        process.exit(1);
      }
    });
  }
}
