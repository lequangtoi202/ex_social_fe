import { publicRoutes } from '~/routes/routes';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import { UserContext } from '~/auth/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Logout from './pages/Logout';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

import { Fragment, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { currentUser } = useContext(UserContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            let Layout = DefaultLayout;
            const Page = route.component;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Page />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            );
          })}
          <Route path={'/reset-password'} element={<ResetPassword />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/signup'} element={<SignUp />} />
          <Route path={'/logout'} element={<Logout />} />
          <Route path={'/forget-password'} element={<ForgetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
