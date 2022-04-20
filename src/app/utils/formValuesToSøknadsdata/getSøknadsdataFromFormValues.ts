import { SøknadFormData } from '../../types/SøknadFormData';
import { Søknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getSøknadsperiodeFromFormData } from '../formDataUtils';
import { extractArbeidSøknadsdata } from './extractArbeidSøknadsdata';
import { extractBarnSøknadsdata } from './extractBarnSøknadsdata';
import { extractFerieuttakIPeriodenSøknadsdataSøknadsdata } from './extractFerieuttakIPeriodenSøknadsdata';
import { extractMedlemskapSøknadsdata } from './extractMedlemskapSøknadsdata';
import { extractMedsøkerSøknadsdata } from './extractMedsøkerSøknadsdata';
import { extractUtenlandsoppholdIPeriodenSøknadsdata } from './extractUtenlandsoppholdIPeriodenSøknadsdata';

export const getSøknadsdataFromFormValues = (values: SøknadFormData): Søknadsdata => {
    const søknadsperiode = getSøknadsperiodeFromFormData(values);
    if (søknadsperiode === undefined) {
        return {};
    }
    const søknadsdata: Søknadsdata = {
        søknadsperiode,
        barn: extractBarnSøknadsdata(values),
        medsøker: extractMedsøkerSøknadsdata(values),
        utenlandsoppholdIPerioden: extractUtenlandsoppholdIPeriodenSøknadsdata(values),
        ferieuttakIPerioden: extractFerieuttakIPeriodenSøknadsdataSøknadsdata(values),
        arbeid: extractArbeidSøknadsdata(values, søknadsperiode),
        medlemskap: extractMedlemskapSøknadsdata(values),
    };
    return søknadsdata;
};
