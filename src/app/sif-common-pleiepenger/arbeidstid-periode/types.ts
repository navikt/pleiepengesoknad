import { DurationWeekdays } from '@navikt/sif-common-utils/lib';

export type ArbeidstidPeriodeData = {
    fom: Date;
    tom: Date;
    prosent?: string;
    tidFasteDager?: DurationWeekdays;
};
