import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {DashboardStackParamList} from 'src/Routes/dashboardStack';

interface Props {
  route: RouteProp<DashboardStackParamList, 'SpaceDetails'>;
  navigation: StackNavigationProp<DashboardStackParamList, 'SpaceDetails'>;
}

const SpaceDetails = () => {
  return (
    <View>
      <Text>Plant Details</Text>
    </View>
  );
};

export default SpaceDetails;

const styles = StyleSheet.create({});
