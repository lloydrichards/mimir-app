import React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';
import {COLOUR_DARK, COLOUR_FLUFF} from '../../Styles/Colours';
import {MediumFeatherIconProps, SmallFeatherIconProps} from '../../Styles/Icons';

export interface MapProps {
  id: string;
  field: string;
  icon: (
    props?: SvgProps & {colour?: string; background?: string},
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
            {...SmallFeatherIconProps}
            stroke={props?.colour || COLOUR_DARK}
          />
        ))}
      </Svg>
    );
  };

  export const MediumIcon =
  (ds: string[]) =>
  (props?: SvgProps & {colour?: string; background?: string}) => {
    return (
      <Svg width={44} height={44} viewBox="0 0 44 44" {...props}>
        {ds.map((d, i) => (
          <Path
            key={i}
            d={d}
            {...MediumFeatherIconProps}
            stroke={props?.colour || COLOUR_DARK}
          />
        ))}
      </Svg>
    );
  };
