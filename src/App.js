import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
// import Row from "./Row";
export const Input = styled.input.attrs(props => ({
  type: 'text',
  size: props.small ? 5 : undefined,
}))`
  border-radius: 10px;
  border: none;
  display: block;
  color: var(--red);
  text-align: center;
  padding: 10px;
  width: 60px;
  ::placeholder {
    color: var(--red);
  }
`
export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ffffff;
  padding: 10px;
  font-weight: bold;
  color: #000000;
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

export const StyledImg = styled.img`
  width: 200px;
  height: 200px;
  @media (min-width: 767px) {
    width: 350px;
    height: 350px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  const [totalMintingAmount, settotalMintingAmount] = useState('0')
  const [amountPlaceholder, setamountPlaceholder] = useState('0')
  const claimNFTs = (_amount) => {
    if (_amount <= 0) {
      alert("Enter some amount to mint your RNs")
      return;
    }
    else if (_amount > 20){
      alert(`You cannot mint more than ${_amount} RNs at a time`)
      return;
    }
    setFeedback("Minting your Red Number");
    setClaimingNft(true);
    console.log(totalMintingAmount);
    blockchain.smartContract.methods
      .mint(_amount)
      .send({
        gasLimit: "6000000",
        to: "0x463685d498951a5fEBfFffcF0F74c86cbBb88A9a",
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((0.05 * _amount).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "You now own a Red Number. go visit Opensea.io to view it."
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    
    <s.Screen style={{ backgroundColor: "var(--black)" }}>
      {/* <section>
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
    </section> */}
      <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 60, fontWeight: "bold" }}
        >
          Mint a Red Number
        </s.TextTitle>
        <s.SpacerMedium />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }}>

          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#00000000"}}
          >
            {Number(data.totalSupply) == 999 ? (
              <>
                <s.TextTitle style={{ textAlign: "center" , fontSize: 55}}>
                  The sale has ended.
                </s.TextTitle>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center", fontSize: 35}}>
                  You can still find Red Numbers on{" "}
                  <a
                    target={"_blank"}
                    href={"https://opensea.io/collection/rednumbers"}
                  >
                    Opensea.io
                  </a>
                </s.TextDescription>
              </>
            ) : (
              <>
                <s.TextTitle style={{ textAlign: "center" , fontSize: 45}}>
                  1 Red Number costs 0.05 Eth.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription style={{ textAlign: "center" , fontSize: 25}}>
                  Excluding gas fee.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription style={{ textAlign: "center" , fontSize: 35}}>
                  {feedback}
                </s.TextDescription>
                <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription style={{ textAlign: "center" , fontSize: 40}}>
                      Connect to the Ethereum network
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
                        <s.TextDescription style={{ textAlign: "center" , fontSize: 25}}>
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                    <s.TextTitle style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }}>
                      {data.totalSupply}/999
                    </s.TextTitle>
                  </s.Container>
                ) : (
                  <s.Container>
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <Input small placeholder={amountPlaceholder} 
                    disabled={claimingNft ? 1 : 0}
                    onClick = {event => setamountPlaceholder('')}
                    onChange={event => settotalMintingAmount(event.target.value)}
                    />
                    <s.SpacerSmall />
                    <StyledButton
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs(parseInt(totalMintingAmount));
                        getData();
                      }}
                    >
                      {claimingNft ? "BUSY" : "BUY"}
                    </StyledButton>
                    <s.SpacerXSmall />
                  </s.Container>
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                  <s.TextTitle style={{ textAlign: "center", fontSize: 35, fontWeight: "bold" }}>
                      {data.totalSupply}/999
                    </s.TextTitle>
                  </s.Container>
                  </s.Container>
                )}
              </>
            )}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription style={{ textAlign: "center", fontSize: 20 }}>
            Please make sure you are connected to the right network (Ethereum
            Mainnet) and the correct address. Please note: Once you make the
            purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
