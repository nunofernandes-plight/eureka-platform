pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Utils.sol";
import "./Eureka.sol";


contract EurekaPlatform is ERC677Receiver {

    using SafeMath for uint256;

    /*
    *   journal parameters
    */

    // amount of rewarded reviewers
    uint minAmountOfEditorApprovedReviewer = 2;
    uint maxAmountOfEditorApprovedReviewer = 3;

    uint minAmountOfCommunityReviewer = 0;
    uint maxAmountOfCommunityReviewer = 5;

    // rewards amount
    uint sciencemattersFoundationReward = 1252;               // rounded up that fee equals 5000
    uint editorReward = 500;
    uint linkedArticlesReward = 750;
    uint invalidationWorkReward = 1000;

    // rewards for the reviews saved in arrays, specifiable reward for every round.
    // if rounds not needes, returned back to author
    // if max reviewer amount is not reached, not used rewards is returned to author
    uint constant maxReviewRounds = 3;
    uint[maxReviewRounds] editorApprovedReviewerRewardPerReviewer;
    uint[maxReviewRounds] communityReviewerRewardPerReviewer;
    uint[maxReviewRounds] secondReviewerRewardPerReviewer;

    // resulting submission fee
    uint submissionFee;


    constructor() {

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
    mapping(bytes32 => ArticleVersion) articlesVersions;
    uint256 reviewCounter;
    mapping(uint256 => Review) reviews;

    // other mappings
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
        address[] allowedEditorApprovedReviewers;
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
        HANDED_IN,
        DECLINED,
        ACCEPTED
    }
    struct Review {
        uint256 reviewId;
        bytes32 reviewHash;
        uint256 reviewedTimestamp;
        address reviewer;

        ReviewState reviewState;

        uint8 score1;
        uint8 score2;
    }

    /**
     *  Receiver interface for ERC677 transferAndCall
     * @dev See https://github.com/ethereum/EIPs/issues/677 for specification and
     *      discussion.
     */
    function tokenFallback(address _from, uint256 _amount, bytes _data) {
        //require(msg.sender == Eureka);                                        ??????
        require(_amount == submissionFee);

        bytes32 articleHash;
        bytes32 articleURL;
        uint16 authorsLength;
        address[] authors;
        uint16 linkedArticlesLength;
        bytes32[] linkedArticles;

        uint dataIndex = 0;
        // bytes to bytes32
        for (uint i = 0; i < 32; i++) {
            articleHash = articleHash | (bytes32(_data[dataIndex++]) >> (i * 8));
        }
        for (i = 0; i < 32; i++) {
            articleURL = articleURL | (bytes32(_data[dataIndex++]) >> (i * 8));
        }

        // bytes to uint
        for (i = 0; i < 2; i++) {
            authorsLength = authorsLength | (uint16(_data[dataIndex++]) >> (i * 8));
        }
        // bytes to address
        for (uint j = 0; j < authorsLength; j++) {
            // copied from https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol
            uint160 iaddr = 0;
            uint160 b1;
            uint160 b2;
            for (i = 2; i < 2 + 2 * 20; i += 2) {
                iaddr *= 256;
                b1 = uint160(_data[dataIndex]);
                b2 = uint160(_data[dataIndex + 1]);
                dataIndex++;

                if ((b1 >= 97) && (b1 <= 102)) b1 -= 87;
                else if ((b1 >= 65) && (b1 <= 70)) b1 -= 55;
                else if ((b1 >= 48) && (b1 <= 57)) b1 -= 48;
                if ((b2 >= 97) && (b2 <= 102)) b2 -= 87;
                else if ((b2 >= 65) && (b2 <= 70)) b2 -= 55;
                else if ((b2 >= 48) && (b2 <= 57)) b2 -= 48;
                iaddr += (b1 * 16 + b2);
            }
            authors.push(address(iaddr));
        }

        // bytes to uint
        for (i = 0; i < 2; i++) {
            linkedArticlesLength = linkedArticlesLength | (uint16(_data[dataIndex++]) >> (i * 8));
        }
        // bytes to array
        for (j = 0; j < linkedArticlesLength; j++) {
            // bytes to bytes32
            bytes32 article;
            for (i = 0; i < 32; i++) {
                article = article | (bytes32(_data[dataIndex++]) >> (i * 8));
            }
            linkedArticles.push(article);
        }

        createArticleSubmission(_from);
        createArticleVersion(articleHash, articleURL, authors, linkedArticles);

    }


    function createArticleSubmission(address submissionOwner) private {


    }

    function createArticleVersion(bytes32 articleHash, bytes32 articleURL , address[] authors, bytes32[] linkedArticles) private {


    }
}
