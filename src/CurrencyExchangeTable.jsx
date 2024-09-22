import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyExchangeTable = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = 'ffe22c1b07c44ac1a13ad018ca212274'; // Replace with your actual API key
  const currencies = ['CAD', 'IDR', 'JPY', 'CHF', 'EUR', 'GBP'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(`https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${currencies.join(',')}`);
        setRates(response.data.rates);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch currency rates');
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const calculateRate = (rate, type) => {
    const baseRate = parseFloat(rate);
    if (type === 'buy') {
      return (baseRate * 1.05).toFixed(4); // 5% markup for buying
    } else {
      return (baseRate * 0.95).toFixed(4); // 5% markdown for selling
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-orange-500 text-white">
            <th className="border border-gray-300 p-2">Currency</th>
            <th className="border border-gray-300 p-2">We Buy</th>
            <th className="border border-gray-300 p-2">Exchange Rate</th>
            <th className="border border-gray-300 p-2">We Sell</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((currency) => (
            <tr key={currency}>
              <td className="border border-gray-300 p-2">{currency}</td>
              <td className="border border-gray-300 p-2">{calculateRate(rates[currency], 'buy')}</td>
              <td className="border border-gray-300 p-2">{parseFloat(rates[currency]).toFixed(4)}</td>
              <td className="border border-gray-300 p-2">{calculateRate(rates[currency], 'sell')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-gray-600">
        Rates are based on 1 USD
      </p>
    </div>
  );
};

export default CurrencyExchangeTable;