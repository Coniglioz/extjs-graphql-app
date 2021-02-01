Ext.define('GraphQLApp.GraphQL', {
    alternateClassName: ['GraphQL'],
    singleton: true,

    initClient(baseUrl) {
        this.client = new GraphQLApp.xApolloClient.ApolloClient({
            cache: new GraphQLApp.xApolloClient.InMemoryCache({}),
            uri: baseUrl,
            defaultOptions: {
                query: {
                    fetchPolicy: 'cache-first',
                    errorPolicy: 'all',
                },
                mutate: {
                    errorPolicy: 'all',
                },
            },
        });
    },
});