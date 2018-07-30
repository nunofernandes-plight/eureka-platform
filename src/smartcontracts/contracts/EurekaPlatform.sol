pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Utils.sol";
import "./Eureka.sol";


contract EurekaPlatform is ERC677Receiver {

    using SafeMath for uint256;

    address contractOwner;

    /*
    *   journal parameters
    */

    mapping(address => bool) isEditor;

    // amount of rewarded reviewers
    uint minAmountOfEditorApprovedReviewer = 2;
    uint maxAmountOfEditorApprovedReviewer = 3;

    uint minAmountOfCommunityReviewer = 0;
    uint maxAmountOfCommunityReviewer = 5;

    // rewards amount
    uint sciencemattersFoundationReward = 1250;
    uint editorReward = 500;
    uint linkedArticlesReward = 750;
    uint invalidationWorkReward = 1000;

    // rewards for the reviews saved in arrays, specifiable reward for every round.
    // if rounds not needed, returned back to author
    // if max reviewer amount is not reached, not used rewards is returned to author
    uint constant maxReviewRounds = 3;
    uint[maxReviewRounds] editorApprovedReviewerRewardPerReviewer;
    uint[maxReviewRounds] communityReviewerRewardPerReviewer;
    uint[maxReviewRounds] secondReviewerRewardPerReviewer;

    // resulting submission fee
    uint submissionFee;


    constructor() public {

        contractOwner = msg.sender;

        editorApprovedReviewerRewardPerReviewer[0] = 150;
        editorApprovedReviewerRewardPerReviewer[1] = 75;
        editorApprovedReviewerRewardPerReviewer[2] = 25;

        communityReviewerRewardPerReviewer[0] = 60;
        communityReviewerRewardPerReviewer[1] = 30;
        communityReviewerRewardPerReviewer[2] = 10;

        secondReviewerRewardPerReviewer[0] = 30;
        secondReviewerRewardPerReviewer[1] = 15;
        secondReviewerRewardPerReviewer[2] = 5;

        submissionFee =
        sciencemattersFoundationReward
        + editorReward
        + linkedArticlesReward
        + invalidationWorkReward
        + maxAmountOfEditorApprovedReviewer * editorApprovedReviewerRewardPerReviewer[0]
        + maxAmountOfEditorApprovedReviewer * editorApprovedReviewerRewardPerReviewer[1]
        + maxAmountOfEditorApprovedReviewer * editorApprovedReviewerRewardPerReviewer[2]
        + maxAmountOfCommunityReviewer * communityReviewerRewardPerReviewer[0]
        + maxAmountOfCommunityReviewer * communityReviewerRewardPerReviewer[1]
        + maxAmountOfCommunityReviewer * communityReviewerRewardPerReviewer[2]
        + maxAmountOfCommunityReviewer * secondReviewerRewardPerReviewer[0]
        + maxAmountOfCommunityReviewer * secondReviewerRewardPerReviewer[1]
        + maxAmountOfCommunityReviewer * secondReviewerRewardPerReviewer[2];

    }


    // primary key mappings
    uint256 submissionCounter;
    mapping(uint256 => ArticleSubmission) articleSubmissions;
    mapping(bytes32 => ArticleVersion) public articleVersions;
    mapping(bytes32 => mapping(address => Review)) reviews;

    // address mappings
    mapping(address => ArticleVersion[]) articleVersionByAuthor;
    mapping(address => ArticleSubmission[]) articleSubmissionsByEditor;
    mapping(address => Review[]) reviewsByReviewer;


    enum SubmissionState {
        NOT_EXISTING,
        OPEN,
        NEW_REVIEW_ROUND_REQUESTED,
        CLOSED
    }
    // different ArticleVersions from different review-rounds are saved in the same ArticleSubmission Object
    struct ArticleSubmission {
        uint256 submissionId;
        SubmissionState submissionState;
        address submissionOwner;
        ArticleVersion[] versions;
        address editor;
    }

    enum ArticleVersionState {
        NOT_EXISTING,
        SUBMITTED,
        EDITOR_CHECKED,
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
        INVITATION_ACCEPTED,
        HANDED_IN,
        DECLINED,
        ACCEPTED
    }
    struct Review {
        bytes32 articleHash;
        address reviewer;

        ReviewState reviewState;

        bytes32 reviewHash;
        uint256 reviewedTimestamp;
        uint8 score1;
        uint8 score2;
    }

    function getLinkedArticles(bytes32 hash) public view returns (bytes32[] linkedArticles) {
        linkedArticles = articleVersions[hash].linkedArticles;
    }

    function getAuthors(bytes32 hash) public view returns (address[] authors) {
        authors = articleVersions[hash].authors;
    }


    event EditorSignUp(address editorAdress);

    function signUpEditor(address editor) public {

        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");
        isEditor[editor] = true;
        emit EditorSignUp(editor);
    }

    /**
     *  Receiver interface for ERC677 transferAndCall
     * @dev See https://github.com/ethereum/EIPs/issues/677 for specification and
     *      discussion.
     */
    function tokenFallback(address _from, uint256 _amount, bytes _data) public {

        //require(msg.sender == EutekaTokenAddress);
        require(_amount == submissionFee);

        uint dataIndex = 0;

        bytes32 articleHash = bytesToBytes32(_data, dataIndex);
        dataIndex += 32;

        bytes32 articleUrl = bytesToBytes32(_data, dataIndex);
        dataIndex += 32;

        uint16 authorsLength = bytesToUint16(_data, dataIndex);
        dataIndex += 2;
        address[] memory authors = new address[](authorsLength);
        uint16[] memory contributeRatios = new uint16[](authorsLength);
        for (uint j = 0; j < authorsLength; j++) {
            authors[j] = bytesToAddress(_data, dataIndex);
            //address is 20 bytes
            dataIndex += 20;
            contributeRatios[j] = bytesToUint16(_data, dataIndex);
            dataIndex += 2;
        }

        uint16 linkedArticlesLength = bytesToUint16(_data, dataIndex);
        dataIndex += 2;
        bytes32[] memory linkedArticles = new bytes32[](linkedArticlesLength);
        uint16[] memory linkedArticlesSplitRatios = new uint16[](linkedArticlesLength);
        for (j = 0; j < linkedArticlesLength; j++) {
            linkedArticles[j] = bytesToBytes32(_data, dataIndex);
            dataIndex += 32;
            linkedArticlesSplitRatios[j] = bytesToUint16(_data, dataIndex);
            dataIndex += 2;
        }

        startSubmissionProcess(_from, articleHash, articleUrl, authors, contributeRatios, linkedArticles, linkedArticlesSplitRatios);

    }

    function bytesToBytes32(bytes _data, uint _dataIndex) pure private returns (bytes32 result){
        for (uint i = 0; i < 32; i++) {
            result = result | (bytes32(_data[_dataIndex++]) >> (i * 8));
        }
    }

    function bytesToUint16(bytes _data, uint _dataIndex) pure public returns (uint16 result){
        bytes2 b;
        for (uint i = 0; i < 2; i++) {
            b = b | (bytes2(_data[_dataIndex++]) >> (i * 8));
        }
        result = uint16(b);
    }

    function bytesToAddress(bytes _data, uint _dataIndex) pure private returns (address result){
        uint resultInt = bytes20ToUint(_data, _dataIndex);
        result = address(resultInt);
    }

    function bytes20ToUint(bytes _data, uint _dataIndex) pure public returns (uint result){
        bytes20 b;
        for (uint i = 0; i < 20; i++) {
            b = b | (bytes20(_data[_dataIndex++]) >> (i * 8));
        }
        result = uint(b);
    }

    function getInt(bytes _data) pure public returns (uint16 result) {
        uint dataIndex = 0;

        //bytes32 articleHash = bytesToBytes32(_data, dataIndex);
        dataIndex += 32;

        result = bytesToUint16(_data, dataIndex);
    }

    function getAddress(bytes _data) pure public returns (address result) {
        uint dataIndex = 0;

        //bytes32 articleHash = bytesToBytes32(_data, dataIndex);
        dataIndex += 32;

        uint resultInt = bytes20ToUint(_data, dataIndex);
        result = address(resultInt);
    }

    event SubmissionProcessStart(address submissionOwner);

    function startSubmissionProcess(address _from, bytes32 _articleHash, bytes32 _articleURL, address[] _authors,
        uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) private {

        uint submissionId = submissionCounter++;
        ArticleSubmission storage submission = articleSubmissions[submissionId];

        submission.submissionId = submissionId;
        submission.submissionOwner = _from;

        submitArticleVersion(submissionId, _articleHash, _articleURL, _authors, _authorContributionRatios, _linkedArticles, _linkedArticlesSplitRatios);

        submission.submissionState = SubmissionState.OPEN;
        emit SubmissionProcessStart(_from);
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

    }

    function submitArticleVersion2(uint256 _submissionId, bytes32 _articleHash, bytes32 _articleURL, address[] _authors, bytes32[] _linkedArticles) private {

        require(articleVersions[_articleHash].submissionId == 0, "Article was already uploaded.");
        // edge case: two articles have the same hash

        articleVersions[_articleHash].submissionId = _submissionId;
        articleVersions[_articleHash].articleHash = _articleHash;
        articleVersions[_articleHash].articleUrl = _articleURL;
        articleVersions[_articleHash].publishedTimestamp = block.timestamp;

        articleVersions[_articleHash].authors = _authors;
        // TODO: parse version.authorContributionRatio = authorContributionRatio;
        articleVersions[_articleHash].linkedArticles = _linkedArticles;
        // TODO: parse version.linkedArticlesSplitRatio = linkedArticlesSplitRatio;

        articleSubmissions[_submissionId].versions.push(articleVersions[_articleHash]);
        articleVersions[_articleHash].versionState = ArticleVersionState.SUBMITTED;

    }

    // a journal editor can assign him/herself to an article submission process
    // if the process is not already claimed by another editor
    function assignForSubmissionProcess(uint256 _submissionId) public {

        require(isEditor[msg.sender], "msg.sender must be an editor to call this function.");

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(submission.submissionState == SubmissionState.OPEN, "the submission process not open.");
        require(submission.editor == address(0), "the submission process is already assigned to an editor.");

        submission.editor = msg.sender;
    }

    function removeEditorFromSubmissionProcess(uint256 _submissionId) public {

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(msg.sender == contractOwner
        || msg.sender == submission.editor, "an editor can only be removed by the contract owner or itself.");

        submission.editor = address(0);
    }

    // is it a good idea that the current editor can assign another editor? or should only removing (method below) be possible?
    function changeEditorFromSubmissionProcess(uint256 _submissionId, address _newEditor) public {

        require(isEditor[_newEditor], 'the new editor must be an allowed editor.');

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(msg.sender == contractOwner
        || msg.sender == submission.editor, "an editor can only be changed by the contract owner or the current editor.");

        submission.editor = _newEditor;
    }

    function editorCheckAndReviewerInvitation(bytes32 _articleHash, bool _isSanityOk, address[] _allowedEditorApprovedReviewers) public {

        firstEditorCheck(_articleHash, _isSanityOk);

        if (_isSanityOk)
            addAllowedReviewers(_articleHash, _allowedEditorApprovedReviewers);
    }

    function firstEditorCheck(bytes32 _articleHash, bool _isSanityOk) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.SUBMITTED, "this method can't be called. version state must be SUBMITTED.");

        if (_isSanityOk) {
            article.versionState = ArticleVersionState.EDITOR_CHECKED;
        }
        else {
            article.versionState = ArticleVersionState.DECLINED_SANITY_NOTOK;
            // TODO handle difference between review rounds and article versions
            requestNewReviewRound(article.submissionId);
        }
    }

    function addAllowedReviewers(bytes32 _articleHash, address[] _allowedEditorApprovedReviewers) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        for (uint i = 0; i < _allowedEditorApprovedReviewers.length; i++) {
            article.allowedEditorApprovedReviewers[_allowedEditorApprovedReviewers[i]] = true;
        }
    }

    function acceptReviewInvitation(bytes32 _articleHash) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        require(article.allowedEditorApprovedReviewers[msg.sender], "msg.sender is not invited to review");
        require(article.editorApprovedReviews.length < maxAmountOfEditorApprovedReviewer, "the max amount of editor approved reviews is already reached.");

        Review storage review = reviews[_articleHash][msg.sender];
        review.reviewState = ReviewState.INVITATION_ACCEPTED;
        review.reviewer = msg.sender;

        article.editorApprovedReviews.push(review);
    }

    function addEditorApprovedReview(bytes32 _articleHash, bytes32 _reviewHash, uint8 _score1, uint8 _score2) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        require(article.allowedEditorApprovedReviewers[msg.sender], "msg.sender is not invited to review");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState <= ReviewState.INVITATION_ACCEPTED, "the review already exists.");

        if (review.reviewState != ReviewState.INVITATION_ACCEPTED) {
            require(article.editorApprovedReviews.length < maxAmountOfEditorApprovedReviewer, "the max amount of editor approved reviews is already reached.");
            article.editorApprovedReviews.push(review);
        }

        review.reviewer = msg.sender;

        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.score1 = _score1;
        review.score2 = _score2;

        review.reviewState = ReviewState.HANDED_IN;
    }

    function addCommunityReview(bytes32 _articleHash, bytes32 _reviewHash, uint8 _score1, uint8 _score2) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        require(article.communityReviews.length < maxAmountOfCommunityReviewer, "the max amount of rewarded community reviews is already reached.");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState <= ReviewState.INVITATION_ACCEPTED, "the review already exists.");

        review.reviewer = msg.sender;

        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.score1 = _score1;
        review.score2 = _score2;

        article.communityReviews.push(review);
        review.reviewState = ReviewState.HANDED_IN;
    }

    function correctReview(bytes32 _articleHash, bytes32 _reviewHash, uint8 _score1, uint8 _score2) public {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState == ReviewState.DECLINED, "only declined reviews can be corrected.");

        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.score1 = _score1;
        review.score2 = _score2;

        review.reviewState = ReviewState.HANDED_IN;
    }

    function acceptReview(bytes32 _articleHash, address _reviewerAddress) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.HANDED_IN, "review state must be HANDED_IN.");

        review.reviewState = ReviewState.ACCEPTED;
    }

    function declineReview(bytes32 _articleHash, address _reviewerAddress) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.HANDED_IN, "review state must be HANDED_IN.");

        review.reviewState = ReviewState.DECLINED;
    }

    function acceptArticleVersion(bytes32 _articleHash) public {

        require(isEditor[msg.sender], "msg.sender needs to be an editor.");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        require(countAcceptedReviews(article.editorApprovedReviews) >= minAmountOfEditorApprovedReviewer,
            "the article doesn't have enough accepted editor approved reviews to get accepted.");
        require(countAcceptedReviews(article.communityReviews) >= minAmountOfCommunityReviewer,
            "the article doesn't have enough community reviews to get accepted.");

        // TODO if accept method is called to early, other reviewers could be rewarded.

        article.versionState = ArticleVersionState.ACCEPTED;

        closeSubmissionProcess(article.submissionId);
    }

    function declineArticleVersion(bytes32 _articleHash) public {

        require(isEditor[msg.sender], "msg.sender needs to be an editor.");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");

        // TODO if accept method is called to early, other reviewers could be rewarded.

        article.versionState = ArticleVersionState.DECLINED;

        if (countDeclinedArticles(article.submissionId) >= maxReviewRounds)
            closeSubmissionProcess(article.submissionId);
        else
            requestNewReviewRound(article.submissionId);
    }

    function countAcceptedReviews(Review[] _reviews) pure private returns (uint count) {
        for (uint i = 0; i < _reviews.length; i++) {
            if (_reviews[i].reviewState == ReviewState.ACCEPTED)
                count++;
        }
        return count;
    }

    // only counts the articles which went through a review process and therefore have the state DECLINED
    // does not consider the versions with state DECLINED_SANITY_NOTOK
    function countDeclinedArticles(uint256 _submissionId) view private returns (uint count) {
        ArticleVersion[] storage versions = articleSubmissions[_submissionId].versions;
        for (uint i = 0; i < versions.length; i++) {
            if (versions[i].versionState == ArticleVersionState.DECLINED)
                count++;
        }
        return count;
    }

    // TODO: should it be possible to close a submission process before reaching maxReviewRounds ??
    function closeSubmissionProcess(uint256 _submissionId) private {

        // TODO transfer all rewards

        articleSubmissions[_submissionId].submissionState = SubmissionState.CLOSED;
    }

    function requestNewReviewRound(uint256 _submissionId) private {

        // maybe TODO transfer all rewards

        articleSubmissions[_submissionId].submissionState = SubmissionState.NEW_REVIEW_ROUND_REQUESTED;
    }

    function openNewReviewRound(uint256 _submissionId, bytes32 _articleHash, bytes32 _articleURL, address[] _authors,
        uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) public {

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(msg.sender == submission.submissionOwner, "only the submission process owner can submit articles.");
        require(submission.submissionState == SubmissionState.NEW_REVIEW_ROUND_REQUESTED,
            "this method can't be called. the submission process state must be NEW_REVIEW_ROUND_REQUESTED.");

        submitArticleVersion(_submissionId, _articleHash, _articleURL, _authors, _authorContributionRatios, _linkedArticles, _linkedArticlesSplitRatios);

        submission.submissionState = SubmissionState.OPEN;
    }

    function declineNewReviewRound(uint256 _submissionId) public {

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(msg.sender == submission.submissionOwner, "only the submission process owner can call this method");
        require(submission.submissionState == SubmissionState.NEW_REVIEW_ROUND_REQUESTED,
            "this method can't be called. the submission process state must be NEW_REVIEW_ROUND_REQUESTED.");

        closeSubmissionProcess(_submissionId);
    }
}
