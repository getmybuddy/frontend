"use client";
import Register from "@/components/Register";
import Tabss from "@/components/Tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login({
  searchParams,
}: {
  searchParams: { error: string; type: string };
}) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/chat");
    }
  }, [session]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email: e.target.email.value,
      password: e.target.password.value,
      redirect: false,
    });

    if (result?.error) {
      router.push("?error=CredentialsSignin&type=login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-full max-w-md space-y-6">
        <Tabs defaultValue={searchParams.type || "login"}>
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger
              value="login"
              onMouseDown={() => router.push("?type=login")}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onMouseDown={() => router.push("?type=register")}
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <Register />
          </TabsContent>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                {searchParams.error && (
                  <p style={{ color: "red" }}>Invalid email or password</p>
                )}
              </CardHeader>
              <form action="post" onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Login</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
