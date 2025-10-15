'use client';
import '@/app/globals.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/loginregister/FormInput';
import useLogout from '@/hooks/useLogout';

interface Props {
  uid: string;
  token: string;
}

export default function ConfirmResetClient({ uid, token }: Props) {
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { handleLogout, error: logoutError } = useLogout(async () => {
    return Promise.resolve();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pass1 || !pass2) {
      setMessage("Please fill in both password fields.");
      setStatus("error");
      return;
    }
    if (pass1 !== pass2) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/u/password/reset/confirm/${uid}/${token}/`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_password: pass1,
          confirm_password: pass2,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const errMsg =
          Object.values(data).flat().join(" ") || "Reset failed";
        throw new Error(errMsg);
      }

      setStatus("success");
      setMessage("Password has been reset! Logging out…");

      await handleLogout();

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-white text-center mb-4">
          Set New Password
        </h2>
        {status === 'success' ? (
          <p className="text-green-400 text-center">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              type="password"
              id="pass1"
              name="pass1"
              placeholder="New password"
              value={pass1}
              onChange={e => setPass1(e.target.value)}
            />
            <FormInput
              type="password"
              id="pass2"
              name="pass2"
              placeholder="Repeat password"
              value={pass2}
              onChange={e => setPass2(e.target.value)}
            />
            {message && (
              <p
                className={`text-sm ${
                  status === 'error' ? 'text-red-500' : ''
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
