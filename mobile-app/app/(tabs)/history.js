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
import InstructorHistory from '../screens/InstructorHistory';

const mockData = [
  {
    id: '1',
    date: '2025-11-30',
    time: '09:00 AM',
    location: 'Main Building',
    status: 'Present',
    method: 'Face ID',
  },
  {
    id: '2',
    date: '2025-11-29',
    time: '09:15 AM',
    location: 'Main Building',
    status: 'Late',
    method: 'QR Code',
  },
  {
    id: '3',
    date: '2025-11-28',
    time: '08:55 AM',
    location: 'Main Building',
    status: 'Present',
    method: 'Face ID',
  },
  {
    id: '4',
    date: '2025-11-27',
    time: '09:05 AM',
    location: 'Main Building',
    status: 'Present',
    method: 'QR Code',
  },
  {
    id: '5',
    date: '2025-11-26',
    time: '08:30 AM',
    location: 'Main Building',
    status: 'Late',
    method: 'Face ID',
  },
];

export default function HistoryScreen() {
  const { userType } = useUser();
  const [filter, setFilter] = useState('All');

  // Instructor için ayrı ekran göster
  if (userType === 'instructor') {
    return <InstructorHistory />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return '#10B981';
      case 'Late':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return 'checkmark-circle';
      case 'Late':
        return 'time';
      default:
        return 'close-circle';
    }
  };

  const getMethodIcon = (method) => {
    return method === 'Face ID' ? 'scan' : 'qr-code';
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordLeft}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateDay}>
            {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric' })}
          </Text>
          <Text style={styles.dateMonth}>
            {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
          </Text>
        </View>
      </View>

      <View style={styles.recordCenter}>
        <View style={styles.recordHeader}>
          <Ionicons
            name={getMethodIcon(item.method)}
            size={18}
            color="#5B7FFF"
          />
          <Text style={styles.recordTime}>{item.time}</Text>
        </View>
        <Text style={styles.recordLocation}>
          <Ionicons name="location" size={14} color="#9CA3AF" />
          {' ' + item.location}
        </Text>
      </View>

      <View style={styles.recordRight}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status)}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Attendance History</Text>
          <Text style={styles.headerSubtitle}>View your attendance records</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color="#5B7FFF" />
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
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
          <Ionicons name="time" size={20} color="#F59E0B" />
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>
      </ScrollView>

      {/* Attendance Rate */}
      <View style={styles.rateCard}>
        <LinearGradient
          colors={['#5B7FFF', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rateGradient}
        >
          <View style={styles.rateHeader}>
            <Text style={styles.rateTitle}>Overall Attendance Rate</Text>
            <View style={styles.rateBadge}>
              <Text style={styles.rateBadgeText}>100%</Text>
            </View>
          </View>
          <View style={styles.rateBar}>
            <View style={[styles.rateProgress, { width: '100%' }]} />
          </View>
        </LinearGradient>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['All', 'Present', 'Late'].map((item) => (
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
        <Text style={styles.recordsTitle}>Records</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={20} color="#5B7FFF" />
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
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
    minWidth: 100,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
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
  rateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rateBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  rateBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rateProgress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 20,
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
    fontSize: 14,
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordLeft: {
    marginRight: 16,
  },
  dateContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B7FFF',
    borderRadius: 12,
    padding: 8,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateMonth: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
  recordCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  recordLocation: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recordRight: {
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
