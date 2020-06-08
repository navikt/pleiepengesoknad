import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useFormikContext } from 'formik';
import Panel from 'nav-frontend-paneler';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from 'common/components/attachment-list/AttachmentList';
import Box from 'common/components/box/Box';
import { Attachment } from 'common/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import { removeElementFromArray } from 'common/utils/listUtils';
import { deleteFile } from '../../api/api';
import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

interface LegeerklæringAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps;

const InfoText = () => (
    <Panel>
        <Element>
            <FormattedMessage id="vedleggsliste.legeerklæringLastetOppSjekkliste.1" />
            <br />
            <FormattedMessage id="vedleggsliste.legeerklæringLastetOppSjekkliste.2" />
        </Element>
    </Panel>
);

const LegeerklæringAttachmentList = ({ wrapNoAttachmentsInBox, includeDeletionFunctionality }: Props) => {
    const { values, setFieldValue } = useFormikContext<PleiepengesøknadFormData>();
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
                        if (attachment.url) {
                            deleteFile(attachment.url).then(
                                () => {
                                    setFieldValue(
                                        AppFormField.legeerklæring,
                                        removeElementFromArray(attachment, legeerklæring)
                                    );
                                },
                                () => {
                                    setFieldValue(
                                        AppFormField.legeerklæring,
                                        removeElementFromArray(attachment, legeerklæring)
                                    );
                                }
                            );
                        }
                    }}
                />
                <Box margin="m" padBottom="l">
                    <InfoText />
                </Box>
            </>
        );
    } else {
        return <AttachmentList attachments={legeerklæring} />;
    }
};

export default connect<LegeerklæringAttachmentListProps, AppFormField>(LegeerklæringAttachmentList);
