import Layout from './Layout';
import { createContext, useState, type FunctionComponent } from 'react';
import { routes } from './config/routes.config';
import { MetaInfo, NotFound404 } from './components';
import { useScrollToTop } from './hooks';
import { useLocation, Route, Routes } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { authModule } from './modules/auth';

export const UserContext = createContext(authModule.user as any);

const App: FunctionComponent = () => {
  useScrollToTop();
  const location = useLocation();
  const [userData, setUserData] = useState(authModule.user);


  return (
    <UserContext.Provider value={{userData: userData, setUserData: setUserData}}>
      <Layout>
        <div id="alertWrapper"/>
        <MetaInfo />
        <SwitchTransition mode="out-in">
          <CSSTransition
            timeout={250}
            classNames="fade"
            key={location.key}
          >
            <Routes location={location}>
              {routes.map(({ path, Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={<Component />}
                />
              ))}
              <Route
                path="*"
                element={<NotFound404 />}
              />
            </Routes>
          </CSSTransition>
        </SwitchTransition>
      </Layout>
    </UserContext.Provider>
  );
};

export default App;
