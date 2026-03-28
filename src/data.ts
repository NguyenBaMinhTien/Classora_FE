import { Course, Lecturer, ScheduleItem, Activity } from './types';

export const courses: Course[] = [
  { id: '1', code: 'CS101', name: 'Lập trình cơ sở', credits: 3, status: 'Đang mở' },
  { id: '2', code: 'MATH202', name: 'Giải tích 1', credits: 4, status: 'Đang mở' },
  { id: '3', code: 'SOFT301', name: 'Kỹ thuật phần mềm', credits: 3, status: 'Tạm dừng' },
  { id: '4', code: 'DB404', name: 'Cơ sở dữ liệu', credits: 3, status: 'Đang mở' },
  { id: '5', code: 'NET505', name: 'Mạng máy tính nâng cao', credits: 4, status: 'Chưa mở' },
];

export const lecturers: Lecturer[] = [
  {
    id: '1',
    name: 'TS. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Khoa học Máy tính',
    status: 'Đang hoạt động',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    title: 'Giảng viên cao cấp'
  },
  {
    id: '2',
    name: 'GS. Michael Chen',
    email: 'm.chen@university.edu',
    department: 'Kỹ thuật',
    status: 'Đang chờ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    title: 'Giáo sư'
  },
  {
    id: '3',
    name: 'TS. Emily Rivera',
    email: 'e.rivera@university.edu',
    department: 'Toán học',
    status: 'Đang hoạt động',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    title: 'Giảng viên'
  }
];

export const scheduleItems: ScheduleItem[] = [
  {
    id: '1',
    courseName: 'Cấu trúc Dữ liệu Nâng cao',
    courseCode: 'CS-302',
    lecturerName: 'TS. Sarah Jenkins',
    room: 'B-102',
    time: '09:00 - 11:00',
    status: 'Đang học',
    day: 'Thứ 2'
  },
  {
    id: '2',
    courseName: 'Nhập môn Thiết kế UX',
    courseCode: 'DES-101',
    lecturerName: 'GS. Michael Chen',
    room: 'LAB-04',
    time: '11:30 - 13:30',
    status: 'Sắp tới',
    day: 'Thứ 2'
  },
  {
    id: '3',
    courseName: 'Toán Rời rạc',
    courseCode: 'MATH-205',
    lecturerName: 'TS. Emily Watson',
    room: 'C-205',
    time: '14:00 - 16:00',
    status: 'Sắp tới',
    day: 'Thứ 2'
  },
  {
    id: '4',
    courseName: 'Marketing Toàn cầu',
    courseCode: 'BUS-412',
    lecturerName: 'Alan Thompson',
    room: 'A-301',
    time: '16:30 - 18:30',
    status: 'Sắp tới',
    day: 'Thứ 2'
  }
];

export const activities: Activity[] = [
  {
    id: '1',
    type: 'course',
    title: 'Khóa học mới',
    description: 'Quantum Computing 101 được thêm bởi Hệ thống',
    time: '2 giờ trước'
  },
  {
    id: '2',
    type: 'schedule',
    title: 'Cập nhật Lịch học',
    description: 'CS-302 chuyển sang phòng B-102',
    time: '4 giờ trước'
  },
  {
    id: '3',
    type: 'lecturer',
    title: 'Giảng viên Mới',
    description: 'TS. Sarah Jenkins bắt đầu công tác',
    time: 'Hôm qua'
  },
  {
    id: '4',
    type: 'maintenance',
    title: 'Bảo trì hoàn tất',
    description: 'Phòng LAB-04 đã sẵn sàng',
    time: '1 ngày trước'
  }
];
