//商品列表页
Router.get('/list1', async (req, res) => {
        let {
            cid
        } = req.query;
        let str = `SELECT DISTINCT title FROM goodslist4`
        let data = await query(str);
        console.log(data);
    
        let result = [];
        if (data.length) {
            for (let i = 0; i < data.length; i++) {
                var str2 = `SELECT * FROM goodslist4 WHERE cid=${cid} AND title = '${data[i].title}'`
                var data2 = await query(str2);
                var obj = {
                    id: data[i].id,
                    title: data[i].title,
                    // goodslist:data2
                }
                if (data2.length != 0) { //判断data2是否为空，是则不要不是则要
                    obj.goodslist = data2
                    result.push(obj);
                }
            }
            res.send(result)
        }
    });