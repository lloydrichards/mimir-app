import {COLOUR_SUBTLE, COLOUR_SECONDARY} from '@styles/Colours';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {TextInputProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import {RejectIcon, SearchIcon} from '../Atom-Icons/UI/SmallUIIcons';

const SearchInput = (props: Partial<TextInputProps>) => {
  return (
    <View style={styles.searchBar}>
      <SearchIcon background="none" />
      <TextInput
        {...props}
        dense
        underlineColor="none"
        style={{
          backgroundColor: 'white',
          flexGrow: 1,
          borderRadius: 8,
          fontSize: 18,
          height: 48,
        }}
        theme={{
          colors: {
            primary: COLOUR_SECONDARY,
          },
        }}
      />
      <RejectIcon background="none" />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    fontSize: 18,
    height: 48,
    borderBottomColor: COLOUR_SUBTLE,
    borderBottomWidth: 2,
  },
});
