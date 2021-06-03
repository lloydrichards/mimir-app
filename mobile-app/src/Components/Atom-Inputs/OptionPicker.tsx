import {Picker, PickerItemProps} from '@react-native-picker/picker';
import {ItemValue} from '@react-native-picker/picker/typings/Picker';
import {COLOUR_SECONDARY, COLOUR_SUBTLE} from '@styles/Colours';
import {InputStyles} from '@styles/GlobalStyle';
import {FieldInputProps, FieldProps, FormikErrors, useField} from 'formik';
import React, {useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
  View,
} from 'react-native';
import {Text, TextInput} from 'react-native-paper';

type PickerProps = {
  label: string;
  onChange?: (value: string) => void;
} & FieldProps<any>;

export const OptionPicker: React.FC<PickerProps> = ({
  label,
  onChange,
  children,
  ...props
}) => {
  const onValueChange = (value: string) => {
    const {
      form: {setFieldValue},
      field: {name},
    } = props;
    setFieldValue(name, value);
  };

  const {
    field,
    form: {touched, errors},
  } = props;

  const errorMsg = touched[field.name] && errors[field.name];
  return (
    <View style={InputStyles.container}>
      <Text style={{color: COLOUR_SUBTLE}}>{label}</Text>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          height: 44,
          justifyContent: 'center',
        }}>
        <Picker
          mode="dropdown"
          onValueChange={onChange || onValueChange}
          selectedValue={field.value}
          prompt={label}
          accessibilityLabel={label}>
          {children}
        </Picker>
      </View>
      {!!errorMsg && <Text style={InputStyles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

type ItemProps = {} & PickerItemProps<ItemValue>;

export const OptionItem: React.FC<ItemProps> = props => {
  return <Picker.Item {...props} />;
};
