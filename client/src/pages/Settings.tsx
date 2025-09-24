import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Languages,
  Link,
  Unlink,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
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

const Settings = () => {
  const { user } = useUser();
  const { language, changeLanguage, t } = useLanguage();

  const [contactInfo, setContactInfo] = useState({
    email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
  });

  // Platform connection state - all disconnected by default until DB implementation
  const [platformConnections, setPlatformConnections] = useState({
    airbnb: { connected: false, name: t("platforms.airbnb") },
    booking: { connected: false, name: t("platforms.booking") },
    expedia: { connected: false, name: t("platforms.expedia") },
    instagram: { connected: false, name: t("platforms.instagram") },
    telegram: { connected: false, name: t("platforms.telegram") },
    whatsapp: { connected: false, name: t("platforms.whatsapp") },
  });

  const platformLogos: Record<string, string> = {
    airbnb: airbnbLogo,
    booking: bookingLogo,
    expedia: expediaLogo,
    instagram: instagramLogo,
    telegram: telegramLogo,
    whatsapp: whatsappLogo,
  };

  const availableLanguages = [
    { code: "en", name: t("common.english") },
    { code: "it", name: t("common.italian") },
  ];

  const handlePlatformConnect = (platform: string) => {
    const url = (platformUrls as Record<string, string>)[platform];
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handlePlatformDisconnect = (platform: string) => {
    setPlatformConnections((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: false,
      },
    }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("settings.title", { defaultValue: "Settings" })}
              </h2>
              <p className="text-gray-600">
                {t("settings.subtitle", {
                  defaultValue: "Manage your preferences and integrations",
                })}
              </p>
            </div>

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
                    <p className="text-sm text-gray-600">
                      {t("profile.propertiesManaged")}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">142</p>
                    <p className="text-sm text-gray-600">
                      {t("profile.messagesThisMonth")}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      {contactInfo.joinDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("profile.memberSince")}
                    </p>
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
                  {Object.entries(platformConnections).map(
                    ([key, platform]) => (
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
                            <p className="font-medium text-gray-900">
                              {t(`platforms.${key}`)}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            (platform as any).connected
                              ? handlePlatformDisconnect(key)
                              : handlePlatformConnect(key)
                          }
                          variant={
                            (platform as any).connected ? "outline" : "default"
                          }
                          size="sm"
                          className={
                            (platform as any).connected
                              ? "text-red-600 border-red-200 hover:bg-red-50"
                              : ""
                          }
                        >
                          {(platform as any).connected ? (
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
                    )
                  )}
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
                    <span className="text-gray-900">{contactInfo.email}</span>
                    <Badge variant="outline">{t("profile.primary")}</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">{contactInfo.phone}</span>
                    <Badge variant="outline">{t("profile.work")}</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-900">
                      {contactInfo.location}
                    </span>
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

export default Settings;
