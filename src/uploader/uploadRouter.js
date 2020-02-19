import { Router } from 'express';
import _ from 'lodash';
import fs from 'fs';
import { multerUploader, cloudinaryUploader } from './multerUploader';
import logger from '../logger';
import env from '../env';
import { genError } from '../utils';

const router = Router();

router.post('/', multerUploader.single('file'),
(req, res, next) => {
    process.nextTick(() => {
        let uploadedFile = req.file;
        let serverAlbum = env.CLOUDINARY_ALBUM;
        if (req.body.album) {
            serverAlbum = serverAlbum + '/' + req.body.album;
        }

        let public_id = `${serverAlbum}/${_.replace(uploadedFile.filename, /\.[^/.]+$/, "")}`;

        cloudinaryUploader.upload(`${uploadedFile.path}`, { public_id: public_id },
        (err, result) => {
            if (err) {
                next(genError(`Error uploading image`, `Cloudinary Uploader error: ${err.message}`));
            } else {
                logger.info(`Uploaded file to cloudinary`, { public_id: result.public_id, secure_url: result.secure_url });
                res.result = result;
                fs.unlink(uploadedFile.path, err => {
                    let errmsg = '';
                    if (err) {
                        logger.error(`Error while deleting file`, { intmsg: err.message, filepath: uploadedFile.path });
                        errmsg = err.message;
                    }

                    res.status(201).json({
                        message: `File uploaded!, with name ${result.original_filename + '.' + result.format} to album ${serverAlbum}`,
                        errmsg: errmsg,
                        url: result.secure_url,
                        result: result
                    });
                });
            }
        });

    }); // nextTick()
}); // router.post

export default router;