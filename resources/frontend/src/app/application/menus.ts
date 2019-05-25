export const menus = [
    {
        title: 'Dashboard',
        action: '/bufallus/dashboard',
        icon: 'dashboard',
        isLink: true,
        authorization: [
            'administrator'
        ]
    },
    {
        title: 'Pedidos',
        action: '/bufallus/administrar/pedidos',
        icon: 'fastfood-svg',
        isLink: true,
        authorization: [
            'administrator'
        ]
    },
    {
        title: 'Cardapio',
        action: '/bufallus/administrar/cardapio',
        icon: 'restaurant_menu',
        isLink: true,
        authorization: [
            'administrator'
        ]
    },
    {
        title: 'Relatório',
        action: '/bufallus/relatorios/cardapio',
        icon: 'view_list',
        isLink: true,
        authorization: [
            'administrator'
        ]
    },
    {
        title: 'Usuários',
        action: '/bufallus/administrar/usuarios',
        icon: 'person',
        isLink: true,
        authorization: [
            'administrator'
        ]
    }
];
