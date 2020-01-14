import * as React from 'react';
import ScanningIcon from '../scanning-icon/ScanningIcon';
import StatusIkon from '../status-icon/StatusIcon';
import bemHelper from '../../utils/bemUtils';
import './pictureScanningGuide.less';

const bem = bemHelper('pictureScanningGuide');

const PictureScanningGuide = () => {
  return (
    <div className={bem.block}>
      <h3>Bra og dårlige eksempler på bilder av legeerklæring</h3>
      <div className={bem.element('body')}>
        <div className={bem.element('cell')}>
          <ScanningIcon status="good" size={100} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="suksess"/><strong>Bra</strong></p>
            <span>Legeerklæringen fyller hele bildet</span>
          </div>
        </div>
        <div className={bem.element('cell')}>
          <ScanningIcon status="keystone" size={100} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="feil"/><strong>Dårlig</strong></p>
            <span>Bildet er ikke tatt overfra</span>
          </div>
        </div>
        <div className={bem.element('cell')}>
          <ScanningIcon status="horizontal" size={100} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="feil"/><strong>Dårlig</strong></p>
            <span>Bildet har ikke riktig retning</span>
          </div>
        </div>
        <div className={bem.element('cell')}>
          <ScanningIcon status="shadow" size={100} />
          <div className={bem.element('text-block')}>
            <p><StatusIkon status="feil"/><strong>Dårlig</strong></p>
            <span>Bildet har skygge oppå legeerkæring</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PictureScanningGuide;
