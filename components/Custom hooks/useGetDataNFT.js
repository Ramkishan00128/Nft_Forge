import stackContract from "./Contract";

import TOKEN_ABI from "../../utils/Config/TOKEN_ABI.json";
import STAKENFT_ABI from "../../utils/Config/STAKENFT_ABI.json";
import MULTI_NFT_STAKE_ABI from "../../utils/Config/MULTI_NFT_STAKE_ABI.json";

import { useState, useEffect } from "react";
import Web3 from "web3";
import { useAccount } from "wagmi";

const useGetData = (props) => {
  const NFT_STAKE = stackContract[props.index].address;
  const wallet = useAccount();

  const [modal, setModal] = useState(false);
  const [TransactionShow, setTranasctionShow] = useState(false);
  const [unStakeModal, SetunStakeModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [damount, setdAmount] = useState(0);
  const [status, setStatus] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [sTokenPrice, setsTokenPrice] = useState(0);
  const [stakefee, setstakefee] = useState(0);
  const [totalStaked, settotalStaked] = useState(0);
  const [nftSymbol, setNftSymbol] = useState("");
  const [stakeTokenAddress, setstakeTokenAddress] = useState("");
  const [approval, setApproval] = useState(0);
  const [claimAllowed, setClaimAllowed] = useState(false);
  const [userStaked, setUserStaked] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [depositAmount, setDepositAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [stakingAmount, setStakingAmount] = useState(0);
  const [stakingAmountOg, setStakingAmountOg] = useState(0);
  const [limit, setLimit] = useState(0);
  const [buyLink, setBuyLink] = useState("");
  const [depositError, setDepositError] = useState("");
  const [depositmodal, setDepositmodal] = useState(false);
  const depositToggle = () => setDepositmodal(!depositmodal);
  const [unstakeModal, setUnstakemodal] = useState(false);
  const unstakeToggle = () => setUnstakemodal(!unstakeModal);
  const [unstakeRedeemableModal, setunstakeRedeemableModal] = useState(false);
  const [stakeAllowed, setStakeAllowed] = useState(false);
  const [combination, setCombination] = useState(0);
  const [feeToken, setFeeToken] = useState(null);
  const [depositArray, setDepositArray] = useState([]);
  const unstakeToggleRedeemable = () => {
    setunstakeRedeemableModal(!unstakeRedeemableModal);
  };
  const [modalShow, setModalShow] = useState(false);

  let web3Provider;
  useEffect(() => {
    if (window.ethereum) {
      web3Provider = new Web3(window.ethereum);
    } else {
    }
  }, [wallet]);

  useEffect(() => {
    if (wallet.address) {
      initContracts();
      setInterval(function () {
        getTime();
      }, 1000);
    }
  }, [wallet.address]);

  const handleDepositChange = (n, v) => {
    depositArray && depositArray.pop();
    let _temp = depositArray;

    _temp.push(v);
    setDepositArray(_temp);
  };

  const handleDepositUnChange = () => {
    console.log(depositArray);

    setDepositArray(depositArray);
  };

  // const handleDepositChange2 = (n, v) => {
  //   let _temp = depositArray;
  //   console.log(_temp);
  //   _temp.pop(v);
  //   setDepositArray(_temp);
  // };

  async function depositToken() {
    setDepositError(false);
    if (balance <= stakefee) {
      setDepositError(
        "Insufficient Balance for fee. Please fund your wallet with some " +
          symbol +
          " Token and try again."
      );
      return false;
    }

    let _array = [];
    depositNow(depositArray);
  }

  async function depositNow(_array) {
    // _array.length === 0 && setToast1(!toast1);

    console.log("nft", _array);

    if (_array.length != limit) {
      setDepositError(
        "Invalid Deposit Selection. Please choose not more or less than " +
          limit +
          "  NFTs"
      );
      return false;
    }

    let _web3 = new Web3(web3Provider);
    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );

    console.log(_array);

    setModal(!modal);
    _stakeContract.methods
      .stakeNft(_array)
      .send({
        from: wallet.address,
      })
      .on("receipt", function (receipt) {
        setModalShow(!modalShow);
        // setModal(modal);
        depositToggle();
        initContracts();
      })
      .on("error", function (receipt) {
        setModalShow(!modalShow);
      });
  }

  const getTime = async () => {
    let _web3 = new Web3(web3Provider);
    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );
    let endTime;

    let _currentTime = new Date().getTime() / 1e3;
    let _unlockTime = 0;

    _unlockTime = await _stakeContract.methods
      .nftclaimtime(wallet.address)
      .call();

    if (_unlockTime > 0 && _currentTime < _unlockTime) {
      setClaimAllowed(false);
      let remainingSeconds = _unlockTime - _currentTime;
      let remainingDay = Math.floor(remainingSeconds / (60 * 60 * 24));
      let remainingHour = Math.floor(
        (remainingSeconds % (60 * 60 * 24)) / (60 * 60)
      );
      let remainingMinutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
      let remainingSec = Math.floor(remainingSeconds % 60);
      if (remainingDay > 0) {
        endTime =
          remainingDay +
          "d : " +
          remainingHour +
          "h : " +
          remainingMinutes +
          "m";
        setEndTime(endTime);
      } else {
        endTime =
          remainingHour +
          "h : " +
          remainingMinutes +
          "m : " +
          remainingSec +
          "s";
        setEndTime(endTime);
      }
    } else if (_unlockTime < _currentTime && _unlockTime > 0) {
      setEndTime("Ended");

      setClaimAllowed(true);
    }
  };

  const initContracts = async () => {
    let _web3 = new Web3(web3Provider);
    // let _web3 = new Web3(Config.RPC_URL);
    console.log(NFT_STAKE);
    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );
    let _nfttoken = await _stakeContract.methods.nftredeem().call();
    let _nftcombination = await _stakeContract.methods.nftcombination().call();
    let rows = [];
    for (let i = 0; i < 1; i++) {
      rows.push({ count: 1 });
    }
    setCombination(rows);
    setLimit(_nftcombination);

    const _nftContract = new _web3.eth.Contract(STAKENFT_ABI, _nfttoken);
    let _nftsymbol = await _nftContract.methods.symbol().call();
    console.log(_nftsymbol, "symbol");

    setNftSymbol(_nftsymbol);

    let _feeToken = await _stakeContract.methods.feeToken().call();
    setFeeToken(_feeToken);
    const _tokenContract = new _web3.eth.Contract(TOKEN_ABI, _feeToken);
    let _symbol = await _tokenContract.methods.symbol().call();
    setSymbol(_symbol);

    let _decimals = await _tokenContract.methods.decimals().call();
    let _stakingFee = await _stakeContract.methods.fee().call();
    setstakefee(_stakingFee / 1e1 ** _decimals);

    let _status = await _stakeContract.methods.status().call();
    setStatus(_status);

    if (wallet.address) {
      let _userStaked = await _stakeContract.methods
        .existinguser(wallet.address)
        .call();
      setStakeAllowed(!_userStaked);

      let _approval = await _tokenContract.methods
        .allowance(wallet.address, NFT_STAKE)
        .call();
      _approval = parseFloat(_approval / 1e1 ** _decimals).toFixed(2);

      setApproval(_approval);
      let _balance = await _tokenContract.methods
        .balanceOf(wallet.address)
        .call();
      _balance = parseFloat(_balance / 1e1 ** _decimals).toFixed(2);
      setBalance(_balance);
    }
  };

  async function claim() {
    setTranasctionShow(true);
    let _web3 = new Web3(web3Provider);

    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );
    // setModal(!modal);

    _stakeContract.methods
      .redeemNft()
      .send({ from: wallet.address })
      .on("receipt", function (receipt) {
        initContracts();
        setTranasctionShow(false);
        setTimeout(function () {
          location.reload();
        }, 3000);

        // setModal(modal);
      })

      .on("error", function (error, receipt) {
        setModal(modal);
        setTranasctionShow(false);
        // setTimeout(function () {
        //   location.reload();
        // }, 3000);
      });
  }

  async function unstakeRedeemable() {
    let _web3 = new Web3(web3Provider);

    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );
    setModal(!modal);
    _stakeContract.methods
      .emergencyunstakenft()
      .send({ from: wallet.address })
      .on("receipt", function (receipt) {
        initContracts();
        unstakeToggleRedeemable();
        setModal(modal);
      })

      .on("error", function (error, receipt) {
        setModal(modal);
      });
  }

  async function unstake() {
    let _web3 = new Web3(window.ethereum);
    console.log("unstake");
    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );
    console.log(_stakeContract, "cc");
    setModal(!modal);
    _stakeContract.methods
      .emergencyunstakenft()
      .send({ from: wallet.address })
      .on("receipt", function (receipt) {
        initContracts();
        unstakeToggle();
        setModal(modal);
        setTimeout(function () {
          location.reload();
        }, 3000);
      })

      .on("error", function (error, receipt) {
        setModal(modal);
      });
  }

  async function approveToken() {
    let _web3 = new Web3(web3Provider);

    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );
    let _staketoken = await _stakeContract.methods.feeToken().call();
    const _tokenContract = new _web3.eth.Contract(TOKEN_ABI, _staketoken);
    setModal(!modal);
    const _amount = _web3.utils.toWei("10000000000000000000000000000");
    _tokenContract.methods
      .approve(NFT_STAKE, _amount)
      .send({ from: wallet.address })
      .on("receipt", function (receipt) {
        initContracts();

        setModal(modal);
      })

      .on("error", function (error, receipt) {
        setModal(modal);
      });
  }

  return {
    wallet,
    modal,
    toggle,
    damount,
    symbol,
    sTokenPrice,
    stakefee,
    totalStaked,
    nftSymbol,
    stakeTokenAddress,
    approval,
    claimAllowed,
    userStaked,
    endTime,
    depositAmount,
    balance,
    stakingAmount,
    stakingAmountOg,
    limit,
    buyLink,
    depositError,
    depositmodal,
    depositToggle,
    unstakeModal,
    unstakeToggle,
    unstakeRedeemableModal,
    unstakeToggleRedeemable,
    handleDepositChange,
    depositToken,
    claim,
    unstakeRedeemable,
    unstake,
    approveToken,
    stakeAllowed,
    status,
    combination,
    feeToken,
    NFT_STAKE,
    setModalShow,
    modalShow,
    TransactionShow,
    setTranasctionShow,
    unStakeModal,
    setUnstakemodal,
    handleDepositUnChange,
  };
};

export default useGetData;

// const calculateApy = (pool) => {
//   // console.log("poolData", pool, pool.rewardTokenPrice, pool.stakingTokenPrice, pool.totalStaked);
//   const totalRewardPricePerYear =
//     pool.rewardTokenPrice * pool.tokenPerBlock * BLOCKS_PER_YEAR;
//   const totalStakingTokenInPool = pool.stakingTokenPrice * pool.totalStaked;
//   const apr = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
//   return apr;
// };

// }
