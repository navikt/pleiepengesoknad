import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { dateToISODate, ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { Arbeidsgiver } from '../../../types';
import { ArbeidsforholdFrilanserFormData } from '../../../types/ArbeidsforholdFormData';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { extractArbeidFrilansSøknadsdata } from '../extractArbeidFrilansSøknadsdata';
import * as arbeidsforholdMock from '../extractArbeidsforholdSøknadsdata';

const søknadsperiode = ISODateRangeToDateRange('2022-01-01/2022-02-01');
const datoFørSøknadsperiode = dayjs(søknadsperiode.from).subtract(1, 'day').toDate();
const datoISøknadsperiode = dayjs(søknadsperiode.from).add(2, 'day').toDate();

const arbeidsforholdSpy = jest.spyOn(arbeidsforholdMock, 'extractArbeidsforholdSøknadsdata');
const mockArbeidsforhold: ArbeidsforholdFrilanserFormData = {} as any;

const frilansoppdrag: Arbeidsgiver[] = [{} as any];

const formData: FrilansFormData = {
    harHattInntektSomFrilanser: YesOrNo.YES,
    erFortsattFrilanser: YesOrNo.YES,
    startdato: '2020-01-01',
    arbeidsforhold: mockArbeidsforhold,
};

describe('extractArbeidFrilansSøknadsdata', () => {
    describe('Er ikke frilanser i søknadsperiode', () => {
        it.only('returnerer erIkkeFrilanser dersom bruker ikke har oppdrag og har svart nei', () => {
            const result = extractArbeidFrilansSøknadsdata(
                { ...formData, harHattInntektSomFrilanser: YesOrNo.NO },
                [],
                søknadsperiode
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual('erIkkeFrilanser');
        });
        it('returnerer avsluttetFørSøknadsperiode dersom bruker har oppdrag men er ikke frilanser lenger', () => {
            const result = extractArbeidFrilansSøknadsdata(
                {
                    ...formData,
                    harHattInntektSomFrilanser: YesOrNo.NO,
                    erFortsattFrilanser: YesOrNo.NO,
                    sluttdato: dateToISODate(datoFørSøknadsperiode),
                },
                frilansoppdrag,
                søknadsperiode
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual('avsluttetFørSøknadsperiode');
        });
    });

    describe('er frilanser i perioden', () => {
        beforeEach(() => {
            arbeidsforholdSpy.mockReturnValue({} as any);
        });
        it('returnerer avsluttetISøknadsperiode og arbeidsforhod dersom bruker har oppdrag men er ikke frilanser lenger', () => {
            beforeEach(() => {
                arbeidsforholdSpy.mockReturnValue({} as any);
            });
            const result = extractArbeidFrilansSøknadsdata(
                {
                    ...formData,
                    arbeidsforhold: {} as any,
                    erFortsattFrilanser: YesOrNo.NO,
                    sluttdato: dateToISODate(datoISøknadsperiode),
                },
                frilansoppdrag,
                søknadsperiode
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual('avsluttetISøknadsperiode');
        });
        it('returnerer pågående dersom bruker fortsatt er frilanser', () => {
            beforeEach(() => {
                arbeidsforholdSpy.mockReturnValue({} as any);
            });
            const result = extractArbeidFrilansSøknadsdata(
                {
                    ...formData,
                    arbeidsforhold: {} as any,
                    harHattInntektSomFrilanser: YesOrNo.YES,
                    erFortsattFrilanser: YesOrNo.YES,
                },
                frilansoppdrag,
                søknadsperiode
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual('pågående');
        });
    });
});
