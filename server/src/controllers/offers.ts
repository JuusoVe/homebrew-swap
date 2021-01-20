import { Request, Response } from 'express'
import { IOffer, IOfferDocument } from '../type'
import { toNewOffer } from '../utils/parser'
import mongoose from 'mongoose'
const Offer = require('../models/offerSchema')
const offersRouter = require('express').Router()

// offersRouter.get('/', (_req: Request, res: Response) => {
//   const offerData = offerService.getOffers();
//   res.send(offerData);
// });

// router.get('/:id', (_req, res) => {
//   const offer: offer | undefined = offerService.getById(_req.params.id);
//   res.send(offer);
// });


//this gets public info only, doesnt populate owner
offersRouter.get('/', async (_req: Request, res: Response) => {
  const offers = await Offer
  .find({})

  res.json(offers.map((offer: { toJSON: () => any }) => offer.toJSON()))
});

offersRouter.post('/', async (req: Request, res: Response) => {

    const parsedOffer: Omit<IOffer, "id"> = toNewOffer(req.body)

    const offer = new Offer({
      ...parsedOffer,
      _id: new mongoose.Types.ObjectId()
      //user id need to be handled separately later, check blogs
    })

    const savedOffer = await offer.save()

    res.json(savedOffer.toJSON())

});

// router.post('/:id/entries', (req, res) => {
//   try {
//     const newEntry: Entry = toNewEntry(req.body);
//     const offerId: string = req.params.id;
//     const offer: offer  = offerService.addEntryToId(newEntry, offerId);
//     res.json(offer);
//   } catch (e) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     res.status(400).send(e.message);
//   } 
// });

module.exports = offersRouter