"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createUser } from "../server_actions/userActions";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AccountSetupForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { ready, user } = usePrivy();
  const [isPending, setIsPending] = useState(false);
  const formSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    // password: z
    //   .string()
    //   .min(8, "Password must be at least 8 characters")
    //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .regex(/[0-9]/, "Password must contain at least one number")
    //   .regex(
    //     /[^A-Za-z0-9]/,
    //     "Password must contain at least one special character"
    //   ),
    // confirmPassword: z.string().min(1, "Password confirmation is required"),
    // })
    // .refine((data) => data.password === data.confirmPassword, {
    //   message: "Passwords must match",
    //   path: ["confirmPassword"],
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!ready && !user) return;
    setValue("email", user?.email?.address || "");
  }, [ready, user]);

  const onSubmit = async (data: FormData) => {
    if (!ready && !user) return;
    setIsPending(true);
    const result = await createUser({
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      walletAddress: user!.wallet!.address,
      userId: user!.id,
    });

    if (!result.success && result.error === "User already exists") {
      console.log({ result });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "User already exists",
      });
    }
    setIsPending(false);
    if (result.success) router.push("/dashboard");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div>
        <label className="mb-2 block text-sm font-normal text-[#6B7280]">
          Full Name
        </label>
        <input
          {...register("fullName")}
          placeholder="John Doe"
          className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-normal text-[#6B7280]">
          Email
        </label>
        <input
          {...register("email")}
          placeholder="info@sendmo.com"
          className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-normal text-[#6B7280]">
          Username
        </label>
        <input
          {...register("username")}
          placeholder="John Doe"
          className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>
      {/* <div>
        <label className="mb-2 block text-sm font-normal text-[#6B7280]">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label className="mb-2 block text-sm font-normal text-[#6B7280]">
          Password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div> */}
      <button
        type="submit"
        disabled={!isValid || !ready}
        className={`w-full rounded-[12px] py-3 text-center text-base font-semibold text-white ${
          isValid ? "bg-[#0172E6]" : "cursor-not-allowed bg-[#ADBEFF]"
        }`}
      >
        {isPending ? (
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-2 border-[#fff]" />
          </div>
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
};

export default AccountSetupForm;
