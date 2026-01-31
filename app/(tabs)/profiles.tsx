import { Stack } from 'expo-router';
import { Plus, Settings2, ChevronRight, Bell, Clock, Smartphone } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';

interface Device {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'watch' | 'desktop';
}

interface ReminderProfile {
  id: string;
  name: string;
  notifyBefore: number;
  snoozeDuration: number;
  notifyOn: 'all' | 'other';
  preferredDevices: string[];
  isCustom: boolean;
}

const MOCK_DEVICES: Device[] = [
  { id: 'device-1', name: 'iPhone 15 Pro', type: 'phone' },
  { id: 'device-2', name: 'iPad Air', type: 'tablet' },
  { id: 'device-3', name: 'Apple Watch', type: 'watch' },
  { id: 'device-4', name: 'MacBook Pro', type: 'desktop' },
  { id: 'device-5', name: 'iPhone 13', type: 'phone' },
];

const PRESET_PROFILES: ReminderProfile[] = [
  {
    id: 'important',
    name: 'Important',
    notifyBefore: 15,
    snoozeDuration: 5,
    notifyOn: 'all',
    preferredDevices: [],
    isCustom: false,
  },
  {
    id: 'moderate',
    name: 'Moderate',
    notifyBefore: 30,
    snoozeDuration: 10,
    notifyOn: 'all',
    preferredDevices: [],
    isCustom: false,
  },
  {
    id: 'low',
    name: 'Low',
    notifyBefore: 60,
    snoozeDuration: 15,
    notifyOn: 'other',
    preferredDevices: [],
    isCustom: false,
  },
];

