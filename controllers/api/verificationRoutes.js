const router = require('express').Router();
const { User, Verification } = require('../../Models');

router.post('/:code', async (req, res) => {
    try {
        
        const findverificationData = await Verification.findOne({ where: { code: req.params.code } });
        const useremail = findverificationData.get({ plain: true }).email;
        
        if (findverificationData) {
            await User.update({isVerified: true}, {where:{email:useremail}});
            await Verification.destroy( { where: { code: req.params.code, email: useremail } });
            res.status(200).json({email: useremail});
        }
        else{
            res.status(400).json({message:'Code Not Working'});
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;

