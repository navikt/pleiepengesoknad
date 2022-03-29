import { ArbeidsgiverApiData, SøknadApiData } from '../../types/SøknadApiData';
import { ArbeidsgivereSøknadsdata } from '../../types/Søknadsdata';
import { getArbeidsgiverApiDataFromSøknadsdata } from './getArbeidsgiverApiDataFromSøknadsdata';

export const getArbeidsgivereSøknadsdataFromSøknadsdata = (
    arbeidsgivere: ArbeidsgivereSøknadsdata | undefined
): Pick<SøknadApiData, 'arbeidsgivere'> => {
    if (!arbeidsgivere || arbeidsgivere.size === 0) {
        return {
            arbeidsgivere: [],
        };
    }
    const arbeidsgivereApiData: ArbeidsgiverApiData[] = [];
    arbeidsgivere.forEach((arbeidsgiver) => {
        arbeidsgivereApiData.push(getArbeidsgiverApiDataFromSøknadsdata(arbeidsgiver));
    });
    return {
        arbeidsgivere: arbeidsgivereApiData,
    };
};
