import * as React from "react";
import MuiSlider, { SliderProps as MuiSliderProps } from "@material-ui/core/Slider";
import { FieldProps } from "formik";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface SliderProps extends FieldProps, Omit<MuiSliderProps, "name" | "onChange" | "value" | "defaultValue"> {}

export const fieldToSlider = ({
  field,
  form: { isSubmitting },
  disabled = false,
  ...props
}: SliderProps): MuiSliderProps => {
  return {
    disabled: isSubmitting || disabled,
    ...props,
    ...field,
    name: field.name,
    value: field.value
  };
};

const Slider: React.ComponentType<SliderProps> = (props: SliderProps) => (
  <MuiSlider {...fieldToSlider(props)}
    onChange={(e, value) => props.form.setFieldValue(props.field.name, value)} />
);

Slider.displayName = "FormikMaterialUISlider";

export default Slider