import Vue from 'vue';
import Router, { RouteConfig, RawLocation, Route } from 'vue-router';

Vue.use(Router);

/**
 * Represents the DefaultRoute interface.
 */
export interface DefaultRoute {
  name: string;
  props?: object;
}

/**
 * Represents the DefaultRouter class.
 */
export default class DefaultRouter extends Router {
  /**
   * Initializes an instance of the DefaultRouter class.
   * @param routes The routes the router is allowed to go to.
   * @param addRedirect Whether to add a redirect on unknown routes to the first route in the routes array.
   */
  constructor(routes: DefaultRoute[], addRedirect: boolean) {
    super({ mode: 'history' });

    // set the routes.
    const actualRoutes: RouteConfig[] = new Array();
    routes.forEach((route) => {
      const view: string = route.name.replace(/^\w/, (c) => c.toUpperCase());
      const routeConfig: RouteConfig = { path: `/${route.name}`, name: route.name, component: () => DefaultRouter.loadView(view), props: route.props };
      actualRoutes.push(routeConfig);
    });
    if (addRedirect && actualRoutes.length > 0) {
      actualRoutes.push({ path: '*', redirect: actualRoutes[0].path });
    }
    super.addRoutes(actualRoutes);
  }

  /**
   * Pushes the location to the router stack.
   * Overridden to ignore NavigationDuplicated error.
   * @param location The raw location.
   * @returns Returns the promised route.
   */
  public push(location: RawLocation): Promise<Route> {
    return super.push(location).catch((err) => {
      if (err === undefined) {
        return Promise.resolve(undefined as any);
      } else if (err.name !== 'NavigationDuplicated') {
        throw err;
      } else {
        return Promise.resolve({ message: 'Router failsafe triggered' } as any);
      }
    });
  }

  /* tslint:disable */
  private static loadView = (name: string): any => import(`../views/${name}.vue`);
  /* tslint:enable */
}
