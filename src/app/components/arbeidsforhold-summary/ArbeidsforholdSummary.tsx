import React from 'react';
import { ArbeidsforholdAnsattApiData, ArbeidsforholdApiData } from '../../types/PleiepengesøknadApiData';
import './arbeidsforholdSummary.less';

interface Props {
    arbeidsforhold: ArbeidsforholdApiData | ArbeidsforholdAnsattApiData;
}

const ArbeidsforholdSummary = (props: Props) => {
    console.log(props);

    return <>Todo</>;
    // const intl = useIntl();
    // const { jobberNormaltTimer, skalJobbe, arbeidsform, erAktivt, _type } = arbeidsforhold;

    // const isAnsattArbeidsforhold = isArbeidsforholdAnsattApiData(arbeidsforhold);
    // const isAvsluttetArbeidsforhold = isAnsattArbeidsforhold && arbeidsforhold.erAktivt === false;

    // const tittel = isAnsattArbeidsforhold
    //     ? intlHelper(intl, 'arbeidsforhold.oppsummering.ansatt', {
    //           navn: arbeidsforhold.navn,
    //           organisasjonsnummer: arbeidsforhold.organisasjonsnummer,
    //       })
    //     : _type === ArbeidsforholdType.FRILANSER
    //     ? intlHelper(intl, 'arbeidsforhold.oppsummering.frilanser')
    //     : intlHelper(intl, 'arbeidsforhold.oppsummering.selvstendig');

    // if (skalJobbe === undefined || arbeidsform === undefined) {
    //     const feilmelding = isAnsattArbeidsforhold
    //         ? intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdAnsatt')
    //         : _type === ArbeidsforholdType.FRILANSER
    //         ? intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdFrilans')
    //         : intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdSN');

    //     return (
    //         <div className={bem.block}>
    //             <div className={bem.element('tittel')}>{tittel}</div>
    //             <Box margin="m">
    //                 <AlertStripe form="inline" type="feil">
    //                     {feilmelding}
    //                 </AlertStripe>
    //             </Box>
    //         </div>
    //     );
    // }
    // const intlValues = {
    //     timerNormalt: jobberNormaltTimer,
    //     arbeidsform: intlHelper(intl, `arbeidsforhold.oppsummering.arbeidsform.${arbeidsform}`),
    // };

    // return (
    //     <div className={bem.block}>
    //         <div className={bem.element('tittel')}>{tittel}</div>
    //         <p>
    //             <FormattedMessage id={`arbeidsforhold.oppsummering.duHarOppgitt.${_type}`} />
    //         </p>
    //         <ul>
    //             {isAnsattArbeidsforhold && erAnsatt === false && (
    //                 <li>
    //                     <FormattedMessage id="arbeidsforhold.oppsummering.avsluttet" values={{ ...intlValues }} />
    //                 </li>
    //             )}
    //             <li>
    //                 <FormattedMessage
    //                     id={
    //                         isAvsluttetArbeidsforhold
    //                             ? 'arbeidsforhold.oppsummering.avsluttet.jobberVanligvis'
    //                             : 'arbeidsforhold.oppsummering.jobberVanligvis'
    //                     }
    //                     values={intlValues}
    //                 />
    //             </li>
    //             <li>
    //                 {skalJobbe === JobberSvar.JA && (
    //                     <FormattedMessage
    //                         id={
    //                             isAvsluttetArbeidsforhold
    //                                 ? 'arbeidsforhold.oppsummering.avsluttet.skalJobbeSomVanlig'
    //                                 : 'arbeidsforhold.oppsummering.skalJobbeSomVanlig'
    //                         }
    //                         values={intlValues}
    //                     />
    //                 )}
    //                 {skalJobbe === JobberSvar.NEI && (
    //                     <FormattedMessage
    //                         id={
    //                             isAvsluttetArbeidsforhold
    //                                 ? 'arbeidsforhold.oppsummering.avsluttet.skalIkkeJobbe'
    //                                 : 'arbeidsforhold.oppsummering.skalIkkeJobbe'
    //                         }
    //                     />
    //                 )}
    //                 {skalJobbe === JobberSvar.VET_IKKE && (
    //                     <FormattedMessage
    //                         id={
    //                             isAvsluttetArbeidsforhold
    //                                 ? 'arbeidsforhold.oppsummering.avsluttet.vetIkke'
    //                                 : 'arbeidsforhold.oppsummering.vetIkke'
    //                         }
    //                         values={intlValues}
    //                     />
    //                 )}
    //             </li>
    //         </ul>
    //     </div>
    // );
};

export default ArbeidsforholdSummary;
