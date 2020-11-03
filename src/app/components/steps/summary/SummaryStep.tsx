import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import ValidationErrorSummaryBase from '@sif-common/core/components/validation-error-summary-base/ValidationErrorSummaryBase';
import { hasValue } from '@sif-common/core/validation/hasValue';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from '@sif-common/core/components/box/Box';
import ContentWithHeader from '@sif-common/core/components/content-with-header/ContentWithHeader';
import CounsellorPanel from '@sif-common/core/components/counsellor-panel/CounsellorPanel';
import SummaryList from '@sif-common/core/components/summary-list/SummaryList';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';
import TextareaSummary from '@sif-common/core/components/textarea-summary/TextareaSummary';
import { HistoryProps } from '@sif-common/core/types/History';
import { Locale } from '@sif-common/core/types/Locale';
import { apiStringDateToDate, prettifyDate } from '@sif-common/core/utils/dateUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { formatName } from '@sif-common/core/utils/personUtils';
import ArbeidsforholdSummary from 'app/components/arbeidsforhold-summary/ArbeidsforholdSummary';
import {
    renderFerieuttakIPeriodenSummary,
    renderUtenlandsoppholdIPeriodenSummary,
    renderUtenlandsoppholdSummary,
} from 'app/components/steps/summary/renderUtenlandsoppholdSummary';
import { Feature, isFeatureEnabled } from 'app/utils/featureToggleUtils';
import { purge, sendApplication } from '../../../api/api';
import routeConfig from '../../../config/routeConfig';
import { StepID } from '../../../config/stepConfig';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../../types/Søkerdata';
import * as apiUtils from '../../../utils/apiUtils';
import appSentryLogger from '../../../utils/appSentryLogger';
import { mapFormDataToApiData } from '../../../utils/mapFormDataToApiData';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import { erPeriodeOver8Uker } from '../../../utils/søkerOver8UkerUtils';
import { getVarighetString } from '../../../utils/varighetUtils';
import { validateApiValues } from '../../../validation/apiValuesValidation';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringAttachmentList from '../../legeerklæring-file-list/LegeerklæringFileList';
import BarnSummary from './BarnSummary';
import FrilansSummary from './FrilansSummary';
import JaNeiSvar from './JaNeiSvar';
import SelvstendigSummary from './SelvstendigSummary';
import TilsynsordningSummary from './TilsynsordningSummary';
import './summary.less';

interface State {
    sendingInProgress: boolean;
}

interface OwnProps {
    values: PleiepengesøknadFormData;
    onApplicationSent: (apiValues: PleiepengesøknadApiData, søkerdata: Søkerdata) => void;
}

type Props = OwnProps & HistoryProps & WrappedComponentProps;

