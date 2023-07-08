import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCop } from 'apiSdk/cops';
import { Error } from 'components/error';
import { copValidationSchema } from 'validationSchema/cops';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { GameInterface } from 'interfaces/game';
import { getGames } from 'apiSdk/games';
import { CopInterface } from 'interfaces/cop';

function CopCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CopInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCop(values);
      resetForm();
      router.push('/cops');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CopInterface>({
    initialValues: {
      position: '',
      game_id: (router.query.game_id as string) ?? null,
    },
    validationSchema: copValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Cop
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="position" mb="4" isInvalid={!!formik.errors?.position}>
            <FormLabel>Position</FormLabel>
            <Input type="text" name="position" value={formik.values?.position} onChange={formik.handleChange} />
            {formik.errors.position && <FormErrorMessage>{formik.errors?.position}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<GameInterface>
            formik={formik}
            name={'game_id'}
            label={'Select Game'}
            placeholder={'Select Game'}
            fetcher={getGames}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.score}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'cop',
    operation: AccessOperationEnum.CREATE,
  }),
)(CopCreatePage);
