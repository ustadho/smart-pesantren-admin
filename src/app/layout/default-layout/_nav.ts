import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  {
    name: 'Kepegawaian',
    url: '/hr',
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Unit Organisasi',
        url: '/hr/organization',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Jabatan',
        url: '/hr/job-position',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Level Jabatan',
        url: '/hr/job-level',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Pengaturan',
    url: '/setting',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Yayasan',
        url: '/setting/foundation',
        icon: 'nav-icon-bullet'
      },
    ]
  },
];
