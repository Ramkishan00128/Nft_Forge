import Image from "next/image";
import React, { useState } from "react";
import { useNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "react-bootstrap";
import Transaction from "./modal/Transaction";
// import MyVerticallyCenteredModal from "./modal/Modal";
import useGetDataNFT from "./Custom hooks/useGetDataNFT";
import MyVerticallyCenteredModal from "./modal/Modal";
import UnStakeModal from "./modal/unstakeModal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Multiple_nft = (props) => {
  const { chain } = useNetwork();

  const {
    // modal,

    damount,
    symbol,

    stakefee,

    nftSymbol,

    approval,

    endTime,

    balance,

    stakingAmountOg,

    wallet,

    approveToken,
    claim,

    NFT_STAKE,
    handleDepositChange,
    depositToken,
    unstake,

    unstakeModal,

    limit,
    combination,
    claimAllowed,
    setModalShow,
    modalShow,
    status,
    stakeAllowed,
    TransactionShow,
    setTranasctionShow,
    handleDepositUnChange,

    setUnstakemodal,
  } = useGetDataNFT(props);
  console.log(approval, "aprove");

  const [showNftData, setShowNftData] = useState(false);

  const showData = () => {
    setShowNftData(!showNftData);
  };

  return (
    <div>
      <div onClick={() => showData()} className='multiple_nft_page'>
        <div className='single_nft'>
          <Image
            height={100}
            width={100}
            src={props.data.image}
            alt='wolfee nft'
          />

          <p>{nftSymbol} NFT</p>
          {!claimAllowed ? (
            <div className='apr-c1'>
              <p> Non-Redeemable</p>
            </div>
          ) : (
            <div className='apr-c1'>
              <p>Redeemable</p>
            </div>
          )}

          <p>{endTime}</p>

          {chain?.id === 4002 ? (
            // <button onClick={() => setModalShow(true)} className='Stake_btn'>
            //   Stake
            // </button>

            wallet.address !== undefined &&
            props.data.status == 1 &&
            !claimAllowed &&
            stakeAllowed &&
            status && (
              <button
                onClick={() => setModalShow(true)}
                className='Stake_btn'
                // onClick={depositToggle}
              >
                Stake
              </button>
            )
          ) : (
            <ConnectButton />
          )}

          {wallet.address !== undefined && !claimAllowed && !stakeAllowed && (
            <button className='Stake_btn' onClick={() => setUnstakemodal(true)}>
              Unstake
            </button>
          )}
          {wallet.address !== undefined && claimAllowed && (
            <button className='Stake_btn' onClick={claim}>
              Claim
            </button>
          )}
        </div>
        {showNftData && (
          <div className='data'>
            <div className='data_left'>
              <div className='data_left_up'>
                <p>END</p>
                <p>STAKE FEE</p>
              </div>

              <div className='data_left_down'>
                <p>{endTime ? endTime : "not available"}</p>
                <p>
                  {stakefee} {symbol}
                </p>
              </div>
            </div>
            <div className='data_right'>
              <a href={props.data.explorer + props.data.token} target='_blank'>
                View on FSCSCAN
              </a>
              <a href={props.data.buyToken + props.data.token} target='_blank'>
                BUY {symbol} TOKEN
              </a>
            </div>
          </div>
        )}
      </div>

      <MyVerticallyCenteredModal
        data={{
          symbol,
          stakefee,
          balance,
          NFT_STAKE,
          handleDepositChange,
          limit,
          combination,
          approveToken,
          approval,
          depositToken,
          stakingAmountOg,
          damount,
          depositToken,
          handleDepositUnChange,
        }}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Transaction
        show={TransactionShow}
        onHide={() => setTranasctionShow(false)}
      />
      <UnStakeModal
        data={{ unstake }}
        show={unstakeModal}
        onHide={() => setUnstakemodal(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default Multiple_nft;
