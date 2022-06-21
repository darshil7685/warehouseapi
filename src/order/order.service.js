const db = require("./db.js")
const moment = require("moment");
const Razorpay = require('razorpay');



function countAll() {
    let promise = new Promise((resolve, reject) => {
        db.query(`select count(order_id)"total_assign_order" from sale where assign =true`, (err, result) => {
            if (err) reject(err);

            resolve(result);
        })
    });
    return promise;
}

function countOrderByManager(req) {
    let promise = new Promise((resolve, reject) => {
        const manager_id = req.params.id;
        db.query(`select count(order_id)"total_order" from sale where manager_id=?`, [manager_id], (err, result) => {
            if (err) reject(err);

            resolve(result);
        })
    });
    return promise;
}

function countDel_boyByManager(req) {
    let promise = new Promise((resolve, reject) => {
        const manager_id = req.params.id;
        db.query(`select count(id)"delivery_boys" from Users where manager_id=?`, [manager_id], (err, result) => {
            if (err) reject(err);

            resolve(result);
        })
    });
    return promise;
}

function viewAllOrder(req) {
    let promise = new Promise((resolve, reject) => {
        const manager_id = req.params.manager_id;
        db.query(`select s.awb_code,s.order_id,s.order_type,s.delivery_type,s.del_status,s.grand_total,s.payment_type,sh.name,u.phone,sh.address
         from sale s 
         inner join awbs a on  a.awb_number = s.awb_code
          inner join shipping_address sh on sh.unique_id = s.shipping_address 
          left join userFromSite u on sh.user_id=u.user_id where s.assign=false and s.manager_id=? `, [manager_id], (err, result) => {
            if (err) reject(err);

            resolve(result);
        })
    });
    return promise;
}

function assignOrder(req) {
    let promise = new Promise((resolve, reject) => {
        const delivery_boy_id = req.body.delivery_boy_id;
        const delivery_boy_name = req.body.delivery_boy_name;
        const manager_id = req.body.manager_id;
        const orders_ids = req.body.order_id;
        const date = moment(new Date()).format('YYYY-MM-DD');
        db.query(`update sale set delivery_boy_id=?,delivery_boy_name=?,assign_date=?,assign=true,del_status='Pending' where order_id in (?)`, [delivery_boy_id, delivery_boy_name, date, orders_ids], (err, result) => {
            if (err) reject(err);

            resolve(result);
        })
    });
    return promise;
}

function viewAllAssignedOrder(req) {
    let promise = new Promise((resolve, reject) => {
        const manager_id = req.params.manager_id;
        db.query(`select s.awb_code,s.order_id,s.order_type,s.delivery_type,s.del_status,s.grand_total,s.payment_type,sh.name "user_name",u.phone,sh.address,s.order_receive_status,s.order_payment_status 
        from sale s 
        inner join awbs a on  a.awb_number = s.awb_code 
        
        inner join shipping_address sh on sh.unique_id = s.shipping_address 
        left join userFromSite u on sh.user_id=u.user_id where s.assign=true and s.manager_id=?
        `, [manager_id], (err, result) => {
            if (err) reject(err);
            // result.forEach((result1) => {
            //     if (result1.order_receive_status == 1) {
            //         result1.order_receive_status = true
            //     } else if (result1.order_receive_status == 0) {
            //         result1.order_receive_status = false
            //     }
            //     else if (result1.order_payment_status == 1) {
            //         result1.order_payment_status = true
            //     } else if (result1.order_payment_status == 0) {
            //         result1.order_payment_status = false
            //     }
            // })
            resolve(result);
        })
    });
    return promise;
}

