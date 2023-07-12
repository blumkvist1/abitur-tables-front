import { $host } from "./index";

export const fetchAllDirections = async (levelTraining, formStudy) => {
  const { data } = await $host.post(`AllDirections/`, {
    LevelTraining: levelTraining,
    FormStudy: formStudy,
  });
  return data;
};

export const fetchAllData = async (
  levelTraining,
  formStudy,
  direction,
  reasonAdmission
) => {
  const { data } = await $host.post(`AllData/`, {
    LevelTraining: levelTraining,
    FormStudy: formStudy,
    Napravlenie: direction,
    ReasonForAdmission: reasonAdmission,
  });
  return data;
};

export const fetchAllDataForEnrolle = async (snils) => {
  const { data } = await $host.post(`AllDataForEnrolle/`, {
    Snils: snils,
  });
  return data;
};

export const fetchEnrolle = async (snils) => {
  const { data } = await $host.post(`Enrolle/`, {
    Snils: snils,
  });
  return data;
};
