import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ConnectWalletButton = () => {
    const { connected, account, connectAccount } = useContext(AuthContext);

    return (
        <div>
            {!connected ? (
                <button onClick={connectAccount}>Connect Wallet</button>
            ) : (
                <p>Connected wallet address: {account}</p>
            )}
        </div>
    );
};

export default ConnectWalletButton;
