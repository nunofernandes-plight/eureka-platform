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
    if (!drafts) {
      errorThrower.noEntryFoundById('ethereumAddress');
    }

    let draftInfos = [];
    drafts.map( draft => {
      let draftInfo = {
        document: {}
      };
      draftInfo._id = draft._id;
      draftInfo.document.title = draft.document.title;
      draftInfo.document.authors = draft.document.authors;
      draftInfos.push(draftInfo);
    });
    return draftInfos;
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
  },

  /**
   * Update the doc by replacing the whole document with a new one
   * @param userAddress
   * @param draftId
   * @param document
   * @returns {Promise<*>}
   */
  updateDraftById: async (userAddress, draftId, document) => {
    let draft = await ArticleDraft.findById(draftId);
    if (!draft) {
      errorThrower.noEntryFoundById(draftId);
    }
    if (draft.ownerAddress !== userAddress) {
      errorThrower.notCorrectEthereumAddress();
    }

    draft.document = document;
    return await draft.save();
  },

  /**
   * Update the doc by changing only the vars provided by request
   */
  updateDraftVarsById: async (userAddress, draftId, document) => {
    let draft = await ArticleDraft.findById(draftId);
    if (!draft) {
      errorThrower.noEntryFoundById(draftId);
    }
    if (draft.ownerAddress !== userAddress) {
      errorThrower.notCorrectEthereumAddress();
    }

    for (let property in document) {
      if (document.hasOwnProperty(property)) {
        draft.document[property] = document[property];
      }
    }
    return await ArticleDraft.findByIdAndUpdate(draftId, draft);
  }
};