function getOrderByDeliveryBoyId(params) {
    let promise = new Promise((resolve, reject) => {
        const id = params.id;

        db.query(`select s.awb_code,s.order_id,s.order_type,s.delivery_type,s.del_status,s.grand_total,s.payment_type,sh.name,u.phone,sh.address 
        from sale s inner join awbs a on  a.awb_number = s.awb_code 
        inner join shipping_address sh on sh.unique_id = s.shipping_address
         left join userFromSite u on sh.user_id=u.user_id  where delivery_boy_id=?`, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}
function typeOfOrder(params) {
    let promise = new Promise((resolve, reject) => {
        const id = params.order_id;
        const type = params.order_type;
        db.query("update sale set delivery_type=? where order_id=?", [type, id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}

function statusUpdate(params) {
    let promise = new Promise((resolve, reject) => {
        const id = params.order_id;
        const del_status = params.status;
        const comment = params.comment;
        const date = moment(new Date()).format('YYYY-MM-DD');
        if (del_status == "Delivered" || "Picked Up") {
            db.query("update sale set del_status=?,comments=?,delivered_date=? where order_id=?", [del_status, comment, date, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        } else {
            db.query("update sale set del_status=?,comments=? where order_id=?", [del_status, comment, id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        }
    });
    return promise;
}

function getStatusByOrderId(params) {
    let promise = new Promise((resolve, reject) => {
        const order_id = params.order_id;

        db.query("select del_status,comments from sale where order_id=?", [order_id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}
function getOrderByStatusOfDeliveryBoy(params) {
    let promise = new Promise((resolve, reject) => {
        const delivery_boy_id = params.delivery_boy_id;
        const del_status = params.del_status;
        if (!del_status) {
            db.query(`select s.awb_code,s.order_id,s.order_type,s.del_status,s.delivery_type,s.grand_total,s.payment_type,sh.name,u.phone,sh.address
                    from sale s  
                    inner join awbs a on  a.awb_number = s.awb_code
                    inner join shipping_address sh on sh.unique_id = s.shipping_address
                    left join userFromSite u on sh.user_id=u.user_id where s.delivery_boy_id=? `, [delivery_boy_id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        } else {
            db.query(`select s.awb_code,s.order_id,s.order_type,s.del_status,s.delivery_type,s.grand_total,s.payment_type,sh.name,u.phone,sh.address
                    from sale s  
                    inner join awbs a on  a.awb_number = s.awb_code
                    inner join shipping_address sh on sh.unique_id = s.shipping_address
                    left join userFromSite u on sh.user_id=u.user_id where s.delivery_boy_id=? and del_status=?`, [delivery_boy_id, del_status], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        }
    });

    return promise;
}

function cashSummeryOfDeliveryBoy(params) {
    let promise = new Promise((resolve, reject) => {
        const id = params.id;
        db.query(`SELECT order_id,grand_total from sale where (payment_type ='COD' or payment_type= 'cash_on_delivery') and (del_status='Picked Up' or del_status='Delivered')
        and delivery_boy_id=? order by delivered_date desc`, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}

function upiSummeryOfDeliveryBoy(params) {
    let promise = new Promise((resolve, reject) => {
        const id = params.id;
        db.query(`SELECT order_id,grand_total from sale where (payment_type ='razorpay' or payment_type= 'Online Payment') and (del_status='Picked Up' or del_status='Delivered')
        and delivery_boy_id=? order by delivered_date desc`, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}

function reportDeliveredorder(params) {
    let promise = new Promise((resolve, reject) => {
        const id = params.id;
        db.query(`SELECT order_id,grand_total,delivered_date from sale where (del_status='Picked Up' or del_status='Delivered')
        and delivery_boy_id=? order by delivered_date desc `, [id], (err, result) => {
            if (err) reject(err);

            result.forEach((data) => {
                data.delivered_date = moment(data.delivered_date).format('YYYY-MM-DD');
            })
            resolve(result);
        })
    });
    return promise;
}

function cashCollectionOfAllDeliveryBoy(params) {
    let promise = new Promise((resolve, reject) => {
        const fromDate = params.fromDate;
        const toDate = params.toDate;
        if (!fromDate || !toDate) {
            throw 'Select the both Date';
        }
        db.query(`select s.awb_code,s.order_id,m.name "manager_name",s.delivery_boy_name,s.order_type,s.delivery_type,s.del_status,s.grand_total,sh.name "user_name",u.phone,sh.address
        from sale s  
        inner join awbs a on  a.awb_number = s.awb_code
        left join Managers m on m.id=s.manager_id
        inner join shipping_address sh on sh.unique_id = s.shipping_address
        left join userFromSite u on sh.user_id=u.user_id 
        where (s.del_status='Picked Up' or s.del_status='Delivered') and (s.delivered_date between ? and ?) and 
        (s.payment_type ='COD' or s.payment_type= 'cash_on_delivery') order by delivery_boy_name asc`, [fromDate, toDate], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}

function paymentCollectionOfDeliveryBoy(params) {
    let promise = new Promise((resolve, reject) => {
        const delivery_boy_id = params.delivery_boy_id;
        const payment_type = params.payment_type;

        if (!delivery_boy_id || !payment_type) {
            throw "Select Both Detail"
        }
        if (payment_type == "cash_on_delivery") {
            db.query(`select s.awb_code,s.order_id,m.name "manager_name",s.delivery_boy_name,s.order_type,s.payment_type,s.delivery_type,s.del_status,s.grand_total,
            sh.name "user_name",u.phone,sh.address
            from sale s  
            inner join awbs a on  a.awb_number = s.awb_code
            left join Managers m on m.id=s.manager_id
            inner join shipping_address sh on sh.unique_id = s.shipping_address
            left join userFromSite u on sh.user_id=u.user_id 
            where (s.del_status='Picked Up' or s.del_status='Delivered') and (s.delivery_boy_id=?) and (s.payment_type="cash_on_delivery" or s.payment_type="COD")
            order by delivery_boy_name asc`, [delivery_boy_id, payment_type], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        } else {

            db.query(`select s.awb_code,s.order_id,m.name "manager_name",s.delivery_boy_name,s.order_type,s.payment_type,s.delivery_type,s.del_status,s.grand_total,
            sh.name "user_name",u.phone,sh.address
            from sale s  
            inner join awbs a on  a.awb_number = s.awb_code
            left join Managers m on m.id=s.manager_id
            inner join shipping_address sh on sh.unique_id = s.shipping_address
            left join userFromSite u on sh.user_id=u.user_id 
            where (s.del_status='Picked Up' or s.del_status='Delivered') and (s.delivery_boy_id=?) and (s.payment_type=?)
            order by delivery_boy_name asc`, [delivery_boy_id, payment_type], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        }
    });
    return promise;
}

function deliveryBoyWiseOrder(params) {
    let promise = new Promise((resolve, reject) => {
        const fromDate = params.fromDate;
        const toDate = params.toDate;
        const delivery_boy_id = params.delivery_boy_id;
        const delivery_type = params.delivery_type;
        const del_status = params.del_status;

        if (!fromDate || !toDate) {
            throw 'Select the both Date';
        }
        if (!delivery_boy_id && (!delivery_type || !del_status)) {
            throw "Select the field"
        }

        if (delivery_boy_id && !delivery_type && !del_status) {
            db.query(`select s.awb_code,s.order_id,m.name "manager_name",s.order_type,s.delivery_type,s.del_status,s.grand_total,s.payment_type,sh.name "user_name",u.phone,sh.address
                from sale s  
                inner join awbs a on  a.awb_number = s.awb_code
                left join Managers m on m.id=s.manager_id
                inner join shipping_address sh on sh.unique_id = s.shipping_address
                left join userFromSite u on sh.user_id=u.user_id
                where s.assign=true and s.delivered_date between ? and ? and s.delivery_boy_id=?`, [fromDate, toDate, delivery_boy_id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        } else if (delivery_type && del_status && !delivery_boy_id) {
            db.query(`select s.awb_code,s.order_id,m.name "manager_name",s.order_type,s.delivery_type,s.del_status,s.grand_total,s.payment_type,sh.name "user_name",u.phone,sh.address
                from sale s  
                inner join awbs a on  a.awb_number = s.awb_code
                left join Managers m on m.id=s.manager_id
                inner join shipping_address sh on sh.unique_id = s.shipping_address
                left join userFromSite u on sh.user_id=u.user_id
                where s.assign=true and s.delivered_date between ? and ? and s.delivery_type=? and s.del_status=?`, [fromDate, toDate, delivery_type, del_status], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        } else if (delivery_type && del_status && delivery_boy_id) {
            db.query(`select s.awb_code,s.order_id,m.name "manager_name",s.order_type,s.delivery_type,s.del_status,s.grand_total,s.payment_type,sh.name "user_name",u.phone,sh.address
                from sale s  
                inner join awbs a on  a.awb_number = s.awb_code
                left join Managers m on m.id=s.manager_id
                inner join shipping_address sh on sh.unique_id = s.shipping_address
                left join userFromSite u on sh.user_id=u.user_id
                where s.assign=true and s.delivered_date between ? and ? and s.delivery_boy_id=? and s.delivery_type=? and s.del_status=?`, [fromDate, toDate, delivery_boy_id, delivery_type, del_status], (err, result) => {
                if (err) reject(err);
                resolve(result);
            })
        }
    });
    return promise;
}

function order_payment_collect1(params) {
    let promise = new Promise((resolve, reject) => {
        const code = params.awb_code;
        const status = params.status;
        const date = moment(new Date()).format('YYYY-MM-DD');
        db.query("update sale set order_payment_status=?,order_payment_date=? where awb_code=?", [status, date, code], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}

function order_status_collect1(params) {
    let promise = new Promise((resolve, reject) => {
        const code = params.awb_code;
        const status = params.status;
        const date = moment(new Date()).format('YYYY-MM-DD');
        db.query("update sale set order_receive_status=?,order_receive_date=? where awb_code=?", [status, date, code], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    });
    return promise;
}

function order_settled(params) {
    let promise = new Promise((resolve, reject) => {
        const delivery_boy_id = params.delivery_boy_id;
        db.query(`select order_id,grand_total,payment_type,order_receive_date from sale where order_receive_status=true and delivery_boy_id=? order by 
        order_payment_date desc`, [delivery_boy_id], (err, result) => {
            if (err) reject(err);
            result.forEach((data) => {
                data.order_receive_date = moment(data.order_receive_date).format('YYYY-MM-DD');
            })
            resolve(result);
        })
    });
    return promise;
}

function cash_settled(params) {
    let promise = new Promise((resolve, reject) => {
        const delivery_boy_id = params.delivery_boy_id;
        db.query(`select order_id,grand_total,payment_type,order_payment_date from sale where order_payment_status=true and delivery_boy_id=? order by 
        order_payment_date desc`, [delivery_boy_id], (err, result) => {
            if (err) reject(err);
            result.forEach((data) => {
                data.order_payment_date = moment(data.order_payment_date).format('YYYY-MM-DD');
            })
            resolve(result);
        })
    });
    return promise;
}
function payment() {
    let promise = new Promise((resolve, reject) => {

        var instance = new Razorpay({ key_id: 'rzp_test_Sa1iPLx8QlBeQz', key_secret: 'dYWhtZVPO1gFPkeOuAj3YzVf' })

        instance.qrCode.create({
            type: "upi_qr",
            name: "Store_1",
            usage: "single_use",
            fixed_amount: true,
            payment_amount: 300,
            description: "For Store 1",
            customer_id: "cust_HKsR5se84c5LTO",
            close_by: 1681615838,
            notes: {
                purpose: "Test UPI QR code notes"
            }
        }).then((result) => {
            console.log(result);
            resolve(result)
        }).catch((err) => {
            reject(err)
        })

    });
    return promise;
}


module.exports = {
    countAll, countOrderByManager, countDel_boyByManager, viewAllOrder, assignOrder, getOrderByDeliveryBoyId, typeOfOrder, statusUpdate, getStatusByOrderId, viewAllAssignedOrder, deliveryBoyWiseOrder, cashSummeryOfDeliveryBoy, upiSummeryOfDeliveryBoy,
    reportDeliveredorder, cashCollectionOfAllDeliveryBoy, getOrderByStatusOfDeliveryBoy, paymentCollectionOfDeliveryBoy, order_payment_collect1, order_status_collect1,
    order_settled, cash_settled, payment
}

