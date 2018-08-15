import ArticleDraft from '../schema/article-draft.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import Document from '../../models/Document.mjs';
import {serializeDocument} from '../../helpers/documentSerializer.mjs';
import createNewEmpty from '../../helpers/createEditorDocument.mjs';

export default {
  getAllArticleDrafts: () => {
    return ArticleDraft.find({});
  },
  createDraft: async ethereumAddress => {
    //createNewEmpty()
    const document = new Document(serializeDocument(createNewEmpty()));
    document.authors.push(ethereumAddress);

    const newDraft = new ArticleDraft({
      ownerAddress: ethereumAddress,
      document
    });

    let dbDraft = await newDraft.save();
    if (!dbDraft) {
      errorThrower.noCreationOfEntry('Article Draft');
    }

    return dbDraft;
  },

  getDraftsOfUser: async (userAddress) => {
    let drafts = await ArticleDraft.find({
      ownerAddress: userAddress
    });
    if(!drafts) {
      errorThrower.noEntryFoundById('ethereumAddress');
    }
    return drafts;
  },

  getDraftById: async (userAddress, draftId) => {
    let draft = await ArticleDraft.findById(draftId);
    if (!draft) {
      errorThrower.noEntryFoundById(draftId);
    }
    if (draft.ownerAddress !== userAddress) {
      errorThrower.notCorrectEthereumAddress();
    }
    return draft;
  }
};
