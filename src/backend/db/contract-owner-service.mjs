import ContractOwner from '../schema/contract-owner.mjs';
import Journal from '../schema/journal.mjs';
import {getContractOwner, getJournalParameters} from '../../smartcontracts/methods/web3-platform-contract-methods.mjs';

export const getContractOwnerFromDB = () => {
  return ContractOwner.findById(1);
};

export const writeContractOwnerInDB = async contract => {
  const id = 1;
  const contractOwnerAddress = await getContractOwner(contract);
  let contractOwner = await ContractOwner.findById(id);
  if (!contractOwner) {
    contractOwner = new ContractOwner({
      _id: id,
      address: contractOwnerAddress
    });
  } else {
    contractOwner.address = contractOwnerAddress;
  }
  return await contractOwner.save();
};

export const saveJournalInformation = async contract => {
  let journal = await Journal.findOne({
    contractAddress: contract.options.address
  });
  const journalInformationFromSC = await getJournalParameters(contract);
  console.log(journalInformationFromSC);

  if (!journal) {
    journal = new Journal({
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
    console.log('new');
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

    console.log(journal);
    console.log('old');
  }

  return await journal.save();
};