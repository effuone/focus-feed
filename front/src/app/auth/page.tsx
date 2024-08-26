"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa"

export default function AuthComponent() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
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
            localStorage.setItem("token", data.access_token);
            if (isLogin) {
                router.push("/feed");
            } else {
                router.push("/onboarding");
            }

            setError(null);
        }
    } catch (err) {
        setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <Card className="rounded-lg shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
          <CardHeader className="text-center border-b-2 border-blue-200 bg-gradient-to-r from-blue-100 to-blue-200">
            <CardTitle className="text-3xl font-extrabold text-blue-900">
              {isLogin ? "Welcome Back" : "Join FocusFeed"}
            </CardTitle>
            <CardDescription className="text-blue-700 font-medium">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-red-500 text-center bg-red-100 p-3 rounded-md"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-blue-700">
                  Email
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-blue-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-blue-700">
                  Password
                </Label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-blue-500" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <CardFooter className="pt-0">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-3 rounded-md shadow hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin h-5 w-5 mr-2 inline-block" />
                  ) : null}
                  {isLogin ? "Sign in" : "Create account"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
          <motion.div 
            className="border-t-2 border-blue-200 py-4 text-center bg-gradient-to-r from-blue-50 to-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <Button variant="link" onClick={() => setIsLogin(false)} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300">
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button variant="link" onClick={() => setIsLogin(true)} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300">
                  Login
                </Button>
              </>
            )}
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}
