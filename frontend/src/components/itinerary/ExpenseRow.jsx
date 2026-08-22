import { Utensils, Car, Hotel, Camera, ShoppingBag, Ticket, Wifi, MoreHorizontal } from 'lucide-react'

/**
 * ExpenseRow
 * A single line-item in the expense table.
 *
 * Props:
 *   expense – {
 *     id, category, description, amount, date, sectionTitle
 *   }
 *   showSection – bool  (show the section name column, default false)
 */

const CATEGORY_META = {
  transport:   { icon: Car,         label: 'Transport',   colour: 'bg-blue-100 text-blue-600'    },
  hotel:       { icon: Hotel,       label: 'Hotel',       colour: 'bg-indigo-100 text-indigo-600' },
  food:        { icon: Utensils,    label: 'Food',        colour: 'bg-orange-100 text-orange-600' },
  activity:    { icon: Camera,      label: 'Activity',    colour: 'bg-emerald-100 text-emerald-600'},
  shopping:    { icon: ShoppingBag, label: 'Shopping',    colour: 'bg-pink-100 text-pink-600'    },
  tickets:     { icon: Ticket,      label: 'Tickets',     colour: 'bg-violet-100 text-violet-600' },
  connectivity:{ icon: Wifi,        label: 'Connectivity',colour: 'bg-cyan-100 text-cyan-600'    },
  other:       { icon: MoreHorizontal, label: 'Other',   colour: 'bg-gray-100 text-gray-600'    },
}

const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function ExpenseRow({ expense, showSection = false }) {
  const meta = CATEGORY_META[expense.category] || CATEGORY_META.other
  const Icon = meta.icon

  return (
    <tr
      id={`expense-row-${expense.id}`}
      className="group hover:bg-gray-50 transition-colors duration-150"
    >
      {/* Category icon */}
      <td className="py-3 pl-4 pr-2 w-10">
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${meta.colour}`}>
          <Icon size={14} />
        </span>
      </td>

      {/* Description */}
      <td className="py-3 pr-4">
        <p className="text-sm font-medium text-gray-800 leading-tight">{expense.description}</p>
        <p className="text-xs text-gray-400 mt-0.5">{meta.label}</p>
      </td>

      {/* Section (optional) */}
      {showSection && (
        <td className="py-3 pr-4 hidden sm:table-cell">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {expense.sectionTitle}
          </span>
        </td>
      )}

      {/* Date */}
      <td className="py-3 pr-4 hidden md:table-cell">
        <span className="text-xs text-gray-500">{fmtDate(expense.date)}</span>
      </td>

      {/* Amount */}
      <td className="py-3 pr-4 text-right">
        <span className="text-sm font-semibold text-gray-800">{fmt(expense.amount)}</span>
      </td>
    </tr>
  )
}
