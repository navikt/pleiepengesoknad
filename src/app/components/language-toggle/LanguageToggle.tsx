import * as React from 'react';
import { injectIntl, InjectedIntlProps, InjectedIntl } from 'react-intl';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';
const { NedChevron } = require('nav-frontend-chevron');
import intlHelper from 'app/utils/intlUtils';
import 'nav-frontend-lenker-style';
import './languageToggle.less';
import { Locale } from 'app/types/Locale';
import NorwayFlagSVG from './NorwayFlagSVG';

interface Props {
    toggle: (locale: Locale) => void;
    locale: Locale;
}

const AvailableLocales: Locale[] = ['nb', 'nn'];

const renderMenuItem = (intl: InjectedIntl, locale: Locale) => {
    return (
        <li key={locale}>
            <MenuItem className="languageToggle__menu__item">
                <div className="languageToggle__button__flag">
                    <NorwayFlagSVG />
                </div>
                <div className="languageToggle__button__language" data-locale={locale}>
                    {intlHelper(intl, `locale.${locale}`)}
                </div>
            </MenuItem>
        </li>
    );
};

const LanguageToggle: React.StatelessComponent<Props & InjectedIntlProps> = ({
    intl,
    locale,
    toggle: toggleLanguage
}) => {
    const selectableOtherMenuLanguages: Locale[] = [...AvailableLocales].filter((code) => code !== locale) as Locale[];

    return (
        <div className="languageToggle">
            <Wrapper
                className="languageToggle__wrapper"
                onSelection={(element: JSX.Element[]) => toggleLanguage(element[1].props['data-locale'])}>
                <Button className="languageToggle__button">
                    <div className="languageToggle__button__flag">
                        <NorwayFlagSVG />
                    </div>
                    <div className="languageToggle__button__language">{intlHelper(intl, `locale.${locale}`)}</div>
                    <div>
                        <NedChevron />
                    </div>
                </Button>
                <Menu className="languageToggle__menu">
                    <ul>{selectableOtherMenuLanguages.map((code) => renderMenuItem(intl, code))}</ul>
                </Menu>
            </Wrapper>
        </div>
    );
};
export default injectIntl(LanguageToggle);
