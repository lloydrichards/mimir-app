import React, { useContext } from 'react';
import './styles/App.css';
import Login from './components/auth/Login';
import { AuthContext, AuthProvider } from './components/auth/Auth';
import SignOut from './components/auth/Sign Out';

const App = () => {
  const user = useContext(AuthContext);
  return (
    <AuthProvider>
      <div className='App'>
        <Login />

        {user ? <SignOut /> : null}
      </div>
    </AuthProvider>
  );
};

export default App;
