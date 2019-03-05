import React, { Component } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import bemUtils from '../../utils/bemUtils';
import './validationErrorSummaryBase.less';

export interface ValidationSummaryError {
    name: string;
    message: string;
}

export interface ValidationErrorSummaryBaseProps {
    errors: ValidationSummaryError[];
    title: string;
    className?: string;
}

const bem = bemUtils('validationErrorSummary');
class ValidationErrorSummaryBase extends Component<ValidationErrorSummaryBaseProps> {
    render() {
        const { errors, title, className } = this.props;
        const listItems = errors.map((error) => {
            return (
                <li key={error.name}>
                    <a
                        className={bem.element('link')}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementsByName(error.name)[0].focus();
                        }}>
                        {error.message}
                    </a>
                </li>
            );
        });

        return (
            <article tabIndex={-1} className={`${bem.className} ${className}`}>
                <Systemtittel>{title}</Systemtittel>
                <ul className={bem.element('list')}>{listItems}</ul>
            </article>
        );
    }
}

export default ValidationErrorSummaryBase;
