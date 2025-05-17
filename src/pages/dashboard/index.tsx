import React from "react";    
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  DollarSign,
  Users, 
} from "lucide-react";
import { Card } from "../../components/ui/card"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";


const lineData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 1100 },
  { name: "Aug", value: 1200 },
  { name: "Sep", value: 850 },
  { name: "Oct", value: 950 },
  { name: "Nov", value: 1300 },
  { name: "Dec", value: 1400 },
];

const barData = [
  { name: "Product A", value: 2400 },
  { name: "Product B", value: 1398 },
  { name: "Product C", value: 9800 },
  { name: "Product D", value: 3908 },
  { name: "Product E", value: 4800 },
];

const pieData = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 300 },
  { name: "Category D", value: 200 },
];

const areaData = [
  { name: "Q1", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Q2", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Q3", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Q4", uv: 2780, pv: 3908, amt: 2000 },
];

const multiLineData = [
  { name: "Jan", series1: 400, series2: 240, series3: 320 },
  { name: "Feb", series1: 300, series2: 139, series3: 220 },
  { name: "Mar", series1: 600, series2: 980, series3: 790 },
  { name: "Apr", series1: 800, series2: 390, series3: 560 },
  { name: "May", series1: 500, series2: 480, series3: 490 },
  { name: "Jun", series1: 900, series2: 380, series3: 600 },
];
 
const metricsData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,345",
    change: "+10.3%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    trend: "down",
    icon: Activity,
  },
  {
    title: "Avg. Transaction",
    value: "$48.67",
    change: "+6.8%",
    trend: "up",
    icon: CreditCard,
  },
];

export default function Dashboard() {    

  return (
    <>
      <div className="flex flex-col  bg-gray-100"> 
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground">Your key metrics and performance indicators at a glance.</p>
          </div>
 
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-md bg-primary/10 p-2">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      metric.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metric.change}
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </Card>
            ))}
          </div>
 
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> 
                <Card className="col-span-2 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Performance Trend</h3>
                    <Select defaultValue="monthly">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
 
                <Card className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">Distribution</h3>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                          label
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2"> 
                <Card className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">Comparison</h3>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
 
                <Card className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">Growth</h3>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="uv"
                          stackId="1"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary)/0.2)"
                        />
                        <Area
                          type="monotone"
                          dataKey="pv"
                          stackId="1"
                          stroke="hsl(var(--primary)/0.7)"
                          fill="hsl(var(--primary)/0.5)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Detailed Analytics</h3>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={multiLineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="series1"
                        name="Product A"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="series2"
                        name="Product B"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="series3"
                        name="Product C"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium">Reports</h3>
                <p className="text-muted-foreground">
                    Your report data will appear here. This is a placeholder for future report content.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium">User Analytics</h3>
                <p className="text-muted-foreground">
                    User analytics data will appear here. This is a placeholder for future user metrics.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </> 
  );
}