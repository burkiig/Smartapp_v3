/**
 * excuse-submit.js
 *
 * Öğrencinin mazeret dilekçesi gönderdiği ekran.
 * Route params:
 *   course_id    : string | number  (zorunlu)
 *   session_date : string           ('YYYY-MM-DD', opsiyonel — bugün default)
 *   course_name  : string           (görüntülemek için, opsiyonel)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { excuses } from './shared/services/api';
import { useUser } from './context/UserContext';

const EXCUSE_TYPES = [
  { key: 'health',          label: 'Sağlık',          icon: '🏥', desc: 'Hastalık veya doktor raporu' },
  { key: 'family',          label: 'Aile',             icon: '👨‍👩‍👧', desc: 'Aile acil durumu' },
  { key: 'school_activity', label: 'Okul Etkinliği',   icon: '🎓', desc: 'Resmi okul etkinliği' },
  { key: 'transportation',  label: 'Ulaşım',           icon: '🚌', desc: 'Ulaşım sorunu' },
  { key: 'other',           label: 'Diğer',            icon: '📋', desc: 'Diğer nedenler' },
];

export default function ExcuseSubmitScreen() {
  const router = useRouter();
  const { userId } = useUser();
  const { course_id, session_date, course_name } = useLocalSearchParams();

  const today = new Date().toISOString().slice(0, 10);

  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(session_date || today);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = selectedType && description.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert('Eksik Bilgi', 'Lütfen mazeret türü seçin ve en az 10 karakter açıklama yazın.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await excuses.submit({
        studentId: userId,
        courseId: course_id,
        sessionDate: date,
        excuseType: selectedType,
        description: description.trim(),
      });

      if (result?.success) {
        Alert.alert(
          'Mazeret Gönderildi ✅',
          'Mazeretiniz öğretmene iletildi. Değerlendirme sonucu size bildirilecektir.',
          [{ text: 'Tamam', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Hata', result?.message || 'Mazeret gönderilemedi. Tekrar deneyin.');
      }
    } catch (err) {
      Alert.alert('Bağlantı Hatası', err?.message || 'Sunucuya bağlanılamadı.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mazeret Gönder</Text>
          <Text style={styles.headerSubtitle}>
            {course_name ? `${course_name}` : `Ders #${course_id}`}
          </Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          {/* Tarih */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📅 Devamsızlık Tarihi</Text>
            <View style={styles.dateBox}>
              <Ionicons name="calendar-outline" size={20} color="#6366F1" />
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>

          {/* Mazeret Türü */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📌 Mazeret Türü</Text>
            <View style={styles.typeGrid}>
              {EXCUSE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.typeCard,
                    selectedType === t.key && styles.typeCardSelected,
                  ]}
                  onPress={() => setSelectedType(t.key)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.typeIcon}>{t.icon}</Text>
                  <Text style={[styles.typeLabel, selectedType === t.key && styles.typeLabelSelected]}>
                    {t.label}
                  </Text>
                  <Text style={styles.typeDesc}>{t.desc}</Text>
                  {selectedType === t.key && (
                    <View style={styles.typeCheckmark}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Açıklama */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>✏️ Açıklama</Text>
            <TextInput
              style={styles.descInput}
              multiline
              numberOfLines={5}
              placeholder="Mazeret nedeninizi detaylı açıklayın... (en az 10 karakter)"
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {description.length} karakter {description.length < 10 ? `(en az 10)` : '✓'}
            </Text>
          </View>

          {/* Belge notu */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color="#6366F1" />
            <Text style={styles.infoText}>
              Doktor raporu veya diğer belgelerinizi öğretmeninize fiziksel olarak iletebilirsiniz.
            </Text>
          </View>

          {/* Gönder */}
          <TouchableOpacity
            style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>Mazeret Gönder</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.bottomPad} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F8FAFC' },
  flex:       { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 14,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerContent: { flex: 1 },
  headerTitle:   { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSubtitle:{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  content: { flex: 1, paddingHorizontal: 20 },

  section: { marginTop: 24 },
  sectionLabel: {
    fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 10,
    letterSpacing: 0.3,
  },

  dateBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  dateText: { fontSize: 16, fontWeight: '600', color: '#1E293B' },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 14,
    padding: 14, borderWidth: 2, borderColor: '#E2E8F0',
    alignItems: 'center', gap: 4, position: 'relative',
  },
  typeCardSelected: { borderColor: '#6366F1', backgroundColor: '#EEF2FF' },
  typeIcon:  { fontSize: 26 },
  typeLabel: { fontSize: 13, fontWeight: '600', color: '#475569', textAlign: 'center' },
  typeLabelSelected: { color: '#4F46E5' },
  typeDesc:  { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 15 },
  typeCheckmark: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#6366F1', borderRadius: 10,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },

  descInput: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
    fontSize: 15, color: '#1E293B', minHeight: 120,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  charCount: {
    marginTop: 6, fontSize: 12, color: '#94A3B8', textAlign: 'right',
  },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#EEF2FF', borderRadius: 12, padding: 14,
    marginTop: 20, borderWidth: 1, borderColor: '#C7D2FE',
  },
  infoText: { flex: 1, fontSize: 13, color: '#4F46E5', lineHeight: 18 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#6366F1', borderRadius: 16,
    paddingVertical: 16, marginTop: 24,
    shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  submitBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  bottomPad: { height: 40 },
});
