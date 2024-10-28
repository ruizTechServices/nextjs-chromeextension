"use client";

import { useState } from "react";
import { Mail, Send, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Popup() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const subject = formData.get("subject") as string;
      const message = formData.get("message") as string;

      // Get stored Supabase credentials from Chrome storage
      const { supabaseUrl, supabaseKey } = await chrome.storage.local.get([
        "supabaseUrl",
        "supabaseKey",
      ]);

      if (!supabaseUrl || !supabaseKey) {
        toast({
          title: "Configuration Missing",
          description: "Please set your Supabase credentials first",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/send_test_email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ to_email: email, subject, content: message }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      toast({
        title: "Success",
        description: "Test email sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] p-4 bg-background">
      <div className="flex items-center space-x-2 mb-4">
        <Mail className="h-6 w-6" />
        <h1 className="text-xl font-bold">SupaMail</h1>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">
            <Send className="w-4 h-4 mr-2" />
            Send Test
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <form onSubmit={handleSendTest} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Email</label>
              <Input
                type="email"
                name="email"
                placeholder="recipient@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                type="text"
                name="subject"
                placeholder="Test Email Subject"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                name="message"
                placeholder="Enter your test message here..."
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className={cn("w-full", loading && "opacity-50")}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Email
                </span>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="settings">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supabase Project URL</label>
              <Input
                type="url"
                name="supabaseUrl"
                placeholder="https://your-project.supabase.co"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Supabase API Key</label>
              <Input
                type="password"
                name="supabaseKey"
                placeholder="your-supabase-api-key"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}