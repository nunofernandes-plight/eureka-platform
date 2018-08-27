const Utils = {
	testMint(contract, accounts, account0, account1, account2) {
		return contract.mint([accounts[0]], [account0], {from: accounts[0]
		}).then(retVal => {
			assert.equal(retVal.logs.length, 1, '1 minting events were fired');
			assert.equal(retVal.logs[0].args.value.valueOf(), account0, 'number of votes for account 0');
			return contract.mint([accounts[1], accounts[2]], [account1, account2], {from: accounts[0]});
		}).then(retVal => {
			assert.equal(retVal.logs.length, 2, '2 minting events were fired');
			assert.equal(retVal.logs[0].args.value.valueOf(), account1, 'number of votes for account 1');
			assert.equal(retVal.logs[1].args.value.valueOf(), account2, 'number of votes for account 2');
			return contract.setMintDone({from: accounts[0]});
		}).then(e => {
			return contract.showVotes.call(accounts[0], {from: accounts[0]});
		}).then(retVal => {
			assert.equal(account0, retVal.valueOf(), 'account0 minted wrong/vote');
			return contract.balanceOf.call(accounts[0], {from: accounts[1]});
		}).then(retVal => {
			assert.equal(account0, retVal.valueOf(), 'account0 minted wrong/balance');
			return contract.showVotes.call(accounts[1], {from: accounts[2]});
		}).then(retVal => {
			assert.equal(account1, retVal.valueOf(), 'account1 minted wrong/vote');
			return contract.balanceOf.call(accounts[1], {from: accounts[0]});
		}).then(retVal => {
			assert.equal(account1, retVal.valueOf(), 'account1 minted wrong/balance');
			return contract.showVotes.call(accounts[2], {from: accounts[0]});
		}).then(retVal => {
			assert.equal(account2, retVal.valueOf(), 'account2 minted wrong/vote');
			return contract.balanceOf.call(accounts[2], {from: accounts[1]});
		}).then(retVal => {
			assert.equal(account2, retVal.valueOf(), 'account2 minted wrong/balance');
		}).catch(err => {
			throw new Error(err);
		});
	},

	claimAndTestBonus(contract, account, expectedBonus) {
		let before;
		return contract.showBonus.call(account, {
			from: account
		}).then(retVal => {
			assert.equal(retVal.valueOf(), expectedBonus, 'expceted bonus');
			before = web3.toBigNumber(web3.eth.getBalance(account));
			return contract.claimBonus({from: account});
		}).then(retVal => {
			const txFee = web3.toBigNumber(web3.eth.getTransactionReceipt(retVal.tx).gasUsed).times(
				web3.toBigNumber(web3.eth.getTransaction(retVal.tx).gasPrice));
			const after = web3.toBigNumber(web3.eth.getBalance(account));
			assert.equal(after.minus(before.minus(txFee)).toNumber(), expectedBonus, 'bonus must match');
		}).catch(err => {
			throw new Error(err);
		});
	},

	testVote(contract, accounts, proposeAmount, voteAccount1, voteAccount2, increaseAccount2, vote1, vote2, resultAccount0) {
		return contract.votingProposal('https://', '0x123', proposeAmount, {
			from: accounts[0]
		}).then(retVal => {
			return contract.vote(vote1, {from: accounts[1]});
		}).then(retVal => {
			assert.equal(retVal.logs.length, 1, '1 event was fired from 1');
			assert.equal(retVal.logs[0].args.votes.valueOf(), voteAccount1, voteAccount1 + ' votes from 1');
			if (increaseAccount2 > 0) {
				return contract.transfer(accounts[2], increaseAccount2, {from: accounts[0]});
			}
			return contract.balanceOf.call(accounts[2], {from: accounts[1]});
		}).then(retVal => {
			if (increaseAccount2 > 0) {
				assert.equal(retVal.logs.length, 1, '1 transfer event fired');
				assert.equal(retVal.logs[0].args.value.valueOf(), increaseAccount2, increaseAccount2 + ' from account0 to account2 before votes');
			}
			return contract.vote(vote2, {from: accounts[2]});
		}).then(retVal => {
			assert.equal(retVal.logs.length, 1, '1 event was fired from 2');
			assert.equal(retVal.logs[0].args.votes.valueOf(), voteAccount2, voteAccount2 + ' votes from 2');
			module.exports.waitTwoWeeks();
			return contract.claimVotingProposal({from: accounts[0]});
		}).then(retVal => {
			return contract.balanceOf.call(accounts[0], {from: accounts[1]});
		}).then(retVal => {
			assert.equal(retVal.valueOf(), resultAccount0, 'account 0 with ' + resultAccount0 + 'tokens');
		}).catch(err => {
			throw new Error(err);
		});
	},

	testTokens(contract, accounts, locked, total, account0, account1) {
		return contract.lockedTokens.call({
			from: accounts[0]
		}).then(retVal => {
			assert.equal(locked, retVal.valueOf(), 'locked wrong');
			return contract.totalSupply.call({from: accounts[1]});
		}).then(retVal => {
			assert.equal(total, retVal.valueOf(), 'total wrong');
			return contract.balanceOf.call(accounts[0], {from: accounts[2]});
		}).then(retVal => {
			assert.equal(account0, retVal.valueOf(), 'account0 wrong');
			return contract.balanceOf.call(accounts[1], {from: accounts[3]});
		}).then(retVal => {
			assert.equal(account1, retVal.valueOf(), 'account1 wrong');
		}).catch(err => {
			throw new Error(err);
		});
	},

	testVotingPhaseStatus(contract, accounts, ongoing, active, over) {
		return contract.isVoteOngoing.call({
			from: accounts[0]
		}).then(retVal => {
			assert.equal(ongoing, retVal.valueOf(), 'ongoing flag wrong + (' + ongoing + ',' + active + ',' + over + ')');
			return contract.isProposalActive.call({from: accounts[2]});
		}).then(retVal => {
			assert.equal(active, retVal.valueOf(), 'active flag wrong: (' + ongoing + ',' + active + ',' + over + ')');
			return contract.isVotingPhaseOver.call({from: accounts[1]});
		}).then(retVal => {
			assert.equal(over, retVal.valueOf(), 'over flag wrong (' + ongoing + ',' + active + ',' + over + ')');
		}).catch(err => {
			throw new Error(err);
		});
	},

	waitTwoWeeks() {
		const twoWeeks = 2 * 7 * 24 * 60 * 60;
		web3.currentProvider.send({jsonrpc: '2.0', method: 'evm_increaseTime', params: [twoWeeks], id: 0});
	},

	wait90Days() {
		const ninetyDays = 90 * 24 * 60 * 60;
		web3.currentProvider.send({jsonrpc: '2.0', method: 'evm_increaseTime', params: [ninetyDays], id: 0});
	},

	wait548Days() {
		const ninetyDays = 548 * 24 * 60 * 60;
		web3.currentProvider.send({jsonrpc: '2.0', method: 'evm_increaseTime', params: [ninetyDays], id: 0});
	}
};
module.exports = Utils;
