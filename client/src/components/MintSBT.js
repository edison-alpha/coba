import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SoulboundToken from './SoulboundToken.json';

const soulboundTokenAddress = "0x0ae3A1439b256e462781b4BABff5c0258cCcCbb9";

function MintSBT() {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");
  const [claimedSBT, setClaimedSBT] = useState(false); // State to track if SBT is claimed

  useEffect(() => {
    async function fetchAccount() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setStatus("");
          }
        } catch (error) {
          console.error("Error fetching accounts", error);
          setStatus("Error connecting to wallet");
        }
      } else {
        setStatus("Metamask not detected");
      }
    }
    fetchAccount();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setStatus("");
      } catch (error) {
        console.error("Error connecting to wallet", error);
        setStatus("Error connecting to wallet");
      }
    } else {
      setStatus("Metamask not detected");
    }
  };

  const mintSoulbound = async () => {
    if (!account) {
      setStatus("Please connect your wallet first");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const soulboundTokenContract = new ethers.Contract(soulboundTokenAddress, SoulboundToken, signer);

    try {
      const tx = await soulboundTokenContract.mintSoulbound();
      await tx.wait();
      setStatus("Soulbound token minted successfully!");
      setClaimedSBT(true); // Set claimedSBT to true upon successful minting
      alert("You have successfully claimed your Soulbound Token!");
    } catch (error) {
      if (error.reason) {
        setStatus(`Error: ${error.reason}`);
      } else {
        console.error("Error minting soulbound token", error);
        setStatus("Error minting soulbound token");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Mint Soulbound Token</h1>
        <div className="mb-4">
          {account ? null : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        <button
          className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full ${!account && 'opacity-50 cursor-not-allowed'}`}
          onClick={mintSoulbound}
          disabled={!account || claimedSBT} // Disable button if account not connected or SBT already claimed
        >
          {claimedSBT ? "You have already minted your Soulbound token" : "Mint Soulbound Token"}
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">{status}</p>
      </div>
    </div>
  );
}

export default MintSBT;
