import { Stack, useRouter } from 'expo-router';
import { Bell, Mic, ClipboardList, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Reminder {
  id: string;
  title: string;
  time: string;
  category?: string;
  hasVisitButton?: boolean;
  image?: string;
  accentColor: string;
  enabled: boolean;
}

const MOCK_REMINDERS: Reminder[] = [
  {
    id: '1',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ...',
    time: '9:00 AM',
    hasVisitButton: true,
    accentColor: '#60A5FA',
    enabled: true,
  },
  {
    id: '2',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    time: '9:00 AM',
    accentColor: '#60A5FA',
    enabled: true,
  },
  {
    id: '3',
    title: 'Water the plants',
    category: 'Home Guide',
    time: '10:00 AM',
    image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&q=80',
    accentColor: '#34D399',
    enabled: true,
  },
];

function LotusLogo() {
  const petals = [
    { color: '#A78BFA', rotation: 0 },
    { color: '#60A5FA', rotation: 45 },
    { color: '#34D399', rotation: 90 },
    { color: '#FCD34D', rotation: 135 },
    { color: '#F97316', rotation: 180 },
    { color: '#EF4444', rotation: 225 },
    { color: '#EC4899', rotation: 270 },
    { color: '#A78BFA', rotation: 315 },
  ];

  return (
    <View style={styles.logoContainer}>
      {petals.map((petal, index) => (
        <View
          key={index}
          style={[
            styles.logoPetal,
            {
              backgroundColor: petal.color,
              transform: [{ rotate: `${petal.rotation}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );
}

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
}

function ReminderCard({ reminder, onToggle }: ReminderCardProps) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.cardAccent,
          { backgroundColor: reminder.accentColor },
        ]}
      />
      
      <View style={styles.cardContent}>
        {reminder.image ? (
          <View style={styles.cardWithImage}>
            <View style={styles.cardTextSection}>
              <Text style={styles.cardTitle}>{reminder.title}</Text>
              {reminder.category && (
                <View style={styles.categoryBadge}>
                  <View style={styles.categoryCheck}>
                    <Text style={styles.categoryCheckmark}>✓</Text>
                  </View>
                  <Text style={styles.categoryText}>{reminder.category}</Text>
                </View>
              )}
              <View style={styles.timeRow}>
                <View style={styles.timeCheck}>
                  <Text style={styles.timeCheckmark}>✓</Text>
                </View>
                <Text style={styles.cardTime}>{reminder.time}</Text>
              </View>
            </View>
            <Image
              source={{ uri: reminder.image }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <>
            <Text style={styles.cardTitle}>{reminder.title}</Text>
            <View style={styles.cardActions}>
              <Text style={styles.cardTime}>{reminder.time}</Text>
              {reminder.hasVisitButton && (
                <Pressable style={styles.visitButton}>
                  <Text style={styles.visitButtonText}>VISIT</Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      </View>

      <Switch
        value={reminder.enabled}
        onValueChange={() => onToggle(reminder.id)}
        trackColor={{ false: '#D1D5DB', true: '#60A5FA' }}
        thumbColor="#FFFFFF"
        style={styles.cardSwitch}
      />
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState(MOCK_REMINDERS);

  const handleToggle = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LotusLogo />
            <Text style={styles.appName}>Smran</Text>
          </View>
          <Pressable style={styles.profileButton}>
            <User size={24} color="#1F2937" strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getGreeting()}, xyz</Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Start your day</Text>

          <View style={styles.remindersContainer}>
            {reminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={handleToggle}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navButton} onPress={() => {}}>
          <View style={[styles.navIcon, { backgroundColor: '#FCD34D' }]}>
            <Bell size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.navLabel}>New</Text>
        </Pressable>

        <Pressable style={styles.navButton} onPress={() => {}}>
          <View style={[styles.navIcon, { backgroundColor: '#60A5FA' }]}>
            <Mic size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.navLabel}>Voice Input</Text>
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={() => router.push('/profiles')}
        >
          <View style={[styles.navIcon, { backgroundColor: '#86EFAC' }]}>
            <ClipboardList size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.navLabel}>Manage</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPetal: {
    position: 'absolute',
    width: 18,
    height: 28,
    borderRadius: 14,
    top: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  greetingSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
  },
  mainContent: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  remindersContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 100,
  },
  cardAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  visitButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  visitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  cardSwitch: {
    alignSelf: 'center',
    marginRight: 16,
  },
  cardWithImage: {
    flexDirection: 'row',
    gap: 16,
  },
  cardTextSection: {
    flex: 1,
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryCheck: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCheckmark: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeCheck: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#86EFAC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCheckmark: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    gap: 8,
  },
  navIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
