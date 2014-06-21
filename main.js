/**
 * Created by TYOTANN on 2014/6/20.
 */

var qiniu = require('qiniu');

var logger = require('./log4jsCfg').logger("main");

logger.info("开始进行七牛云存储清理工作");

var bucketName = "crm-iappk-com";
qiniu.conf.ACCESS_KEY = '8cFDsP74lYGBD63SqewX3FWYC4gxt-UYhIgU1JEV';
qiniu.conf.SECRET_KEY = '2DAxlV-TnI17Kqq2NttbNpZMdoOT-JiuwmITJNHC';

var prefix = "download";

//前7天的time
var v_checkTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 3;


var client = new qiniu.rs.Client();

//run~
f_list(null);


function f_list(v_marker) {

    qiniu.rsf.listPrefix(bucketName, null, v_marker, 1000, function (err, ret) {

        if (!err) {

            if (ret.marker) {
                f_list(ret.marker);
            }

            if (ret.items && ret.items.length > 0) {

                var v_fileEntries = [];

                for (var idx in ret.items) {

                    var v_file = ret.items[idx];

                    //判断系统时间<设定时间，则删除
                    if (v_file.putTime / 10000 < v_checkTime) {
                        v_fileEntries.push(new qiniu.rs.EntryPath(bucketName, v_file.key));
                    }
                }

                f_remove(v_fileEntries);
            }
        } else {
            // http://docs.qiniu.com/api/file-handle.html#list
            console.log(err)
        }
    });

};


function f_remove(v_fileEntries) {

    if (v_fileEntries && v_fileEntries.length > 0) {

        logger.info('删除处理结束:');
        logger.info(v_fileEntries);

        client.batchDelete(v_fileEntries, function (err, ret) {
            if (!err) {
                for (var i in ret) {
                    if (ret[i].code !== 200) {
                        console.log('文件删除失败:' + ret[i].code, ret[i].data);
                    }
                }
            } else {
                console.log(err);
            }

        });
    }

};



