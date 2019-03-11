export const menus = [
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
        title: 'Usuários',
        action: '/bufallus/administrar/usuarios',
        icon: 'person',
        isLink: true,
        authorization: [
            'administrator'
        ]
    }
];
