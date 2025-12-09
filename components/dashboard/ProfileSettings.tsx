import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";

interface ProfileSettingsProps {
  user: any;
  setUser: (user: any) => void;
}

export default function ProfileSettings({ user, setUser }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    experience: user?.experience || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem("velric_user", JSON.stringify(updatedUser));
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-white/70">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:scale-105 transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Picture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10"
      >
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
              {formData.name.charAt(0).toUpperCase() || 'U'}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors" title="Change profile picture">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h4 className="font-medium text-white">{formData.name || 'User Name'}</h4>
            <p className="text-sm text-white/60">{formData.email}</p>
            {isEditing && (
              <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors mt-2">
                Upload new picture
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10"
      >
        <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-12 pr-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-12 pr-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-12 pr-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full pl-12 pr-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="Enter your location"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={4}
            className="w-full px-4 py-3 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#1C1C1E] p-6 rounded-2xl border border-white/10"
      >
        <h3 className="text-lg font-semibold mb-6">Skills</h3>
        
        {isEditing && (
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-4 py-2 bg-[#2A2A2E] border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Add a skill..."
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{skill}</span>
              {isEditing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-purple-400 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-white/60 text-sm">No skills added yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}