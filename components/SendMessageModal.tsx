'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SendMessageModalProps {
  recipientId: string;
  recipientName: string;
  recipientEmail?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function SendMessageModal({
  recipientId,
  recipientName,
  recipientEmail,
  trigger,
  onSuccess,
}: SendMessageModalProps) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const initials = recipientName
    ? recipientName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to send messages');
        return;
      }

      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          message_text: message.trim(),
        });

      if (insertError) throw insertError;

      setMessage('');
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare size={14} />
            Message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">To: {recipientName}</p>
              {recipientEmail && (
                <p className="text-xs text-muted-foreground">{recipientEmail}</p>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Textarea
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              disabled={sending}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to send
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="gap-2"
            >
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick action button for deal cards and lists
interface QuickMessageButtonProps {
  recipientId: string;
  recipientName: string;
}

export function QuickMessageButton({ recipientId, recipientName }: QuickMessageButtonProps) {
  return (
    <SendMessageModal
      recipientId={recipientId}
      recipientName={recipientName}
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Send message">
          <MessageSquare size={14} />
        </Button>
      }
    />
  );
}

export default SendMessageModal;





