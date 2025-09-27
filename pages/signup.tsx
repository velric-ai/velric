import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (r.ok) setMsg("Account created. Please login →");
      else {
        const j = await r.json();
        setMsg(j.error || "Error");
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
        <h1 className="text-2xl font-semibold mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-4">Sign up with your email and a password</p>
        <input className={inputCls} placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className={inputCls} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" />
        <input className={inputCls} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <button className={btnCls} type="submit">Sign up</button>
        <p className="text-sm mt-3">
          Already have an account?{" "}
          <a className={linkCls} onClick={()=>router.push("/login")}>Log in</a>
        </p>
        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
