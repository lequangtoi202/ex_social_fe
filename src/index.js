import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import { AuthProvider } from '~/auth/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { PostsProvider } from './context/PostContext';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyles>
      <AuthProvider>
        <ChatContextProvider>
          <PostsProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </PostsProvider>
        </ChatContextProvider>
      </AuthProvider>
    </GlobalStyles>
  </React.StrictMode>,
);
reportWebVitals();
