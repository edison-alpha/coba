// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISoulboundToken {
    function isEligibleVoter(address _voter) external view returns (bool);
}

contract OnlineVoting {
    address private owner;
    ISoulboundToken private soulboundToken;

    constructor(address _soulboundTokenAddress) {
        owner = msg.sender;
        soulboundToken = ISoulboundToken(_soulboundTokenAddress);
    }

    struct Candidate {
        uint256 candidate_id;
        string candidate_name;
        uint256 candidate_voteCount;
        string candidate_img;
        uint256 candidate_age;
        string candidate_partyName;
        string candidate_partyLogo;
    }

    // total voters array
    address[] private votersArr;
    // Store account that have voted;
    mapping(address => bool) private voters;
    // Fetch candidates using mapping key=>value
    mapping(uint256 => Candidate) private candidate;
    uint256 private candidateCount = 0;

    event votedEvent(uint256 indexed _candidateId);
    event candidateEvent(string _message);

    uint256 private winnerId;
    
    bool private isResultDeclared;

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function addCandidate(
        string memory _name,
        uint256 _age,
        string memory _partyName,
        string memory _partyLogo,
        string memory _candidate_pic
    ) public onlyOwner {
        Candidate storage c = candidate[candidateCount];
        c.candidate_id = candidateCount;
        c.candidate_name = _name;
        c.candidate_voteCount = 0;
        c.candidate_age = _age;
        c.candidate_partyName = _partyName;
        c.candidate_partyLogo = _partyLogo;
        c.candidate_img = _candidate_pic;
        candidateCount++;
        emit candidateEvent("Candidate added to smart contract!");
    }

    function addVote(uint256 _candidateId) public {
        require(!voters[msg.sender], "You have already cast your vote");
        require(soulboundToken.isEligibleVoter(msg.sender), "You are not eligible to vote");
        require(_candidateId >= 0 && _candidateId < candidateCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidate[_candidateId].candidate_voteCount++;
        votersArr.push(msg.sender);
        emit votedEvent(_candidateId);
    }

    function findMaxVoteCandidate() public onlyOwner {
        uint256 max = 0;
        for (uint256 i = 0; i < candidateCount; i++) {
            if (candidate[i].candidate_voteCount > max) {
                max = candidate[i].candidate_voteCount;
                winnerId = i;
                isResultDeclared = true;
            }
        }
    }

    function getWinner() public view returns (Candidate memory) {
        require(isResultDeclared, "Result has not been declared yet");
        return candidate[winnerId];
    }

    function getCandidate() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        for (uint256 i = 0; i < candidateCount; i++) {
            allCandidates[i] = candidate[i];
        }
        return allCandidates;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getVoters() public view returns (address[] memory) {
        return votersArr;
    }

    function resultStatus() public view returns (bool) {
        return isResultDeclared;
    }
}
