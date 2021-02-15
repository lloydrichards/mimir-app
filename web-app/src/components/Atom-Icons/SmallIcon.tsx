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
      <rect
        x='4.36731'
        y='4.62939'
        width='16'
        height='16'
        rx='5'
        fill='#BCD9D4'
      />
      <path d={d} {...FeatherIconProps} color={colour || COLOUR_DARK} />
    </SvgIcon>
  );
};
