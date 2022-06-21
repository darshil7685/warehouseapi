const express = require('express');
const router = express.Router();
const orderservice = require("./order.service")

router.get('/countAssignedOrders', countAll);

router.get('/countOrdersOfManager/:id', countOrderByManager);
router.get('/countDel_boyOfManager/:id', countDel_boyByManager);
router.get('/allOrders/:manager_id', allOrder);

router.put('/assignOrder', assignOrder)
router.get('/allAssignedOrder/:manager_id', allAssignedOrder);
router.get('/getOrderByDeliveryBoy/:id', getOrderByDeliveryBoyId);
router.put('/typeOfOrder', typeOfOrder);

router.put('/statusUpdate', statusUpdate);
router.get('/getStatusByOrderId/:order_id', getStatusByOrderId);
router.get('/getOrderByStatusOfDeliveryBoy', getOrderByStatusOfDeliveryBoy)
router.get('/cashSummeryOfDeliveryBoy/:id', cashSummeryOfDeliveryBoy);
router.get('/upiSummeryOfDeliveryBoy/:id', upiSummeryOfDeliveryBoy);
router.get('/deliveredOrderList/:id', deliveredOrderList);

router.post('/cashCollectionOfAllDeliveryBoy', cashCollectionOfAllDeliveryBoy);
router.post('/paymentCollectionOfAllDeliveryBoy', paymentCollectionOfDeliveryBoy);
router.post('/deliveryBoyWiseOrder', deliveryBoyWiseOrder);

router.post('/order_payment_collect', order_payment_collect);
router.post('/order_status_receive', order_status_receive);
router.get('/order_settled/:delivery_boy_id', order_settled)
router.get('/cash_settled/:delivery_boy_id', cash_settled)

router.post('/payments/qr_codes', payment);

function payment(req, res, next) {
    orderservice.payment()
        .then(count => res.json(count))
        .catch(next);
}

function countAll(req, res, next) {
    orderservice.countAll()
        .then(count => res.json(count))
        .catch(next);
}

function countOrderByManager(req, res, next) {
    orderservice.countOrderByManager(req)
        .then(count => res.json(count))
        .catch(next);
}
function countDel_boyByManager(req, res, next) {
    orderservice.countDel_boyByManager(req)
        .then(count => res.json(count))
        .catch(next);
}

function allOrder(req, res, next) {
    orderservice.viewAllOrder(req)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}
function assignOrder(req, res, next) {
    orderservice.assignOrder(req)
        .then((orders) =>
            res.json({ message: "Assigned order to delivery boy" })
        ).catch(next)
}
function allAssignedOrder(req, res, next) {
    orderservice.viewAllAssignedOrder(req)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}
function getOrderByDeliveryBoyId(req, res, next) {
    orderservice.getOrderByDeliveryBoyId(req.params)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}
function typeOfOrder(req, res, next) {
    orderservice.typeOfOrder(req.body)
        .then((orders) =>
            res.json({ message: "Updated Successfully" })
        ).catch(next)
}
function statusUpdate(req, res, next) {
    orderservice.statusUpdate(req.body)
        .then((orders) =>
            res.json({ message: "Updated Successfully" })
        ).catch(next)
}
function getStatusByOrderId(req, res, next) {
    orderservice.getStatusByOrderId(req.params)
        .then((data) =>
            res.json(data)
        ).catch(next)
}

function getOrderByStatusOfDeliveryBoy(req, res, next) {
    orderservice.getOrderByStatusOfDeliveryBoy(req.body)
        .then((data) =>
            res.json(data)
        ).catch(next)
}
function cashSummeryOfDeliveryBoy(req, res, next) {
    orderservice.cashSummeryOfDeliveryBoy(req.params)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}


function upiSummeryOfDeliveryBoy(req, res, next) {
    orderservice.upiSummeryOfDeliveryBoy(req.params)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}
function deliveredOrderList(req, res, next) {
    orderservice.reportDeliveredorder(req.params)
        .then((orders) => {
            res.json(orders)
        }).catch(next)
}

function cashCollectionOfAllDeliveryBoy(req, res, next) {
    orderservice.cashCollectionOfAllDeliveryBoy(req.body)
        .then((data) =>
            res.json(data)
        ).catch(next)
}
function paymentCollectionOfDeliveryBoy(req, res, next) {
    orderservice.paymentCollectionOfDeliveryBoy(req.body)
        .then((data) =>
            res.json(data)
        ).catch(next)
}
function deliveryBoyWiseOrder(req, res, next) {
    orderservice.deliveryBoyWiseOrder(req.body)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}


function order_payment_collect(req, res, next) {
    orderservice.order_payment_collect1(req.body)
        .then((orders) =>
            res.json({ message: "Updated Successfully" })
        ).catch(next)
}
function cash_settled(req, res, next) {
    orderservice.cash_settled(req.params)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}
function order_settled(req, res, next) {
    orderservice.order_settled(req.params)
        .then((orders) =>
            res.json(orders)
        ).catch(next)
}
function order_status_receive(req, res, next) {
    orderservice.order_status_collect1(req.body)
        .then((orders) =>
            res.json({ message: "Updated Successfully" })
        ).catch(next)
}

module.exports = router;