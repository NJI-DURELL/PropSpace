import { useState, useEffect } from 'react';
import api from '../api/axios';
import InputField from '../components/InputField';

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', phone: '', avatar: '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (!cancelled) {
          setProfile({
            name: res.data.name || '',
            phone: res.data.phone || '',
            avatar: res.data.avatar || '',
          });
        }
      } catch {
        if (!cancelled) setLoadError('Failed to load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg('');
    try {
      await api.put('/users/profile', profile);
      setProfileMsg('Profile updated successfully.');
    } catch {
      setProfileMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!pwForm.oldPassword || !pwForm.newPassword) {
      setPwMsg('Both fields are required.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg('New password must be at least 6 characters.');
      return;
    }
    setChangingPw(true);
    setPwMsg('');
    try {
      await api.put('/users/password', pwForm);
      setPwMsg('Password changed successfully.');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (loadError) return <p className="text-center text-red-500 mt-10">{loadError}</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Settings</h2>
        {profileMsg && <p className="text-sm text-blue-600 mb-3">{profileMsg}</p>}
        <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
          <InputField
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            placeholder="John Doe"
          />
          <InputField
            label="Phone"
            value={profile.phone}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+1 234 567 8900"
          />
          <InputField
            label="Avatar URL"
            value={profile.avatar}
            onChange={(e) => setProfile((p) => ({ ...p, avatar: e.target.value }))}
            placeholder="https://..."
          />
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="avatar preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
        {pwMsg && <p className="text-sm text-blue-600 mb-3">{pwMsg}</p>}
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <InputField
            label="Current Password"
            type="password"
            value={pwForm.oldPassword}
            onChange={(e) => setPwForm((p) => ({ ...p, oldPassword: e.target.value }))}
            placeholder="••••••••"
          />
          <InputField
            label="New Password"
            type="password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
            placeholder="Min. 6 characters"
          />
          <button
            type="submit"
            disabled={changingPw}
            className="bg-gray-800 text-white rounded py-2 font-semibold hover:bg-gray-900 disabled:opacity-50"
          >
            {changingPw ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
