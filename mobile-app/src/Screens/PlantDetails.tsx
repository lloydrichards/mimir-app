import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {DashboardStackParamList} from 'src/Routes/dashboardStack';

interface Props {
  route: RouteProp<DashboardStackParamList, 'PlantDetails'>;
  navigation: StackNavigationProp<DashboardStackParamList, 'PlantDetails'>;
}

const PlantDetails = () => {
  return (
    <View>
      <Text>Plant Details</Text>
    </View>
  );
};

export default PlantDetails;

const styles = StyleSheet.create({});
