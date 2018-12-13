import { connect } from 'react-redux';
import { AppState } from '../../../../types/AppState';
import {
    default as WelcomingPage,
    WelcomingPageFunctionProps,
    WelcomingPageStateProps
} from '../../../../components/pages/welcoming-page/WelcomingPage';
import Dispatch from '../../../../types/Dispatch';
import { updateState } from '../../actions';

const mapStateToProps = (state: AppState): WelcomingPageStateProps => ({
    harGodkjentVilkår: state.harGodkjentVilkår
});

const mapDispatchToProps = (dispatch: Dispatch): WelcomingPageFunctionProps => ({
    updateHarGodkjentVilkår: (harGodkjentVilkår: boolean) => dispatch(updateState({ harGodkjentVilkår }))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WelcomingPage);
