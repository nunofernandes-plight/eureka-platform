import Journal from '../schema/journal.mjs';
import {getJournalParameters} from '../../smartcontracts/methods/web3-platform-contract-methods.mjs';

export const getContractOwnerFromDB = async () => {
  const journal = await Journal.findById(1);
  return journal.contractOwner;
};

export const getJournal = () => {
  return Journal.findById(1);
};

export const saveJournalInformation = async contract => {
  let journal = await Journal.findById(1);
  const journalInformationFromSC = await getJournalParameters(contract);

  if (!journal) {
    journal = new Journal({
      _id: 1,
      contractAddress: contract.options.address,
      contractOwner: journalInformationFromSC._contractOwner,
      minAmountOfEditorApprovedReviews: journalInformationFromSC._minAmountOfEditorApprovedReviews,
      maxAmountOfRewardedEditorApprovedReviews: journalInformationFromSC._maxAmountOfRewardedEditorApprovedReviews,
      minAmountOfCommunityReviews: journalInformationFromSC._minAmountOfCommunityReviews,
      maxAmountOfRewardedCommunityReviews: journalInformationFromSC._maxAmountOfRewardedCommunityReviews,
      sciencemattersFoundationReward: journalInformationFromSC._sciencemattersFoundationReward,
      editorReward: journalInformationFromSC._editorReward,
      linkedArticlesReward: journalInformationFromSC._linkedArticlesReward,
      invalidationWorkReward: journalInformationFromSC._invalidationWorkReward,
      editorApprovedReviewerRewardPerReviewer: journalInformationFromSC._editorApprovedReviewerRewardPerReviewer,
      communityReviewerRewardPerReviewer: journalInformationFromSC._communityReviewerRewardPerReviewer,
      secondReviewerRewardPerReviewer: journalInformationFromSC._secondReviewerRewardPerReviewer,
      submissionFee: journalInformationFromSC._submissionFee,
      maxReviewRounds: journalInformationFromSC._maxReviewRounds
    });
  }
  else {
    journal.contractOwner = journalInformationFromSC._contractOwner;
    journal.minAmountOfEditorApprovedReviews = journalInformationFromSC._minAmountOfEditorApprovedReviews;
    journal.maxAmountOfRewardedEditorApprovedReviews = journalInformationFromSC._maxAmountOfRewardedEditorApprovedReviews;
    journal.minAmountOfCommunityReviews = journalInformationFromSC._minAmountOfCommunityReviews;
    journal.maxAmountOfRewardedCommunityReviews = journalInformationFromSC._maxAmountOfRewardedCommunityReviews;
    journal.sciencemattersFoundationReward = journalInformationFromSC._sciencemattersFoundationReward;
    journal.editorReward = journalInformationFromSC._editorReward;
    journal.linkedArticlesReward = journalInformationFromSC._linkedArticlesReward;
    journal.invalidationWorkReward = journalInformationFromSC._invalidationWorkReward;
    journal.editorApprovedReviewerRewardPerReviewer = journalInformationFromSC._editorApprovedReviewerRewardPerReviewer;
    journal.communityReviewerRewardPerReviewer = journalInformationFromSC._communityReviewerRewardPerReviewer;
    journal.secondReviewerRewardPerReviewer = journalInformationFromSC._secondReviewerRewardPerReviewer;
    journal.submissionFee = journalInformationFromSC._submissionFee;
    journal.maxReviewRounds = journalInformationFromSC._maxReviewRounds;
  }

  return await journal.save();
};