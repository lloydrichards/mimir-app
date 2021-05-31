import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Header from 'src/Components/Molecule-UI/Header';
import Dashboard from 'src/Screens/Dashboard';
import {AuthProvider, useAuth} from './src/Components/Auth/Auth';
import SignOut from './src/Components/Auth/SignOut';
import {COLOUR_LIGHT} from './src/Styles/Colours';
import PlantDetails from 'src/Screens/PlantDetails';
import {DashboardStack} from 'src/Routes/dashboardStack';

const App: React.FC = () => {
  const {currentUser} = useAuth();
  return (
    <NavigationContainer>
      <AuthProvider>
        <DashboardStack.Navigator initialRouteName="Dashboard">
          <DashboardStack.Screen name="Dashboard" component={Dashboard} />
          <DashboardStack.Screen name="PlantDetails" component={PlantDetails} />
          <DashboardStack.Screen name="SpaceDetails" component={PlantDetails} />
        </DashboardStack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    backgroundColor: COLOUR_LIGHT,
    paddingHorizontal: 24,
    height: '100%',
  },
});

export default App;