class SummaryStep extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            sendingInProgress: false,
        };
        this.navigate = this.navigate.bind(this);
    }

    async navigate(apiValues: PleiepengesøknadApiData, søkerdata: Søkerdata) {
        const { history, onApplicationSent } = this.props;
        this.setState({
            sendingInProgress: true,
        });
        try {
            await purge();
            await sendApplication(apiValues);
            onApplicationSent(apiValues, søkerdata);
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                navigateToLoginPage();
            } else {
                appSentryLogger.logApiError(error);
                navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
            }
        }
    }

    render() {
        const { values, intl } = this.props;
        const { sendingInProgress } = this.state;

        const { periodeFra, periodeTil } = values;
        const info8uker =
            isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) && periodeFra && periodeTil
                ? erPeriodeOver8Uker(periodeFra, periodeTil)
                : undefined;

        return (
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) => {
                    const {
                        person: { fornavn, mellomnavn, etternavn, fødselsnummer },
                        barn,
                    } = søkerdata;

                    const apiValues = mapFormDataToApiData(values, barn, intl.locale as Locale);

                    if (apiValues === undefined) {
                        return <div>Det oppstod en feil</div>;
                    }

                    const apiValuesValidationErrors = validateApiValues(apiValues, intl);

                    const {
                        medlemskap,
                        tilsynsordning,
                        nattevåk: nattevaak,
                        beredskap,
                        utenlandsoppholdIPerioden,
                        ferieuttakIPerioden,
                    } = apiValues;

                    return (
                        <FormikStep
                            id={StepID.SUMMARY}
                            onValidFormSubmit={() => {
                                setTimeout(() => {
                                    // La view oppdatere seg først
                                    this.navigate(apiValues, søkerdata);
                                });
                            }}
                            useValidationErrorSummary={false}
                            showSubmitButton={apiValuesValidationErrors === undefined}
                            buttonDisabled={sendingInProgress || apiValuesValidationErrors !== undefined}
                            showButtonSpinner={sendingInProgress}
                            customErrorSummary={
                                apiValuesValidationErrors
                                    ? () => (
                                          <ValidationErrorSummaryBase
                                              title={intlHelper(intl, 'formikValidationErrorSummary.tittel')}
                                              errors={apiValuesValidationErrors}
                                          />
                                      )
                                    : undefined
                            }>
                            <CounsellorPanel>
                                <FormattedMessage id="steg.oppsummering.info" />
                            </CounsellorPanel>
                            <Box margin="xl">
                                <Panel border={true}>
                                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                        <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                        <Normaltekst>Fødselsnummer: {fødselsnummer}</Normaltekst>
                                    </SummarySection>

                                    <BarnSummary barn={barn} formValues={values} apiValues={apiValues} />

                                    <SummarySection header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                        <FormattedMessage
                                            id="steg.oppsummering.tidsrom.fomtom"
                                            values={{
                                                fom: prettifyDate(apiStringDateToDate(apiValues.fraOgMed)),
                                                tom: prettifyDate(apiStringDateToDate(apiValues.tilOgMed)),
                                            }}
                                        />
                                        <Box margin="m">
                                            <ContentWithHeader
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.annenSøkerSammePeriode.header'
                                                )}>
                                                {apiValues.harMedsøker === true && intlHelper(intl, 'Ja')}
                                                {apiValues.harMedsøker === false && intlHelper(intl, 'Nei')}
                                            </ContentWithHeader>
                                        </Box>
                                        {apiValues.harMedsøker && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.samtidigHjemme.header'
                                                    )}>
                                                    <FormattedMessage id={apiValues.samtidigHjemme ? 'Ja' : 'Nei'} />
                                                </ContentWithHeader>
                                            </Box>
                                        )}
                                        {/* Utenlandsopphold i perioden */}
                                        {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) &&
                                            utenlandsoppholdIPerioden && (
                                                <>
                                                    <Box margin="l">
                                                        <ContentWithHeader
                                                            header={intlHelper(
                                                                intl,
                                                                'steg.oppsummering.utenlandsoppholdIPerioden.header'
                                                            )}>
                                                            <FormattedMessage
                                                                id={
                                                                    utenlandsoppholdIPerioden.skalOppholdeSegIUtlandetIPerioden
                                                                        ? 'Ja'
                                                                        : 'Nei'
                                                                }
                                                            />
                                                        </ContentWithHeader>
                                                    </Box>
                                                    {utenlandsoppholdIPerioden.opphold.length > 0 && (
                                                        <Box margin="l">
                                                            <ContentWithHeader
                                                                header={intlHelper(
                                                                    intl,
                                                                    'steg.oppsummering.utenlandsoppholdIPerioden.listetittel'
                                                                )}>
                                                                <SummaryList
                                                                    items={utenlandsoppholdIPerioden.opphold}
                                                                    itemRenderer={
                                                                        renderUtenlandsoppholdIPeriodenSummary
                                                                    }
                                                                />
                                                            </ContentWithHeader>
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        {/* Ferieuttak i perioden */}
                                        {ferieuttakIPerioden && (
                                            <>
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.ferieuttakIPerioden.header'
                                                        )}>
                                                        <FormattedMessage
                                                            id={
                                                                ferieuttakIPerioden.skalTaUtFerieIPerioden
                                                                    ? 'Ja'
                                                                    : 'Nei'
                                                            }
                                                        />
                                                    </ContentWithHeader>
                                                </Box>
                                                {ferieuttakIPerioden.ferieuttak.length > 0 && (
                                                    <Box margin="l">
                                                        <ContentWithHeader
                                                            header={intlHelper(
                                                                intl,
                                                                'steg.oppsummering.ferieuttakIPerioden.listetittel'
                                                            )}>
                                                            <SummaryList
                                                                items={ferieuttakIPerioden.ferieuttak}
                                                                itemRenderer={renderFerieuttakIPeriodenSummary}
                                                            />
                                                        </ContentWithHeader>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                        {tilsynsordning && <TilsynsordningSummary tilsynsordning={tilsynsordning} />}
                                        {nattevaak && (
                                            <>
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(intl, 'steg.oppsummering.nattevåk.header')}>
                                                        {nattevaak.harNattevåk === true && intlHelper(intl, 'Ja')}
                                                        {nattevaak.harNattevåk === false && intlHelper(intl, 'Nei')}
                                                        {nattevaak.harNattevåk === true &&
                                                            nattevaak.tilleggsinformasjon && (
                                                                <TextareaSummary text={nattevaak.tilleggsinformasjon} />
                                                            )}
                                                    </ContentWithHeader>
                                                </Box>
                                            </>
                                        )}
                                        {beredskap && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(intl, 'steg.oppsummering.beredskap.header')}>
                                                    {beredskap.beredskap === true && intlHelper(intl, 'Ja')}
                                                    {beredskap.beredskap === false && intlHelper(intl, 'Nei')}
                                                    {beredskap.tilleggsinformasjon && (
                                                        <TextareaSummary text={beredskap.tilleggsinformasjon} />
                                                    )}
                                                </ContentWithHeader>
                                            </Box>
                                        )}
                                        {isFeatureEnabled(Feature.TOGGLE_8_UKER) && info8uker?.erOver8Uker && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.over8uker.header',
                                                        info8uker
                                                            ? {
                                                                  varighet: getVarighetString(
                                                                      info8uker?.antallDager,
                                                                      intl
                                                                  ),
                                                              }
                                                            : undefined
                                                    )}>
                                                    <JaNeiSvar harSvartJa={apiValues.bekrefterPeriodeOver8Uker} />
                                                </ContentWithHeader>
                                            </Box>
                                        )}

                                        {isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) &&
                                            apiValues.skalBekrefteOmsorg && (
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.skalPassePåBarnetIHelePerioden.header'
                                                        )}>
                                                        <JaNeiSvar
                                                            harSvartJa={apiValues.skalPassePåBarnetIHelePerioden}
                                                        />
                                                    </ContentWithHeader>
                                                    {hasValue(apiValues.beskrivelseOmsorgsrollen) && (
                                                        <Box margin="l">
                                                            <ContentWithHeader
                                                                header={intlHelper(
                                                                    intl,
                                                                    'steg.oppsummering.bekreftOmsorgEkstrainfo.header'
                                                                )}>
                                                                <TextareaSummary
                                                                    text={apiValues.beskrivelseOmsorgsrollen}
                                                                />
                                                            </ContentWithHeader>
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                    </SummarySection>

                                    <Box margin="m">
                                        <SummarySection
                                            header={intlHelper(intl, 'steg.oppsummering.arbeidsforhold.header')}>
                                            {apiValues.arbeidsgivere.organisasjoner.length > 0 ? (
                                                <SummaryList
                                                    items={apiValues.arbeidsgivere.organisasjoner}
                                                    itemRenderer={(forhold) => (
                                                        <ArbeidsforholdSummary
                                                            key={forhold.organisasjonsnummer}
                                                            arbeidsforhold={forhold}
                                                        />
                                                    )}
                                                />
                                            ) : (
                                                <FormattedMessage id="steg.oppsummering.arbeidsforhold.ingenArbeidsforhold" />
                                            )}
                                        </SummarySection>
                                    </Box>
                                    <Box margin="xl">
                                        <SummarySection header={intlHelper(intl, 'frilanser.summary.header')}>
                                            <FrilansSummary apiValues={apiValues} />
                                        </SummarySection>
                                    </Box>
                                    <Box margin="xl">
                                        <SummarySection header={intlHelper(intl, 'selvstendig.summary.header')}>
                                            <SelvstendigSummary
                                                selvstendigVirksomheter={apiValues.selvstendigVirksomheter}
                                            />
                                        </SummarySection>
                                    </Box>
                                    <Box margin="xl">
                                        <SummarySection header={intlHelper(intl, 'medlemskap.summary.header')}>
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetSiste12.header'
                                                    )}>
                                                    {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                                        intlHelper(intl, 'Ja')}
                                                    {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === false &&
                                                        intlHelper(intl, 'Nei')}
                                                </ContentWithHeader>
                                            </Box>
                                            {apiValues.medlemskap.harBoddIUtlandetSiste12Mnd === true &&
                                                medlemskap.utenlandsoppholdSiste12Mnd.length > 0 && (
                                                    <Box margin="l">
                                                        <ContentWithHeader
                                                            header={intlHelper(
                                                                intl,
                                                                'steg.oppsummering.utlandetSiste12.liste.header'
                                                            )}>
                                                            <SummaryList
                                                                items={medlemskap.utenlandsoppholdSiste12Mnd}
                                                                itemRenderer={renderUtenlandsoppholdSummary}
                                                            />
                                                        </ContentWithHeader>
                                                    </Box>
                                                )}
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetNeste12.header'
                                                    )}>
                                                    {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                                        intlHelper(intl, 'Ja')}
                                                    {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === false &&
                                                        intlHelper(intl, 'Nei')}
                                                </ContentWithHeader>
                                            </Box>
                                            {apiValues.medlemskap.skalBoIUtlandetNeste12Mnd === true &&
                                                medlemskap.utenlandsoppholdNeste12Mnd.length > 0 && (
                                                    <Box margin="l">
                                                        <ContentWithHeader
                                                            header={intlHelper(
                                                                intl,
                                                                'steg.oppsummering.utlandetNeste12.liste.header'
                                                            )}>
                                                            <SummaryList
                                                                items={medlemskap.utenlandsoppholdNeste12Mnd}
                                                                itemRenderer={renderUtenlandsoppholdSummary}
                                                            />
                                                        </ContentWithHeader>
                                                    </Box>
                                                )}
                                        </SummarySection>
                                    </Box>
                                    <Box margin="xl">
                                        <SummarySection header={intlHelper(intl, 'steg.oppsummering.vedlegg.header')}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </SummarySection>
                                    </Box>
                                </Panel>
                            </Box>
                            <Box margin="l">
                                <AppForm.ConfirmationCheckbox
                                    label={intlHelper(intl, 'steg.oppsummering.bekrefterOpplysninger')}
                                    name={AppFormField.harBekreftetOpplysninger}
                                    validate={(value) => {
                                        let result;
                                        if (value !== true) {
                                            result = intlHelper(
                                                intl,
                                                'steg.oppsummering.bekrefterOpplysninger.ikkeBekreftet'
                                            );
                                        }
                                        return result;
                                    }}
                                />
                            </Box>
                        </FormikStep>
                    );
                }}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(SummaryStep);
