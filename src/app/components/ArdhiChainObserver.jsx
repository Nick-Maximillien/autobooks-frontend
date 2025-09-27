'use client';

import { useEffect, useState } from 'react';
import { JsonRpcProvider, Contract } from 'ethers';
import contractABI from '../../utils/contractABI.json';

const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ARDHI_CONTRACT_ADDRESS;

export default function ArdhinObserver() {
  const [landData, setLandData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLandsFromContract = async () => {
    try {
      setLoading(true);
      const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`);
      const contract = new Contract(CONTRACT_ADDRESS, contractABI, provider);

      // Get the nextTokenId as a property (no parentheses)
      const nextId = await contract.nextTokenId;
      const total = Number(nextId);

      const lands = [];

      for (let tokenId = 0; tokenId < total; tokenId++) {
        const [titleId, location, size, uri, owner] = await contract.getLandDetails(tokenId);

        lands.push({
          tokenId,
          titleId,
          location,
          size,
          uri,
          owner,
        });
      }

      setLandData(lands);
    } catch (error) {
      console.error('❌ Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandsFromContract();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🌍 ArdhiChain Observed Lands</h2>
      {loading ? (
        <p className="text-gray-500">Loading from Sepolia...</p>
      ) : landData.length === 0 ? (
        <p className="text-gray-500">No land NFTs found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landData.map((land) => (
            <div
              key={land.tokenId}
              className="rounded-2xl shadow-md p-4 bg-white border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-green-700">📄 {land.titleId}</h3>
              <p><strong>Location:</strong> {land.location}</p>
              <p><strong>Size:</strong> {land.size}</p>
              <p><strong>Owner:</strong> {land.owner}</p>
              <p className="text-xs text-gray-400 mt-2">Token ID: {land.tokenId}</p>
              {land.uri && (
                <a
                  href={land.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View Metadata
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
