import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
 
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  
  return (
    <div className="main">
    <header>
        <div className="logo">
            <a className="logo" href="#"><img src="./config/images/giphy.gif" alt=""/></a>
        </div>
        
        <div className="links">
            <a href="#project">THE PROJECT</a>
            <a href="#roadmap">ROADMAP</a>
            <a href="#team">TEAM</a>
          
                      
                          <button onClick={(e) => {
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                              }}>{blockchain.account ? <p className="account"> {blockchain.account}</p> : <p>Connect Wallet</p>}</button>
                            
                         
            <div className="links">
                <a href="https://discord.gg/xMzSrvs2fb" target="_blank"><i className="fab fa-discord"></i></a>
                <a href="https://twitter.com/M3taMartians" target="_blank"><i className="fab fa-twitter"></i></a>
            </div>
        </div>
    </header>

    <main>
        <div id="landing-page">
            <h1>M3TA MARTIANS IS TAKING OVER</h1>
            <div id="countdown">
                <div className="countdown-days">
                    <p className="days"></p>
                    <p className="accent">DAYS</p>
                </div>
                <div className="countdown-hours">
                    <p className="hours"></p>
                    <p className="accent">HOURS</p>
                </div>
                <div className="countdown-minutes">
                    <p className="minutes"></p>
                    <p className="accent">MINUTES</p>
                </div>
                <div className="countdown-seconds">
                    <p className="seconds"></p>
                    <p className="accent">SECONDS</p>
                </div>
         </div>

         <button className="landing-page"><a href="#project"> THE MISSION </a></button>

        </div>
        
        <div id="project">
            <div className="col-left">
                <img src="./config/images/promo.gif" alt="M3TA MARTIANS"/>
            </div>
            <div className="col-right">
                <h2 className="accent">THE PROJECT:  {data.totalSupply} / {CONFIG.MAX_SUPPLY}</h2>
                <h2 className="accent">0.05 ETH</h2>
                <p> 5000 generated NFT's, M3TA MARTIANS are set to invade you. Looking for a way back to Mars when they detoured 
                    to meet the earth leader, Elon Musk and live by the motto 'What Would Elon Do.' Each unique, these aliens have 
                    touched down looking to integrate with reality using accessories as traits that add to their rarity. Join our whitelist
                    to gain access Dec 14th for our presale, after which, as we hit 80% of sales, our rarity list will be released on the website, 
                    rarity.com & other NFT collectible sites.
                </p>
                <p style={{marginTop: "1rem"}}>Look out for the Ethereum Gold Chain, those who obtain this NFT will receive an airdrop of an avatar that can be used 
                  in an already established Metaverse</p>
            </div>
        </div>

        <div id="roadmap">
            <h1>ROADMAP</h1>
            <div className="timeline">
                <div className="container left">
                  <div className="date">PHASE 1</div>
                  <i className="icon">🚀</i>
                  <div className="content">
                    <h2 className="secondary-accent">Embark on our journey</h2>
                    <p>
                        Starting campaigns on Twitter and Discord. Getting people aware of the M3TA MARTIANS and their impending arrival!
                    </p>
                  </div>
                </div>
                <div className="container right">
                  <div className="date">PHASE 2</div>
                  <i className="icon">📃</i>
                  <div className="content">
                    <h2 className="secondary-accent">Whitelist</h2>
                    <p>
                      Those on the whitelist will have the ability to buy M3TA MARTIANS at a discounted price before launch. This will take place Dec 14th
                    </p>
                  </div>
                </div>
                <div className="container left">
                  <div className="date">PHASE 3</div>
                  <i className="icon">🎁</i>
                  <div className="content">
                    <h2 className="secondary-accent">10 Days of Martians</h2>
                    <p>
                      Enter our giveaways for the 10 Days of Martians for a chance to win one of the minted NFTs before release
                    </p>
                  </div>
                </div>
                <div className="container right">
                  <div className="date">PHASE 4</div>
                  <i className="icon">🛸</i>
                  <div className="content">
                    <h2 className="secondary-accent">Launch Day!</h2>
                    <p>
                      Dec 17th - The rest of the M3TA MARTIANS touch down! Join us as we launch our NFT and start our invasion. Rarity list
                      to be released after 80% sold
                    </p>
                  </div>
                </div>
                <div className="container left">
                  <div className="date">PHASE 5</div>
                  <i className="icon">👽</i>
                  <div className="content">
                    <h2 className="secondary-accent">Beyond Launch</h2>
                    <p>
                      Every holder of a M3TA MARTIAN will be able to participate in the creation of our next 5000 launch. Stay
                      tuned for more information on the utility use of your M3TA MARTIAN in the Metaverse.
                    </p>
                  </div>
                </div>
              </div>
        </div>

        <div id="team">
            <h1>THE TEAM</h1>
            <p> A couple of martians wanting to be apart of the WEB3 transition and interested in bringing education into this space.
                The community forges on with you! Join us on Discord & Twitter for annoucements, giveaways, & roadmap unlocks</p>

            <div className="links">
                <a href="https://discord.gg/xMzSrvs2fb" target="_blank"><i className="fab fa-discord"></i></a>
                <a href="https://twitter.com/M3taMartians" target="_blank"><i className="fab fa-twitter"></i></a>
            </div>
            <div className="team-info">
               
                <div className="team-profile">
                    <img src="./config/images/mrsm3ta.png" alt="M3TA MARTIANS"/>
                    <p>Mrs. M3ta</p>
                    <p className="accent">Developer & Project Manager</p>
                </div>
                <div className="team-profile">
                    <img src="./config/images/m3taone.png" alt="M3TA MARTIANS"/>
                    <p>M3ta One</p>
                    <p className="accent">The Founder & The Analyst</p>
                </div>
            </div>
      
           
        </div>

        {CONFIG.SHOW_BACKGROUND == false &&
          <div className="other">
          <div className="minter">
        <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>

              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : 'coonected'}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    > what is here
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            </div>
                <p>Please make sure you are connected to the right network (
                {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
                Once you make the purchase, you cannot undo this action.</p>
            </div>
        }
        
        <div className="bottom-banner">
    
        </div>
    </main>

    </div>

      );
}

export default App;
