// Legacy default export for compatibility
const menuItems = {
    items: [DashboardMenu()]
};
export default menuItems;
import { DashboardMenu } from './dashboard';
import application from './application';
import forms from './forms';
import elements from './elements';
import samplePage from './sample-page';
import pages from './pages';
import utilities from './utilities';
import support from './support';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //


// Get role from JWT token in localStorage
let role: string | undefined = undefined;
try {
    const token = localStorage.getItem('serviceToken');
    if (token) {
        // Use jwt-decode to extract role
        // This import is only available at runtime, so fallback if not present
        // @ts-ignore
        const decoded = require('jwt-decode')(token);
        role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
    }
} catch (e) {
    role = undefined;
}

export { DashboardMenu };
