// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconFileInvoice,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc
} from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconFileInvoice,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const application = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'users',
            title: <FormattedMessage id="users" />,
            type: 'collapse',
            icon: icons.IconUserCheck,
            children: [
                {
                    id: 'posts',
                    title: <FormattedMessage id="social-profile" />,
                    type: 'item',
                    link: '/apps/user/social-profile/:tab',
                    url: '/apps/user/social-profile/posts',
                    breadcrumbs: false
                },
                {
                    id: 'account-profile',
                    title: <FormattedMessage id="account-profile" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'profile1',
                            title: (
                                <>
                                    <FormattedMessage id="profile" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/account-profile/profile1'
                        },
                        {
                            id: 'profile2',
                            title: (
                                <>
                                    <FormattedMessage id="profile" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/account-profile/profile2'
                        },
                        {
                            id: 'profile3',
                            title: (
                                <>
                                    <FormattedMessage id="profile" /> 03
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/account-profile/profile3'
                        }
                    ]
                },
                {
                    id: 'user-card',
                    title: <FormattedMessage id="cards" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'card1',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/card/card1'
                        },
                        {
                            id: 'card2',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/card/card2'
                        },
                        {
                            id: 'card3',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 03
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/card/card3'
                        }
                    ]
                },
                {
                    id: 'user-list',
                    title: <FormattedMessage id="list" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'list1',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/list/list1'
                        },
                        {
                            id: 'list2',
                            title: (
                                <>
                                    <FormattedMessage id="style" /> 02
                                </>
                            ),
                            type: 'item',
                            url: '/apps/user/list/list2'
                        }
                    ]
                }
            ]
        },
        {
            id: 'customer',
            title: <FormattedMessage id="customer" />,
            type: 'collapse',
            icon: icons.IconBasket,
            children: [
                {
                    id: 'customer-list',
                    title: <FormattedMessage id="customer-list" />,
                    type: 'item',
                    url: '/apps/customer/customer-list'
                },
                {
                    id: 'order-list',
                    title: <FormattedMessage id="order-list" />,
                    type: 'item',
                    url: '/apps/customer/order-list'
                },
                {
                    id: 'create-invoice',
                    title: <FormattedMessage id="create-invoice" />,
                    type: 'item',
                    url: '/apps/customer/create-invoice'
                },
                {
                    id: 'order-details',
                    title: <FormattedMessage id="order-details" />,
                    type: 'item',
                    url: '/apps/customer/order-details'
                },
                {
                    id: 'product',
                    title: <FormattedMessage id="product" />,
                    type: 'item',
                    url: '/apps/customer/product'
                },
                {
                    id: 'product-review',
                    title: <FormattedMessage id="product-review" />,
                    type: 'item',
                    url: '/apps/customer/product-review',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'chat',
            title: <FormattedMessage id="chat" />,
            type: 'item',
            icon: icons.IconMessages,
            url: '/apps/chat'
        },
        {
            id: 'kanban',
            title: 'Kanban',
            type: 'item',
            icon: icons.IconLayoutKanban,
            link: '/apps/kanban/:tab',
            url: '/apps/kanban/board',
            breadcrumbs: false
        },
        {
            id: 'mail',
            title: <FormattedMessage id="mail" />,
            type: 'item',
            icon: icons.IconMail,
            url: '/apps/mail'
        },
        {
            id: 'calendar',
            title: <FormattedMessage id="calendar" />,
            type: 'item',
            url: '/apps/calendar',
            icon: icons.IconCalendar
        },
        {
            id: 'contact',
            title: <FormattedMessage id="contact" />,
            type: 'collapse',
            icon: icons.IconNfc,
            children: [
                {
                    id: 'c-card',
                    title: <FormattedMessage id="cards" />,
                    type: 'item',
                    url: '/apps/contact/c-card',
                    breadcrumbs: false
                },
                {
                    id: 'c-list',
                    title: <FormattedMessage id="list" />,
                    type: 'item',
                    url: '/apps/contact/c-list',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'e-commerce',
            title: <FormattedMessage id="e-commerce" />,
            type: 'collapse',
            icon: icons.IconBasket,
            children: [
                {
                    id: 'products',
                    title: <FormattedMessage id="products" />,
                    type: 'item',
                    url: '/apps/e-commerce/products'
                },
                {
                    id: 'product-details',
                    title: <FormattedMessage id="product-details" />,
                    type: 'item',
                    link: '/apps/e-commerce/product-details/:id',
                    url: '/apps/e-commerce/product-details/1',
                    breadcrumbs: false
                },
                {
                    id: 'product-list',
                    title: <FormattedMessage id="product-list" />,
                    type: 'item',
                    url: '/apps/e-commerce/product-list'
                },
                {
                    id: 'checkout',
                    title: <FormattedMessage id="checkout" />,
                    type: 'item',
                    url: '/apps/e-commerce/checkout'
                }
            ]
        },
        {
            id: 'invoice',
            title: <FormattedMessage id="invoice" />,
            type: 'collapse',
            icon: icons.IconFileInvoice,
            children: [
                {
                    id: 'invoice-dashboard',
                    title: <FormattedMessage id="dashboard" />,
                    type: 'item',
                    url: '/apps/invoice/dashboard',
                    breadcrumbs: false
                },
                {
                    id: 'create-invoice',
                    title: <FormattedMessage id="create" />,
                    type: 'item',
                    url: '/apps/invoice/create-invoice',
                    breadcrumbs: false
                },
                {
                    id: 'invoice-list',
                    title: <FormattedMessage id="list" />,
                    type: 'item',
                    url: '/apps/invoice/invoice-list'
                },
                {
                    id: 'edit-invoice',
                    title: <FormattedMessage id="edit" />,
                    type: 'item',
                    url: '/apps/invoice/edit-invoice'
                },
                {
                    id: 'invoice-deatils',
                    title: <FormattedMessage id="details" />,
                    type: 'item',
                    url: '/apps/invoice/invoice-deatils'
                },
                {
                    id: 'client',
                    title: <FormattedMessage id="client" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'add-client',
                            title: <FormattedMessage id="create" />,
                            type: 'item',
                            url: '/apps/invoice/client/add-client'
                        },
                        {
                            id: 'client-list',
                            title: <FormattedMessage id="list" />,
                            type: 'item',
                            url: '/apps/invoice/client/client-list'
                        }
                    ]
                },
                {
                    id: 'item',
                    title: <FormattedMessage id="item" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'add-item',
                            title: <FormattedMessage id="create" />,
                            type: 'item',
                            url: '/apps/invoice/items/add-item'
                        },
                        {
                            id: 'item-list',
                            title: <FormattedMessage id="list" />,
                            type: 'item',
                            url: '/apps/invoice/items/item-list'
                        }
                    ]
                },
                {
                    id: 'payment',
                    title: <FormattedMessage id="payment" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'add-payment',
                            title: <FormattedMessage id="create" />,
                            type: 'item',
                            url: '/apps/invoice/payment/add-payment'
                        },
                        {
                            id: 'payment-list',
                            title: <FormattedMessage id="list" />,
                            type: 'item',
                            url: '/apps/invoice/payment/payment-list'
                        },
                        {
                            id: 'payment-details',
                            title: <FormattedMessage id="details" />,
                            type: 'item',
                            url: '/apps/invoice/payment/payment-details'
                        }
                    ]
                }
            ]
        },
        {
            id: 'crm',
            title: <FormattedMessage id="crm" />,
            type: 'collapse',
            icon: icons.IconBasket,
            children: [
                {
                    id: 'lead-management',
                    title: <FormattedMessage id="lead-management" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'lm-overview',
                            title: <FormattedMessage id="overview" />,
                            type: 'item',
                            url: '/apps/crm/lead-management/lm-overview'
                        },
                        {
                            id: 'lm-lead-list',
                            title: <FormattedMessage id="lead-list" />,
                            type: 'item',
                            url: '/apps/crm/lead-management/lm-lead-list'
                        }
                    ]
                },

                {
                    id: 'contact-management',
                    title: <FormattedMessage id="contact-management" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'cm-contact-card',
                            title: <FormattedMessage id="contact-card" />,
                            type: 'item',
                            url: '/apps/crm/contact-management/cm-contact-card'
                        },
                        {
                            id: 'cm-contact-list',
                            title: <FormattedMessage id="contact-list" />,
                            type: 'item',
                            url: '/apps/crm/contact-management/cm-contact-list'
                        },
                        {
                            id: 'cm-reminders-followup',
                            title: <FormattedMessage id="reminders-followup" />,
                            type: 'item',
                            url: '/apps/crm/contact-management/cm-reminders-followup'
                        },
                        {
                            id: 'cm-communication-history',
                            title: <FormattedMessage id="communication-history" />,
                            type: 'item',
                            url: '/apps/crm/contact-management/cm-communication-history'
                        }
                    ]
                },
                {
                    id: 'sales-management',
                    title: <FormattedMessage id="sales-management" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'sm-statement',
                            title: <FormattedMessage id="statement" />,
                            type: 'item',
                            url: '/apps/crm/sales-management/sm-statement'
                        },
                        {
                            id: 'sm-refund',
                            title: <FormattedMessage id="refund" />,
                            type: 'item',
                            url: '/apps/crm/sales-management/sm-refund'
                        },
                        {
                            id: 'sm-earning',
                            title: <FormattedMessage id="earning" />,
                            type: 'item',
                            url: '/apps/crm/sales-management/sm-earning'
                        }
                    ]
                }
            ]
        }
    ]
};

export default application;
