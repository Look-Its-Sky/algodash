'use client';

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const OhlcChart = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/df");
      return response.data
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Fetch and format data
    fetchData().then((data) => {
      const chartData = data['test']['df'].map(item => ({
        time: item.time as UTCTimestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close
      }));

      const takeProfit = data['test']['take_profit'];
      const stopLoss = data['test']['stop_loss'];
     
      console.log(`Data: ${data['test']}`);
      console.log(`Take Profit: ${takeProfit}`);
      console.log(`Stop Loss: ${stopLoss}`);

      seriesRef.current.setData(chartData);
      const stoplossLine = {
        price: stopLoss,
        color: '#fc230f',
        lineWidth: 2,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        title: 'Stop Loss',
      };

      const takeprofitLine = {
        price: takeProfit,
        color: '#16ba58',
        lineWidth: 2,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: true,
        title: 'Take Profit',
      }

      seriesRef.current.createPriceLine(stoplossLine);
      seriesRef.current.createPriceLine(takeprofitLine);
    });

    // Display chart
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#000',
      },
      grid: {
        vertLines: { color: '#e0e0e0' },
        horzLines: { color: '#e0e0e0' },
      },
      crosshair: {
        mode: 1, // Magnet to nearest data
      },
      priceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
      },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#f44336',
      borderVisible: true,
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    });

    return () => {
      chartRef.current.remove();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default OhlcChart;
