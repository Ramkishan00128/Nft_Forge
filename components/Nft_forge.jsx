import React from "react";
import style from '../styles/Home.module.css'
import Multiple_nft from "./Multiple_nft";
import STACK_CONTRACT from "./Custom hooks/Contract";



const Nft_forge = () => {
    return (
        <div className={`${style.font_text} ${style.background_color}`}>
            <div className={style.innerSection}>
                <div>
                    <h2>Earn NFT</h2>
                    <p>Stake your WIZARD tokens to Earn NFT</p>
                </div>
                {
                    STACK_CONTRACT.length > 0 && STACK_CONTRACT.map((data,index) => (
                        <Multiple_nft key={index} data={data} index={index} />
                    ))
                }
            </div>
        </div>
  )
};

export default Nft_forge; 
