import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

import { FeatherIconProps } from '../../Styles/Icons';
import { MapProps } from '../../types/GenericType';
import { LightType } from '../../types/SpaceType';

export const NorthIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M11.0616 3.54693C11.383 2.67454 12.6169 2.67454 12.9383 3.54693L19.1562 20.424C19.4789 21.2998 18.5321 22.1011 17.7217 21.638L12.4961 18.6519C12.1887 18.4763 11.8113 18.4763 11.5038 18.6519L6.27823 21.638C5.46786 22.1011 4.52109 21.2998 4.84375 20.424L11.0616 3.54693Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const NorthwestIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M2.92844 4.25546C2.53884 3.41132 3.41132 2.53884 4.25546 2.92844L20.5861 10.4657C21.4335 10.8568 21.3306 12.0928 20.4301 12.3384L14.6236 13.922C14.282 14.0151 14.0151 14.282 13.922 14.6236L12.3384 20.4301C12.0928 21.3306 10.8568 21.4335 10.4657 20.5861L2.92844 4.25546Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const WestIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M3.54693 12.9383C2.67454 12.6169 2.67454 11.383 3.54693 11.0616L20.424 4.84374C21.2998 4.52107 22.1011 5.46784 21.638 6.27822L18.6519 11.5038C18.4763 11.8113 18.4763 12.1887 18.6519 12.4961L21.638 17.7217C22.1011 18.5321 21.2998 19.4788 20.424 19.1562L3.54693 12.9383Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const SouthwestIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M4.25546 21.0715C3.41132 21.4611 2.53884 20.5887 2.92844 19.7445L10.4657 3.41391C10.8568 2.56646 12.0928 2.66938 12.3384 3.56984L13.922 9.37637C14.0151 9.71797 14.282 9.98485 14.6236 10.078L20.4301 11.6616C21.3306 11.9072 21.4335 13.1432 20.5861 13.5343L4.25546 21.0715Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const SouthIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M12.9383 20.4531C12.6169 21.3255 11.3831 21.3255 11.0616 20.4531L4.84377 3.57596C4.5211 2.70016 5.46787 1.89894 6.27825 2.36201L11.5039 5.34807C11.8113 5.52375 12.1887 5.52375 12.4961 5.34807L17.7217 2.36201C18.5321 1.89894 19.4789 2.70016 19.1562 3.57596L12.9383 20.4531Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const SoutheastIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M21.0716 19.7445C21.4612 20.5887 20.5887 21.4612 19.7446 21.0715L3.41394 13.5343C2.56649 13.1432 2.66941 11.9072 3.56987 11.6616L9.3764 10.078C9.71801 9.98485 9.98488 9.71798 10.078 9.37637L11.6616 3.56985C11.9072 2.66939 13.1432 2.56646 13.5344 3.4139L21.0716 19.7445Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const EastIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M20.4531 11.0617C21.3255 11.3831 21.3255 12.617 20.4531 12.9384L3.57596 19.1563C2.70016 19.4789 1.89894 18.5322 2.36201 17.7218L5.34807 12.4962C5.52375 12.1887 5.52375 11.8113 5.34807 11.5039L2.36201 6.2783C1.89894 5.46792 2.70016 4.52115 3.57596 4.84381L20.4531 11.0617Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const NortheastIcon = (props?: SvgIconProps, colour?: string) => {
  return (
    <SvgIcon {...props}>
      <path
        d='M19.7445 2.92844C20.5887 2.53884 21.4612 3.41132 21.0715 4.25546L13.5343 20.5861C13.1432 21.4335 11.9072 21.3306 11.6616 20.4301L10.078 14.6236C9.98485 14.282 9.71798 14.0151 9.37637 13.922L3.56984 12.3384C2.66938 12.0928 2.56646 10.8568 3.4139 10.4657L19.7445 2.92844Z'
        {...FeatherIconProps}
        stroke={colour}
      />
    </SvgIcon>
  );
};

export const LightDirectionMap: Array<MapProps & { id: LightType }> = [
  { id: 'S', icon: SouthIcon, field: 'South' },
  {
    id: 'SE',
    icon: SoutheastIcon,
    field: 'Southeast',
  },
  { id: 'E', icon: EastIcon, field: 'East' },
  {
    id: 'NE',
    icon: NortheastIcon,
    field: 'Northeast',
  },
  { id: 'N', icon: NorthIcon, field: 'North' },
  {
    id: 'NW',
    icon: NorthwestIcon,
    field: 'Northwest',
  },
  { id: 'W', icon: WestIcon, field: 'West' },
  {
    id: 'SW',
    icon: SouthwestIcon,
    field: 'Southwest',
  },
];
