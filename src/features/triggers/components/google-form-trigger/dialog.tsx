"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./google-form-trigger-script";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const webhookUrl = `${
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  }/api/webhooks/google-form?workflowId=${workflowId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy webhook URL");
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form&apos;s Apps Script to
            trigger the workflow when a Google Form is submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhookUrl"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button type="button" size="icon" onClick={handleCopy}>
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          {/* Help */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium">Setup Instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Google Form</li>
              <li>
                Click on the{" "}
                <Image
                  src="/logos/threedotsmenu.svg"
                  alt="Three Dots Menu"
                  width={16}
                  height={16}
                  className="inline"
                />{" "}
                &nbsp;→ &ldquo;Apps Script&quot; button
              </li>
              <li>Copy and paste the script below into the script editor</li>
              <li>
                Save and click &ldquo;Triggers&quot; → &ldquo;Add Trigger&quot;
              </li>
              <li>Choose: From form → On form submit → Save</li>
            </ol>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="font-medium text-sm">Google Apps Script:</h4>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const script = generateGoogleFormScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Script copied to clipboard");
                } catch {
                  toast.error("Failed to copy script");
                }
              }}
            >
              <CopyIcon className="size-4 mr-2" />
              Copy Script
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook URL and handles form submission.
            </p>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.respondantEmail}}"}
                </code>
                <span className="text-muted-foreground">
                  — Respondant Email
                </span>
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>
                <span className="text-muted-foreground">— Specific Answer</span>
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json googleForm.responses}}"}
                </code>
                <span className="text-muted-foreground">
                  — All Responses (JSON)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
