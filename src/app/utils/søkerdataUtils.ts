import { Søkerdata } from '../types/Søkerdata';

export const harRegistrerteBarn = ({ barn }: Søkerdata) => {
    return barn && barn.length > 0;
};
