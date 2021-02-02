import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredField,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { SkjemagruppeQuestion } from '@navikt/sif-common-formik';
import { FieldArray } from 'formik';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../config/minMaxValues';
import { AppFormField, Arbeidsforhold, ArbeidsforholdField, Arbeidsform } from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import './timerInput.less';
import Panel from 'nav-frontend-paneler';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { Element } from 'nav-frontend-typografi';
// import RedusertArbeidsforholdPart from './RedusertArbeidsforholdPart';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    index: number;
}

const FormikArbeidsforhold = ({ arbeidsforhold, index }: Props) => {
    const intl = useIntl();
    return (
        <FieldArray name={AppFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdField) => `${name}.${index}.${field}` as AppFormField;
                console.log(name);

                return (
                    <Box padBottom="l">
                        <AppForm.YesOrNoQuestion
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.erAnsattIPerioden)}
                            validate={validateYesOrNoIsAnswered}
                        />
                        {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                            <Box margin="l">
                                <Panel>
                                    <FormBlock margin="none">
                                        <AppForm.RadioPanelGroup
                                            legend={`Hvordan jobber du hos ${arbeidsforhold.navn}?`}
                                            name={getFieldName(ArbeidsforholdField.arbeidsform)}
                                            radios={[
                                                {
                                                    label: 'Fast',
                                                    value: Arbeidsform.fast,
                                                },
                                                {
                                                    label: 'Turnus',
                                                    value: Arbeidsform.turnus,
                                                },
                                                {
                                                    label: 'Deltid/varierende/tilkalling',
                                                    value: Arbeidsform.varierende,
                                                },
                                            ]}
                                            validate={validateRequiredField}
                                        />
                                    </FormBlock>
                                    {arbeidsforhold.arbeidsform !== undefined && (
                                        <Box margin="xl">
                                            <SkjemagruppeQuestion
                                                legend={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                                                    arbeidsforhold: arbeidsforhold.navn,
                                                })}>
                                                <AppForm.Input
                                                    name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                                                    description={
                                                        <div style={{ width: '100%' }}>
                                                            <Box margin="none" padBottom="m">
                                                                {arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                                                    <>
                                                                        Her skal du legge inn antall timer du jobber per
                                                                        uke. Hvis du er usikker på antallet må du høre
                                                                        med arbeidsgiveren din, eller finne svaret i
                                                                        arbeidskontrakten din.
                                                                    </>
                                                                )}
                                                                {arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                                                    <>
                                                                        Her skal du legge inn et snitt av hva du jobber
                                                                        per uke.
                                                                        <Box margin="m">
                                                                            <ExpandableInfo title="Hvordan regner jeg ut et snitt av turnusen min?">
                                                                                Du regner ut snittet ved å legge sammen
                                                                                antall timer du jobber totalt i hele
                                                                                turnusperioden din, og deler det med
                                                                                antall uker som turnusperioden din
                                                                                består av.
                                                                                <Element tag="h3">Eksempel:</Element>
                                                                                <p>
                                                                                    Du har en turnus som går over 3
                                                                                    uker. Den første uka jobber du 20
                                                                                    timer, den andre 40 timer og den
                                                                                    tredje uka jobber du 15 timer. Da
                                                                                    legger du sammen antall timer du har
                                                                                    jobbet og deler med antall uker i
                                                                                    turnusperioden din.{' '}
                                                                                </p>
                                                                                <p>
                                                                                    Da blir regnestykket slik i dette
                                                                                    eksempelet:
                                                                                    <br />
                                                                                    20 timer + 40 timer + 15 timer = 75
                                                                                    timer <br />
                                                                                    Så deler du antall timer med antall
                                                                                    uker i turnusperioden din: 75:3 = 25{' '}
                                                                                    <br />
                                                                                </p>
                                                                                <p>
                                                                                    Du jobber altså i snitt 25 timer per
                                                                                    uke, og det er dette tallet du
                                                                                    oppgir.
                                                                                </p>
                                                                            </ExpandableInfo>
                                                                        </Box>
                                                                    </>
                                                                )}
                                                                {arbeidsforhold.arbeidsform ===
                                                                    Arbeidsform.varierende && (
                                                                    <>
                                                                        Her skal du legge inn et snitt av hvor mange
                                                                        timer du har jobbet per uke i de siste 12 ukene.
                                                                        <Box margin="m">
                                                                            <ExpandableInfo title="Hvordan regner jeg ut et snitt i min situasjon?">
                                                                                Du regner ut et snitt ved å legge sammen
                                                                                antall timer du totalt har jobbet de
                                                                                siste 12 ukene og deler det med 12.
                                                                                <Box margin="l">
                                                                                    <Element tag="h3">
                                                                                        Eksempel:
                                                                                    </Element>
                                                                                    <p>
                                                                                        De siste 12 ukene har du jobbet
                                                                                        250 timer. Da deler du antall
                                                                                        timer du har jobbet med 12:
                                                                                        <br />
                                                                                        250 timer: 12 uker = 20,8
                                                                                    </p>
                                                                                    <p>
                                                                                        Du jobber altså i snitt 20,8
                                                                                        timer per uke, og det er dette
                                                                                        tallet du oppgir.
                                                                                    </p>
                                                                                </Box>
                                                                            </ExpandableInfo>
                                                                        </Box>
                                                                    </>
                                                                )}
                                                            </Box>
                                                        </div>
                                                    }
                                                    type="text"
                                                    inputMode="numeric"
                                                    className={'skjemaelement--timer-input'}
                                                    label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
                                                    validate={(value) =>
                                                        validateRequiredNumber({
                                                            min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                            max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                        })(value)
                                                    }
                                                    value={arbeidsforhold.jobberNormaltTimer || ''}
                                                    min={MIN_TIMER_NORMAL_ARBEIDSFORHOLD}
                                                    max={MAX_TIMER_NORMAL_ARBEIDSFORHOLD}
                                                />
                                            </SkjemagruppeQuestion>
                                        </Box>
                                    )}
                                </Panel>
                            </Box>
                        )}
                    </Box>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
