'use client'
import ActionPage from "@/components/actions/ActionPage";
import { Minus } from "lucide-react";

export default function IncomePage() {
  return (
    <ActionPage
      kind="EXPENSE"
      title="Add expense"
      description={(id) => `Record new expense for ${id}`}
      icon={Minus}
      color="red"
    />
  );
}
