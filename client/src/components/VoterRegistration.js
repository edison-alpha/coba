import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormToJSON() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        nim: '',
        address: ''
    });
    const [ipfsHash, setIpfsHash] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleTransaction = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.enable();
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const userAddress = accounts[0];
                
                // Simpan data pada IPFS setelah transaksi berhasil
                await handleSubmit(userAddress);
            } else {
                throw new Error('Metamask not detected');
            }
        } catch (error) {
            console.error('Error handling transaction:', error);
            toast.error('Error handling transaction. Please make sure Metamask is properly configured.');
        }
    };

    const handleSubmit = async (userAddress) => {
        const jsonData = JSON.stringify(formData);
        console.log('JSON Data:', jsonData);
        
        // Upload data JSON ke Pinata
        const apiKey = '1a3d2fd5127f0593275b';
        const apiSecret = '854c906db83b023e29f49aab52da40485412867bb4012a3edc41f2224768bb4a';
        const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
        
        const fileName = `Vote${Math.floor(Math.random() * 100) + 1}.json`;
        
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': apiKey,
                'pinata_secret_api_key': apiSecret,
            },
            body: JSON.stringify({
                pinataMetadata: {
                    name: fileName
                },
                pinataContent: jsonData
            })
        };
        
        try {
            const response = await fetch(url, requestOptions);
            const responseData = await response.json();
            console.log('Upload berhasil, hash IPFS:', responseData.IpfsHash);
            setIpfsHash(responseData.IpfsHash);
            // Simpan hash IPFS di blockchain atau database
        } catch (error) {
            console.error('Error uploading to Pinata:', error);
        }
    };

    return (
        <div>
            <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0 drop-shadow-lg">
                <form className="space-y-6 bg-white py-6 px-4 sm:p-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Form Pendaftaran</h3>
                        <p className="mt-1 text-sm text-gray-500">Sebelum Anda Melakukan Voting Silahkan Isi Form Pendaftaran ini</p>
                    </div>

                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="given-name"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="nim" className="block text-sm font-medium text-gray-700">NIM</label>
                            <input
                                type="text"
                                name="nim"
                                id="nim"
                                value={formData.nim}
                                onChange={handleChange}
                                autoComplete="off"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="col-span-12">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                autoComplete="off"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <button
                            type="button" // Change type to "button" to prevent form submission
                            onClick={handleTransaction} // Call handleTransaction instead of handleSubmit
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#33c94a] py-2 px-4 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
            {ipfsHash && (
                <div className="mt-4">
                    <p>Hash IPFS: {ipfsHash}</p>
                    {/* Use this hash to retrieve the JSON data and display it in the vote area */}
                </div>
            )}
        </div>
    );
}

export default FormToJSON;
