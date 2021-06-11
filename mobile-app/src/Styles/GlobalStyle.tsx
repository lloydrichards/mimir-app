import {StyleSheet} from 'react-native';
import {
  COLOUR_DARK,
  COLOUR_LIGHT,
  COLOUR_SUBTLE,
  COLOUR_TERTIARY,
} from './Colours';

export const InputStyles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  form: {
    width: '100%',
    marginVertical: 16,
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

export const SurfaceStyles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight:160,
    flexDirection: 'column',
    margin: 2,
    padding: 8,
    borderRadius: 8,
    borderColor: COLOUR_SUBTLE,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOUR_LIGHT,
  },
  titleCard: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    fontSize: 12,
    fontStyle: 'italic',
  },
  title: {
    width: '100%',
    paddingLeft: 16,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOUR_DARK,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    color: COLOUR_SUBTLE,
  },
});

export const ScreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    justifyContent: 'center',
  },
});
