import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { BarnRelasjon, RegistrerteBarn, ÅrsakManglerIdentitetsnummer } from '../../types';
import { BarnetSøknadenGjelderApiData, SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';

const getBarnetSøknadenGjelderApiData = (
    barn: RegistrerteBarn[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetSøknadenGjelder: string | undefined,
    barnetsFødselsdato: string | undefined,
    årsakManglerIdentitetsnummer: ÅrsakManglerIdentitetsnummer | undefined
): BarnetSøknadenGjelderApiData => {
    const emptyBarn = {
        navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
        fødselsnummer: barnetsFødselsnummer || null,
        aktørId: null,
        fødselsdato: barnetsFødselsdato ? barnetsFødselsdato : null,
        sammeAdresse: null,
        årsakManglerIdentitetsnummer: årsakManglerIdentitetsnummer ? årsakManglerIdentitetsnummer : undefined,
    };

    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktørId === barnetSøknadenGjelder);
        if (barnChosenFromList) {
            const { fornavn, etternavn, mellomnavn, aktørId, harSammeAdresse: sammeAdresse } = barnChosenFromList;
            return {
                navn: formatName(fornavn, etternavn, mellomnavn),
                fødselsnummer: null,
                aktørId,
                fødselsdato: formatDateToApiFormat(barnChosenFromList.fødselsdato),
                sammeAdresse: sammeAdresse || null,
            };
        }
        return emptyBarn;
    } else {
        return emptyBarn;
    }
};

type BarnApiData = Pick<SøknadApiData, 'barn' | 'barnRelasjon' | 'barnRelasjonBeskrivelse' | '_barnetHarIkkeFnr'>;

export const getBarnApiData = (
    {
        barnetsNavn,
        barnetsFødselsnummer,
        barnetSøknadenGjelder,
        relasjonTilBarnet,
        relasjonTilBarnetBeskrivelse,
        barnetHarIkkeFnr,
        barnetsFødselsdato,
        årsakManglerIdentitetsnummer,
    }: SøknadFormData,
    barn: RegistrerteBarn[]
): BarnApiData => {
    const barnObject: BarnetSøknadenGjelderApiData = getBarnetSøknadenGjelderApiData(
        barn,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetSøknadenGjelder,
        barnetsFødselsdato,
        årsakManglerIdentitetsnummer
    );
    const gjelderAnnetBarn = barnObject.aktørId === null;
    return {
        barn: barnObject,
        barnRelasjon: gjelderAnnetBarn ? relasjonTilBarnet : undefined,
        barnRelasjonBeskrivelse:
            gjelderAnnetBarn && relasjonTilBarnet === BarnRelasjon.ANNET ? relasjonTilBarnetBeskrivelse : undefined,
        _barnetHarIkkeFnr: barnetHarIkkeFnr,
    };
};
