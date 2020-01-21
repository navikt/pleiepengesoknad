import * as React from 'react';
import { connect } from 'formik';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { removeElementFromArray } from 'common/utils/listUtils';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { deleteFile } from '../../api/api';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import Box from 'common/components/box/Box';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Attachment } from 'common/types/Attachment';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import { Panel } from 'nav-frontend-paneler';

interface LegeerklæringAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps & ConnectedFormikProps<AppFormField>;

const InfoText = () => <Panel><Element><FormattedHTMLMessage id="vedleggsliste.legeerklæringLastetOppSjekkliste" /></Element></Panel>;

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    formik: { values, setFieldValue },
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const legeerklæring: Attachment[] = values[AppFormField.legeerklæring].filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(legeerklæring)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenLegeerklæringLastetOpp" />
            </Normaltekst>
        );
        if (wrapNoAttachmentsInBox) {
            return <Box margin="m">{noAttachmentsText}</Box>;
        }
        return noAttachmentsText;
    }

    if (includeDeletionFunctionality) {
        return (
            <>
                <AttachmentListWithDeletion
                    attachments={legeerklæring}
                    onRemoveAttachmentClick={(attachment: Attachment) => {
                        attachment.pending = true;
                        setFieldValue(AppFormField.legeerklæring, legeerklæring);
                        deleteFile(attachment.url!).then(
                            () => {
                                setFieldValue(AppFormField.legeerklæring, removeElementFromArray(attachment, legeerklæring));
                            },
                            () => {
                                setFieldValue(AppFormField.legeerklæring, removeElementFromArray(attachment, legeerklæring));
                            }
                        );
                    }}
                />
                <Box margin="m" padBottom="l">
                    <InfoText/>
                </Box>
            </>
        );
    } else {
        return (
            <>
                <AttachmentList attachments={legeerklæring}/>
                <Box margin="m" padBottom="l">
                    <InfoText/>
                </Box>
            </>
        );
    }
};

export default connect<LegeerklæringAttachmentListProps, AppFormField>(LegeerklæringAttachmentList);
