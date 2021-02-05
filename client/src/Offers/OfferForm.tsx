import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Container, Typography, Grid, Button, Box, FormLabel } from "@material-ui/core";
import { Formik, FormikHelpers, FormikProps, Form, Field } from "formik";
import FormTextField from "../SharedComponents/FormTextField";
import { RadioGroup } from "material-ui-formik-components";
import * as yup from "yup";
import LocationField from '../SharedComponents/LocationField';
import FormSlider from '../SharedComponents/FormSlider';
import { RootState } from '../rootReducer';
import { useSelector } from 'react-redux';
import { setDrawerOpen } from '../SharedComponents/displaySlice';
import { AppThunk, useAsyncDispatch } from '../store';
import { OfferFormValues } from '../type';

interface OfferFormProps {
  initValues: OfferFormValues;
  actionOnSubmit: (formValues: Omit<OfferFormValues, "location">) => AppThunk;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarBuffer: theme.mixins.toolbar,
    formContainer: {
      height: '100%'
    },
  }),

);

const validationSchema = yup.object().shape({
  beerName: yup.string().required("A name is required").min(3).max(40),
  description: yup.string().required("Required").min(6).max(1200),
  location: yup.string().required("A valid location is necessary to display the offer on the map")
});


const EditOfferForm: React.FC<OfferFormProps> = props => {

  const { initValues, actionOnSubmit } = props;

  const classes = useStyles();
 
  const dispatch = useAsyncDispatch();

  const isLoaded = useSelector(
    (state: RootState) => state.display.mapsLoaded
  );

  useEffect(() => {
    dispatch(setDrawerOpen(true));
}, [dispatch, isLoaded]);

  return (
    <Container className={classes.formContainer}>
      <Box mb={3} p={2}>
        <Typography
          align="center"
          variant="h6"
          style={{ lineHeight: 1.25 }}
        >
          Create an offer
        </Typography>
      </Box>
      <Formik
        initialValues={initValues}
        validationSchema={validationSchema}
        onSubmit={(
          values: OfferFormValues,
          formikHelpers: FormikHelpers<OfferFormValues>
        ) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { location, ...newValues } = values;
          dispatch(actionOnSubmit(newValues));
          formikHelpers.setSubmitting(false);
        }}
      >
        {(formikProps: FormikProps<OfferFormValues>) => (
          <Form noValidate autoComplete="off">
            <Grid container spacing={2} >
              <Grid item xs={12}>
                <Field
                  name="beerName"
                  label="What do you call it?"
                  size="small"
                  component={FormTextField}
                  fullWidth
                  initHelperText="This name will be displayed on the map"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="description"
                  label="A few words about your brew"
                  size="small"
                  component={FormTextField}
                  fullWidth
                  initHelperText="The level of detail is up to you"
                  multiline={true}
                  rows="6"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  label="Package Size"
                  component={RadioGroup}
                  name="packageSize"
                  options={[
                    { value: '0.33', label: '0.33' },
                    { value: '0.5', label: '0.5' },
                    { value: 'other', label: 'other' },
                  ]}
                  groupProps={{ row: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Amount</FormLabel>
                <Field 
                  component={FormSlider}
                  name="amount"
                  defaultValue={2}
                  step={1}
                  marks
                  min={1}
                  max={12}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                {isLoaded ? 
                <Field
                  name="location"
                  label="Trade location"
                  component={LocationField}
                  fullWidth
                  initHelperText="Give a default location for the trade. Any public location will do."
                />
                :
                'loading maps'
                }
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="recipeLink"
                  label="Link to recipe/brewing notes"
                  size="small"
                  component={FormTextField}
                  fullWidth
                  initHelperText="optional"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="outlined"
                  size="large"
                  color="primary"
                  disabled={formikProps.isSubmitting}
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EditOfferForm;