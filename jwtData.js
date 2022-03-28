let users = [
    {id:1, name:"John", password:"john", role:"customer"},
    {id:2, name:"Sarah", password:"sarah",role:"admin"},
    {id:3, name:"George", password:"george",role:"customer"},
    {id:4, name:"Anna", password:"anna",role:"admin"},
    {id:5, name:"Taslim", password:"taslim",role:"admin"},
    {id:6, name:"Ankita", password:"ankita",role:"customer"},
];


let orders = [
    {orderId: 1, userId: 1, qty: 10, value: 55},
    {orderId:2, userId: 2, qty: 12, value: 56},
    {orderId: 3, userId: 3, qty: 11, value: 57},
    {orderId: 4, userId: 4, qty: 13, value: 67},
    {orderId: 5, userId: 1, qty: 15, value: 62},
    {orderId: 6, userId: 2, qty: 46, value: 78},
    {orderId: 7, userId: 2, qty: 56, value: 79},
    {orderId: 8, userId: 1, qty: 49, value: 45}
];

module.exports = {users, orders}