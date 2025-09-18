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

// Role-aware dashboard menu
export const DashboardMenu = (role?: string) => {
    const agentTabs = [
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
    ];
    const adminTabs = [
        {
            id: 'default',
            title: 'Course Outline',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'questions',
            title: 'Questions',
            type: 'item',
            url: '/dashboard/questions',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        },
        {
            id: 'agents-progress',
            title: 'Agents Progress',
            type: 'item',
            url: '/dashboard/agents-progress',
            icon: icons.IconCertificates,
            breadcrumbs: false
        }
    ];
    return {
        id: 'dashboard',
        title: <FormattedMessage id="dashboard" />,
        icon: icons.IconDashboard,
        type: 'group',
        children: role?.toLowerCase() === 'admin' ? adminTabs : agentTabs
    };
};