export default function ProfilesScreen() {
  const [profiles, setProfiles] = useState<ReminderProfile[]>(PRESET_PROFILES);
  const [editingProfile, setEditingProfile] = useState<ReminderProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditProfile = (profile: ReminderProfile) => {
    setEditingProfile(profile);
    setModalVisible(true);
  };

  const handleCreateCustomProfile = () => {
    const newProfile: ReminderProfile = {
      id: `custom-${Date.now()}`,
      name: 'Custom Profile',
      notifyBefore: 30,
      snoozeDuration: 10,
      notifyOn: 'all',
      preferredDevices: [],
      isCustom: true,
    };
    setEditingProfile(newProfile);
    setModalVisible(true);
  };

  const toggleDevice = (deviceId: string) => {
    if (!editingProfile) return;
    const isSelected = editingProfile.preferredDevices.includes(deviceId);
    const updated = isSelected
      ? editingProfile.preferredDevices.filter(id => id !== deviceId)
      : [...editingProfile.preferredDevices, deviceId];
    setEditingProfile({ ...editingProfile, preferredDevices: updated });
  };

  const handleSaveProfile = () => {
    if (!editingProfile) return;

    const existingIndex = profiles.findIndex(p => p.id === editingProfile.id);
    if (existingIndex >= 0) {
      const updated = [...profiles];
      updated[existingIndex] = editingProfile;
      setProfiles(updated);
    } else {
      setProfiles([...profiles, editingProfile]);
    }

    setModalVisible(false);
    setEditingProfile(null);
  };

  const handleDeleteProfile = () => {
    if (!editingProfile || !editingProfile.isCustom) return;
    setProfiles(profiles.filter(p => p.id !== editingProfile.id));
    setModalVisible(false);
    setEditingProfile(null);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.title}>Reminder Profiles</Text>
        <Text style={styles.subtitle}>Customize notification settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preset Profiles</Text>
          {profiles
            .filter(p => !p.isCustom)
            .map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onPress={() => handleEditProfile(profile)}
              />
            ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Custom Profiles</Text>
            <Pressable
              style={styles.addButton}
              onPress={handleCreateCustomProfile}
            >
              <Plus size={20} color="#1F2937" strokeWidth={2} />
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>

          {profiles.filter(p => p.isCustom).length === 0 ? (
            <View style={styles.emptyState}>
              <Settings2 size={48} color="#D1D5DB" strokeWidth={1.5} />
              <Text style={styles.emptyText}>No custom profiles yet</Text>
              <Text style={styles.emptySubtext}>
                Tap "Add" to create your first custom profile
              </Text>
            </View>
          ) : (
            profiles
              .filter(p => p.isCustom)
              .map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onPress={() => handleEditProfile(profile)}
                />
              ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>
              {editingProfile?.isCustom ? 'Edit Profile' : 'Configure Profile'}
            </Text>
            <Pressable
              onPress={handleSaveProfile}
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveText}>Save</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {editingProfile?.isCustom && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Profile Name</Text>
                <TextInput
                  style={styles.input}
                  value={editingProfile.name}
                  onChangeText={text =>
                    setEditingProfile({ ...editingProfile, name: text })
                  }
                  placeholder="Enter profile name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Bell size={20} color="#6B7280" strokeWidth={2} />
                <Text style={styles.label}>Notify Before</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.numberInput}
                  value={editingProfile?.notifyBefore.toString()}
                  onChangeText={text =>
                    editingProfile &&
                    setEditingProfile({
                      ...editingProfile,
                      notifyBefore: parseInt(text) || 0,
                    })
                  }
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.unit}>minutes</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Clock size={20} color="#6B7280" strokeWidth={2} />
                <Text style={styles.label}>Snooze Duration</Text>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.numberInput}
                  value={editingProfile?.snoozeDuration.toString()}
                  onChangeText={text =>
                    editingProfile &&
                    setEditingProfile({
                      ...editingProfile,
                      snoozeDuration: parseInt(text) || 0,
                    })
                  }
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.unit}>minutes</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Smartphone size={20} color="#6B7280" strokeWidth={2} />
                <Text style={styles.label}>Notify On</Text>
              </View>
              <View style={styles.radioGroup}>
                <Pressable
                  style={[
                    styles.radioOption,
                    editingProfile?.notifyOn === 'all' && styles.radioOptionSelected,
                  ]}
                  onPress={() =>
                    editingProfile &&
                    setEditingProfile({ ...editingProfile, notifyOn: 'all' })
                  }
                >
                  <View style={styles.radio}>
                    {editingProfile?.notifyOn === 'all' && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.radioLabel}>All Devices</Text>
                    <Text style={styles.radioDescription}>
                      Notify on this and all synced devices
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  style={[
                    styles.radioOption,
                    editingProfile?.notifyOn === 'other' && styles.radioOptionSelected,
                  ]}
                  onPress={() =>
                    editingProfile &&
                    setEditingProfile({ ...editingProfile, notifyOn: 'other' })
                  }
                >
                  <View style={styles.radio}>
                    {editingProfile?.notifyOn === 'other' && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <View>
                    <Text style={styles.radioLabel}>Other Devices Only</Text>
                    <Text style={styles.radioDescription}>
                      Notify on other saved devices only
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Smartphone size={20} color="#6B7280" strokeWidth={2} />
                <Text style={styles.label}>Preferred Devices</Text>
              </View>
              <Text style={styles.helperText}>
                Select specific devices to receive notifications
              </Text>
              <View style={styles.deviceList}>
                {MOCK_DEVICES.map(device => {
                  const isSelected = editingProfile?.preferredDevices.includes(
                    device.id
                  );
                  return (
                    <Pressable
                      key={device.id}
                      style={[
                        styles.deviceOption,
                        isSelected && styles.deviceOptionSelected,
                      ]}
                      onPress={() => toggleDevice(device.id)}
                    >
                      <View style={styles.checkbox}>
                        {isSelected && <View style={styles.checkboxInner} />}
                      </View>
                      <Text style={styles.deviceName}>{device.name}</Text>
                      <Text style={styles.deviceType}>
                        {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {editingProfile?.isCustom && (
              <Pressable
                style={styles.deleteButton}
                onPress={handleDeleteProfile}
              >
                <Text style={styles.deleteButtonText}>Delete Profile</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

interface ProfileCardProps {
  profile: ReminderProfile;
  onPress: () => void;
}

function ProfileCard({ profile, onPress }: ProfileCardProps) {
  return (
    <Pressable style={styles.profileCard} onPress={onPress}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
      </View>
      <View style={styles.profileDetails}>
        <View style={styles.detailItem}>
          <Bell size={14} color="#6B7280" strokeWidth={2} />
          <Text style={styles.detailText}>{profile.notifyBefore} min before</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={14} color="#6B7280" strokeWidth={2} />
          <Text style={styles.detailText}>{profile.snoozeDuration} min snooze</Text>
        </View>
        <View style={styles.detailItem}>
          <Smartphone size={14} color="#6B7280" strokeWidth={2} />
          <Text style={styles.detailText}>
            {profile.notifyOn === 'all' ? 'All devices' : 'Other devices'}
            {profile.preferredDevices.length > 0 &&
              ` (${profile.preferredDevices.length} preferred)`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '300' as const,
    color: '#1F2937',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#9CA3AF',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#1F2937',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  profileDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    letterSpacing: 0.2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#6B7280',
    marginTop: 16,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center' as const,
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  modalCloseButton: {
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  modalSaveButton: {
    paddingVertical: 8,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#60A5FA',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formGroup: {
    marginBottom: 32,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#374151',
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FAFAFA',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FAFAFA',
  },
  unit: {
    fontSize: 15,
    color: '#6B7280',
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: '#FAFAFA',
  },
  radioOptionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#60A5FA',
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#1F2937',
    letterSpacing: 0.2,
  },
  radioDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  deleteButton: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#EF4444',
    textAlign: 'center' as const,
    letterSpacing: 0.3,
  },
  helperText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  deviceList: {
    gap: 10,
  },
  deviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: '#FAFAFA',
  },
  deviceOptionSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
  },
  deviceName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#1F2937',
    letterSpacing: 0.2,
  },
  deviceType: {
    fontSize: 12,
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
});
