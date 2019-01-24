import React, { Component } from 'react';
import classNames from 'classnames';
import { Systemtittel } from 'nav-frontend-typografi';
import './validationErrorSummary.less';

const cls = (show: boolean, className?: string) =>
    classNames('validationErrorSummary', className, {
        'validationErrorSummary--visible': show
    });

interface ValidationError {
    name: string;
    message: string;
}

export interface ValidationErrorSummaryProps {
    show: boolean;
    errors: ValidationError[];
    title: string;
    className?: string;
}

class ValidationErrorSummary extends Component<ValidationErrorSummaryProps> {
    render() {
        const { className, show, errors, title, ...other } = this.props;
        const listItems = errors.map((error) => {
            const link = '#' + error.name; // eslint-disable-line prefer-template
            return (
                <li key={error.name}>
                    <a className="validationErrorSummary__link" href={link}>
                        {error.message}
                    </a>
                </li>
            );
        });

        return (
            <article tabIndex={-1} className={cls(show, className)} {...other}>
                <Systemtittel>{title}</Systemtittel>
                <ul className="validationErrorSummary__list">{listItems}</ul>
            </article>
        );
    }
}

export default ValidationErrorSummary;
