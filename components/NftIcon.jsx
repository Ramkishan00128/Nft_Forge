import React, { Component } from "react";

import Config, { MARKETPLACE, NFT_LINK } from "../utils/Config/index";

import NFT_ABI from "../utils/Config/NFT_ABI.json";
import Web3 from "web3";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const NftIcon = (props) => {
  let web3Provider = window.ethereum;
  const wallet = useAccount();
  const [name, setName] = useState(0);
  const [media, setMedia] = useState(null);
  useEffect(() => {
    if (window.ethereum) {
      web3Provider = window.ethereum;
    } else {
      web3Provider = new Web3.providers.HttpProvider(Config.RPC_URL);
    }

    init();
  }, [wallet.account]);

  const init = async () => {
    let _web3 = new Web3(web3Provider);

    let _nftContract = new _web3.eth.Contract(NFT_ABI, props.nftAddress);
    let _media = await _nftContract.methods.tokenURI(props.nftid).call();
    try {
      _media = await fetch(_media);
      _media = await _media.json();
      setMedia(encodeURI(_media.image));

      setName(_media.name);
    } catch {}
  };

  return (
    <>
      {media && (
        <a href={media}>
          <i className='fa fa-external-link'></i>
        </a>
      )}
    </>
  );
};
export default NftIcon;
