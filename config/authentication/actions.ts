"use server";

import { signIn } from "@/config/authentication/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { log } from "node:console";

export async function authenticate(email: string, password: string) {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,

    });
    return res;
  } catch (error: any) {
    
    console.log("Authenticate Error:" , error);
    
    return {
      success: false,
      message: error.cause.err.message,
    };
  }
}
