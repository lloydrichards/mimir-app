import { Log, LogTypes } from "@mimir/LogType";
import { PlantAggProps } from "@mimir/PlantType";
import { SpaceAggProps } from "@mimir/SpaceType";
import { UserAggProps } from "@mimir/UserType";
import { levelUp } from "./levelSystem";

export const calcSpaceTotal = (doc: UserAggProps, type: Array<LogTypes>) => {
  const total = type.includes("SPACE_CREATED")
    ? doc.space_total + 1
    : type.includes("SPACE_DELETED")
    ? doc.space_total - 1
    : doc.space_total;

  return +total;
};
export const calcChildrenTotal = (
  doc: PlantAggProps,
  type: Array<LogTypes>
) => {
  const total = type.includes("PLANT_CUTTING")
    ? doc.children_total + 1
    : doc.children_total;

  return +total;
};

export const calcPlantTotal = (
  doc: UserAggProps | SpaceAggProps,
  type: Array<LogTypes>,
  content: Partial<Log["content"]>,
  space_id?: string
) => {
  if (space_id) {
    const _total =
      type.includes("PLANT_CREATED") ||
      type.includes("PLANT_CUTTING") ||
      (type.includes("PLANT_MOVED") && content.toSpace?.id === space_id)
        ? doc.plant_total + 1
        : type.includes("PLANT_DIED") ||
          type.includes("PLANT_DELETED") ||
          (type.includes("PLANT_MOVED") && content.fromSpace?.id === space_id)
        ? doc.plant_total - 1
        : doc.plant_total;

    return +_total;
  }
  const total =
    type.includes("PLANT_CREATED") || type.includes("PLANT_CUTTING")
      ? doc.plant_total + 1
      : type.includes("PLANT_DIED") || type.includes("PLANT_DELETED")
      ? doc.plant_total - 1
      : doc.plant_total;

  return +total;
};

export const calcDeadTotal = (
  doc: UserAggProps | SpaceAggProps,
  type: Array<LogTypes>
) => {
  const total = type.includes("PLANT_DIED")
    ? doc.dead_total + 1
    : doc.dead_total;

  return +total;
};

export const calcPointTotal = (
  doc: UserAggProps,
  type: Array<LogTypes>,
  content: Partial<Log["content"]>
) => {
  const total = type.includes("POINTS")
    ? doc.points + (content.points || 0)
    : doc.points;

  return +total;
};

export const calcLevel = (
  doc: UserAggProps,
  type: Array<LogTypes>,
  content: Partial<Log["content"]>
) => {
  const total = type.includes("POINTS")
    ? levelUp(doc.points + (content.points || 0))
    : doc.level;

  return +total;
};

export const calcInspectionsTotal = (
  doc: SpaceAggProps | PlantAggProps,
  type: Array<LogTypes>
) => {
  const total = type.includes("INSPECTION_CREATED")
    ? doc.inspection_total + 1
    : type.includes("INSPECTION_DELETED")
    ? doc.inspection_total - 1
    : doc.inspection_total;

  return +total;
};
export const calcWateringsTotal = (
  doc: SpaceAggProps | PlantAggProps,
  type: Array<LogTypes>
) => {
  const total = type.includes("WATERING_CREATED")
    ? doc.watering_total + 1
    : type.includes("WATERING_DELETED")
    ? doc.watering_total - 1
    : doc.watering_total;

  return +total;
};
export const calcFertilizerTotal = (
  doc: SpaceAggProps | PlantAggProps,
  type: Array<LogTypes>,
  content: Partial<Log["content"]>
) => {
  const total =
    type.includes("WATERING_CREATED") && content.water.fertilizer
      ? doc.watering_total + 1
      : type.includes("WATERING_DELETED") && content.water.fertilizer
      ? doc.watering_total - 1
      : type.includes("WATERING_UPDATED") &&
        content.water.fertilizer &&
        content.oldWater;

  //TODO: WATER_UPDATED

  return +total;
};

export const calcHappinessTotal = (
  doc: PlantAggProps,
  type: Array<LogTypes>,
  content: Partial<Log["content"]>
) => {
  const total =
    type.includes("INSPECTION_CREATED") &&
    content.inspection &&
    content.oldInspection
      ? doc.happiness_total + content.inspection.happiness
      : type.includes("INSPECTION_DELETED") &&
        content.inspection &&
        content.oldInspection
      ? doc.happiness_total - content.inspection.happiness
      : type.includes("INSPECTION_UPDATED")
      ? doc.happiness_total +
        (content.inspection.happiness - content.oldInspection.happiness)
      : doc.happiness_total;

  //TODO:INSPECTION_UPDATED

  return +total;
};
export const calcHealthTotal = (
  doc: PlantAggProps,
  type: Array<LogTypes>,
  content: Partial<Log["content"]>
) => {
  const total =
    type.includes("INSPECTION_CREATED") &&
    content.inspection &&
    content.oldInspection
      ? doc.health_total + content.inspection.health
      : type.includes("INSPECTION_DELETED") &&
        content.inspection &&
        content.oldInspection
      ? doc.health_total - content.inspection.health
      : type.includes("INSPECTION_UPDATED")
      ? doc.health_total +
        (content.inspection.health - content.oldInspection.health)
      : doc.health_total;

  //TODO:INSPECTION_UPDATED

  return +total;
};
