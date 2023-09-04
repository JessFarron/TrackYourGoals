const router = require('express').Router();
const { User, Verification } = require('../../Models');
const mailer = require('../../utils/libs/emailer');


// GET ROUTE
router.post('/', async (req, res) => {
    try {
        if (!await checkUserEmail(req.body.email)) {
            const userData = await User.create(req.body);
            const codeData = Math.floor(100000 + Math.random() * 900000);

            const verificationJson = {
                email: req.body.email,
                code: codeData
            }
            const verificationData = await Verification.create(verificationJson);
            if (verificationData) {
                mailer.SendVerification(verificationJson);
            }

            res.status(200).json(userData);

        } else {
            res.status(200).json({ message: 'Email already in use.' });
        }

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

async function checkUserEmail(email) {
    try {
        const user = await User.findOne({ where: { email } });
        return !!user; // Returns true if user exists, false if user is null
    } catch (error) {
        console.error('Error checking user email:', error);
        return false; // Return false in case of any error
    }
}

// POST ROUTE
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
        const data = userData.get({ plain: true });

        console.log(data);
        const validPassword = await userData.checkPassword(req.body.password);

        if (!data.isVerified) {

            const verificationData = await Verification.findOne({ where: { email: req.body.email } });
            const verificationdata = verificationData.get({ plain: true });

            if (verificationdata) {
                mailer.SendVerification(verificationdata);
            }
            res.status(200).json({ message: 'Your Email is not verified' });
            return;
        } else if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' }); 
            return;
        } else if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' }); 
            return;
        } else {
            req.session.save(() => {
                req.session.user_id = userData.id;
                req.session.logged_in = true;

                res.status(200).json({ user: userData, message: 'You are now logged in!' });
            });
        }


    } catch (err) {
        res.status(400).json(err);
    }
});

// LOGOUT ROUTE
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
module.exports = router;