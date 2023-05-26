import * as Home from '../viewpage/home.js';
import * as Login from '../viewpage/login.js';

export const routePathnames = {
    LOGIN: '/login',
    HOME: '/',
}

export const routes = [
    {pathname: routePathnames.LOGIN, page: Login.loginPage},
    {pathname: routePathnames.HOME, page: Home.homePage},
]

export function routing(pathname, hash) {
    if (true) {
        history.replaceState(null, null, routePathnames.LOGIN);
        routes[0].page();
    }
    else {
        const route = routes.find(r => r.pathname == pathname);
        if (route) {
            if (hash && hash.length > 1) {
                route.page(hash.substring(1));
            }
            else {
                route.page();
            }
        }
        else {
            history.replaceState(null, null, routePathnames.HOME);
            routes[1].page();
        }
    }
}