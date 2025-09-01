"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="mx-auto mb-2">
          <Image
            src="/images/propalytiq-logo.png"
            alt="Propalytiq Logo"
            width={150}
            height={32}
            className="w-30 object-contain m-6"
          />
        </div>
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" id="login">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>

          <TabsContent value="signup">
            <div className="text-center text-sm text-grey-500">
              Signup has been temporarily disabled
            </div>
            {/* <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} /> */}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="text-center text-sm text-grey-500">
          By continuing, you agree to our
          <Button variant="link" className="h-auto p-0 px-1" asChild>
            <Link href="/terms">Terms of Service</Link>
          </Button>
          and
          <Button variant="link" className="h-auto p-0 px-1" asChild>
            <Link href="/privacy">Privacy Policy</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
