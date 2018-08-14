pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Utils.sol";
import "./Eureka.sol";


contract EurekaPlatform {

    using SafeMath for uint256;

    Eureka eurekaTokenContract;

    address contractOwner;

    /*
    *   journal parameters
    */

    // amount of rewarded reviewers
    uint minAmountOfEditorApprovedReviews = 2;
    uint maxAmountOfRewardedEditorApprovedReviews = 3;

    uint minAmountOfCommunityReviews = 0;
    uint maxAmountOfRewardedCommunityReviews = 10;

    // rewards amount
    uint sciencemattersFoundationReward = 1250;
    uint editorReward = 500;
    uint linkedArticlesReward = 750;
    uint invalidationWorkReward = 1000;

    uint editorApprovedReviewerRewardPerReviewer = 250;
    uint communityReviewerRewardPerReviewer = 50;
    uint secondReviewerRewardPerReviewer = 25;

    uint public submissionFee =
    sciencemattersFoundationReward
    + editorReward
    + linkedArticlesReward
    + invalidationWorkReward
    + maxAmountOfRewardedEditorApprovedReviews * editorApprovedReviewerRewardPerReviewer
    + maxAmountOfRewardedCommunityReviews * communityReviewerRewardPerReviewer
    + maxAmountOfRewardedCommunityReviews * secondReviewerRewardPerReviewer;

    uint constant maxReviewRounds = 3;


    //    constructor(address _eurekaTokenContractAddress) public {
    constructor() public {

        //        eurekaTokenContract = Eureka(_eurekaTokenContractAddress);
        contractOwner = msg.sender;
    }


    mapping(address => bool) isEditor;

    // primary key mappings
    uint256 submissionCounter;
    mapping(uint256 => ArticleSubmission) public articleSubmissions;
    mapping(bytes32 => ArticleVersion) public articleVersions;
    mapping(bytes32 => mapping(address => Review)) public  reviews;

    // address mappings
    //    mapping(address => ArticleVersion[]) articleVersionByAuthor;
    //    mapping(address => ArticleSubmission[]) articleSubmissionsByEditor;
    //    mapping(address => Review[]) reviewsByReviewer;


    enum SubmissionState {
        NOT_EXISTING,
        OPEN,
        EDITOR_ASSIGNED,
        NEW_REVIEW_ROUND_REQUESTED,
        CLOSED
    }
    // different ArticleVersions from different review-rounds are saved in the same ArticleSubmission Object
    struct ArticleSubmission {
        uint256 submissionId;
        SubmissionState submissionState;
        uint256 stateTimestamp;
        address submissionOwner;
        ArticleVersion[] versions;
        address editor;
    }

    enum ArticleVersionState {
        NOT_EXISTING,
        SUBMITTED,
        EDITOR_CHECKED,
        REVIEWERS_INVITED,
        NOT_ENOUGH_REVIEWERS,
        DECLINED_SANITY_NOTOK,
        DECLINED,
        ACCEPTED
    }

    // an ArticleSubmission can have different versions
    struct ArticleVersion {
        uint256 submissionId;
        bytes32 articleHash;
        // the timestamp when the article was published
        uint256 publishedTimestamp;
        // the URL where the article is saved
        //TODO: URL can be resp. IS USUALLY bigger than bytes32 -> us string and length indicator in bytes parser
        bytes32 articleUrl;

        ArticleVersionState versionState;
        uint256 stateTimestamp;

        address[] authors;
        // the submission owner can weight the contributions of the different authors [0;10000]
        //  ( e.g. 3 authors with 1/3 contribution each: {3334,3333,3333} )
        uint16[] authorContributionRatios;
        // the hashes of the linked articles
        bytes32[] linkedArticles;
        // the submission owner can weight the impact of the linked articles [0;10000]
        uint16[] linkedArticlesSplitRatios;

        // the reviewers which are allowed to review that article as an editor approved reviewer
        //        address[] allowedEditorApprovedReviewers;
        mapping(address => bool) allowedEditorApprovedReviewers;
        // the reviewers which are approved from the editor
        // TODO how to check if Reviewer already saved a review -> with array for loop (expensive) maybe save additional mapping
        //        mapping(address => Review) editorApprovedReviews;
        Review[] editorApprovedReviews;

        // every community reviewer can add a community review without being approved
        // TODO how to check if Reviewer already saved a review -> with array for loop (expensive) maybe save additional mapping
        //        mapping(address => Review) communityReviews;
        Review[] communityReviews;
    }

    enum ReviewState {
        NOT_EXISTING,
        INVITED,
        INVITATION_ACCEPTED,
        HANDED_IN,
        DECLINED,
        ACCEPTED
    }
    struct Review {
        bytes32 articleHash;
        address reviewer;

        bool isEditorApprovedReview;

        ReviewState reviewState;

        // with each state change the stateTimestamp field is updated
        uint256 stateTimestamp;

        bytes32 reviewHash;
        uint256 reviewedTimestamp;

        // if set to true, the editor cannot accept the article if he/she accepts this review
        bool articleHasMajorIssues;
        // acceptance of article is still possible although set to true
        bool articleHasMinorIssues;

        uint8 score1;
        uint8 score2;

        // address of the reviewer who reviewed this review (if at state ACCEPTED or DECLINED)
        address reviewedBy;
    }

    function getLinkedArticles(bytes32 hash) public view returns (bytes32[] linkedArticles) {
        linkedArticles = articleVersions[hash].linkedArticles;
    }

    function getAuthors(bytes32 hash) public view returns (address[] authors) {
        authors = articleVersions[hash].authors;
    }


    event EditorSignUp(address editorAddress);

    function signUpEditor(address editor) public {

        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");
        isEditor[editor] = true;
        emit EditorSignUp(editor);
    }

    event SubmissionProcessStart(uint256 submissionId, address submissionOwner, bytes32 articleHash, bytes32 articleURL);

    function startSubmissionProcess(
    //        uint256 _value,
        bytes32 _articleHash, bytes32 _articleURL, address[] _authors,
        uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) public {

        //        require(msg.sender == address(eurekaTokenContract));
        //        require(_value == submissionFee, 'transferred amount needs to equal the submission fee');

        uint submissionId = submissionCounter++;
        ArticleSubmission storage submission = articleSubmissions[submissionId];

        submission.submissionId = submissionId;
        submission.submissionOwner = tx.origin;
        // doc: sender of the transaction (full call chain)

        submitArticleVersion(submissionId, _articleHash, _articleURL, _authors, _authorContributionRatios, _linkedArticles, _linkedArticlesSplitRatios);

        submission.submissionState = SubmissionState.OPEN;
        submission.stateTimestamp = block.timestamp;
        emit SubmissionProcessStart(submission.submissionId, tx.origin, _articleHash, _articleURL);
    }

    function submitArticleVersion(uint256 _submissionId, bytes32 _articleHash, bytes32 _articleURL,
        address[] _authors, uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) private {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.submissionId == 0, 'Article was already uploaded.');
        // edge case: two articles have the same hash

        article.submissionId = _submissionId;
        article.articleHash = _articleHash;
        article.articleUrl = _articleURL;
        article.publishedTimestamp = block.timestamp;

        article.authors = _authors;
        article.authorContributionRatios = _authorContributionRatios;
        article.linkedArticles = _linkedArticles;
        article.linkedArticlesSplitRatios = _linkedArticlesSplitRatios;

        articleSubmissions[_submissionId].versions.push(article);
        article.versionState = ArticleVersionState.SUBMITTED;
        article.stateTimestamp = block.timestamp;
    }


    event AssignmentForSubmissionProcess(address assignerAddress, uint256 submissionId);
    // a journal editor can assign him/herself to an article submission process
    // if the process is not already claimed by another editor
    function assignForSubmissionProcess(uint256 _submissionId) public {

        require(isEditor[msg.sender], "msg.sender must be an editor to call this function.");

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(submission.submissionState == SubmissionState.OPEN, "the submission process needs to be OPEN to call this method.");
        require(submission.editor == address(0), "the submission process is already assigned to an editor.");

        submission.editor = msg.sender;
        submission.submissionState = SubmissionState.EDITOR_ASSIGNED;
        submission.stateTimestamp = block.timestamp;
        emit AssignmentForSubmissionProcess(msg.sender, _submissionId);
    }

    event RemovedEditorFromSubmission(uint submissionId);

    function removeEditorFromSubmissionProcess(uint256 _submissionId) public {
        ArticleSubmission storage submission = articleSubmissions[_submissionId];

        require(submission.submissionState == SubmissionState.EDITOR_ASSIGNED, "an editor needs to be assigned to call this function.");
        require(msg.sender == contractOwner
        || msg.sender == submission.editor, "an editor can only be removed by the contract owner or itself.");

        submission.editor = address(0);
        submission.submissionState = SubmissionState.OPEN;
        submission.stateTimestamp = block.timestamp;
        emit RemovedEditorFromSubmission(_submissionId);
    }

    // is it a good idea that the current editor can assign another editor? or should only removing (method below) be possible?
    event ChangedEditorFromSubmission(uint256 submissionId, address newEditor);

    function changeEditorFromSubmissionProcess(uint256 _submissionId, address _newEditor) public {
        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(submission.submissionState == SubmissionState.EDITOR_ASSIGNED, "an editor needs to be assigned to call this function.");
        require(isEditor[_newEditor], 'the new editor must be an allowed editor.');

        require(msg.sender == contractOwner
        || msg.sender == submission.editor, "an editor can only be changed by the contract owner or the current editor.");

        submission.editor = _newEditor;
        submission.stateTimestamp = block.timestamp;
        emit ChangedEditorFromSubmission(_submissionId, _newEditor);
    }

    event SanityIsOk(uint256 submissionId, bytes32 articleHash);

    function sanityIsOk(bytes32 _articleHash) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.SUBMITTED, "this method can't be called. version state must be SUBMITTED.");

        article.versionState = ArticleVersionState.EDITOR_CHECKED;
        article.stateTimestamp = block.timestamp;
        emit SanityIsOk(articleVersions[_articleHash].submissionId, _articleHash);
    }

    event SanityIsNotOk(uint256 submissionId, bytes32 articleHash);

    function sanityIsNotOk(bytes32 _articleHash) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.SUBMITTED, "this method can't be called. version state must be SUBMITTED.");

        article.versionState = ArticleVersionState.DECLINED_SANITY_NOTOK;
        article.stateTimestamp = block.timestamp;
        // TODO handle difference between review rounds and article versions, maybe not every new version is a review round, according to max Review rounds
        requestNewReviewRound(article.submissionId);
        emit SanityIsNotOk(articleVersions[_articleHash].submissionId, _articleHash);
    }

    event ReviewersAreInvited(uint256 submissionId, bytes32 articleHash, address[] editorApprovedReviewers, uint256 stateTimestamp);
    function inviteReviewers(bytes32 _articleHash, address[] _allowedEditorApprovedReviewers) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        for (uint i = 0; i < _allowedEditorApprovedReviewers.length; i++) {
            article.allowedEditorApprovedReviewers[_allowedEditorApprovedReviewers[i]] = true;
            reviews[_articleHash][_allowedEditorApprovedReviewers[i]].reviewState = ReviewState.INVITED;
            reviews[_articleHash][_allowedEditorApprovedReviewers[i]].stateTimestamp = block.timestamp;
        }
        article.versionState = ArticleVersionState.REVIEWERS_INVITED;
        article.stateTimestamp = block.timestamp;
        emit ReviewersAreInvited(articleVersions[_articleHash].submissionId, _articleHash, _allowedEditorApprovedReviewers, block.timestamp);
    }

    function acceptReviewInvitation(bytes32 _articleHash) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.REVIEWERS_INVITED, "this method can't be called. version state must be REVIEWERS_INVITED.");

        //TODO: maybe not necessary anymore
        require(article.allowedEditorApprovedReviewers[msg.sender], "msg.sender is not invited to review");
        //TODO: handle accepted but not responding reviewers
        require(article.editorApprovedReviews.length < maxAmountOfRewardedEditorApprovedReviews, "the max amount of editor approved reviews is already reached.");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState == ReviewState.INVITED, "this method can't be called, the review state needs to be in INVITED.");
        review.reviewState = ReviewState.INVITATION_ACCEPTED;
        review.stateTimestamp = block.timestamp;
        review.reviewer = msg.sender;

        article.editorApprovedReviews.push(review);
    }

    function addEditorApprovedReview(bytes32 _articleHash, bytes32 _reviewHash, bool _articleHasMajorIssues, bool _articleHasMinorIssues, uint8 _score1, uint8 _score2) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.REVIEWERS_INVITED, "this method can't be called. version state must be REVIEWERS_INVITED.");

        //TODO: maybe not necessary anymore
        require(article.allowedEditorApprovedReviewers[msg.sender], "msg.sender is not invited to review");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState == ReviewState.INVITATION_ACCEPTED
        || review.reviewState == ReviewState.INVITED, "msg.sender is not authorized to add a editor approved revie");

        if (review.reviewState != ReviewState.INVITATION_ACCEPTED) {
            acceptReviewInvitation(_articleHash);
        }

        review.isEditorApprovedReview = true;
        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.articleHasMajorIssues = _articleHasMajorIssues;
        review.articleHasMinorIssues = _articleHasMinorIssues;
        review.score1 = _score1;
        review.score2 = _score2;

        review.reviewState = ReviewState.HANDED_IN;
        review.stateTimestamp = block.timestamp;
    }

    function addCommunityReview(bytes32 _articleHash, bytes32 _reviewHash, bool _articleHasMajorIssues, bool _articleHasMinorIssues, uint8 _score1, uint8 _score2) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.SUBMITTED
        || article.versionState == ArticleVersionState.EDITOR_CHECKED
        || article.versionState == ArticleVersionState.REVIEWERS_INVITED
        , "this method can't be called. version state must be SUBMITTED, EDITOR_CHECKED or REVIEWERS_INVITED.");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState < ReviewState.HANDED_IN, "the review already exists.");

        review.reviewer = msg.sender;

        review.isEditorApprovedReview = false;
        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.articleHasMajorIssues = _articleHasMajorIssues;
        review.articleHasMinorIssues = _articleHasMinorIssues;
        review.score1 = _score1;
        review.score2 = _score2;

        article.communityReviews.push(review);
        review.reviewState = ReviewState.HANDED_IN;
        review.stateTimestamp = block.timestamp;
    }

    function correctReview(bytes32 _articleHash, bytes32 _reviewHash, bool _articleHasMajorIssues, bool _articleHasMinorIssues, uint8 _score1, uint8 _score2) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.SUBMITTED
        || article.versionState == ArticleVersionState.EDITOR_CHECKED
        || article.versionState == ArticleVersionState.REVIEWERS_INVITED, "this method can't be called. version state must be SUBMITTED, EDITOR_CHECKED or REVIEWERS_INVITED.");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState == ReviewState.DECLINED
        || review.reviewState == ReviewState.HANDED_IN, "only declined reviews can be corrected.");

        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.articleHasMajorIssues = _articleHasMajorIssues;
        review.articleHasMinorIssues = _articleHasMinorIssues;
        review.score1 = _score1;
        review.score2 = _score2;

        review.reviewState = ReviewState.HANDED_IN;
        review.stateTimestamp = block.timestamp;
    }

    function acceptReview(bytes32 _articleHash, address _reviewerAddress) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        //TODO: in which states of the articles the reviewers can hand in reviews and get accepted?
        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.REVIEWERS_INVITED, "this method can't be called. version state must be REVIEWERS_INVITED.");

        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.HANDED_IN, "review state must be HANDED_IN.");

        review.reviewState = ReviewState.ACCEPTED;
        review.stateTimestamp = block.timestamp;
        review.reviewedBy = msg.sender;
    }

    function declineReview(bytes32 _articleHash, address _reviewerAddress) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        //TODO: in which states of the articles the reviewers can hand in reviews and get accepted?
        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.REVIEWERS_INVITED, "this method can't be called. version state must be REVIEWERS_INVITED.");

        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.HANDED_IN, "review state must be HANDED_IN.");

        review.reviewState = ReviewState.DECLINED;
        review.stateTimestamp = block.timestamp;
        review.reviewedBy = msg.sender;
    }

    function acceptArticleVersion(bytes32 _articleHash) public {

        require(isEditor[msg.sender], "msg.sender needs to be an editor.");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.REVIEWERS_INVITED, "this method can't be called. version state must be EDITOR_CHECKED.");

        require(countAcceptedReviews(article.editorApprovedReviews) >= minAmountOfEditorApprovedReviews,
            "the article doesn't have enough accepted editor approved reviews to get accepted.");
        require(countAcceptedReviews(article.communityReviews) >= minAmountOfCommunityReviews,
            "the article doesn't have enough community reviews to get accepted.");

        require(countAcceptedReviewInvitations(article.editorApprovedReviews) == 0,
            "there are still people working on reviews.");

        require(countReviewsWithMajorIssues(article.editorApprovedReviews) == 0,
            "the article needs to be corrected.");
        require(countReviewsWithMajorIssues(article.communityReviews) == 0,
            "the article needs to be corrected.");

        article.versionState = ArticleVersionState.ACCEPTED;
        article.stateTimestamp = block.timestamp;

        closeSubmissionProcess(article.submissionId);
    }

    function declineArticleVersion(bytes32 _articleHash) public {

        require(isEditor[msg.sender], "msg.sender needs to be an editor.");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.REVIEWERS_INVITED, "this method can't be called. version state must be EDITOR_CHECKED.");


        require(countAcceptedReviews(article.editorApprovedReviews) >= minAmountOfEditorApprovedReviews,
            "the article doesn't have enough accepted editor approved reviews to get accepted.");
        require(countAcceptedReviews(article.communityReviews) >= minAmountOfCommunityReviews,
            "the article doesn't have enough community reviews to get accepted.");

        require(countAcceptedReviewInvitations(article.editorApprovedReviews) == 0,
            "there are still people working on reviews.");

        article.versionState = ArticleVersionState.DECLINED;

        if (countDeclinedReviewRounds(article.submissionId) >= maxReviewRounds)
            closeSubmissionProcess(article.submissionId);
        else
            requestNewReviewRound(article.submissionId);
    }

    function countAcceptedReviewInvitations(Review[] _reviews) pure private returns (uint count) {
        for (uint i = 0; i < _reviews.length; i++) {
            if (_reviews[i].reviewState == ReviewState.INVITATION_ACCEPTED)
                count++;
        }
        return count;
    }

    function countAcceptedReviews(Review[] _reviews) pure private returns (uint count) {
        for (uint i = 0; i < _reviews.length; i++) {
            if (_reviews[i].reviewState == ReviewState.ACCEPTED)
                count++;
        }
        return count;
    }

    function countReviewsWithMajorIssues(Review[] _reviews) pure private returns (uint count) {
        for (uint i = 0; i < _reviews.length; i++) {
            if (_reviews[i].reviewState == ReviewState.ACCEPTED
            && _reviews[i].articleHasMajorIssues)
                count++;
        }
        return count;
    }

    // only counts the articles which went through a review process and therefore have the state DECLINED
    // does not consider the versions with state DECLINED_SANITY_NOTOK
    function countDeclinedReviewRounds(uint256 _submissionId) view private returns (uint count) {
        ArticleVersion[] storage versions = articleSubmissions[_submissionId].versions;
        for (uint i = 0; i < versions.length; i++) {
            if (versions[i].versionState == ArticleVersionState.DECLINED)
                count++;
        }
        return count;
    }

    function requestNewReviewRound(uint256 _submissionId) private {

        articleSubmissions[_submissionId].submissionState = SubmissionState.NEW_REVIEW_ROUND_REQUESTED;
        articleSubmissions[_submissionId].stateTimestamp = block.timestamp;
    }

    function openNewReviewRound(uint256 _submissionId, bytes32 _articleHash, bytes32 _articleURL, address[] _authors,
        uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) public {

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(msg.sender == submission.submissionOwner, "only the submission process owner can submit a new article version.");
        require(submission.submissionState == SubmissionState.NEW_REVIEW_ROUND_REQUESTED,
            "this method can't be called. the submission process state must be NEW_REVIEW_ROUND_REQUESTED.");

        submitArticleVersion(_submissionId, _articleHash, _articleURL, _authors, _authorContributionRatios, _linkedArticles, _linkedArticlesSplitRatios);

        submission.submissionState = SubmissionState.OPEN;
        submission.stateTimestamp = block.timestamp;
    }

    function declineNewReviewRound(uint256 _submissionId) public {

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(msg.sender == submission.submissionOwner, "only the submission process owner can call this method");
        require(submission.submissionState == SubmissionState.NEW_REVIEW_ROUND_REQUESTED,
            "this method can't be called. the submission process state must be NEW_REVIEW_ROUND_REQUESTED.");

        closeSubmissionProcess(_submissionId);
    }

    // TODO: should it be possible to close a submission process before reaching maxReviewRounds ??
    function closeSubmissionProcess(uint256 _submissionId) private {

        ArticleSubmission submission = articleSubmissions[_submissionId];

        // transfer all rewards
        require(eurekaTokenContract.transfer(contractOwner, sciencemattersFoundationReward));
        require(eurekaTokenContract.transfer(submission.editor, editorReward));

        // counts how many reviewRounds happened to devide the reward later
        uint reviewRounds = countDeclinedReviewRounds(_submissionId) + 1;
        for (uint i = 0; i < submission.versions.length; i++) {
            if (submission.versions[i].versionState == ArticleVersionState.DECLINED
            || submission.versions[i].versionState == ArticleVersionState.ACCEPTED) {

                rewardEditorApprovedReviews(submission.versions[i].editorApprovedReviews, reviewRounds);
                rewardCommunityReviews(submission.versions[i].communityReviews, reviewRounds);
            }
        }

        if (submission.versions[submission.versions.length - 1].versionState == ArticleVersionState.ACCEPTED) {
            //TODO: reward linkedArticles authors and invalidation work
            // check also if time is already up
        }

        submission.submissionState = SubmissionState.CLOSED;
        submission.stateTimestamp = block.timestamp;
    }

    function rewardEditorApprovedReviews(Review[] _editorApprovedReviews, uint _reviewRounds) private {
        uint rewardedReviewers = 0;
        for (uint i = 0; i < _editorApprovedReviews.length; i++) {
            if (rewardedReviewers < maxAmountOfRewardedEditorApprovedReviews) {
                if (_editorApprovedReviews[i].reviewState == ReviewState.ACCEPTED) {
                    require(
                        eurekaTokenContract.transfer(
                            _editorApprovedReviews[i].reviewer,
                            editorApprovedReviewerRewardPerReviewer.div(_reviewRounds)
                        ));
                    rewardedReviewers++;
                }
            }
            else
                return;
        }
    }

    function rewardCommunityReviews(Review[] _communityReviews, uint _reviewRounds) private {
        uint rewardedReviewers = 0;
        for (uint i = 0; i < _communityReviews.length; i++) {
            if (rewardedReviewers < maxAmountOfRewardedCommunityReviews) {
                if (_communityReviews[i].reviewState == ReviewState.ACCEPTED) {
                    require(
                        eurekaTokenContract.transfer(
                            _communityReviews[i].reviewer,
                            communityReviewerRewardPerReviewer.div(_reviewRounds)
                        ));
                    require(
                        eurekaTokenContract.transfer(
                            _communityReviews[i].reviewedBy,
                            secondReviewerRewardPerReviewer.div(_reviewRounds)
                        ));
                    rewardedReviewers++;
                }
            }
            else
                return;
        }
    }
}
