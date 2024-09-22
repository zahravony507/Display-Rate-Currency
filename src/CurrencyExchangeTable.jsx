import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyExchangeTable = () => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = 'ffe22c1b07c44ac1a13ad018ca212274'; // Pastikan untuk menyimpan API key dengan aman
  const currencies = ['CAD', 'IDR', 'JPY', 'CHF', 'EUR', 'GBP'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(`https://api.currencyfreaks.com/latest?apikey=${API_KEY}&symbols=${currencies.join(',')}`);
        if (response.data && response.data.rates) {
          setRates(response.data.rates);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError('No response received from the server. Please check your internet connection.');
        } else {
          setError(`Error: ${error.message}`);
        }
        console.error('Error fetching currency rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const calculateRate = (rate, type) => {
    if (!rate) return '-';
    const baseRate = parseFloat(rate);
    if (isNaN(baseRate)) return '-';
    if (type === 'buy') {
      return (baseRate * 1.05).toFixed(4); // Markup 5% untuk pembelian
    } else {
      return (baseRate * 0.95).toFixed(4); // Markdown 5% untuk penjualan
    }
  };

  if (loading) return <div className="text-center">Memuat...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-100">
      <div className="bg-orange-500 text-white p-8 rounded-lg shadow-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2 font-bold"></th>
              <th className="text-left p-2 font-bold">We Buy</th>
              <th className="text-left p-2 font-bold">Exchange Rate</th>
              <th className="text-left p-2 font-bold">We Sell</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency) => (
              <tr key={currency} className="border-t border-orange-400">
                <td className="p-2">{currency}</td>
                <td className="p-2">{calculateRate(rates[currency], 'buy')}</td>
                <td className="p-2">{rates[currency] ? parseFloat(rates[currency]).toFixed(4) : '-'}</td>
                <td className="p-2">{calculateRate(rates[currency], 'sell')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-center">
          * Base currency is USD
        </p>
      </div>
    </div>
  );
};

export default CurrencyExchangeTable;