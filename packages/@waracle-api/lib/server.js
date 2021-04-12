var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import pkg from 'apollo-server';
const { ApolloServer, gql, GraphQLUpload } = pkg;
// TODO: Usually this would be abstracted into feature folders
const typeDefs = gql `
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
        images: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://api.thecatapi.com/v1/images', {
                    method: 'GET',
                    headers: {
                        'x-api-key': `${process.env.API_KEY}`
                    }
                });
                const { data } = yield response.json();
                if (!data)
                    return [];
                return data.map(item => {
                    const { id, created_at, height, url, width } = item;
                    return { id, created_at, height, url, width };
                });
            }
            catch (e) {
                console.error(e.message);
            }
        }),
    },
    Mutation: {
        uploadImage: (parent, { file }) => __awaiter(void 0, void 0, void 0, function* () {
            const _file = yield file;
            try {
                const response = yield fetch('https://api.thecatapi.com/v1/images/upload', {
                    method: 'POST',
                    body: JSON.stringify({ file: _file }),
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': `${process.env.API_KEY}`
                    }
                });
                console.log(response, _file);
                return Object.assign({}, _file);
            }
            catch (e) {
                console.error(e.message);
            }
        })
    }
};
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`Running on: ${url}`);
});
