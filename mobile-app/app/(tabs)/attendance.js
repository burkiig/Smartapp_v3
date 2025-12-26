import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function AttendanceScreen() {
  const { userType } = useUser();

  // Student ise profil göster
  if (userType === 'student') {
    const StudentProfile = require('./profile').default;
    return <StudentProfile />;
  }

  // Active tab state
  const [activeTab, setActiveTab] = useState('all');

  const [flaggedAttendance, setFlaggedAttendance] = useState([
    {
      id: 1,
      student: 'Sarah Johnson',
      studentId: 'STU12345',
      course: 'CS101',
      timestamp: '2025-12-07 09:05',
      reason: 'Face verification failed',
      method: 'FACE',
      location: '95%',
      status: 'pending'
    },
    {
      id: 2,
      student: 'Michael Chen',
      studentId: 'STU12346',
      course: 'CS201',
      timestamp: '2025-12-07 14:12',
      reason: 'GPS unstable',
      method: 'QR',
      location: '62%',
      status: 'pending'
    },
    {
      id: 3,
      student: 'Emma Davis',
      studentId: 'STU12347',
      course: 'CS101',
      timestamp: '2025-12-07 09:08',
      reason: 'Device integrity warning',
      method: 'FACE + QR',
      location: '88%',
      status: 'pending'
    },
    {
      id: 4,
      student: 'David Wilson',
      studentId: 'STU12348',
      course: 'CS201',
      timestamp: '2025-12-07 14:15',
      reason: 'Location mismatch',
      method: 'QR',
      location: '45%',
      status: 'pending'
    },
  ]);

  // Excuse records state
  const [excuseRecords, setExcuseRecords] = useState([
    {
      id: 1,
      student: 'John Doe',
      studentId: 'STU12349',
      course: 'CS101',
      courseTitle: 'Introduction to Programming',
      classDate: '2025-12-05',
      excuseType: 'medical',
      excuseTypeLabel: 'Medical',
      submittedAt: '2025-12-06 10:30',
      status: 'pending',
      document: 'medical_certificate.pdf',
      reason: 'Had a doctor appointment'
    },
    {
      id: 2,
      student: 'Jane Smith',
      studentId: 'STU12350',
      course: 'CS201',
      courseTitle: 'Data Structures',
      classDate: '2025-12-04',
      excuseType: 'family',
      excuseTypeLabel: 'Family Emergency',
      submittedAt: '2025-12-05 14:20',
      status: 'pending',
      reason: 'Family emergency'
    },
    {
      id: 3,
      student: 'Alex Johnson',
      studentId: 'STU12351',
      course: 'CS301',
      courseTitle: 'Algorithms',
      classDate: '2025-12-03',
      excuseType: 'medical',
      excuseTypeLabel: 'Medical',
      submittedAt: '2025-12-04 09:15',
      status: 'approved',
      document: 'doctor_note.pdf',
      reason: 'Flu symptoms, doctor advised rest'
    },
    {
      id: 4,
      student: 'Maria Garcia',
      studentId: 'STU12352',
      course: 'CS101',
      courseTitle: 'Introduction to Programming',
      classDate: '2025-12-02',
      excuseType: 'other',
      excuseTypeLabel: 'Other',
      submittedAt: '2025-12-03 16:45',
      status: 'rejected',
      reason: 'Car trouble on the way to class'
    }
  ]);

  const handleApprove = (id) => {
    setFlaggedAttendance(prev =>
      prev.map(record =>
        record.id === id ? { ...record, status: 'approved' } : record
      )
    );
  };

  const handleReject = (id) => {
    setFlaggedAttendance(prev =>
      prev.map(record =>
        record.id === id ? { ...record, status: 'rejected' } : record
      )
    );
  };

  const handleUndo = (id) => {
    setFlaggedAttendance(prev =>
      prev.map(record =>
        record.id === id ? { ...record, status: 'pending' } : record
      )
    );
  };

  const handleExcuseApprove = (id) => {
    setExcuseRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, status: 'approved' } : record
      )
    );
  };

  const handleExcuseReject = (id) => {
    setExcuseRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, status: 'rejected' } : record
      )
    );
  };

  const handleExcuseUndo = (id) => {
    setExcuseRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, status: 'pending' } : record
      )
    );
  };

  const handleViewDetails = (id) => {
    console.log('View details:', id);
  };

  // Filtreleme fonksiyonu
  const getFilteredRecords = () => {
    if (activeTab === 'excuses') {
      return excuseRecords;
    }
    
    if (activeTab === 'all') {
      return flaggedAttendance;
    }
    
    return flaggedAttendance.filter(record => record.status === activeTab);
  };

  // Tab sayılarını hesaplayan fonksiyon
  const getTabCounts = () => {
    return {
      all: flaggedAttendance.length,
      pending: flaggedAttendance.filter(r => r.status === 'pending').length,
      approved: flaggedAttendance.filter(r => r.status === 'approved').length,
      rejected: flaggedAttendance.filter(r => r.status === 'rejected').length,
      excuses: excuseRecords.length
    };
  };

  const tabCounts = getTabCounts();
  const filteredRecords = getFilteredRecords();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { text: 'Approved', color: '#10B981', bgColor: '#D1FAE5' };
      case 'rejected':
        return { text: 'Rejected', color: '#EF4444', bgColor: '#FEE2E2' };
      default:
        return { text: 'Pending', color: '#92400E', bgColor: '#FEF3C7' };
    }
  };

  const renderFlaggedItem = ({ item }) => {
    const statusBadge = getStatusBadge(item.status);
    
    return (
      <View style={styles.flaggedCard}>
        <View style={styles.flaggedHeader}>
          <View style={styles.studentInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.student.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View>
              <Text style={styles.studentName}>{item.student}</Text>
              <Text style={styles.studentId}>{item.studentId}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.bgColor }]}>
            <Text style={[styles.statusText, { color: statusBadge.color }]}>{statusBadge.text}</Text>
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
          <View style={styles.reasonBadge}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.reasonText}>{item.reason}</Text>
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
          {item.status === 'pending' ? (
            <>
              <TouchableOpacity 
                style={styles.approveButton}
                onPress={() => handleApprove(item.id)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.rejectButton}
                onPress={() => handleReject(item.id)}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.undoButton}
              onPress={() => handleUndo(item.id)}
            >
              <Ionicons name="arrow-undo" size={20} color="#5B7FFF" />
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => handleViewDetails(item.id)}
          >
            <Ionicons name="eye-outline" size={20} color="#5B7FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Excuse item render fonksiyonu
  const renderExcuseItem = ({ item }) => {
    const statusBadge = getStatusBadge(item.status);
    
    return (
      <View style={styles.flaggedCard}>
        <View style={styles.flaggedHeader}>
          <View style={styles.studentInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.student.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View>
              <Text style={styles.studentName}>{item.student}</Text>
              <Text style={styles.studentId}>{item.studentId}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.bgColor }]}>
            <Text style={[styles.statusText, { color: statusBadge.color }]}>{statusBadge.text}</Text>
          </View>
        </View>

        <View style={styles.flaggedDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="book-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.course} - {item.courseTitle}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>Class: {item.classDate}</Text>
          </View>
        </View>

        <View style={styles.excuseInfo}>
          <View style={styles.methodBadge}>
            <Text style={styles.methodText}>{item.excuseTypeLabel}</Text>
          </View>
          <Text style={styles.excuseReason}>{item.reason}</Text>
          {item.document && (
            <View style={styles.documentBadge}>
              <Ionicons name="document-attach" size={14} color="#5B7FFF" />
              <Text style={styles.documentText}>{item.document}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          {item.status === 'pending' ? (
            <>
              <TouchableOpacity 
                style={styles.approveButton}
                onPress={() => handleExcuseApprove(item.id)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.rejectButton}
                onPress={() => handleExcuseReject(item.id)}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.undoButton}
                onPress={() => handleExcuseUndo(item.id)}
              >
                <Ionicons name="arrow-undo" size={20} color="#5B7FFF" />
                <Text style={styles.undoButtonText}>Undo</Text>
              </TouchableOpacity>
              <View style={styles.statusInfoCompact}>
                <Text style={styles.statusInfoTextCompact}>
                  {item.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Flagged Attendance</Text>
          <Text style={styles.headerSubtitle}>Records awaiting manual approval</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{tabCounts.pending}</Text>
        </View>
      </View>

      {/* Tab Filters - Modern Segmented Control */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          <View style={styles.segmentedControl}>
            <TouchableOpacity 
              style={[
                styles.tabSegment, 
                activeTab === 'all' && styles.tabSegmentActive
              ]}
              onPress={() => setActiveTab('all')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Text style={[
                  styles.tabLabel, 
                  activeTab === 'all' && styles.tabLabelActive
                ]}>
                  All
                </Text>
                <View style={[
                  styles.tabBadge,
                  activeTab === 'all' && styles.tabBadgeActive
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    activeTab === 'all' && styles.tabBadgeTextActive
                  ]}>
                    {tabCounts.all}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabSegment, 
                styles.tabSegmentPending,
                activeTab === 'pending' && styles.tabSegmentActivePending
              ]}
              onPress={() => setActiveTab('pending')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <View style={styles.tabLabelWithIcon}>
                  {activeTab === 'pending' && (
                    <Ionicons name="time" size={16} color="#fff" style={styles.tabIcon} />
                  )}
                  <Text style={[
                    styles.tabLabel,
                    styles.tabLabelPending,
                    activeTab === 'pending' && styles.tabLabelActivePending
                  ]}>
                    Pending
                  </Text>
                </View>
                <View style={[
                  styles.tabBadge,
                  styles.tabBadgePending,
                  activeTab === 'pending' && styles.tabBadgeActivePending
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    activeTab === 'pending' && styles.tabBadgeTextActivePending
                  ]}>
                    {tabCounts.pending}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabSegment, 
                activeTab === 'approved' && styles.tabSegmentActiveApproved
              ]}
              onPress={() => setActiveTab('approved')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <View style={styles.tabLabelWithIcon}>
                  {activeTab === 'approved' && (
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" style={styles.tabIcon} />
                  )}
                  <Text style={[
                    styles.tabLabel, 
                    activeTab === 'approved' && styles.tabLabelActiveApproved
                  ]}>
                    Approved
                  </Text>
                </View>
                <View style={[
                  styles.tabBadge,
                  activeTab === 'approved' && styles.tabBadgeActiveApproved
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    activeTab === 'approved' && styles.tabBadgeTextActiveApproved
                  ]}>
                    {tabCounts.approved}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabSegment, 
                activeTab === 'rejected' && styles.tabSegmentActiveRejected
              ]}
              onPress={() => setActiveTab('rejected')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <View style={styles.tabLabelWithIcon}>
                  {activeTab === 'rejected' && (
                    <Ionicons name="close-circle" size={16} color="#EF4444" style={styles.tabIcon} />
                  )}
                  <Text style={[
                    styles.tabLabel, 
                    activeTab === 'rejected' && styles.tabLabelActiveRejected
                  ]}>
                    Rejected
                  </Text>
                </View>
                <View style={[
                  styles.tabBadge,
                  activeTab === 'rejected' && styles.tabBadgeActiveRejected
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    activeTab === 'rejected' && styles.tabBadgeTextActiveRejected
                  ]}>
                    {tabCounts.rejected}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabSegment, 
                activeTab === 'excuses' && styles.tabSegmentActiveExcuses
              ]}
              onPress={() => setActiveTab('excuses')}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <View style={styles.tabLabelWithIcon}>
                  {activeTab === 'excuses' && (
                    <Ionicons name="document-text" size={16} color="#8B5CF6" style={styles.tabIcon} />
                  )}
                  <Text style={[
                    styles.tabLabel, 
                    activeTab === 'excuses' && styles.tabLabelActiveExcuses
                  ]}>
                    Excuses
                  </Text>
                </View>
                <View style={[
                  styles.tabBadge,
                  activeTab === 'excuses' && styles.tabBadgeActiveExcuses
                ]}>
                  <Text style={[
                    styles.tabBadgeText,
                    activeTab === 'excuses' && styles.tabBadgeTextActiveExcuses
                  ]}>
                    {tabCounts.excuses}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Flagged List */}
      <FlatList
        data={filteredRecords}
        renderItem={activeTab === 'excuses' ? renderExcuseItem : renderFlaggedItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No records found</Text>
          </View>
        }
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
  countBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  // Modern Tab Styles - Segmented Control
  tabsWrapper: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabsScrollContent: {
    paddingRight: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tabSegment: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
    minWidth: 100,
  },
  tabSegmentActive: {
    backgroundColor: '#5B7FFF',
    shadowColor: '#5B7FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  // Pending Tab - Special Emphasis
  tabSegmentPending: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tabSegmentActivePending: {
    backgroundColor: '#F59E0B',
    borderWidth: 0,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    transform: [{ scale: 1.02 }],
  },
  // Approved Tab
  tabSegmentActiveApproved: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  // Rejected Tab
  tabSegmentActiveRejected: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  // Excuses Tab
  tabSegmentActiveExcuses: {
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tabLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabIcon: {
    marginRight: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  // Pending Label
  tabLabelPending: {
    color: '#92400E',
    fontWeight: '700',
  },
  tabLabelActivePending: {
    color: '#fff',
    fontSize: 15,
  },
  // Approved Label
  tabLabelActiveApproved: {
    color: '#047857',
    fontWeight: '700',
  },
  // Rejected Label
  tabLabelActiveRejected: {
    color: '#DC2626',
    fontWeight: '700',
  },
  // Excuses Label
  tabLabelActiveExcuses: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Pending Badge
  tabBadgePending: {
    backgroundColor: '#FDE68A',
  },
  tabBadgeActivePending: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  // Approved Badge
  tabBadgeActiveApproved: {
    backgroundColor: '#A7F3D0',
  },
  // Rejected Badge
  tabBadgeActiveRejected: {
    backgroundColor: '#FECACA',
  },
  // Excuses Badge
  tabBadgeActiveExcuses: {
    backgroundColor: '#DDD6FE',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  tabBadgeTextActive: {
    color: '#fff',
  },
  // Pending Badge Text
  tabBadgeTextActivePending: {
    color: '#fff',
    fontSize: 13,
  },
  // Approved Badge Text
  tabBadgeTextActiveApproved: {
    color: '#047857',
  },
  // Rejected Badge Text
  tabBadgeTextActiveRejected: {
    color: '#DC2626',
  },
  // Excuses Badge Text
  tabBadgeTextActiveExcuses: {
    color: '#7C3AED',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    borderColor: '#FEE2E2',
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    alignSelf: 'flex-start',
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
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
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
  },
  approveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  rejectButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  detailsButton: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  undoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  undoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B7FFF',
  },
  // Excuse specific styles
  excuseInfo: {
    marginBottom: 12,
  },
  excuseReason: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 8,
    lineHeight: 18,
  },
  documentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  documentText: {
    fontSize: 12,
    color: '#5B7FFF',
    fontWeight: '500',
  },
  statusInfo: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statusInfoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusInfoCompact: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  statusInfoTextCompact: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9CA3AF',
    marginTop: 12,
  },
});

