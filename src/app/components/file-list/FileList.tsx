import * as React from 'react';
import DeleteButton from '../delete-button/DeleteButton';
import './fileList.less';
import CustomSVG from '../custom-svg/CustomSVG';
import bemHelper from '../../utils/bemHelper';
import PlainList from '../plain-list/PlainList';
const attachmentIcon = require('../../../assets/attachment.svg').default;

interface FileListProps {
    files: File[];
    onRemoveFileClick: (file: File, e: React.SyntheticEvent) => void;
    deleteButtonAriaLabel: string;
}

const listElementBem = bemHelper(`fileListElement`);

const FileList: React.FunctionComponent<FileListProps> = ({ files, onRemoveFileClick, deleteButtonAriaLabel }) => (
    <PlainList>
        {files.map((file, index) => (
            <li className={listElementBem.className} key={file.name + index}>
                <span>
                    <CustomSVG iconRef={attachmentIcon} size={22} />
                    <div className={listElementBem.element('text')}>
                        {file.name} ({file.size})
                    </div>
                </span>
                <DeleteButton ariaLabel={deleteButtonAriaLabel} onClick={(e) => onRemoveFileClick(file, e)}>
                    Fjern fil
                </DeleteButton>
            </li>
        ))}
    </PlainList>
);

export default FileList;
