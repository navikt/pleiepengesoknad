import { FrilansereSøknadsdata } from '../../types/søknadsdata/arbeidNyFrilansSøknadsdata';
import { FrilanserApiData, FrilanserOppdragApiData } from '../../types/søknad-api-data/SøknadApiData';
import { FrilansoppdragsgivereSøknadsdata } from '../../types/søknadsdata/arbeidFrilansOppdragSøknadsdata';
import { getFrilansOppdragApiDataFromSøknadsdata } from './getFrilansOppdragApiDataFromSøknadsdata';
import { getNyFrilansApiDataFromSøknadsdata } from './getNyFrilansApiDataFromSøknadsdata';

export const getFrilansOppdragerApiDataFromSøknadsdata = (
    oppdragsgivere: FrilansoppdragsgivereSøknadsdata | undefined,
    nyFrilans: FrilansereSøknadsdata | undefined
): FrilanserOppdragApiData => {
    //TODO
    if ((!oppdragsgivere || oppdragsgivere.size === 0) && (!nyFrilans || nyFrilans.size === 0)) {
        return {
            harInntektSomFrilanser: false,
            oppdrag: [],
        };
    }
    const frilansOppdragApiData: FrilanserApiData[] = [];
    oppdragsgivere &&
        oppdragsgivere.forEach((oppdragsgiver) => {
            frilansOppdragApiData.push(getFrilansOppdragApiDataFromSøknadsdata(oppdragsgiver));
        });

    const nyttFrilansoppdrag: FrilanserApiData[] = [];
    nyFrilans &&
        nyFrilans.forEach((oppdrag) => {
            nyttFrilansoppdrag.push(getNyFrilansApiDataFromSøknadsdata(oppdrag));
        });
    return { harInntektSomFrilanser: true, oppdrag: [...frilansOppdragApiData, ...nyttFrilansoppdrag] };
};
