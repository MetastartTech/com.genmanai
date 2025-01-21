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
} from "firebase/auth";
import "firebase/compat/auth";
import { auth } from "../../firebase";
import { signin, signup } from "../../api/user";
import { IUser } from "@/types/schema";
import { IUserContext } from "@/types/context";

interface IUserProvider {
  children: ReactNode;
}

const UserProvider: React.FC<IUserProvider> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

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

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    let fbUser: User;
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
  };

  const logOut = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
        setIdToken(null);
        setUser(null);
      })
      .catch((error) => {
        setIdToken(null);
        setUser(null);
        setLoading(false);
      });
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
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserProvider;
