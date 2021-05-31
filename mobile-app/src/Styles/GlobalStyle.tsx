import {StyleSheet} from 'react-native';
import {COLOUR_TERTIARY} from './Colours';

export const InputStyles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  form: {
    marginVertical: 32,
    marginHorizontal: 16,
  },
  errorText: {
    color: COLOUR_TERTIARY,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
});
export const TextStyles = StyleSheet.create({
  h1: {
    fontSize: 24,
  },
});
