import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';

export interface SubMenuItem {
  title: string;
  path: string;
}

export interface MenuItem {
  title: string;
  path?: string;
  icon: any; // Using any for MUI icon component type
  submenus?: SubMenuItem[];
}

export const MENUS: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: DashboardOutlinedIcon,
  },
  {
    title: 'Masters',
    icon: SettingsOutlinedIcon,
    submenus: [
      { title: 'Users', path: '/users' },
      { title: 'City', path: '/masters/city' },
      { title: 'Area', path: '/masters/area' },
      { title: 'Organization Type', path: '/masters/org-type' },
      { title: 'Speciality', path: '/masters/speciality' },
      { title: 'Designation', path: '/masters/designation' },
      { title: 'Modules', path: '/masters/modules' },
      { title: 'Call Type', path: '/masters/call-type' },
      { title: 'Demo Status', path: '/masters/demo-status' },
      { title: 'User/Non User', path: '/masters/user-non-user' },
      { title: 'Software Name', path: '/masters/software-name' },
    ],
  },
  {
    title: 'Hospital Details',
    icon: LocalHospitalOutlinedIcon,
    submenus: [
      { title: 'Add Hospital', path: '/hospitals/add' },
      { title: 'Manage Hospital', path: '/hospitals/manage' },
    ]
  },
  {
    title: 'Components',
    path: '/components',
    icon: LocalHospitalOutlinedIcon,
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: PeopleOutlinedIcon,
  },
  {
    title: 'Installation Details',
    path: '/installation',
    icon: AppRegistrationOutlinedIcon,
  },
  {
    title: 'AMC List',
    path: '/amc-list',
    icon: DescriptionOutlinedIcon,
  },
  {
    title: 'DCR',
    icon: HandshakeOutlinedIcon,
    submenus: [
      { title: 'DCR List', path: '/dcr/list' },
      { title: 'DCR Clients', path: '/dcr/clients' },
      { title: 'Area', path: '/dcr/area' },
      { title: 'City', path: '/dcr/city' },
    ],
  },
];
