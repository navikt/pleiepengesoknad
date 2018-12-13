import { connect } from 'react-redux';
import { AppState } from '../../../types/AppState';
import { default as IntlProvider, IntlProviderProps } from '../../../components/intl-provider/IntlProvider';

const mapStateToProps = (state: AppState): IntlProviderProps => ({
    locale: state.locale
});

export default connect(mapStateToProps)(IntlProvider);
