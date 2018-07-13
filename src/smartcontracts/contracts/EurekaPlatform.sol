pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Utils.sol";


contract EurekaPlatform {

    mapping(bytes32 => ArticleVersion) articlesVersions;
    mapping(bytes32 => uint) articleSubmissionIds;
    mapping(bytes32 => ArticleSubmission) articleSubmissions;

    using SafeMath for uint256;

    enum SubmissionState {NOT_EXISTING, CREATED}
    // different ArticleVersions from different review-rounds are saved in the same ArticleSubmission Object
    struct ArticleSubmission {
        uint256 submissionId;
        SubmissionState submissionState;
        address submissionOwner;
        ArticleVersions[] versions;
        address editor;
    }

    enum ArticleVersionState {NOT_EXISTING, CREATED}
    // an ArticleSubmission can have different versions
    struct ArticleVersion {
        bytes32 articleHash;
        // the timestamp when the article was published
        uint256 publishedTimestamp;
        // the URL where the article is saved
        bytes32 articleUrl;
        ArticleVersionState versionState;

        address[] authors;
        // the hashes of the linked articles
        bytes32[] linkedArticles;

        address[] allowedEditorApprovedReviewers;
        Review[] editorApprovedReviews;
        Review[] communityReviews;

    }

    enum ReviewState {NOT_EXISTING, CREATED}
    struct Review {
        bytes32 reviewHash;
        uint256 reviewedTimestamp;
        address reviewer;

        ReviewState reviewState;

        uint8[] scores;
    }
}
