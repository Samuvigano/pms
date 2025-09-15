import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Send,
  Loader2,
} from "lucide-react";

interface Escalation {
  _id: string;
  user_id: string;
  message: string;
  status: "pending" | "resolved";
  createdAt: string;
  updatedAt: string;
  guestName?: string;
  propertyName?: string;
  priority?: "high" | "medium" | "low";
}

const guestNames = [
  "Emily Carter",
  "Liam Johnson",
  "Olivia Smith",
  "Noah Williams",
  "Sophia Brown",
  "James Davis",
  "Ava Miller",
  "Benjamin Wilson",
  "Isabella Moore",
  "Lucas Taylor",
  "Mia Anderson",
  "Henry Thomas",
  "Charlotte Jackson",
  "Jack White",
  "Amelia Harris",
];

const propertyNames = [
  "Oceanview Retreat",
  "Mountain Hideaway",
  "Cityscape Loft",
  "Lakeside Cabin",
  "Downtown Haven",
  "Sunnyvale Cottage",
  "The Rustic Barn",
  "Palm Grove Villa",
  "Serenity Stay",
  "Skyline Apartment",
  "Hilltop House",
  "Seaside Escape",
  "Forest Edge Lodge",
  "Modern Nest",
  "Coastal Comfort",
];

// Helper function to get random items from arrays without duplicates
const getRandomItems = (array: string[], count: number): string[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to format timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours === 1) return "1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
};

const Escalations = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(
    null
  );
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch escalations from API
  const fetchEscalations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/escalations?password=${import.meta.env.VITE_API_PASSWORD}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch escalations");
      }
      const data = await response.json();

      const randomGuestNames = getRandomItems(guestNames, data.length);
      const randomPropertyNames = getRandomItems(propertyNames, data.length);

      const escalationsWithNames = data.map(
        (escalation: any, index: number) => ({
          ...escalation,
          guestName:
            escalation.userName && escalation.userName.trim()
              ? escalation.userName
              : randomGuestNames[index],
          propertyName: randomPropertyNames[index],
          priority:
            Math.random() > 0.7
              ? "high"
              : Math.random() > 0.4
              ? "medium"
              : "low",
        })
      );

      setEscalations(escalationsWithNames);
    } catch (error) {
      console.error("Error fetching escalations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Resolve escalation
  const handleResolveEscalation = async (escalationId: string) => {
    try {
      setResolving(escalationId);
      const response = await fetch(
        "/api/v1/escalations/resolve?password=" +
          import.meta.env.VITE_API_PASSWORD,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: escalationId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve escalation");
      }

      // Update the escalation status locally
      setEscalations((prev) =>
        prev.map((escalation) =>
          escalation._id === escalationId
            ? { ...escalation, status: "resolved" }
            : escalation
        )
      );
    } catch (error) {
      console.error("Error resolving escalation:", error);
    } finally {
      setResolving(null);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleSendResponse = async (escalationId: string) => {
    if (!responseMessage.trim()) return;

    try {
      setSending(escalationId);

      // Find the escalation to get the phone number
      const escalation = escalations.find((e) => e._id === escalationId);
      if (!escalation) {
        throw new Error("Escalation not found");
      }

      const response = await fetch(
        `/api/v1/send?password=${import.meta.env.VITE_API_PASSWORD}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: escalation.user_id,
            text: responseMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Clear the form and close the response section
      setResponseMessage("");
      setSelectedEscalation(null);

      console.log("Message sent successfully to:", escalation.user_id);
    } catch (error) {
      console.error("Error sending message:", error);
      // You could add a toast notification here for better UX
    } finally {
      setSending(null);
    }
  };

  const pendingEscalations = escalations.filter((e) => e.status === "pending");
  const resolvedEscalations = escalations.filter(
    (e) => e.status === "resolved"
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading escalations...</span>
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Guest Requests
              </h2>
              <p className="text-gray-600">
                Manage and respond to guest service requests
              </p>
            </div>

            {/* Pending Requests */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                Pending Requests ({pendingEscalations.length})
              </h3>

              <div className="space-y-4">
                {pendingEscalations.map((escalation) => (
                  <Card
                    key={escalation._id}
                    className="hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-400"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900 mb-1">
                              {escalation.guestName}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mb-2">
                              {escalation.propertyName} •{" "}
                              {formatTimestamp(escalation.createdAt)}
                            </p>
                            <p className="text-gray-900 leading-relaxed">
                              {escalation.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge
                            className={getPriorityColor(
                              escalation.priority || "medium"
                            )}
                          >
                            {escalation.priority || "medium"} priority
                          </Badge>
                          <Badge className={getStatusColor(escalation.status)}>
                            {getStatusIcon(escalation.status)}
                            <span className="ml-1">{escalation.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {selectedEscalation === escalation._id ? (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Respond to {escalation.guestName}
                          </h4>
                          <Textarea
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            placeholder="Type your response to the guest here..."
                            rows={4}
                            className="mb-3 border-blue-200 focus:border-blue-400"
                          />
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={() => handleSendResponse(escalation._id)}
                              disabled={
                                !responseMessage.trim() ||
                                sending === escalation._id
                              }
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {sending === escalation._id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Response
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedEscalation(null)}
                              disabled={sending === escalation._id}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() =>
                              setSelectedEscalation(escalation._id)
                            }
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Respond to Guest
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleResolveEscalation(escalation._id)
                            }
                            disabled={resolving === escalation._id}
                          >
                            {resolving === escalation._id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Resolving...
                              </>
                            ) : (
                              "Mark as Resolved"
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Resolved Requests */}
            {resolvedEscalations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Recently Resolved ({resolvedEscalations.length})
                </h3>

                <div className="space-y-4">
                  {resolvedEscalations.map((escalation) => (
                    <Card
                      key={escalation._id}
                      className="border-l-4 border-l-green-400 opacity-75"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-gray-900 mb-1">
                                {escalation.guestName}
                              </CardTitle>
                              <p className="text-sm text-gray-600 mb-2">
                                {escalation.propertyName} •{" "}
                                {formatTimestamp(escalation.createdAt)}
                              </p>
                              <p className="text-gray-700 leading-relaxed">
                                {escalation.message}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(escalation.status)}>
                            {getStatusIcon(escalation.status)}
                            <span className="ml-1">Resolved</span>
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Escalations;
