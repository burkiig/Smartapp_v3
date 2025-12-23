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
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function ScheduleScreen() {
  const router = useRouter();
  const { userType } = useUser();
  
  // Student ise history göster
  if (userType === 'student') {
    const StudentHistory = require('./history').default;
    return <StudentHistory />;
  }

  const [selectedFilter, setSelectedFilter] = useState('today');

  const [classes] = useState([
    {
      id: 1,
      course: 'CS101',
      title: 'Introduction to Programming',
      time: '09:00 - 10:30',
      room: 'Room 401',
      day: 'today',
      status: 'completed',
      students: '42/45',
      color: '#10B981'
    },
    {
      id: 2,
      course: 'CS201',
      title: 'Data Structures',
      time: '14:00 - 15:30',
      room: 'Lab 204',
      day: 'today',
      status: 'in-progress',
      students: '28/38',
      color: '#F59E0B'
    },
    {
      id: 3,
      course: 'CS301',
      title: 'Algorithms',
      time: '16:00 - 17:30',
      room: 'Room 405',
      day: 'today',
      status: 'upcoming',
      students: '0/32',
      color: '#5B7FFF'
    },
    {
      id: 4,
      course: 'CS102',
      title: 'Advanced Programming',
      time: '10:00 - 11:30',
      room: 'Lab 301',
      day: 'tomorrow',
      status: 'upcoming',
      students: '0/40',
      color: '#5B7FFF'
    },
    {
      id: 5,
      course: 'CS202',
      title: 'Database Systems',
      time: '13:00 - 14:30',
      room: 'Room 402',
      day: 'thisweek',
      status: 'upcoming',
      students: '0/35',
      color: '#5B7FFF'
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in-progress':
        return 'play-circle';
      default:
        return 'calendar';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#F59E0B';
      default:
        return '#5B7FFF';
    }
  };

  const filteredClasses = classes.filter(cls => {
    if (selectedFilter === 'today') return cls.day === 'today';
    if (selectedFilter === 'tomorrow') return cls.day === 'tomorrow';
    if (selectedFilter === 'thisweek') return true;
    return true;
  });

  const renderClassItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.classCard}
      onPress={() => router.push({
        pathname: '/class-details',
        params: { code: item.course, title: item.title }
      })}
    >
      <View style={styles.classLeft}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons name={getStatusIcon(item.status)} size={24} color={getStatusColor(item.status)} />
        </View>
        <View style={styles.classInfo}>
          <Text style={styles.courseCode}>{item.course}</Text>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <View style={styles.classDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.detailText}>{item.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.detailText}>{item.room}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.classRight}>
        <Text style={styles.studentCount}>{item.students}</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ders Programı</Text>
          <Text style={styles.headerSubtitle}>Haftalık ders takvimi</Text>
        </View>
        <TouchableOpacity style={styles.calendarButton}>
          <Ionicons name="calendar-outline" size={24} color="#5B7FFF" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'today' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('today')}
        >
          <Text style={[styles.filterText, selectedFilter === 'today' && styles.filterTextActive]}>
            Bugün
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'tomorrow' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('tomorrow')}
        >
          <Text style={[styles.filterText, selectedFilter === 'tomorrow' && styles.filterTextActive]}>
            Yarın
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedFilter === 'thisweek' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('thisweek')}
        >
          <Text style={[styles.filterText, selectedFilter === 'thisweek' && styles.filterTextActive]}>
            Bu Hafta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Class List */}
      <FlatList
        data={filteredClasses}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id.toString()}
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
  calendarButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  classCard: {
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
  classLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  statusIndicator: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  courseTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  classDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  classRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studentCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B7FFF',
  },
});

