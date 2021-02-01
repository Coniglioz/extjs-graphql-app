Ext.define('GraphQLApp.proxy.GraphQLReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.graphql',

    read: function (response, readOptions) {
        if (response && response.data) {
            // NOTE Clone is needed to prevent conflicts with Apollo client
            const responseObj = Ext.clone(Ext.Object.getValues(response.data)[0]);
            if (this.getTotalProperty() && responseObj.hasOwnProperty(this.getTotalProperty())) {
                // List response
                return this.readRecords(responseObj, readOptions);
            } else {
                // Single record response
                return this.readRecords([responseObj], readOptions);
            }
        } else {
            return new Ext.data.ResultSet({
                total: 0,
                count: 0,
                records: [],
                success: false,
                message: response.errors
            });
        }
    },
});