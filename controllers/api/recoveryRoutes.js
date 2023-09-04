const router = require('express').Router();
const { User, Recovery } = require('../../Models');
const mailer = require('../../utils/libs/emailer');


router.post('/', async (req, res) => {
    try {
        const email = req.body.email;

        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const codeData = Math.floor(100000 + Math.random() * 900000);

            const RecoveryJson = {
                email: req.body.email,
                code: codeData
            }
            const existingRecovery = await Recovery.findOne({
                where: { email: email },
            });

            if (existingRecovery) {
                const RecoveryData = await Recovery.update({
                    code: codeData
                }, { where: { email: email } });
                if (RecoveryData) {
                    mailer.SendRecovery(RecoveryJson);
                }
            } else {

                const RecoveryData = await Recovery.create(RecoveryJson);
                if (RecoveryData) {
                    mailer.SendRecovery(RecoveryJson);
                }
            }

            res.status(200).json({ email: email });

        } else {
            res.status(200).json({ message: 'No email registered' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/:code', async (req, res) => {
    try {

        const findRecoveryData = await Recovery.findOne({ where: { code: req.params.code } });
        const useremail = findRecoveryData.get({ plain: true }).email;

        if (findRecoveryData) {
            await User.update({ password: req.body.password }, {
                where: { email: useremail }, individualHooks: true
            });
            await Recovery.destroy({ where: { code: req.params.code, email: useremail } });
            res.redirect('/login');
        }
        else {
            res.status(400).json({ message: 'Code Not Working' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;

