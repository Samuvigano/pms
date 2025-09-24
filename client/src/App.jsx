import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SignIn, SignUp } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Escalations from "./pages/Escalations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Tickets from "./pages/Tickets";
import ChatWidget from "@/components/ChatWidget";
import { UserProfile } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes replaced with Clerk components */}
          <Route
            path="/sign-in"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up"
            element={<SignUp routing="path" path="/sign-up" />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/escalations"
            element={
              <ProtectedRoute>
                <Escalations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/account"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-50 w-full">
                  <div className="w-16" />
                  <div className="flex-1 overflow-auto p-6">
                    <UserProfile routing="path" path="/settings/account" />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={<Navigate to="/settings" replace />}
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
