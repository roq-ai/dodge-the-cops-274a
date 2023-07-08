import * as yup from 'yup';

export const copValidationSchema = yup.object().shape({
  position: yup.string().required(),
  game_id: yup.string().nullable(),
});
