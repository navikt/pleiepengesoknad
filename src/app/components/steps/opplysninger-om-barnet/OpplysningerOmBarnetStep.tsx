import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { validateAdresse, validateFnr, validateNavn, validateRelasjonTilBarnet } from '../../../utils/validationHelper';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import FormikRadioPanelGroup from '../../formik-radio-panel-group/FormikRadioPanelGroup';
import FormikInput from '../../formik-input/FormikInput';
import FormikCheckbox from '../../formik-checkbox/FormikCheckbox';
import { CustomFormikProps as FormikProps } from '../../../types/FormikProps';

interface OpplysningerOmBarnetStepProps {
    isValid: boolean;
    onSubmit: () => Promise<void>;
    formikProps: FormikProps;
}

type Props = OpplysningerOmBarnetStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.OPPLYSNINGER_OM_BARNET);
const OpplysningerOmBarnetStep: React.FunctionComponent<Props> = ({
    isValid,
    formikProps: {
        values: { barnetSøknadenGjelder, søknadenGjelderEtAnnetBarn },
        setFieldValue,
        ...otherFormikProps
    },
    onSubmit,
    history
}) => {
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit();
        if (isValid) {
            navigateTo(nextStepRoute!, history);
        }
    }

    return (
        <Step
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onSubmit={handleSubmit}
            showSubmitButton={
                søknadenGjelderEtAnnetBarn === true ||
                (barnetSøknadenGjelder !== undefined && barnetSøknadenGjelder !== '')
            }>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.barn && (
                        <>
                            <FormikRadioPanelGroup
                                legend="Hvilket barn gjelder søknaden?"
                                name="barnetSøknadenGjelder"
                                radios={søkerdata.barn.map((barn) => ({
                                    value: barn.fodselsnummer,
                                    label: `${barn.fornavn} ${barn.etternavn}`,
                                    disabled: søknadenGjelderEtAnnetBarn
                                }))}
                            />
                            <FormikCheckbox
                                label="Søknaden gjelder et annet barn"
                                name="søknadenGjelderEtAnnetBarn"
                                afterOnChange={(newValue) => {
                                    if (newValue) {
                                        setFieldValue('barnetSøknadenGjelder', '');
                                    }
                                }}
                            />
                        </>
                    )
                }
            </SøkerdataContextConsumer>
            {søknadenGjelderEtAnnetBarn && (
                <>
                    <FormikInput label="Hva er barnets etternavn?" name="barnetsEtternavn" validate={validateNavn} />
                    <FormikInput label="Hva er barnets fornavn?" name="barnetsFornavn" validate={validateNavn} />
                    <FormikInput label="Hva er barnets fødselsnummer?" name="barnetsFnr" validate={validateFnr} />
                    <FormikInput label="Hva er barnets adresse?" name="barnetsAdresse" validate={validateAdresse} />
                    <FormikInput
                        label="Hva er din relasjon til barnet?"
                        name="søkersRelasjonTilBarnet"
                        validate={validateRelasjonTilBarnet}
                    />
                </>
            )}
        </Step>
    );
};

export default OpplysningerOmBarnetStep;
