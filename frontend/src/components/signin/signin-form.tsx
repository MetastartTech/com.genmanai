"use client";

import useUser from "@/provider/userContext/useUserContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Icons } from "../ui/icon";
import { toast } from "sonner";
import { useEffect } from "react";

const SigninForm: React.FC = () => {
  const { user, signIn, loading } = useUser();
  const router = useRouter();

  const handleSignIn = async () => {
    toast.promise(signIn(), {
      loading: "Logging in",
      success: () => {
        router.push("/dashboard/llm");
        return "Logged in successfully";
      },
      error: "Failed to login",
    });
  };

  useEffect(() => {
    if (user) {
      router.push("/dashboard/llm");
    }
  }, [user, router]);

  return (
    <Card className="max-w-sm w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in below</CardTitle>
        {/* <CardDescription>
          Don&apos;t have an account? Click{" "}
          <a
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            here
          </a>{" "}
          to sign up
        </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          variant="outline"
          className="w-full"
          disabled={loading}
          onClick={handleSignIn}
        >
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
      </CardContent>
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By signing up, you agree to our{" "}
          <a
            href="/legal/terms-and-conditions"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/legal/privacy-policy"
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

export default SigninForm;
