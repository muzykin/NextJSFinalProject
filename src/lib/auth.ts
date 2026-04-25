import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface JwtPayload {
  userId: string;
  email: string;
}

export async function getUserFromToken(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    // Get the public key to verify the signature
    const publicKey = process.env.JWT_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error("JWT_PUBLIC_KEY is not defined");
    }

    // Verify the token using the PUBLIC key (RSA)
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    return decoded;
  } catch (error) {
    return null;
  }
}