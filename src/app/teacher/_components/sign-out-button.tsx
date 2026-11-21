"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../../_components/icons";

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      aria-label="ออกจากระบบ"
      className="text-muted"
      onPress={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/login") } })}
    >
      <Icon name="logout" className="size-4" />
    </Button>
  );
}
