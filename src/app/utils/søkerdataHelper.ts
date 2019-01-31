import { Søkerdata } from '../types/Søkerdata';

export const harRegistrerteBarn = ({ barn }: Søkerdata) => barn && barn.length > 0;
