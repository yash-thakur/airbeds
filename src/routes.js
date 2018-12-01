import HomePage from "./pages/home";

export default class Routes {
  apply(routeHandler) {
    const routes = [
      ...HomePage,
    ];

    routeHandler.hooks.initRoutes.tapPromise("AppRoutes", async () => {
      routeHandler.addRoutes(routes);
    });
  }
}
