import * as React from 'react';
import bemHelper from '../../utils/bemHelper';
import './plainList.less';

const bem = bemHelper('plainList');

const PlainList: React.FunctionComponent = ({ children }) => <ul className={bem.className}>{children}</ul>;

export default PlainList;
