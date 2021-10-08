import { apiStringDateToDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { KvitteringInfo } from '../components/pleiepengesøknad-content/PleiepengesøknadContent';
import { isArbeidsgiverISøknadsperiodeApiData, PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { Søkerdata } from '../types/Søkerdata';

export type KvitteringApiData = Pick<PleiepengesøknadApiData, 'arbeidsgivere' | 'fraOgMed' | 'tilOgMed'>;

export const getKvitteringInfoFromApiData = (
    { arbeidsgivere, fraOgMed, tilOgMed }: KvitteringApiData,
    søkerdata: Søkerdata
): KvitteringInfo | undefined => {
    const arbeidsgivereISøknadsperiode = (arbeidsgivere || [])?.filter(isArbeidsgiverISøknadsperiodeApiData);
    if (arbeidsgivereISøknadsperiode.length > 0) {
        const { fornavn, mellomnavn, etternavn } = søkerdata.person;
        return {
            arbeidsgivere: arbeidsgivereISøknadsperiode,
            fom: apiStringDateToDate(fraOgMed),
            tom: apiStringDateToDate(tilOgMed),
            søkernavn: formatName(fornavn, etternavn, mellomnavn),
        };
    }
    return undefined;
};
