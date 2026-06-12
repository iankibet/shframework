import { shApis, initApi } from '@iankibetsh/sh-core'

const graphQlEndpoint = 'sh-ql'

// GraphQL helpers stay in shframework; sh-core only ships the REST layer
function graphQlQuery (query) {
    return shApis.doGet(graphQlEndpoint, { query })
}

function graphQlMutate (mutation) {
    return shApis.doPost(graphQlEndpoint, { query: `mutation ${mutation}` })
}

export { initApi }

export default {
    ...shApis,
    graphQlQuery,
    graphQlMutate
}
