import {PlantType, PlantTypes} from '@mimir/PlantType';
import {SpaceType} from '@mimir/SpaceType';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {COLOUR_ACCENT, COLOUR_TERTIARY, COLOUR_SUBTLE} from '@styles/Colours';
import React from 'react';
import {View, Text} from 'react-native';
import {UnknownPlantIcon} from '../Atom-Icons/PlantTypes/SmallPlantIcons';
import {HumidityIcon} from '../Atom-Icons/Status/SmallHumidityIcons';
import {LightIcon} from '../Atom-Icons/Status/SmallLightIcons';
import {TemperatureIcon} from '../Atom-Icons/Status/SmallTemperatureIcon';
import {WateringIcon} from '../Atom-Icons/Status/SmallWateringIcons';
import HumidityTab from './HumidityTab';
import LightTab from './LightTab';
import TemperatureTab from './TemperatureTab';
import WateringTab from './WateringTab';

export type PlantDetailTabParamList = {
  Water: {type: 'PLANT' | 'SPACE'; data: PlantType | SpaceType};
  Temp: {type: 'PLANT' | 'SPACE'; data: PlantType | SpaceType};
  Hum: {type: 'PLANT' | 'SPACE'; data: PlantType | SpaceType};
  Light: {type: 'PLANT' | 'SPACE'; data: PlantType | SpaceType};
};

export type PlantDetailTabProps<T extends keyof PlantDetailTabParamList> = {
  route: RouteProp<PlantDetailTabParamList, T>;
  navigation: StackNavigationProp<PlantDetailTabParamList, T>;
};

const Tab = createMaterialTopTabNavigator<PlantDetailTabParamList>();

interface Props {
  plant: PlantType;
}

export const PlantDetailTab: React.FC<Props> = ({plant}) => {
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
            case 'Water':
              return <WateringIcon colour={color} background="none" />;
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
        name="Water"
        component={WateringTab}
        initialParams={{type: 'PLANT', data: plant}}
      />
      <Tab.Screen
        name="Temp"
        component={TemperatureTab}
        initialParams={{type: 'PLANT', data: plant}}
      />
      <Tab.Screen
        name="Hum"
        component={HumidityTab}
        initialParams={{type: 'PLANT', data: plant}}
      />
      <Tab.Screen
        name="Light"
        component={LightTab}
        initialParams={{type: 'PLANT', data: plant}}
      />
    </Tab.Navigator>
  );
};
