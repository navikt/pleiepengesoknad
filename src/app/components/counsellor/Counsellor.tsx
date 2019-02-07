import * as React from 'react';
import bemHelper from '../../utils/bemUtils';
import './counsellor.less';

const bem = bemHelper('counsellor');
const Counsellor: React.FunctionComponent = () => <div className={bem.className} />;

export default Counsellor;
