import * as React from 'react';
import ScanningIcon from '../scanning-icon/ScanningIcon';
import StatusIkon from '../status-icon/StatusIcon';
import bemHelper from '../../utils/bemUtils';
import './pictureScanningGuide.less';
import Lenkepanel from "nav-frontend-lenkepanel/lib";

const bem = bemHelper('pictureScanningGuide');

const PictureScanningGuide = () => {
  const svgIconSize = 100;
  return (
    <div className={bem.block}>
      <h3>Bra og dårlige eksempler på bilder av legeerklæring</h3>
      <div className={bem.element('body')}>
        <div className={bem.element('cell')}>
          <ScanningIcon status="good" size={svgIconSize} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="suksess"/><strong>Bra</strong></p>
            <span>Legeerklæringen fyller hele bildet</span>
          </div>
        </div>
        <div className={bem.element('cell')}>
          <ScanningIcon status="keystone" size={svgIconSize} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="feil"/><strong>Dårlig</strong></p>
            <span>Bildet er ikke tatt overfra</span>
          </div>
        </div>
        <div className={bem.element('cell')}>
          <ScanningIcon status="horizontal" size={svgIconSize} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="feil"/><strong>Dårlig</strong></p>
            <span>Bildet har ikke riktig retning</span>
          </div>
        </div>
        <div className={bem.element('cell')}>
          <ScanningIcon status="shadow" size={svgIconSize} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="feil"/><strong>Dårlig</strong></p>
            <span>Bildet har skygge oppå legeerkæring</span>
          </div>
        </div>
      </div>
      <Lenkepanel tittelProps="normaltekst" href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/relatert-informasjon/ta-bilde-av-vedleggene-med-mobilen">Mer hjelp til opplasting av vedlegg.</Lenkepanel>
    </div>
  );
};
export default PictureScanningGuide;
