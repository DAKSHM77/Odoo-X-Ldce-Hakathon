import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import ExpenseRow from './ExpenseRow'

/**
 * BudgetSummaryPanel
 * Full budget & expense overview for the itinerary.
 *
 * Props:
 *   sections  – [{ id, title, budget, spent }]
 *   expenses  – [{ id, category, description, amount, date, sectionTitle }]
 *   totalBudget – number
 *   totalSpent  – number
 */

const CHART_COLOURS = ['#6366f1','#06b6d4','#8b5cf6','#10b981','#f59e0b','#f43f5e']

const fmt = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`

// Custom tooltip for BarChart
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }} className="text-xs">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

// Custom tooltip for PieChart
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-gray-600">{fmt(value)}</p>
    </div>
  )
}

export default function BudgetSummaryPanel({ sections = [], expenses = [], totalBudget = 0, totalSpent = 0 }) {
  const [showAllExpenses, setShowAllExpenses] = useState(false)
  const remaining   = totalBudget - totalSpent
  const overBudget  = totalSpent > totalBudget
  const spentPct    = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0

  // ── Bar chart data: budget vs spent per section ──
  const barData = sections.map((s) => ({
    name: s.title.length > 16 ? s.title.slice(0, 16) + '…' : s.title,
    Budget: parseFloat(s.budget) || 0,
    Spent:  parseFloat(s.spent)  || 0,
  }))

  // ── Pie chart data: spending by category ──
  const catTotals = {}
  expenses.forEach((e) => {
    const cat = e.category || 'other'
    catTotals[cat] = (catTotals[cat] || 0) + (parseFloat(e.amount) || 0)
  })
  const pieData = Object.entries(catTotals).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Expenses list (capped unless expanded)
  const visibleExpenses = showAllExpenses ? expenses : expenses.slice(0, 6)

  return (
    <div id="budget-summary-panel" className="space-y-6">

      {/* ── Overview KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Budget</p>
          <p className="text-3xl font-bold text-gray-900">{fmt(totalBudget)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-indigo-600">
            <DollarSign size={12} />
            <span>Planned spend</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Spent</p>
          <p className={`text-3xl font-bold ${overBudget ? 'text-red-600' : 'text-gray-900'}`}>
            {fmt(totalSpent)}
          </p>
          <div className={`flex items-center gap-1 mt-2 text-xs ${overBudget ? 'text-red-500' : 'text-emerald-600'}`}>
            {overBudget ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{overBudget ? 'Over budget' : 'Within budget'}</span>
          </div>
        </div>

        {/* Remaining */}
        <div className={`rounded-2xl border shadow-sm p-5 ${overBudget ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Remaining</p>
          <p className={`text-3xl font-bold ${overBudget ? 'text-red-700' : 'text-emerald-700'}`}>
            {overBudget ? `-${fmt(Math.abs(remaining))}` : fmt(remaining)}
          </p>
          {overBudget && (
            <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
              <AlertTriangle size={12} />
              <span>Exceeds budget by {fmt(Math.abs(remaining))}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Global progress bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="font-medium">Overall spending progress</span>
          <span className="font-semibold text-gray-800">{spentPct.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${overBudget ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'}`}
            style={{ width: `${spentPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>{fmt(0)}</span>
          <span>{fmt(totalBudget)}</span>
        </div>
      </div>

      {/* ── Per-Section bar chart ── */}
      {barData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Budget vs. Spent — Per Section</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="Budget" fill="#e0e7ff" radius={[4,4,0,0]} name="Budget" />
                <Bar dataKey="Spent"  fill="#6366f1" radius={[4,4,0,0]} name="Spent"  />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 justify-center">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-100 inline-block" /> Budget</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> Spent</span>
          </div>
        </div>
      )}

      {/* ── Spending by category (Pie) ── */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Spending by Category</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLOURS[i % CHART_COLOURS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Expense table ── */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">All Expenses</h3>
            <p className="text-xs text-gray-400 mt-0.5">{expenses.length} transactions</p>
          </div>
          <div className="overflow-x-auto">
            <table id="expenses-table" className="w-full">
              <tbody className="divide-y divide-gray-50">
                {visibleExpenses.map((exp) => (
                  <ExpenseRow key={exp.id} expense={exp} showSection />
                ))}
              </tbody>
            </table>
          </div>

          {expenses.length > 6 && (
            <div className="px-5 py-3 border-t border-gray-50 text-center">
              <button
                id="toggle-all-expenses-btn"
                type="button"
                onClick={() => setShowAllExpenses((s) => !s)}
                className="
                  inline-flex items-center gap-1.5 text-xs font-medium
                  text-indigo-600 hover:text-indigo-800 transition-colors
                "
              >
                {showAllExpenses
                  ? <><ChevronUp size={14} /> Show less</>
                  : <><ChevronDown size={14} /> Show all {expenses.length} expenses</>
                }
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
