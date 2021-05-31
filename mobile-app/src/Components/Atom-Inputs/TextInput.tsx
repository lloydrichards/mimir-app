import {COLOUR_SECONDARY} from '@styles/Colours';
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
} & FieldProps<any>;

const MyTextInput: React.FC<Props> = ({label, ...props}) => {
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
      <TextInput
        {...props}
        label={label}
        underlineColor={COLOUR_SECONDARY}
        value={field.value}
        onChangeText={onChangeText}
      />
      {!!errorMsg && <Text style={InputStyles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

export {MyTextInput as TextInput};
