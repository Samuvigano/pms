import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Check,
  User,
  Send,
  Loader2,
  Info,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";

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

const Escalations = () => {
  const { t } = useLanguage();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(
    null
  );
  const [responseMessage, setResponseMessage] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoEscalation, setInfoEscalation] = useState<Escalation | null>(null);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return t("escalations.justNow");
    if (diffInHours === 1) return `1 ${t("escalations.hourAgo")}`;
    if (diffInHours < 24) return `${diffInHours} ${t("escalations.hoursAgo")}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return `1 ${t("escalations.dayAgo")}`;
    return `${diffInDays} ${t("escalations.daysAgo")}`;
  };

  // Emphasized age label (days/hours) for aggressive display
  const getAgeEmphasis = (
    timestamp: string
  ): { label: string; className: string } => {
    const created = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days >= 1) {
      const severity =
        days >= 3
          ? "text-red-600"
          : days >= 1
          ? "text-orange-600"
          : "text-gray-600";
      return { label: `${days}d`, className: `font-semibold ${severity}` };
    }
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    return {
      label: `${Math.max(hours, 1)}h`,
      className: "font-semibold text-gray-600",
    };
  };

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
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t("escalations.loadingEscalations")}</span>
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
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("escalations.title")}
              </h2>
              <p className="text-gray-600">{t("escalations.subtitle")}</p>
            </div>

            {/* Pending Requests */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                {t("escalations.pendingRequests")} ({pendingEscalations.length})
              </h3>

              <div className="space-y-3">
                {pendingEscalations.map((escalation) => (
                  <div
                    key={escalation._id}
                    className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    {/* Corner avatar overlay */}
                    <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full ring-2 ring-white shadow bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
                      {escalation.guestName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    {/* Header and content */}
                    <div className="flex items-start gap-3 pr-10">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {escalation.guestName}
                          </h3>
                          {(() => {
                            const age = getAgeEmphasis(escalation.createdAt);
                            return (
                              <span className={`text-sm ${age.className}`}>
                                {age.label}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {escalation.propertyName} •{" "}
                          {formatTimestamp(escalation.createdAt)}
                        </p>
                        <p className="text-sm text-gray-800 mt-2">
                          {escalation.message}
                        </p>
                      </div>
                    </div>

                    {/* Response area (when open) */}
                    {selectedEscalation === escalation._id && (
                      <div className="mt-3">
                        <Textarea
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder={`${t("escalations.respond")} ${
                            escalation.guestName
                          }...`}
                          rows={3}
                        />
                      </div>
                    )}

                    {/* Bottom actions row */}
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100"
                        onClick={() => {
                          setInfoEscalation(escalation);
                          setInfoOpen(true);
                        }}
                      >
                        <Info className="h-4 w-4 mr-1" />{" "}
                        {t("escalations.info")}
                      </Button>
                      {selectedEscalation === escalation._id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100"
                            onClick={() => setSelectedEscalation(null)}
                            disabled={sending === escalation._id}
                          >
                            {t("escalations.cancel")}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSendResponse(escalation._id)}
                            disabled={
                              !responseMessage.trim() ||
                              sending === escalation._id
                            }
                          >
                            {sending === escalation._id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {t("escalations.send")}
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                {t("escalations.send")}
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedEscalation(escalation._id);
                              setTimeout(
                                () =>
                                  document
                                    .getElementById(`resp-${escalation._id}`)
                                    ?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "end",
                                    }),
                                0
                              );
                            }}
                          >
                            {t("escalations.respond")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100"
                            onClick={() =>
                              handleResolveEscalation(escalation._id)
                            }
                            disabled={resolving === escalation._id}
                            aria-label="Resolve"
                            title="Resolve"
                          >
                            {resolving === escalation._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolved Requests */}
            {resolvedEscalations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {t("escalations.recentlyResolved")} (
                  {resolvedEscalations.length})
                </h3>

                <div className="space-y-3">
                  {resolvedEscalations.map((escalation) => (
                    <div
                      key={escalation._id}
                      className="relative bg-white border border-gray-200 rounded-lg p-4 opacity-60"
                    >
                      {/* Corner avatar overlay */}
                      <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full ring-2 ring-white shadow bg-green-100 text-green-700 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div className="flex items-start gap-3 pr-10">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {escalation.guestName}
                            </h3>
                            <span className="text-sm font-semibold text-green-600">
                              {t("escalations.done")}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {escalation.propertyName} •{" "}
                            {formatTimestamp(escalation.createdAt)}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {escalation.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
          <SheetContent side="right" className="w-[340px] sm:w-[380px]">
            <SheetHeader>
              <SheetTitle>{t("escalations.escalationDetails")}</SheetTitle>
            </SheetHeader>
            {infoEscalation && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {infoEscalation.guestName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {infoEscalation.guestName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {infoEscalation.propertyName}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-gray-500">
                      {t("escalations.priority")}
                    </div>
                    <div className="text-sm font-medium capitalize">
                      {t(`escalations.${infoEscalation.priority || "medium"}`)}
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-gray-500">
                      {t("escalations.status")}
                    </div>
                    <div className="text-sm font-medium capitalize">
                      {t(`escalations.${infoEscalation.status}`)}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">
                    {t("tickets.created")}
                  </div>
                  <div className="text-sm font-medium">
                    {formatTimestamp(infoEscalation.createdAt)}
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">
                    {t("escalations.message")}
                  </div>
                  <div className="text-sm mt-1 text-gray-800">
                    {infoEscalation.message}
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Escalations;
