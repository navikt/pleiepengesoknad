/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ArbeidsgiverApiData } from '../../../types/søknad-api-data/arbeidsgiverApiData';
import { arbeidsgiverHarOrganisasjonsnummer } from '../extractFormValuesUtils';

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
});
