import React, { useState, useEffect } from 'react';
import { X, Calculator, DollarSign, Download, Printer, RefreshCw, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { apiService } from '../../services/apiService';

export default function EstimatesModal() {
  const { isEstimatesOpen, setEstimatesOpen } = useUIStore();
  const { serializeScene } = useProjectStore();

  const [currency, setCurrency] = useState('USD');
  const [estimateData, setEstimateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Currency symbols map
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
  };

  const symbol = currencySymbols[currency] || '$';

  const runCalculation = async () => {
    setIsLoading(true);
    try {
      const scene = serializeScene();
      const res = await apiService.calculateEstimate(scene, currency);
      setEstimateData(res);
    } catch (err) {
      console.error('Calculation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEstimatesOpen) {
      runCalculation();
    }
  }, [isEstimatesOpen, currency]);

  if (!isEstimatesOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141822] border border-[#263142] rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222b3a] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Calculator className="w-5 h-5 text-[#34d399]" />
            <div>
              <h2 className="text-base font-semibold text-white">Construction Cost Takeoff & Preliminary BOQ</h2>
              <p className="text-[11px] text-[#64748b]">Real-time material quantity estimates and cost schedules based on active CAD geometry</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#1e2430] border border-[#2d3748] rounded px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>

            <button
              onClick={runCalculation}
              disabled={isLoading}
              className="p-1.5 bg-[#1e2430] hover:bg-[#283244] text-[#cbd5e1] rounded border border-[#2d3748]"
              title="Recalculate Takeoff"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button 
              onClick={() => setEstimatesOpen(false)}
              className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#1f2735]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {estimateData && estimateData.costSummary && (
            <>
              {/* Top Summary Cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-[#181f2c] border border-[#263346] p-3 rounded-xl">
                  <span className="text-[10px] text-[#64748b] font-mono">MATERIAL COST</span>
                  <div className="text-lg font-bold text-white mt-1">
                    {symbol} {estimateData.costSummary.materialCost?.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#181f2c] border border-[#263346] p-3 rounded-xl">
                  <span className="text-[10px] text-[#64748b] font-mono">LABOUR ESTIMATE</span>
                  <div className="text-lg font-bold text-[#38bdf8] mt-1">
                    {symbol} {estimateData.costSummary.labourCost?.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#181f2c] border border-[#263346] p-3 rounded-xl">
                  <span className="text-[10px] text-[#64748b] font-mono">CONTINGENCY (5%)</span>
                  <div className="text-lg font-bold text-[#f59e0b] mt-1">
                    {symbol} {estimateData.costSummary.contingencyCost?.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#065f46] to-[#047857] border border-[#059669] p-3 rounded-xl text-white">
                  <span className="text-[10px] text-green-200 font-mono">TOTAL ESTIMATED BUDGET</span>
                  <div className="text-xl font-bold mt-1">
                    {symbol} {estimateData.costSummary.grandTotal?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-green-200 mt-0.5">
                    {symbol} {estimateData.costSummary.costPerSqMeter} / m²
                  </div>
                </div>
              </div>

              {/* Engineering Quantities Bar */}
              {estimateData.quantities && (
                <div className="bg-[#131722] p-3 rounded-xl border border-[#222b3a] grid grid-cols-4 gap-3 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-[#64748b]">CONCRETE VOLUME</span>
                    <div className="text-sm font-bold text-[#38bdf8]">{estimateData.quantities.totalConcreteM3} m³</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b]">STEEL REINFORCEMENT</span>
                    <div className="text-sm font-bold text-[#34d399]">{estimateData.quantities.totalSteelKg} kg ({estimateData.quantities.totalSteelTons} t)</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b]">BRICK MASONRY</span>
                    <div className="text-sm font-bold text-[#f59e0b]">{estimateData.quantities.estimatedBricks} pcs</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748b]">FLOORING FINISH</span>
                    <div className="text-sm font-bold text-[#a78bfa]">{estimateData.quantities.totalTileAreaM2} m²</div>
                  </div>
                </div>
              )}

              {/* BOQ Line Items Table */}
              <div>
                <h3 className="text-xs font-semibold text-white mb-2">Itemized Bill of Quantities (BOQ)</h3>
                <div className="border border-[#263142] rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#181d28] border-b border-[#263142] text-[10px] font-mono text-[#94a3b8]">
                        <th className="py-2 px-3">CODE</th>
                        <th className="py-2 px-3">DESCRIPTION</th>
                        <th className="py-2 px-3 text-right">QUANTITY</th>
                        <th className="py-2 px-3">UNIT</th>
                        <th className="py-2 px-3 text-right">UNIT RATE ({symbol})</th>
                        <th className="py-2 px-3 text-right">TOTAL AMOUNT ({symbol})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2532] font-mono text-[11px]">
                      {estimateData.boqItems?.map((item) => (
                        <tr key={item.code} className="hover:bg-[#181f2c] transition-colors">
                          <td className="py-2 px-3 text-[#38bdf8]">{item.code}</td>
                          <td className="py-2 px-3 font-sans">
                            <div className="text-white font-medium">{item.name}</div>
                            <div className="text-[10px] text-[#64748b]">{item.description}</div>
                          </td>
                          <td className="py-2 px-3 text-right text-white font-bold">{item.quantity}</td>
                          <td className="py-2 px-3 text-[#94a3b8]">{item.unit}</td>
                          <td className="py-2 px-3 text-right text-[#94a3b8]">{item.unitPrice?.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right text-[#34d399] font-bold">{item.totalPrice?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Safety & Engineering Disclaimer */}
              <div className="bg-[#1f1912] border border-[#d97706]/30 p-2.5 rounded-lg flex items-start space-x-2 text-[11px] text-[#fbbf24]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#f59e0b]" />
                <p>{estimateData.disclaimer}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
