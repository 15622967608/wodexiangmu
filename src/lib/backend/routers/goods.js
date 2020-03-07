//子路由
const express = require('express');
const Router = express.Router(); //路由设置  Router==app
const query = require('../db/mysql');

const bodyParser = require("body-parser");

let urlencodedParser = bodyParser.urlencoded({ extended: false });
/*
    商品管理：
        * 数据渲染
        * 添加商品
        * 删除商品
        * 修改信息
        * 分页功能
*/

//需求：查询gid=2的商品数据，动态路由  /goods/2
Router.get('/goods/:gid', (req, res) => {
    let { gid } = req.params; //{ gid: 2 }
    // console.log(obj);
    let newarr = cartlist.filter(item => item.gid == gid);
    let data = {};
    if (newarr.length) {
        //找到数据
        data = {
            type: 1,
            msg: '成功',
            list: newarr
        }
    } else {
        //没有找到数据
        data = {
            type: 0,
            msg: '失败',
            list: []
        }
    }

    res.send(data);
});
Router.get('/list', async (req, res) => {
    // let {id}=req.query;
    // console.log(id);
    let sql = `SELECT * FROM list`;
    let data = await query(sql);
    // console.log(data)
    res.send(data)
})
//list2的商品数据 一级列表
Router.get('/list2', async (req, res) => {
    let { tid } = req.query;
    console.log(tid);
    let sql = `SELECT * FROM list2 WHERE tid='${tid}'`;
    // console.log(sql);
    let data = await query(sql);
    // console.log(data);
    res.send(data);
})
//商品列表
Router.get('/goods', async (req, res) => {
    let { type, gid } = req.query;
    let sql = `SELECT * FROM goods WHERE gid=${gid} And type='${type}'`;
    let data = await query(sql);
    res.send(data);
})

Router.get('/addcart', urlencodedParser, async (req, res) => {
    let {cid, gid, uid, uname, price, num, gurl } = req.query;
    // console.log(gid, cid);
    let str = `SELECT * FROM cart WHERE uid=${uid} AND goodid=${cid}`;
    let data = await query(str);
    let result = {}
    if (data.length) {
        let sql = `UPDATE cart SET num=num+${num} WHERE uid =${uid} AND goodid=${cid}`;
        let data1 = await query(sql);
        if (data1.affectedRows) {
            result = {
                type: 1,
                msg: "修改"
            }
        }
    } else {
        let sql = `INSERT INTO cart (goodid,tid,uid,uname,price,num,gurl) VALUES (
        ${cid},${gid}, ${uid}, '${uname}', ${price}, ${num},'${gurl}')`;
        let data = await query(sql);
        let result = {};
        if (data.affectedRows) {
            result = {
                type: 1,
                msg: '添加成功'
            }
        } else {
            result = {
                type: 0,
                msg: '添加失败'
            }
        }
        res.send(result);
    }
    res.send(result);
});

Router.get('/goodlist', async (req, res) => {
    let { cid } = req.query;
    let sql = `SELECT * FROM goods WHERE cid=${cid}`;
    let data = await query(sql);
    res.send(data);
})

//插入商品订单信息
Router.post('/goodinsert', urlencodedParser, express.json(), async (req, res) => {
    console.log(req.body);
    let { gid, uid, uname, price, num, gurl } = req.body;
    let sql = `INSERT INTO cart (gid,uid,uname,price,num,gurl) VALUES (
        ${gid}, ${uid}, '${uname}', ${price}, ${num},'${gurl}')`;
    let data = await query(sql);
    let result = {};
    if (data.affectedRows) {
        result = {
            type: 1,
            msg: '添加成功'
        }
    } else {
        result = {
            type: 0,
            msg: '添加失败'
        }
    }
    res.send(result);
})

//查询购物车列表
Router.get('/goodcart', urlencodedParser, express.json(), async (req, res) => {
    let { gid, uid, num } = req.query;
    let sql = `SELECT * FROM cart WHERE uid=${uid} AND gid=${gid} AND num=${num}`;
    let data = await query(sql);
    res.send(data);
})

//修改订单数量
Router.put('/updategood', urlencodedParser, express.json(), async (req, res) => {
    // console.log(req.body);
    let { goodid, uid, num } = req.body;
    let sql = `UPDATE cart SET num=${num} WHERE uid=${uid} AND goodid=${goodid}`;
    let data = await query(sql);
    // console.log(data);
    let result = {};
    if (data.changedRows) {
        result = {
            type: 1,
            msg: '修改成功'
        }
    } else {
        result = {
            type: 0,
            msg: '修改失败'
        }
    }
    res.send(result);
})

//查询订单列表数据
Router.get('/cartlist', urlencodedParser, async (req, res) => {
    let sql = `SELECT * FROM cart`;
    let data = await query(sql);
    res.send(data);
})

//查询uid
Router.get("/cartuname", urlencodedParser, async (req, res) => {
    let { uid } = req.query;
    let sql = `SELECT * FROM cart WHERE uid='${uid}'`;
    let data = await query(sql);
    // console.log(data)
    res.send(data);
})


Router.get('/cartnum', async (req, res) => {
    let { uid } = req.query;
    // console.log(uid);
    let str = `SELECT num FROM cart WHERE uid='${uid}'`;
    let data = await query(str);
    let num = 0
    for (let i = 0; i < data.length; i++) {

        num = num + data[i].num

    }
    // console.log(num)
    let sz = {
        num
    }
    res.send(sz);
});

Router.get('/cart', urlencodedParser, async (req, res) => {
    let { uid } = req.query;
    console.log(uid);
    let str = `SELECT distinct goodid FROM cart WHERE uid='${uid}'`;
    let data = await query(str);
    // console.log(data)
    let result = []
    for (let i = 0; i < data.length; i++) {
        console.log(data[i])
        let sql = `SELECT * FROM cart,goods WHERE uid=${uid} AND goodid=${data[i].goodid} AND cid=${data[i].goodid}`;

        data1 = await query(sql);

        console.log(data1)
        result.push(data1)

    }

    res.send(result);
});

//删除
Router.get('/del', async (req, res) => {
    let { goodid, uid } = req.query;
    // console.log(cname);
    let result = {}
    let str = `DELETE FROM cart WHERE uid=${uid} AND goodid=${goodid}`;
    let data = await query(str);
    if (data.affectedRows) {
        result = {
            type: 1,
            msg: "成功"
        }
    } else {
        result = {
            type: 0,
            msg: "失败"
        }
    }
    res.send(result);
});

module.exports = Router;