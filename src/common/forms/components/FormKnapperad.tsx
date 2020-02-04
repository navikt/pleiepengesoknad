import React from 'react';
import Knapperad from 'common/components/knapperad/Knapperad';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    onSubmit: () => void;
    onCancel: () => void;
}

const FormKnapperad: React.FunctionComponent<Props> = ({ onSubmit, onCancel }) => (
    <Knapperad style="stretch">
        <Knapp type="hoved" htmlType="button" onClick={onSubmit}>
            Ok
        </Knapp>
        <Knapp type="flat" htmlType="button" onClick={onCancel}>
            Avbryt
        </Knapp>
    </Knapperad>
);

export default FormKnapperad;
