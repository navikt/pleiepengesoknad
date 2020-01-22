import * as React from 'react';
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import ScanningIcon from '../scanning-icon/ScanningIcon';
import bemHelper from '../../utils/bemUtils';
import intlHelper from '../../utils/intlUtils';
import PictureScanningExample from './PictureScanningExample';
import { Undertittel, Systemtittel } from 'nav-frontend-typografi';

import './pictureScanningGuide.less';

const bem = bemHelper('pictureScanningGuide');

const PictureScanningGuide: React.FunctionComponent = () => {
    const intl = useIntl();
    const svgIconHeight = 100;
    return (
        <div className={bem.block}>
            <Systemtittel className={bem.element('title')}>
                <FormattedMessage id="psg.innholdstittel" />
            </Systemtittel>

            <Undertittel className={bem.element('title')}>
                <FormattedMessage id="psg.section1.tittel" />
            </Undertittel>
            <FormattedHTMLMessage tagName="ul" id="psg.section1.liste" />

            <Undertittel className={bem.element('title')}>
                <FormattedMessage id="psg.section2.tittel" />
            </Undertittel>

            <FormattedHTMLMessage tagName="ul" id="psg.section2.liste" />
            <div className={bem.element('examples')}>
                <Undertittel tag="h3" className={bem.element('title')}>
                    <FormattedMessage id="psg.icon.heading" />
                </Undertittel>
                <div className={bem.element('body')}>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="good" height={svgIconHeight} />}
                            status="suksess"
                            statusText={intlHelper(intl, 'psg.good')}
                            description={intlHelper(intl, 'psg.icon.label.good')}
                        />
                    </div>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="keystone" height={svgIconHeight} />}
                            status="feil"
                            statusText={intlHelper(intl, 'psg.bad')}
                            description={intlHelper(intl, 'psg.icon.label.keystone')}
                        />
                    </div>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="horizontal" height={svgIconHeight} />}
                            status="feil"
                            statusText={intlHelper(intl, 'psg.bad')}
                            description={intlHelper(intl, 'psg.icon.label.horizontal')}
                        />
                    </div>
                    <div className={bem.element('cell')}>
                        <PictureScanningExample
                            image={<ScanningIcon status="shadow" height={svgIconHeight} />}
                            status="feil"
                            statusText={intlHelper(intl, 'psg.bad')}
                            description={intlHelper(intl, 'psg.icon.label.shadow')}
                        />
                    </div>
                </div>
                <Lenke target="_blank" href={intlHelper(intl, 'psg.lenkepanel.url')}>
                    <FormattedMessage id="psg.lenkepanel.text" />
                </Lenke>
            </div>
        </div>
    );
};
export default PictureScanningGuide;
