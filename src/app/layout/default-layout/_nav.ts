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
