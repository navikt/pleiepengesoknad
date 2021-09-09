import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    ArbeidsforholdSkalJobbeSvar,
    ArbeidsforholdSNF,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import { ansettelsesforholdGjelderSøknadsperiode, getTimerTekst } from '../../../utils/arbeidsforholdUtils';
import { getSøknadsperiodeFromFormData } from '../../../utils/formDataUtils';
import {
    getArbeidsforholdSkalJobbeHvorMyeValidator,
    getArbeidsforholdSkalJobbeProsentValidator,
    getArbeidsforholdSkalJobbeTimerValidator,
    getArbeidsforholdSkalJobbeValidator,
    getArbeidsforholdTimerEllerProsentValidator,
} from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';
import InvalidStepPage from '../../pages/invalid-step-page/InvalidStepPage';
import ArbeidsforholdISøknadsperiode from './ArbeidsforholdISøknadsperiode';

const cleanupArbeidsforholdCommon = (arbeidsforhold: Arbeidsforhold): Arbeidsforhold => {
    const a = { ...arbeidsforhold };
    if (a.skalJobbe !== ArbeidsforholdSkalJobbeSvar.ja) {
        a.skalJobbeHvorMye = undefined;
    }
    if (a.skalJobbeHvorMye !== ArbeidsforholdSkalJobbeHvorMyeSvar.redusert) {
        a.timerEllerProsent = undefined;
    }
    if (a.timerEllerProsent === undefined) {
        a.skalJobbeTimer = undefined;
        a.skalJobbeProsent = undefined;
    }
    return a;
};
const cleanupAnsattArbeidsforhold = (arbeidsforhold: ArbeidsforholdAnsatt): ArbeidsforholdAnsatt => {
    return cleanupArbeidsforholdCommon(arbeidsforhold) as ArbeidsforholdAnsatt;
};

const cleanupSNF = (arbeidsforhold: ArbeidsforholdSNF): ArbeidsforholdSNF => {
    return cleanupArbeidsforholdCommon(arbeidsforhold) as ArbeidsforholdSNF;
};

