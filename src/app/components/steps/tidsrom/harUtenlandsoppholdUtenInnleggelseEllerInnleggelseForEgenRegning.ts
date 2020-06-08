import { Utenlandsopphold, UtenlandsoppholdÅrsak, } from 'common/forms/utenlandsopphold/types';
import { YesOrNo, } from 'common/types/YesOrNo';

const erOppholdMedInnlagtBarnForEgenRegning = (opphold: Utenlandsopphold): boolean =>
    opphold.erBarnetInnlagt === YesOrNo.YES && opphold.årsak === UtenlandsoppholdÅrsak.ANNET;

const erOppholdUtenInnlagtBarn = (opphold: Utenlandsopphold): boolean => opphold.erBarnetInnlagt === YesOrNo.NO;

const harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning = (
    utenlandsopphold: Utenlandsopphold[]
): boolean => {
    return (
        utenlandsopphold.filter(
            (opphold) => erOppholdMedInnlagtBarnForEgenRegning(opphold) || erOppholdUtenInnlagtBarn(opphold)
        ).length > 0
    );
};

export default harUtenlandsoppholdUtenInnleggelseEllerInnleggeleForEgenRegning;
