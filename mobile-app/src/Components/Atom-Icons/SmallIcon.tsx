import React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';
import {COLOUR_DARK, COLOUR_FLUFF} from '../../Styles/Colours';
import {FeatherIconProps} from '../../Styles/Icons';

export interface MapProps {
  id: string;
  field: string;
  icon: (
    props?: SvgProps,
    colour?: string,
    backgroundColour?: string,
  ) => JSX.Element;
}

export const SmallIcon =
  (ds: string[]) =>
  (props?: SvgProps & {colour?: string; background?: string}) => {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
        <Rect
          x="4.36731"
          y="4.62939"
          width="16"
          height="16"
          rx="5"
          fill={props?.background || COLOUR_FLUFF}
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
