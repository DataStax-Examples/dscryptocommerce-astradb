// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @custom:security-contact shlok.mange@outlook.com
contract NFT is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    struct SaleData {
        address payable seller_address;
        address payable buyer_address;
        uint256 price;
        uint256 status;
        uint256 seller_collateral;
        uint256 buyer_collateral;
    }
    
    mapping(uint256 => SaleData) public saleDetails;
    constructor() ERC721("MyToken", "MTK") {}

    event ListedItem(uint256 time, uint256 tokenId);
    event BidItem(uint256 time, uint256 tokenId);
    event ShippedItem(uint256 time, uint256 tokenId);
    event ReceivedItem(uint256 time, uint256 tokenId);

    function safeMint(address to, string memory uri) public returns(uint256){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    modifier isNotListed(uint256 tokenId){
        require(saleDetails[tokenId].status == 0);
        _;
    }

    modifier isListed(uint256 tokenId){
        require(saleDetails[tokenId].status == 1);
        _;
    }

    modifier isBid(uint256 tokenId){
        require(saleDetails[tokenId].status == 2);
        _;
    }

    modifier isShipped(uint256 tokenId){
        require(saleDetails[tokenId].status == 3);
        _;
    }

    // seller lists nft
    function listNft(uint256 _price, string memory _productId) public payable returns(uint256){
        require(msg.value >= ((_price / 4)),"Please lockin 25% of selling price");
        uint256 tokenId = safeMint(msg.sender, _productId);
        saleDetails[tokenId].seller_address = payable(msg.sender);
        saleDetails[tokenId].price = _price;
        saleDetails[tokenId].seller_collateral = msg.value;
        saleDetails[tokenId].status = 1;
        emit ListedItem(block.timestamp, tokenId);
        return tokenId;
    }

    // buyer places bid on nft
    function bidNft(uint256 tokenId) public payable isListed(tokenId){
        require(msg.value >= (saleDetails[tokenId].price + saleDetails[tokenId].price / 4));
        saleDetails[tokenId].buyer_address = payable(msg.sender);
        saleDetails[tokenId].status = 2;
        saleDetails[tokenId].buyer_collateral = msg.value;
        emit BidItem(block.timestamp, tokenId);
    }

    // seller ships nft
    function shipNft(uint tokenId) payable public isBid(tokenId){
        require(saleDetails[tokenId].seller_address == msg.sender);
        (bool sent, ) = saleDetails[tokenId].seller_address.call{value: saleDetails[tokenId].seller_collateral }("");
        require(sent, "Failed to send Ether");
        saleDetails[tokenId].seller_collateral = 0;
        safeTransferFrom(msg.sender, saleDetails[tokenId].buyer_address, tokenId);
        saleDetails[tokenId].status = 3;
        emit ShippedItem(block.timestamp, tokenId);
    }

    // buyer receives nft
    function receiveNft(uint tokenId) payable public isShipped(tokenId){
        require(saleDetails[tokenId].buyer_address == msg.sender);
        uint256 buyer_collateral = (saleDetails[tokenId].price / 4);
        uint256 sell_price = saleDetails[tokenId].buyer_collateral - buyer_collateral;
        (bool sent, ) = saleDetails[tokenId].seller_address.call{value: sell_price}("");
        require(sent, "Failed to send Ether");
        (bool sentBuyer, ) = msg.sender.call{value: buyer_collateral}("");
        require(sentBuyer, "Failed to send Ether");
        saleDetails[tokenId].buyer_collateral = 0;
        saleDetails[tokenId].status = 4;
        emit ReceivedItem(block.timestamp, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}