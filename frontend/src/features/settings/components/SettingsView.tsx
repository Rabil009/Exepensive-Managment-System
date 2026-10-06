import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@ui/components/data-display/Card/card";
import { Input } from "@ui/components/forms/Input/input";
import { Switch } from "@ui/components/forms/Switch/switch";
import { Button } from "@ui/components/actions/Button/button";
import {
  Avatar,
  AvatarFallback,
} from "@ui/components/data-display/Avatar/avatar";

type Preferences = { approvals: boolean; payments: boolean; summary: boolean };
const profileKey = "employee-profile-v1";
const preferencesKey = "employee-notifications-v1";
function readSaved<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function SettingsView() {
  const [profile, setProfile] = useState(() =>
    readSaved(profileKey, {
      name: "Aarav Kumar",
      email: "aarav.kumar@company.com",
    }),
  );
  const [preferences, setPreferences] = useState<Preferences>(() =>
    readSaved(preferencesKey, {
      approvals: true,
      payments: true,
      summary: false,
    }),
  );
  const [saved, setSaved] = useState(false);
  const updateProfile = (key: "name" | "email", value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const updatePreference = (key: keyof Preferences, value: boolean) => {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    localStorage.setItem(preferencesKey, JSON.stringify(next));
  };
  const saveProfile = () => {
    localStorage.setItem(profileKey, JSON.stringify(profile));
    setSaved(true);
  };
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile and notification preferences.</p>
        </div>
      </div>
      <div className="max-w-[820px] grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your employee account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="employee-avatar">AK</AvatarFallback>
              </Avatar>
              <div>
                <strong>{profile.name}</strong>
                <div className="muted text-xs">Employee</div>
              </div>
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="profile-name">Full name</label>
                <Input
                  id="profile-name"
                  value={profile.name}
                  onChange={(event) => {
                    updateProfile("name", event.target.value);
                  }}
                />
              </div>
              <div className="field">
                <label htmlFor="profile-email">Email</label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  onChange={(event) => {
                    updateProfile("email", event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-actions">
              <span className="mr-auto self-center text-xs text-green-400">
                {saved ? "Profile saved" : ""}
              </span>
              <Button onClick={saveProfile}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose the updates you receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="setting-row">
              <div>
                <div className="font-medium">Approval updates</div>
                <div className="section-subtitle">
                  When an expense is approved or rejected
                </div>
              </div>
              <Switch
                checked={preferences.approvals}
                onCheckedChange={(value) =>
                  updatePreference("approvals", value)
                }
                aria-label="Approval updates"
              />
            </div>
            <div className="setting-row">
              <div>
                <div className="font-medium">Reimbursement updates</div>
                <div className="section-subtitle">
                  When a payment is processing or paid
                </div>
              </div>
              <Switch
                checked={preferences.payments}
                onCheckedChange={(value) => updatePreference("payments", value)}
                aria-label="Reimbursement updates"
              />
            </div>
            <div className="setting-row">
              <div>
                <div className="font-medium">Monthly summary</div>
                <div className="section-subtitle">
                  A recap of your personal spending
                </div>
              </div>
              <Switch
                checked={preferences.summary}
                onCheckedChange={(value) => updatePreference("summary", value)}
                aria-label="Monthly summary"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
