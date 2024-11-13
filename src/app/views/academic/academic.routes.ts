import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'class-room',
    loadComponent: () => import('./class-room/class-room.component').then(m => m.ClassRoomComponent),
    data: {
      title: 'Data Kelas',
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

];
