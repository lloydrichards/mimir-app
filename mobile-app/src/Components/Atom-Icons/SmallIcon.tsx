import React, {SVGProps} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Rect, Path, SvgProps} from 'react-native-svg';
import {COLOUR_DARK} from '../../Styles/Colours';
import {FeatherIconProps} from '../../Styles/Icons';

export const SmallIcon =
  (ds: string[]) =>
  (props?: SvgProps & {colour?: string; backgroundColor?: string}) => {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
        <Rect
          x="4.36731"
          y="4.62939"
          width="16"
          height="16"
          rx="5"
          fill={props?.backgroundColor || '#BCD9D4'}
        />
        {ds.map((d, i) => (
          <Path
            key={i}
            d={d}
            {...FeatherIconProps}
            stroke={props?.colour || COLOUR_DARK}
          />
        ))}
      </Svg>
    );
  };
