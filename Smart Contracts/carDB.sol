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
//Full Database implementation on chain
contract carStorage is MjolnirRBAC {
//General car data unique to the model
  struct CarSpecs {
    string name;
    uint256 tier;
    uint256 duration;
    uint256 speed;
    uint256 accelerate;
	uint256 steer;
	uint256 drift;
	uint256 getNitro;
	uint256 nitroBoost;
	uint256 prolong;
  }

  mapping(uint256 => CarSpecs) car;

//RarityOrgDB
//Sorts car ID by rarity
  mapping(uint256 => uint256) t2c;
  mapping(uint256 => uint256) t3c;
  mapping(uint256 => uint256) t4c;
  mapping(uint256 => uint256) t5c;
  mapping(uint256 => uint256) t6c;
  mapping(uint256 => uint256) t7c;

function mapcarT2(uint256 slot, uint256 carID) external onlyThor {
    t2c[slot] = carID;
}

function mapcarT3(uint256 slot, uint256 carID) external onlyThor {
    t3c[slot] = carID;
}

function mapcarT4(uint256 slot, uint256 carID) external onlyThor {
    t4c[slot] = carID;
}

function mapcarT5(uint256 slot, uint256 carID) external onlyThor {
    t5c[slot] = carID;
}

function mapcarT6(uint256 slot, uint256 carID) external onlyThor {
    t6c[slot] = carID;
}

function mapcarT7(uint256 slot, uint256 carID) external onlyThor {
    t7c[slot] = carID;
}

function t2Index(uint256 index) external view returns(uint256) {
    return t2c[index];
}

function t3Index(uint256 index) external view returns(uint256) {
    return t3c[index];
}

function t4Index(uint256 index) external view returns(uint256) {
    return t4c[index];
}

function t5Index(uint256 index) external view returns(uint256) {
    return t5c[index];
}

function t6Index(uint256 index) external view returns(uint256) {
    return t6c[index];
}

function t7Index(uint256 index) external view returns(uint256) {
    return t7c[index];
}
//-------------------------------------------------------------------
//SETS
function pushName(uint256 id, string memory newName) public onlyThor {
    car[id].name = newName;
}

function pushTier(uint256 id, uint256 value) public onlyThor {
    car[id].tier = value;
}

function pushDuration(uint256 id, uint256 value) public onlyThor {
    car[id].duration = value;
}

function pushSpeed(uint256 id, uint256 value) public onlyThor {
    car[id].speed = value;
}

function pushAcc(uint256 id, uint256 value) public onlyThor {
    car[id].accelerate = value;
}

function pushSteer(uint256 id, uint256 value) public onlyThor {
    car[id].steer = value;
}

function pushDrift(uint256 id, uint256 value) public onlyThor {
    car[id].drift = value;
}

function pushGetNitro(uint256 id, uint256 value) public onlyThor {
    car[id].getNitro = value;
}

function pushNitroBoost(uint256 id, uint256 value) public onlyThor {
    car[id].nitroBoost = value;
}

function pushProlong(uint256 id, uint256 value) public onlyThor {
    car[id].prolong = value;
}

function fullSet(uint256 id,
string memory nme, uint256 tr,
uint256 du, uint256 sp,  uint256 acc,
uint256 st, uint256 df, uint256 gn,
uint256 nb, uint256 pl) external onlyThor {
    car[id].name = nme;    
    car[id].tier = tr;
    car[id].duration = du;
    car[id].speed = sp;
    car[id].accelerate = acc;
    car[id].steer = st;
    car[id].drift = df;
    car[id].getNitro = gn;
    car[id].nitroBoost = nb;
    car[id].prolong = pl;
}

//GETS

function getName(uint256 id) public view returns(string memory) {
    return car[id].name;
}

function getTier(uint256 id) public view returns(uint256) {
    return car[id].tier;
}

function getDuration(uint256 id) public view returns(uint256) {
    return car[id].duration;
}

function getSpeed(uint256 id) public view returns(uint256) {
    return car[id].speed;
}

function getAcc(uint256 id) public view returns(uint256) {
    return car[id].accelerate;
}

function getSteer(uint256 id) public view returns(uint256) {
    return car[id].steer;
}

function getDrift(uint256 id) public view returns(uint256) {
    return car[id].drift;
}

function getGetNitro(uint256 id) public view returns(uint256) {
    return car[id].getNitro;
}

function getNitroBoost(uint256 id) public view returns(uint256) {
    return car[id].nitroBoost;
}

function getProlong(uint256 id) public view returns(uint256) {
    return car[id].prolong;
}

function queryStats(uint256 id) external view returns(string memory kName,
uint256 kTier, uint256 kDuration, uint256 kSpeed, uint256 kDrift,
uint256 kGetNitro, uint256 kNitroBoost, uint256 kProlong) {
    kName = getName(id);
    kTier = getTier(id);
    kDuration = getDuration(id);
    kSpeed = getSpeed(id);
    kDrift = getDrift(id);
    kGetNitro = getGetNitro(id);
    kNitroBoost = getNitroBoost(id);
    kProlong = getProlong(id);
}
}