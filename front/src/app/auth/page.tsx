"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Component() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const url = isLogin 
        ? "http://localhost:8000/auth/token" 
        : "http://localhost:8000/auth/register";
    
    const body = isLogin 
        ? new URLSearchParams({ username: email, password }) 
        : JSON.stringify({ email, password });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": isLogin ? "application/x-www-form-urlencoded" : "application/json",
            },
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Error handling logic
            if (Array.isArray(errorData.detail)) {
                const errorMessages = errorData.detail.map((err: any) => err.msg).join(", ");
                setError(errorMessages);
            } else if (typeof errorData.detail === 'string') {
                setError(errorData.detail);
            } else {
                setError("An error occurred. Please try again.");
            }
        } else {
            const data = await response.json();
            // Storing the token in localStorage
            localStorage.setItem("token", data.access_token);
            
            // Redirect based on login or registration
            if (isLogin) {
                router.push("/feed");
            } else {
                router.push("/onboarding");
            }

            setError(null);  // Clear any previous error
        }
    } catch (err) {
        setError("An error occurred. Please try again.");
    }
};


  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
            <CardDescription>{isLogin ? "Enter your email and password to access your account." : "Create a new account to get started."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <CardFooter>
                <Button type="submit" className="w-full">
                  {isLogin ? "Sign in" : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Button variant="link" onClick={() => setIsLogin(false)}>
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="link" onClick={() => setIsLogin(true)}>
                  Login
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
