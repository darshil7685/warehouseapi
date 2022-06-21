const express = require("express");
const router = express.Router();
const excelController = require("../controllers/excel.controller");
const upload = require("../_middleware/upload");

// const routes = (app) => {
router.post("/upload/:id", upload.single("file"), excelController.upload);
router.get("/awbs", excelController.getAwbs);

router.get("/download", excelController.download);
router.post('/downloadReport', excelController.downloadReport);

// };

module.exports = router;