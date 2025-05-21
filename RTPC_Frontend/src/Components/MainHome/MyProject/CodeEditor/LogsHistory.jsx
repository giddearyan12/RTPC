import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LogsHistory.css';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import Header from '../../Header';

ChartJS.register(ArcElement, Tooltip, Legend);

const LogsHistory = () => {
  const [logs, setLogs] = useState([]);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [logCounts, setLogCounts] = useState({});
  const [showChart, setShowChart] = useState(false);

  const { projectId } = useParams();

  const getLogs = async () => {
    const response = await axios.post("http://localhost:5000/api/logs-code", {
      projectId,
    });

    const reversedLogs = response.data.reverse();
    setLogs(reversedLogs);

    const counts = {};
    reversedLogs.forEach((log) => {
      counts[log.username] = (counts[log.username] || 0) + 1;
    });

    setLogCounts(counts);
  };

  useEffect(() => {
    getLogs();
  }, []);

  const toggleCodeVisibility = (index) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const pieData = {
    labels: Object.keys(logCounts),
    datasets: [
      {
        label: 'Contributions',
        data: Object.values(logCounts),
        backgroundColor: [
          '#0984e3', '#00b894', '#fdcb6e', '#e17055', '#6c5ce7',
          '#fab1a0', '#81ecec', '#ffeaa7', '#a29bfe', '#dfe6e9'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="logs-container-full">
        <div className='logs-container-header'>
          <h2 className="logs-title">Project Logs</h2>
          {Object.keys(logCounts).length > 0 && (
            <button
              className="toggle-chart-btn"
              onClick={() => setShowChart(!showChart)}
            >
              {showChart ? "Hide Contributions" : "Show Contributions"}
            </button>
          )}
        </div>

        {showChart && (
          <div className="logs-chart-container">
            <h3 className="chart-title">Contributions Overview</h3>
            <div className="pie-chart-wrapper">
              <Pie data={pieData} />
            </div>
          </div>
        )}

        {logs.map((log, index) => (
          <div key={index} className={`log-entry`}>
            <h3 className="username-heading">{log.username}</h3>
            <div className="log-header">
              <span className="log-time">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <button
              className="toggle-code-btn"
              onClick={() => toggleCodeVisibility(index)}
            >
              {expandedLogs[index] ? 'Hide Code' : 'Show Code'}
            </button>
            {expandedLogs[index] && (
              <pre className="log-code">{log.code}</pre>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default LogsHistory;
