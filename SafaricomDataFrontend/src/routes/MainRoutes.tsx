import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// components
import TrainingAudioCard from 'safaricom-data/ui-component/cards/TrainingAudioCard';
import AgentsProgressTab from 'views/dashboard/AgentsProgressTab';

import QuestionsTab from 'views/dashboard/QuestionsTab';



// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardAnalytics = Loadable(lazy(() => import('views/dashboard/Analytics')));
const DashboardCertificate = Loadable(lazy(() => import('views/dashboard/CertificateTab')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        // Dashboard tabs
        {
            path: '/dashboard/default',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard/analytics',
            element: <DashboardAnalytics />
        },
        {
            path: '/dashboard/certificate',
            element: <DashboardCertificate />
        },
        {
            path: '/dashboard/questions',
            element: <QuestionsTab />
        },
        {
            path: '/dashboard/agents-progress',
            element: <AgentsProgressTab />
        },
        // Training module routes
        {
            path: '/training', // Route for the modules list
            element: <TrainingAudioCard isLoading={false} />
        },
        {
            path: '/training/:moduleId', // Route for individual module views
            element: <TrainingAudioCard isLoading={false} />
        }
    ]
};

export default MainRoutes;