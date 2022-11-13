import { FrilansereSøknadsdata } from '../../types/søknadsdata/arbeidNyFrilansSøknadsdata';
import { FrilanserApiData, FrilanserOppdragApi } from '../../types/søknad-api-data/SøknadApiData';
import { OppdragsgivereSøknadsdata } from '../../types/søknadsdata/arbeidFrilansOppdragSøknadsdata';
import { getFrilansOppdragApiDataFromSøknadsdata } from './getFrilansOppdragApiDataFromSøknadsdata';
import { getNyFrilansApiDataFromSøknadsdata } from './getNyFrilansApiDataFromSøknadsdata';

export const getFrilansOppdragerApiDataFromSøknadsdata = (
    oppdragsgivere: OppdragsgivereSøknadsdata | undefined,
    nyFrilans: FrilansereSøknadsdata | undefined
): FrilanserOppdragApi => {
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

    const nyfrilansoppdrag: FrilanserApiData[] = [];
    nyFrilans &&
        nyFrilans.forEach((oppdrag) => {
            nyfrilansoppdrag.push(getNyFrilansApiDataFromSøknadsdata(oppdrag));
        });
    return { harInntektSomFrilanser: true, oppdrag: [...frilansOppdragApiData, ...nyfrilansoppdrag] };
};
