import * as React from 'react';
import { Fieldset, RadioPanel, SkjemaGruppe } from 'nav-frontend-skjema';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';

import 'nav-frontend-skjema-style';
import './radioPanelGroup.less';

interface FormikRadioPanelProps {
    value: string;
    label: string;
}

interface RadioPanelGroupProps {
    legend: string;
    name: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
    radios: FormikRadioPanelProps[];
}

const RadioPanelGroup = ({ name, radios, legend, validate }: RadioPanelGroupProps) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <div className="radioPanelGruppe">
                    <Fieldset legend={legend}>
                        <SkjemaGruppe className="radioPanelGroup--responsive" {...errorMsgProps}>
                            {radios.map((radio: FormikRadioPanelProps) => (
                                <div className="radioPanelWrapper" key={radio.value}>
                                    <RadioPanel
                                        onChange={() => setFieldValue(field.name, radio.value)}
                                        checked={field.value === radio.value}
                                        name={field.name}
                                        {...radio}
                                    />
                                </div>
                            ))}
                        </SkjemaGruppe>
                    </Fieldset>
                </div>
            );
        }}
    </FormikField>
);

export default RadioPanelGroup;
