import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import ValidationErrorSummaryBase from '@navikt/sif-common-core/lib/components/validation-error-summary-base/ValidationErrorSummaryBase';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import SummaryList from 'common/components/summary-list/SummaryList';
import TextareaSummary from 'common/components/textarea-summary/TextareaSummary';
import { HistoryProps } from 'common/types/History';
import { Locale } from 'common/types/Locale';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { formatName } from 'common/utils/personUtils';
import ArbeidsforholdSummary from 'app/components/arbeidsforhold-summary/ArbeidsforholdSummary';
import {
    renderFerieuttakIPeriodenSummary, renderUtenlandsoppholdIPeriodenSummary,
    renderUtenlandsoppholdSummary
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
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
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
            sendingInProgress: false
        };
        this.navigate = this.navigate.bind(this);
    }

    async navigate(apiValues: PleiepengesøknadApiData, søkerdata: Søkerdata) {
        const { history, onApplicationSent } = this.props;
        this.setState({
            sendingInProgress: true
        });
        if (appIsRunningInDemoMode()) {
            navigateTo(routeConfig.SØKNAD_SENDT_ROUTE, history);
        } else {
            try {
                await purge();
                await sendApplication(apiValues);
                onApplicationSent(apiValues, søkerdata);
            } catch (error) {
                if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                    navigateToLoginPage();
                } else {
                    navigateTo(routeConfig.ERROR_PAGE_ROUTE, history);
                }
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
                        person: { fornavn, mellomnavn, etternavn, fodselsnummer },
                        barn
                    } = søkerdata;
                    const apiValues = mapFormDataToApiData(values, barn, intl.locale as Locale);
                    const apiValuesValidationErrors = validateApiValues(apiValues, intl);

                    const {
                        medlemskap,
                        tilsynsordning,
                        nattevaak,
                        beredskap,
                        utenlandsopphold_i_perioden,
                        ferieuttak_i_perioden
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
                                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.søker.header')}>
                                        <Normaltekst>{formatName(fornavn, etternavn, mellomnavn)}</Normaltekst>
                                        <Normaltekst>
                                            <FormattedMessage
                                                id="steg.oppsummering.søker.fnr"
                                                values={{ fodselsnummer }}
                                            />
                                        </Normaltekst>
                                    </ContentWithHeader>
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.tidsrom.header')}>
                                            <Normaltekst>
                                                <FormattedMessage
                                                    id="steg.oppsummering.tidsrom.fomtom"
                                                    values={{
                                                        fom: prettifyDate(apiStringDateToDate(apiValues.fra_og_med)),
                                                        tom: prettifyDate(apiStringDateToDate(apiValues.til_og_med))
                                                    }}
                                                />
                                            </Normaltekst>
                                        </ContentWithHeader>
                                    </Box>
                                    {isFeatureEnabled(Feature.TOGGLE_8_UKER) && info8uker?.erOver8Uker && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.over8uker.header',
                                                    info8uker
                                                        ? { varighet: getVarighetString(info8uker?.antallDager, intl) }
                                                        : undefined
                                                )}>
                                                <JaNeiSvar harSvartJa={apiValues.bekrefter_periode_over_8_uker} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}
                                    <Box margin="l">
                                        <BarnSummary barn={barn} formValues={values} apiValues={apiValues} />
                                    </Box>
                                    {isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) && apiValues.skal_bekrefte_omsorg && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.skalPassePåBarnetIHelePerioden.header'
                                                )}>
                                                <JaNeiSvar
                                                    harSvartJa={apiValues.skal_passe_pa_barnet_i_hele_perioden}
                                                />
                                            </ContentWithHeader>
                                            {hasValue(apiValues.beskrivelse_omsorgsrollen) && (
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.bekreftOmsorgEkstrainfo.header'
                                                        )}>
                                                        <TextareaSummary text={apiValues.beskrivelse_omsorgsrollen} />
                                                    </ContentWithHeader>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(
                                                intl,
                                                'steg.oppsummering.annenSøkerSammePeriode.header'
                                            )}>
                                            {apiValues.har_medsoker === true && intlHelper(intl, 'Ja')}
                                            {apiValues.har_medsoker === false && intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>

                                    {apiValues.har_medsoker && (
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(intl, 'steg.oppsummering.samtidigHjemme.header')}>
                                                <FormattedMessage id={apiValues.samtidig_hjemme ? 'Ja' : 'Nei'} />
                                            </ContentWithHeader>
                                        </Box>
                                    )}
                                    {/* Utenlandsopphold i perioden */}
                                    {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN) &&
                                        utenlandsopphold_i_perioden && (
                                            <>
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.utenlandsoppholdIPerioden.header'
                                                        )}>
                                                        <FormattedMessage
                                                            id={
                                                                utenlandsopphold_i_perioden.skal_oppholde_seg_i_utlandet_i_perioden
                                                                    ? 'Ja'
                                                                    : 'Nei'
                                                            }
                                                        />
                                                    </ContentWithHeader>
                                                </Box>
                                                {utenlandsopphold_i_perioden.opphold.length > 0 && (
                                                    <Box margin="l">
                                                        <ContentWithHeader
                                                            header={intlHelper(
                                                                intl,
                                                                'steg.oppsummering.utenlandsoppholdIPerioden.listetittel'
                                                            )}>
                                                            <SummaryList
                                                                items={utenlandsopphold_i_perioden.opphold}
                                                                itemRenderer={renderUtenlandsoppholdIPeriodenSummary}
                                                            />
                                                        </ContentWithHeader>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    {/* Ferieuttak i perioden */}
                                    {isFeatureEnabled(Feature.TOGGLE_FERIEUTTAK) && ferieuttak_i_perioden && (
                                        <>
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.ferieuttakIPerioden.header'
                                                    )}>
                                                    <FormattedMessage
                                                        id={
                                                            ferieuttak_i_perioden.skal_ta_ut_ferie_i_periode
                                                                ? 'Ja'
                                                                : 'Nei'
                                                        }
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                            {ferieuttak_i_perioden.ferieuttak.length > 0 && (
                                                <Box margin="l">
                                                    <ContentWithHeader
                                                        header={intlHelper(
                                                            intl,
                                                            'steg.oppsummering.ferieuttakIPerioden.listetittel'
                                                        )}>
                                                        <SummaryList
                                                            items={ferieuttak_i_perioden.ferieuttak}
                                                            itemRenderer={renderFerieuttakIPeriodenSummary}
                                                        />
                                                    </ContentWithHeader>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                    <Box margin="l">
                                        <ContentWithHeader
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
                                        </ContentWithHeader>
                                    </Box>

                                    {isFeatureEnabled(Feature.TOGGLE_FRILANS) && (
                                        <FrilansSummary apiValues={apiValues} />
                                    )}

                                    {isFeatureEnabled(Feature.TOGGLE_SELVSTENDIG) && (
                                        <SelvstendigSummary apiValues={apiValues} />
                                    )}

                                    {tilsynsordning && <TilsynsordningSummary tilsynsordning={tilsynsordning} />}
                                    {nattevaak && (
                                        <>
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(intl, 'steg.oppsummering.nattevåk.header')}>
                                                    {nattevaak.har_nattevaak === true && intlHelper(intl, 'Ja')}
                                                    {nattevaak.har_nattevaak === false && intlHelper(intl, 'Nei')}
                                                    {nattevaak.har_nattevaak === true &&
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
                                                {beredskap.i_beredskap === true && intlHelper(intl, 'Ja')}
                                                {beredskap.i_beredskap === false && intlHelper(intl, 'Nei')}
                                                {beredskap.tilleggsinformasjon && (
                                                    <TextareaSummary text={beredskap.tilleggsinformasjon} />
                                                )}
                                            </ContentWithHeader>
                                        </Box>
                                    )}
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetSiste12.header')}>
                                            {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.medlemskap.har_bodd_i_utlandet_siste_12_mnd === true &&
                                        medlemskap.utenlandsopphold_siste_12_mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetSiste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsopphold_siste_12_mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.utlandetNeste12.header')}>
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                                intlHelper(intl, 'Ja')}
                                            {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === false &&
                                                intlHelper(intl, 'Nei')}
                                        </ContentWithHeader>
                                    </Box>
                                    {apiValues.medlemskap.skal_bo_i_utlandet_neste_12_mnd === true &&
                                        medlemskap.utenlandsopphold_neste_12_mnd.length > 0 && (
                                            <Box margin="l">
                                                <ContentWithHeader
                                                    header={intlHelper(
                                                        intl,
                                                        'steg.oppsummering.utlandetNeste12.liste.header'
                                                    )}>
                                                    <SummaryList
                                                        items={medlemskap.utenlandsopphold_neste_12_mnd}
                                                        itemRenderer={renderUtenlandsoppholdSummary}
                                                    />
                                                </ContentWithHeader>
                                            </Box>
                                        )}
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(intl, 'steg.oppsummering.legeerklæring.header')}>
                                            <LegeerklæringAttachmentList includeDeletionFunctionality={false} />
                                        </ContentWithHeader>
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
