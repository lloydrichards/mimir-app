import {SpaceType} from '@mimir/SpaceType';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {COLOUR_ACCENT, COLOUR_TERTIARY, COLOUR_SUBTLE} from '@styles/Colours';
import React from 'react';
import {View, Text} from 'react-native';
import { PlantParamList } from 'src/Routes/addPlantRoutes';
import {
  DeciduousShrubIcon,
  UnknownPlantIcon,
} from '../Atom-Icons/PlantTypes/SmallPlantIcons';
import {HumidityIcon} from '../Atom-Icons/Status/SmallHumidityIcons';
import {LightIcon} from '../Atom-Icons/Status/SmallLightIcons';
import {TemperatureIcon} from '../Atom-Icons/Status/SmallTemperatureIcon';
import {WateringIcon} from '../Atom-Icons/Status/SmallWateringIcons';
import HumidityTab from './HumidityTab';
import LightTab from './LightTab';
import {PlantDetailTabParamList} from './PlantDetailTab';
import PlantListTab from './PlantListTab';
import TemperatureTab from './TemperatureTab';
import WateringTab from './WateringTab';

export type SpaceDetailTabParamList = {
  Plants: {space: SpaceType};
} & PlantDetailTabParamList & PlantParamList;

export type SpaceDetailTabProps<T extends keyof SpaceDetailTabParamList> = {
  route: RouteProp<SpaceDetailTabParamList, T>;
  navigation: StackNavigationProp<SpaceDetailTabParamList, T>;
};

const Tab = createMaterialTopTabNavigator<SpaceDetailTabParamList>();

interface Props {
  space: SpaceType;
}
export const SpaceDetailTab: React.FC<Props> = ({space}) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        style: {backgroundColor: COLOUR_ACCENT},
        activeTintColor: COLOUR_TERTIARY,
        inactiveTintColor: COLOUR_SUBTLE,
        indicatorStyle: {backgroundColor: COLOUR_TERTIARY},
      }}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          switch (route.name) {
            case 'Plants':
              return <DeciduousShrubIcon colour={color} background="none" />;
            case 'Temp':
              return <TemperatureIcon colour={color} background="none" />;
            case 'Hum':
              return <HumidityIcon colour={color} background="none" />;
            case 'Light':
              return <LightIcon colour={color} background="none" />;
            default:
              return <UnknownPlantIcon />;
          }
        },
      })}>
      <Tab.Screen
        name="Plants"
        component={PlantListTab}
        initialParams={{space}}
      />
      <Tab.Screen
        name="Temp"
        component={TemperatureTab}
        initialParams={{type: 'SPACE', data: space}}
      />
      <Tab.Screen
        name="Hum"
        component={HumidityTab}
        initialParams={{type: 'SPACE', data: space}}
      />
      <Tab.Screen
        name="Light"
        component={LightTab}
        initialParams={{type: 'SPACE', data: space}}
      />
    </Tab.Navigator>
  );
};
