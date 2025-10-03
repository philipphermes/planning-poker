import NextAuth from "next-auth";
import {getAuthConfig} from "@/features/auth/server/auth.config";

export const handler = NextAuth(getAuthConfig());