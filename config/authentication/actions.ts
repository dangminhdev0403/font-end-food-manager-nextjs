"use server";

import { signIn } from "@/config/authentication/auth";

export async function authenticate(email: string, password: string) {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("login result:", res);
    return res;
  } catch (error: any) {
    // console.log("Error Auth here:..\n", error.cause);

    return {
      success: false,
      message: error.cause.err.message,
    };
  }
}
