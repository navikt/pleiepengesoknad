import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ISODateToDate } from '@navikt/sif-common-utils';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormData } from '../../../../types/ArbeidIPeriodeFormData';
import { NormalarbeidstidSøknadsdata, NormalarbeidstidType } from '../../../../types/søknadsdata/Søknadsdata';
import { cleanupArbeidIPeriode } from '../cleanupArbeidstidStep';

const periodeFromDateString = '2021-02-01';
const periodeToDateString = '2021-02-12';

const arbeidIPeriode: ArbeidIPeriodeFormData = {
    arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
    erLiktHverUke: YesOrNo.YES,
    timerEllerProsent: TimerEllerProsent.PROSENT,
    fasteDager: {
        friday: { minutes: '10', hours: '2' },
    },
    enkeltdager: { '2021-02-01': { hours: '2', minutes: '0', percentage: 20 } },
    prosentAvNormalt: '20',
};

const periode: DateRange = {
    from: ISODateToDate(periodeFromDateString),
    to: ISODateToDate(periodeToDateString),
};

const normalarbeidstid: NormalarbeidstidSøknadsdata = {
    type: NormalarbeidstidType.ulikeUker,
    erFasteUkedager: false,
    erLiktHverUke: false,
    timerPerUkeISnitt: 20,
};

describe('cleanupArbeidIPeriode', () => {
    it('Fjerner informasjon dersom en ikke jobber i perioden ', () => {
        const result = cleanupArbeidIPeriode(
            { ...arbeidIPeriode, arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær },
            normalarbeidstid,
            periode
        );
        expect(result.arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.heltFravær);
        expect(Object.keys(result).length).toBe(1);
    });
    it('Fjerner informasjon dersom en jobber som vanlig i perioden ', () => {
        const result = cleanupArbeidIPeriode(
            { ...arbeidIPeriode, arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig },
            normalarbeidstid,
            periode
        );
        expect(result.arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.somVanlig);
        expect(Object.keys(result).length).toBe(1);
    });
});
