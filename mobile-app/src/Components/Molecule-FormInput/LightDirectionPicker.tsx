import { COLOUR_SUBTLE, COLOUR_SUNSHINE } from '@styles/Colours';
import {FieldArray, FieldProps} from 'formik';
import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Button, IconButton} from 'react-native-paper';
import {
  EastIcon,
  NortheastIcon,
  NorthIcon,
  NorthwestIcon,
  SoutheastIcon,
  SouthIcon,
  SouthwestIcon,
  WestIcon,
} from '../Atom-Icons/LightDirection/SmallLightIcons';
import {SearchIcon} from '../Atom-Icons/UI/SmallUIIcons';
import { SunnyIcon } from '../Atom-Icons/Weather/SmallWeatherIcons';
import IconSwitch from '../Atom-Inputs/IconSwitch';
import {LightDirectionMap} from '../Molecule-Data/LightDirectionMap';

type Props = {
  label: string;
} & FieldProps<any>;

const LightDirectionPicker: React.FC<Props> = ({label, ...props}) => {
  const {
    field,
    form: {touched, errors},
  } = props;

  const onSelect = (text: string) => {
    const {
      form: {setFieldValue},
      field: {name, value},
    } = props;

    console.log({value});

    if (value.includes(text)) {
      setFieldValue(
        name,
        value.filter((i: string) => i === text),
      );
    } else {
      setFieldValue(name, value.push(text));
    }
  };

  const errorMsg = touched[field.name] && errors[field.name];
  return (
    <FieldArray name="light_direction">
      {arrayHelper => {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{textAlign:"left" ,width:"100%",color:COLOUR_SUBTLE}}>{label}</Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View>
                <IconSwitch
                  icon={<NorthwestIcon background="none" />}
                  onPress={() =>
                    field.value.includes('NW')
                      ? arrayHelper.remove(field.value.indexOf('NW'))
                      : arrayHelper.push('NW')
                  }
                  selected={field.value.includes('NW')}
                />
                <IconSwitch
                  icon={<WestIcon background="none" />}
                  onPress={() =>
                    field.value.includes('W')
                      ? arrayHelper.remove(field.value.indexOf('W'))
                      : arrayHelper.push('W')
                  }
                  selected={field.value.includes('W')}
                />
                <IconSwitch
                  icon={<SouthwestIcon background="none" />}
                  onPress={() =>
                    field.value.includes('SW')
                      ? arrayHelper.remove(field.value.indexOf('SW'))
                      : arrayHelper.push('SW')
                  }
                  selected={field.value.includes('SW')}
                />
              </View>
              <View>
                <IconSwitch
                  icon={<NorthIcon background="none" />}
                  onPress={() =>
                    field.value.includes('N')
                      ? arrayHelper.remove(field.value.indexOf('N'))
                      : arrayHelper.push('N')
                  }
                  selected={field.value.includes('N')}
                />
                <View
                  style={{
                    height: 44,
                    width: 44,
                    margin: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}><SunnyIcon background={COLOUR_SUNSHINE}/></View>
                <IconSwitch
                  icon={<SouthIcon background="none" />}
                  onPress={() =>
                    field.value.includes('S')
                      ? arrayHelper.remove(field.value.indexOf('S'))
                      : arrayHelper.push('S')
                  }
                  selected={field.value.includes('S')}
                />
              </View>
              <View>
                <IconSwitch
                  icon={<NortheastIcon background="none" />}
                  onPress={() =>
                    field.value.includes('NE')
                      ? arrayHelper.remove(field.value.indexOf('NE'))
                      : arrayHelper.push('NE')
                  }
                  selected={field.value.includes('NE')}
                />
                <IconSwitch
                  icon={<EastIcon background="none" />}
                  onPress={() =>
                    field.value.includes('E')
                      ? arrayHelper.remove(field.value.indexOf('E'))
                      : arrayHelper.push('E')
                  }
                  selected={field.value.includes('E')}
                />
                <IconSwitch
                  icon={<SoutheastIcon background="none" />}
                  onPress={() =>
                    field.value.includes('SE')
                      ? arrayHelper.remove(field.value.indexOf('SE'))
                      : arrayHelper.push('SE')
                  }
                  selected={field.value.includes('SE')}
                />
              </View>
            </View>
          </View>
        );
      }}
    </FieldArray>
  );
};

export default LightDirectionPicker;

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},
});
