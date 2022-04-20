import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { extractFerieuttakIPeriodenSøknadsdata } from '../extractFerieuttakIPeriodenSøknadsdata';

const mock = {
    skalTaUtFerieIPerioden: YesOrNo.YES,
    ferieuttakIPerioden: [
        {
            fom: new Date(),
            tom: new Date(),
        },
    ],
};

describe('extractFerieuttakIPeriodenSøknadsdata', () => {
    it('returnerer type skalTaUtFerieSøknadsdata', () => {
        const result = extractFerieuttakIPeriodenSøknadsdata(mock);
        expect(result).toBeDefined();
        expect(result?.type).toEqual('skalTaUtFerieSøknadsdata');
    });

    it('returnerer type skalIkkeTaUtFerieSøknadsdata', () => {
        const result = extractFerieuttakIPeriodenSøknadsdata({
            ...mock,
            skalTaUtFerieIPerioden: YesOrNo.NO,
        });
        expect(result).toBeDefined();
        expect(result?.type).toEqual('skalIkkeTaUtFerieSøknadsdata');
    });

    it('returnerer undefined', () => {
        const result = extractFerieuttakIPeriodenSøknadsdata({
            skalTaUtFerieIPerioden: YesOrNo.YES,
            ferieuttakIPerioden: undefined,
        });
        expect(result).toBeUndefined();
    });
});
