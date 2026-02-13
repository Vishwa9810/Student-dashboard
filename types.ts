
export interface Task {
  id: string;
  title: string;
  dueDate: string;
  course: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface AttendanceRecord {
  courseId: string;
  courseName: string;
  attended: number;
  total: number;
}

export interface Exam {
  id: string;
  course: string;
  date: string;
  location: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  dateApplied: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  date: string;
}

export type ViewType = 'dashboard' | 'assignments' | 'attendance' | 'exams' | 'internships' | 'notes';
