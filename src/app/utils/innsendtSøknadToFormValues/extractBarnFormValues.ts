import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { RegistrerteBarn } from '../../types';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { InnsendtSøknadBarn } from '../../types/InnsendtSøknad';

type BarnFormValues = Pick<SøknadFormValues, SøknadFormField.barnetSøknadenGjelder>;

export const erBarnISøknadEtRegistrertBarn = (barn: InnsendtSøknadBarn, registrertBarn: RegistrerteBarn): boolean => {
    if (barn.aktørId) {
        return barn.aktørId === registrertBarn.aktørId;
    }
    if (barn.fødselsdato) {
        return barn.fødselsdato === dateToISODate(registrertBarn.fødselsdato);
    }
    return false;
};

export const extractBarnFormValues = (
    barnISøknad: InnsendtSøknadBarn,
    registrerteBarn: RegistrerteBarn[]
): BarnFormValues | undefined => {
    const barn = registrerteBarn.filter((registrertBarn) => erBarnISøknadEtRegistrertBarn(barnISøknad, registrertBarn));
    // Returner kun når det er bare én match, andre tilfeller er ikke tatt høyde for
    return barn.length === 1
        ? {
              barnetSøknadenGjelder: barn[0].aktørId,
          }
        : undefined;
};
