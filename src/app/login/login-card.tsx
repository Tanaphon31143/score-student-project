"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, InputGroup, Input, Label, Spinner, TextField } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../_components/icons";

type Msg = { title: string; desc: string };

const errorText: Record<string, Msg> = {
  // Google: อีเมลไม่อยู่ในระบบ
  signup_disabled: {
    title: "อีเมลนี้ยังไม่อยู่ในระบบ",
    desc: "ให้คุณครูเพิ่มอีเมลของคุณเข้าห้องเรียนก่อน แล้วค่อยเข้าสู่ระบบอีกครั้ง",
  },
  // อีเมล/รหัสผ่าน
  INVALID_EMAIL_OR_PASSWORD: {
    title: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    desc: "ตรวจสอบอีกครั้ง ถ้าลืมรหัสผ่านให้แจ้งคุณครู",
  },
};
const fallbackError: Msg = { title: "เข้าสู่ระบบไม่สำเร็จ", desc: "ลองใหม่อีกครั้ง หรือติดต่อคุณครู" };

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function LoginCard() {
  const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState<"email" | "google" | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(params.get("error"));

  const err = errorCode ? (errorText[errorCode] ?? fallbackError) : null;

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setPending("email");
    setErrorCode(null);
    const { error } = await authClient.signIn.email({ email: email.trim(), password });
    if (error) {
      setErrorCode(error.code ?? "unknown");
      setPending(null);
      return;
    }
    router.push("/");
  }

  async function signInWithGoogle() {
    setPending("google");
    setErrorCode(null);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/login",
    });
    // สำเร็จจะถูก redirect ไป Google เอง — มาถึงตรงนี้แปลว่าเริ่มไม่ได้
    if (error) {
      setErrorCode(error.code ?? "unknown");
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {err && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{err.title}</Alert.Title>
            <Alert.Description>{err.desc}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <form onSubmit={signInWithEmail} className="flex flex-col gap-4">
        <TextField isRequired type="email" name="email" value={email} onChange={setEmail} autoComplete="email">
          <Label>อีเมล</Label>
          <Input placeholder="name@school.ac.th" className="h-11" />
        </TextField>

        <TextField
          isRequired
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        >
          <Label>รหัสผ่าน</Label>
          <InputGroup className="h-11">
            <InputGroup.Input placeholder="รหัสผ่าน" />
            <InputGroup.Suffix>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                onPress={() => setShowPassword((v) => !v)}
                className="text-muted"
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} className="size-4" />
              </Button>
            </InputGroup.Suffix>
          </InputGroup>
        </TextField>

        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={pending !== null}
          className="mt-2 h-12 bg-ink! text-paper!"
        >
          {pending === "email" && <Spinner size="sm" color="current" />}
          เข้าสู่ระบบ
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        หรือ
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        size="lg"
        fullWidth
        onPress={signInWithGoogle}
        isDisabled={pending !== null}
        variant="outline"
        className="h-12 text-ink!"
      >
        {pending === "google" ? <Spinner size="sm" /> : <GoogleLogo />}
        {pending === "google" ? "กำลังพาไปที่ Google..." : "เข้าสู่ระบบด้วย Google"}
      </Button>
    </div>
  );
}
