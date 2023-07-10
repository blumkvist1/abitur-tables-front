import { $host } from "./index";

export const fetchAllDirections = async (levelTraining, formStudy) => {
  const { data } = await $host.get(`api/AllDirections/`, {
    LevelTraining: levelTraining,
    FormStudy: formStudy,
  });
  return data;
};

export const fetchAllProfiles = async (levelTraining, formStudy, direction) => {
  const { data } = await $host.get(`api/AllProfilesOfDirection/`, {
    LevelTraining: levelTraining,
    FormStudy: formStudy,
    Napravlenie: direction,
  });
  return data;
};

export const fetchAllData = async (levelTraining, formStudy, direction, profile) => {
	const { data } = await $host.get(`api/AllData/`, {
	  LevelTraining: levelTraining,
	  FormStudy: formStudy,
	  Napravlenie: direction,
	  Profil: profile,
	});
	return data;
 };
 
