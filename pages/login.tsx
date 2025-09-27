import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (r.ok) router.push("/settings");
      else {
        const j = await r.json();
        setMsg(j.error || "Invalid credentials");
      }
    } catch {
      setMsg("Network error");
    }
  }

  const inputCls = "w-full border rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-black/20";
  const btnCls   = "bg-black text-white rounded-xl px-4 py-2 hover:opacity-90 transition w-full mt-1";
  const linkCls  = "text-blue-600 hover:underline cursor-pointer";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-4">Log in to continue</p>
        <input className={inputCls} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" />
        <input className={inputCls} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <button className={btnCls} type="submit">Log in</button>
        <p className="text-sm mt-3">
          No account?{" "}
          <a className={linkCls} onClick={()=>router.push("/signup")}>Sign up</a>
        </p>
        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
