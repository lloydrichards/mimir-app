import React from 'react';
import 'react-native-gesture-handler';
import {AppTabs} from 'src/Routes/appTabs';
import { AuthProvider, useAuth } from './src/Components/Auth/Auth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppTabs />
    </AuthProvider>
  );
};

export default App;
