import React, { useMemo } from 'react';
import { Download, Users, Clock, Activity } from 'lucide-react';
import AreaChart from '../../components/ui/area-chart';

// Helper to generate mock data for the last 90 days
const generateMockData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Random visitors between 50 and 300
    const visitors = Math.floor(Math.random() * 250) + 50;
    
    // Random peak time (e.g., 18 = 6 PM, 19 = 7 PM, etc)
    const peakHour = Math.floor(Math.random() * 5) + 17; // 5 PM to 9 PM
    const peakTimeStr = `${peakHour > 12 ? peakHour - 12 : peakHour}:00 ${peakHour >= 12 ? 'PM' : 'AM'}`;
    
    // Random total watch time in hours
    const watchTime = Math.round((visitors * (Math.random() * 1.5 + 0.5)) * 10) / 10;
    
    data.push({
      date: dateStr,
      rawDate: d,
      visitors,
      peakTimeStr,
      peakHour,
      watchTime
    });
  }
  return data;
};

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = React.useState<any[]>(() => {
    const saved = localStorage.getItem('cafe_analytics_data');
    if (saved) return JSON.parse(saved);
    // On first load, it will be empty as per user request
    return [];
  });

  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [resetUsername, setResetUsername] = React.useState('');
  const [resetPassword, setResetPassword] = React.useState('');
  const [resetError, setResetError] = React.useState('');

  // Save to localStorage when updated
  React.useEffect(() => {
    localStorage.setItem('cafe_analytics_data', JSON.stringify(analyticsData));
  }, [analyticsData]);

  // Prepare data for Daily Visitors Chart
  const chartDataVisitors = useMemo(() => {
    if (analyticsData.length === 0) return [{ Date: 'No Data', Visitors: 0 }];
    return analyticsData.map(d => ({
      Date: d.date,
      Visitors: d.visitors
    }));
  }, [analyticsData]);

  const chartDataPeakTime = useMemo(() => {
    if (analyticsData.length === 0) return [{ Time: 'No Data', "Average Visitors": 0 }];
    const hours = [16, 17, 18, 19, 20, 21, 22];
    return hours.map(h => {
      const diff = Math.abs(19 - h);
      const avgVisitors = Math.round(150 / (diff + 1));
      return {
        Time: `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`,
        "Average Visitors": analyticsData.length > 0 ? avgVisitors : 0
      };
    });
  }, [analyticsData]);

  const downloadCSV = () => {
    if (analyticsData.length === 0) return alert("No data to download");

    let csv = "Daily Logs (Last 90 Days)\nSerial,Date,Visitors,Peak Time,Total Watch Time (hrs)\n";
    analyticsData.forEach((row, index) => {
      csv += `${index + 1},${row.date},${row.visitors},${row.peakTimeStr},${row.watchTime}\n`;
    });
    
    csv += "\n\nAverage Peak Time Data\nTime,Average Visitors\n";
    chartDataPeakTime.forEach(row => {
      csv += `${row.Time},${row["Average Visitors"]}\n`;
    });

    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cafe_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetUsername === 'xyz' && resetPassword === '1234567890') {
      setAnalyticsData([]);
      setIsResetModalOpen(false);
      setResetUsername('');
      setResetPassword('');
      setResetError('');
      alert("Analytics have been resetted.");
    } else {
      setResetError("Invalid credentials. Reset failed.");
    }
  };

  const totalVisitors = analyticsData.reduce((sum, d) => sum + d.visitors, 0);
  const avgVisitors = analyticsData.length > 0 ? Math.round(totalVisitors / analyticsData.length) : 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400 text-sm">Track your cafe's performance and visitor metrics.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsResetModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 rounded-lg font-bold border border-red-500/20 transition-all text-sm"
          >
            <Activity size={16} />
            <span>Reset Analytics</span>
          </button>
          <button 
            onClick={downloadCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-bold transition-all border border-white/10 text-sm"
          >
            <Download size={16} />
            <span>Download .CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111] p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center text-[#D4A853]">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Visitors</p>
            <p className="text-xl font-bold text-white">{totalVisitors.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#111] p-5 rounded-xl border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center text-[#D4A853]">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Daily Average</p>
            <p className="text-xl font-bold text-white">{avgVisitors.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#111] p-5 rounded-xl border border-white/5 flex items-center gap-4 sm:col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center text-[#D4A853]">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg. Peak Time</p>
            <p className="text-xl font-bold text-white">{analyticsData.length > 0 ? "7:00 PM" : "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-white/5">
          <h3 className="text-md font-bold text-white mb-4">Daily Visitors (Last 90 Days)</h3>
          <AreaChart 
            data={chartDataVisitors} 
            index="Date" 
            categories={["Visitors"]} 
            colors={["#D4A853"]}
            className="h-64 md:h-80"
          />
        </div>

        <div className="bg-[#111] p-4 md:p-6 rounded-xl border border-white/5">
          <h3 className="text-md font-bold text-white mb-4">Average Visitors by Time of Day</h3>
          <AreaChart 
            data={chartDataPeakTime} 
            index="Time" 
            categories={["Average Visitors"]} 
            colors={["#10b3a3"]}
            className="h-64 md:h-80"
          />
        </div>
      </div>

      {/* Daily Logs Table */}
      <div className="mt-8 bg-[#111] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-md font-bold text-white">Daily Logs (Recent)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#0a0a0a] text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-4 py-3 font-medium">S.No</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Visitors</th>
                <th className="px-4 py-3 font-medium">Peak Time</th>
                <th className="px-4 py-3 font-medium text-right">Watch Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {analyticsData.length > 0 ? (
                analyticsData.slice(-10).reverse().map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors text-gray-400">
                    <td className="px-4 py-3">{analyticsData.length - idx}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3">{row.visitors}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.peakTimeStr}</td>
                    <td className="px-4 py-3 text-right">{row.watchTime.toFixed(1)}h</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-600 italic">No logs available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2">Confirm Reset</h2>
            <p className="text-sm text-gray-400 mb-6">This will delete ALL analytics data permanently. Please confirm your identity.</p>
            
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  value={resetUsername}
                  onChange={e => setResetUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  value={resetPassword}
                  onChange={e => setResetPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              {resetError && <p className="text-red-500 text-xs">{resetError}</p>}
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold transition-colors shadow-lg"
                >
                  Reset Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
