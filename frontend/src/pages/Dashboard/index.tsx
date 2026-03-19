import { StatCard } from '../../components/ui/StatCard'
import { RecentExperiments } from './RecentExperiments'
import { ActivityFeed } from './ActivityFeed'
import { dashboardStats } from '../../data/mock-data'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-text mt-1">Platform overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Active Experiments"
          value={dashboardStats.activeExperiments.value}
          trend={dashboardStats.activeExperiments.trend}
          positive={dashboardStats.activeExperiments.positive}
        />
        <StatCard
          label="Total Models"
          value={dashboardStats.totalModels.value}
          trend={dashboardStats.totalModels.trend}
          positive={dashboardStats.totalModels.positive}
        />
        <StatCard
          label="Benchmarks"
          value={dashboardStats.benchmarks.value}
          trend={dashboardStats.benchmarks.trend}
          positive={dashboardStats.benchmarks.positive}
        />
        <StatCard
          label="Weekly Evaluations"
          value={dashboardStats.weeklyEvaluations.value}
          trend={dashboardStats.weeklyEvaluations.trend}
          positive={dashboardStats.weeklyEvaluations.positive}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RecentExperiments />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
