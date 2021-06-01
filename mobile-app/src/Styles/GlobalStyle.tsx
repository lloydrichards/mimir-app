import {StyleSheet} from 'react-native';
import {COLOUR_SUBTLE, COLOUR_TERTIARY} from './Colours';

export const InputStyles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  form: {
    width: '100%',
    marginVertical: 32,
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  errorText: {
    color: COLOUR_TERTIARY,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  optionLabel: {
    color: COLOUR_SUBTLE,
  },
});
export const TextStyles = StyleSheet.create({
  h1: {
    fontSize: 24,
  },
});
