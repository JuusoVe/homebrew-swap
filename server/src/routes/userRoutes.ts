import { NextFunction, Request, Response, Router } from 'express';
import User from '../models/userModel';
import passport from 'passport';
import { authentication } from "../utils/authentication";

const router: Router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {

    console.log('req received')

    const user = new User();
  
    user.username = req.body.displayName;
    user.email    = req.body.email;
    user.setPassword(req.body.password);

    return user.save()
      .then(() => {
        return res.json({user: user.toAuthJSON()});
      })
      .catch(next);
  
  });



// router.post('/user/login', (req: Request, res: Response, next: NextFunction) => {

//     if (!req.body.user.email) {
//       return res.status(422).json({errors: {email: "Can't be blank"}});
//     }
  
//     if (!req.body.user.password) {
//       return res.status(422).json({errors: {password: "Can't be blank"}});
//     }
  
//     passport.authenticate('local', {session: false}, (err, user, info) => {
//       if (err) {
//         return next(err);
//       }
  
//       if (user) {
//         user.token = user.generateJWT();
//         return res.json({user: user.toAuthJSON()});
  
//       } else {
//         return res.status(422).json(info);
//       }
//     })(req, res, next);
  
//   });
  
  
  export const UserRoutes: Router = router;