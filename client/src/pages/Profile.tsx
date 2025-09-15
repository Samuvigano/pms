import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [userInfo, setUserInfo] = useState({
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    phone: "+1 (555) 123-4567",
    role: user?.role || "Property Manager",
    company: "W Properties",
    location: "New York, NY",
    joinDate: "January 2024",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                User Profile
              </h2>
              <p className="text-gray-600">
                Manage your account information and preferences
              </p>
            </div>

            {/* Profile Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your basic account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
                      {userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={userInfo.name}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, name: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, email: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={userInfo.phone}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, phone: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={userInfo.company}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              company: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={userInfo.location}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              location: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          value={userInfo.role}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, role: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={handleSave}>Save Changes</Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>
                  Your activity and engagement overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">4</p>
                    <p className="text-sm text-gray-600">Properties Managed</p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">142</p>
                    <p className="text-sm text-gray-600">Messages This Month</p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {userInfo.joinDate}
                    </p>
                    <p className="text-sm text-gray-600">Member Since</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  How guests and team members can reach you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">{userInfo.email}</span>
                    <Badge variant="outline">Primary</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">{userInfo.phone}</span>
                    <Badge variant="outline">Work</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">{userInfo.location}</span>
                    <Badge variant="outline">Office</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
