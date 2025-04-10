"use client"

import { useState, useEffect, useRef } from "react"
import { User, Bell, Moon, Sun, Palette, Globe, Shield, Download, Trash2, Camera } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const router = useRouter()
  const [settings, setSettings] = useState({
    name: "Jane Doe",
    username: "janedoe",
    email: "jane.doe@example.com",
    readingLevel: "advanced",
    fontSize: "medium",
    fontFamily: "inter",
    readingMode: false,
    emailNotifications: {
      readingReminders: true,
      goalUpdates: true,
      newQuizzes: true
    },
    inAppNotifications: {
      achievementAlerts: true,
      aiInsights: true
    },
    privacy: {
      readingAnalytics: true,
      usageData: true,
      profileVisibility: "friends",
      showReadingActivity: true
    },
    preferences: {
      dailyGoal: 30,
      weeklyGoal: 1,
      genres: {
        fiction: true,
        nonFiction: true,
        sciFi: true,
        fantasy: true,
        mystery: false,
        biography: false
      },
      aiFeatures: {
        recommendations: true,
        insights: true
      }
    }
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profilePic, setProfilePic] = useState("/default-avatar.png")

  // Load profile data on mount
  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSettings(parsedSettings)
      // Load profile pic if exists
      const savedProfilePic = localStorage.getItem("profilePic")
      if (savedProfilePic) {
        setProfilePic(savedProfilePic)
      }
      // Apply saved font settings
      document.body.className = document.body.className
        .replace(/text-size-\w+/g, `text-size-${parsedSettings.fontSize}`)
        .replace(/font-family-\w+/g, `font-family-${parsedSettings.fontFamily}`)
    }
  }, [])

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings))
    
    // Save profile pic
    localStorage.setItem("profilePic", profilePic)
    
    // Apply font settings
    document.body.className = document.body.className
      .replace(/text-size-\w+/g, `text-size-${settings.fontSize}`)
      .replace(/font-family-\w+/g, `font-family-${settings.fontFamily}`)
    
    // Update sidebar profile data
    const event = new CustomEvent('profileUpdate', { 
      detail: { 
        name: settings.name,
        username: settings.username,
        readingLevel: settings.readingLevel,
        profilePic: profilePic
      } 
    })
    window.dispatchEvent(event)
    
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })
  }

  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  const updateSettings = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev }
      let current = newSettings
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return newSettings
    })
  }

  const handleFontSizeChange = (value: string) => {
    updateSettings(["fontSize"], value)
    // Apply font size immediately
    document.body.className = document.body.className
      .replace(/text-size-\w+/g, `text-size-${value}`)
  }

  const handleFontFamilyChange = (value: string) => {
    updateSettings(["fontFamily"], value)
    // Apply font family immediately
    document.body.className = document.body.className
      .replace(/font-family-\w+/g, `font-family-${value}`)
  }

  const handleDownloadData = async () => {
    try {
      const data = {
        books: JSON.parse(localStorage.getItem('books') || '[]'),
        preferences: JSON.parse(localStorage.getItem('preferences') || '{}'),
        achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
        readingHistory: JSON.parse(localStorage.getItem('readingHistory') || '[]')
      };

      // Create a formatted text version of the data
      const formattedData = `
EchoRead - Reading Report
Generated on: ${new Date().toLocaleDateString()}

📚 Reading Overview
-----------------
Total Books: ${data.books.length}
Completed Books: ${data.books.filter(b => b.status === 'completed').length}
Currently Reading: ${data.books.filter(b => b.status === 'reading').length}
Daily Goal: ${data.preferences?.dailyGoal || 0} minutes
Weekly Goal: ${data.preferences?.weeklyGoal || 0} books

📖 Reading History
----------------
${data.books.map(book => `
Title: ${book.title}
Author: ${book.author}
Status: ${book.status}
Progress: ${book.progress || 0}%
-------------------`).join('\n')}

🏆 Achievements
-------------
${data.achievements.map(achievement => `
${achievement.title}
${achievement.description}
Date: ${achievement.date || 'In Progress'}
-------------------`).join('\n')}

⚙️ Reading Preferences
-------------------
Font Size: ${settings.fontSize}
Font Family: ${settings.fontFamily}
Reading Mode: ${settings.readingMode ? 'Enabled' : 'Disabled'}
Profile Visibility: ${settings.privacy.profileVisibility}

📚 Genre Preferences
-----------------
${Object.entries(settings.preferences.genres)
  .map(([genre, enabled]) => `${genre.charAt(0).toUpperCase() + genre.slice(1)}: ${enabled ? '✓' : '✗'}`)
  .join('\n')}
`;

      // Create a blob with the formatted text
      const blob = new Blob([formattedData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `echoread-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report generated",
        description: "Your reading report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = () => {
    // Here you would typically make an API call to delete the account
    // For now, we'll just clear local storage and show a toast
    if (deletePassword.length < 6) {
      toast({
        title: "Error",
        description: "Please enter your current password to delete your account.",
        variant: "destructive"
      })
      return
    }

    // Clear all local storage
    localStorage.clear()

    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully. You will be redirected to the home page.",
      variant: "destructive"
    })

    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfilePic(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  // Return early if not mounted to avoid hydration mismatch
  if (!mounted) return null

  return (
    <div className="container py-6 pt-16 md:pt-10 space-y-8 max-w-7xl">
      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5 mb-6">
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="hidden md:flex">
            <Globe className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Picture</h3>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-200">
                      <Image 
                        src={profilePic} 
                        alt="Profile picture"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button 
                      className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Click the camera icon to upload a new profile picture
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={settings.name}
                      onChange={(e) => updateSettings(["name"], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={settings.username}
                      onChange={(e) => updateSettings(["username"], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={settings.email}
                      onChange={(e) => updateSettings(["email"], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reading-level">Reading Level</Label>
                    <Select 
                      value={settings.readingLevel}
                      onValueChange={(value) => updateSettings(["readingLevel"], value)}
                    >
                      <SelectTrigger id="reading-level">
                        <SelectValue placeholder="Select reading level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <RadioGroup value={theme} onValueChange={handleThemeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Font Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select 
                      value={settings.fontSize}
                      onValueChange={handleFontSizeChange}
                    >
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="base">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Preview text size</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select 
                      value={settings.fontFamily}
                      onValueChange={handleFontFamilyChange}
                    >
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="merriweather">Merriweather</SelectItem>
                        <SelectItem value="opensans">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Preview font family</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reading View</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reading-mode">Reading Mode</Label>
                    <Switch 
                      id="reading-mode"
                      checked={settings.readingMode}
                      onCheckedChange={(checked) => updateSettings(["readingMode"], checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable a distraction-free reading experience with optimized typography and layout.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setTheme("system")
                updateSettings(["fontSize"], "medium")
                updateSettings(["fontFamily"], "inter")
                updateSettings(["readingMode"], false)
              }}>
                Reset to Default
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reading-reminders">Reading Reminders</Label>
                    <Switch 
                      id="reading-reminders"
                      checked={settings.emailNotifications.readingReminders}
                      onCheckedChange={(checked) => 
                        updateSettings(["emailNotifications", "readingReminders"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Receive reminders when you haven't read in a while.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="goal-updates">Goal Updates</Label>
                    <Switch 
                      id="goal-updates"
                      checked={settings.emailNotifications.goalUpdates}
                      onCheckedChange={(checked) => 
                        updateSettings(["emailNotifications", "goalUpdates"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Get notified about your reading goal progress.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-quizzes">New Quizzes</Label>
                    <Switch 
                      id="new-quizzes"
                      checked={settings.emailNotifications.newQuizzes}
                      onCheckedChange={(checked) => 
                        updateSettings(["emailNotifications", "newQuizzes"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Be notified when new quizzes are available for your books.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                    <Switch 
                      id="achievement-alerts"
                      checked={settings.inAppNotifications.achievementAlerts}
                      onCheckedChange={(checked) => 
                        updateSettings(["inAppNotifications", "achievementAlerts"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Get notified when you earn new achievements.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-insights">AI Insights</Label>
                    <Switch 
                      id="ai-insights"
                      checked={settings.inAppNotifications.aiInsights}
                      onCheckedChange={(checked) => 
                        updateSettings(["inAppNotifications", "aiInsights"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Receive personalized reading insights from our AI.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                updateSettings(["emailNotifications"], {
                  readingReminders: false,
                  goalUpdates: false,
                  newQuizzes: false
                })
                updateSettings(["inAppNotifications"], {
                  achievementAlerts: false,
                  aiInsights: false
                })
              }}>
                Disable All
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy and data preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Collection</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reading-analytics">Reading Analytics</Label>
                    <Switch 
                      id="reading-analytics"
                      checked={settings.privacy.readingAnalytics}
                      onCheckedChange={(checked) => 
                        updateSettings(["privacy", "readingAnalytics"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow us to collect data about your reading habits to provide personalized insights.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="usage-data">Usage Data</Label>
                    <Switch 
                      id="usage-data"
                      checked={settings.privacy.usageData}
                      onCheckedChange={(checked) => 
                        updateSettings(["privacy", "usageData"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share anonymous usage data to help us improve the platform.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Privacy</h3>
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select 
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => updateSettings(["privacy", "profileVisibility"], value)}
                  >
                    <SelectTrigger id="profile-visibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-reading-activity">Show Reading Activity</Label>
                    <Switch 
                      id="show-reading-activity"
                      checked={settings.privacy.showReadingActivity}
                      onCheckedChange={(checked) => 
                        updateSettings(["privacy", "showReadingActivity"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow others to see your reading activity and progress.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2" 
                    onClick={handleDownloadData}
                  >
                    <Download className="h-4 w-4" />
                    Download My Data
                  </Button>

                  {!showDeleteConfirm ? (
                    <Button 
                      variant="destructive" 
                      className="w-full flex items-center gap-2"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-4 border rounded-lg p-4 bg-destructive/5">
                      <div className="space-y-2">
                        <Label htmlFor="delete-password" className="text-destructive">
                          Enter your password to confirm deletion
                        </Label>
                        <Input 
                          id="delete-password"
                          type="password"
                          placeholder="Current password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="border-destructive"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setShowDeleteConfirm(false)
                            setDeletePassword("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={handleDeleteAccount}
                        >
                          Confirm Delete
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                updateSettings(["privacy"], {
                  readingAnalytics: false,
                  usageData: false,
                  profileVisibility: "private",
                  showReadingActivity: false
                })
              }}>
                Maximum Privacy
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Reading Preferences</CardTitle>
              <CardDescription>Customize your reading experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reading Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily-goal">Daily Reading Goal (minutes)</Label>
                    <Input 
                      id="daily-goal" 
                      type="number" 
                      value={settings.preferences.dailyGoal}
                      onChange={(e) => updateSettings(["preferences", "dailyGoal"], parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weekly-goal">Weekly Book Goal</Label>
                    <Input 
                      id="weekly-goal" 
                      type="number" 
                      value={settings.preferences.weeklyGoal}
                      onChange={(e) => updateSettings(["preferences", "weeklyGoal"], parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Genre Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="fiction"
                      checked={settings.preferences.genres.fiction}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "genres", "fiction"], checked)
                      }
                    />
                    <Label htmlFor="fiction">Fiction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="non-fiction"
                      checked={settings.preferences.genres.nonFiction}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "genres", "nonFiction"], checked)
                      }
                    />
                    <Label htmlFor="non-fiction">Non-Fiction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sci-fi"
                      checked={settings.preferences.genres.sciFi}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "genres", "sciFi"], checked)
                      }
                    />
                    <Label htmlFor="sci-fi">Science Fiction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="fantasy"
                      checked={settings.preferences.genres.fantasy}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "genres", "fantasy"], checked)
                      }
                    />
                    <Label htmlFor="fantasy">Fantasy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="mystery"
                      checked={settings.preferences.genres.mystery}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "genres", "mystery"], checked)
                      }
                    />
                    <Label htmlFor="mystery">Mystery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="biography"
                      checked={settings.preferences.genres.biography}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "genres", "biography"], checked)
                      }
                    />
                    <Label htmlFor="biography">Biography</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">AI Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-recommendations">AI Book Recommendations</Label>
                    <Switch 
                      id="ai-recommendations"
                      checked={settings.preferences.aiFeatures.recommendations}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "aiFeatures", "recommendations"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow AI to recommend books based on your reading history.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ai-insights">AI Reading Insights</Label>
                    <Switch 
                      id="ai-insights"
                      checked={settings.preferences.aiFeatures.insights}
                      onCheckedChange={(checked) => 
                        updateSettings(["preferences", "aiFeatures", "insights"], checked)
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Enable AI-powered insights about your reading habits.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                updateSettings(["preferences"], {
                  dailyGoal: 30,
                  weeklyGoal: 1,
                  genres: {
                    fiction: true,
                    nonFiction: true,
                    sciFi: true,
                    fantasy: true,
                    mystery: false,
                    biography: false
                  },
                  aiFeatures: {
                    recommendations: true,
                    insights: true
                  }
                })
              }}>
                Reset to Default
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
