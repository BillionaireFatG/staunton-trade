'use client';

import { useState } from 'react';
import { Mic, MicOff, Phone, Settings as SettingsIcon, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface VoiceControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onLeave: () => void;
  disabled?: boolean;
}

export function VoiceControls({
  isMuted,
  onToggleMute,
  onLeave,
  disabled = false,
}: VoiceControlsProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [volume, setVolume] = useState(80);

  const handleLeaveClick = () => {
    setShowLeaveDialog(true);
  };

  const handleConfirmLeave = () => {
    setShowLeaveDialog(false);
    onLeave();
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 md:left-60 h-20 bg-card border-t border-border z-40">
        <div className="h-full flex items-center justify-center gap-4 px-6">
          {/* Mute Toggle */}
          <Button
            size="lg"
            variant={isMuted ? 'destructive' : 'default'}
            className={`h-14 w-14 rounded-full ${
              isMuted ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
            onClick={onToggleMute}
            disabled={disabled}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>

          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
            <kbd className="px-2 py-1 text-xs bg-accent rounded border border-border">
              M
            </kbd>
          </div>

          {/* Leave Room */}
          <Button
            size="lg"
            variant="destructive"
            className="h-14 px-8 rounded-full"
            onClick={handleLeaveClick}
            disabled={disabled}
          >
            <Phone size={20} className="mr-2" />
            Leave Room
          </Button>

          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Leave</span>
            <kbd className="px-2 py-1 text-xs bg-accent rounded border border-border">
              L
            </kbd>
          </div>

          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full"
                disabled={disabled}
              >
                <SettingsIcon size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Audio Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="px-2 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Output Volume</span>
                  <span className="text-sm text-muted-foreground">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <Volume2 size={14} className="mr-2" />
                Select Microphone
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Volume2 size={14} className="mr-2" />
                Select Speaker
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <SettingsIcon size={14} className="mr-2" />
                Advanced Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Leave Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Voice Room?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this voice room? You can rejoin at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLeave} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Leave Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}




