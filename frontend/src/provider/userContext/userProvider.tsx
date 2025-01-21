"use client";

import UserContext from "./context";
import { useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  deleteUser,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "firebase/compat/auth";
import { auth } from "../../firebase";
import { signin } from "../../api/user";
import { ICredits, IUser } from "@/types/schema";
import { IUserContext } from "@/types/context";
import { deleteEverythingOnLogout } from "@/actions/activeRequests";
import { checkReferral } from "@/api/referral";
import { toast } from "sonner";
import { signUpEmail } from "@/api/user/signUpEmail";
import { signInEmail } from "@/api/user/signInEmail";

interface IUserProvider {
  children: ReactNode;
}

const UserProvider: React.FC<IUserProvider> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  const deviceFingerprint = 456;

  const setUserCredits = (wallet: ICredits) => {
    setUser((prevUser: IUser | null) => {
      if (prevUser) {
        return { ...prevUser, creditsWallet: wallet };
      }
      return null;
    });
  };

  const handleUserAndToken = async (fbUser: User) => {
    try {
      const token = await fbUser.getIdToken();
      setIdToken(token);
      const user = await signin(token);
      setUser(user);
    } catch (e) {
      throw e;
    }
  };

  const signIn = async (code: string = "") => {
    try {
      const provider = new GoogleAuthProvider();
      setLoading(true);
      let joinedBy: string, referredBy: string, fbUser: User;
      if (code != "" && code.trim().length > 0) {
        let response = await checkReferral(code, deviceFingerprint);
        joinedBy = response._id;
        referredBy = response.user;
      }
      await signInWithPopup(auth, provider)
        .then(async (result) => {
          fbUser = result.user;
          await handleUserAndToken(result.user);
        })
        .catch(async (e) => {
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
          setInitializing(false);
        });
    } catch (e: any) {
      alert(e.message);
      toast.error("Sign Up Failed!");
    }
  };

  const logOut = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
        setIdToken(null);
        deleteEverythingOnLogout(user?.email ?? "");
        setUser(null);
      })
      .catch((error) => {
        setIdToken(null);
        setUser(null);
        setLoading(false);
      });
  };

  const handleUserSignUp = async (
    fbUser: User,
    fullName: string,
    joinedBy: string,
    referredBy: string
  ) => {
    try {
      const token = await fbUser.getIdToken();
      setIdToken(token);
      const user = await signUpEmail(
        token,
        fullName,
        joinedBy,
        referredBy,
        deviceFingerprint
      );
      setUser(user);
    } catch (e) {
      throw e;
    }
  };

  const handleUserSignIn = async (fbUser: User) => {
    try {
      const token = await fbUser.getIdToken();
      setIdToken(token);
      const user = await signInEmail(token);
      setUser(user);
    } catch (e) {
      throw e;
    }
  };

  const signUpWithEmailPassword = async (
    email: string,
    password: string,
    fullName: string,
    code: string = ""
  ) => {
    try {
      let joinedBy: string, referredBy: string;
      setLoading(true);
      if (code != "" && code.trim().length > 0) {
        let response = await checkReferral(code, deviceFingerprint);
        joinedBy = response._id;
        referredBy = response.user;
      }
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (result) => {
          await handleUserSignUp(result.user, fullName, joinedBy, referredBy);
          toast.success("Sign Up With Email Successfull!");
        })
        .catch(async (e) => {
          setUser(null);
          toast.error("Sign Up Failed!!");
        })
        .finally(() => {
          setLoading(false);
          setInitializing(false);
        });
    } catch (e: any) {
      alert(e.message);
      toast.error("Signup Failed!!");
    }
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (result) => {
          await handleUserSignIn(result.user);
          toast.success("Sign In With Email Successfull!");
        })
        .catch(async (e) => {
          setUser(null);
          toast.error("SignIn Failed -> Invalid Credentials!!");
        })
        .finally(() => {
          setLoading(false);
          setInitializing(false);
        });
    } catch (e: any) {
      alert(e.message);
      toast.error("SignIn Failed!!");
    }
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await handleUserAndToken(user);
        } else {
          setUser(null);
          setIdToken(null);
        }
      } catch (e: any) {
        if (user && e.message === "User not found") {
          await deleteUser(user);
        }
        setUser(null);
        setIdToken(null);
        logOut();
      } finally {
        setInitializing(false);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const values: IUserContext = {
    user,
    setUser,
    signIn,
    logOut,
    loading,
    setLoading,
    idToken,
    setIdToken,
    initializing,
    signUpWithEmailPassword,
    signInWithEmailPassword,
    setUserCredits,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserProvider;
