import { NextFunction, Request, Response, Router } from 'express';
require('express-async-errors');
import IUserModel, { User } from '../models/userModel';
import passport from 'passport';
import { authentication } from '../utils/authentication';
import { SENDGRID_KEY } from "../utils/secrets";
import sgMail from '@sendgrid/mail';
import emailer from '../utils/emailer';
import { IMessage } from 'interfaces';
sgMail.setApiKey(SENDGRID_KEY);


const router: Router = Router();

//NO AUTH REQUIRED ROUTES

router.post('/register', async (req: Request, res: Response, _next: NextFunction) => {

    const user = new User();
  
    user.username = req.body.username;
    user.email    = req.body.email;
    user.setPassword(req.body.password);

    const savedUser: IUserModel = await user.save();

    return res.json(savedUser.toAuthJSON());

  });


router.post('/login', (req: Request, res: Response, next: NextFunction) => {

    if (!req.body.email) {
      return res.status(422).json({errors: {email: "Can't be blank"}});
    }
  
    if (!req.body.password) {
      return res.status(422).json({errors: {password: "Can't be blank"}});
    }
  
    passport.authenticate('local', {session: false}, (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (user) {
        return res.json(user.toAuthJSON());
  
      } else {
        return res.status(401).json(info);
      }
    })(req, res, next);
  
  });

  router.post('/message', async (req: Request, res: Response) => {

    const message: IMessage = req.body;
    const user:IUserModel = await User.findById(req.body.recipient);
    const emailResponse = await emailer.offerMsg(user, message);
    return res.json(emailResponse);
  
  });

  router.post('/reqpwreset', async (req: Request, res: Response) => {

    if (!req.body.email) {
      return res.status(422).json({ errors: { email: "not found" } });
    }

    const user: IUserModel = await User.findOne({ email: req.body.email });

    if (!user) return res.sendStatus(404).json({ errors: { user: "not found" } });

    const token = user.getResetToken();
    const emailResponse = await emailer.pwResetReq(user, token);

    return res.json(emailResponse);
  
  });

  //AUTH OPTIONAL ROUTES

  router.get('/checktoken', authentication.optional, async (req: Request, res: Response) => {

    if (req.body.authUser) return res.json({ checked: true });

    return res.json({ checked: false });


  });

  //AUTH REQUIRED ROUTES

  router.post('/pwreset', authentication.required, async (req: Request, res: Response, _next: NextFunction) => {

    const id = req.body.authUser.id;

    const user: IUserModel  = await User.findOne({ _id: id });

    if (!user) return res.sendStatus(401);

    if (req.body.authUser.hash !== user.hash) {
      return res.status(401).json({ errors: { token: "invalid or expired" }});
    }

    user.setPassword(req.body.password);

    const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true });

    await emailer.pwChangeConfirm(updatedUser);

    return res.json(user.toAuthJSON());

  });

  router.post('/changepw', authentication.required, async (req: Request, res: Response) => {

    const id = req.body.authUser.id;

    const user: IUserModel  = await User.findOne({ _id: id });

    if (!user) return res.sendStatus(401);

    const pwCheck = user.validPassword(req.body.oldPassword);

    if(!pwCheck) return res.status(401).json({ message: "old password did not match" });

    user.setPassword(req.body.newPassword);

    const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true });

    await emailer.pwChangeConfirm(updatedUser);

    return res.json(user.toAuthJSON());

  });



  export const UserRoutes: Router = router;