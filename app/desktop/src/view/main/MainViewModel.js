Ext.define('GraphQLApp.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mainviewmodel',

    stores: {
        users: {
            model: 'GraphQLApp.model.User',
            autoLoad: true,
            remoteSort: true,
            remoteFilter: true
        },
    }
})
