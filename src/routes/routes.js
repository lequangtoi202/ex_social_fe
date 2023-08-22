//Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Search from '~/pages/Search';
import Groups from '~/pages/Groups';
import config from '~/config';
import HeaderOnly from '~/layouts/HeaderOnly/HeaderOnly';
import HomeChat from '~/pages/HomeChat';
import Group from '~/pages/Group';

//Public routes
const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.following, component: Following },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.search, component: Search, layout: null },
  { path: config.routes.groups, component: Groups },
  { path: config.routes.group, component: Group },
  { path: config.routes.chat, component: HomeChat, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
