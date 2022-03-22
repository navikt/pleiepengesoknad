import { DurationWeekdays, getPercentageOfDuration } from '@navikt/sif-common-utils/lib';

// export const getArbeidstimerDag = (prosent: number, normalt?: Duration): ArbeidstimerDag | undefined => {
//     if (normalt) {
//         const faktisk = getPercentageOfDuration(normalt, prosent);
//         return faktisk
//             ? {
//                   faktisk,
//                   normalt,
//               }
//             : undefined;
//     }
//     return undefined;
// };

// export const getRedusertArbeidstimerFasteDager = (
//     jobberProsent: number,
//     arbeidNormalt: DurationWeekdays
// ): ArbeidstimerFasteDager => ({
//     mandag: getArbeidstimerDag(jobberProsent, arbeidNormalt.monday),
//     tirsdag: getArbeidstimerDag(jobberProsent, arbeidNormalt.tuesday),
//     onsdag: getArbeidstimerDag(jobberProsent, arbeidNormalt.wednesday),
//     torsdag: getArbeidstimerDag(jobberProsent, arbeidNormalt.thursday),
//     fredag: getArbeidstimerDag(jobberProsent, arbeidNormalt.friday),
// });

export const getPercentageOfDurationWeekdays = (percentage: number, weekdays: DurationWeekdays): DurationWeekdays => ({
    monday: weekdays.monday ? getPercentageOfDuration(weekdays.monday, percentage) : undefined,
    tuesday: weekdays.tuesday ? getPercentageOfDuration(weekdays.tuesday, percentage) : undefined,
    wednesday: weekdays.wednesday ? getPercentageOfDuration(weekdays.wednesday, percentage) : undefined,
    thursday: weekdays.thursday ? getPercentageOfDuration(weekdays.thursday, percentage) : undefined,
    friday: weekdays.friday ? getPercentageOfDuration(weekdays.friday, percentage) : undefined,
});
