import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { validateAdresse, validateFnr, validateNavn, validateRelasjonTilBarnet } from '../../../utils/validationHelper';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { CustomFormikProps as FormikProps } from '../../../types/FormikProps';
import { formatName } from '../../../utils/personHelper';
import { PleiepengesøknadField } from '../../../types/PleiepengesøknadFormData';
import RadioPanelGroup from '../../radio-panel-group/RadioPanelGroup';
import Checkbox from '../../checkbox/Checkbox';
import Input from '../../input/Input';

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
                            <RadioPanelGroup
                                legend="Hvilket barn gjelder søknaden?"
                                name={PleiepengesøknadField.BarnetSøknadenGjelder}
                                radios={søkerdata.barn.map(({ fodselsnummer, fornavn, mellomnavn, etternavn }) => ({
                                    value: fodselsnummer,
                                    label: formatName(fornavn, mellomnavn, etternavn),
                                    disabled: søknadenGjelderEtAnnetBarn
                                }))}
                            />
                            <Checkbox
                                label="Søknaden gjelder et annet barn"
                                name={PleiepengesøknadField.SøknadenGjelderEtAnnetBarn}
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
                    <Input
                        label="Hva er barnets etternavn?"
                        name={PleiepengesøknadField.BarnetsEtternavn}
                        validate={validateNavn}
                    />
                    <Input
                        label="Hva er barnets fornavn?"
                        name={PleiepengesøknadField.BarnetsFornavn}
                        validate={validateNavn}
                    />
                    <Input
                        label="Hva er barnets fødselsnummer?"
                        name={PleiepengesøknadField.BarnetsFødselsnummer}
                        validate={validateFnr}
                    />
                    <Input
                        label="Hva er barnets adresse?"
                        name={PleiepengesøknadField.BarnetsAdresse}
                        validate={validateAdresse}
                    />
                    <Input
                        label="Hva er din relasjon til barnet?"
                        name={PleiepengesøknadField.SøkersRelasjonTilBarnet}
                        validate={validateRelasjonTilBarnet}
                    />
                </>
            )}
        </Step>
    );
};

export default OpplysningerOmBarnetStep;
