import {Picker, PickerItemProps} from '@react-native-picker/picker';
import {ItemValue} from '@react-native-picker/picker/typings/Picker';
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

type PickerProps = {
  label: string;
} & FieldProps<any>;

export const OptionPicker: React.FC<PickerProps> = ({
  label,
  children,
  ...props
}) => {
  const onValueChange = (text: string) => {
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
      <Text>{label}</Text>
      <Picker
        mode="dropdown"
        onValueChange={onValueChange}
        selectedValue={field.value}
        prompt={label}
        accessibilityLabel={label}>
        {children}
      </Picker>
      {!!errorMsg && <Text style={InputStyles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

type ItemProps = {} & PickerItemProps<ItemValue>;

export const OptionItem: React.FC<ItemProps> = props => {
  return <Picker.Item {...props} />;
};
