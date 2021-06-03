import { LogTypes, Log } from "@mimir/LogType";
import { PlantAggProps } from "@mimir/PlantType";
import { SpaceAggProps } from "@mimir/SpaceType";

export const calcNewEnvironment = (
  doc: SpaceAggProps | PlantAggProps,
  type: Array<LogTypes>,
  content: Partial<Log["content"]>
) => {
  const oldEnv = doc.env;
  if (type.includes("DEVICE_UPDATE") && content.daily) {
    const newEnv: SpaceAggProps["env"] = {
      reading_total: oldEnv.reading_total + content.daily.readings,
      temperature: {
        min: calcMin(oldEnv.temperature.min, content.daily.temperature.min),
        max: calcMax(oldEnv.temperature.max, content.daily.temperature.max),
        avg: avgWeight(
          { avg: oldEnv.temperature.avg, n: oldEnv.reading_total },
          { avg: content.daily.temperature.max, n: content.daily.readings }
        ),
      },
      humidity: {
        min: calcMin(oldEnv.humidity.min, content.daily.humidity.min),
        max: calcMax(oldEnv.humidity.max, content.daily.humidity.max),
        avg: avgWeight(
          { avg: oldEnv.humidity.avg, n: oldEnv.reading_total },
          { avg: content.daily.humidity.max, n: content.daily.readings }
        ),
      },
      light: {
        hr: {
          low: calcLightHourly(
            { avg: oldEnv.light.hr.low, n: oldEnv.reading_total },
            content.daily.light.hr.low
          ),
          medium: calcLightHourly(
            { avg: oldEnv.light.hr.medium, n: oldEnv.reading_total },
            content.daily.light.hr.medium
          ),
          bright: calcLightHourly(
            { avg: oldEnv.light.hr.bright, n: oldEnv.reading_total },
            content.daily.light.hr.bright
          ),
          full: calcLightHourly(
            { avg: oldEnv.light.hr.full, n: oldEnv.reading_total },
            content.daily.light.hr.full
          ),
        },
        avg: avgWeight(
          { avg: oldEnv.light.avg, n: oldEnv.reading_total },
          { avg: content.daily.light.max, n: content.daily.readings }
        ),
        max: calcMax(oldEnv.light.max, content.daily.light.max),
      },
    };
    return newEnv;
  } else return doc.env;
};

const avgWeight = (
  old: { avg: number; n: number },
  cur: { avg: number; n: number }
) => {
  return (old.avg * old.n + cur.avg * cur.n) / (old.n + cur.n);
};
const calcMax = (old: number, cur: number) => {
  return old > cur ? old : cur;
};
const calcMin = (old: number, cur: number) => {
  return old < cur ? old : cur;
};

const calcLightHourly = (old: { avg: number; n: number }, cur: number) => {
  return (old.avg * old.n + cur) / (old.n + 1);
};
