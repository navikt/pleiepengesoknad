import * as React from 'react';
import bemHelper from '../../utils/bemHelper';
import './poster.less';

const bem = bemHelper('poster');
const Poster: React.FunctionComponent = ({ children }) => <div className={bem.className}>{children}</div>;

export default Poster;
