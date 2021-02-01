Ext.define('GraphQLApp.model.Area', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],

    proxy: {
        type: 'graphql',
        query: {
            list: 'getAreas',
            get: 'area'
        },
        reader: {
            type: 'graphql',
            rootProperty: 'areas',
            totalProperty: 'count'
        }
    },
});