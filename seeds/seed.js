const sequelize = require('../config/connection');
const { User, Objective, Transaction } = require('../Models');

const userData = require('./userData.json');
const objectiveData = require('./ObjectiveData.json');
const transactionData = require('./TransactionData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const objective = await Objective.bulkCreate(objectiveData);

    const transaction = await Transaction.bulkCreate(transactionData);

    process.exit(0);
};
seedDatabase();