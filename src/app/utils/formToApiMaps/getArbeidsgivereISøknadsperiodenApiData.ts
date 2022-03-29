import { ArbeidsgiverApiData, SøknadApiData } from '../../types/SøknadApiData';
import { ArbeidsgivereSøknadsdata } from '../../types/Søknadsdata';
import { getArbeidsgiverApiData } from '../søknadsdataToApiData/getArbeidsgiverApiData';

export const getArbeidsgivereISøknadsperiodenApiData = (
    arbeidsgivere: ArbeidsgivereSøknadsdata | undefined
): Pick<SøknadApiData, 'arbeidsgivere'> => {
    if (!arbeidsgivere || arbeidsgivere.size === 0) {
        return {
            arbeidsgivere: [],
        };
    }
    const arbeidsgivereApiData: ArbeidsgiverApiData[] = [];
    arbeidsgivere.forEach((arbeidsgiver) => {
        arbeidsgivereApiData.push(getArbeidsgiverApiData(arbeidsgiver));
    });
    return {
        arbeidsgivere: arbeidsgivereApiData,
    };
};
