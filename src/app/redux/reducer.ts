import { AppState } from '../types/AppState';
import { Actions, UpdateStateActionInterface } from './actions';

const getDefaultAppState = (): AppState => ({
    locale: 'nb',
    harGodkjentVilkår: false
});

const appReducer = (state = getDefaultAppState(), action: UpdateStateActionInterface): AppState => {
    switch (action.type) {
        case Actions.UPDATE_STATE:
            return {
                ...state,
                ...action.statePartial
            };
    }
    return state;
};

export default appReducer;
