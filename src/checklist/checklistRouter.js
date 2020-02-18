import { Router } from 'express';
import { checkDbReady } from '../dbconn';
import Checklist from './checklistModel';
import { genError } from '../utils';
import logger from '../logger';
import moment from 'moment';

const router = Router();
router.use(checkDbReady);

router.post('/', (req, res, next) => {
    process.nextTick(() => {
        let newChecklist = new Checklist();
        newChecklist.description = req.body.description;
        newChecklist.userid = req.user.id;
        newChecklist.createdBy = req.user.id;

        newChecklist.save((err) => {
            if (err) {
                next(genError(`cannot create checklist`, err.message));
            } else {
                res.status(200).json({
                    message: `checklist created`,
                    checklist: newChecklist
                });
            }
        });
    });
}); // router.post

router.get('/', (req, res, next) => {
    process.nextTick(() => {
        Checklist.find({ userid: req.user.id }, (err, checklists) => {
            if (err) {
               next(genError(`cannot retrieve checklists`, err.message));
            } else {
                res.status(200).json({
                    userid: req.user.id,
                    checklists: checklists 
                });
            }
        });
    });
}); // router.get

router.get('/:id', (req, res, next) => {
    process.nextTick(() => {
        Checklist.findOne({ _id: req.params.id, userid: req.user.id }, (err, checklist) => {
            if (err) {
                next(genError(`cannot retrieve checklist`, err.message));
            } else {
                let status = 200;
                let message = `checklist found`;

                if (!checklist) {
                    status = 404;
                    message = `checklist not found`;
                }

                res.status(status).json({
                    id: req.params.id,
                    message: message,
                    checklist: checklist
                });    
            }
        });
    });
}); // router.get/id

router.put('/:id', (req, res, next) => {
    process.nextTick(() => {
        Checklist.findOne({ _id: req.params.id, userid: req.user.id }, (err, checklist) => {
            if (err) {
                next(genError(`cannot update checklist`, err.message));
            } else {
                if (!checklist) {
                    next(genError(`checklist not found`, `checklist with id ${req.params.id} not found`, 404));
                } else {
                    checklist.description = req.body.description;
                    checklist.updatedBy = req.user.id;
                    checklist.updatedOn = moment();
                    checklist.save((err, chk) => {
                        res.status(200).json({
                            id: req.params.id,
                            message: `checklist updated`,
                            checklist: chk
                        });
                    });
                }
            }
        });
    });
}); //router.put

router.delete('/:id', (req, res, next) => {
    process.nextTick(() => {
        Checklist.findOneAndDelete({ _id: req.params.id, userid: req.user.id }, (err, chk) => {
            if (err) {
                next(genError(`cannot delete checklist`, err.message));
            }

            if (!chk) {
                next(genError(`checklist not found`, `checklist ${req.params.id} not found`, 404));
            } else {
                logger.info(`deleted checklist`, { id: req.params.id, userid: req.user.id });
                res.status(200).json({
                    id: req.params.id,
                    message: `checklist deleted`,
                    checklist: chk
                });
            }
        });
    });
}); // router.delete

export default router;