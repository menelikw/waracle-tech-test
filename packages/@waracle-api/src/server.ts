import fetch from "node-fetch";
import pkg from 'apollo-server';
const { ApolloServer, gql, GraphQLUpload } = pkg;

// TODO: Usually this would be abstracted into feature folders
const typeDefs = gql`
    scalar FileUpload

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }
    
    type Image {
        created_at: String!,
        height: Int!,
        id: ID!,
        url: String!,
        width: Int!
    }

    type Query {
        images: [Image!],
    }
    
    type Mutation {
        uploadImage(file: FileUpload!): File,
    }
`;

const resolvers = {
    FileUpload: GraphQLUpload,
    Query: {
        images: async () => {
            try {
                const response = await fetch('https://api.thecatapi.com/v1/images', {
                    method: 'GET',
                    headers: {
                        'x-api-key': `${process.env.API_KEY}`
                    }
                })

                const {data} = await response.json()

                if (!data) return []

                return data.map(item => {
                    const {id, created_at, height, url, width} = item
                    return {id, created_at, height, url, width}
                })
            } catch(e) {
                console.error(e.message)
            }
        },
    },

    Mutation: {
        uploadImage: async(parent, {file}) => {
            const _file = await file

            try {
                const response = await fetch('https://api.thecatapi.com/v1/images/upload', {
                    method: 'POST',
                    body: JSON.stringify({file: _file}),
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': `${process.env.API_KEY}`
                    }
                })

                // Nonsense 3rd party api does not work as intended!!
                console.log(response, _file)
                return {..._file}
            } catch(e) {
                console.error(e.message)
            }
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Running on: ${url}`);
});
