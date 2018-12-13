import { AppState } from '../types/AppState';

export enum Actions {
    'UPDATE_STATE' = 'updateState'
}

export interface UpdateStateActionInterface {
    type: Actions.UPDATE_STATE;
    statePartial: Partial<AppState>;
}

export const updateState = (statePartial: Partial<AppState>): UpdateStateActionInterface => ({
    type: Actions.UPDATE_STATE,
    statePartial
});
