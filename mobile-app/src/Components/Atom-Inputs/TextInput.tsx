import {COLOUR_PRIMARY, COLOUR_SECONDARY, COLOUR_SUBTLE} from '@styles/Colours';
import {InputStyles} from '@styles/GlobalStyle';
import {FieldInputProps, FieldProps, FormikErrors, useField} from 'formik';
import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
  View,
} from 'react-native';
import {Text, TextInput} from 'react-native-paper';

type Props = {
  label: string;
  placeholder?: string;
} & FieldProps<any>;

const MyTextInput: React.FC<Props> = ({label, placeholder, ...props}) => {
  const onChangeText = (text: string) => {
    const {
      form: {setFieldValue},
      field: {name},
    } = props;
    setFieldValue(name, text);
  };

  const {
    field,
    form: {touched, errors},
  } = props;

  const errorMsg = touched[field.name] && errors[field.name];
  return (
    <View style={InputStyles.container}>
      <Text style={{color: COLOUR_SUBTLE}}>{label}</Text>
      <TextInput
        {...props}
        dense
        placeholder={placeholder}
        underlineColor={COLOUR_SUBTLE}
        value={field.value}
        onChangeText={onChangeText}
        style={{
          backgroundColor: 'white',
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
      {!!errorMsg && <Text style={InputStyles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

export {MyTextInput as TextInput};
