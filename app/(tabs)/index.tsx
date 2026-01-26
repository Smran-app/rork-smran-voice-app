import { Audio } from 'expo-av';
import { Stack } from 'expo-router';
import { Mic } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LOTUS_COLORS = [
  '#A78BFA',
  '#EC4899',
  '#EF4444',
  '#F97316',
  '#FCD34D',
  '#86EFAC',
  '#60A5FA',
  '#38BDF8',
];

interface LotusPetalProps {
  color: string;
  rotation: number;
  isRecording: boolean;
  index: number;
}

function LotusPetal({ color, rotation, isRecording, index }: LotusPetalProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.3,
              duration: 800 + index * 50,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.95,
              duration: 800 + index * 50,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.9,
              duration: 800 + index * 50,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 800 + index * 50,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRecording, scaleAnim, opacityAnim, index]);

  return (
    <Animated.View
      style={[
        styles.petal,
        {
          backgroundColor: color,
          transform: [
            { rotate: `${rotation}deg` },
            { scale: scaleAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    />
  );
}

export default function VoiceInputScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isRecording, glowAnim]);

  const startRecording = useCallback(async () => {
    try {
      console.log('Requesting permissions..');
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status !== 'granted') {
        console.log('Permission to access microphone was denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
      setTranscript('Listening...');

      Animated.spring(buttonScaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
      }).start();

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }, [buttonScaleAnim]);

  const stopRecording = useCallback(async () => {
    console.log('Stopping recording..');
    if (!recording) return;

    setIsRecording(false);
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    setRecording(null);
    setTranscript('Voice input captured!');

    setTimeout(() => {
      setTranscript('');
    }, 2000);
  }, [recording, buttonScaleAnim]);

  const handlePress = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.appName}>Smran</Text>
        <Text style={styles.subtitle}>Voice Reminder Assistant</Text>
      </View>

      <View style={styles.lotusContainer}>
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {LOTUS_COLORS.map((color, index) => (
          <LotusPetal
            key={index}
            color={color}
            rotation={(360 / LOTUS_COLORS.length) * index}
            isRecording={isRecording}
            index={index}
          />
        ))}
      </View>

      <View style={styles.bottomSection}>
        <Animated.View
          style={[
            styles.centerCircle,
            {
              transform: [{ scale: buttonScaleAnim }],
            },
          ]}
        >
          <Pressable
            style={styles.micButton}
            onPress={handlePress}
            onPressIn={() => {
              Animated.spring(buttonScaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
              }).start();
            }}
            onPressOut={() => {
              if (!isRecording) {
                Animated.spring(buttonScaleAnim, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              }
            }}
          >
            <Mic
              size={40}
              color={isRecording ? '#EF4444' : '#1F2937'}
              strokeWidth={2}
            />
          </Pressable>
        </Animated.View>

        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcript}>{transcript}</Text>
          </View>
        ) : (
          <Text style={styles.hint}>
            {isRecording ? 'Tap to stop' : 'Tap to speak'}
          </Text>
        )}
      </View>
    </View>
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
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 48,
    fontWeight: '300' as const,
    color: '#1F2937',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  lotusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  },
  petal: {
    position: 'absolute' as const,
    width: 140,
    height: 220,
    borderRadius: 100,
    top: '50%',
    left: '50%',
    marginLeft: -70,
    marginTop: -180,
  },
  glow: {
    position: 'absolute' as const,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#60A5FA',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 100,
  },
  centerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    marginBottom: 24,
  },
  micButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  hint: {
    fontSize: 16,
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  transcriptContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    maxWidth: width - 48,
  },
  transcript: {
    fontSize: 18,
    color: '#1F2937',
    textAlign: 'center' as const,
    letterSpacing: 0.5,
  },
});
