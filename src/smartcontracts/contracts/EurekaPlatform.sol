pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Utils.sol";


contract EurekaPlatform {

    // primary key mappings
    mapping(uint256 => ArticleSubmission) articleSubmissions;
    mapping(bytes32 => ArticleVersion) articlesVersions;
    mapping(uint256 => Review) reviews;

    // other mappings
    mapping(address => ArticleVersion[]) articleVersionByAuthor;
    mapping(address => ArticleSubmission[]) articleSubmissionsByEditor;
    mapping(address => Review[]) reviewsByReviewer;


    using SafeMath for uint256;

    enum SubmissionState {NOT_EXISTING, OPEN, CLOSED}
    // different ArticleVersions from different review-rounds are saved in the same ArticleSubmission Object
    struct ArticleSubmission {
        uint256 submissionId;
        SubmissionState submissionState;
        address submissionOwner;
        ArticleVersion[] versions;
        address editor;
    }

    enum ArticleVersionState {NOT_EXISTING, SUBMITTED, EDITOR_CHECKED, NOT_ENOUGH_REVIEWERS, NOT_ACCEPTED, ACCEPTED}
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
        // the hashes of the linked articles
        bytes32[] linkedArticles;

        // the reviewers which are allowed to review that article as an editor approved Reviewer
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

    enum ReviewState {NOT_EXISTING, HANDED_IN, DECLINED, ACCEPTED}
    struct Review {
        uint256 reviewId;
        bytes32 reviewHash;
        uint256 reviewedTimestamp;
        address reviewer;

        ReviewState reviewState;

        uint8 score1;
        uint8 score2;
    }
}
