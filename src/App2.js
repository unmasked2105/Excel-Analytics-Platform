import React, { useState, useRef } from 'react';
import { Upload, BarChart3, LineChart, PieChart, Download, User, Settings, History, LogOut, FileSpreadsheet, TrendingUp, Database } from 'lucide-react';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

const ExcelAnalyticsPlatform = () => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    xAxis: '',
    yAxis: '',
    title: 'Analytics Chart'
  });
  const [uploadHistory, setUploadHistory] = useState([]);
  const fileInputRef = useRef(null);

  // Sample data for demonstration
  const sampleData = [
    { month: 'Jan', sales: 4000, revenue: 2400, profit: 2000 },
    { month: 'Feb', sales: 3000, revenue: 1398, profit: 1500 },
    { month: 'Mar', sales: 2000, revenue: 9800, profit: 3000 },
    { month: 'Apr', sales: 2780, revenue: 3908, profit: 2500 },
    { month: 'May', sales: 1890, revenue: 4800, profit: 1800 },
    { month: 'Jun', sales: 2390, revenue: 3800, profit: 2200 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Authentication handlers
  const handleAuth = (email, password) => {
    if (email && password) {
      setUser({ email, name: email.split('@')[0] });
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    setCurrentData(null);
    setUploadedFiles([]);
  };

  // File upload handler
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

        const fileInfo = {
          id: Date.now(),
          name: file.name,
          uploadDate: new Date().toISOString().split('T')[0],
          rows: jsonData.length,
          columns: Object.keys(jsonData[0] || {}).length
        };

        setUploadedFiles(prev => [...prev, fileInfo]);
        setUploadHistory(prev => [...prev, fileInfo]);
        setCurrentData(jsonData);
        
        // Auto-set chart configuration
        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          setChartConfig(prev => ({
            ...prev,
            xAxis: columns[0] || '',
            yAxis: columns[1] || ''
          }));
        }
      } catch (error) {
        alert('Error parsing Excel file. Please ensure it\'s a valid .xlsx or .xls file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Chart generation
  const generateChart = () => {
    if (!currentData || !chartConfig.xAxis || !chartConfig.yAxis) return null;

    const chartData = currentData.slice(0, 10); // Limit to 10 items for better visualization

    switch (chartConfig.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={chartConfig.yAxis} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartConfig.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={chartConfig.yAxis} stroke="#10B981" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <RechartsPieChart
                data={chartData.map((item, index) => ({
                  name: item[chartConfig.xAxis],
                  value: item[chartConfig.yAxis]
                }))}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RechartsPieChart>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // Download chart as image (placeholder function)
  const downloadChart = (format) => {
    alert(`Chart download as ${format.toUpperCase()} would be implemented with html2canvas or similar library`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Excel Analytics Platform</h1>
            <p className="text-gray-600 mt-2">Upload, analyze, and visualize your data</p>
          </div>

          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-l-lg font-medium ${
                isLogin ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-r-lg font-medium ${
                !isLogin ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}
            <button
              onClick={(e) => {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                if (email && password) {
                  setUser({ email, name: email.split('@')[0] });
                  setCurrentView('dashboard');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg w-10 h-10 flex items-center justify-center">
                <BarChart3 className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Excel Analytics</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md font-medium ${
                  currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('upload')}
                className={`px-3 py-2 rounded-md font-medium ${
                  currentView === 'upload' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Upload & Analyze
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className={`px-3 py-2 rounded-md font-medium ${
                  currentView === 'history' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                History
              </button>
              
              <div className="flex items-center space-x-2">
                <User className="text-gray-600" size={20} />
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 ml-2"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <FileSpreadsheet className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Total Files</p>
                    <p className="text-2xl font-bold text-gray-800">{uploadedFiles.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-lg p-3">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Analyses Created</p>
                    <p className="text-2xl font-bold text-gray-800">{uploadHistory.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <Database className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600 text-sm">Data Points</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {currentData ? currentData.length : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Sample Analytics Dashboard</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3B82F6" />
                  <Bar dataKey="revenue" fill="#10B981" />
                  <Bar dataKey="profit" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Upload & Analyze View */}
        {currentView === 'upload' && (
          <div className="space-y-8">
            {/* File Upload */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Upload Excel File</h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Click to upload Excel file
                </p>
                <p className="text-gray-500">Supports .xlsx and .xls files</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Chart Configuration */}
            {currentData && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Chart Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                    <select
                      value={chartConfig.type}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="pie">Pie Chart</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
                    <select
                      value={chartConfig.xAxis}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, xAxis: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Column</option>
                      {currentData && Object.keys(currentData[0] || {}).map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
                    <select
                      value={chartConfig.yAxis}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, yAxis: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Column</option>
                      {currentData && Object.keys(currentData[0] || {}).map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
                    <input
                      type="text"
                      value={chartConfig.title}
                      onChange={(e) => setChartConfig(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter chart title"
                    />
                  </div>
                </div>

                {/* Chart Display */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">{chartConfig.title}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadChart('png')}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Download size={16} className="mr-2" />
                        PNG
                      </button>
                      <button
                        onClick={() => downloadChart('pdf')}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Download size={16} className="mr-2" />
                        PDF
                      </button>
                    </div>
                  </div>
                  {generateChart()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History View */}
        {currentView === 'history' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Upload History</h3>
            {uploadHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No upload history yet</p>
                <p className="text-gray-500">Upload some Excel files to see them here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">File Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Upload Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Rows</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Columns</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadHistory.map((file) => (
                      <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{file.name}</td>
                        <td className="py-3 px-4">{file.uploadDate}</td>
                        <td className="py-3 px-4">{file.rows}</td>
                        <td className="py-3 px-4">{file.columns}</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View Analysis
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelAnalyticsPlatform;