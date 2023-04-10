import type { ComponentType } from 'react';
import { Home, About, Presentation, Login, Registration, Demonstration, Profile } from '../containers';

const DESC_SUFFIX = 'description - length <= 160 chars.';

export type MetaInfoProps = Partial<
  Readonly<{
    meta: any[];
    lang: string;
    title: string;
    defer: boolean;
    locale: string;
    description: string;
  }>
>;

export type Route = Readonly<{
  path: string;
  name: string;
  metaInfo: MetaInfoProps;
  Component: ComponentType;
}>;

export const routes: Route[] = [
  {
    path: '/',
    name: 'Home',
    Component: Home,
    metaInfo: {
      title: 'Home',
      description: `Home ${DESC_SUFFIX}`
    }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   Component: About,
  //   metaInfo: {
  //     title: 'About',
  //     description: `About ${DESC_SUFFIX}`
  //   }
  // },
  {
    path: '/presentation/:id',
    name: 'Presentation',
    Component: Presentation,
    metaInfo: {
      title: 'Presentation',
      description: `Presentation ${DESC_SUFFIX}`
    }
  },
  {
    path: '/login',
    name: 'Login',
    Component: Login,
    metaInfo: {
      title: 'Login',
      description: `Login ${DESC_SUFFIX}`
    }
  },
  {
    path: '/register',
    name: 'Register',
    Component: Registration,
    metaInfo: {
      title: 'Register',
      description: `Register ${DESC_SUFFIX}`
    }
  },
  {
    path: '/demonstration/:hash',
    name: 'Demonstration',
    Component: Demonstration,
    metaInfo: {
      title: 'Demonstration',
      description: `Demonstration ${DESC_SUFFIX}`
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    Component: Profile,
    metaInfo: {
      title: 'Profile',
      description: `Profile ${DESC_SUFFIX}`
    }
  },
];

export const getRouteMetaInfo = (name: string): MetaInfoProps => {
  const route = routes.find((r) => r.name === name);
  return route?.metaInfo ?? {};
};

export const isLocationValidRoute = (pathname: string): boolean => {
  return routes.some((r) => r.path === pathname);
};