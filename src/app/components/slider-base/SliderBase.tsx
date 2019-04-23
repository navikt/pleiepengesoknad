import * as React from 'react';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import './sliderBase.less';

interface SliderBaseProps {
    name: string;
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const SliderBase: React.FunctionComponent<SliderBaseProps> = ({ label, ...otherProps }) => (
    <CustomInputElement label={label}>
        <input className="slider" type="range" {...otherProps} />
    </CustomInputElement>
);

export default SliderBase;
