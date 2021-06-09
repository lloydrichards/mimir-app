import {MapProps} from '../Atom-Icons/BaseIcons';
import {
  BlankFaceIcon,
  ConfusedFaceIcon,
  CryingFaceIcon,
  FedUpFaceIcon,
  LoveFaceIcon,
  NeutralFaceIcon,
  SweatFaceIcon,
  UpsetFaceIcon,
  WoozyFaceIcon,
} from '../Atom-Icons/Face/MediumFaceIcons';

export const MediumMoodMap = (value: {
  happiness: number;
  health: number;
}): MapProps & {id: string} => {
  if (!value) return {id: 'NEUTRAL', icon: NeutralFaceIcon, field: 'Neutral'};

  if (value.happiness <= 0.33) {
    if (value.health <= 0.33)
      return {id: 'FED_UP', field: 'Fed Up', icon: FedUpFaceIcon};
    if (value.health <= 0.66)
      return {id: 'CRYING', field: 'Crying', icon: CryingFaceIcon};
    if (value.health <= 1)
      return {id: 'UPSET', field: 'Upset', icon: UpsetFaceIcon};
  }
  if (value.happiness <= 0.66) {
    if (value.health <= 0.33)
      return {id: 'CONFUSED', field: 'Confused', icon: ConfusedFaceIcon};
    if (value.health <= 0.66)
      return {id: 'BLANK', field: 'Blank', icon: BlankFaceIcon};
    if (value.health <= 1)
      return {id: 'NEUTRAL', field: 'Neutral', icon: NeutralFaceIcon};
  }
  if (value.happiness <= 1) {
    if (value.health <= 0.33)
      return {id: 'SWEAT', field: 'Sweat', icon: SweatFaceIcon};
    if (value.health <= 0.66)
      return {id: 'WOOZY', field: 'Woozy', icon: WoozyFaceIcon};
    if (value.health <= 1)
      return {id: 'LOVE', field: 'Love', icon: LoveFaceIcon};
  }

  return {id: 'BLANK', field: 'Blank', icon: BlankFaceIcon};
};
