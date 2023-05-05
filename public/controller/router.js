import * as Home from '../viewpage/home.js';

export const routePathnames = {
    HOME: '/',
}

export const routes = [
    {pathname: routePathnames.HOME, page: Home.homePage},
]

export function routing(pathname, hash) {
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
        routes[0].page();
    }
}