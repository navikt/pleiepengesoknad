import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { MedlemskapFormData } from '../../../types/SøknadFormData';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { extractMedlemskapSøknadsdata } from '../extractMedlemskapSøknadsdata';

const mockUtenlandsopphold: Utenlandsopphold = {
    fom: new Date(),
    tom: new Date(),
    landkode: 'ARG',
    id: '12334',
};

const formData: MedlemskapFormData = {
    harBoddUtenforNorgeSiste12Mnd: YesOrNo.YES,
    utenlandsoppholdSiste12Mnd: [mockUtenlandsopphold],
    skalBoUtenforNorgeNeste12Mnd: YesOrNo.YES,
    utenlandsoppholdNeste12Mnd: [mockUtenlandsopphold],
};

describe('extractMedlemskapSøknadsdata', () => {
    describe('Har bodd og skal bo i utlandet', () => {
        it('returnerer harBoddSkalBo dersom bruker har bodd og skal bo i utlandet', () => {
            const result = extractMedlemskapSøknadsdata(formData);
            expect(result).toBeDefined();
            expect(result?.type).toEqual('harBoddSkalBo');
        });
    });

    describe('Har bodd i utlandet', () => {
        it('returnerer harBodd dersom bruker har bodd i utlandet', () => {
            const result = extractMedlemskapSøknadsdata({
                ...formData,
                skalBoUtenforNorgeNeste12Mnd: YesOrNo.NO,
                utenlandsoppholdNeste12Mnd: [],
            });
            expect(result).toBeDefined();
            expect(result?.type).toEqual('harBodd');
        });
    });

    describe('Skal bo i utlandet', () => {
        it('returnerer skalBo dersom bruker skal bo i utlandet', () => {
            const result = extractMedlemskapSøknadsdata({
                ...formData,
                harBoddUtenforNorgeSiste12Mnd: YesOrNo.NO,
                utenlandsoppholdSiste12Mnd: [],
            });
            expect(result).toBeDefined();
            expect(result?.type).toEqual('skalBo');
        });
    });

    describe('Har ikke bodd og skal ikke bo i utlandet', () => {
        it('returnerer harIkkeBoddSkalIkkeBo dersom bruker har ikke bodd og skal ikke bo i utlandet', () => {
            const result = extractMedlemskapSøknadsdata({
                ...formData,
                harBoddUtenforNorgeSiste12Mnd: YesOrNo.YES,
                utenlandsoppholdSiste12Mnd: [],
                skalBoUtenforNorgeNeste12Mnd: YesOrNo.NO,
                utenlandsoppholdNeste12Mnd: [],
            });
            expect(result).toBeDefined();
            expect(result?.type).toEqual('harIkkeBoddSkalIkkeBo');
        });
    });
});
