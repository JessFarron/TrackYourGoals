const router = require('express').Router();
const { Objective } = require('../../Models');
const withAuth = require('../../utils/auth');

// POST ROUTE
router.post('/', withAuth, async (req, res) => {
    try {
        if (req.body.target_quantity > 0) {
            const objectiveData = await Objective.create({
                ...req.body,
                user_id: req.session.user_id,
            });
            res.status(200).json(objectiveData);
        } else {
            res.status(200).json({ message: 'Cannot use negative number as target amount' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT ROUTE
router.put('/:id', withAuth, async (req, res) => {
    try {

        if (req.body.target_quantity > 0) {
            {
                const objectiveData = await Objective.update(
                    req.body, { where: { id: req.params.id, user_id: req.session.user_id } }
                );

                if (!objectiveData) {
                    return res.status(404).json({ message: 'Objective not found' });
                }
                res.status(200).json(objectiveData);
            }
        } else {
            res.status(200).json({ message: 'Cannot use negative number as target amount' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

// DELETE ROUTE
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const objectiveData = await Objective.destroy({ where: { id: req.params.id, user_id: req.session.user_id } }
        );

        res.status(200).json(objectiveData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;