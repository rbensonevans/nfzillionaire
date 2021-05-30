pragma solidity >=0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFZRealEstate is ERC721 {
    constructor() ERC721("NFZRealEstate", "NFZ") public {
      _tokenId["__NFZRealEstate__"] = 0; // initialize the count.
    }

    mapping(uint256 => string) private _CIDS;
    mapping(string => uint256) private _tokenId;

    function CID(uint256 tokenId) public view returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: CID query for nonexistent token");

      string memory _CID = _CIDS[tokenId];

      return _CID;
    }

    function _setTokenCID(uint256 tokenId, string memory _CID) internal virtual {
      require(_exists(tokenId), "ERC721Metadata: CID set of nonexistent token");
      _CIDS[tokenId] = _CID;
    }


    function mint(string memory _CID) public {
      _tokenId["__NFZRealEstate__"] += 1;
      uint256 _newId =  _tokenId["__NFZRealEstate__"];
      _safeMint(msg.sender, _newId);
      _setTokenCID(_newId, _CID);
    }
}