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
        name: 'Bagian',
        url: '/hr/section',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Jam Kerja',
        url: '/hr/working-hour',
        icon: 'nav-icon-bullet'
      },
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
      {
        name: 'Kategori Pegawai',
        url: '/hr/employee-category',
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
        name: 'Lokasi',
        url: '/setting/location',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Yayasan',
        url: '/setting/foundation',
        icon: 'nav-icon-bullet'
      },
    ]
  },
];
