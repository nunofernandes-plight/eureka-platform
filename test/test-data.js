import getArticleHex from '../src/smartcontracts/methods/get-articleHex.mjs';
import web3 from '../src/helpers/web3Instance.mjs';
import userService from '../src/backend/db/user-service.mjs';
import Roles from '../src/backend/schema/roles-enum.mjs';

let accounts;
let contractOwner;
let user1;
let editor1;
let editor2;
let reviewer1;
let reviewer2;
let reviewer3;
let reviewer4;

export function setAccounts(_accounts) {
  accounts = _accounts;
  contractOwner = _accounts[0];
  user1 = _accounts[1];
  editor1 = _accounts[2];
  editor2 = _accounts[3];
  reviewer1 = _accounts[4];
  reviewer2 = _accounts[5];
  reviewer3 = _accounts[6];
  reviewer4 = _accounts[7];
}

export async function createUserContractOwner() {
  return await userService.createUser(
    'test',
    'test@test.test',
    contractOwner,
    'test-avatar'
  );
}

export async function createUser1() {
  return await userService.createUser(
    'test2',
    'test2@test.test',
    user1,
    'test-avatar2'
  );
}

export async function createEditor1() {
  return await userService.createUser(
    'testEditor',
    'editor@test.test',
    editor1,
    'test-editor-avatar'
  );
}

export async function createEditor2() {
  return await userService.createUser(
    'testEditor2',
    'editor2@test.test',
    editor2,
    'test-editor2-avatar'
  );
}

export async function createReviewer1() {
  return await userService.createUser(
    'testReviewer1',
    'reviewer1@test.test',
    reviewer1,
    'test-reviewer-avatar',
    Roles.REVIEWER
  );
}

export async function createReviewer2() {
  return await userService.createUser(
    'testReviewer2',
    'reviewer2@test.test',
    reviewer2,
    'test-reviewer-avatar',
    Roles.REVIEWER
  );
}

export async function createReviewer3() {
  return await userService.createUser(
    'testReviewer3',
    'reviewer3@test.test',
    reviewer3,
    'test-reviewer-avatar',
    Roles.REVIEWER
  );
}

export async function createReviewer4() {
  return await userService.createUser(
    'testReviewer4',
    'reviewer4@test.test',
    reviewer4,
    'test-reviewer-avatar',
    Roles.REVIEWER
  );
}
export const TEST_ARTICLE_1 = {
  articleHash:
    '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  url: 'article1.url',
  authors: [
    '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba88',
    '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba77'
  ],
  contributorRatios: [4000, 6000],
  linkedArticles: [
    '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
    '45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
    'd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
  ],
  linkedArticlesSplitRatios: [3334, 3333, 3333]
};
export const TEST_ARTICLE_1_DATA_IN_HEX = getArticleHex(web3, TEST_ARTICLE_1);
export const TEST_ARTICLE_1_HASH_HEX = '0x' + TEST_ARTICLE_1.articleHash;

export const TEST_ARTICLE_1_SECOND_VERSION = {
  articleHash:
    '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  url: 'article1.url',
  authors: [
    '0x32B90146858A1D119AB56202b84A330AaA7639D6',
    '0xBaa8A96aD1b53c5412D5d89cF85d45e579f17F58'
  ],
  contributorRatios: [1000, 9000],
  linkedArticles: [
    '0x5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
    '0x45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
    '0xd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
  ],
  linkedArticlesSplitRatios: [1111, 1111, 8888]
};
export const TEST_ARTICLE_1_SECOND_VERSION_DATA_IN_HEX = getArticleHex(web3, TEST_ARTICLE_1_SECOND_VERSION);
export const TEST_ARTICLE_1_SECOND_VERSION_HASH_HEX = '0x' + TEST_ARTICLE_1_SECOND_VERSION.articleHash;
export const TEST_ARTICLE1_SECOND_VERSION_HASH_URL = '0x' + TEST_ARTICLE_1_SECOND_VERSION.url;


export const TEST_ARTICLE_2 = {
  articleHash:
    '551aa99a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  url: 'article2.url',
  authors:
    [
      '0x8a19ee7f2f65da61e288455d33baeea283b9ea97',
      '0xc81c582875967d6d134ebe513c2a79b4490f6ecb'
    ],
  contributorRatios:
    [2000, 8000],
  linkedArticles:
    [
      '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
      '45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
      'd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
    ],
  linkedArticlesSplitRatios:
    [2000, 2000, 6000]
};


export const TEST_ARTICLE_2_DATA_IN_HEX = getArticleHex(web3, TEST_ARTICLE_2);
export const TEST_ARTICLE_2_HASH_HEX = '0x' + TEST_ARTICLE_2.articleHash;


export const REVIEW_1 = {
  reviewHash:
    '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  reviewText: 'This is the test-text for the review or reviewer 1',
  score1: 3,
  score2: 5,
  articleHasMajorIssues: false,
  articleHasMinorIssues: true
};
export const REVIEW_1_HASH_HEX = '0x' + REVIEW_1.reviewHash;
export const REVIEW_1_CORRECTED = {
  reviewHash:
    '111aa57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  reviewText: 'Corrected version of review2',
  score1: 3,
  score2: 3,
  articleHasMajorIssues: false,
  articleHasMinorIssues: false
};

export const REVIEW_2 = {
  reviewHash:
    '222ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  reviewText: 'That one is the second review. So it comes from reviewer2',
  score1: 1,
  score2: 1,
  articleHasMajorIssues: false,
  articleHasMinorIssues: true
};
export const REVIEW_2_HASH_HEX = '0x' + REVIEW_2.reviewHash;

export const REVIEW_3 = {
  reviewHash:
    '333cc57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  reviewText: 'Third review. So it comes from reviewer3',
  score1: 4,
  score2: 4,
  articleHasMajorIssues: false,
  articleHasMinorIssues: true
};
export const REVIEW_3_HASH_HEX = '0x' + REVIEW_3.reviewHash;

export const REVIEW_4 = {
  reviewHash:
    '444cc57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  reviewText: 'Fourth review which will get accepted',
  score1: 2,
  score2: 2,
  articleHasMajorIssues: false,
  articleHasMinorIssues: false
};
export const REVIEW_4_HASH_HEX = '0x' + REVIEW_4.reviewHash;
