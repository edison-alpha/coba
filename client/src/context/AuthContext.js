import { createContext, useEffect, useState } from "react";
import OnlineVoting from "../artifacts/contracts/OnlineVoting.sol/OnlineVoting.json";
import SoulboundToken from "../artifacts/contracts/SoulboundToken.sol/SoulboundToken.json";
import { ethers } from "ethers";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [account, setAccount] = useState("");
    const [adminAccount, setAdminAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [soulboundContract, setSoulboundContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [connected, setConnected] = useState(false);
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const connectAccount = async () => {
            try {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);

                    window.ethereum.on("chainChanged", () => window.location.reload());
                    window.ethereum.on("accountsChanged", () => window.location.reload());

                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setAccount(address);

                    const contractAddress = "0xbf0FAf64378E41969fd2AeB2C9e7D58ab2C884Ae";
                    const contract = new ethers.Contract(contractAddress, OnlineVoting.abi, signer);

                    const soulboundContractAddress = "0x0ae3A1439b256e462781b4BABff5c0258cCcCbb9";
                    const soulboundContract = new ethers.Contract(
                        soulboundContractAddress,
                        SoulboundToken.abi,
                        signer
                    );

                    const ownerSigner = contract.connect(signer);
                    const admin = await ownerSigner.getOwner();
                    setAdminAccount(admin);
                    setContract(contract);
                    setSoulboundContract(soulboundContract);
                    setProvider(provider);
                    setConnected(true);
                } else {
                    console.error("Metamask is not connected!");
                }
            } catch (error) {
                console.error("Error connecting to Ethereum provider:", error);
            }
        };

        connectAccount();
    }, []);

    const isEligibleVoter = async () => {
        try {
            if (soulboundContract && account) {
                const eligible = await soulboundContract.isEligibleVoter(account);
                return eligible;
            } else {
                console.error("Soulbound contract instance not available or account not connected.");
                return false;
            }
        } catch (error) {
            console.error("Error checking eligibility:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                connected,
                contract,
                account,
                provider,
                adminAccount,
                setCurrentUser,
                currentUser,
                isEligibleVoter,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
