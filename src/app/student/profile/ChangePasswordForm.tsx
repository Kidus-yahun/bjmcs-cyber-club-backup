"use client";

import { useTransition, useState } from "react";
import { changePassword } from "@/lib/actions/student-learning";
import { Button, Input, Alert } from "@/components/ui";

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    const targetForm = e.currentTarget;

    startTransition(async () => {
      try {
        const result = await changePassword(currentPassword, newPassword);
        if (result?.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          targetForm.reset();
        }
      } catch (err: any) {
        setError(err.message || "Failed to change password.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-sm mb-2">Change Password</h3>
      {error && <Alert variant="error" title="Error" children={error} />}
      {success && <Alert variant="success" title="Success" children="Password changed securely." />}
      
      <Input
        label="Current Password"
        name="currentPassword"
        type="password"
        required
        disabled={isPending}
      />
      <Input
        label="New Password"
        name="newPassword"
        type="password"
        required
        minLength={8}
        disabled={isPending}
      />
      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        disabled={isPending}
      />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
