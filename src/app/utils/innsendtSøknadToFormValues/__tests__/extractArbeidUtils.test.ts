import { durationToISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverApiData } from '../../../types/søknad-api-data/arbeidsgiverApiData';
import { TimerFasteDagerApiData } from '../../../types/søknad-api-data/SøknadApiData';
import { arbeidsgiverHarOrganisasjonsnummer, timerFasteDagerApiDataToDurationWeekdays } from '../extractArbeidUtils';

describe('extractArbeidUtils', () => {
    describe('arbeidsgiverHarOrganisasjonsnummer', () => {
        it('returnerer true når det er et org-nummer', () => {
            expect(
                arbeidsgiverHarOrganisasjonsnummer({ organisasjonsnummer: '234' } as ArbeidsgiverApiData)
            ).toBeTruthy();
        });
        it('returnerer false når det ikke er ett org-nummer', () => {
            expect(arbeidsgiverHarOrganisasjonsnummer({} as ArbeidsgiverApiData)).toBeFalsy();
        });
    });

    describe('timerFasteDagerApiDataToDurationWeekdays', () => {
        const timer: TimerFasteDagerApiData = {
            mandag: 'PT1H0M',
            tirsdag: 'PT2H0M',
            onsdag: 'PT3H30M',
            torsdag: 'PT4H0M',
            fredag: 'PT5H0M',
        };
        it('returnerer riktig for uke mer timer hver dag', () => {
            const result = timerFasteDagerApiDataToDurationWeekdays(timer);
            expect(durationToISODuration(result.monday!)).toEqual('PT1H0M');
            expect(durationToISODuration(result.tuesday!)).toEqual('PT2H0M');
            expect(durationToISODuration(result.wednesday!)).toEqual('PT3H30M');
            expect(durationToISODuration(result.thursday!)).toEqual('PT4H0M');
            expect(durationToISODuration(result.friday!)).toEqual('PT5H0M');
        });
        it('returnerer riktig for tom uke', () => {
            const result = timerFasteDagerApiDataToDurationWeekdays({});
            expect(result.monday).toBeUndefined();
            expect(result.tuesday).toBeUndefined();
            expect(result.wednesday).toBeUndefined();
            expect(result.thursday).toBeUndefined();
            expect(result.friday).toBeUndefined();
        });
    });
});
