import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {COLOUR_SUBTLE, COLOUR_TERTIARY} from '@styles/Colours';
import React from 'react';
import {ClimberIcon} from 'src/Components/Atom-Icons/PlantTypes/SmallPlantIcons';
import {BedroomIcon} from 'src/Components/Atom-Icons/RoomTypeIcons';
import {PlantsRoute} from './plantStack';
import {SpaceRoute} from './spaceStack';

export type TabParamList = {
  Plants: undefined;
  Spaces: undefined;
};

const Tabs = createBottomTabNavigator<TabParamList>();

export const AppTabs = () => {
  return (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            if (route.name === 'Plants') {
              return (
                <ClimberIcon
                  colour={color}
                  background={focused ? '#F9D5C7' : 'none'}
                />
              );
            } else if (route.name === 'Spaces') {
              return (
                <BedroomIcon
                  colour={color}
                  background={focused ? '#F9D5C7' : 'none'}
                />
              );
            }
          },
        })}
        tabBarOptions={{
          activeTintColor: COLOUR_TERTIARY,
          inactiveTintColor: COLOUR_SUBTLE,
        }}>
        <Tabs.Screen name="Plants" component={PlantsRoute}></Tabs.Screen>
        <Tabs.Screen name="Spaces" component={SpaceRoute}></Tabs.Screen>
      </Tabs.Navigator>
    </NavigationContainer>
  );
};
