const { Router } = require('express');
const router = Router();
const ftpFunctions = require('./ftp/functions.js');
const Errors = require('./other/errorsCode.json');
const logger = require('./utils/logger.js');
// router.get('/', (req, res) => {
//     res.json({"status": "success"})
// });

// router.get('/GetStaffList', (req, res) => {
//     res.json({"status": "success"})
// });

router.get('/Folders', (req, res) => {
    const { path } = req.body;
    if(path == null || path == ''){
        res.json({ "status": "bad", "errorCode": Errors[0].InvalidPathInInstallation })
        return;
    }
    ftpFunctions.GetFileList(path).then(
        function(value){
            var folders = [];
            value.forEach(element => {
                if(element.type == 2){
                    folders.push({"name": element.name});
                }
            });
            res.json({"status": "success", "Data": folders})
        },
        function(error){
            logger.error(`Error trying to read folders: ${error}`);
            res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode})
        }
    )
});

router.get('/UploadScript', (req, res) => {
    const { path } = req.body;
    if(path == null || path == ''){
        res.json({ "status": "bad", "errorCode": Errors[0].InvalidPathInInstallation })
        return;
    }
    ftpFunctions.UploadFile(path).then(
        function(value){
            res.json({"status": "success"})
        },
        function(error){
            logger.error(`Error trying to upload script to server: ${error}`);
            res.json({ "status": "bad", "errorCode": Errors[0].UnknownErrorCode})
        }
    )
});
module.exports = router;