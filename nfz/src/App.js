import React, { useState, useRef } from "react";
import { Spinner, Button, Jumbotron } from 'react-bootstrap';
import fleekStorage from '@fleekhq/fleek-storage-js';
import { DrizzleState } from 'drizzle-react';
import { newContextComponents } from 'drizzle-react-components'
//import logo from './logo.svg';
//import './App.css';
//import nfzillionaire from './nfzillionaire.png'
import manhattan_empire_state_bldg from './manhattan_empire_state_bldg.jpeg'
import ImageUploader from "react-images-upload";
//import { newContextComponents } from "@drizzle/react-components";

const { ContractData } = newContextComponents;
const App = ({ drizzle, drizzleState }) => {
  const imageUploaderRef = useRef(null);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txQueue, setTxQueue] = useState([]);

  const onDrop = (picture) => {
    if (picture.length) {
      return setArtwork(picture[0])
    }
    setArtwork(null)
  };

  const clearPreview = () => {
    alert('clear Preview called');
    setArtwork(null);
    imageUploaderRef.current.clearPictures();
  };

  const createNFTTransaction = async (hash) => {
    const tokenURI = `https://ipfs.io/ipfs/${hash}`;

    const removeFromQueue = () => {
      const newTxQueue = txQueue.filter((uri) => uri !== tokenURI);
      setTxQueue(newTxQueue);
    }

    try {
      setTxQueue([...txQueue, tokenURI]);
      await drizzle.contracts.CryptoMuseum.methods.mint(hash).send({from: drizzleState.accounts[0]})
      removeFromQueue(tokenURI);
    } catch(e) {
      console.error(e);
      removeFromQueue(tokenURI);
    }
  };

  const handleButtonClick = async (newTokenId) => {
    setLoading(true)
    try {
      const date = new Date();
      const timestamp = date.getTime();

      const { hash } = await fleekStorage.upload({
        apiKey: 'API_KEY',
        apiSecret: 'API_SECRET',
        key: `nft/${newTokenId}-${timestamp}`,
        data: artwork,
      });

      setLoading(false);
      clearPreview();
      createNFTTransaction(hash)
    } catch(e) {
      console.error(e);
      setLoading(false);
    }
  }

  const getTokenDisplay = (tokenId) => {
    return (
      <div className="token-container">
        <span>token ID: {tokenId}</span>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="CryptoMuseum"
          method="CID"
          methodArgs={[tokenId]}
          render={(cid) =>  (
            <div className="artwork-container">
              <img className="artwork" src={`https://ipfs.fleek.co/ipfs/${cid}`} alt=''/>
            </div>
          )}
        />
      </div>
    )
  };


  //function onButtonShowProperty(value) {alert('show property');}
  
  function onButtonAddProperty(value) {
    alert('add property');
  
  }
  
  function onButtonListAll(value) {
    alert('list all');
  
  }


  return (
    <div className="App">


        <div>
          <h1>NFZ Baby!!!!</h1>
          <h2>Join the NFZillionaire Club</h2>
          <h6>We're Non-Fungible Zillionaires</h6>
        </div>

        <img src={manhattan_empire_state_bldg} width="500" height="200" alt="" />

        <div>
          <h2>Select Your Property</h2>
          <div className="uploader">
            <ImageUploader
              withIcon={true}
              buttonText="Choose image"
              onChange={onDrop}
              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
              maxFileSize={5242880}
              withPreview
              singleImage
              ref={iu => imageUploaderRef.current = iu}
            />
          </div>
        </div>
        <div className="steps">
        <h2>NFT Your Property</h2>
        <div>
          <h5>Connect to the Ropsten Network on Metamask</h5>
          <a href="https://faucet.ropsten.be/" target="_blank" rel="noopener noreferrer">
            <h5>**TestNet** Get free Ropsten Ether **TestNet**</h5></a>
        </div>
        </div>
        <br/> <br/>
       
        <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="CryptoMuseum"
        method="totalSupply"
        render={(supply) => (
          <div>
            <Button
              disabled={!artwork || loading}
              onClick={() => handleButtonClick(supply)}
              className="button"
            >
            {loading
              ? <Spinner animation="border" variant="light" size="sm" />
              : <span>Create NFT</span>
            }
          </Button>
        </div>
        )}
      />

        <div className="steps">
        <h2>NFT Your Property</h2>
        <div>
          <h5>Connect to the Ropsten Network on Metamask</h5>
          <a href="https://faucet.ropsten.be/" target="_blank" rel="noopener noreferrer">
            <h5>**TestNet** Get free Ropsten Ether **TestNet**</h5></a>
            <br/> <br/>
        <button onClick={onButtonAddProperty}>Create NFT</button>
        <br/> <br/>
        </div>
        </div>

        <div className="steps">
        <h2>NFZillionaire Properties</h2>
        <div>
        <br/> <br/>
        <button onClick={onButtonListAll}>List All Properties</button>
        <br/> <br/>
        </div>
        </div>

        <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract="CryptoMuseum"
      method="balanceOf"
      //methodArgs={[drizzleState.accounts[0]]}
      render={(balanceOf) => {
        const emptyArray = [];
        const arrayLength = Number(balanceOf);
        for(let i=0;i<arrayLength;i++){ emptyArray.push('') }
        if(emptyArray.length === 0) {
          return (
            <Jumbotron className="no-artwork">
              You have no artwork in your collection!
            </Jumbotron>
          )
        }
        return (
            <div className="collection-container">
                {emptyArray.map(( _, index) => {
                  return (
                    <ContractData
                      key={index}
                      drizzle={drizzle}
                      drizzleState={drizzleState}
                      contract="CryptoMuseum"
                      method="tokenOfOwnerByIndex"
                      methodArgs={[drizzleState.accounts[0], arrayLength - 1 - index]}
                      render={(tokenId) => (
                        <>
                          {getTokenDisplay(tokenId)}
                        </>
                      )}
                    />
                  )}
                )}
            </div>
          );
      }}
    />
  </div>
  );
};

 
 //   </div> );};

export default App;
