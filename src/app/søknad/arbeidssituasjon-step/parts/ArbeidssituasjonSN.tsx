import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import VirksomhetInfoAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetInfoAndDialog';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';
import { ArbeidsforholdType } from '../../../types';
import { SøknadFormField, SøknadFormData } from '../../../types/SøknadFormData';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';
import { getJobberNormaltTimerValidator } from '../../../validation/validateArbeidFields';
import SøknadFormComponents from '../../SøknadFormComponents';
import TimerFormPart from './TimerFormPart';

interface Props {
    formValues: SøknadFormData;
    søkerKunHistoriskPeriode: boolean;
}

const ArbeidssituasonSN = ({ formValues, søkerKunHistoriskPeriode }: Props) => {
    const intl = useIntl();
    const { selvstendig_virksomhet, selvstendig_harFlereVirksomheter, selvstendig_arbeidsforhold } = formValues;
    const harFlereVirksomheter = selvstendig_harFlereVirksomheter === YesOrNo.YES;
    const intlValues = {
        hvor: intlHelper(intl, 'arbeidsforhold.part.som.SELVSTENDIG'),
        jobber: intlHelper(intl, 'arbeidsforhold.part.jobber'),
    };
    return (
        <>
            <Box margin="l">
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.selvstendig_harHattInntektSomSN}
                    legend={intlHelper(
                        intl,
                        søkerKunHistoriskPeriode
                            ? 'selvstendig.harDuHattInntekt.historisk.spm'
                            : 'selvstendig.harDuHattInntekt.spm'
                    )}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'selvstendig.harDuHattInntekt.hjelpetekst.tittel')}>
                            <>
                                {intlHelper(intl, 'selvstendig.harDuHattInntekt.hjelpetekst')}{' '}
                                <Lenke href={getLenker(intl.locale).skatteetatenSN} target="_blank">
                                    <FormattedMessage id="selvstendig.harDuHattInntekt.hjelpetekst.snSkatteetatenLenke" />
                                </Lenke>
                            </>
                        </ExpandableInfo>
                    }
                />
            </Box>
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <FormBlock margin="l">
                    <ResponsivePanel>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.selvstendig_harFlereVirksomheter}
                            legend={intlHelper(intl, 'selvstendig.harFlereVirksomheter.spm')}
                            validate={getYesOrNoValidator()}
                        />

                        {harFlereVirksomheter && (
                            <FormBlock>
                                <AlertStripeInfo>
                                    <FormattedMessage id="selvstendig.veileder.flereAktiveVirksomheter" />
                                </AlertStripeInfo>
                            </FormBlock>
                        )}

                        {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES &&
                            selvstendig_harFlereVirksomheter &&
                            isYesOrNoAnswered(selvstendig_harFlereVirksomheter) && (
                                <FormBlock>
                                    <VirksomhetInfoAndDialog
                                        name={SøknadFormField.selvstendig_virksomhet}
                                        harFlereVirksomheter={harFlereVirksomheter}
                                        labels={{
                                            infoTitle: selvstendig_virksomhet
                                                ? intlHelper(intl, 'selvstendig.infoDialog.infoTittel')
                                                : undefined,
                                            editLabel: intlHelper(intl, 'selvstendig.infoDialog.endreKnapp'),
                                            deleteLabel: intlHelper(intl, 'selvstendig.infoDialog.fjernKnapp'),
                                            addLabel: intlHelper(intl, 'selvstendig.infoDialog.registrerKnapp'),
                                            modalTitle: harFlereVirksomheter
                                                ? intlHelper(intl, 'selvstendig.infoDialog.tittel.flere')
                                                : intlHelper(intl, 'selvstendig.infoDialog.tittel.en'),
                                        }}
                                        validate={getRequiredFieldValidator()}
                                    />
                                </FormBlock>
                            )}
                        {formValues.selvstendig_virksomhet !== undefined && (
                            <FormBlock>
                                <TimerFormPart
                                    arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                                    spørsmål={{
                                        jobberNormaltTimer: () => intlHelper(intl, `sn.arbeidsforhold.spm`),
                                    }}
                                    validator={{
                                        jobberNormaltTimer: getJobberNormaltTimerValidator(intlValues),
                                    }}
                                    arbeidsforhold={selvstendig_arbeidsforhold}
                                    parentFieldName={`${SøknadFormField.selvstendig_arbeidsforhold}`}
                                />
                            </FormBlock>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidssituasonSN;
