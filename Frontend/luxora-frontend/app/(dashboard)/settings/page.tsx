import ProfileSettingsForm from "@/components/dashboard/forms/ProfileSettingsForm";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Public Profile</h2>
        <p className="text-muted-foreground text-sm">Update your personal information and how others see you.</p>
      </div>

      <ProfileSettingsForm />
    </div>
  );
}