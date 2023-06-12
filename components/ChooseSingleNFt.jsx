import React, { useState } from "react";

import MULTI_NFT_STAKE_ABI from "../utils/Config/MULTI_NFT_STAKE_ABI.json";
import POOL_CONTRACT from "../utils/Config/POOL_CONTRACT.json";
import TOKEN_ABI from "../utils/Config/TOKEN_ABI.json";
import NFT_ABI from "../utils/Config/NFT_ABI.json";
import Config, { EX_LINK } from "../utils/Config";
import Web3 from "web3";
import { useEffect } from "react";

import NftIcon from "./NftIcon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRef } from "react";

const ChooseSingleNFt = (props) => {
  let web3Provider;
  const handleDepositChange = props.handleDepositChange();
  const handleDepositUnChange = props.handleDepositUnChange();

  if (typeof window !== "undefined") {
    web3Provider = window.ethereum;
  }

  const NFT_STAKE = props.address;
  const wallet = useAccount();
  const [modal, setModal] = useState(false);

  const [NFT, setNft] = useState(false);
  const toggle = () => setModal(!modal);

  const [damount, setdAmount] = useState(0);

  const [nftAddress, setNftAddress] = useState([]);
  const [userNfts, setUserNfts] = useState([]);

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
  const [startRange, setStartRange] = useState(0);
  const [endRange, setEndRange] = useState(0);
  const [stakingAmountOg, setStakingAmountOg] = useState(0);

  const [limit, setLimit] = useState(0);

  const [depositError, setDepositError] = useState("");

  const [depositmodal, setDepositmodal] = useState(false);
  const depositToggle = () => setDepositmodal(!depositmodal);

  const [unstakeModal, setUnstakemodal] = useState(false);
  const unstakeToggle = () => setUnstakemodal(!unstakeModal);
  const [unstakeRedeemableModal, setunstakeRedeemableModal] = useState(false);
  const unstakeToggleRedeemable = () =>
    setunstakeRedeemableModal(!unstakeRedeemableModal);

  const [input, setInput] = useState(false);
  const setInputToggle = (i) => {};

  // const [isChecked, setIsChecked] = useState(false);

  // const handleCheckboxChange = (nftAddress, v, i, event) => {
  //   const checked = event.target.id;
  //   console.log(checked, "kjhg");
  //   if (checked == i) {
  //     setIsChecked(checked);
  //   }
  //   if (isChecked) {
  //     handleDepositChange(nftAddress, v);
  //   } else {
  //     handleDepositUnChange();
  //   }
  // };

  const _getNft = [0, 1];
  async function setMaxDeposit() {
    setdAmount(balance);
    setDepositAmount(balance);
  }

  const initContracts = async () => {
    let _web3 = new Web3(web3Provider);
    const _stakeContract = new _web3.eth.Contract(
      MULTI_NFT_STAKE_ABI,
      NFT_STAKE
    );

    let _getNft = await _stakeContract.methods
      .nftStakeaddresses(props.index)
      .call();
    setNftAddress(_getNft);
    console.log(nftAddress, "address");
    let _start = await _stakeContract.methods
      .stakingstarttingrange(props.index)
      .call();
    let _end = await _stakeContract.methods.stakingendrange(props.index).call();
    setStartRange(_start);
    setEndRange(_end);

    let _nftContract = new _web3.eth.Contract(NFT_ABI, _getNft);

    if (wallet.address) {
      let _userBalance = await _nftContract.methods
        .balanceOf(wallet.address)
        .call();
      let _approved = await _nftContract.methods
        .isApprovedForAll(wallet.address, NFT_STAKE)
        .call();
      setApproval(_approved);
      let userTokens = [];
      // alert(_userBalance)
      for (let i = 0; i < _userBalance; i++) {
        let _userToken = await _nftContract.methods
          .tokenOfOwnerByIndex(wallet.address, i)
          .call();
        userTokens.push(_userToken);
        if (i == _userBalance - 1) {
          setUserNfts(userTokens);
        }
      }
    }
  };

  async function approvenft() {
    let _web3 = new Web3(web3Provider);

    const _tokenContract = new _web3.eth.Contract(NFT_ABI, nftAddress);

    setModal(!modal);

    _tokenContract.methods
      .setApprovalForAll(NFT_STAKE, true)
      .send({ from: wallet.address })
      .on("receipt", function (receipt) {
        initContracts();

        setModal(modal);
      })

      .on("error", function (error, receipt) {
        setModal(modal);
      });
  }

  useEffect(() => {
    if (window.ethereum) {
      web3Provider = window.ethereum;
    } else {
      web3Provider = new Web3.providers.HttpProvider(Config.RPC_URL);
    }
  }, []);

  useEffect(() => {
    initContracts();

    if (wallet.address) {
      // setInterval(function(){
      //     getTime()
      // },1000)
    }
  }, [wallet.address]);

  return (
    <div>
      <div className='mr-5 mt-4'>
        {nftAddress.map((item) => {
          <>
            <p>{item}</p>
            <br />
          </>;
        })}
        <p className=' text-black'>{nftAddress}</p>
        {userNfts.length > 0 &&
          userNfts.map((v, i) => {
            // if (parseInt(v) >= startRange && parseInt(v) <= endRange) {
            return (
              <label className='me-3'>
                {/* <button
                  className={input ? "checkbox_btn" : "checkbox_btn_false"}
                  onClick={() => setInputToggle(i)}
                ></button> */}
                {/* <input
                  type={"checkbox"}
                  className='text-black'
                  id={i}
                  // onClick={(e) => handle(i)}
                  // name={"myvale"}
                  // checked={isChecked}
                  // onChange={() => handleCheckboxChange(nftAddress, v, i)}
                  onChange={() => handleDepositChange(nftAddress, v)}

                /> */}
                <input
                  type='radio'
                  name='nft'
                  onChange={() => handleDepositChange(nftAddress, v)}
                />
                ID: {v} <NftIcon nftid={v} nftAddress={nftAddress} />
              </label>
            );
            // }
          })}
        {userNfts.length > 0 && (
          <button onClick={approvenft} className='ms-3 approve_Nft'>
            Approve NFT
          </button>
        )}
        {userNfts.length == 0 && (
          <p className='text-dark text-center text-black'>
            No NFTs in your wallet
          </p>
        )}
      </div>
    </div>
  );
};

export default ChooseSingleNFt;
