// import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
// import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
// import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
// import { decimalDurationToISODuration } from '@navikt/sif-common-utils/lib';
// import { TimerEllerProsent } from '../../types';
// import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
// import {
//     ArbeidsforholdFormData,
//     ArbeidsforholdFrilanserFormData,
//     NormalarbeidstidFormData,
// } from '../../types/ArbeidsforholdFormData';
// import { ArbeidIPeriodeApiData, ArbeidsforholdApiData, NormalarbeidstidApiData } from '../../types/SøknadApiData';
// // import {
// //     getArbeidstimerUtFraFasteDager,
// //     getFasteDagerSomProsentAvFasteDager,
// //     getFasteDagerUtFraTimerPerUke,
// // } from './arbeidstidBeregningUtils';
// import {
//     fjernArbeidstimerUtenforPeriodeOgHelgedager,
//     getArbeidstidEnkeltdagerIPeriodeApiData,
//     getFasteDagerApiData,
// } from './tidsbrukApiUtils';

// export const mapArbeidIPeriodeToApiData = ({
//     arbeidsperiode,
//     arbeidIPeriode,
// }: {
//     søknadsperiode: DateRange;
//     arbeidsperiode?: Partial<DateRange>;
//     arbeidIPeriode: ArbeidIPeriodeFormData;
//     arbeidstimerNormalt: NormalarbeidstidApiData;
// }): ArbeidIPeriodeApiData => {
//     if (arbeidIPeriode.jobberIPerioden === YesOrNo.NO) {
//         return {
//             jobberIPerioden: 'NEI',
//         };
//     }
//     const apiData: ArbeidIPeriodeApiData = {
//         jobberIPerioden: arbeidIPeriode.jobberIPerioden === YesOrNo.YES ? 'JA' : 'NEI',
//         erLiktHverUke: arbeidIPeriode.erLiktHverUke === YesOrNo.YES,
//     };

//     if (apiData.erLiktHverUke) {
//         /** Skal arbeide likt hver uke i perioden - timer for hver ukedag */
//         if (arbeidIPeriode.timerEllerProsent === TimerEllerProsent.PROSENT) {
//             /** Har oppgitt prosent av normalt */
//             apiData.jobberProsent = getNumberFromNumberInputValue(arbeidIPeriode.jobberProsent);
//             if (apiData.jobberProsent === undefined) {
//                 throw Error('mapArbeidIPeriodeToApiData- Prosent ikke gyldig');
//             }
//             // if (arbeidstimerNormalt.erLiktHverUke) {
//             //     /** Normaltid er oppgitt som timer for hver ukedag */
//             //     apiData.fasteDager = getFasteDagerSomProsentAvFasteDager(
//             //         arbeidstimerNormalt.timerFasteDager,
//             //         apiData.jobberProsent
//             //     );
//             // } else {
//             //     /** Normaltid er oppgitt som timer per uke i snitt */
//             //     apiData.fasteDager = getFasteDagerUtFraTimerPerUke(
//             //         arbeidstimerNormalt.timerPerUke,
//             //         apiData.jobberProsent
//             //     );
//             // }
//         } else {
//             /** Har oppgitt timer per dag */
//             const { fasteDager } = arbeidIPeriode;
//             if (fasteDager === undefined) {
//                 throw Error('mapArbeidIPeriodeToApiData - Faste dager er undefined');
//             }
//             // apiData.fasteDager = getArbeidstimerUtFraFasteDager(arbeidstimerNormalt, fasteDager);
//         }
//     } else {
//         /** Det varierer - enkeltdager */
//         if (arbeidIPeriode.enkeltdager === undefined) {
//             throw 'mapArbeidIPeriodeToApiData - enkeltdager er undefined';
//         }
//         /** TODO */
//         const enkeltdager = getArbeidstidEnkeltdagerIPeriodeApiData(arbeidIPeriode.enkeltdager, {});
//         apiData.enkeltdager = arbeidsperiode
//             ? fjernArbeidstimerUtenforPeriodeOgHelgedager(arbeidsperiode, enkeltdager)
//             : enkeltdager;
//     }
//     return apiData;

