'use client'
import ActionPage from "@/components/actions/ActionPage";
import { RotateCcw } from "lucide-react";

export default function IncomePage() {
  return (
    <ActionPage
      kind="REPAYMENT"
      title="Add repayment"
      description={(id) => `Record new repayment for ${id}`}
      icon={RotateCcw}
      color="blue"
    />
  );
}
