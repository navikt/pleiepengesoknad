import { createStore } from 'redux';
import { AppState } from '../types/AppState';

const reducer = (state = {}): AppState => {
    return {
        locale: 'nb'
    };
};

const store = createStore(
    reducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
