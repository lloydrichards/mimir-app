import React from 'react';
import { MenuItem } from '@material-ui/core';
import { components, OptionProps, StylesConfig } from 'react-select';
import algoliasearch from 'algoliasearch';
import AsyncSelect from 'react-select/async';
import { PlantTypesMap } from '../Molecule-Data/PlantTypesMap';

interface Props {
  onChange: (option: any) => void;
  initialValue: string;
}

const searchClient = algoliasearch(
  '8RSL939QLN',
  '6dd4cdac7e6ef3764c918f8379a0145a'
);
const index = searchClient.initIndex('mimirSpecies');

export const SearchSpecies: React.FC<Props> = ({ onChange, initialValue }) => {
  const promiseOptions = async (inputValue: string) => {
    const resp = await index.search(inputValue).then(({ hits }) => hits);
    console.log('respnonse', resp);
    const result = resp.map((item: any) => ({
      label: item.objectID,
      value: {
        family: item.family,
        genus: item.genus,
        species: item.species,
        subspecies: item.subspecies,
        cultivar: item.cultivar,
        type: item.type,
        id: item.objectID,
      },
      image: item.images[0],
      common: item.common_name[0],
      description: item.description,
    }));
    console.log(result);
    return result;
  };

  const ITEM_HEIGHT = 48;

  const customStyles: StylesConfig<any, any> = {
    container: (base) => ({
      ...base,
      padding: '10px 0',
    }),
    control: () => ({
      display: 'flex',
      alignItems: 'center',
      border: 0,
      borderBottom: '1px solid grey',
      height: 'auto',
      background: 'transparent',
      '&:hover': {
        boxShadow: 'none',
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
      fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
    }),
    menu: () => ({
      backgroundColor: 'white',
      boxShadow: '1px 2px 6px #888888', // should be changed as material-ui
      position: 'absolute',
      left: 0,
      top: `calc(100% + 1px)`,
      width: '100%',
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5,
    }),
    menuList: () => ({
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: 'auto',
    }),
    option: () => ({
      padding: 0,
    }),
  };

  const CustomOption = (props: OptionProps<any, any>) => {
    const { data } = props;
    const plantType = PlantTypesMap.find((i) => i.id === data.value.type);

    return (
      <components.Option {...props}>
        <MenuItem>
          {data.image && (
            <img
              alt={`${data.label}`}
              style={{ width: 30, borderRadius: '15%', paddingRight: '10px' }}
              src={data.image[0].thumb}
            />
          )}
          {plantType?.icon()}
          {data.common}({data.value.id}) -- {data.description}
        </MenuItem>
      </components.Option>
    );
  };

  return (
    <AsyncSelect
      isAsync
      cacheOptions
      styles={customStyles}
      components={{
        Option: CustomOption,
      }}
      loadOptions={promiseOptions}
      onChange={onChange}
      defaultInputValue={initialValue}
      placeholder='Search Species...'
    />
  );
};
