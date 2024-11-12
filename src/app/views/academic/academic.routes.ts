import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'subject',
    loadComponent: () => import('./subject/subject.component').then(m => m.SubjectComponent),
    data: {
      title: 'Mata Pelajaran',
      defaultSort: 'name,asc',
    }
  },

];
