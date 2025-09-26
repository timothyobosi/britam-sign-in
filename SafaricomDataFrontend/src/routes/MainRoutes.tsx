import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// components
import TrainingAudioCard from 'safaricom-data/ui-component/cards/TrainingAudioCard';

import { loader as productsLoader, productLoader } from 'api/products';
import TrainingList from 'safaricom-data/ui-component/cards/TrainingList';
import TrainingPlayer from 'safaricom-data/ui-component/cards/trainingPlayer';

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
        // Training module routes
        {
            path: '/training', // Route for the modules list
            element: <TrainingAudioCard isLoading={false} />
        },
        {
            path: '/training/:moduleId', // Route for individual module views
            element: <TrainingAudioCard isLoading={false} />
        },
        // Training module routes
        {
            path: '/training', // Route for the modules list
            element: <TrainingList />
        },
        {
            path: '/training/:moduleId', // Route for individual module views
            element: <TrainingPlayer />
        }
    ]
};

export default MainRoutes;