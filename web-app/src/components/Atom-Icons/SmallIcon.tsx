import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import React from 'react';
import { COLOUR_DARK } from '../../Styles/Colours';
import { FeatherIconProps } from '../../Styles/Icons';

export const SmallIcon = (d: string) => (
  props?: SvgIconProps,
  colour?: string
) => {
  return (
    <SvgIcon {...props}>
      <path d={d} {...FeatherIconProps} color={colour || COLOUR_DARK} />
    </SvgIcon>
  );
};
