import React, { useState, useEffect } from "react";
import "./index.css";

const API_URL = "https://api.frankfurter.app/";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("AUD");
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCurrencies(params) {
      try {
        const res = await fetch(`${API_URL}latest`);
        const data = await res.json();

        setCurrencies(Object.keys(data.rates));
      } catch {
        setError("Failed to fetch currencies.");
      }
    }

    getCurrencies();
  }, []);

  async function getConvert(params) {
    if (!amount || amount <= 0) {
      setError("Amount must be greater then zero");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();

      setResult(data.rates[toCurrency]);
    } catch {
      setError("Failed to convert currencies.");
    } finally {
      setLoading(false);
    }
  }

  console.log(currencies);
  console.log(fromCurrency);
  console.log(toCurrency);
  console.log(amount);
  return (
    <div className="app">
      <h1>Currency Exchange Calculator</h1>

      <div className="converter-container">
        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <input
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            type="number"
            placeholder="Amount"
            className="input-field"
          />
          <select
            className="dropdown"
            onChange={(e) => setFromCurrency(e.target.value)}
            value={fromCurrency}
          >
            {currencies.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
          <span className="arrow">→</span>
          <select
            className="dropdown"
            onChange={(e) => setToCurrency(e.target.value)}
            value={toCurrency}
          >
            {currencies.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>
        <button className="convert-button" onClick={getConvert}>
          Convert
        </button>
        {loading && <p className="loading">Converting...</p>}

        {amount !== null && !error && !loading && (
          <p className="result">
            {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
