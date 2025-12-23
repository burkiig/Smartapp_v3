import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function InstructorHome() {
  const { userName } = useUser();
  const [stats, setStats] = useState({
    totalClasses: 66,
    avgAttendance: 92,
    autoAttendance: 95,
    manualReviews: 30
  });

  const [todaySchedule] = useState([
    {
      id: 1,
      course: 'CS101',
      title: 'Introduction to Programming',
      time: '09:00 - 10:30',
      room: 'Room 401',
      status: 'completed',
      attendance: '42/45'
    },
    {
      id: 2,
      course: 'CS201',
      title: 'Data Structures',
      time: '14:00 - 15:30',
      room: 'Lab 204',
      status: 'in-progress',
      attendance: '28/38'
    },
    {
      id: 3,
      course: 'CS301',
      title: 'Algorithms',
      time: '16:00 - 17:30',
      room: 'Room 405',
      status: 'upcoming',
      attendance: '0/32'
    }
  ]);

  const [flaggedAttendance, setFlaggedAttendance] = useState([
    {
      id: 1,
      student: 'Sarah Johnson',
      studentId: 'STU12345',
      course: 'CS101',
      timestamp: '2025-12-07 09:05',
      reason: 'Face verification failed',
      method: 'FACE',
      location: '95%'
    },
    {
      id: 2,
      student: 'Michael Chen',
      studentId: 'STU12346',
      course: 'CS201',
      timestamp: '2025-12-07 14:12',
      reason: 'GPS unstable',
      method: 'QR',
      location: '62%'
    },
    {
      id: 3,
      student: 'Emma Davis',
      studentId: 'STU12347',
      course: 'CS101',
      timestamp: '2025-12-07 09:08',
      reason: 'Device integrity warning',
      method: 'FACE + QR',
      location: '88%'
    }
  ]);

  const renderFlaggedItem = ({ item }) => (
    <View style={styles.flaggedCard}>
      <View style={styles.flaggedHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.student.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <View>
            <Text style={styles.studentName}>{item.student}</Text>
            <Text style={styles.studentId}>{item.studentId}</Text>
          </View>
        </View>
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingText}>Pending</Text>
        </View>
      </View>

      <View style={styles.flaggedDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="book-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.course}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.timestamp}</Text>
        </View>
      </View>

      <View style={styles.reasonContainer}>
        <View style={[styles.reasonBadge, { backgroundColor: '#FEE2E2' }]}>
          <Text style={[styles.reasonText, { color: '#DC2626' }]}>{item.reason}</Text>
        </View>
      </View>

      <View style={styles.flaggedFooter}>
        <View style={styles.methodBadge}>
          <Text style={styles.methodText}>{item.method}</Text>
        </View>
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={14} color="#10B981" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.approveButton}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton}>
          <Ionicons name="close-circle" size={20} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton}>
          <Ionicons name="eye-outline" size={20} color="#5B7FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Attendance System</Text>
            <Text style={styles.headerSubtitle}>Instructor Panel</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Classes</Text>
            <Text style={styles.statValue}>{stats.totalClasses}</Text>
            <View style={styles.statChange}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={styles.changeText}>+8% from last month</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Attendance</Text>
            <Text style={styles.statValue}>{stats.avgAttendance}%</Text>
            <View style={styles.statChange}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={styles.changeText}>+2% from last month</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Auto Attendance</Text>
            <Text style={styles.statValue}>{stats.autoAttendance}%</Text>
            <Text style={styles.statFooter}>Face ID + QR</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Manual Reviews</Text>
            <Text style={styles.statValue}>{stats.manualReviews}</Text>
            <Text style={styles.statFooter}>This month</Text>
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {todaySchedule.map((item) => (
            <TouchableOpacity key={item.id} style={styles.scheduleCard}>
              <View style={styles.scheduleLeft}>
                <View style={[
                  styles.scheduleStatus,
                  { backgroundColor: 
                    item.status === 'completed' ? '#D1FAE5' :
                    item.status === 'in-progress' ? '#FEF3C7' : '#EEF2FF'
                  }
                ]}>
                  <Ionicons 
                    name={
                      item.status === 'completed' ? 'checkmark-circle' :
                      item.status === 'in-progress' ? 'time' : 'calendar'
                    }
                    size={20} 
                    color={
                      item.status === 'completed' ? '#10B981' :
                      item.status === 'in-progress' ? '#F59E0B' : '#5B7FFF'
                    }
                  />
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTitle}>{item.course} - {item.title}</Text>
                  <View style={styles.scheduleDetails}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.scheduleTime}>{item.time}</Text>
                    <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginLeft: 12 }} />
                    <Text style={styles.scheduleRoom}>{item.room}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.scheduleRight}>
                <Text style={styles.attendanceCount}>{item.attendance}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.filterHeader}>
            <Ionicons name="filter" size={18} color="#1F2937" />
            <Text style={styles.filterTitle}>Filters</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>This Month ▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>All Courses ▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>All Methods ▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text style={styles.exportButtonText}>Export</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Flagged Attendance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Flagged Attendance</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>3</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={flaggedAttendance}
            renderItem={renderFlaggedItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#5B7FFF', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Ionicons name="calendar" size={28} color="#fff" />
                <Text style={styles.actionTitle}>Weekly Schedule</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Ionicons name="document-text" size={28} color="#fff" />
                <Text style={styles.actionTitle}>Reports</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  statFooter: {
    fontSize: 12,
    color: '#6B7280',
  },
  filtersSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#5B7FFF',
  },
  exportButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  countBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  viewAllText: {
    fontSize: 14,
    color: '#5B7FFF',
    fontWeight: '600',
  },
  flaggedCard: {
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
  flaggedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B7FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  studentId: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  flaggedDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  reasonContainer: {
    marginBottom: 12,
  },
  reasonBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  flaggedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  methodBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  detailsButton: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  scheduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  scheduleStatus: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  scheduleRoom: {
    fontSize: 12,
    color: '#6B7280',
  },
  scheduleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attendanceCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B7FFF',
  },
});


