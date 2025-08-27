'use client'
import ActionPage from "@/components/actions/ActionPage";
import { Plus } from "lucide-react";

export default function IncomePage() {
  return (
    <ActionPage
      kind="INCOME"
      title="Add Income"
      description={(id) => `Record new income for ${id}`}
      icon={Plus}
      color="green"
    />
  );
}
