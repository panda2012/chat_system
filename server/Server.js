var WebSocketServer = require('ws').Server;
var Lib = require("./Lib");
var EVENT_TYPE = Lib.EVENT_TYPE;
var PORT = 8888;
var wss = new WebSocketServer({
    port: PORT
});

var Tool = require("./Tool");
var Filter = require("./Filter")
var onlineUserMap = new Tool.SimpleMap();
var historyContent = new Tool.CircleList(50);
var connCounter = 1;
var uid = null;
var lastfivemsg = {};
var userinfo = {};
//获取玩家在线时长
function getUserOnlinetime(name){
}


//获取流行词
function getPopularword(){
}

wss.on('connection', function(conn) {
       conn.on('message', function(message) {
        var mData = Lib.analyzeMessageData(message);

        if(mData && mData.EVENT) {
            switch(mData.EVENT) {
            case EVENT_TYPE.LOGIN:
                // 新用户连接
                uid = connCounter;
                var newUser = {
                    'uid': connCounter,
                    'nick': Lib.getMsgFirstDataValue(mData)
                };
                console.log('User:{\'uid\':' + newUser.uid + ',\'nickname\':' + newUser.nick + '}coming on protocol websocket draft ' + conn.protocolVersion);
                console.log('current connecting counter: ' + wss.clients.length);
                console.log(uid);
                // 把新连接的用户增加到在线用户列表
                onlineUserMap.put(uid, newUser);
                console.log(onlineUserMap);
                connCounter++;
                // 把新用户的信息广播给在线用户
                for(var i = 0; i < wss.clients.length; i++) {
                    wss.clients[i].send(JSON.stringify({
                        'user': onlineUserMap.get(uid),
                        'event': EVENT_TYPE.LOGIN,
                        'values': [newUser],
                        'counter': connCounter
                    }));
                }
                break;

            case EVENT_TYPE.SPEAK:
                // 用户发言
                var content = Lib.getMsgSecondDataValue(mData);
		//替换非法字符
		
                //广播用户发言
                for(var i = 0; i < wss.clients.length; i++) {
                    wss.clients[i].send(JSON.stringify({
                        'user': onlineUserMap.get(Lib.getMsgFirstDataValue(mData)),
                        'event': EVENT_TYPE.SPEAK,
                        'values': [content]
                    }));
                }
                historyContent.add({
                    'user': onlineUserMap.get(uid),
                    'content': content,
                    'time': new Date().getTime()
                });
                break;

            case EVENT_TYPE.LIST_USER:
                // 获取当前在线用户
                conn.send(JSON.stringify({
                    'user': onlineUserMap.get(uid),
                    'event': EVENT_TYPE.LIST_USER,
                    'values': onlineUserMap.values()
                }));
                break;

            case EVENT_TYPE.LIST_HISTORY:
                // 获取最近的聊天记录
                conn.send(JSON.stringify({
                    'user': onlineUserMap.get(uid),
                    'event': EVENT_TYPE.LIST_HISTORY,
                    'values': historyContent.values()
                }));
                break;

            default:
                break;
            }

        } else {
            // 事件类型出错，记录日志，向当前用户发送错误信息
            console.log('desc:message,userId:' + Lib.getMsgFirstDataValue(mData) + ',message:' + message);
            conn.send(JSON.stringify({
                'uid': Lib.getMsgFirstDataValue(mData),
                'event': EVENT_TYPE.ERROR
            }));
        }
    });
    conn.on('error', function() {
        console.log(Array.prototype.join.call(arguments, ", "));
    });
    conn.on('close', function() {
        // 从在线用户列表移除
        for(var k in onlineUserMap.keySet()) {
            console.log('k is :' + k);
            if(!wss.clients[k]) {
                var logoutUser = onlineUserMap.remove(k);
                if(logoutUser) {
                    // 把已退出用户的信息广播给在线用户
                    for(var i = 0; i < wss.clients.length; i++) {
                        wss.clients[i].send(JSON.stringify({
                            'uid': k,
                            'event': EVENT_TYPE.LOGOUT,
                            'values': [logoutUser]
                        }));
                    }
                }
            }
        };
        console.log('User:{\'uid\':' + logoutUser.uid + ',\'nickname\':' + logoutUser.nick + '} has leaved');
        console.log('current connecting counter: ' + wss.clients.length);

    });
});
console.log('Start listening on port ' + PORT);
fFilter.LoadFilter();
