import NextAuth from "next-auth";
import {authOptions} from "@/features/auth/server/auth.config";

export const handler = NextAuth(authOptions);