// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Authentication {
    using ECDSA for bytes32;
    using Strings for uint256;

    // Mapping to store nonces for addresses
    mapping(address => uint256) public nonces;

    // Event to log the generation of a new challenge
    event ChallengeGenerated(address user, string challenge);

    // Function to generate a new challenge for the user
    function generateChallenge(address user) public returns (string memory) {
        uint256 nonce = nonces[user]++;
        string memory challenge = string(abi.encodePacked(
            "Login to World of Unreal",
            (uint256(uint160(user))).toHexString(),
            " to authenticate my identity. Nonce: ",
            nonce.toString(),
            ", Timestamp: ",
            block.timestamp.toString(),
            "."
        ));

        emit ChallengeGenerated(user, challenge);
        return challenge;
    }

    // Function to manually hash a message with Ethereum's prefixed message format
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    // Function to verify the signature
    function verify(address user, string memory challenge, bytes memory signature) public pure returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(challenge));
        bytes32 ethSignedHash = toEthSignedMessageHash(hash);

        // Recover the signer from the signature
        address signer = ethSignedHash.recover(signature);

        // Check if the signer matches the user's address
        return signer == user;
    }
}
