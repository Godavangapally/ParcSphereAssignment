"use client";

import { useState } from "react";
import { Card, Button, Input } from "@repo/ui";
import { User, Mail, Calendar, Shield, Lock, Check, X } from "lucide-react";

interface ProfileClientProps {
  user: {
    name: string;
    email: string;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setLoading(true);

    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || "Failed to change password");
        setLoading(false);
        return;
      }

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-8">
          {/* Avatar */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user.name}
              </h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={<User className="w-6 h-6 text-purple-400" />}
              label="Full Name"
              value={user.name}
            />
            <InfoCard
              icon={<Mail className="w-6 h-6 text-blue-400" />}
              label="Email Address"
              value={user.email}
            />
            <InfoCard
              icon={<Shield className="w-6 h-6 text-green-400" />}
              label="Account Status"
              value="Active"
            />
            <InfoCard
              icon={<Calendar className="w-6 h-6 text-yellow-400" />}
              label="Member Since"
              value={new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            />
          </div>
        </div>
      </Card>

      {/* Security Card */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-8">
          <h3 className="text-xl font-bold text-white mb-4">Security</h3>
          
          {!showPasswordForm ? (
            <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div>
                <h4 className="text-white font-semibold mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </h4>
                <p className="text-gray-400 text-sm">
                  Keep your account secure by using a strong password
                </p>
              </div>
              <Button
                onClick={() => setShowPasswordForm(true)}
                className="bg-slate-600 hover:bg-slate-500"
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="p-6 bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-semibold flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </h4>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center text-red-200 text-sm">
                  <X className="w-4 h-4 mr-2 flex-shrink-0" />
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center text-green-200 text-sm">
                  <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                  {passwordSuccess}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                />

                <div className="flex space-x-3 pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordError("");
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Two-Factor Authentication */}
          <div className="mt-4 flex items-center justify-between p-4 bg-slate-700 rounded-lg opacity-50">
            <div>
              <h4 className="text-white font-semibold mb-1 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </h4>
              <p className="text-gray-400 text-sm">
                Add an extra layer of security (Coming soon)
              </p>
            </div>
            <Button className="bg-slate-600" disabled>
              Enable
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-slate-700 rounded-lg">
      <div className="p-2 bg-slate-600 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </div>
  );
}