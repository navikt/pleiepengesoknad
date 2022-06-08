import { OpptjeningUtland } from '@navikt/sif-common-forms/lib/opptjening-utland';

export interface HarIkkeOpptjeningUtlandSøknadsdata {
    type: 'harOpptjeningUtland';
    opptjeningUtland: OpptjeningUtland[];
}

export interface HarIkkeIkkeOpptjeningUtlandSøknadsdata {
    type: 'harIkkeIkkeOpptjeningUtland';
}

export type OpptjeningUtlandSøknadsdata = HarIkkeOpptjeningUtlandSøknadsdata | HarIkkeIkkeOpptjeningUtlandSøknadsdata;
