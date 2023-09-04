const User = require('./User');
const Transaction = require('./Transaction');
const Objective = require('./Objective');
const Verification = require('./Verification');
const Recovery = require('./Recovery');


User.hasMany(Objective, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Objective.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Transaction, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Objective.hasMany(Transaction, {
    foreignKey: 'objective_id',
    onDelete: 'CASCADE'
});

Transaction.belongsTo(Objective, {
    foreignKey:'objective_id'
});

module.exports = { User, Transaction, Objective, Verification , Recovery};
