'use client'

import { motion } from 'framer-motion'
import { Zap, Droplets, Wrench, Users, Package, TrendingDown, AlertCircle, Calendar, Plus } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { OwnerLayout } from '@/components/owner-layout'
import { useAuth } from '@/TurfArena/lib/auth-context'
import { useState } from 'react'

interface Expense {
  id: string
  name: string
  category: string
  amount: number
  date: string
  description: string
  status: 'paid' | 'pending'
  icon: any
  color: string
}

export default function ExpensesPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const expenses: Expense[] = [
    {
      id: '1',
      name: 'Electricity Bill',
      category: 'Utilities',
      amount: 28000,
      date: '2024-06-15',
      description: 'Monthly electricity consumption',
      status: 'paid',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: '2',
      name: 'Water Supply',
      category: 'Utilities',
      amount: 5000,
      date: '2024-06-20',
      description: 'Water bills and maintenance',
      status: 'paid',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: '3',
      name: 'Ground Maintenance',
      category: 'Maintenance',
      amount: 8000,
      date: '2024-06-18',
      description: 'Grass cutting and field leveling',
      status: 'paid',
      icon: Wrench,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: '4',
      name: 'Equipment Repair',
      category: 'Maintenance',
      amount: 5000,
      date: '2024-06-22',
      description: 'Goal post and light repair',
      status: 'pending',
      icon: Wrench,
      color: 'from-red-500 to-orange-500',
    },
    {
      id: '5',
      name: 'Staff Salary - June',
      category: 'Staff',
      amount: 45000,
      date: '2024-06-01',
      description: 'Monthly salary for staff',
      status: 'paid',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: '6',
      name: 'New Sports Equipment',
      category: 'Equipment',
      amount: 8000,
      date: '2024-06-25',
      description: 'Footballs, cones, and training gear',
      status: 'pending',
      icon: Package,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const expensesByCategory = {
    Utilities: expenses.filter(e => e.category === 'Utilities').reduce((sum, e) => sum + e.amount, 0),
    Maintenance: expenses.filter(e => e.category === 'Maintenance').reduce((sum, e) => sum + e.amount, 0),
    Staff: expenses.filter(e => e.category === 'Staff').reduce((sum, e) => sum + e.amount, 0),
    Equipment: expenses.filter(e => e.category === 'Equipment').reduce((sum, e) => sum + e.amount, 0),
  }

  const totalExpenses = Object.values(expensesByCategory).reduce((sum, a) => sum + a, 0)
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0)
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerLayout title="Expenses" subtitle="Track all operational costs and bills" selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Total Expenses</span>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹{(totalExpenses / 100000).toFixed(2)}L</p>
            <p className="text-xs text-white/60 mt-2">This month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Paid</span>
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹{(paidExpenses / 100000).toFixed(2)}L</p>
            <p className="text-xs text-emerald-400 mt-2">{((paidExpenses / totalExpenses) * 100).toFixed(0)}% settled</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/70">Pending</span>
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">₹{(pendingExpenses / 100000).toFixed(2)}L</p>
            <p className="text-xs text-yellow-400 mt-2">Due soon</p>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">By Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(expensesByCategory).map(([category, amount], idx) => {
              const percentage = (amount / totalExpenses) * 100
              const colors = ['from-yellow-500 to-orange-500', 'from-green-500 to-emerald-500', 'from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500']
              return (
                <div key={category} className={`bg-gradient-to-br ${colors[idx]} bg-opacity-10 border border-white/10 rounded-xl p-4`}>
                  <p className="text-white/70 text-sm font-medium mb-2">{category}</p>
                  <p className="text-2xl font-bold text-white">₹{(amount / 1000).toFixed(0)}K</p>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mt-3">
                    <div className={`bg-gradient-to-r ${colors[idx]} h-full rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-xs text-white/60 mt-2">{percentage.toFixed(1)}% of total</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Expenses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Recent Expenses</h3>

          <div className="space-y-3">
            {expenses.map((expense, idx) => {
              const Icon = expense.icon
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="rounded-xl bg-white/5 border border-white/10 hover:border-white/20 p-4 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`bg-gradient-to-br ${expense.color} rounded-lg p-3 flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm">{expense.name}</p>
                        <p className="text-xs text-white/60">{expense.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                          <Calendar className="w-3 h-3" />
                          {new Date(expense.date).toLocaleDateString()}
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                              expense.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {expense.status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-white whitespace-nowrap">₹{expense.amount.toLocaleString()}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Add Expense Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-2xl py-4 text-white font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Expense
        </motion.button>
      </OwnerLayout>
    </ProtectedRoute>
  )
}
