export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  status: 'Đang mở' | 'Tạm dừng' | 'Chưa mở';
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'Đang hoạt động' | 'Đang chờ';
  avatar: string;
  title: string;
}

export interface ScheduleItem {
  id: string;
  courseName: string;
  courseCode: string;
  lecturerName: string;
  room: string;
  time: string;
  status: 'Đang học' | 'Sắp tới' | 'Hoàn thành';
  day: string;
}

export interface Activity {
  id: string;
  type: 'course' | 'schedule' | 'lecturer' | 'maintenance';
  title: string;
  description: string;
  time: string;
}
