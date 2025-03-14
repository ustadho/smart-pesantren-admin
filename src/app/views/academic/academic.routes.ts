import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'student',
    loadComponent: () => import('./student/student.component').then(m => m.StudentComponent),
    data: {
      title: 'Data Kelas',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'subject-schedule',
    loadComponent: () => import('./subject-schedule/subject-schedule.component').then(m => m.SubjectScheduleComponent),
    data: {
      title: 'Jadwal Pelajaran',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'mapping-schedule-student',
    loadComponent: () => import('./mapping-schedule-student/mapping-schedule-student.component').then(m => m.MappingScheduleStudentComponent),
    data: {
      title: 'Mapping Jadwal - Santri',
    }
  },
  {
    path: 'class-room',
    loadComponent: () => import('./class-room/class-room.component').then(m => m.ClassRoomComponent),
    data: {
      title: 'Data Kelas',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'class-room-student',
    loadComponent: () => import('./class-room-student/class-room-student.component').then(m => m.ClassRoomStudentComponent),
    data: {
      title: 'Kelola Data Kelas-Santri',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'subject',
    loadComponent: () => import('./subject/subject.component').then(m => m.SubjectComponent),
    data: {
      title: 'Mata Pelajaran',
      defaultSort: 'name,asc',
    }
  },
  {
    path: 'activity-time',
    loadComponent: () => import('./activity-time/activity-time.component').then(m => m.ActivityTimeComponent),
    data: {
      title: 'Jam Aktivitas',
      defaultSort: 'seq,asc',
    }
  },
];
