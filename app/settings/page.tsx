import { SettingsPage } from "@/components/settings-page"

export default function Settings() {
  return (
    <div className="container py-6 md:py-10 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <SettingsPage />
    </div>
  )
}
