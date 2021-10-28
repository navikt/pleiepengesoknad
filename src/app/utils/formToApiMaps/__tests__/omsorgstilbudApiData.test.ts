import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { VetOmsorgstilbud } from '../../../types';
import { AppFormField, Omsorgstilbud } from '../../../types/PleiepengesøknadFormData';
import {
    getOmsorgstilbudApiData,
    mapHistoriskOmsorgstilbudToApiData,
    mapPlanlagtOmsorgstilbudToApiData,
} from '../omsorgstilbudApiData';

const søknadsperiode: DateRange = {
    from: new Date(2021, 1, 1),
    to: new Date(2021, 1, 10),
};

const søknadsperiodeHistorisk: DateRange = {
    from: new Date(2021, 1, 1),
    to: new Date(2021, 1, 5),
};

const søknadsperiodePlanlagt: DateRange = {
    from: new Date(2021, 1, 10),
    to: new Date(2021, 1, 15),
};

const søknadsdato = new Date(2021, 1, 6);

const omsorgstilbud: Omsorgstilbud = {
    harBarnVærtIOmsorgstilbud: YesOrNo.YES,
    skalBarnIOmsorgstilbud: YesOrNo.YES,
    historisk: {
        enkeltdager: { '2021-02-01': { hours: '1' } },
    },
    planlagt: {
        enkeltdager: {
            '2021-01-06': { hours: '1' },
        },
        erLiktHverUke: YesOrNo.NO,
        vetHvorMyeTid: VetOmsorgstilbud.VET_ALLE_TIMER,
    },
};

describe('omsorgstilbudApiData', () => {
    describe('getOmsorgstilbudApiData', () => {
        it('returnerer undefined dersom planlagt og historisk er undefined', () => {
            const result = getOmsorgstilbudApiData(
                { historisk: undefined, planlagt: undefined },
                søknadsperiode,
                søknadsdato
            );
            expect(result.omsorgstilbud).toBeUndefined();
        });
    });

    describe('mapHistoriskOmsorgstilbudToApiData', () => {
        it(`returner undefined dersom ${AppFormField.omsorgstilbud__harBarnVærtIOmsorgstilbud} !== ${YesOrNo.YES}`, () => {
            expect(
                mapHistoriskOmsorgstilbudToApiData(
                    { ...omsorgstilbud, harBarnVærtIOmsorgstilbud: YesOrNo.NO },
                    søknadsperiode,
                    søknadsdato
                )
            ).toBeUndefined();
            expect(
                mapHistoriskOmsorgstilbudToApiData(
                    { ...omsorgstilbud, harBarnVærtIOmsorgstilbud: YesOrNo.UNANSWERED },
                    søknadsperiode,
                    søknadsdato
                )
            ).toBeUndefined();
            expect(
                mapHistoriskOmsorgstilbudToApiData(
                    { ...omsorgstilbud, harBarnVærtIOmsorgstilbud: undefined },
                    søknadsperiode,
                    søknadsdato
                )
            ).toBeUndefined();
        });
        it('returnerer undefined dersom en ikke søker for historisk periode', () => {
            const result = mapHistoriskOmsorgstilbudToApiData(omsorgstilbud, søknadsperiodePlanlagt, søknadsdato);
            expect(result).toBeUndefined();
        });
        it('returnerer undefined dersom en ikke har registrert noen dager', () => {
            const result = mapHistoriskOmsorgstilbudToApiData(
                { ...omsorgstilbud, historisk: undefined },
                søknadsperiodeHistorisk,
                søknadsdato
            );
            expect(result).toBeUndefined();
        });
        it('returnerer historisk omsorgstilbud når informasjon er riktig', () => {
            const result = mapHistoriskOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode, søknadsdato);
            expect(result).toBeDefined();
        });
    });
    describe('mapPlanlagtOmsorgstilbudToApiData', () => {
        it(`returner undefined dersom ${AppFormField.omsorgstilbud__skalBarnIOmsorgstilbud} === ${YesOrNo.NO} || planlagt info er undefinert`, () => {
            expect(
                mapPlanlagtOmsorgstilbudToApiData(
                    { ...omsorgstilbud, skalBarnIOmsorgstilbud: YesOrNo.NO },
                    søknadsperiode,
                    søknadsdato
                )
            ).toBeUndefined();
            expect(
                mapPlanlagtOmsorgstilbudToApiData(
                    { ...omsorgstilbud, skalBarnIOmsorgstilbud: YesOrNo.UNANSWERED },
                    søknadsperiode,
                    søknadsdato
                )
            ).toBeUndefined();
            expect(
                mapPlanlagtOmsorgstilbudToApiData(
                    { ...omsorgstilbud, skalBarnIOmsorgstilbud: undefined },
                    søknadsperiode,
                    søknadsdato
                )
            ).toBeUndefined();
            expect(
                mapPlanlagtOmsorgstilbudToApiData(
                    { ...omsorgstilbud, skalBarnIOmsorgstilbud: YesOrNo.YES, planlagt: undefined },
                    søknadsperiode,
                    søknadsdato
                )
            ).toBeUndefined();
        });

        it('returnerer undefined for planlagt dersom en kun søker historisk', () => {
            expect(
                mapPlanlagtOmsorgstilbudToApiData(omsorgstilbud, søknadsperiodeHistorisk, søknadsdato)
            ).toBeUndefined();
        });

        it('returnerer riktig når barn skal i omsorgstilbud, men en vet ikke hvor mye', () => {
            const result = mapPlanlagtOmsorgstilbudToApiData(
                { ...omsorgstilbud, planlagt: { vetHvorMyeTid: VetOmsorgstilbud.VET_IKKE } },
                søknadsperiodePlanlagt,
                søknadsdato
            );
            expect(result?.vetOmsorgstilbud).toEqual(VetOmsorgstilbud.VET_IKKE);
        });

        it('returnerer undefined dersom planlagt er undefined', () => {
            const result = mapPlanlagtOmsorgstilbudToApiData(
                { ...omsorgstilbud, planlagt: undefined },
                søknadsperiodeHistorisk,
                søknadsdato
            );
            expect(result).toBeUndefined();
        });

        it('returnerer enkeltdager dersom hver uke ikke er lik', () => {
            const result = mapPlanlagtOmsorgstilbudToApiData(
                {
                    ...omsorgstilbud,
                    planlagt: {
                        ...omsorgstilbud.planlagt,
                        vetHvorMyeTid: VetOmsorgstilbud.VET_ALLE_TIMER,
                        erLiktHverUke: YesOrNo.NO,
                    },
                },
                søknadsperiode,
                søknadsdato
            );
            expect(result).toBeDefined();
            expect(result?.enkeltdager).toBeDefined();
        });
        it('returnerer fasteDager dersom hver uke er lik', () => {
            const result = mapPlanlagtOmsorgstilbudToApiData(
                {
                    ...omsorgstilbud,
                    planlagt: {
                        ...omsorgstilbud.planlagt,
                        vetHvorMyeTid: VetOmsorgstilbud.VET_ALLE_TIMER,
                        erLiktHverUke: YesOrNo.YES,
                        fasteDager: {
                            fredag: { hours: '1', minutes: '0' },
                        },
                    },
                },
                søknadsperiode,
                søknadsdato
            );
            expect(result).toBeDefined();
            expect(result?.ukedager).toBeDefined();
            expect(result?.ukedager?.fredag).toBeDefined();
        });
    });
});
