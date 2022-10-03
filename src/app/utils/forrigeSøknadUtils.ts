import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { InnsendtSøknadInnhold } from '../types/InnsendtSøknad';

export const forrigeSøknadErGyldig = (søknad: InnsendtSøknadInnhold): boolean => {
    if (dayjs(søknad.mottatt).isBefore(ISODateToDate('2022-06-01'), 'day')) {
        console.log('søknad.mottatt before 2022-06-01');
        return false;
    }
    const maxAlderDato = dayjs().subtract(10, 'weeks'); /** TODO - grense må vurderes */
    if (dayjs(søknad.mottatt).isBefore(maxAlderDato, 'day')) {
        console.log('søknad.mottatt before maxAlderDato');
        console.log('maxAlderDato: ', maxAlderDato);
        return false;
    }
    return true;
};
