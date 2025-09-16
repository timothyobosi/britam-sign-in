import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import ErrorBoundary from './ErrorBoundary';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// components
import TrainingAudioCard from 'safaricom-data/ui-component/cards/TrainingAudioCard';

import { loader as productsLoader, productLoader } from 'api/products';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardAnalytics = Loadable(lazy(() => import('views/dashboard/Analytics')));

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