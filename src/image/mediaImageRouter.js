import { Router } from 'express';
import MediaImage from './mediaImageModel';
import { genError } from '../utils';
import { cloudinaryApi } from '../uploader/multerUploader';

const router = Router();

router.get('/', (req, res, next) => {
    process.nextTick(() => {
        MediaImage.find({}, (err, mediaImages) => {
            if (err) {
                next(genError(`Error retrieving `, err.message));
            }

            res.status(200).json({
                mediaImages
            });
        });
    });
}); // router.get

router.get('/:id', (req, res, next) => {
    process.nextTick(() => {
        MediaImage.findById(req.params.id, (err, mediaImage) => {
            if (err) {
                next(genError(`Error retrieving `, err.message));
            }
            
            res.status(200).json({
                id: req.params.id,
                mediaImage
            });
        });
    });
}); // router.get(id)

router.delete('/', (req, res, next) => {
    if (!req.body.public_ids) {
        next(genError(`require public_ids as array of public_id`, req.body.public_ids));
    }

    process.nextTick(() => {
        cloudinaryApi.delete_resources(req.body.public_ids, (err, result) => {
            if (err) {
                next(genError(`Error deletion on cloudinary`, err.message));
            } else {
                req.body.public_ids.forEach(id => {
                    MediaImage.findOneAndDelete({ public_id: id }, (err, media) => {
                        if (err) {
                            next(genError(`Cannot remove media image with public_id: ${id}`, err.message));
                        }
                    });
                });

                res.status(200).json({
                    message: `Image deleted`,
                    public_ids: req.body.public_ids
                });
            }
        });
    });
}); // router.delete

export default router;