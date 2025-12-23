import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';

const mockData = [
  {
    id: '1',
    course: 'CS101 - Introduction to Programming',
    date: '2025-12-07',
    time: '09:00 AM',
    totalStudents: 45,
    present: 42,
    late: 2,
    absent: 1,
    rate: 93,
  },
  {
    id: '2',
    course: 'CS201 - Data Structures',
    date: '2025-12-07',
    time: '11:00 AM',
    totalStudents: 38,
    present: 35,
    late: 1,
    absent: 2,
    rate: 92,
  },
  {
    id: '3',
    course: 'CS101 - Introduction to Programming',
    date: '2025-12-06',
    time: '09:00 AM',
    totalStudents: 45,
    present: 40,
    late: 3,
    absent: 2,
    rate: 89,
  },
  {
    id: '4',
    course: 'CS301 - Algorithms',
    date: '2025-12-05',
    time: '14:00 PM',
    totalStudents: 32,
    present: 30,
    late: 1,
    absent: 1,
    rate: 94,
  },
];

export default function InstructorHistory() {
  const { userName } = useUser();
  const [filter, setFilter] = useState('All');

  const getRateColor = (rate) => {
    if (rate >= 90) return '#10B981';
    if (rate >= 75) return '#F59E0B';
    return '#EF4444';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recordCard}>
      <View style={styles.cardHeader}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseName}>{item.course}</Text>
          <View style={styles.dateTimeRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.dateText}>{item.date}</Text>
            <Ionicons name="time-outline" size={14} color="#6B7280" style={{ marginLeft: 12 }} />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
        <View
          style={[
            styles.rateBadge,
            { backgroundColor: getRateColor(item.rate) + '20' },
          ]}
        >
          <Text style={[styles.rateText, { color: getRateColor(item.rate) }]}>
            {item.rate}%
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{item.totalStudents}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Present</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {item.present}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Late</Text>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>
            {item.late}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Absent</Text>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>
            {item.absent}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewDetailsButton}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#5B7FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Class History</Text>
          <Text style={styles.headerSubtitle}>View your class attendance records</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsContainer}
        contentContainerStyle={styles.statsContent}
      >
        <View style={[styles.statCard, { borderLeftColor: '#5B7FFF' }]}>
          <Ionicons name="calendar" size={20} color="#5B7FFF" />
          <Text style={styles.statCardValue}>66</Text>
          <Text style={styles.statCardLabel}>Total Classes</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
          <Ionicons name="people" size={20} color="#10B981" />
          <Text style={styles.statCardValue}>1,234</Text>
          <Text style={styles.statCardLabel}>Total Students</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
          <Ionicons name="trending-up" size={20} color="#F59E0B" />
          <Text style={styles.statCardValue}>92%</Text>
          <Text style={styles.statCardLabel}>Avg Rate</Text>
        </View>
      </ScrollView>

      {/* Overall Rate Card */}
      <View style={styles.rateCard}>
        <LinearGradient
          colors={['#5B7FFF', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rateGradient}
        >
          <View style={styles.rateHeader}>
            <Text style={styles.rateTitle}>Overall Attendance Rate</Text>
            <View style={styles.rateValueBadge}>
              <Text style={styles.rateValueText}>92%</Text>
            </View>
          </View>
          <View style={styles.rateBar}>
            <View style={[styles.rateProgress, { width: '92%' }]} />
          </View>
          <Text style={styles.rateSubtitle}>This semester</Text>
        </LinearGradient>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['All', 'This Week', 'This Month'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterTab,
              filter === item && styles.filterTabActive,
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Records List */}
      <View style={styles.recordsHeader}>
        <Text style={styles.recordsTitle}>Class Records</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={20} color="#5B7FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  rateCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5B7FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rateGradient: {
    padding: 16,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  rateValueBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rateValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  rateBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  rateProgress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  rateSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#5B7FFF',
    borderColor: '#5B7FFF',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  recordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
    marginRight: 12,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  rateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B7FFF',
  },
});

