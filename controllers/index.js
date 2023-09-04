const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use((err, req, res, next) => {
    console.error(err); // Log the error for debugging purposes
    res.status(500).render('error', {
        errorMessage: 'Internal Server Error',
    });
});
router.use((req, res) => {
    res.status(404).render('404error');
});
module.exports = router;

