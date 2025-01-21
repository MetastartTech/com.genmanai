// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import { Button } from "../ui/button";
// import { Icons } from "../ui/icon";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import useUser from "@/provider/userContext/useUserContext";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { useState } from "react";

// const SignupForm = () => {
//   const { signIn, loading, signUpWithEmailPassword } = useUser();
//   const [code, setCode] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [fullName, setFullName] = useState<string>("");

//   const router = useRouter();

//   const handleSignIn = async () => {
//     await signIn(code);
//     toast.success("Signed up successfully");
//     // toast.error("Sign Up Failed");

//     router.push("/dashboard/llm");
//   };

//   const handleSignUp = async () => {
//     await signUpWithEmailPassword(email, password, fullName, code);
//     router.push("/dashboard/llm");
//   };

//   return (
//     <Card className="max-w-sm w-full">
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl">Create an account</CardTitle>
//         <CardDescription>
//           Already have an account? Click{" "}
//           <a
//             href="/signin"
//             className="underline underline-offset-4 hover:text-primary"
//           >
//             here
//           </a>{" "}
//           to sign in
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="grid gap-4">
//         <div className="grid gap-2">
//           <Label htmlFor="code">Referral Code (optional)</Label>
//           <Input
//             id="code"
//             type="code"
//             placeholder="Enter referral code"
//             autoComplete="off"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//           />
//         </div>
//         <Button
//           variant="outline"
//           className="w-full"
//           disabled={loading}
//           onClick={handleSignIn}
//         >
//           {loading ? (
//             <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//           ) : (
//             <Icons.google className="mr-2 h-4 w-4" />
//           )}
//           Google
//         </Button>
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t"></span>
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="bg-background px-2 text-muted-foreground">
//               Or continue with
//             </span>
//           </div>
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="fullName">Full Name</Label>
//           <Input
//             id="fullName"
//             type="fullName"
//             placeholder="Your Full Name"
//             autoComplete="off"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//           />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="m@example.com"
//             autoComplete="off"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//       </CardContent>
//       <CardFooter className="flex flex-col gap-4">
//         <Button className="w-full" disabled={loading} onClick={handleSignUp}>
//           {loading ? (
//             <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//           ) : (
//             "Continue"
//           )}
//         </Button>
//         <p className="px-8 text-center text-sm text-muted-foreground">
//           By signing up, you agree href our{" "}
//           <a
//             href="/terms"
//             className="underline underline-offset-4 hover:text-primary"
//           >
//             Terms of Service
//           </a>{" "}
//           and{" "}
//           <a
//             href="/privacy"
//             className="underline underline-offset-4 hover:text-primary"
//           >
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </CardFooter>
//     </Card>
//   );
// };

// export default SignupForm;
