"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BackButton from "@/app/components/BackButton";
import { useAtom } from "jotai";
import { userProfileAtom } from "@/app/state/atoms";

const formSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const EditProfilePage = () => {
  const [userProfile] = useAtom(userProfileAtom);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: userProfile?.fullName,
      username: userProfile?.username,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="max-w-[570px] mx-auto">
      <BackButton />

      {/* Main Content */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-semibold text-[#111827] mb-6">Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm text-[#6B7280] mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-[#6B7280] mb-2 block">
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
              placeholder="JohnDoe53"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-[#6B7280] mb-2 block">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
              placeholder="••••••••••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-[#6B7280] mb-2 block">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full rounded-[12px] border border-[#D4D4D8] p-3 placeholder:text-[#D4D4D8]"
              placeholder="••••••••••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Update Account Button */}
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full rounded-[12px] py-3 text-center text-base font-semibold text-white ${
              isValid ? "bg-[#0172E6]" : "cursor-not-allowed bg-[#ADBEFF]"
            }`}
          >
            Update Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
