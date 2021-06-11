import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
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

const Tab = createMaterialTopTabNavigator();

export const PlantDetailTab = () => {
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
      <Tab.Screen name="Water" component={WateringTab} />
      <Tab.Screen name="Temp" component={TemperatureTab} />
      <Tab.Screen name="Hum" component={HumidityTab} />
      <Tab.Screen name="Light" component={LightTab} />
    </Tab.Navigator>
  );
};
