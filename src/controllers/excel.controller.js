const db = require("../models");
const AWB = db.awbs;
const db1 = require("../order/db")
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).json("Please upload an excel file!");
    }
    const manager_id = req.params.id;
    console.log(manager_id)

    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      if (rows[0][0] !== "awb_number") {
        return res.status(500).send({
          message: "Enter valid file",
        });
      }
      rows.shift();

      let awbs = [];

      rows.forEach((row) => {
        let awb = {

          awb_number: row[0]
        };

        awbs.push(awb);
      });

      AWB.bulkCreate(awbs)
        .then(() => {
          db1.query(`update sale s  inner join awbs a on s.awb_code=a.awb_number set s.manager_id=?`, [manager_id], (err, result) => {
            if (err) throw err;

          })
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!Please select unique data",
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getAwbs = (req, res) => {
  AWB.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving awbs.",
      });
    });
};

const download = (req, res) => {
  AWB.findAll().then((objs) => {
    let awbs = [];

    objs.forEach((obj) => {
      awbs.push({
        id: obj.id,
        awb_number: obj.awb_number,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("AWBS");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "awb_number", key: "awb_number", width: 25 },
    ];

    // Add Array Rows
    worksheet.addRows(awbs);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "awbs.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

const downloadReport = (req, res) => {
  const fromDate = req.body.fromDate;
  const toDate = req.body.toDate;


  db1.query(`select s.awb_code,s.order_id,m.name "manager_name",s.delivery_boy_name,s.order_type,s.delivery_type,s.del_status,s.grand_total,sh.name "user_name",u.phone,sh.address
  from sale s  
  inner join awbs a on  a.awb_number = s.awb_code
  left join Managers m on m.id=s.manager_id
  inner join shipping_address sh on sh.unique_id = s.shipping_address
  left join userFromSite u on sh.user_id=u.user_id 
  where (s.del_status='Picked Up' or s.del_status='Delivered') and (s.delivered_date between ? and ?) and 
  (s.payment_type ='COD' or s.payment_type= 'cash_on_delivery') order by delivery_boy_name asc`, [fromDate, toDate], (err, objs) => {
    if (err) throw err;
    let data = [];

    objs.forEach((obj) => {
      data.push({
        awb_code: obj.awb_code,
        order_id: obj.order_id,
        manager_name: obj.manager_name,
        delivery_boy_name: obj.delivery_boy_name,
        order_type: obj.order_type,
        delivery_type: obj.delivery_type,
        del_status: obj.del_status,
        grand_total: obj.grand_total,

        user_name: obj.user_name,
        phone: obj.phone,
        address: obj.address

      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("CashcollectbyDeliveryBoy");

    worksheet.columns = [
      { header: "awb code", key: "awb_code", width: 25 },
      { header: "Order_id", key: "order_id", width: 25 },
      { header: "Manager Name", key: "manager_name", width: 25 },
      { header: "Delivery Boy Name", key: "delivery_boy_name", width: 25 },
      { header: "Order type", key: "order_type", width: 25 },
      { header: "Delivery type", key: "delivery_type", width: 25 },
      { header: "Delivery Status", key: "del_status", width: 25 },
      { header: "Total Amount", key: "grand_total", width: 25 },

      { header: "Customer Name", key: "user_name", width: 25 },
      { header: "Phone", key: "phone", width: 25 },
      { header: "Address", key: "address", width: 250 }
    ];

    // Add Array Rows
    worksheet.addRows(data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "cashCollectionReport.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

module.exports = {
  upload,
  getAwbs,
  download,
  downloadReport
};
