'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Key,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Check,
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  LogOut,
  Trash2,
  Download,
  Upload,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

// Settings Section Component
function SettingsSection({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description?: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// Settings Row Component
function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// Profile Settings Tab
function ProfileSettings() {
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={avatar || undefined} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Profile Photo</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This will be displayed on your profile and in messages.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload size={14} className="mr-1.5" />
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </Button>
                {avatar && (
                  <Button variant="ghost" size="sm" onClick={() => setAvatar(null)}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" defaultValue="john.doe@example.com" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="phone" type="tel" defaultValue="+1 (555) 000-0000" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Job Title</Label>
            <Input id="role" defaultValue="Senior Trader" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us about yourself..."
              defaultValue="Experienced commodity trader with 10+ years in oil & gas markets."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Information</CardTitle>
          <CardDescription>Your organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="company" defaultValue="Acme Trading Co." className="pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Type</Label>
              <Select defaultValue="trader">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trader">Trader</SelectItem>
                  <SelectItem value="refiner">Refiner</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select defaultValue="us">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="nl">Netherlands</SelectItem>
                  <SelectItem value="sg">Singapore</SelectItem>
                  <SelectItem value="ae">UAE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="address" defaultValue="123 Trading Street, Houston, TX" className="pl-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input id="website" defaultValue="https://acmetrading.com" className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>Saving...</>
          ) : saved ? (
            <>
              <Check size={16} />
              Saved!
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Appearance Settings Tab
function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [currentAccent, setCurrentAccent] = React.useState('copper');

  // Load saved accent on mount
  React.useEffect(() => {
    const savedAccent = localStorage.getItem('staunton-accent-color');
    if (savedAccent) {
      setCurrentAccent(savedAccent);
    }
  }, []);

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-gray-200' },
    { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-gray-900 border-gray-700' },
    { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-gray-900' },
  ];

  const accentColors = [
    { id: 'copper', label: 'Copper', hsl: '24 35% 35%', hex: '#7a5c4f' },
    { id: 'gold', label: 'Gold', hsl: '38 92% 50%', hex: '#f5a623' },
    { id: 'emerald', label: 'Emerald', hsl: '160 84% 39%', hex: '#10b981' },
    { id: 'blue', label: 'Blue', hsl: '217 91% 60%', hex: '#3b82f6' },
    { id: 'purple', label: 'Purple', hsl: '262 83% 58%', hex: '#8b5cf6' },
    { id: 'pink', label: 'Pink', hsl: '330 81% 60%', hex: '#ec4899' },
    { id: 'red', label: 'Red', hsl: '0 84% 60%', hex: '#ef4444' },
    { id: 'orange', label: 'Orange', hsl: '25 95% 53%', hex: '#f97316' },
    { id: 'teal', label: 'Teal', hsl: '175 77% 40%', hex: '#14b8a6' },
    { id: 'cyan', label: 'Cyan', hsl: '189 94% 43%', hex: '#06b6d4' },
    { id: 'monochrome', label: 'Monochrome', hsl: '0 0% 20%', hex: '#333333' },
  ];

  const handleAccentChange = (accentId: string) => {
    const accent = accentColors.find(a => a.id === accentId);
    if (!accent) return;
    
    setCurrentAccent(accentId);
    
    // Apply CSS variables
    const html = document.documentElement;
    html.style.setProperty('--primary', accent.hsl);
    html.style.setProperty('--ring', accent.hsl);
    
    // Save to localStorage
    localStorage.setItem('staunton-accent-color', accentId);
  };

  const handleThemeChange = (themeId: string) => {
    const html = document.documentElement;
    
    if (themeId === 'light') {
      html.classList.remove('dark');
      setTheme('light');
    } else if (themeId === 'dark') {
      html.classList.add('dark');
      setTheme('dark');
    } else {
      setTheme('system');
    }
    
    // Re-apply accent color after theme change
    const savedAccent = localStorage.getItem('staunton-accent-color');
    if (savedAccent) {
      setTimeout(() => handleAccentChange(savedAccent), 50);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme Mode</CardTitle>
          <CardDescription>Select your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-colors',
                  theme === t.id ? 'border-primary' : 'border-border hover:border-muted-foreground'
                )}
              >
                <div className={cn('w-full h-12 rounded-md border mb-3', t.preview)} />
                <div className="flex items-center justify-center gap-2">
                  <t.icon size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accent Color */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accent Color</CardTitle>
          <CardDescription>Choose your primary accent color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((accent) => (
              <button
                key={accent.id}
                onClick={() => handleAccentChange(accent.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all',
                  currentAccent === accent.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                )}
              >
                <div 
                  className="w-5 h-5 rounded-full shadow-sm"
                  style={{ backgroundColor: accent.hex }}
                />
                <span className="text-sm font-medium">{accent.label}</span>
                {currentAccent === accent.id && (
                  <Check size={14} className="text-primary ml-1" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Display Options</CardTitle>
          <CardDescription>Customize your viewing experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingsRow label="Compact Mode" description="Use smaller spacing and fonts">
            <Switch />
          </SettingsRow>
          <Separator />
          <SettingsRow label="Show Animations" description="Enable interface animations">
            <Switch defaultChecked />
          </SettingsRow>
          <Separator />
          <SettingsRow label="Auto-switch Theme" description="Switch theme based on time of day">
            <Switch />
          </SettingsRow>
        </CardContent>
      </Card>
    </div>
  );
}

// Notifications Settings Tab
function NotificationsSettings() {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email Notifications</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingsRow label="Deal Updates" description="Get notified when deals are updated">
            <Switch defaultChecked />
          </SettingsRow>
          <Separator />
          <SettingsRow label="New Messages" description="Receive email for new messages">
            <Switch defaultChecked />
          </SettingsRow>
          <Separator />
          <SettingsRow label="Price Alerts" description="Get notified of price changes">
            <Switch defaultChecked />
          </SettingsRow>
          <Separator />
          <SettingsRow label="Weekly Digest" description="Receive a weekly summary">
            <Switch />
          </SettingsRow>
          <Separator />
          <SettingsRow label="Marketing Emails" description="Receive news and updates">
            <Switch />
          </SettingsRow>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Push Notifications</CardTitle>
          <CardDescription>In-app and browser notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingsRow label="Desktop Notifications" description="Show browser notifications">
            <Switch defaultChecked />
          </SettingsRow>
          <Separator />
          <SettingsRow label="Sound Alerts" description="Play sound for notifications">
            <Switch defaultChecked />
          </SettingsRow>
          <Separator />
          <SettingsRow label="Do Not Disturb" description="Pause all notifications">
            <Switch />
          </SettingsRow>
        </CardContent>
      </Card>

      {/* Notification Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quiet Hours</CardTitle>
          <CardDescription>Set times when notifications are silenced</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingsRow label="Enable Quiet Hours" description="Automatically silence notifications">
            <Switch />
          </SettingsRow>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select defaultValue="22:00">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Select defaultValue="07:00">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Security Settings Tab
function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="currentPassword" 
                type={showCurrentPassword ? 'text' : 'password'} 
                className="pl-10 pr-10" 
              />
              <button 
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                id="newPassword" 
                type={showNewPassword ? 'text' : 'password'} 
                className="pl-10 pr-10" 
              />
              <button 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              At least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Authenticator App</h4>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator or Authy
              </p>
            </div>
            <Badge variant="outline" className="text-emerald-600">Enabled</Badge>
          </div>
          
          <Button variant="outline">Manage 2FA</Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <CardDescription>Manage your logged-in devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { device: 'Windows PC - Chrome', location: 'Houston, TX', current: true, time: 'Now' },
            { device: 'iPhone 14 Pro - Safari', location: 'Houston, TX', current: false, time: '2 hours ago' },
            { device: 'MacBook Pro - Chrome', location: 'New York, NY', current: false, time: '3 days ago' },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Monitor size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session.device}
                    {session.current && (
                      <Badge variant="secondary" className="ml-2 text-[10px]">Current</Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.location} · {session.time}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <LogOut size={14} />
                </Button>
              )}
            </div>
          ))}
          
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            Sign out all other devices
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Export Data</p>
              <p className="text-sm text-muted-foreground">Download all your data</p>
            </div>
            <Button variant="outline">
              <Download size={14} className="mr-1.5" />
              Export
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 size={14} className="mr-1.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Settings Page
export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="profile" className="gap-2">
            <User size={14} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette size={14} />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={14} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={14} />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
