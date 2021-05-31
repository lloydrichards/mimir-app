import {COLOUR_LIGHT, COLOUR_PRIMARY} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>mimirApp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingTop: 16,
    backgroundColor: COLOUR_PRIMARY,
  },
  title: {
    textAlign: 'center',
    color: COLOUR_LIGHT,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
