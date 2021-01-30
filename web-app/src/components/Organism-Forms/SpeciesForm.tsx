import { Button, MenuItem, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import * as React from 'react';
import { TextField } from '../Atom-Inputs/TextField';
import app, { timestamp } from '../../firebase';
import { TextArea } from '../Atom-Inputs/TextArea';
import { Selector } from '../Atom-Inputs/Selector';
import { useHistory } from 'react-router-dom';
import { Switch } from '../Atom-Inputs/Switch';
import { Slider } from '../Atom-Inputs/Slider';
import { ModelProps, SpeciesProps } from '../../types/SpeciesType';

interface Props {}
const db = app.firestore();

const speciesIdBuilder = (
  genus: string,
  species: string | null,
  subspecies: string | null,
  cultivar: string | null,
  hybrid: boolean
) => {
  var id = genus;

  if (hybrid && species) {
    id += ' x ' + species;
  }
  if (!species) {
    id += ' spp.';
  } else {
    id += ' ' + species;
  }
  if (subspecies) {
    id += ' ssp. ' + subspecies.toLowerCase();
  }
  if (cultivar) {
    id += ' (' + cultivar.toLowerCase() + ')';
  }

  return id;
};

const SpeciesForm: React.FC<Props> = () => {
  const history = useHistory();
  return (
    <div>
      <Formik
        onSubmit={async (data, { setStatus, setSubmitting, resetForm }) => {
          const batch = db.batch();
          setSubmitting(true);
          try {
            const species_id = speciesIdBuilder(
              data.genus,
              data.species,
              data.subspecies,
              data.cultivar,
              data.hybrid
            );

            const speciesDoc = db.collection('mimirSpecies').doc(species_id);
            const modelDoc = speciesDoc.collection('Model').doc('--Init--');

            const doc: SpeciesProps = {
              family: data.family,
              genus: data.genus,
              species: data.species,
              subspecies: data.subspecies
                ? `${data.subspecies}`.toLowerCase()
                : null,
              cultivar: data.cultivar ? `${data.cultivar}`.toLowerCase() : null,
              description: data.description,
              common_name: data.common_name.toLowerCase().split(', '),
              type: data.type,
              habitat: data.habitat,
              form: data.form,
              origin: data.origin.split(', '),
              edible: data.edible,
              poisonous: data.poisonous,
              pet_friendly: data.pet_friendly,
              air_purifying: data.air_purifying,
              hardiness: data.hardiness,
              exposure: data.exposure,
              soil: data.soil,
              water: data.water,
              height_max: data.height_max,
              height_min: data.height_min,
              spread_min: data.spread_min,
              spread_max: data.spread_max,
              growth_rate: data.growth_rate,
              maintenance: data.maintenance,
              pests: data.pests,
            };

            const model: ModelProps = {
              timestamp,
              current: true,
              temperature: {
                min: data.model.temperature.min,
                optimal_low: data.model.temperature.min,
                optimal_high: data.model.temperature.max,
                max: data.model.temperature.max,
              },
              humidity: {
                min: data.model.humidity.min,
                optimal_low: data.model.humidity.min,
                optimal_high: data.model.humidity.max,
                max: data.model.humidity.max,
              },
              light: {
                low_min: 0,
                low_max: 12,
                medium_min: 0,
                medium_max: 12,
                bright_min: 0,
                bright_max: 12,
                full_min: 0,
                full_max: 12,
                lux_min: data.model.light.lux_min,
                lux_max: data.model.light.lux_max,
              },
              air: { max: 500 },
            };

            batch.set(speciesDoc, doc);
            batch.set(modelDoc, model);

            return batch.commit().then(() => history.push('/'));
          } catch (error) {
            console.log('error:', error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          family: '',
          genus: '',
          species: '',
          subspecies: null,
          cultivar: null,
          hybrid: false,
          description: '',
          common_name: '',
          type: [],
          habitat: [],
          form: [],
          origin: '',
          edible: false,
          poisonous: false,
          pet_friendly: false,
          air_purifying: false,
          hardiness: [],
          exposure: [],
          soil: [],
          water: [],
          height_max: null,
          height_min: null,
          spread_min: null,
          spread_max: null,
          growth_rate: null,
          maintenance: null,
          pests: [],
          model: {
            temperature: {
              min: 7.5,
              optimal_low: 7.5,
              optimal_high: 33.8,
              max: 33.8,
            },
            humidity: {
              min: 26,
              optimal_low: 26,
              optimal_high: 81,
              max: 81,
            },
            light: {
              low_min: 0,
              low_max: 12,
              medium_min: 0,
              medium_max: 12,
              bright_min: 0,
              bright_max: 12,
              full_min: 0,
              full_max: 12,
              lux_min: 2562,
              lux_max: 53647,
            },
            air: { max: 500 },
          },
        }}>
        {({ isSubmitting, values, status }) => (
          <Form>
            <p>
              {speciesIdBuilder(
                values.genus,
                values.species,
                values.subspecies,
                values.cultivar,
                values.hybrid
              )}
            </p>
            <TextField
              label='Family'
              name='family'
              placeholder='Family'
              type='input'
            />
            <TextField
              label='Genus'
              name='genus'
              placeholder='Genus'
              type='input'
            />
            <TextField
              label='Species'
              name='species'
              placeholder='Species'
              type='input'
            />
            <TextField
              label='Subspecies'
              name='subspecies'
              placeholder='Subspecies'
              type='input'
            />
            <TextField
              label='Cultivar'
              name='cultivar'
              placeholder='Cultivar'
              type='input'
            />
            <Switch label='Hybrid' name='hybrid' checked={values.hybrid} />
            <TextArea
              label='Common Names'
              name='common_name'
              placeholder='Enter all common names, seperated with commas'
              type='input'
              rowsMax={5}
            />
            <TextArea
              label='Description'
              name='description'
              placeholder='Description'
              type='input'
              rowsMax={5}
            />
            <Selector label='Plant Type' name='type' multiple>
              <MenuItem value='ANNUAL'>Annual</MenuItem>
              <MenuItem value='AQUATIC_PLANT'>Aquatic</MenuItem>
              <MenuItem value='BAMBOO'>Bamboo</MenuItem>
              <MenuItem value='BIENNIAL'>Biennial</MenuItem>
              <MenuItem value='BROADLEAF_EVERGREEN'>
                Broadlead Evergreen
              </MenuItem>
              <MenuItem value='CONIFER'>Conifer</MenuItem>
              <MenuItem value='FERN'>Fern</MenuItem>
              <MenuItem value='FLOWERING_CUT_PLANT'>Flowering (Cut)</MenuItem>
              <MenuItem value='FLOWERING_POT_PLANT'>Flowering (Pot)</MenuItem>
              <MenuItem value='GREENHOUSE_PRODUCE_PLANT'>
                Greenhouse Produce
              </MenuItem>
              <MenuItem value='GROUND_COVER'>Ground Cover</MenuItem>
              <MenuItem value='HERBACEOUS_PERENNIAL'>
                Herbaceous Perennial
              </MenuItem>
              <MenuItem value='INDOOR_FOLIAGE_PLANT'>Indoor Foliage</MenuItem>
              <MenuItem value='INVASIVE_PLANT'>Invasive</MenuItem>
              <MenuItem value='POALES_(GRASS-LIKE)'>
                Poales (Grass Like)
              </MenuItem>
              <MenuItem value='SEMI-EVERGREEN'>Semi-Evergreen</MenuItem>
              <MenuItem value='SHRUB_DECIDUOUS'>Deciduous Shrub</MenuItem>
              <MenuItem value='TREE_DECIDUOUS'>Deciduous Tree</MenuItem>
              <MenuItem value='WEED_(HORTICULTURAL)'>Weed</MenuItem>
            </Selector>
            <Selector label='Habitat' name='habitat' multiple>
              <MenuItem value='ARCHING'>Arching</MenuItem>
              <MenuItem value='DENSE'>Dense</MenuItem>
              <MenuItem value='EPIPHYTIC'>Epiphytic</MenuItem>
              <MenuItem value='FASTIGIATE'>Fastigiate</MenuItem>
              <MenuItem value='HORIZONTAL'>Horizontal</MenuItem>
              <MenuItem value='IRREGULAR'>Irregular</MenuItem>
              <MenuItem value='OPEN'>Open</MenuItem>
              <MenuItem value='PENDULOUS'>Pendulous</MenuItem>
              <MenuItem value='SPREADING'>Spreading</MenuItem>
              <MenuItem value='STIFFLY_UPRIGHT'>Stiffly Upright</MenuItem>
              <MenuItem value='TWIGGY'>Twiggy</MenuItem>
              <MenuItem value='UPRIGHT'>Upright</MenuItem>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
            </Selector>
            <Selector label='Form' name='form' multiple>
              <MenuItem value='ARCHING'>Arching</MenuItem>
              <MenuItem value='CREEPING_MAT-LIKE'>Creeping</MenuItem>
              <MenuItem value='IRREGULAR'>Irregular</MenuItem>
              <MenuItem value='MOUNDED'>Mounded</MenuItem>
              <MenuItem value='OVAL_HORIZONTAL'>Oval Horizontal</MenuItem>
              <MenuItem value='OVAL_VERTICAL'>Oval Vertical</MenuItem>
              <MenuItem value='PYRAMIDAL_NARROWLY'>Pyramidal Narrowly</MenuItem>
              <MenuItem value='PYRAMIDAL_WIDELY'>Pyramidal Widely</MenuItem>
              <MenuItem value='ROUND'>Round</MenuItem>
              <MenuItem value='VASE'>Vase</MenuItem>
              <MenuItem value='WEEPING'>Weeping</MenuItem>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
            </Selector>
            <TextArea
              label='Origin'
              name='origin'
              placeholder='Enter all the origins, seperated with commas'
              type='input'
              rowsMax={5}
            />
            <Switch label='Edible' name='edible' checked={values.edible} />
            <Switch
              label='Poisonous'
              name='poisonous'
              checked={values.poisonous}
            />
            <Switch
              label='Pet Friendly'
              name='pet_friendly'
              checked={values.pet_friendly}
            />
            <Switch
              label='Air Purifying'
              name='air_purifying'
              checked={values.air_purifying}
            />
            <Selector label='Hardiness' name='hardiness' multiple>
              <MenuItem value='ZONE_1'>Zone 1</MenuItem>
              <MenuItem value='ZONE_10'>Zone 10</MenuItem>
              <MenuItem value='ZONE_11'>Zone 11</MenuItem>
              <MenuItem value='ZONE_2'>Zone 2</MenuItem>
              <MenuItem value='ZONE_3'>Zone 3</MenuItem>
              <MenuItem value='ZONE_4'>Zone 4</MenuItem>
              <MenuItem value='ZONE_5'>Zone 5</MenuItem>
              <MenuItem value='ZONE_6'>Zone 6</MenuItem>
              <MenuItem value='ZONE_7'>Zone 7</MenuItem>
              <MenuItem value='ZONE_8A'>Zone 8a</MenuItem>
              <MenuItem value='ZONE_8B'>Zone 8b</MenuItem>
              <MenuItem value='ZONE_9'>Zone 9</MenuItem>
            </Selector>
            <Selector label='Exposure' name='exposure' multiple>
              <MenuItem value='FULL_SUN'>Full Sun</MenuItem>
              <MenuItem value='FILTERED_SHADE'>Filtered Shade</MenuItem>
              <MenuItem value='PART_SHADE'>Part Shade</MenuItem>
              <MenuItem value='SHELTERED'>Sheltered</MenuItem>
              <MenuItem value='DEEP_SHADE'>Deep Shade</MenuItem>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
            </Selector>
            <Selector label='Soil' name='soil' multiple>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
              <MenuItem value='ACIDIC'>Acidic</MenuItem>
              <MenuItem value='ALKALINE'>Alkaline</MenuItem>
              <MenuItem value='BOG'>Bog</MenuItem>
              <MenuItem value='DRY'>Dry</MenuItem>
              <MenuItem value='GRAVELLY'>Gravelly</MenuItem>
              <MenuItem value='HUMUS_RICH'>Humus</MenuItem>
              <MenuItem value='ROCKY'>Rocky</MenuItem>
              <MenuItem value='WELL-DRAINED'>Well Drained</MenuItem>
            </Selector>
            <Selector label='Water' name='water' multiple>
              <MenuItem value='AQUATIC'>Aquatic</MenuItem>
              <MenuItem value='HIGH'>High</MenuItem>
              <MenuItem value='LOW'>Low</MenuItem>
              <MenuItem value='MODERATE'>Moderate</MenuItem>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
              <MenuItem value='SUMMER_DRY'>Dry Summer</MenuItem>
              <MenuItem value='WETLANDS'>Wetland</MenuItem>
              <MenuItem value='WINTER_DRY'>Dry Winter</MenuItem>
            </Selector>
            <TextField
              label='Height Max '
              name='height_max'
              placeholder='Height Max'
              type='input'
            />
            <TextField
              label='Height Min '
              name='height_min'
              placeholder='Height Min'
              type='input'
            />
            <TextField
              label='Spread Max '
              name='spread_max'
              placeholder='Spread Max'
              type='input'
            />
            <TextField
              label='Spread Min '
              name='spread_min'
              placeholder='Spread Min'
              type='input'
            />
            <Selector label='Growth Rate' name='growth_rate'>
              <MenuItem value='SLOW'>Slow</MenuItem>
              <MenuItem value='MODERATE'>Moderate</MenuItem>
              <MenuItem value='FAST'>Fast</MenuItem>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
            </Selector>
            <Selector label='Maintenance' name='maintenance'>
              <MenuItem value='LOW'>Low</MenuItem>
              <MenuItem value='MEDIUM'>Medium</MenuItem>
              <MenuItem value='HIGH'>High</MenuItem>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
            </Selector>
            <Selector label='Pests' name='pests' multiple>
              <MenuItem value='ABIOTIC_DISORDER'>Abiotic Disorder</MenuItem>
              <MenuItem value='ADELGIDS'>Adelgids</MenuItem>
              <MenuItem value='ANTHRACNOSE'>Anthracnose</MenuItem>
              <MenuItem value='APHIDS'>Aphids</MenuItem>
              <MenuItem value='BACTERIAL_LEAF_SPOT'>
                Bacterial Leaf Spot
              </MenuItem>
              <MenuItem value='BEETLES'>Beetles</MenuItem>
              <MenuItem value='BLIGHT'>Blight</MenuItem>
              <MenuItem value='CANKER'>Canker</MenuItem>
              <MenuItem value='CATERPILLAR'>Caterpillar</MenuItem>
              <MenuItem value='CROWN_ROT'>Crown Rot</MenuItem>
              <MenuItem value='CUTWORM'>Cutworm</MenuItem>
              <MenuItem value='DEER_RESISTANT'>Deer Resistant</MenuItem>
              <MenuItem value='DIEBACK'>Dieback</MenuItem>
              <MenuItem value='DIPTERA_TRUE_FLIES'>Diptera True Flies</MenuItem>
              <MenuItem value='DISEASE_RESISTANT'>Disease Resistant</MenuItem>
              <MenuItem value='DROUGHT_RESISTANT'>Deer Resistant</MenuItem>
              <MenuItem value='EARWIGS'>Earwigs</MenuItem>
              <MenuItem value='FUNGAL_LEAF_SPOT'>Fungal Leaf Spot</MenuItem>
              <MenuItem value='GALLS'>Galls</MenuItem>
              <MenuItem value='HEART_ROT'>Heart Rot</MenuItem>
              <MenuItem value='HETEROPTERA_TRUE_BUGS'>
                Heteroptera True Bugs
              </MenuItem>
              <MenuItem value='LEAFHOPPER'>Leafhopper</MenuItem>
              <MenuItem value='LEAF_MINER_INSECT'>Leaf Miner Insect</MenuItem>
              <MenuItem value='LEAF_SCORCH'>Leaf Scorch</MenuItem>
              <MenuItem value='MEALYBUGS'>Mealybugs</MenuItem>
              <MenuItem value='MILDEW'>Mildew</MenuItem>
              <MenuItem value='MISTLETOE'>Mistletoe</MenuItem>
              <MenuItem value='MITES'>Mites</MenuItem>
              <MenuItem value='MOLD'>Mold</MenuItem>
              <MenuItem value='UNKNOWN'>Unknown</MenuItem>
              <MenuItem value='NEEDLE_CAST'>Needle Cast</MenuItem>
              <MenuItem value='NEMATODES'>Nematodes</MenuItem>
              <MenuItem value='PEST_RESISTANT'>Pest Resistant</MenuItem>
              <MenuItem value='PSYLLIDS'>Psyllids</MenuItem>
              <MenuItem value='RABBIT_RESISTANT'>Rabbit Resistant</MenuItem>
              <MenuItem value='RODENTS'>Rodents</MenuItem>
              <MenuItem value='ROOT_ROT'>Root Rot</MenuItem>
              <MenuItem value='RUST'>Rust</MenuItem>
              <MenuItem value='SAP_ROT'>Sap Rot</MenuItem>
              <MenuItem value='SAWFLIES'>Sawflies</MenuItem>
              <MenuItem value='SCALE_INSECTS'>Scale Insects</MenuItem>
              <MenuItem value='SLUGS'>Slugs</MenuItem>
              <MenuItem value='SNAILS'>Snails</MenuItem>
              <MenuItem value='SPITTLEBUG'>Spittlebug</MenuItem>
              <MenuItem value='STEM_BORER_INSECTS'>Stem Borer Insect</MenuItem>
              <MenuItem value='THRIPS'>Thrips</MenuItem>
              <MenuItem value='VIRUS'>Virus</MenuItem>
              <MenuItem value='WEEVILS'>Weevils</MenuItem>
              <MenuItem value='WHITEFLY'>Whitefly</MenuItem>
              <MenuItem value='WILT'>Wilt</MenuItem>
              <MenuItem value='WOOD_DEFORMITY'>Wood Deformity</MenuItem>
            </Selector>
            <div
              style={{
                margin: '8px 0px',
                padding: '16px',
                border: '2px solid lightgrey',
                borderRadius: '8px',
              }}>
              <Typography variant='h5'>Model</Typography>
              <Slider
                label='Min Temperature'
                name='model.temperature.min'
                inputProps={{ max: 50, min: 0, step: 0.1 }}
              />
              <Slider
                label='Max Temperature'
                name='model.temperature.max'
                inputProps={{ max: 50, min: 0, step: 0.1 }}
              />
              <Slider
                label='Min Humidity'
                name='model.humidity.min'
                inputProps={{ max: 100, min: 0, step: 1 }}
              />
              <Slider
                label='Max Humidity'
                name='model.humidity.max'
                inputProps={{ max: 100, min: 0, step: 1 }}
              />
              <Slider
                label='Min Light'
                name='model.light.lux_min'
                inputProps={{ max: 80000, min: 0, step: 1 }}
              />
              <Slider
                label='Max Light'
                name='model.light.lux_max'
                inputProps={{ max: 80000, min: 0, step: 1 }}
              />
            </div>
            <div style={{ margin: '16px 0px' }}>
              <Button
                fullWidth
                variant='contained'
                type='submit'
                disabled={isSubmitting}>
                Add Species
              </Button>
            </div>
            {status ? <div>{status.message}</div> : null}
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SpeciesForm;