//     // if (arbeidIPeriode.timerEllerProsent === TimerEllerProsent.PROSENT) {
//     //     const jobberProsentNumber = getNumberFromNumberInputValue(arbeidIPeriode.jobberProsent);
//     //     if (jobberProsentNumber === undefined) {
//     //         throw new Error('mapArbeidIPeriodeToApiData - jobberProsentNumber undefined');
//     //     }
//     //     if (jobberNormaltTimerUkedager)
//     //         const jobberTimerSnittNumber = getNumberFromNumberInputValue(jobberNormaltTimerPerUke);
//     //     return {
//     //         ...apiData,
//     //         erLiktHverUke: true,
//     //         fasteDager: lagFasteDagerUtFraProsentIPeriode(jobberNormaltTimerPerUke, jobberProsentNumber),
//     //         jobberProsent: jobberProsentNumber,
//     //     };
//     // }

//     // const normalTimerISODuration = durationToISODuration(decimalDurationToDuration(jobberNormaltTimerUkedager / 5));
//     // const erLiktHverUke = isYesOrNoAnswered(arbeidIPeriode.erLiktHverUke)
//     //     ? arbeidIPeriode.erLiktHverUke === YesOrNo.YES
//     //     : undefined;
//     // const enkeltdager =
//     //     arbeidIPeriode.enkeltdager && !erLiktHverUke
//     //         ? getArbeidstidEnkeltdagerIPeriodeApiData(
//     //               arbeidIPeriode.enkeltdager,
//     //               søknadsperiode,
//     //               normalTimerISODuration
//     //           )
//     //         : undefined;

//     // return {
//     //     ...apiData,
//     //     erLiktHverUke,
//     //     enkeltdager: arbeidsperiode
//     //         ? fjernArbeidstimerUtenforPeriodeOgHelgedager(arbeidsperiode, enkeltdager)
//     //         : enkeltdager,
//     //     fasteDager:
//     //         arbeidIPeriode.fasteDager && erLiktHverUke
//     //             ? getFasteArbeidsdagerApiData(arbeidIPeriode.fasteDager, normalTimerISODuration)
//     //             : undefined,
//     // };
// };

// const mapArbeidstimerNormalt = ({
//     timerPerUke,
//     fasteDager,
//     erLiktHverUke,
// }: NormalarbeidstidFormData): NormalarbeidstidApiData | undefined => {
//     if (erLiktHverUke === YesOrNo.NO) {
//         const snitt = getNumberFromNumberInputValue(timerPerUke);
//         if (!snitt) {
//             return undefined;
//         }
//         const timerPerDag = snitt / 5;
//         return snitt !== undefined
//             ? {
//                   erLiktHverUke: false,
//                   timerPerUke: snitt,
//                   timerFasteDager: {
//                       mandag: decimalDurationToISODuration(timerPerDag),
//                       tirsdag: decimalDurationToISODuration(timerPerDag),
//                       onsdag: decimalDurationToISODuration(timerPerDag),
//                       torsdag: decimalDurationToISODuration(timerPerDag),
//                       fredag: decimalDurationToISODuration(timerPerDag),
//                   },
//               }
//             : undefined;
//     }
//     if (erLiktHverUke === YesOrNo.YES && fasteDager) {
//         return {
//             erLiktHverUke: true,
//             timerFasteDager: getFasteDagerApiData(fasteDager),
//         };
//     }
//     return undefined;
// };

// export const mapArbeidsforholdToApiData = (
//     arbeidsforhold: ArbeidsforholdFormData | ArbeidsforholdFrilanserFormData,
//     søknadsperiode: DateRange,
//     /** Periode hvor en er aktiv, f.eks. noen som starter sluttet i søknadsperioden */
//     arbeidsperiode?: Partial<DateRange>
// ): ArbeidsforholdApiData => {
//     const harFraværIPeriode: boolean = arbeidsforhold.harFraværIPeriode === YesOrNo.YES;
//     const arbeidstimerNormalt = arbeidsforhold.normalarbeidstid
//         ? mapArbeidstimerNormalt(arbeidsforhold.normalarbeidstid)
//         : undefined;

//     if (arbeidstimerNormalt === undefined) {
//         throw new Error('mapArbeidIPeriodeToApiData - arbeidstimerNormalt is undefined');
//     }

//     const arbeidIPeriode =
//         arbeidsforhold.arbeidIPeriode !== undefined && harFraværIPeriode
//             ? mapArbeidIPeriodeToApiData({
//                   søknadsperiode,
//                   arbeidsperiode,
//                   arbeidIPeriode: arbeidsforhold.arbeidIPeriode,
//                   arbeidstimerNormalt,
//               })
//             : undefined;
//     return {
//         harFraværIPeriode,
//         normalarbeidstid: arbeidstimerNormalt,
//         arbeidIPeriode,
//     };
// };