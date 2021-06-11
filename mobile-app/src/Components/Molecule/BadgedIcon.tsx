import {COLOUR_SECONDARY, COLOUR_TERTIARY} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Badge} from 'react-native-paper';
import {SvgProps} from 'react-native-svg';

interface Props {
  icon: (
    props?: SvgProps & {
      colour?: string | undefined;
      background?: string | undefined;
    },
  ) => JSX.Element;
  colour?: string;
  disabled?: boolean;
  content?: string | number;
}
const BadgedIcon: React.FC<Props> = ({icon, colour, content, disabled: disable}) => {
  return (
    <View style={styles.container}>
      {icon({background: colour || 'none'})}
      {!disable && <Badge style={styles.badge}>{content}</Badge>}
    </View>
  );
};

export default BadgedIcon;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: COLOUR_TERTIARY,
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
});
