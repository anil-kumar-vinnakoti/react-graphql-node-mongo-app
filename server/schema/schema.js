import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import Client from "../models/Client.js";
import Project from "../models/Project.js";

// Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      async resolve(parent, args) {
        return await Client.findById(parent.clientId);
      },
    },
  }),
});

// queries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // get all clients
    clients: {
      type: new GraphQLList(ClientType),
      resolve() {
        return Client.find();
      },
    },
    // get all projects
    projects: {
      type: new GraphQLList(ProjectType),
      async resolve() {
        return Project.find();
      },
    },

    // get project by projectId
    project: {
      type: ProjectType,
      args: {
        projectId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        return Project.findById(args.projectId);
      },
    },

    // get client by clientId
    client: {
      type: ClientType,
      args: { clientId: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.clientId);
      },
    },
  },
});

// mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Clients
    // Add a Client
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const { name, email, phone } = args;
        const client = new Client({
          name,
          email,
          phone,
        });

        return await client.save();
      },
    },
    // delete client by clientId
    deleteClient: {
      type: ClientType,
      args: {
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        return await Client.findByIdAndDelete(args.clientId);
      },
    },

    // Projects
    // add project
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progess" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        const { title, description, status, clientId } = args;
        const project = new Project({ title, description, status, clientId });

        return await project.save();
      },
    },
    deleteProjectById: {
      type: ProjectType,
      args: {
        projectId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(parent, args) {
        return await Project.findByIdAndDelete(args.projectId);
      },
    },
  },
});
export default new GraphQLSchema({
  query: RootQuery,
  mutation,
});
