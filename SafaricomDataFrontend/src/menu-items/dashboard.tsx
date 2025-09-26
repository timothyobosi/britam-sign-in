// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics,IconCertificate } from '@tabler/icons-react';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics,
    IconCertificates: IconCertificate
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'dashboard',
    title: <FormattedMessage id="dashboard" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Course Outline',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'analytics',
            title: 'Test',
            type: 'item',
            url: '/dashboard/analytics',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        },
        {
            id: 'certificate',
            title: 'My Certificate',
            type: 'item',
            url: '/dashboard/certificate',
            icon: icons.IconCertificates,
            breadcrumbs: false
        }
        // ,
        // {
        //     id: 'training',
        //     title: 'Training Modules',
        //     type: 'item',
        //     url: '/training', // Points to the training list route
        //     icon: icons.IconDashboard,
        //     breadcrumbs: false
        // }
    ]
};

export default dashboard;
