Ext.define('GraphQLApp.view.main.MainView', {
    extend: 'Ext.Panel',
    xtype: 'mainview',
    requires: [
        'Ext.grid.plugin.PagingToolbar'
    ],

    viewModel: {
        type: 'mainviewmodel'
    },

    layout: 'fit',

    items: [{
        xtype: 'grid',
        bind: '{users}',
        plugins: {
            pagingtoolbar: true
        },
        columns: [
            { text: 'Id', dataIndex: 'id', width: 100 },
            { text: 'Username', dataIndex: 'username', width: 200 },
            { text: 'Areas', dataIndex: 'areasDisplay', flex: 1 },
        ]
    }]
})
