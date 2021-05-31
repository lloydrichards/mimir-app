import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {StackNavigationProp} from '@react-navigation/stack';
import {DashboardStackParamList} from 'src/Routes/dashboardStack';
import {RouteProp} from '@react-navigation/core';

interface Props {
  route: RouteProp<DashboardStackParamList, 'Dashboard'>;
  navigation: StackNavigationProp<DashboardStackParamList, 'Dashboard'>;
}

const Dashboard: React.FC<Props> = ({navigation}) => {
  return (
    <View>
      <Text>Dashboard</Text>
      <Button
        onPress={() => navigation.navigate('PlantDetails', {plantId: '8'})}>
        To Plant
      </Button>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
