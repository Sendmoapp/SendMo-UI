"use server";

import { db } from "@/database/db";
import { userSchema } from "@/database/schema";
import { eq, ilike, or } from "drizzle-orm";

export const createUser = async (user: User) => {
  const userObject: typeof userSchema.$inferInsert = {
    fullName: user.fullName,
    username: user.username,
    walletAddress: user.walletAddress,
    email: user.email,
    userId: user.userId,
  };
  try {
    const existingUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.username, userObject.username))
      .limit(1);
    if (existingUser.length > 0) {
      return {
        success: false,
        error: "User already exists",
      };
    }
    const res: User[] = await db
      .insert(userSchema)
      .values(userObject)
      .returning();
    console.log({ res });

    return {
      success: true,
    };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      error: "Sign up failed",
    };
  }
};

export const getUsers = async (query: string) => {
  try {
    const result = await db
      .select()
      .from(userSchema)
      .where(
        or(
          ilike(userSchema.username, `%${query}%`),
          ilike(userSchema.email, `%${query}%`),
          eq(userSchema.walletAddress, query)
        )
      );
    if (result.length > 0) {
      return {
        success: true,
        results: result,
      };
    } else {
      return {
        success: false,
        error: "No user found",
      };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: "Error fetching",
    };
  }
};
