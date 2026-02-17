"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import type { SelectWaitlistEntry } from "@/lib/db/schema";

type StatusFilter = "all" | "pending" | "approved" | "denied";

export default function AdminWaitlistPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [entries, setEntries] = useState<SelectWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [actioningId, setActioningId] = useState<number | null>(null);

  const isAdmin =
    (user?.publicMetadata as { role?: string })?.role === "admin";

  useEffect(() => {
    if (!isLoaded) return;
    if (!isAdmin) {
      router.push("/members");
      return;
    }
    fetchEntries();
  }, [isLoaded, isAdmin]);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/admin/waitlist");
      if (res.ok) {
        setEntries(await res.json());
      } else if (res.status === 403) {
        router.push("/members");
      }
    } catch {
      toast.error("Failed to load waitlist entries");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    entryId: number,
    action: "approve" | "deny"
  ) => {
    if (
      !confirm(
        `Are you sure you want to ${action} this request?${
          action === "approve"
            ? " An invitation email will be sent."
            : ""
        }`
      )
    ) {
      return;
    }

    setActioningId(entryId);
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, action }),
      });

      if (res.ok) {
        const updated = await res.json();
        setEntries((prev) =>
          prev.map((e) => (e.id === entryId ? updated : e))
        );
        toast.success(
          action === "approve"
            ? "Invitation sent successfully"
            : "Request denied"
        );
      } else {
        const err = await res.json();
        toast.error(err.error || `Failed to ${action}`);
      }
    } catch {
      toast.error(`Failed to ${action}`);
    } finally {
      setActioningId(null);
    }
  };

  const filteredEntries =
    filter === "all"
      ? entries
      : entries.filter((e) => e.status === filter);

  if (!isLoaded || loading) {
    return (
      <section className="container py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-warm-sand/30" />
          <div className="h-4 w-64 rounded bg-warm-sand/30" />
          <div className="mt-8 h-64 rounded-xl bg-warm-sand/20" />
        </div>
      </section>
    );
  }

  if (!isAdmin) return null;

  return (
    <section className="container py-16">
      <div>
        <h1>Waitlist Management</h1>
        <p className="mt-2 text-muted">
          Review and manage membership requests
        </p>
      </div>

      {/* Status Filter */}
      <div className="mt-6 flex gap-2">
        {(["pending", "approved", "denied", "all"] as StatusFilter[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                filter === status
                  ? "bg-burgundy text-white"
                  : "bg-warm-sand/20 text-deep-umber hover:bg-warm-sand/40"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({entries.filter((e) => e.status === status).length})
                </span>
              )}
            </button>
          )
        )}
      </div>

      {/* Entries Table */}
      {filteredEntries.length === 0 ? (
        <div className="mt-8 rounded-xl border border-warm-sand bg-white p-12 text-center shadow-sm">
          <p className="text-muted">
            No {filter === "all" ? "" : filter} waitlist entries.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-warm-sand bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-warm-sand bg-warm-sand/10">
              <tr>
                <th className="px-4 py-3 font-medium text-deep-umber">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-deep-umber">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-deep-umber">
                  Family Connection
                </th>
                <th className="px-4 py-3 font-medium text-deep-umber">
                  Date
                </th>
                <th className="px-4 py-3 font-medium text-deep-umber">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-deep-umber">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-sand/50">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-warm-sand/5">
                  <td className="px-4 py-3 text-deep-umber">
                    {entry.fullName}
                  </td>
                  <td className="px-4 py-3 text-muted">{entry.email}</td>
                  <td className="px-4 py-3 text-deep-umber/70 max-w-[200px] truncate">
                    {entry.familyConnection}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="px-4 py-3">
                    {entry.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(entry.id, "approve")}
                          disabled={actioningId === entry.id}
                        >
                          {actioningId === entry.id
                            ? "..."
                            : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAction(entry.id, "deny")}
                          disabled={actioningId === entry.id}
                        >
                          Deny
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    denied: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}
