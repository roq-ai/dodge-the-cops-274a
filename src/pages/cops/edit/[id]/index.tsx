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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getCopById, updateCopById } from 'apiSdk/cops';
import { Error } from 'components/error';
import { copValidationSchema } from 'validationSchema/cops';
import { CopInterface } from 'interfaces/cop';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { GameInterface } from 'interfaces/game';
import { getGames } from 'apiSdk/games';

function CopEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CopInterface>(
    () => (id ? `/cops/${id}` : null),
    () => getCopById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CopInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCopById(id, values);
      mutate(updated);
      resetForm();
      router.push('/cops');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CopInterface>({
    initialValues: data,
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
            Edit Cop
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(CopEditPage);
