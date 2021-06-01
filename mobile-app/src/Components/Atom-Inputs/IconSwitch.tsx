import {COLOUR_LIGHT, COLOUR_SUBTLE} from '@styles/Colours';
import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SearchIcon} from '../Atom-Icons/UI/SmallUIIcons';

interface Props {
  onPress: () => void;
  icon: JSX.Element;
  selected: boolean;
  style?: StyleProp<ViewStyle>;
}

const IconSwitch: React.FC<Props> = ({onPress, icon, selected, style}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: selected ? COLOUR_SUBTLE : COLOUR_LIGHT,
      }}
      onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

export default IconSwitch;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 44,
    width: 44,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: COLOUR_SUBTLE,
  },
});
