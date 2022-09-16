// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Mjolnir replaces other RBAC methods and allows for upgradability with
//multi-versioning support and node contracts to dictate roles further.
//Mjolnir Oracle role is meant to be used with an automated account.
abstract contract MjolnirRBAC {
    mapping(address => bool) internal _thors;

    modifier onlyThor() {
        require(
            _thors[msg.sender] == true || address(this) == msg.sender,
            "Caller cannot wield Mjolnir"
        );
        _;
    }

    function addThor(address _thor)
        external
        onlyOwner
    {
        _thors[_thor] = true;
    }

    function delThor(address _thor)
        external
        onlyOwner
    {
        delete _thors[_thor];
    }

    function disableThor(address _thor)
        external
        onlyOwner
    {
        _thors[_thor] = false;
    }

    function isThor(address _address)
        external
        view
        returns (bool allowed)
    {
        allowed = _thors[_address];
    }

    function toAsgard() external onlyThor {
        delete _thors[msg.sender];
    }
    //Oracle-Role
    mapping(address => bool) internal _oracles;

    modifier onlyOracle() {
        require(
            _oracles[msg.sender] == true || address(this) == msg.sender,
            "Caller is not the Oracle"
        );
        _;
    }

    function addOracle(address _oracle)
        external
        onlyOwner
    {
        _oracles[_oracle] = true;
    }

    function delOracle(address _oracle)
        external
        onlyOwner
    {
        delete _oracles[_oracle];
    }

    function disableOracle(address _oracle)
        external
        onlyOwner
    {
        _oracles[_oracle] = false;
    }

    function isOracle(address _address)
        external
        view
        returns (bool allowed)
    {
        allowed = _oracles[_address];
    }

    function relinquishOracle() external onlyOracle {
        delete _oracles[msg.sender];
    }
    //Ownable-Compatability
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    constructor() {
        _transferOwnership(_msgSender());
    }
    function owner() public view virtual returns (address) {
        return _owner;
    }
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    //contextCompatability
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

interface ICarDB {
//RarityOrgDB
function mapcarT2(uint256 slot, uint256 carID) external;
function mapcarT3(uint256 slot, uint256 carID) external;
function mapcarT4(uint256 slot, uint256 carID) external;
function mapcarT5(uint256 slot, uint256 carID) external;
function mapcarT6(uint256 slot, uint256 carID) external;
function mapcarT7(uint256 slot, uint256 carID) external;
function t2Index(uint256 index) external view returns(uint256);
function t3Index(uint256 index) external view returns(uint256);
function t4Index(uint256 index) external view returns(uint256);
function t5Index(uint256 index) external view returns(uint256);
function t6Index(uint256 index) external view returns(uint256);
function t7Index(uint256 index) external view returns(uint256);
//-------------------------------------------------------------------
//SETS
function pushName(uint256 id, string memory newName) external;
function pushTier(uint256 id, uint256 value) external;
function pushDuration(uint256 id, uint256 value) external;
function pushSpeed(uint256 id, uint256 value) external;
function pushAcc(uint256 id, uint256 value) external;
function pushSteer(uint256 id, uint256 value) external;
function pushDrift(uint256 id, uint256 value) external;
function pushGetNitro(uint256 id, uint256 value) external;
function pushNitroBoost(uint256 id, uint256 value) external;
function pushProlong(uint256 id, uint256 value) external;
function fullSet(uint256 id,
string memory nme, uint256 tr,
uint256 du, uint256 sp,  uint256 acc,
uint256 st, uint256 df, uint256 gn,
uint256 nb, uint256 pl) external;
//GETS
function getName(uint256 id) external view returns(string memory);
function getTier(uint256 id) external view returns(uint256);
function getDuration(uint256 id) external view returns(uint256);
function getSpeed(uint256 id) external view returns(uint256);
function getAcc(uint256 id) external view returns(uint256);
function getSteer(uint256 id) external view returns(uint256);
function getDrift(uint256 id) external view returns(uint256);
function getGetNitro(uint256 id) external view returns(uint256);
function getNitroBoost(uint256 id) external view returns(uint256);
function getProlong(uint256 id) external view returns(uint256);
}

contract crosschainRallyDBA is MjolnirRBAC {

    uint256 public t2count = 0;
    uint256 public t3count = 0;
    uint256 public t4count = 0;
    uint256 public t5count = 0;
    uint256 public t6count = 0;
    uint256 public t7count = 0;
    address public carDB = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    ICarDB db = ICarDB(carDB);

function addCar(uint256 sftID, string memory cName, uint256 cDuration, uint256 cSpeed, 
uint256 cAcceleration, uint256 cSteer, uint256 cDrift,
uint256 cEarnNitro, uint256 cBoostNitro, uint256 cProlong)
external onlyThor {
    db.fullSet(sftID, cName, 0, cDuration,
    cSpeed, cAcceleration, cSteer, cDrift, 
    cEarnNitro, cBoostNitro, cProlong);
}

function setT2(uint256 sftID) public onlyThor {
    db.pushTier(sftID,2);
    t2count++;
    db.mapcarT2(t2count,sftID);
}
function setT3(uint256 sftID) external onlyThor {
    db.pushTier(sftID,3);
    t3count++;
    db.mapcarT3(t3count,sftID);
}
function setT4(uint256 sftID) external onlyThor {
    db.pushTier(sftID,4);
    t4count++;
    db.mapcarT4(t4count,sftID);
}
function setT5(uint256 sftID) external onlyThor {
    db.pushTier(sftID,5);
    t5count++;
    db.mapcarT5(t5count,sftID);
}
function setT6(uint256 sftID) external onlyThor {
    db.pushTier(sftID,6);
    t6count++;
    db.mapcarT6(t6count,sftID);
}
function setT7(uint256 sftID) external onlyThor {
    db.pushTier(sftID,7);
    t7count++;
    db.mapcarT7(t7count,sftID);
}
function setCarDB(address dbAddr) external onlyThor {
    carDB = dbAddr;
}
}