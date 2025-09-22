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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Settings,
  Link,
  Unlink,
  Languages,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

// Import platform logos
import airbnbLogo from "@/assets/airbnb.svg";
import bookingLogo from "@/assets/booking.svg";
import expediaLogo from "@/assets/expedia.svg";
import instagramLogo from "@/assets/instagram.svg";
import telegramLogo from "@/assets/telegram.svg";
import whatsappLogo from "@/assets/whatsapp.svg";

// Import platform URLs
import platformUrls from "@/config/platformUrls.json";

const Profile = () => {
  const { user } = useAuth();
  const { language, changeLanguage, t } = useLanguage();

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

  // Platform connection state - all disconnected by default until DB implementation
  const [platformConnections, setPlatformConnections] = useState({
    airbnb: { connected: false, name: t("platforms.airbnb") },
    booking: { connected: false, name: t("platforms.booking") },
    expedia: { connected: false, name: t("platforms.expedia") },
    instagram: { connected: false, name: t("platforms.instagram") },
    telegram: { connected: false, name: t("platforms.telegram") },
    whatsapp: { connected: false, name: t("platforms.whatsapp") },
  });

  const platformLogos = {
    airbnb: airbnbLogo,
    booking: bookingLogo,
    expedia: expediaLogo,
    instagram: instagramLogo,
    telegram: telegramLogo,
    whatsapp: whatsappLogo,
  };

  const availableLanguages = [
    { code: 'en', name: t("common.english") },
    { code: 'it', name: t("common.italian") },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handlePlatformConnect = (platform) => {
    // Open platform connection URL in new tab
    const url = platformUrls[platform];
    if (url) {
      window.open(url, '_blank');
    }
    // TODO: After successful connection, update the connection status in DB
  };

  const handlePlatformDisconnect = (platform) => {
    setPlatformConnections(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: false
      }
    }));
    // TODO: Handle actual disconnection logic with DB
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
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
                {t("profile.title")}
              </h2>
              <p className="text-gray-600">
                {t("profile.subtitle")}
              </p>
            </div>

            {/* Profile Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {t("profile.profileInformation")}
                </CardTitle>
                <CardDescription>
                  {t("profile.profileDescription")}
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
                        <Label htmlFor="name">{t("profile.fullName")}</Label>
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
                        <Label htmlFor="email">{t("profile.email")}</Label>
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
                        <Label htmlFor="phone">{t("profile.phone")}</Label>
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
                        <Label htmlFor="company">{t("profile.company")}</Label>
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
                        <Label htmlFor="location">{t("profile.location")}</Label>
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
                        <Label htmlFor="role">{t("profile.role")}</Label>
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
                          {t("profile.editProfile")}
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={handleSave}>{t("profile.saveChanges")}</Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            {t("profile.cancel")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-blue-600" />
                  {t("profile.language")}
                </CardTitle>
                <CardDescription>
                  {t("profile.languageDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-xs">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("profile.language")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.accountStatistics")}</CardTitle>
                <CardDescription>
                  {t("profile.accountStatsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">4</p>
                    <p className="text-sm text-gray-600">{t("profile.propertiesManaged")}</p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">142</p>
                    <p className="text-sm text-gray-600">{t("profile.messagesThisMonth")}</p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {userInfo.joinDate}
                    </p>
                    <p className="text-sm text-gray-600">{t("profile.memberSince")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-blue-600" />
                  {t("profile.platformConnections")}
                </CardTitle>
                <CardDescription>
                  {t("profile.platformConnectionsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(platformConnections).map(([key, platform]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={platformLogos[key]}
                          alt={platform.name}
                          className="w-8 h-8 object-contain"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{t(`platforms.${key}`)}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => platform.connected ? handlePlatformDisconnect(key) : handlePlatformConnect(key)}
                        variant={platform.connected ? "outline" : "default"}
                        size="sm"
                        className={platform.connected ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
                      >
                        {platform.connected ? (
                          <>
                            <Unlink className="h-4 w-4 mr-1" />
                            {t("profile.disconnect")}
                          </>
                        ) : (
                          <>
                            <Link className="h-4 w-4 mr-1" />
                            {t("profile.connect")}
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.contactInformation")}</CardTitle>
                <CardDescription>
                  {t("profile.contactDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">{userInfo.email}</span>
                    <Badge variant="outline">{t("profile.primary")}</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">{userInfo.phone}</span>
                    <Badge variant="outline">{t("profile.work")}</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">{userInfo.location}</span>
                    <Badge variant="outline">{t("profile.office")}</Badge>
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
