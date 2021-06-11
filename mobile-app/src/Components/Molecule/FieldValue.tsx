import {COLOUR_ACCENT, COLOUR_DARK} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgProps} from 'react-native-svg';

interface Props {
  icon?: (
    props?: SvgProps & {
      colour?: string | undefined;
      background?: string | undefined;
    },
  ) => JSX.Element;
  title?: string;
}

const FieldValue: React.FC<Props> = ({icon, title, children}) => {
  return (
    <View style={styles.container}>
      {icon &&
        icon({
          background: 'none',
          colour: children ? COLOUR_DARK : COLOUR_ACCENT,
        })}
      <Text
        style={{
          marginLeft: icon ? 4 : 0,
          marginRight: 4,
          fontSize: 16,
          fontWeight: 'bold',
          color: children ? COLOUR_DARK : COLOUR_ACCENT,
        }}>
        {title}:
      </Text>
      {children}
    </View>
  );
};

export default FieldValue;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
});
