import React, { useState, useEffect } from "react";
import "./index.css";

//Rus

//БЕЗ ПОДСКАЗОК:
//Создайте интерфейс для конвертации валют с загрузкой данных валют из API Frankfurter в state, динамическим отображением options в select, обработкой выбранных валют, ввода суммы, расчётом конвертации через асинхронную функцию с try/catch/finally, отображением результата в UI, проверкой, что сумма больше 0, и состояниями для загрузки и ошибок.

//C ПОДСКАЗКАМИ:
/*
// 1 - Получите массив всех валют из API Frankfurter и запишите его в state.
// 2 - Используя map, динамически создайте options внутри select.
// 3 - Получите значения выбранных валют из обоих select и запишите их в state fromCurrency и toCurrency.
// 4 - Создайте state для записи amount из input. Запишите данные из input в этот state.
// 5 - Создайте вторую асинхронную функцию для получения значения конвертации двух валют. Запишите результат конвертации в новый state - convertedAmount. Покажите результат в интерфейсе.
// 6 - Добавьте в обе функции блоки try/catch/finally. Создайте state для loading (true/false) и error ("Сообщение ошибки").
// 7 - Внедрите логику отображения загрузки и ошибок в интерфейсе.
// 8 - Добавьте проверку, чтобы amount был больше 0.
*/

//https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD

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
