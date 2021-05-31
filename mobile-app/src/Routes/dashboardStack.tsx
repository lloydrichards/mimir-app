import {createStackNavigator} from '@react-navigation/stack';

export type DashboardStackParamList = {
  Dashboard: undefined;
  PlantDetails: {plantId: string};
  SpaceDetails: {spaceId: string};
};

export const DashboardStack = createStackNavigator<DashboardStackParamList>();
