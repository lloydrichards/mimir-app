import { Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { SearchSpecies } from "src/components/Molecule-FormInputs/SpeciesSearch";
import { db } from "src/firebase";
import { SpeciesProps } from "src/types/SpeciesType";
import SpeciesForm from "../components/Organism-Forms/SpeciesForm";

function PlantEncyclopedia() {
  const [selected, setSelected] = useState<string | null>(null);
  const [data, setData] = useState<SpeciesProps | null>(null);

  useEffect(() => {
    if (selected) {
      const fetchData = async () => {
        const data = await db.collection("Species").doc(selected).get();
        if (data.exists) {
          setData(data.data() as SpeciesProps);
        }
      };
      fetchData();
    }
  }, [selected]);

  return (
    <div>
      <div
        style={{
          border: "1px solid lightgrey",
          borderRadius: "0.5rem",
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 120px",
            gap: "16px",
          }}
        >
          <SearchSpecies
            initialValue=''
            onChange={(option) => setSelected(option.label)}
          />
          <Button
            onClick={() => {
              setData(null);
              setSelected(null);
            }}
            variant='outlined'
          >
            Clear
          </Button>
        </div>
        <Typography align='center' variant='h4'>
          Add Species
        </Typography>
        {data ? (
          <SpeciesForm edit={data || undefined} />
        ) : (
          <SpeciesForm debug />
        )}
      </div>
    </div>
  );
}

export default PlantEncyclopedia;
