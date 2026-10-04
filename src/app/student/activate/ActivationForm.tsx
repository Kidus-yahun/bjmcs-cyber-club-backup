"use client";

import { useState, useTransition } from "react";
import { activateAccount } from "./actions";
import { Button, Input, Alert } from "@/components/ui";

export default function ActivationForm({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    startTransition(async () => {
      const result = await activateAccount(token, password);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error" title="Error" children={error} />}
      
      <Input
        label="New Password"
        name="password"
        type="password"
        required
        minLength={8}
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
      />
      
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Activating..." : "Activate Account"}
      </Button>
    </form>
  );
}
