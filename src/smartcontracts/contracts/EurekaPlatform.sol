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
        NOT_ACCEPTED_SANITY_NOTOK,
        NOT_ACCEPTED,
        ACCEPTED
    }
    // an ArticleSubmission can have different versions
    struct ArticleVersion {
        uint256 submissionId;
        bytes32 articleHash;
        // the timestamp when the article was published
        uint256 publishedTimestamp;
        // the URL where the article is saved
        bytes32 articleUrl;
        
        ArticleVersionState versionState;

        address[] authors;
        // the submission owner can weight the contributions of the different authors [0;10000]
        //  ( e.g. 3 authors with 1/3 contribution each: {3334,3333,3333} )
        uint8[] authorContributionRatio;
        // the hashes of the linked articles
        bytes32[] linkedArticles;
        // the submission owner can weight the impact of the linked articles [0;10000]
        uint8[] linkedArticlesSplitRatio;

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

        // either save aggregated scores in article version or loop in GET method over review array
        uint8 score1;
        uint8 score2;
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
    
    function signUpEditor(address editor) public {
        
        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");
        isEditor[editor] = true;
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
        address[] storage authors;
        for (uint j = 0; j < authorsLength; j++) {
            authors.push(bytesToAddress(_data, dataIndex));
            dataIndex += 20;
            //address is 20 bytes
        }

        uint16 linkedArticlesLength = bytesToUint16(_data, dataIndex);
        dataIndex += 2;
        bytes32[] memory linkedArticles;
        for (uint j = 0; j < linkedArticlesLength; j++) {
            linkedArticles[j] = bytesToBytes32(_data, dataIndex);
            dataIndex += 32;
        }

        startSubmissionProcess(_from, articleHash, articleUrl, authors, linkedArticles);

    }

    function bytesToBytes32(bytes _data, uint _dataIndex) pure private returns (bytes32 result){
        for (uint i = 0; i < 32; i++) {
            result = result | (bytes32(_data[_dataIndex++]) >> (i * 8));
        }
    }

    function bytesToUint16(bytes _data, uint _dataIndex) pure private returns (uint16 result){
        for (uint i = 0; i < 2; i++) {
            result = result | (uint16(_data[_dataIndex++]) >> (i * 8));
        }
    }

    // copied from https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol
    function bytesToAddress(bytes _data, uint _dataIndex) pure private returns (address result){
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(_data[_dataIndex]);
            b2 = uint160(_data[_dataIndex + 1]);
            _dataIndex++;

            if ((b1 >= 97) && (b1 <= 102)) b1 -= 87;
            else if ((b1 >= 65) && (b1 <= 70)) b1 -= 55;
            else if ((b1 >= 48) && (b1 <= 57)) b1 -= 48;
            if ((b2 >= 97) && (b2 <= 102)) b2 -= 87;
            else if ((b2 >= 65) && (b2 <= 70)) b2 -= 55;
            else if ((b2 >= 48) && (b2 <= 57)) b2 -= 48;
            iaddr += (b1 * 16 + b2);
        }
        result = address(iaddr);
    }

    function startSubmissionProcess(address _from, bytes32 _articleHash, bytes32 _articleURL, address[] _authors, bytes32[] _linkedArticles) private {

        uint submissionId = submissionCounter++;
        ArticleSubmission storage submission = articleSubmissions[submissionId];

        submission.submissionId = submissionId;
        submission.submissionOwner = _from;

        submitArticleVersion(submissionId, _articleHash, _articleURL, _authors, _linkedArticles);

        submission.submissionState = SubmissionState.OPEN;
    }

    function submitArticleVersion(uint256 _submissionId, bytes32 _articleHash, bytes32 _articleURL, address[] _authors, bytes32[] _linkedArticles) private {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.submissionId == 0, 'Article was already uploaded.');
        // edge case: two articles have the same hash

        article.submissionId = _submissionId;
        article.articleHash = _articleHash;
        article.articleUrl = _articleURL;
        article.publishedTimestamp = block.timestamp;

        article.authors = _authors;
        // TODO: parse version.authorContributionRatio = authorContributionRatio;
        article.linkedArticles = _linkedArticles;
        // TODO: parse version.linkedArticlesSplitRatio = linkedArticlesSplitRatio;

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
    function assignForSubmissionProcess(uint256 _submissionId) public{
        
        require(isEditor[msg.sender], "msg.sender must be an editor to call this function.");
        
        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(submission.submissionState == SubmissionState.OPEN, "the submission process not open.");
        require(submission.editor == address(0), "the submission process is already assigned to an editor.");
        
        submission.editor = msg.sender;
    }
    
    // TODO change editor by contract owner or editor itself

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
            article.versionState = ArticleVersionState.NOT_ACCEPTED_SANITY_NOTOK;
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

    function acceptReviewInvitation(bytes32 _articleHash) public{

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
    
    function declineReview (bytes32 _articleHash, address _reviewerAddress) public {
        
        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");
        
        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.EDITOR_CHECKED, "this method can't be called. version state must be EDITOR_CHECKED.");
        
        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.HANDED_IN, "review state must be HANDED_IN.");

        review.reviewState = ReviewState.DECLINED;
    }
}
