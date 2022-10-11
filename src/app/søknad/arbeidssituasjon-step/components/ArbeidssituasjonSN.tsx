import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import VirksomhetInfoAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetInfoAndDialog';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { SelvstendigFormData, SelvstendigFormField } from '../../../types/SelvstendigFormData';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { getSelvstendigIPeriodeValidator } from '../validation/selvstendigIPeriodeValidator';

const ArbSNFormComponents = getTypedFormComponents<SelvstendigFormField, SelvstendigFormData, ValidationError>();

interface Props {
    formValues: SelvstendigFormData;
    urlSkatteetatenSN: string;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonSN = ({ formValues, urlSkatteetatenSN, søknadsperiode }: Props) => {
    const intl = useIntl();
    const { harHattInntektSomSN, virksomhet, harFlereVirksomheter, arbeidsforhold } = formValues;
    const søkerHarFlereVirksomheter = harFlereVirksomheter === YesOrNo.YES;

    return (
        <div data-testid="arbeidssituasjonSelvstendig">
            <Box margin="l">
                <ArbSNFormComponents.YesOrNoQuestion
                    name={SelvstendigFormField.harHattInntektSomSN}
                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                    data-testid="er-selvstendig"
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'selvstendig.harDuHattInntekt.hjelpetekst.tittel')}>
                            <>
                                {intlHelper(intl, 'selvstendig.harDuHattInntekt.hjelpetekst')}{' '}
                                <Lenke href={urlSkatteetatenSN} target="_blank">
                                    <FormattedMessage id="selvstendig.harDuHattInntekt.hjelpetekst.snSkatteetatenLenke" />
                                </Lenke>
                            </>
                        </ExpandableInfo>
                    }
                />
            </Box>
            {harHattInntektSomSN === YesOrNo.YES && (
                <FormBlock margin="l">
                    <ResponsivePanel>
                        <ArbSNFormComponents.YesOrNoQuestion
                            name={SelvstendigFormField.harFlereVirksomheter}
                            legend={intlHelper(intl, 'selvstendig.harFlereVirksomheter.spm')}
                            validate={getYesOrNoValidator()}
                        />

                        {søkerHarFlereVirksomheter && (
                            <FormBlock>
                                <AlertStripeInfo>
                                    <FormattedMessage id="selvstendig.veileder.flereAktiveVirksomheter" />
                                </AlertStripeInfo>
                            </FormBlock>
                        )}

                        {(harFlereVirksomheter === YesOrNo.YES || harFlereVirksomheter === YesOrNo.NO) && (
                            <FormBlock>
                                <VirksomhetInfoAndDialog
                                    name={SelvstendigFormField.virksomhet}
                                    harFlereVirksomheter={søkerHarFlereVirksomheter}
                                    labels={{
                                        infoTitle: virksomhet
                                            ? intlHelper(intl, 'selvstendig.infoDialog.infoTittel')
                                            : undefined,
                                        editLabel: intlHelper(intl, 'selvstendig.infoDialog.endreKnapp'),
                                        deleteLabel: intlHelper(intl, 'selvstendig.infoDialog.fjernKnapp'),
                                        addLabel: intlHelper(intl, 'selvstendig.infoDialog.registrerKnapp'),
                                        modalTitle: harFlereVirksomheter
                                            ? intlHelper(intl, 'selvstendig.infoDialog.tittel.flere')
                                            : intlHelper(intl, 'selvstendig.infoDialog.tittel.en'),
                                    }}
                                    validate={(value) => {
                                        if (getRequiredFieldValidator()(value) !== undefined) {
                                            return getRequiredFieldValidator()(value);
                                        }
                                        return getSelvstendigIPeriodeValidator(søknadsperiode, virksomhet);
                                    }}
                                />
                            </FormBlock>
                        )}
                        {virksomhet !== undefined && (
                            <NormalarbeidstidSpørsmål
                                arbeidsforholdFieldName={SelvstendigFormField.arbeidsforhold}
                                arbeidsforhold={arbeidsforhold || {}}
                                arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                                erAktivtArbeidsforhold={true}
                                brukKunSnittPerUke={true}
                            />
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </div>
    );
};

export default ArbeidssituasjonSN;
