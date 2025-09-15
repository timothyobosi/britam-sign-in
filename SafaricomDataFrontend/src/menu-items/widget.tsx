// third-party
import { FormattedMessage } from 'react-intl';

// project import
import { useGetMenu } from 'api/menu';

// assets
import { IconChartArcs, IconClipboardList, IconChartInfographic, IconLoader } from '@tabler/icons-react';

const icons = {
    widget: IconChartArcs,
    statistics: IconChartArcs,
    data: IconClipboardList,
    chart: IconChartInfographic
};

const loadingMenu = {
    id: 'group-widget-loading',
    title: <FormattedMessage id="widget" />,
    type: 'group',
    children: [
        {
            id: 'statistics1',
            title: 'loading',
            type: 'item',
            icon: IconLoader,
            url: '/widget/statistics',
            breadcrumbs: false
        },
        {
            id: 'data1',
            title: 'loading',
            type: 'item',
            icon: IconLoader,
            url: '/widget/data',
            breadcrumbs: false
        },
        {
            id: 'chart1',
            title: 'loading',
            type: 'item',
            icon: IconLoader,
            url: '/widget/chart',
            breadcrumbs: false
        }
    ]
};

// ==============================|| MENU ITEMS - API ||============================== //

export const Menu = () => {
    const { menu, menuLoading } = useGetMenu();

    if (menuLoading) return loadingMenu;

    const SubChildrenLis = (subChildrenLis) => {
        return subChildrenLis?.map((subList) => {
            return {
                ...subList,
                title: <FormattedMessage id={`${subList.title}`} />,
                // @ts-ignore
                icon: icons[subList.icon]
            };
        });
    };

    const menuItem = (subList) => {
        let list = {
            ...subList,
            title: <FormattedMessage id={`${subList.title}`} />,
            // @ts-ignore
            icon: icons[subList.icon]
        };

        if (subList.type === 'collapse') {
            list.children = SubChildrenLis(subList.children);
        }
        return list;
    };

    const withoutMenu = menu?.children?.filter((item) => item.id !== 'no-menu');

    const ChildrenList = withoutMenu?.map((subList) => menuItem(subList));

    let menuList = {
        ...menu,
        title: <FormattedMessage id={`${menu?.title}`} />,
        // @ts-ignore
        icon: icons[menu?.icon],
        children: ChildrenList
    };

    return menuList;
};
