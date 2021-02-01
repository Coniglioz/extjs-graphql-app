Ext.define('GraphQLApp.proxy.GraphQLProxy', {
    extend: 'Ext.data.proxy.Server',
    alias: 'proxy.graphql',

    config: {
        pageParam: '',
        startParam: 'offset',
        limitParam: 'limit',
        sortParam: 'orderBy',
        filterParam: 'filter',
        query: {
            list: undefined,
            get: undefined
        },
        mutation: {
            create: undefined,
            update: undefined,
            destroy: undefined,
        },
        readListTpl: [
            'query {',
            '{name}(',
            '<tpl foreach="params" between=",">',
            '{$}:<tpl if="!Ext.isString(values)">{.}<tpl else>"{.}"</tpl>',
            '</tpl>',
            ') {',
            '{totalProperty},',
            '{rootProperty} {',
            '{fields}',
            '}}}'
        ],
        readSingleTpl: [
            'query {',
            '{name}(',
            '<tpl foreach="params" between=",">',
            '{$}:<tpl if="!Ext.isString(values)">{.}<tpl else>"{.}"</tpl>',
            '</tpl>',
            ') {',
            '{fields}',
            '}}'
        ],
        saveTpl: [
            'mutation {',
            '{name} (',
            '<tpl if="action == \'update\'">',
            '{idParam}: {id},',
            '</tpl>',
            '{name}Input: {',
            '{values}',
            '})}',
        ],
        deleteTpl: [
            'mutation {',
            '{name} (',
            '{idParam}: {id}',
            ')}',
        ],
    },

    applyReadListTpl(tpl) {
        return this.createTpl(tpl);
    },

    applyReadSingleTpl(tpl) {
        return this.createTpl(tpl);
    },

    applySaveTpl(tpl) {
        return this.createTpl(tpl);
    },

    applyDeleteTpl(tpl) {
        return this.createTpl(tpl);
    },

    createTpl(tpl) {
        if (tpl && !tpl.isTpl) {
            tpl = new Ext.XTemplate(tpl);
        }
        return tpl;
    },

    encodeSorters(sorters, preventArray) {
        const encoded = this.callParent([sorters, preventArray]);
        // Escape double quotes to pass in GQL string
        return encoded.replace(/"/g, '\\"');
    },

    encodeFilters(filters) {
        const encoded = this.callParent([filters]);
        // Escape double quotes to pass in GQL string
        return encoded.replace(/"/g, '\\"');
    },

    doRequest(operation) {
        const me = this,
            action = operation.getAction(),
            requestPromise = action === 'read' ? me.sendQuery(operation) : me.sendMutation(operation);

        requestPromise
            .then((result) => {
                if (!me.destroying && !me.destroyed) {
                    me.processResponse(!result.errors, operation, null, Ext.merge(result, {
                        status: result.errors ? 500 : 200
                    }));
                }
            })
            .catch((error) => {
                if (!me.destroying && !me.destroyed) {
                    me.processResponse(true, operation, null, {
                        status: 500
                    });
                }
            });
    },

    sendQuery(operation) {
        const me = this,
            initialParams = Ext.apply({}, operation.getParams()),
            params = Ext.applyIf(initialParams, me.getExtraParams() || {}),
            operationId = operation.getId(),
            idParam = me.getIdParam();
        let query;

        Ext.applyIf(params, me.getParams(operation));

        if (operationId === undefined) {
            // Load list
            query = me.getReadListTpl().apply({
                name: me.getQuery()['list'],
                params,
                fields: me.getFields(me.getModel()),
                totalProperty: me.getReader().getTotalProperty(),
                rootProperty: me.getReader().getRootProperty()
            });
        } else {
            // Load recod by id
            if (params[idParam] === undefined) {
                params[idParam] = operationId;
            }
            query = me.getReadSingleTpl().apply({
                name: me.getQuery()['get'],
                params,
                fields: me.getFields(me.getModel()),
                recordId: operationId
            });
        }

        return GraphQL.client
            .query({
                query: GraphQLApp.xApolloClient.gql(query)
            });
    },

    sendMutation(operation) {
        const me = this,
            action = operation.getAction(),
            records = operation.getRecords();
        let query;

        if (action === 'destroy') {
            // Delete record
            query = me.getDeleteTpl().apply({
                name: me.getMutation()[action],
                idParam: me.getIdParam(),
                id: records[0].getId(),
            });
        } else {
            // Save record
            query = me.getSaveTpl().apply({
                name: me.getMutation()[action],
                values: me.getValues(records[0]),
                action,
                idParam: me.getIdParam(),
                id: records[0].getId(),
            });
        }

        return GraphQL.client
            .mutate({
                mutation: GraphQLApp.xApolloClient.gql(query)
            });
    },

    privates: {
        getFields(model) {
            const me = this;
            const fields = model.prototype.fields;
            return fields
                .filter(field => !field.calculated)
                .map(field => {
                    if (!field.reference) {
                        return field.name;
                    } else {
                        return `${field.name} {${me.getFields(Ext.data.schema.Schema.lookupEntity(field.reference.type))}}`;
                    }
                })
                .join(',');
        },

        getValues(record) {
            const values = record.getData({ associated: true, changes: !this.getWriter().getWriteAllFields() });
            const valuesArray = [];
            delete values[this.getIdParam()];

            Ext.Object.each(values, (key, value) => valuesArray.push(`${key}: ${Ext.encode(value)}`));
            return valuesArray.join(',');
        },
    }
});