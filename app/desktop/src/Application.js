Ext.define('GraphQLApp.Application', {
    extend: 'Ext.app.Application',
    name: 'GraphQLApp',
    requires: ['GraphQLApp.*'],

    launch: function () {
        GraphQL.initClient('http://localhost:3000/graphql');
        Ext.Viewport.add([{ xtype: 'mainview' }]);
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload()
                }
            }
        )
    }
})
