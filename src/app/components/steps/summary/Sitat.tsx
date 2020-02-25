import React from 'react';

interface Props {}

const Sitat: React.FunctionComponent<Props> = ({ children }) => (
    <div style={{ paddingLeft: '.5rem', margin: '0.5rem 0', borderLeft: '2px solid #C6C2BF', fontStyle: 'italic' }}>
        {children}
    </div>
);

export default Sitat;
