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
    name: 'Pendidikan',
    url: '/academic',
    iconComponent: { name: 'cil-calendar' },
    children: [
      {
        name: 'Data Santri',
        url: '/academic/student',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Kelola Kelas-Santri',
        url: '/academic/class-room-student',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Ruang Kelas',
        url: '/academic/class-room',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Mata Pelajaran',
        url: '/academic/subject',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Wali Santri',
        url: '/academic/guardian',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Kepegawaian',
    url: '/hr',
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'Data Pegawai',
        url: '/hr/employee',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Mutasi Pegawai',
        url: '/hr/employee-transfer',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Bagian',
        url: '/hr/section',
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
        name: 'Institusi Rujukan',
        url: '/hr/referal-institution',
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
    name: 'Absensi',
    url: '/presence',
    iconComponent: { name: 'cil-notes' },
    children: [
      // {
      //   name: 'Jadwal Kerja',
      //   url: '/presence/working-calendar',
      //   icon: 'nav-icon-bullet'
      // },
      {
        name: 'Hari Libur',
        url: '/presence/holiday',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Jam Kerja',
        url: '/presence/working-hour',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Jam Absen',
        url: '/presence/working-time',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    name: 'Pengaturan',
    url: '/setting',
    iconComponent: { name: 'cil-calculator' },
    children: [
      {
        name: 'Pengguna',
        url: '/setting/user-management',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tahun Ajaran',
        url: '/setting/academic-year',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Level Kelas',
        url: '/setting/class-level',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Kategori Santri',
        url: '/setting/student-category',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Kurikulum',
        url: '/setting/curriculum',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Lembaga Pendidikan',
        url: '/setting/institution',
        icon: 'nav-icon-bullet'
      },
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
