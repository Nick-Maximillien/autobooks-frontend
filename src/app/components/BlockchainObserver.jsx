'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import CONTRACT_ABI from '../../../src/utils/contractABI.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AGROSIGHT_CONTRACT_ADDRESS;
const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_ID}`);

export default function BlockchainObserver() {
  const [version, setVersion] = useState('');
  const [counts, setCounts] = useState({
    farmers: 0,
    farms: 0,
    diagnoses: 0,
    drones: 0,
    weather: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [v, f1, f2, f3, f4, f5] = await Promise.all([
          contract.VERSION(),
          contract.getAllFarmers(),
          contract.getAllFarms(),
          contract.getAllDiagnoses(),
          contract.getAllDrones(),
          contract.getAllWeather(),
        ]);

        setVersion(v);
        setCounts({
          farmers: f1.length,
          farms: f2.length,
          diagnoses: f3.length,
          drones: f4.length,
          weather: f5.length,
        });
      } catch (err) {
        console.error('❌ Error reading data:', err);
      } finally {
        setLoading(false);
      }
    };

    const logEvent = (msg) => {
      setEvents((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev.slice(0, 9)]);
    };

    const setupEvents = () => {
      contract.on('NewFarmer', (username, name, writer) => {
        logEvent(`👤 NewFarmer: ${name} (${username}) by ${writer}`);
        fetchData();
      });
      contract.on('NewFarm', (farmer, name, writer) => {
        logEvent(`🌱 NewFarm: ${name} for ${farmer} by ${writer}`);
        fetchData();
      });
      contract.on('NewDiagnosis', (farmer, result, timestamp, writer) => {
        logEvent(`🧪 NewDiagnosis: ${result} for ${farmer}`);
        fetchData();
      });
      contract.on('NewDrone', (farmer, coordinates, writer) => {
        logEvent(`🛰️ NewDrone: ${coordinates} for ${farmer}`);
        fetchData();
      });
      contract.on('NewWeather', (farmer, temp, timestamp, writer) => {
        logEvent(`🌦️ NewWeather: ${temp} for ${farmer}`);
        fetchData();
      });
      contract.on('WriterApproved', (writer) => {
        logEvent(`✅ Writer Approved: ${writer}`);
      });
      contract.on('WriterRevoked', (writer) => {
        logEvent(`🚫 Writer Revoked: ${writer}`);
      });
    };

    fetchData();
    setupEvents();

    return () => {
      contract.removeAllListeners();
    };
  }, []);

  const chartData = [
    { label: 'Farmers', value: counts.farmers },
    { label: 'Farms', value: counts.farms },
    { label: 'Diagnoses', value: counts.diagnoses },
    { label: 'Drones', value: counts.drones },
    { label: 'Weather', value: counts.weather },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">🔗 Full Contract Observer</h2>

      {loading ? (
        <p className="text-gray-500">Loading from chain...</p>
      ) : (
        <>
          <p className="mb-2">
            🧾 Version: <strong>{version}</strong>
          </p>

          <div className="mb-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="#4b5563" />
                <YAxis allowDecimals={false} stroke="#4b5563" />
                <Tooltip />
                <Bar dataKey="value" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <h3 className="text-lg font-semibold mb-2 mt-6">📡 Latest Events</h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm max-h-64 overflow-auto">
        {events.length === 0 ? (
          <p>No recent events</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {events.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
