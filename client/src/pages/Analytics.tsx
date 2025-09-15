import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  MessageCircle,
  TrendingUp,
  Users,
  AlertTriangle,
  Send,
  Inbox,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

const sentimentData = [
  { name: "Positive", value: 75, color: "#10B981" },
  { name: "Neutral", value: 15, color: "#F59E0B" },
  { name: "Negative", value: 10, color: "#EF4444" },
];

const requestsData = [
  { request: "Housekeeping", count: 45, percentage: 30 },
  { request: "Maintenance", count: 30, percentage: 20 },
  { request: "Check-in/out", count: 38, percentage: 25 },
  { request: "Amenities", count: 23, percentage: 15 },
  { request: "Local Info", count: 15, percentage: 10 },
];

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `/api/v1/analytics?password=${import.meta.env.VITE_API_PASSWORD}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg">Loading analytics...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-lg text-red-600">Error: {error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600">
              Track your property performance and guest satisfaction
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Messages
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalMessages?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Response Time
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.responseTime?.toFixed(1) || "0"} min
                </div>
                <p className="text-xs text-muted-foreground">
                  Average resolution time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalUsers || "0"}
                </div>
                <p className="text-xs text-muted-foreground">Unique guests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Escalations
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalEscalations || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData?.totalPendingEscalations || "0"} pending
                  resolution
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Messages Sent
                </CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalMessagesSent?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Outbound messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Messages Received
                </CardTitle>
                <Inbox className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalMessagesReceived?.toLocaleString() ||
                    "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Inbound messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Resolved Escalations
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalResolvedEscalations || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully resolved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Escalations
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData?.totalPendingEscalations || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting resolution
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Message Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Most Requested Services */}
            <Card>
              <CardHeader>
                <CardTitle>Most Requested Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={requestsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="request" />
                      <YAxis />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
