// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title EvidenceRegistry
 * @notice Production-grade on-chain Digital Evidence Management System.
 * @dev Evidence hashes are immutable after registration. Custody transfers
 *      are tracked via events forming an auditable chain-of-custody log.
 *      Storage is packed for gas efficiency; custom errors save calldata gas.
 */
contract EvidenceRegistry {

    // ─────────────────────────────────────────────────────────────────────────
    // Types
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Canonical on-chain record for a single piece of digital evidence.
    /// @dev Packed into two 32-byte storage slots:
    ///      slot 0 → hash (bytes32)
    ///      slot 1 → owner (address, 20 bytes) + timestamp (uint96, 12 bytes)
    ///      uint96 is sufficient for timestamps until ~2.5 trillion AD.
    struct Evidence {
        bytes32 hash;       // keccak256 hash of the off-chain artefact
        address owner;      // current custodian
        uint96  timestamp;  // block.timestamp at registration (fits in uint96)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Auto-incrementing counter; also equals the ID of the last record.
    uint256 public evidenceCount;

    /// @dev evidenceId (1-based) → Evidence record.
    mapping(uint256 => Evidence) private _evidence;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Emitted when new evidence is registered.
     * @param id        Assigned evidence ID (1-based, monotonically increasing).
     * @param hash      keccak256 hash of the evidence artefact.
     * @param owner     Address that submitted / owns the evidence.
     * @param timestamp Block timestamp of registration.
     */
    event EvidenceAdded(
        uint256 indexed id,
        bytes32 indexed hash,
        address indexed owner,
        uint256         timestamp
    );

    /**
     * @notice Emitted on every custody transfer.
     * @param id            Evidence ID being transferred.
     * @param previousOwner Outgoing custodian.
     * @param newOwner      Incoming custodian.
     * @param timestamp     Block timestamp of the transfer.
     */
    event CustodyTransferred(
        uint256 indexed id,
        address indexed previousOwner,
        address indexed newOwner,
        uint256         timestamp
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Custom Errors  (cheaper than string reverts: no ABI encoding overhead)
    // ─────────────────────────────────────────────────────────────────────────

    error EvidenceNotFound(uint256 id);
    error Unauthorized(address caller, uint256 id);
    error ZeroHash();
    error ZeroAddress();
    error SameOwner();

    // ─────────────────────────────────────────────────────────────────────────
    // Modifiers
    // ─────────────────────────────────────────────────────────────────────────

    modifier exists(uint256 id) {
        if (id == 0 || id > evidenceCount) revert EvidenceNotFound(id);
        _;
    }

    modifier onlyCustodian(uint256 id) {
        if (_evidence[id].owner != msg.sender) revert Unauthorized(msg.sender, id);
        _;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // External Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Register new digital evidence on-chain.
     * @dev    The caller becomes the initial custodian.
     *         Reverts if `hash` is zero (prevents accidental blank registrations).
     * @param  hash keccak256 hash of the off-chain evidence file / data blob.
     * @return id   The newly assigned evidence ID (1-based).
     */
    function addEvidence(bytes32 hash) external returns (uint256 id) {
        if (hash == bytes32(0)) revert ZeroHash();

        // Unchecked: evidenceCount will never realistically overflow uint256.
        unchecked {
            id = ++evidenceCount;
        }

        _evidence[id] = Evidence({
            hash:      hash,
            owner:     msg.sender,
            timestamp: uint96(block.timestamp)
        });

        emit EvidenceAdded(id, hash, msg.sender, block.timestamp);
    }

    /**
     * @notice Retrieve the full evidence record for a given ID.
     * @param  id Evidence ID (must be in range [1, evidenceCount]).
     * @return    Evidence struct (hash, owner, timestamp).
     */
    function getEvidence(uint256 id)
        external
        view
        exists(id)
        returns (Evidence memory)
    {
        return _evidence[id];
    }

    /**
     * @notice Transfer custody of a registered evidence record to a new address.
     * @dev    Only the current custodian may call this function.
     *         Emits {CustodyTransferred}.
     * @param  id       Evidence ID.
     * @param  newOwner Address of the incoming custodian.
     */
    function transferCustody(uint256 id, address newOwner)
        external
        exists(id)
        onlyCustodian(id)
    {
        if (newOwner == address(0))         revert ZeroAddress();
        if (newOwner == _evidence[id].owner) revert SameOwner();

        address previous = _evidence[id].owner;
        _evidence[id].owner = newOwner;

        emit CustodyTransferred(id, previous, newOwner, block.timestamp);
    }

    /**
     * @notice Verify that a supplied hash matches the on-chain registered hash.
     * @dev    Pure integrity check — does not alter state.
     * @param  id   Evidence ID.
     * @param  hash Hash to verify.
     * @return      True if the hashes match; false otherwise.
     */
    function verifyEvidence(uint256 id, bytes32 hash)
        external
        view
        exists(id)
        returns (bool)
    {
        return _evidence[id].hash == hash;
    }
}
