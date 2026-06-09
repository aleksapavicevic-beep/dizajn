// src/utils/textToSpeech.ts
// Utility za text-to-speech funkcionalnost

import * as Speech from 'expo-speech';

/**
 * Govori tekst na odabranom jeziku
 */
export async function speakText(
  text: string,
  language: string = 'hr-HR',
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }
): Promise<void> {
  try {
    // Provjera je li Speech dostupan
    const availableVoices = await Speech.getAvailableVoicesAsync();
    
    const voiceSettings = {
      language,
      rate: options?.rate || 0.8, // Spora brzina za lakšu razumevanje
      pitch: options?.pitch || 1.0,
      volume: options?.volume || 1.0,
    };

    await Speech.speak(text, voiceSettings);
  } catch (error) {
    console.error('Greška pri govoru:', error);
  }
}

/**
 * Zaustavi govor
 */
export async function stopSpeech(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Greška pri zaustavljanju govora:', error);
  }
}

/**
 * Govori podsjetnik
 */
export async function speakReminder(reminderText: string): Promise<void> {
  const fullText = `Podsjetnik: ${reminderText}`;
  await speakText(fullText, 'hr-HR', { rate: 0.8, pitch: 1.0 });
}

/**
 * Govori aktivnost
 */
export async function speakActivity(activityTitle: string, description: string): Promise<void> {
  const fullText = `${activityTitle}. ${description}`;
  await speakText(fullText, 'hr-HR', { rate: 0.9, pitch: 1.0 });
}
