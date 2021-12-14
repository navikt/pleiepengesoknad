import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { JobberIPeriodeSvar } from '../../../types';
import { SøknadFormField, Arbeidsforhold, SøknadFormData } from '../../../types/SøknadFormData';
import { FrilansApiDataPart, getFrilansApiData } from '../frilansApiData';

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

const frilans_arbeidsforhold: Arbeidsforhold = {
    jobberNormaltTimer: '10',
    historisk: {
        jobberIPerioden: JobberIPeriodeSvar.JA,
        enkeltdager: {
            '2021-01-31': { varighet: { hours: '5', minutes: '0' } },
            '2021-02-01': { varighet: { hours: '5', minutes: '0' } },
            '2021-02-10': { varighet: { hours: '5', minutes: '0' } },
            '2021-02-11': { varighet: { hours: '5', minutes: '0' } },
        },
    },
    planlagt: {
        jobberIPerioden: JobberIPeriodeSvar.JA,
        enkeltdager: {
            '2021-02-09': { varighet: { hours: '5', minutes: '0' } },
        },
    },
};

describe('frilansApiData', () => {
    const formData: SøknadFormData = {} as SøknadFormData;

    it('returnerer _harHattInntektSomFrilanser===false dersom startdato er ugyldig', () => {
        const apiData = getFrilansApiData({ ...formData, frilans_startdato: undefined }, søknadsperiode, søknadsdato);
        expect(apiData._harHattInntektSomFrilanser).toBeFalsy();
        expect(apiData.frilans).toBeUndefined();
    });

    it(`returnerer _harHattInntektSomFrilanser===false, og frilans===undefined dersom ${SøknadFormField.frilans_harHattInntektSomFrilanser} === ${YesOrNo.NO}`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            { ...formData, frilans_harHattInntektSomFrilanser: YesOrNo.NO },
            søknadsperiode,
            søknadsdato
        );
        expect(apiData._harHattInntektSomFrilanser).toBeFalsy();
        expect(apiData.frilans).toBeUndefined();
    });

    it(`returnerer arbeidsforhold dersom starter som frilanser før periode, og er fortsatt frilanser`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                frilans_startdato: '2000-01-01',
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            søknadsdato
        );
        expect(apiData.frilans).toBeDefined();
    });
    it(`returnerer arbeidsforhold dersom starter som frilanser i perioden, og er fortsatt frilanser`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                frilans_startdato: '2021-02-05',
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            søknadsdato
        );
        expect(apiData.frilans).toBeDefined();
    });
    it(`returnerer arbeidsforhold dersom starter som frilanser i perioden, og slutter i perioden`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                frilans_startdato: '2021-02-05',
                frilans_sluttdato: '2021-02-06',
                frilans_jobberFortsattSomFrilans: YesOrNo.NO,
            },
            søknadsperiode,
            søknadsdato
        );
        expect(apiData.frilans).toBeDefined();
    });
    it(`returnerer ikke arbeidsforhold dersom en starter som frilanser etter søknadsperioden`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                frilans_startdato: '2021-02-11',
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            søknadsdato
        );
        expect(apiData.frilans).toBeUndefined();
    });
    it(`returnerer ikke arbeidsforhold dersom en slutter som frilanser før søknadsperioden`, () => {
        const apiData: FrilansApiDataPart = getFrilansApiData(
            {
                ...formData,
                frilans_harHattInntektSomFrilanser: YesOrNo.YES,
                frilans_startdato: '2021-01-01',
                frilans_sluttdato: '2021-01-31',
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            },
            søknadsperiode,
            søknadsdato
        );
        expect(apiData.frilans).toBeUndefined();
    });
    describe('frilans arbeidsforhold', () => {
        const formDataMedArbeidsforhold = {
            ...formData,
            frilans_harHattInntektSomFrilanser: YesOrNo.YES,
            frilans_startdato: '2021-01-01',
            frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            frilans_arbeidsforhold,
        };
        it(`returnerer historiskArbeid dersom en har registrert arbeidstid før søknadsdato og jobber i perioden`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                formDataMedArbeidsforhold,
                søknadsperiode,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.historiskArbeid).toBeDefined();
            }
        });
        it(`returnerer "historiskArbeid - jobber ikke i perioden",  dersom en ikke har registrert arbeidstid før søknadsdato, men jobber i perioden`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                {
                    ...formDataMedArbeidsforhold,
                    frilans_arbeidsforhold: {
                        ...frilans_arbeidsforhold,
                        historisk: { jobberIPerioden: JobberIPeriodeSvar.NEI },
                    },
                },
                søknadsperiode,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.historiskArbeid?.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
            }
        });
        it(`returnerer historiskArbeid som undefined,  dersom en ikke har registrert arbeidstid før søknadsdato og ikke søker historisk`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                {
                    ...formDataMedArbeidsforhold,
                    frilans_arbeidsforhold: {
                        ...frilans_arbeidsforhold,
                        historisk: { jobberIPerioden: JobberIPeriodeSvar.NEI },
                    },
                },
                søknadsperiodePlanlagt,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.historiskArbeid?.jobberIPerioden).toBeUndefined();
            }
        });
        it(`returnerer planlagtArbeid dersom en har registrert arbeidstid etter søknadsdato`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                formDataMedArbeidsforhold,
                søknadsperiode,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.planlagtArbeid).toBeDefined();
            }
        });
        it(`returnerer "planlagtArbeid - jobber ikke i perioden" dersom en ikke har registrert arbeidstid etter søknadsdato`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                {
                    ...formDataMedArbeidsforhold,
                    frilans_arbeidsforhold: {
                        ...frilans_arbeidsforhold,
                        planlagt: { jobberIPerioden: JobberIPeriodeSvar.NEI },
                    },
                },
                søknadsperiode,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.planlagtArbeid?.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
            }
        });
        it(`returnerer planlagtArbeid undefined dersom en ikke har registrert arbeidstid etter søknadsdato og ikke søker fremover`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                {
                    ...formDataMedArbeidsforhold,
                    frilans_arbeidsforhold: {
                        ...frilans_arbeidsforhold,
                    },
                },
                søknadsperiodeHistorisk,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.planlagtArbeid?.jobberIPerioden).toBeUndefined();
            }
        });

        it(`planlagtArbeid er undefined dersom en kun søker fortid`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                formDataMedArbeidsforhold,
                søknadsperiodeHistorisk,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.planlagtArbeid).toBeUndefined();
            }
        });

        it(`planlagtArbeid.jobberIPerioden er NEI dersom en søker fortid og fremtid, men er ikke frilanser i fremtid`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                { ...formDataMedArbeidsforhold, frilans_sluttdato: '2021-02-05' },
                søknadsperiode,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.planlagtArbeid?.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
            }
        });

        it(`historiskArbeid er undefined dersom en kun søker fremtid`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                formDataMedArbeidsforhold,
                søknadsperiodePlanlagt,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.historiskArbeid).toBeUndefined();
            }
        });

        it(`historiskArbeid.jobberIPerioden er NEI dersom en søker fortid/fremtid men er ikke frilanser i fortid`, () => {
            const apiData: FrilansApiDataPart = getFrilansApiData(
                { ...formDataMedArbeidsforhold, frilans_startdato: '2021-02-06' },
                søknadsperiode,
                søknadsdato
            );
            expect(apiData.frilans?.arbeidsforhold).toBeDefined();
            if (apiData.frilans && apiData.frilans.arbeidsforhold) {
                expect(apiData.frilans.arbeidsforhold.historiskArbeid?.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
            }
        });
    });
});
