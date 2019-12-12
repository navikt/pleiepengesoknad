import * as React from 'react';
import bemHelper from 'common/utils/bemUtils';
import './unstyledList.less';

const bem = bemHelper('unstyledList');

const UnstyledList: React.FunctionComponent = ({ children }) => <ul className={bem.block}>{children}</ul>;

export default UnstyledList;
