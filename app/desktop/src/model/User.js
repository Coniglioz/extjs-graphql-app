Ext.define('GraphQLApp.model.User', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'username',
        type: 'string'
    }, {
        name: 'email',
        type: 'string'
    }, {
        name: 'firstName',
        type: 'string'
    }, {
        name: 'lastName',
        type: 'string'
    }, {
        name: 'role',
        type: 'string'
    }, {
        name: 'areas',
        reference: {
            type: 'GraphQLApp.model.Area'
        }
    }, {
        name: 'areasDisplay',
        calculate(data) {
            return data.areas && data.areas.map(area => area.name).join(',');
        }
    }],

    proxy: {
        type: 'graphql',
        query: {
            list: 'getUsers',
            get: 'user'
        },
        mutation: {
            create: 'createUser',
            update: 'updateUser',
            destroy: 'deleteUser',
        },
        reader: {
            type: 'graphql',
            rootProperty: 'users',
            totalProperty: 'count'
        }
    },
});