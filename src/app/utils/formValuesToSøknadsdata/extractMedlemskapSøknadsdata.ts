import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import { MedlemskapSøknadsdata } from '../../types/Søknadsdata';

export const extractMedlemskapSøknadsdata = ({
    harBoddUtenforNorgeSiste12Mnd,
    utenlandsoppholdSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
    utenlandsoppholdNeste12Mnd,
}: SøknadFormData): MedlemskapSøknadsdata | undefined => {
    if (harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO && skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO) {
        return {
            type: 'IkkeHarBodIkkeSkalBo',
            harBoddUtenforNorgeSiste12Mnd: false,
            skalBoUtenforNorgeNeste12Mnd: false,
        };
    }

    if (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO) {
        return {
            type: 'HarBod',
            harBoddUtenforNorgeSiste12Mnd: true,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd: false,
        };
    }
    if (harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO && skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES) {
        return {
            type: 'SkalBo',
            harBoddUtenforNorgeSiste12Mnd: false,
            skalBoUtenforNorgeNeste12Mnd: true,
            utenlandsoppholdNeste12Mnd,
        };
    }

    if (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES && skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES) {
        return {
            type: 'HarBodSkalBo',
            harBoddUtenforNorgeSiste12Mnd: true,
            utenlandsoppholdSiste12Mnd,
            skalBoUtenforNorgeNeste12Mnd: true,
            utenlandsoppholdNeste12Mnd,
        };
    }

    return undefined;
    // throw 'extractMedlemskapSøknadsdata: ugyldig tilstand';
};
