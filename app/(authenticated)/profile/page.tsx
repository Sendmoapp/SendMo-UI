"use client";
import BackButton from "@/app/components/BackButton";
import { userProfileAtom } from "@/app/state/atoms";
import { usePrivy } from "@privy-io/react-auth";
import { useAtom } from "jotai";
import { Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProfilePage = () => {
  const { user, ready, authenticated } = usePrivy();
  const [userProfile] = useAtom(userProfileAtom);

  return (
    <div className="max-w-[600px] mx-auto">
      <BackButton />

      {/* Main Content */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Account</h1>
          <Link
            href="/profile/1"
            className="text-[#0172E6] text-base font-normal"
          >
            Edit Account
          </Link>
        </div>

        {/* Profile Info */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src="/assets/user_avata.png"
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
              <Link
                href="/profile/1"
                className="absolute -bottom-1 -right-1 bg-[#0172E6] rounded-full p-1"
              >
                <Image
                  src="/icons/edit-2-fill.svg"
                  alt="Verified"
                  width={16}
                  height={16}
                />
              </Link>
            </div>
            <div className="flex-1">
              <h2 className="text-[#111827] text-base font-medium">
                {userProfile?.fullName || ""}
              </h2>
              <p className="text-[#6B7280] text-sm font-normal">
                {userProfile?.email || ""}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-[8px] px-3 py-2 border border-[#E5E7EB]">
              <span className="text-[#111827] text-base font-normal">
                {userProfile?.username || ""}
              </span>
              <button className="text-[#E5E7EB]">
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB]  rounded-[12px] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#111827] text-base font-medium">
                Account Password
              </h3>
            </div>
            <Link
              href="/profile/1"
              className="text-[#0172E6] text-base font-normal"
            >
              Change
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
