// Resolvers for the queries/mutations
const resolvers = {
    Query: {
        getUsers: () => {
            const users = [
                {
                    username: "Whatever",
                    email: "Whoever@whatever.com"
                }, 
                {
                    username: "Whoever",
                    email: "Whatever@whoever.com"
                }
            ];

            return users;
        }
    }
};

module.exports = resolvers;