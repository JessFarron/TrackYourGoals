const router = require('express').Router();
const userRoutes = require('./userRoutes');
const objectiveRoutes = require('./objectiveRoutes');
const transactionsRoutes = require('./transactionsRoutes');
const verificationRoutes = require('./verificationRoutes')
const recoveryRoutes = require('./recoveryRoutes')

router.use('/user', userRoutes);
router.use('/objective', objectiveRoutes);
router.use('/transaction', transactionsRoutes);
router.use('/verification', verificationRoutes);
router.use('/recovery', recoveryRoutes);

module.exports = router;
