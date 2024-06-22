import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import img from "../img/Poll.gif";
import Loader from './Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from 'ethers';

const VoteArea = () => {
  const { provider, contract, isEligibleVoter } = useContext(AuthContext); // Menggunakan AuthContext
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const signer = contract.connect(provider.getSigner());
        const cand = await signer.getCandidate();
        setCandidates(cand);
      } catch (error) {
        console.log(error);
      }
    };
    getCandidates();
  }, [contract, provider]);

  const addYourVote = async (candidate_id) => {
    try {
      setIsLoading(true);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const isEligible = await isEligibleVoter(userAddress); // Memeriksa kelayakan pemilih

      if (!isEligible) {
        setIsLoading(false);
        toast.error('You are not eligible to vote!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }

      const contractWithSigner = contract.connect(signer);
      await contractWithSigner.addVote(candidate_id);

      setIsLoading(false);
      toast.success('You cast your vote!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      setIsLoading(false);
      toast.error(error.data?.message || 'An error occurred', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      {isLoading && <Loader />}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Voting is live now!</h1>
            <p className="mt-2 text-sm text-gray-700">
              Click on vote button and cast your vote. Choose your leader wisely.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-8 p-5'>
    {
      candidates?.map((item, i) => (
        <div key={i} className='flex flex-col items-center p-8 bg-gray-100 drop-shadow-xl rounded-[20px]'>
          <div className='flex justify-center'>
            <img className='h-36 w-36 rounded-full object-cover' src={`https://gateway.pinata.cloud/ipfs/${item.candidate_img}`} alt="" />
          </div>
          <div className='mt-4 text-center'>
            <p className='text-lg font-semibold'>{item.candidate_name}</p>
            <p className='text-md text-gray-600'>{item.candidate_partyName}</p>
            <button
              type="button"
              onClick={() => addYourVote(item.candidate_id.toNumber())}
              className="mt-5 inline-flex items-center rounded border border-transparent bg-white border-[#3ed0d9] px-5 py-2 text-sm font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3ed0d9] focus:ring-offset-2"
            >
              <span className='text-lg font-semibold'>Vote</span>
              <img src={img} className="h-8 ml-2" alt="" />
            </button>
          </div>
        </div>
      ))
    }
    {candidates?.length === 0 && <p>Voting has not started!</p>}
  </div>
</div>

    </div>
  );
};

export default VoteArea;
