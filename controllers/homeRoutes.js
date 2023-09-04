const router = require('express').Router();
const { User, Transaction, Objective } = require('../Models');
const withAuth = require('../utils/auth');

// All the GET routes

router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    } else {
      res.redirect('/login');
      return;
    }

  } catch (err) {
    res.status(500).json(err);
  }
});

//get login page

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  res.render('login');
});

//get profile page
router.get('/profile', withAuth, async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const userData = await User.findByPk(user_id,
      {
        attributes: ['name', 'isVerified'],
        include: [
          {
            model: Objective,
            include:
            {
              model: Transaction
            }
          }
        ]
      });
    
      if (userData.get({ plain: true }).isVerified) {
        
        const obj = {
          ...userData.get({ plain: true }),
          logged_in: req.session.logged_in
        };
        
        let total_target_sum = 0;
        let total_ongoing_sum = 0;
        obj.objectives.forEach(obj => {
          total_target_sum = total_target_sum + obj.target_quantity;
          const progress = obj.transactions.reduce((total, transaction) => total + transaction.quantity, 0);
          const progressPercent = (progress / obj.target_quantity) * 100;

          total_ongoing_sum = total_ongoing_sum + progress;
          obj.progress = progressPercent;
        });
        
        obj.total_target_sum = total_target_sum;
        obj.total_ongoing_sum = total_ongoing_sum;
        
        console.log(obj.objectives);
        
        res.render('profile', { ...obj, logged_in: req.session.logged_in });
      } else {
        res.redirect('/login');
      }
        
      } catch (err) {
        res.status(500).json(err);
        
      }
      
    });
    
//get register page
router.get('/register', (req, res) => {
  res.render('signup');
});
router.get('/confirmation', (req, res) => {

  res.render('confirmmail');
});
router.get('/recovery', (req, res) => {
  res.render('sendrecoverycode');
});
router.get('/password', (req, res) => {
  res.render('password');
});
//get goal page
router.get('/goal', (req, res) => {
  res.render('goal');
});


//get goal per id
router.get('/goal/:id', withAuth, async (req, res) => {
  const user_id = req.session.user_id;
  const objective_Data = await Objective.findByPk(req.params.id,
    {
      where: {
        user_id: user_id
      },
      include: [{ model: Transaction }]
    }
  );

  const obj = {
    ...objective_Data.get({ plain: true }),
    logged_in: req.session.logged_in
  };

  const progress = obj.transactions.reduce((total, transaction) => total + transaction.quantity, 0);
  obj.progress = progress;

  obj.transactions.forEach(ob => {
    ob.positive = (ob.quantity > 0) ? true : false;

  });

  res.render('goal', obj);

});

// get transaction page
router.get('/transaction/goal/:id', withAuth, async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const goal_id = req.params.id; 
    const userData = await User.findByPk(user_id, {
      include: [
        {
          model: Objective,
          where: { id: goal_id }, 
          include: {
            model: Transaction,
          },
        },
      ],
    });

    const objectiveData = userData.objectives[0]; 
    const transactions = objectiveData.transactions.map((transaction) => ({
      quantity: transaction.quantity,
      date: transaction.date_created 
    }));
    const transactionQuantities = transactions.map((transaction) => transaction.quantity);
    const targetQuantity = objectiveData.target_quantity; 

    res.status(200).json({ transactions, transactionQuantities, targetQuantity });
    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;