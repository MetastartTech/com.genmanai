"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Icons } from "../ui/icon";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import useUser from "@/provider/userContext/useUserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignupForm = () => {
  const { signIn, loading } = useUser();
  const router = useRouter();

  const handleSignIn = async () => {
    await signIn();
    toast.success("Signed up successfully");
    router.push("/dashboard");
  };
  return (
    <Card className="max-w-sm w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Already have an account? Click{" "}
          <a
            href="/signin"
            className="underline underline-offset-4 hover:text-primary"
          >
            here
          </a>{" "}
          to sign in
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="w-full">
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="off"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Continue</Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By signing up, you agree href our{" "}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
