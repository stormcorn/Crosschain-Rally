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

interface IMjolnir1155 {
//Mjolnir1155interface
  function mint(address _to, uint _id, uint _amount) external;
//IERC1155
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );
}

contract CCRinitialSale is MjolnirRBAC {

    uint256 public sBoxCap = 350;
    uint256 public gBoxCap = 350;
    uint256 public fBoxCap = 300;
    uint256 public sBoxM = 0;
    uint256 public gBoxM = 0;
    uint256 public fBoxM = 0;
    uint256 public sBoxPrice = 1;
    uint256 public gBoxPrice = 1;
    uint256 public fBoxPrice = 1;
    address public carBase = 0xE3CED1e769bB4BD79e63c8A00E3cCd4DB952a95d;
    IMjolnir1155 bs = IMjolnir1155(carBase);

  function buySilver(address account) external payable {
    require(tx.origin == msg.sender);
    require(sBoxM++ <= sBoxCap);
    require(msg.value >= sBoxPrice * 1e18, "Not enough funds");
	requestMixup();
    sBoxM++;
	bs.mint(
		account,
	    random1(1,2),
		1
		);
	}

  function buyGold(address account) external payable {
    require(tx.origin == msg.sender);
    require(gBoxM++ <= gBoxCap);
    require(msg.value >= gBoxPrice * 1e18, "Not enough funds");
	requestMixup();
    gBoxM++;
	bs.mint(
		account,
		random1(1,4),
		1
		);
	}

  function buyFlame(address account) external payable {
    require(tx.origin == msg.sender);
    require(fBoxM++ <= fBoxCap);
    require(msg.value >= fBoxPrice * 1e18, "Not enough funds");
	requestMixup();
    fBoxM++;
	bs.mint(
		account,
		random1(1,6),
		1
		);
	}

  function setCaps(uint256 sb, uint256 gb, uint256 fb) external onlyThor {
      sBoxCap = sb;
      gBoxCap = gb;
      fBoxCap = fb;
  }

  function setCarSftAddr(address carAddr) external onlyThor {
      carBase = carAddr;
  }

  function setPrices(uint256 sp, uint256 gp, uint256 fp) external onlyThor {
      sBoxPrice = sp;
      gBoxPrice = gp;
      fBoxPrice = fp;
  }

  function ethBal() public view returns(uint256) {
      return address(this).balance;
  }

  function withdraw(uint256 amount) public onlyThor {
        payable(owner()).transfer(amount);
  }

  function withdrawAll() public onlyThor {
        payable(owner()).transfer(ethBal());
  }
//Not For long-term-use
//Will Replace with Full LiquidRNG Post-Presale
//Mini LiquidRNG Snap-in
    uint256 private seed1 = 11233298312348491934;
    uint256 public rStep = 23513;
    uint256 private rJump = 972;
    uint256 private extEnt = 12461478643531556351412;
    address private envEnt1 = 0xc9219731ADFA70645Be14cD5d30507266f2092c5;
    address private envEnt2 = 0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23;
    address private envEnt3 = 0x8995909DC0960FC9c75B6031D683124a4016825b;

    function random1(uint256 mod, uint256 demod) public view returns(uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, seed1,
            rStep * 2345, envEnt3.balance, envEnt2.balance, envEnt1.balance, msg.sender, tx.origin, extEnt))) % mod + demod;
    }

    function requestMixup() internal {
        rStep = rStep + rJump + envEnt1.balance;
    }

    function seedChange(uint256 NS1) external onlyOwner {
        seed1 = NS1;
    }

    function resetStepJump(uint256 newStep, uint256 newJump) external onlyOwner {
        rStep = newStep;
        rJump = newJump;
    }

    function setExtEnt(uint256 newExEnt) external onlyOwner {
        extEnt = newExEnt;
    }

}