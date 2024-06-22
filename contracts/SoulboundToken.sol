// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundToken is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public constant MAX_SUPPLY = 20;
    uint256 public totalSupply;

    mapping(address => bool) public hasMinted;
    mapping(address => bool) public eligibleVoter;

    constructor() ERC721("SoulboundToken", "SBT") {}

    function mintSoulbound() public {
        require(!hasMinted[msg.sender], "You have already minted your Soulbound token");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;
        eligibleVoter[msg.sender] = true;

        totalSupply = _tokenIdCounter; // Update total supply after minting
    }

    function isEligibleVoter(address _voter) public view returns (bool) {
        return eligibleVoter[_voter];
    }

    function hasMintedSoulbound(address _owner) external view returns (bool) {
        return hasMinted[_owner];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721) {
        require(from == address(0), "Token is soulbound and cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
