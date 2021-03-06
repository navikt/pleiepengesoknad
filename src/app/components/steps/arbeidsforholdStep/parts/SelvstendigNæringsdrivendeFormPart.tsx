import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import VirksomhetInfoAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetInfoAndDialog';
import Lenke from 'nav-frontend-lenker';
import Panel from 'nav-frontend-paneler';
import getLenker from '../../../../lenker';
import { AppFormField, Arbeidsform, PleiepengesøknadFormData } from '../../../../types/PleiepengesøknadFormData';
import {
    getArbeidsformAnsattValidator,
    getJobberNormaltTimerValidator,
    isYesOrNoAnswered,
} from '../../../../validation/fieldValidations';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformOgTimer from './ArbeidsformOgTimer';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart = ({ formValues }: Props) => {
    const intl = useIntl();
    const { selvstendig_virksomhet, selvstendig_harFlereVirksomheter, selvstendig_arbeidsforhold } = formValues;
    const harFlereVirksomheter = selvstendig_harFlereVirksomheter === YesOrNo.YES;
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.selvstendig_harHattInntektSomSN}
                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
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
                <>
                    <FormBlock>
                        <AppForm.YesOrNoQuestion
                            name={AppFormField.selvstendig_harFlereVirksomheter}
                            legend={intlHelper(intl, 'selvstendig.harFlereVirksomheter.spm')}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>

                    {harFlereVirksomheter && (
                        <FormBlock>
                            <CounsellorPanel>
                                <FormattedMessage id="selvstendig.veileder.flereAktiveVirksomheter" />
                            </CounsellorPanel>
                        </FormBlock>
                    )}

                    {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES &&
                        selvstendig_harFlereVirksomheter &&
                        isYesOrNoAnswered(selvstendig_harFlereVirksomheter) && (
                            <Box margin="l">
                                <Panel>
                                    <VirksomhetInfoAndDialog
                                        name={AppFormField.selvstendig_virksomhet}
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
                                </Panel>
                            </Box>
                        )}
                    {formValues.selvstendig_virksomhet !== undefined && (
                        <FormBlock>
                            <ArbeidsformOgTimer
                                spørsmål={{
                                    arbeidsform: intlHelper(intl, `selvstendig.arbeidsforhold.arbeidsform.spm`),
                                    jobberNormaltTimer: (arbeidsform: Arbeidsform) =>
                                        intlHelper(intl, `snFrilanser.arbeidsforhold.iDag.${arbeidsform}.spm`),
                                }}
                                validator={{
                                    arbeidsform: getArbeidsformAnsattValidator(selvstendig_arbeidsforhold),
                                    jobberNormaltTimer: getJobberNormaltTimerValidator(
                                        selvstendig_arbeidsforhold,
                                        'selvstendig'
                                    ),
                                }}
                                arbeidsforhold={selvstendig_arbeidsforhold}
                                parentFieldName={`${AppFormField.selvstendig_arbeidsforhold}`}
                            />
                        </FormBlock>
                    )}
                </>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
