import ArticleVersion from '../schema/article-version';
import Document from '../../models/Document';
import {serializeDocument} from '../../helpers/documentSerializer';
import createNewEmpty from '../../helpers/createEditorDocument';
import errorThrower from '../helpers/error-thrower.mjs';
import ArticleVersionStates from '../schema/article-version-state-enum.mjs';

export default {
  getAllArticleVersions: () => {
    return ArticleVersion.find({});
  },
  createArticleVersion: async ethereumAddress => {
    const document = new Document(serializeDocument(createNewEmpty()));
    document.authors.push(ethereumAddress);

    const timestamp = new Date().getTime();
    const version = new ArticleVersion({
      ownerAddress: ethereumAddress,
      document,
      timestamp
    });

    let dbArticleVersion = await version.save();
    if(!dbArticleVersion) errorThrower.noCreationOfEntry('Article Version');
    return dbArticleVersion;
  },

  /**
   * Gets some infos about all the article version being in state "DRAFT"
   * for a specific user given its ethereum address
   * @param userAddress
   * @returns {Promise<Array>}
   */
  getDraftsOfUser: async (userAddress) => {
    let drafts = await ArticleVersion.find({
      ownerAddress: userAddress,
      articleVersionState: ArticleVersionStates.DRAFT
    });
    if (!drafts) {
      errorThrower.noEntryFoundById('EthereumAddress');
    }

    let draftInfos = [];
    drafts.map( draft => {
      let draftInfo = {
        document: {}
      };
      draftInfo._id = draft._id;
      draftInfo.document.title = draft.document.title;
      draftInfo.document.authors = draft.document.authors;
      draftInfo.timestamp = draft.timestamp;
      draftInfos.push(draftInfo);
    });
    return draftInfos;
  },

  /**
   * Returns the article-version, but only if it is still in state 'DRAFT'
   * otherwise error
   * @param userAddress
   * @param articleVersionID
   * @returns {Promise<void>}
   */
  getArticleVersionDraftById: async (userAddress, articleVersionID) => {
    const articleVersion = await ArticleVersion.findById(articleVersionID);
    if(!articleVersion) errorThrower.noEntryFoundById(articleVersionID);

    if(articleVersion.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();
    if(articleVersion.articleVersionState !== ArticleVersionStates.DRAFT) {
      let error = new Error('Submitted ArticleVersion is not on state \'DRAFT\'');
      error.status = 400;
      throw error;
    }
    return articleVersion;
  },

  updateDraftById: async (userAddress, articleVersionId, document) => {
    // error checking
    let articleVersion = await ArticleVersion.findById(articleVersionId);
    if (!articleVersion) errorThrower.noEntryFoundById(articleVersionId);
    if (articleVersion.articleVersionState !== ArticleVersionStates.DRAFT)
      errorThrower.notAnArticleDraft(articleVersionId);
    if (articleVersion.ownerAddress !== userAddress) errorThrower.notCorrectEthereumAddress();

    // add new document variables
    for (let property in document) {
      if (document.hasOwnProperty(property)) {
        articleVersion.document[property] = document[property];
      }
    }

    articleVersion.timestamp = new Date().getTime();
    await ArticleVersion.findByIdAndUpdate(articleVersionId, articleVersion);
    return 'Successful updated Article Version with ID: ' + articleVersionId;
  }
};