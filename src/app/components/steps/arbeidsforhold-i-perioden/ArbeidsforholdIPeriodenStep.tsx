import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { getTimerTekst } from '../../../utils/arbeidsforholdUtils';
import {
    getArbeidsforholdSkalJobbeHvorMyeValidator,
    getArbeidsforholdSkalJobbeProsentValidator,
    getArbeidsforholdSkalJobbeTimerValidator,
    getArbeidsforholdSkalJobbeValidator,
    getArbeidsforholdTimerEllerProsentValidator,
} from '../../../validation/fieldValidations';
import ArbeidsforholdISøknadsperiode from './ArbeidsforholdISøknadsperiode';
import FormikStep from '../../formik-step/FormikStep';

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: {
            arbeidsforhold,
            frilans_arbeidsforhold,
            frilans_jobberFortsattSomFrilans,
            selvstendig_harHattInntektSomSN,
            selvstendig_arbeidsforhold,
        },
    } = formikProps;

    // Index må være samme på tvers av alle arbeidsforhold, også dem som en ikke er ansatt i
    const aktiveArbeidsforhold = arbeidsforhold
        .map((arbeidsforhold, index) => ({
            index,
            arbeidsforhold,
        }))
        .filter((a) => a.arbeidsforhold.erAnsatt === YesOrNo.YES);

    const skalBesvareAnsettelsesforhold = aktiveArbeidsforhold.length > 0;
    const skalBesvareFrilans = frilans_jobberFortsattSomFrilans === YesOrNo.YES && frilans_arbeidsforhold;
    const skalBesvareSelvstendig = selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_arbeidsforhold;

    /** Dette kan oppstå dersom bruker er på Arbeidssituasjon, endrer på data, og deretter trykker forward i nettleser */
    const brukerMåGåTilbakeTilArbeidssituasjon =
        skalBesvareAnsettelsesforhold === false && skalBesvareFrilans === false && skalBesvareSelvstendig === false;

    const arbeidsinfo: string[] = [];
    if (skalBesvareAnsettelsesforhold) {
        arbeidsinfo.push('ansatt');
    }
    if (skalBesvareFrilans) {
        arbeidsinfo.push('frilans');
    }
    if (skalBesvareSelvstendig) {
        arbeidsinfo.push('selvstendig');
    }

    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD_I_PERIODEN} onValidFormSubmit={onValidSubmit}>
            <Box padBottom="m">
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    {brukerMåGåTilbakeTilArbeidssituasjon === true && <>Neida, her feiler det gitt</>}
                    {brukerMåGåTilbakeTilArbeidssituasjon === false && (
                        <p style={{ marginTop: 0 }}>
                            <FormattedMessage
                                id="step.arbeidsforholdIPerioden.StepInfo.1"
                                values={{
                                    info: intlHelper(
                                        intl,
                                        `step.arbeidsforholdIPerioden.StepInfo.1.info.${arbeidsinfo.join('_')}`,
                                        { antall: aktiveArbeidsforhold.length }
                                    ),
                                }}
                            />
                        </p>
                    )}
                </CounsellorPanel>
            </Box>
            {skalBesvareAnsettelsesforhold && (
                <Box margin="xl">
                    <div className="arbeidsforhold">
                        {aktiveArbeidsforhold.map(({ arbeidsforhold, index }) => (
                            <FormSection
                                title={arbeidsforhold.navn}
                                key={arbeidsforhold.organisasjonsnummer}
                                titleIcon={<BuildingIcon />}>
                                <ArbeidsforholdISøknadsperiode
                                    arbeidsforhold={arbeidsforhold}
                                    spørsmål={{
                                        skalJobbe: intlHelper(intl, 'arbeidsforhold.ansatt.skalJobbe.spm', {
                                            navn: arbeidsforhold.navn,
                                        }),
                                        jobbeHvorMye: intlHelper(intl, 'arbeidsforhold.ansatt.jobbeHvorMye.spm', {
                                            navn: arbeidsforhold.navn,
                                            timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                        }),
                                        timerEllerProsent: intlHelper(
                                            intl,
                                            'arbeidsforhold.ansatt.timerEllerProsent.spm',
                                            {
                                                navn: arbeidsforhold.navn,
                                            }
                                        ),
                                        skalJobbeTimer: intlHelper(intl, 'arbeidsforhold.ansatt.skalJobbeTimer.spm'),
                                        skalJobbeProsent: intlHelper(
                                            intl,
                                            'arbeidsforhold.ansatt.skalJobbeProsent.spm'
                                        ),
                                    }}
                                    validatorer={{
                                        skalJobbe: getArbeidsforholdSkalJobbeValidator(arbeidsforhold),
                                        jobbeHvorMye: getArbeidsforholdSkalJobbeHvorMyeValidator(arbeidsforhold),
                                        timerEllerProsent: getArbeidsforholdTimerEllerProsentValidator(arbeidsforhold),
                                        skalJobbeTimer: getArbeidsforholdSkalJobbeTimerValidator(arbeidsforhold),
                                        skalJobbeProsent: getArbeidsforholdSkalJobbeProsentValidator(arbeidsforhold),
                                    }}
                                    parentFieldName={`${AppFormField.arbeidsforhold}.${index}`}
                                />
                            </FormSection>
                        ))}
                    </div>
                </Box>
            )}
            {skalBesvareFrilans && frilans_arbeidsforhold && (
                <Box margin="xl">
                    <div className="arbeidsforhold">
                        <FormSection
                            title={intlHelper(intl, 'step.arbeidsforholdIPerioden.FrilansLabel')}
                            titleIcon={<BuildingIcon />}>
                            <ArbeidsforholdISøknadsperiode
                                arbeidsforhold={frilans_arbeidsforhold}
                                frilansEllerSelvstendig="frilans"
                                parentFieldName={AppFormField.frilans_arbeidsforhold}
                                spørsmål={{
                                    skalJobbe: intlHelper(intl, 'arbeidsforhold.frilanser.skalJobbe.spm'),
                                    jobbeHvorMye: intlHelper(intl, 'arbeidsforhold.frilanser.jobbeHvorMye.spm', {
                                        timer: getTimerTekst(frilans_arbeidsforhold.jobberNormaltTimer, intl),
                                    }),
                                    timerEllerProsent: intlHelper(
                                        intl,
                                        'arbeidsforhold.frilanser.timerEllerProsent.spm'
                                    ),
                                    skalJobbeTimer: intlHelper(intl, 'arbeidsforhold.frilanser.skalJobbeTimer.spm'),
                                    skalJobbeProsent: intlHelper(intl, 'arbeidsforhold.frilanser.skalJobbeProsent.spm'),
                                }}
                                validatorer={{
                                    skalJobbe: getArbeidsforholdSkalJobbeValidator(frilans_arbeidsforhold),
                                    jobbeHvorMye: getArbeidsforholdSkalJobbeHvorMyeValidator(frilans_arbeidsforhold),
                                    timerEllerProsent:
                                        getArbeidsforholdTimerEllerProsentValidator(frilans_arbeidsforhold),
                                    skalJobbeTimer: getArbeidsforholdSkalJobbeTimerValidator(frilans_arbeidsforhold),
                                    skalJobbeProsent:
                                        getArbeidsforholdSkalJobbeProsentValidator(frilans_arbeidsforhold),
                                }}
                            />
                        </FormSection>
                    </div>
                </Box>
            )}
            {skalBesvareSelvstendig && selvstendig_arbeidsforhold && (
                <Box margin="xl">
                    <div className="arbeidsforhold">
                        <FormSection
                            title={intlHelper(intl, 'step.arbeidsforholdIPerioden.SNLabel')}
                            titleIcon={<BuildingIcon />}>
                            <ArbeidsforholdISøknadsperiode
                                arbeidsforhold={selvstendig_arbeidsforhold}
                                frilansEllerSelvstendig="selvstendig"
                                parentFieldName={AppFormField.selvstendig_arbeidsforhold}
                                spørsmål={{
                                    skalJobbe: intlHelper(intl, 'arbeidsforhold.selvstendig.skalJobbe.spm'),
                                    jobbeHvorMye: intlHelper(intl, 'arbeidsforhold.selvstendig.jobbeHvorMye.spm', {
                                        timer: getTimerTekst(selvstendig_arbeidsforhold.jobberNormaltTimer, intl),
                                    }),
                                    timerEllerProsent: intlHelper(
                                        intl,
                                        'arbeidsforhold.selvstendig.timerEllerProsent.spm'
                                    ),
                                    skalJobbeTimer: intlHelper(intl, 'arbeidsforhold.selvstendig.skalJobbeTimer.spm'),
                                    skalJobbeProsent: intlHelper(
                                        intl,
                                        'arbeidsforhold.selvstendig.skalJobbeProsent.spm'
                                    ),
                                }}
                                validatorer={{
                                    skalJobbe: getArbeidsforholdSkalJobbeValidator(selvstendig_arbeidsforhold),
                                    jobbeHvorMye:
                                        getArbeidsforholdSkalJobbeHvorMyeValidator(selvstendig_arbeidsforhold),
                                    timerEllerProsent:
                                        getArbeidsforholdTimerEllerProsentValidator(selvstendig_arbeidsforhold),
                                    skalJobbeTimer:
                                        getArbeidsforholdSkalJobbeTimerValidator(selvstendig_arbeidsforhold),
                                    skalJobbeProsent:
                                        getArbeidsforholdSkalJobbeProsentValidator(selvstendig_arbeidsforhold),
                                }}
                            />
                        </FormSection>
                    </div>
                </Box>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdIPeriodenStep;
