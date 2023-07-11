import { $host } from "./index";

export const fetchAllDirections = async (levelTraining, formStudy) => {
  const { data } = await $host.get(`AllDirections/`, {
    LevelTraining: levelTraining,
    FormStudy: formStudy,
  });
  return data;
};


export const fetchAllData = async (levelTraining, formStudy, direction, profile) => {
	const { data } = await $host.get(`AllData/`, {
	  LevelTraining: levelTraining,
	  FormStudy: formStudy,
	  Napravlenie: direction,
	});
	return data;
 };
 
