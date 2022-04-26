import { SøknadFormData } from '../../types/SøknadFormData';
import { Søknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getHarVærtEllerErVernepliktigFromFormData, getSøknadsperiodeFromFormData } from '../formDataUtils';
import { extractArbeidSøknadsdata } from './extractArbeidSøknadsdata';
import { extractBarnSøknadsdata } from './extractBarnSøknadsdata';
import { extractBeredskapSøknadsdata } from './extractBeredskapSøknadsdata';
import { extractFerieuttakIPeriodenSøknadsdata } from './extractFerieuttakIPeriodenSøknadsdata';
import { extractMedlemskapSøknadsdata } from './extractMedlemskapSøknadsdata';
import { extractMedsøkerSøknadsdata } from './extractMedsøkerSøknadsdata';
import { extractNattevåkSøknadsdata } from './extractNattevåkSøknadsdata';
import { extractOmsorgstibudSøknadsdata } from './extractOmsorgstibudSøknadsdata';
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
        ferieuttakIPerioden: extractFerieuttakIPeriodenSøknadsdata(values),
        arbeid: extractArbeidSøknadsdata(values, søknadsperiode),
        harVærtEllerErVernepliktig: getHarVærtEllerErVernepliktigFromFormData(values),
        omsorgstibud: extractOmsorgstibudSøknadsdata(values, søknadsperiode),
        nattevåk: extractNattevåkSøknadsdata(values),
        beredskap: extractBeredskapSøknadsdata(values),
        medlemskap: extractMedlemskapSøknadsdata(values),
    };
    return søknadsdata;
};
