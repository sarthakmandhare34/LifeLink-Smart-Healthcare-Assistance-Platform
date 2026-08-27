import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Settings as SettingsIcon, Bell, Shield } from "lucide-react";
import { BentoGrid, BentoItem } from "../../components/layout/Bento";

const PREFERENCES_SESSION_KEY = "lifelink-workspace-preferences";

function readSessionPreferences() {
  try {
    const stored = sessionStorage.getItem(PREFERENCES_SESSION_KEY);
    if (!stored) return { aptReminders: true, medAlerts: true };
    const parsed = JSON.parse(stored) as {
      aptReminders?: boolean;
      medAlerts?: boolean;
    };
    return {
      aptReminders: parsed.aptReminders ?? true,
      medAlerts: parsed.medAlerts ?? true,
    };
  } catch {
    return { aptReminders: true, medAlerts: true };
  }
}

export const Settings = () => {
  const [preferences] = useState(readSessionPreferences);
  const [aptReminders, setAptReminders] = useState(preferences.aptReminders);
  const [medAlerts, setMedAlerts] = useState(preferences.medAlerts);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      sessionStorage.setItem(
        PREFERENCES_SESSION_KEY,
        JSON.stringify({ aptReminders, medAlerts })
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: 0 }}>
      <header className="mb-4 flex items-center gap-3">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "14px",
            background: "rgba(0,27,48,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SettingsIcon size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>Workspace Preferences</h1>
          <p className="caption">
            Manage session-only notification preferences and review account
            options.
          </p>
        </div>
      </header>

      <BentoGrid>
        {/* Notifications Bento Section */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full flex-col justify-between">
            <div>
              <div
                className="flex items-center gap-2 mb-4 pb-2"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <Bell size={20} color="var(--color-primary)" />
                <h2 style={{ margin: 0, fontSize: "var(--text-h2)" }}>
                  Notification Preferences
                </h2>
              </div>

              <div className="flex-col gap-3">
                <div
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      Appointment reminder preference
                    </p>
                    <span className="caption">
                      Reminder delivery is not active. This preference is
                      retained only for the current browser session.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={aptReminders}
                    onChange={e => setAptReminders(e.target.checked)}
                    style={{
                      accentColor: "var(--color-primary)",
                      transform: "scale(1.2)",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      Medicine inventory preference
                    </p>
                    <span className="caption">
                      Inventory alerts are not active. This preference is
                      retained only for the current browser session.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={medAlerts}
                    onChange={e => setMedAlerts(e.target.checked)}
                    style={{
                      accentColor: "var(--color-primary)",
                      transform: "scale(1.2)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-3 mt-4 pt-3"
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving preferences..." : "Save preferences"}
              </Button>
              {success && (
                <span
                  style={{
                    color: "var(--color-success)",
                    fontWeight: 600,
                    fontSize: "var(--text-caption)",
                  }}
                >
                  Saved for this browser session
                </span>
              )}
            </div>
          </Card>
        </BentoItem>

        {/* Security & Account Bento Section */}
        <BentoItem colSpan={2}>
          <Card variant="glass" className="h-full flex-col justify-between">
            <div>
              <div
                className="flex items-center gap-2 mb-4 pb-2"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <Shield size={20} color="var(--color-primary)" />
                <h2 style={{ margin: 0, fontSize: "var(--text-h2)" }}>
                  Account Options
                </h2>
              </div>

              <div
                className="flex items-center justify-between py-2 mb-3"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Patient password changes
                  </p>
                  <span className="caption">
                    Password changes are not available in this workspace.
                  </span>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Not available
                </Button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Delete Account
                  </p>
                  <span className="caption">
                    Deletion requests are not available in this workspace.
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Not available
                </Button>
              </div>
            </div>
          </Card>
        </BentoItem>
      </BentoGrid>
    </div>
  );
};
