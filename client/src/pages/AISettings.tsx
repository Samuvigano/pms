import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  MessageCircle,
  Clock,
  Shield,
  Zap,
  AlertTriangle,
} from "lucide-react";

const AISettings = () => {
  const [autoRespond, setAutoRespond] = useState(true);
  const [responseDelay, setResponseDelay] = useState("2");
  const [personalityStyle, setPersonalityStyle] = useState("friendly");
  const [escalationKeywords, setEscalationKeywords] = useState(
    "urgent, emergency, broken, not working, complaint, angry, upset"
  );
  const [customInstructions, setCustomInstructions] = useState(
    "Always be helpful and professional. Prioritize guest satisfaction. If unsure about property-specific information, check the knowledge base."
  );

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                AI Assistant Settings
              </h2>
              <p className="text-gray-600">
                Configure how your AI assistant interacts with guests
              </p>
            </div>

            {/* AI Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  AI Status
                </CardTitle>
                <CardDescription>
                  Current AI assistant configuration and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">AI Assistant Active</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      24/7 Support
                    </p>
                    <p className="text-xs text-gray-600">Always available</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Fast Response
                    </p>
                    <p className="text-xs text-gray-600">
                      ~{responseDelay}s avg
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Smart Escalation
                    </p>
                    <p className="text-xs text-gray-600">Auto-detects issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Response Settings</CardTitle>
                <CardDescription>
                  Control how and when the AI responds to guest messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Auto-respond to guests
                    </Label>
                    <p className="text-sm text-gray-600">
                      AI will automatically respond to guest messages
                    </p>
                  </div>
                  <Switch
                    checked={autoRespond}
                    onCheckedChange={setAutoRespond}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Response Delay</Label>
                  <Select
                    value={responseDelay}
                    onValueChange={setResponseDelay}
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Immediate (1s)</SelectItem>
                      <SelectItem value="2">Quick (2s)</SelectItem>
                      <SelectItem value="5">Natural (5s)</SelectItem>
                      <SelectItem value="10">Thoughtful (10s)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Time before AI responds to appear more natural
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Personality Style</Label>
                  <Select
                    value={personalityStyle}
                    onValueChange={setPersonalityStyle}
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    How the AI should communicate with guests
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Escalation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Smart Escalation
                </CardTitle>
                <CardDescription>
                  Configure when messages should be escalated to human staff
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Escalation Keywords</Label>
                  <Textarea
                    value={escalationKeywords}
                    onChange={(e) => setEscalationKeywords(e.target.value)}
                    placeholder="Enter keywords that trigger escalation, separated by commas"
                    className="mt-2"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Messages containing these words will be flagged for human
                    review
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Custom Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Instructions</CardTitle>
                <CardDescription>
                  Provide specific instructions for how the AI should behave
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>AI Instructions</Label>
                  <Textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Enter custom instructions for the AI assistant..."
                    rows={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500">
                    These instructions will guide the AI's responses across all
                    properties
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Save AI Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
