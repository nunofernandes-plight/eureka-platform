export const PLATFORM_KOVAN_ABI =
  [{
    'constant': true,
    'inputs': [{'name': 'hash', 'type': 'bytes32'}],
    'name': 'getAuthors',
    'outputs': [{'name': 'authors', 'type': 'address[]'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0x0347efd2'
  }, {
    'constant': false,
    'inputs': [{'name': '_from', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}, {
      'name': '_articleHash',
      'type': 'bytes32'
    }, {'name': '_articleURL', 'type': 'bytes32'}, {
      'name': '_authors',
      'type': 'address[]'
    }, {'name': '_authorContributionRatios', 'type': 'uint16[]'}, {
      'name': '_linkedArticles',
      'type': 'bytes32[]'
    }, {'name': '_linkedArticlesSplitRatios', 'type': 'uint16[]'}],
    'name': 'startSubmissionProcess',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x0861681c'
  }, {
    'constant': false,
    'inputs': [{'name': '_submissionId', 'type': 'uint256'}, {
      'name': '_articleHash',
      'type': 'bytes32'
    }, {'name': '_articleURL', 'type': 'bytes32'}, {
      'name': '_authors',
      'type': 'address[]'
    }, {'name': '_authorContributionRatios', 'type': 'uint16[]'}, {
      'name': '_linkedArticles',
      'type': 'bytes32[]'
    }, {'name': '_linkedArticlesSplitRatios', 'type': 'uint16[]'}],
    'name': 'openNewReviewRound',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x0e98e3dc'
  }, {
    'constant': true,
    'inputs': [{'name': 'hash', 'type': 'bytes32'}],
    'name': 'getLinkedArticles',
    'outputs': [{'name': 'linkedArticles', 'type': 'bytes32[]'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0x1a1d4d67'
  }, {
    'constant': true,
    'inputs': [{'name': '', 'type': 'uint256'}],
    'name': 'articleSubmissions',
    'outputs': [{'name': 'submissionId', 'type': 'uint256'}, {
      'name': 'submissionState',
      'type': 'uint8'
    }, {'name': 'stateTimestamp', 'type': 'uint256'}, {'name': 'submissionOwner', 'type': 'address'}, {
      'name': 'editor',
      'type': 'address'
    }],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0x1a2a8361'
  }, {
    'constant': true,
    'inputs': [{'name': '', 'type': 'bytes32'}, {'name': '', 'type': 'address'}],
    'name': 'reviews',
    'outputs': [{'name': 'articleHash', 'type': 'bytes32'}, {
      'name': 'reviewer',
      'type': 'address'
    }, {'name': 'isEditorApprovedReview', 'type': 'bool'}, {
      'name': 'reviewState',
      'type': 'uint8'
    }, {'name': 'stateTimestamp', 'type': 'uint256'}, {
      'name': 'reviewHash',
      'type': 'bytes32'
    }, {'name': 'reviewedTimestamp', 'type': 'uint256'}, {
      'name': 'articleHasMajorIssues',
      'type': 'bool'
    }, {'name': 'articleHasMinorIssues', 'type': 'bool'}, {'name': 'score1', 'type': 'uint8'}, {
      'name': 'score2',
      'type': 'uint8'
    }, {'name': 'reviewedBy', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0x1ca587f1'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}, {
      'name': '_reviewHash',
      'type': 'bytes32'
    }, {'name': '_articleHasMajorIssues', 'type': 'bool'}, {
      'name': '_articleHasMinorIssues',
      'type': 'bool'
    }, {'name': '_score1', 'type': 'uint8'}, {'name': '_score2', 'type': 'uint8'}],
    'name': 'addEditorApprovedReview',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x39eb8a60'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}],
    'name': 'acceptReviewInvitation',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x488edaf5'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}, {'name': '_reviewerAddress', 'type': 'address'}],
    'name': 'acceptReview',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x48e102b1'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}, {'name': '_reviewerAddress', 'type': 'address'}],
    'name': 'declineReview',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x4f28098d'
  }, {
    'constant': false,
    'inputs': [{'name': '_submissionId', 'type': 'uint256'}],
    'name': 'declineNewReviewRound',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x67a28d0c'
  }, {
    'constant': false,
    'inputs': [{'name': '_submissionId', 'type': 'uint256'}],
    'name': 'removeEditorFromSubmissionProcess',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x7756f3ca'
  }, {
    'constant': false,
    'inputs': [{'name': 'editor', 'type': 'address'}],
    'name': 'signUpEditor',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x8b416a04'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}, {
      'name': '_reviewHash',
      'type': 'bytes32'
    }, {'name': '_articleHasMajorIssues', 'type': 'bool'}, {
      'name': '_articleHasMinorIssues',
      'type': 'bool'
    }, {'name': '_score1', 'type': 'uint8'}, {'name': '_score2', 'type': 'uint8'}],
    'name': 'correctReview',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0x9e6ac42e'
  }, {
    'constant': true,
    'inputs': [{'name': '', 'type': 'address'}],
    'name': 'isEditor',
    'outputs': [{'name': '', 'type': 'bool'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0xa0748154'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}],
    'name': 'sanityIsOk',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xa4d6bd70'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}],
    'name': 'declineArticleVersion',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xb0dbb693'
  }, {
    'constant': false,
    'inputs': [{'name': '_submissionId', 'type': 'uint256'}, {'name': '_newEditor', 'type': 'address'}],
    'name': 'changeEditorFromSubmissionProcess',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xb5af63d0'
  }, {
    'constant': true,
    'inputs': [{'name': '', 'type': 'bytes32'}],
    'name': 'articleVersions',
    'outputs': [{'name': 'submissionId', 'type': 'uint256'}, {
      'name': 'articleHash',
      'type': 'bytes32'
    }, {'name': 'publishedTimestamp', 'type': 'uint256'}, {
      'name': 'articleUrl',
      'type': 'bytes32'
    }, {'name': 'versionState', 'type': 'uint8'}, {'name': 'stateTimestamp', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0xb79bf24a'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}],
    'name': 'acceptArticleVersion',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xbe447e23'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}],
    'name': 'sanityIsNotOk',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xc6670f77'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'contractOwner',
    'outputs': [{'name': '', 'type': 'address'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0xce606ee0'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}, {
      'name': '_reviewHash',
      'type': 'bytes32'
    }, {'name': '_articleHasMajorIssues', 'type': 'bool'}, {
      'name': '_articleHasMinorIssues',
      'type': 'bool'
    }, {'name': '_score1', 'type': 'uint8'}, {'name': '_score2', 'type': 'uint8'}],
    'name': 'addCommunityReview',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xcf107da0'
  }, {
    'constant': false,
    'inputs': [{'name': '_articleHash', 'type': 'bytes32'}, {
      'name': '_allowedEditorApprovedReviewers',
      'type': 'address[]'
    }],
    'name': 'inviteReviewers',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xd4b08631'
  }, {
    'constant': true,
    'inputs': [],
    'name': 'submissionFee',
    'outputs': [{'name': '', 'type': 'uint256'}],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
    'signature': '0xe8888942'
  }, {
    'constant': false,
    'inputs': [{'name': '_submissionId', 'type': 'uint256'}],
    'name': 'assignForSubmissionProcess',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
    'signature': '0xf45e3831'
  }, {
    'inputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor',
    'signature': 'constructor'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'submissionOwner', 'type': 'address'}, {
      'indexed': false,
      'name': 'editorAddress',
      'type': 'address'
    }, {'indexed': false, 'name': 'stateTimestamp', 'type': 'uint256'}],
    'name': 'EditorSignUp',
    'type': 'event',
    'signature': '0x59e375793fc07fd3d48048d046293e6cc5a2a4f3189125e6ac9435cafc4f748d'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'submissionId', 'type': 'uint256'}, {
      'indexed': false,
      'name': 'submissionOwner',
      'type': 'address'
    }, {'indexed': false, 'name': 'articleHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'articleURL',
      'type': 'bytes32'
    }, {'indexed': false, 'name': 'stateTimestamp', 'type': 'uint256'}],
    'name': 'SubmissionProcessStart',
    'type': 'event',
    'signature': '0x0becefdf423544183ac9b2723854990c420c6a76a716db851f272d9aa52c538b'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'assignerAddress', 'type': 'address'}, {
      'indexed': false,
      'name': 'submissionId',
      'type': 'uint256'
    }],
    'name': 'AssignmentForSubmissionProcess',
    'type': 'event',
    'signature': '0x2dc1d4ab69cc557368a57eb5141ddc86c17e6fa1cc1d6e1f3b028c5ab0275873'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'submissionId', 'type': 'uint256'}],
    'name': 'RemovedEditorFromSubmission',
    'type': 'event',
    'signature': '0x706632157ede592964c08b64433bd5d1931bdf554dd30ffc72d614a7c6b56f39'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'submissionId', 'type': 'uint256'}, {
      'indexed': false,
      'name': 'newEditor',
      'type': 'address'
    }],
    'name': 'ChangedEditorFromSubmission',
    'type': 'event',
    'signature': '0xb8a265f3ab259129fbc5823fb183af940c223a696df489466b98ff5087c40f7f'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'submissionId', 'type': 'uint256'}, {
      'indexed': false,
      'name': 'articleHash',
      'type': 'bytes32'
    }],
    'name': 'SanityIsOk',
    'type': 'event',
    'signature': '0x22bd843312221ae1f88e77ad6db9632a70f9efccaf04d7cb2cdb5a808e57694f'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'submissionId', 'type': 'uint256'}, {
      'indexed': false,
      'name': 'articleHash',
      'type': 'bytes32'
    }],
    'name': 'SanityIsNotOk',
    'type': 'event',
    'signature': '0xf5c6ab01155850e938046e0dd1b482dcb03da63505cdc3ec11527d187a7e65eb'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'submissionId', 'type': 'uint256'}, {
      'indexed': false,
      'name': 'articleHash',
      'type': 'bytes32'
    }, {'indexed': false, 'name': 'editorApprovedReviewers', 'type': 'address[]'}, {
      'indexed': false,
      'name': 'stateTimestamp',
      'type': 'uint256'
    }],
    'name': 'ReviewersAreInvited',
    'type': 'event',
    'signature': '0xac71a5d2e29bf5e5981382f654a3f79aec10c2bc53e632f5746f97ca1ff1ace9'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'articleHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'reviewerAddress',
      'type': 'address'
    }, {'indexed': false, 'name': 'stateTimestamp', 'type': 'uint256'}],
    'name': 'InvitationIsAccepted',
    'type': 'event',
    'signature': '0x0e53b027fa3cfdae54cd51a95d6cb021514064c8472ee8d25b6628cbdbf7199b'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'articleHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'stateTimestamp',
      'type': 'uint256'
    }, {'indexed': false, 'name': 'reviewHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'articleHasMajorIssues',
      'type': 'bool'
    }, {'indexed': false, 'name': 'articleHasMinorIssues', 'type': 'bool'}, {
      'indexed': false,
      'name': 'score1',
      'type': 'uint8'
    }, {'indexed': false, 'name': 'score2', 'type': 'uint8'}],
    'name': 'EditorApprovedReviewIsAdded',
    'type': 'event',
    'signature': '0xb8da6b5b31b21fe7416b771e1ffa5b1849463228c865c50760cb4bd300830a1c'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'articleHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'stateTimestamp',
      'type': 'uint256'
    }, {'indexed': false, 'name': 'reviewHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'articleHasMajorIssues',
      'type': 'bool'
    }, {'indexed': false, 'name': 'articleHasMinorIssues', 'type': 'bool'}, {
      'indexed': false,
      'name': 'score1',
      'type': 'uint8'
    }, {'indexed': false, 'name': 'score2', 'type': 'uint8'}],
    'name': 'CommunityReviewIsAdded',
    'type': 'event',
    'signature': '0x5d415802c0f9a39f998599951d46a19a251637fabd74efa12befdb4b4134d2d7'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'articleHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'stateTimestamp',
      'type': 'uint256'
    }, {'indexed': false, 'name': 'reviewHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'articleHasMajorIssues',
      'type': 'bool'
    }, {'indexed': false, 'name': 'articleHasMinorIssues', 'type': 'bool'}, {
      'indexed': false,
      'name': 'score1',
      'type': 'uint8'
    }, {'indexed': false, 'name': 'score2', 'type': 'uint8'}],
    'name': 'ReviewIsCorrected',
    'type': 'event',
    'signature': '0xa0575863c4f821c3c94781a76b545f8f00441a9d96af065d8761013610749a6c'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'articleHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'stateTimestamp',
      'type': 'uint256'
    }, {'indexed': false, 'name': 'reviewer', 'type': 'address'}],
    'name': 'ReviewIsAccepted',
    'type': 'event',
    'signature': '0x241fdf651b9d96a04e51a030b7afa60cd4e947f3ceb73546541f96e37d9106bd'
  }, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'name': 'articleHash', 'type': 'bytes32'}, {
      'indexed': false,
      'name': 'stateTimestamp',
      'type': 'uint256'
    }, {'indexed': false, 'name': 'reviewer', 'type': 'address'}],
    'name': 'ReviewIsDeclined',
    'type': 'event',
    'signature': '0x7c6fa887a8eb5289373626a4029c8dcfb65948e6adf6d2599c871ce23afcd2fd'
  }];