const cleanupArbeidsforholdIPeriodenStep = (formData: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formData };
    values.arbeidsforhold = values.arbeidsforhold.map(cleanupAnsattArbeidsforhold);
    values.frilans_arbeidsforhold = values.frilans_arbeidsforhold
        ? cleanupSNF(values.frilans_arbeidsforhold)
        : undefined;
    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? cleanupSNF(values.selvstendig_arbeidsforhold)
        : undefined;
    return values;
};

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

    const søknadsperiode = getSøknadsperiodeFromFormData(formikProps.values);

    if (!søknadsperiode) {
        return <InvalidStepPage stepId={StepID.ARBEIDSFORHOLD_I_PERIODEN} />;
    }

    // Index må være samme på tvers av alle arbeidsforhold, også dem som en ikke er ansatt i
    const aktiveArbeidsforholdMedOpprinneligIndex = arbeidsforhold
        .map((a, index) => ({
            index,
            arbeidsforhold: a,
        }))
        .filter(
            (a) =>
                a.arbeidsforhold.erAnsatt === YesOrNo.YES ||
                (a.arbeidsforhold.erAnsatt === YesOrNo.NO &&
                    ansettelsesforholdGjelderSøknadsperiode(a.arbeidsforhold, søknadsperiode))
        );

    const skalBesvareAnsettelsesforhold = aktiveArbeidsforholdMedOpprinneligIndex.length > 0;
    const skalBesvareFrilans = frilans_jobberFortsattSomFrilans === YesOrNo.YES && frilans_arbeidsforhold;
    const skalBesvareSelvstendig = selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_arbeidsforhold;

    /** Dette kan oppstå dersom bruker er på Arbeidssituasjon, endrer på data, og deretter trykker forward i nettleser */
    const brukerMåGåTilbakeTilArbeidssituasjon =
        skalBesvareAnsettelsesforhold === false && skalBesvareFrilans === false && skalBesvareSelvstendig === false;

    if (brukerMåGåTilbakeTilArbeidssituasjon === true) {
        return <InvalidStepPage stepId={StepID.ARBEIDSFORHOLD_I_PERIODEN} />;
    }

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
        <FormikStep
            id={StepID.ARBEIDSFORHOLD_I_PERIODEN}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={cleanupArbeidsforholdIPeriodenStep}>
            <Box padBottom="m">
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    {brukerMåGåTilbakeTilArbeidssituasjon === false && (
                        <p style={{ marginTop: 0 }}>
                            <FormattedMessage
                                id="step.arbeidsforholdIPerioden.StepInfo.1"
                                values={{
                                    info: intlHelper(
                                        intl,
                                        `step.arbeidsforholdIPerioden.StepInfo.1.info.${arbeidsinfo.join('_')}`,
                                        { antall: aktiveArbeidsforholdMedOpprinneligIndex.length }
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
                        {aktiveArbeidsforholdMedOpprinneligIndex.map(({ arbeidsforhold, index }) => {
                            const erAvsluttet = arbeidsforhold.erAnsatt === YesOrNo.NO;
                            const arbeidsforholdIntlValues = {
                                navn: arbeidsforhold.navn,
                                fra: erAvsluttet ? prettifyDateFull(søknadsperiode.from) : undefined,
                                til: erAvsluttet ? prettifyDateFull(søknadsperiode.to) : undefined,
                                timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                            };
                            return (
                                <FormSection
                                    title={arbeidsforhold.navn}
                                    key={arbeidsforhold.organisasjonsnummer}
                                    titleIcon={<BuildingIcon />}>
                                    <ArbeidsforholdISøknadsperiode
                                        arbeidsforhold={arbeidsforhold}
                                        erAvsluttetAnsettelseforhold={erAvsluttet}
                                        spørsmål={{
                                            skalJobbe: intlHelper(
                                                intl,
                                                erAvsluttet
                                                    ? 'arbeidsforhold.ansatt.avsluttet.skalJobbe.spm'
                                                    : 'arbeidsforhold.ansatt.skalJobbe.spm',
                                                arbeidsforholdIntlValues
                                            ),
                                            jobbeHvorMye: intlHelper(
                                                intl,
                                                erAvsluttet
                                                    ? 'arbeidsforhold.ansatt.avsluttet.jobbeHvorMye.spm'
                                                    : 'arbeidsforhold.ansatt.jobbeHvorMye.spm',
                                                arbeidsforholdIntlValues
                                            ),
                                            timerEllerProsent: intlHelper(
                                                intl,
                                                erAvsluttet
                                                    ? 'arbeidsforhold.ansatt.avsluttet.timerEllerProsent.spm'
                                                    : 'arbeidsforhold.ansatt.timerEllerProsent.spm',
                                                arbeidsforholdIntlValues
                                            ),
                                            skalJobbeTimer: intlHelper(
                                                intl,
                                                erAvsluttet
                                                    ? 'arbeidsforhold.ansatt.avsluttet.skalJobbeTimer.spm'
                                                    : 'arbeidsforhold.ansatt.skalJobbeTimer.spm',
                                                arbeidsforholdIntlValues
                                            ),
                                            skalJobbeProsent: intlHelper(
                                                intl,
                                                erAvsluttet
                                                    ? 'arbeidsforhold.ansatt.avsluttet.skalJobbeProsent.spm'
                                                    : 'arbeidsforhold.ansatt.skalJobbeProsent.spm',
                                                arbeidsforholdIntlValues
                                            ),
                                        }}
                                        validatorer={{
                                            skalJobbe: getArbeidsforholdSkalJobbeValidator(arbeidsforhold),
                                            jobbeHvorMye: getArbeidsforholdSkalJobbeHvorMyeValidator(arbeidsforhold),
                                            timerEllerProsent:
                                                getArbeidsforholdTimerEllerProsentValidator(arbeidsforhold),
                                            skalJobbeTimer: getArbeidsforholdSkalJobbeTimerValidator(arbeidsforhold),
                                            skalJobbeProsent:
                                                getArbeidsforholdSkalJobbeProsentValidator(arbeidsforhold),
                                        }}
                                        parentFieldName={`${AppFormField.arbeidsforhold}.${index}`}
                                    />
                                </FormSection>
                            );
                        })}
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
