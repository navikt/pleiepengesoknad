import { SøknadApiData } from '../../types/SøknadApiData';
import { OmBarnetSøknadsdata } from '../../types/Søknadsdata';
import { RegistrerteBarn } from 'app/types';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

export type BarnApiData = Pick<
    SøknadApiData,
    'barn' | 'barnRelasjon' | 'barnRelasjonBeskrivelse' | '_barnetHarIkkeFnr'
>;

export const getBarnApiDataFromSøknadsdata = (
    registrerteBarn: RegistrerteBarn[],
    omBarnetSøknadsdata?: OmBarnetSøknadsdata
): BarnApiData => {
    if (omBarnetSøknadsdata === undefined) {
        throw Error('omBarnetSøknadsdata undefined');
    }

    switch (omBarnetSøknadsdata?.type) {
        case 'registrerteBarn':
            const barnChosenFromList = registrerteBarn.find(
                (currentBarn) => currentBarn.aktørId === omBarnetSøknadsdata.barnetSøknadenGjelder
            );

            if (barnChosenFromList === undefined) {
                throw Error('barnChosenFromList undefined');
            }
            const { fornavn, etternavn, mellomnavn, aktørId, harSammeAdresse: sammeAdresse } = barnChosenFromList;

            return {
                barn: {
                    navn: formatName(fornavn, etternavn, mellomnavn),
                    aktørId,
                    fødselsdato: formatDateToApiFormat(barnChosenFromList.fødselsdato),
                    sammeAdresse: sammeAdresse || null,
                    fødselsnummer: null,
                },
            };
        case 'annetBarn':
            return {
                barn: {
                    navn: omBarnetSøknadsdata.barnetsNavn,
                    fødselsnummer: omBarnetSøknadsdata.barnetsFødselsnummer,
                    fødselsdato: null,
                    aktørId: null,
                    sammeAdresse: null,
                },
                barnRelasjon: omBarnetSøknadsdata.relasjonTilBarnet,
                barnRelasjonBeskrivelse: omBarnetSøknadsdata.relasjonTilBarnetBeskrivelse,
            };

        case 'annetBarnUtenFnr':
            return {
                barn: {
                    navn: omBarnetSøknadsdata.barnetsNavn,
                    årsakManglerIdentitetsnummer: omBarnetSøknadsdata.årsakManglerIdentitetsnummer,
                    fødselsdato: omBarnetSøknadsdata.barnetsFødselsdato,
                    fødselsnummer: null,
                    aktørId: null,
                    sammeAdresse: null,
                },
                barnRelasjon: omBarnetSøknadsdata.relasjonTilBarnet,
                barnRelasjonBeskrivelse: omBarnetSøknadsdata.relasjonTilBarnetBeskrivelse,
                _barnetHarIkkeFnr: true,
            };
    }
};
