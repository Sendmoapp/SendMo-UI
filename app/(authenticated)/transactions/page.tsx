"use client";
import React, { useState } from "react";
import Image from "next/image";
import BackButton from "@/app/components/BackButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  type: "sent" | "received" | "added" | "converted";
  title: string;
  date: string;
  amount: string;
  currency: string;
};

const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [date, setDate] = useState<Date>();

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "sent",
      title: "Sent to Mike",
      date: "March 15, 2024",
      amount: "-150.00",
      currency: "USDC",
    },
    {
      id: "2",
      type: "received",
      title: "Received from Emma",
      date: "March 14, 2024",
      amount: "+75.00",
      currency: "USDC",
    },
    {
      id: "3",
      type: "added",
      title: "Added funds via Credit Card",
      date: "March 13, 2024",
      amount: "+200.00",
      currency: "USDC",
    },
    {
      id: "4",
      type: "converted",
      title: "Convert from USD to USDT",
      date: "March 14, 2024",
      amount: "+75.00",
      currency: "USDT",
    },
  ];

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "sent":
        return {
          src: "/icons/DIV.svg",
          bg: "bg-[#FEE2E2]",
        };
      case "received":
        return {
          src: "/icons/DIV (1).svg",
          bg: "bg-[#DCFCE7]",
        };
      case "added":
        return {
          src: "/icons/DIV (2).svg",
          bg: "bg-[#DBEAFE]",
        };
      case "converted":
        return {
          src: "/icons/DIV (3).svg",
          bg: "bg-[#FEF9C3]",
        };
    }
  };

  return (
    <div className="w-full mx-auto">
      <BackButton />

      {/* Main Content */}
      <div className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">
            All Transactions
          </h1>

          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] !h-[42px] border-[#E5E7EB] rounded-[12px] bg-white focus:ring-0">
                <SelectValue
                  placeholder="All Categories"
                  className="text-base font-normal text-[#111827]"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="added">Added</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[240px] rounded-[12px] border border-[#E5E7EB] py-2 px-4 pr-10 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
              />
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={16}
                height={16}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[180px] !h-[42px] border-[#E5E7EB] rounded-[12px] bg-white justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const icon = getTransactionIcon(transaction.type);
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-[12px] border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${icon.bg} flex items-center justify-center`}
                  >
                    <Image
                      src={icon.src}
                      alt={transaction.type}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-[#111827] text-base font-medium">
                      {transaction.title}
                    </h3>
                    <p className="text-[#6B7280] font-normal text-sm">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-normal text-base ${
                    transaction.amount.startsWith("-")
                      ? "text-[#EF4444]"
                      : "text-[#10B981]"
                  }`}
                >
                  {transaction.amount} {transaction.currency}
                </span>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center items-center mt-6">
          <button className="py-2 px-4 text-white mx-auto font-normal text-base bg-[#0172E6] border border-[#E5E7EB] rounded-[12px] ">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
