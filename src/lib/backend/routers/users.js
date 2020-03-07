//子路由

//引入模块
const express = require("express");
const query = require('../db/mysql');
const { create, verify } = require("./token");
const Router = express.Router();  //路由设置

const bodyParser = require("body-parser");

let urlencodedParser = bodyParser.urlencoded({ extended: false });

/*
    用户管理：
        * 验证用户名是否存在 完成
        * 注册 完成
        * 登陆
        * 修改密码
        * 删除xx用户
        * 清空用户
        * 数据渲染 分页 完成
*/

//查询所有的用户信息
Router.get('/all', async (req, res) => {
    let { page, num } = req.query;
    // console.log(page,num);
    page = page || 1; //设置默认值
    num = num || 2;//设置默认值
    let index = (page - 1) * num;
    let str = `SELECT * FROM user LIMIT ${index},${num}`;
    let data = await query(str);
    // console.log(data);
    let sql = 'SELECT * FROM user';
    let data2 = await query(sql);

    let result = {};
    if (data.length) {
        //成功返回的数据
        let pages = Math.ceil(data2.length / num);
        result = {
            type: 1,
            msg: "success",
            page,
            num,
            pages,
            datalist: data

        }
    } else {
        //失败返回的数据
        result = {
            type: 0,
            msg: "error",
            datalist: []
        }
    }
    res.send(result);
});

//验证用户名是否存在
Router.get('/checkname', async (req, res) => {
    // console.log(req);
    let { name } = req.query;
    if (name) {
        let sql = `SELECT * FROM user WHERE username='${name}'`;
        let data = await query(sql);
        let result = {};
        if (data.length) {
            result = {
                type: 0,
                msg: '不能注册'
            }
        } else {
            result = {
                type: 1,
                msg: '可以注册'
            }
        }
        res.send(result); //无论失败与成功都需要响应给客户端

    }
    res.send('数据不能为空');
});

//注册功能
Router.post('/reg', urlencodedParser, express.json(), async (req, res) => {
    // let obj = req.body;
    // console.log(req.body);
    let { name, password, email } = req.body;//解构
    // console.log(name, password ,email);
    if (name && password && email) {
        let sql = `INSERT INTO user(username,password,email) VALUES('${name}','${password}','${email}')`;
        let data = await query(sql);
        // console.log(data);
        let result = {};
        if (data.affectedRows) {
            //插入成功
            result = {
                type: 1,
                msg: '注册成功'
            }
        } else {
            //插入失败
            result = {
                type: 0,
                msg: '注册失败'
            }
        }
        res.send(result);
    } else {
        res.send('请填写全部数据');
    }

});
/* Router.post('/reg', urlencodedParser, async (req, res) => {
    let { name, password, phone } = req.body;
    if (name) {
        let sql = `SELECT * FROM user WHERE username='${name}'`;
        let data = await query(sql);
        let result = {};
        if (data.length) {
            result = {
                type: 0,
                msg: '该用户已被注册'
            }
        } else {
            if (name && password && phone) {
                let sql = `INSERT INTO user (username,password,phone) VALUES ('${name}','${password}','${phone}')`;
                let data = await query(sql);
                // console.log(data);
                result = {};
                if (data.affectedRows) { //affectedRows 受影响的行
                    result = {
                        type: 1,
                        msg: '注册成功'
                    }
                } else {
                    result = {
                        type: 0,
                        msg: '注册失败'
                    }
                }
                res.send(result)
            }
        }
        res.send(result); //无论失败与成功都需要响应给客户端

    }
}); */

//登录功能
Router.get('/login', urlencodedParser, async (req, res) => {
    let { name, password, keep } = req.query;
    // console.log(name,password,keep);
    if (name && password) {
        let sql = `SELECT * FROM user WHERE username='${name}' AND  password='${password}'`;
        let data = await query(sql);
        // console.log(data[0].uid)
        let result = {};
        if (data.length) {
            let token = '';
            if (keep) {
                token = create(password);
                // console.log(token);
            }
            result = {
                type: 1,
                msg: '登录成功',
                name,
                id:data[0].uid,
                token
            }
        } else {
            result = {
                type: 0,
                msg: '登录失败',
                token:''
            }
        }
        res.send(result); //无论失败与成功都需要响应给客户端

    }
    res.send('数据不能为空');
});

//删除功能
Router.delete('/del/:id', async (req, res) => {
    let { id } = req.params;
    let sql = `DELETE FROM user WHERE uid=${id}`;
    let data = await query(sql);
    // console.log(data)
    let result = {};
    if (data.affectedRows) {
        result = {
            type: 1,
            msg: "删除成功"
        }
    } else {
        result = {
            type: 0,
            msg: "删除失败"
        }
    }
    res.send(result);
});

//删除全部
Router.delete('/delall', urlencodedParser, async (req, res) => {
    let { id } = req.body;
    // console.log(id)
    let sql = `DELETE FROM user WHERE uid in(${id})`
    let data = await query(sql);
    let result = {};
    if (data.affectedRows) {
        result = {
            type: 1,
            msg: "删除成功"
        }
    } else {
        result = {
            type: 0,
            msg: "删除失败"
        }
    }
    res.send(result);
});

//修改功能
Router.put('/update/:id', urlencodedParser, async (req, res) => {
    let { id } = req.params;
    let obj = req.body;
    let msg = "";
    for (let key in obj) {
        msg += key + "=" + `'${obj[key]}'` + ",";
    }
    msg = msg.slice(0, -1);
    console.log(msg)
    let sql = `UPDATE user SET ${msg} WHERE uid=${id}`;
    let data = await query(sql);
    console.log(data);
    let result = {};
    if (data.affectedRows) {
        result = {
            type: 1,
            msg: "修改成功"
        }
    } else {
        result = {
            type: 0,
            msg: "修改失败"
        }
    }
    res.send(result);
});

//效验token:1.是否被串改 2.是否在有效期
Router.get('/ver', (req, res) => {
    let { token } = req.query;
    let result = verify(token);
    let data = {};
    if (result) {
        data = {
            type: 1,
            msg: "效验通过"
        }
    } else {
        data = {
            type: 0,
            msg: "效验失败"
        }
    }
    res.send(data);
});

module.exports = Router;