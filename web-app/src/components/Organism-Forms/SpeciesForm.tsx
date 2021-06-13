import { Button, MenuItem, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import * as React from "react";
import { TextField } from "../Atom-Inputs/TextField";
import app, { timestamp } from "../../firebase";
import { TextArea } from "../Atom-Inputs/TextArea";
import { Selector } from "../Atom-Inputs/Selector";
import { useHistory } from "react-router-dom";
import { Switch } from "../Atom-Inputs/Switch";
import { Slider } from "../Atom-Inputs/Slider";
import {
  GrowthRateTypes,
  MaintenanceTypes,
  ModelProps,
  SpeciesProps,
} from "@mimir/SpeciesType";
import { HardinessTypeMap } from "../Molecule-Data/HardinessTypeMap";
import { ExposureTypeMap } from "../Molecule-Data/ExposureTypeMap";
import { PlantTypesMap } from "../Molecule-Data/PlantTypesMap";
import { PlantTypes } from "../../types/PlantType";

interface Props {
  edit?: SpeciesProps;
  altButton?: { label: string; onClick: () => void };
  debug?: boolean;
}
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
    id += " x " + species;
  }
  if (!species) {
    id += " spp.";
  } else {
    id += " " + species;
  }
  if (subspecies) {
    id += " ssp. " + subspecies.toLowerCase();
  }
  if (cultivar) {
    id += " (" + cultivar.toLowerCase() + ")";
  }

  return id;
};

const SpeciesForm: React.FC<Props> = ({ edit, altButton, debug }) => {
  const history = useHistory();

  console.log("Edit:", edit);
  return (
    <div>
      <Formik
        enableReinitialize
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

            const speciesDoc = db.collection("Species").doc(species_id);
            const modelDoc = speciesDoc.collection("model").doc();

            const doc: SpeciesProps = {
              id: species_id,
              botanical: {
                family: data.family,
                genus: data.genus,
                species: data.species,
                subspecies: data.subspecies
                  ? `${data.subspecies}`.toLowerCase()
                  : null,
                cultivar: data.cultivar
                  ? `${data.cultivar}`.toLowerCase()
                  : null,
              },
              growth: {
                hardiness: data.hardiness,
                exposure: data.exposure,
                soil: data.soil,
                water: data.water,
                height_max: data.height_max || 0,
                height_min: data.height_min || 0,
                spread_min: data.spread_min || 0,
                spread_max: data.spread_max || 0,
                rate: data.growth_rate,
                maintenance: data.maintenance,
                form: data.form,
              },
              traits: {
                origin: data.origin.split(", "),
                edible: data.edible,
                poisonous: data.poisonous,
                pet_friendly: data.pet_friendly,
                air_purifying: data.air_purifying,
                pests: data.pests,
              },
              description: data.description,
              common_name: data.common_name.toLowerCase().split(", "),
              type: data.type,
              habitat: [],
              images: [],
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
            };

            batch.set(speciesDoc, doc);
            batch.set(modelDoc, model);

            return batch.commit().then(() => history.push("/"));
          } catch (error) {
            console.log("error:", error);
            alert(error);
            setStatus(error);
          }

          setSubmitting(false);
        }}
        initialValues={{
          family: edit?.botanical.family || "",
          genus: edit?.botanical.genus || "",
          species: edit?.botanical.species || "",
          subspecies: edit?.botanical.subspecies || null,
          cultivar: edit?.botanical.cultivar || null,
          hybrid: false,
          description: edit?.description || "",
          common_name:
            edit?.common_name.reduce((acc, cur) => acc.concat(`${cur}, `)) ||
            "",
          type: edit?.type || ("" as PlantTypes),
          habitat: edit?.habitat || [],
          form: edit?.growth.form || [],
          origin:
            edit?.traits.origin.reduce((acc, cur) => acc.concat(`${cur}, `)) ||
            "",
          edible: edit?.traits.edible || false,
          poisonous: edit?.traits.poisonous || false,
          pet_friendly: edit?.traits.pet_friendly || false,
          air_purifying: edit?.traits.air_purifying || false,
          hardiness: edit?.growth.hardiness || [],
          exposure: edit?.growth.exposure || [],
          soil: edit?.growth.soil || [],
          water: edit?.growth.water || [],
          height_max: edit?.growth.height_max || null,
          height_min: edit?.growth.height_min || null,
          spread_min: edit?.growth.spread_min || null,
          spread_max: edit?.growth.spread_max || null,
          growth_rate: edit?.growth.rate || ("" as GrowthRateTypes),
          maintenance: edit?.growth.maintenance || ("" as MaintenanceTypes),
          pests: edit?.traits.pests || [],
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
          },
        }}
      >
        {({ isSubmitting, values, status, errors }) => (
          <Form>
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
            <Selector label='Plant Type' name='type'>
              {PlantTypesMap.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.icon()}
                  {i.name}
                </MenuItem>
              ))}
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
              {HardinessTypeMap.map((h) => (
                <MenuItem value={h.id}>
                  {h.name}
                  <small>
                    ({h.low} to {h.high}°C)
                  </small>
                </MenuItem>
              ))}
            </Selector>
            <Selector label='Exposure' name='exposure' multiple>
              {ExposureTypeMap.map((e) => (
                <MenuItem value={e.id}>{e.name}</MenuItem>
              ))}
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
            {!edit && (
              <div
                style={{
                  margin: "8px 0px",
                  padding: "16px",
                  border: "2px solid lightgrey",
                  borderRadius: "8px",
                }}
              >
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
            )}
            <div style={{ display: "flex" }}>
              {altButton && (
                <Button fullWidth onClick={altButton.onClick}>
                  {altButton.label}
                </Button>
              )}
              <Button
                fullWidth
                variant='contained'
                color='primary'
                type='submit'
                disabled={isSubmitting}
              >
                Save
              </Button>
            </div>
            {status ? <div>{status.message}</div> : null}
            {debug ? (
              <div
                style={{
                  border: "2px dashed tomato",
                  background: "snow",
                  margin: "1rem 0",
                  borderRadius: "1rem",
                  padding: "0.5rem",
                }}
              >
                <Typography variant='h4'>Debug</Typography>
                <p>
                  Species Id:
                  {speciesIdBuilder(
                    values.genus,
                    values.species,
                    values.subspecies,
                    values.cultivar,
                    values.hybrid
                  )}
                </p>
                <pre>{JSON.stringify(values, null, 2)}</pre>
                <pre>{JSON.stringify(errors, null, 2)}</pre>
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SpeciesForm;
