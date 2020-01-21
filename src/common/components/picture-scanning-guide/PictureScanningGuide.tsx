import * as React from 'react';
import {injectIntl, FormattedMessage, FormattedHTMLMessage, InjectedIntlProps} from 'react-intl';
import Lenke from 'nav-frontend-lenker';

import ScanningIcon from '../scanning-icon/ScanningIcon';
import StatusIkon from '../status-icon/StatusIcon';
import bemHelper from '../../utils/bemUtils';
import intlHelper from '../../utils/intlUtils';

import './pictureScanningGuide.less';

const bem = bemHelper('pictureScanningGuide');
type Props = InjectedIntlProps;

const PictureScanningGuide: React.FunctionComponent<Props> = ({intl}) => {
    const svgIconSize = 100;
    return (
        <>
            <FormattedHTMLMessage tagName="h2" id="psg.innholdstittel"/>
            <FormattedHTMLMessage tagName="h3" id="psg.section1.tittel"/>
            <FormattedHTMLMessage tagName="ul" id="psg.section1.liste"/>
            <FormattedHTMLMessage tagName="h3" id="psg.section2.tittel"/>
            <FormattedHTMLMessage tagName="ul" id="psg.section2.liste"/>
            <div className={bem.block}>
                <h3><FormattedMessage id="psg.icon.heading"/></h3>
                <div className={bem.element('body')}>
                    <div className={bem.element('cell')}>
                        <ScanningIcon status="good" size={svgIconSize}/>
                        <div className={bem.element('text-block')}>
                            <p><StatusIkon status="suksess"/><FormattedHTMLMessage tagName="strong" id="psg.good" /></p>
                        </div>
                        <div className={bem.element('text-block')}>
                            <FormattedHTMLMessage tagName="span" id="psg.icon.label.good" />
                        </div>
                    </div>
                    <div className={bem.element('cell')}>
                        <ScanningIcon status="keystone" size={svgIconSize}/>
                        <div className={bem.element('text-block')}>
                            <p><StatusIkon status="feil"/><FormattedHTMLMessage tagName="strong" id="psg.bad" /></p>
                        </div>
                        <div className={bem.element('text-block')}>
                            <FormattedHTMLMessage tagName="span" id="psg.icon.label.keystone" />
                        </div>
                    </div>
                    <div className={bem.element('cell')}>
                        <ScanningIcon status="horizontal" size={svgIconSize}/>
                        <div className={bem.element('text-block')}>
                            <p><StatusIkon status="feil"/><FormattedHTMLMessage tagName="strong" id="psg.bad" /></p>
                        </div>
                        <div className={bem.element('text-block')}>
                            <FormattedHTMLMessage tagName="span" id="psg.icon.label.horizontal" />
                        </div>
                    </div>
                    <div className={bem.element('cell')}>
                        <ScanningIcon status="shadow" size={svgIconSize}/>
                        <div className={bem.element('text-block')}>
                            <p><StatusIkon status="feil"/><FormattedHTMLMessage tagName="strong" id="psg.bad" /></p>
                        </div>
                        <div className={bem.element('text-block')}>
                            <FormattedHTMLMessage tagName="span" id="psg.icon.label.shadow" />
                        </div>
                    </div>
                </div>
                <Lenke ariaLabel="Mer hjelp til opplasting av bilde" target="_blank" href={intlHelper(intl, 'psg.lenkepanel.url')}>
                    <FormattedMessage id="psg.lenkepanel.text" />
                </Lenke>
            </div>
        </>
    );
};
export default injectIntl(PictureScanningGuide);
