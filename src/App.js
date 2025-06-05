import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  User, 
  Settings, 
  Eye,
  Zap,
  Trophy,
  Sparkles,
  Coffee
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';

const ExcelAnalyticsPlatform = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [uploadedData, setUploadedData] = useState(null);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [memeReaction, setMemeReaction] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const fileInputRef = useRef(null);

  // Meme reactions for interactive feedback
  const memeReactions = [
    { id: 'stonks', emoji: '📈', text: 'STONKS!', color: 'text-green-400' },
    { id: 'fire', emoji: '🔥', text: 'This is fine', color: 'text-orange-400' },
    { id: 'brain', emoji: '🧠', text: 'Big Brain Time', color: 'text-purple-400' },
    { id: 'coffee', emoji: '☕', text: 'Powered by Coffee', color: 'text-yellow-400' },
    { id: 'rocket', emoji: '🚀', text: 'To the Moon!', color: 'text-blue-400' }
  ];

  const chartColors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleLogin = () => {
    // Mock authentication - in real app, this would call your JWT backend
    if (emailValue && passwordValue) {
      setUser({ email: emailValue, role: emailValue.includes('admin') ? 'admin' : 'user' });
      setCurrentView('dashboard');
      triggerMemeReaction('rocket');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setUploadedData({
          fileName: file.name,
          data: jsonData,
          columns: Object.keys(jsonData[0] || {}),
          uploadDate: new Date().toISOString()
        });
        
        triggerMemeReaction('brain');
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        triggerMemeReaction('fire');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const triggerMemeReaction = (reactionId) => {
    const reaction = memeReactions.find(r => r.id === reactionId);
    setMemeReaction(reaction);
    setTimeout(() => setMemeReaction(''), 3000);
  };

  const generateChartData = () => {
    if (!uploadedData || !xAxis || !yAxis) return [];
    
    return uploadedData.data.map(row => ({
      [xAxis]: row[xAxis],
      [yAxis]: parseFloat(row[yAxis]) || 0
    })).slice(0, 10); // Limit to 10 items for better visualization
  };

  const downloadChart = () => {
    triggerMemeReaction('stonks');
    // In a real app, this would generate and download the chart
    alert('Chart download would start here! 📊');
  };

  const LoginScreen = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-700">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-12 h-12 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Excel Analytics</h1>
          <p className="text-gray-400">Discord vibes, Excel power 📊</p>
        </div>
        
        <div onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Login & Analyze
          </button>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          Try: admin@test.com / user@test.com with any password
        </p>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold text-white">Excel Analytics Platform</h1>
            {user?.role === 'admin' && (
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">ADMIN</span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              {user?.email}
            </div>
            <button
              onClick={() => {
                setUser(null);
                setCurrentView('login');
                setUploadedData(null);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="space-y-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Excel
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {uploadedData && (
              <div className="mt-6 space-y-3">
                <div className="text-gray-300 font-medium">Chart Type</div>
                {[
                  { id: 'bar', icon: BarChart3, label: 'Bar Chart' },
                  { id: 'line', icon: TrendingUp, label: 'Line Chart' },
                  { id: 'pie', icon: PieChart, label: 'Pie Chart' }
                ].map(chart => (
                  <button
                    key={chart.id}
                    onClick={() => setSelectedChart(chart.id)}
                    className={`w-full p-3 rounded-lg flex items-center gap-2 transition-colors ${
                      selectedChart === chart.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <chart.icon className="w-5 h-5" />
                    {chart.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {!uploadedData ? (
            <div className="bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-600">
              <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload your Excel file</h3>
              <p className="text-gray-400 mb-6">Drop your .xlsx or .xls file to get started with some epic data visualization</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Choose File
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">📊 {uploadedData.fileName}</h3>
                    <p className="text-gray-400">
                      {uploadedData.data.length} rows • {uploadedData.columns.length} columns
                    </p>
                  </div>
                  <button
                    onClick={downloadChart}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Chart
                  </button>
                </div>
              </div>

              {/* Axis Selection */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Select Chart Axes</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">X-Axis</label>
                    <select
                      value={xAxis}
                      onChange={(e) => setXAxis(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select column...</option>
                      {uploadedData.columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Y-Axis</label>
                    <select
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select column...</option>
                      {uploadedData.columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Chart Display */}
              {xAxis && yAxis && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart
                  </h4>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      {selectedChart === 'bar' && (
                        <BarChart data={generateChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey={xAxis} stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F3F4F6'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey={yAxis} fill="#7c3aed" />
                        </BarChart>
                      )}
                      
                      {selectedChart === 'line' && (
                        <LineChart data={generateChartData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey={xAxis} stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F3F4F6'
                            }} 
                          />
                          <Legend />
                          <Line type="monotone" dataKey={yAxis} stroke="#7c3aed" strokeWidth={3} />
                        </LineChart>
                      )}
                      
                      {selectedChart === 'pie' && (
                        <RechartsPieChart>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F3F4F6'
                            }} 
                          />
                        </RechartsPieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meme Reaction Overlay */}
      {memeReaction && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-gray-800 border border-gray-600 rounded-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-2">{memeReaction.emoji}</div>
              <div className={`text-lg font-bold ${memeReaction.color}`}>
                {memeReaction.text}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return currentView === 'login' ? <LoginScreen /> : <Dashboard />;
};

export default ExcelAnalyticsPlatform;