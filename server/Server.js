var WebSocketServer = require('ws');
var Lib = require("./Lib");
var EVENT_TYPE = Lib.EVENT_TYPE;
var PORT = 8888;
var wss = new WebSocketServer.Server({ port :PORT});
var Tool = require("./Tool");
var Filter = require("./Filter")
var ft = new Filter();
var onlineUserMap = new Tool.SimpleMap();
var historyContent = new Tool.CircleList(50);
var connCounter = 1;
var uid = null;
var lastfivemsg = {};
var userinfo = {};

//get online user time
function getUserOnlinetime(name){
}


//get popular word
function getPopularword(){
}

//check the chat include special world
function checkSpecword(str,spec){
}

// 广播用户消息, toUser=-1 表示全员广播
function send_user_message(toUser, owner, message) {
    // 广播
    if (toUser === -1) {
	wss.clients.forEach(function (client) {
	   // console.log("******************send_user_message");
	   // console.log(JSON.stringify(client));
	    if (client.readyState === WebSocketServer.OPEN) {
		client.send(message);
	    }
	});
	return;
    }

    // 发给特定用户
    wss.clients.forEach(function (client) {
	if (client.user === toUser && client.readyState === WebSocketServer.OPEN) {
	    client.send(message);
	    return;
	}
    });
}

wss.on('connection', function(conn) {
       conn.on('message', function(message) {
        var mData = Lib.analyzeMessageData(message);

        if(mData && mData.EVENT) {
            switch(mData.EVENT) {
            case EVENT_TYPE.LOGIN:
                // new  user connected
                uid = connCounter;
                var newUser = {
                    'uid': connCounter,
                    'nick': Lib.getMsgFirstDataValue(mData)
                };
                console.log('User:{\'uid\':' + newUser.uid + ',\'nickname\':' + newUser.nick + '}coming on protocol websocket draft ');
                //console.log('current connecting counter: ' + JSON.stringify(wss));
                //console.log(uid);
                //add new user to userlist
                onlineUserMap.put(uid, newUser);
                //console.log(onlineUserMap);
                connCounter++;
                // broadcast new userinfo to online user
		send_user_message(-1,conn.user,JSON.stringify({
		    'user': onlineUserMap.get(uid),
		    'event': EVENT_TYPE.LOGIN,
		    'values': [newUser],
		    'counter': connCounter
		}));
              
                break;

            case EVENT_TYPE.SPEAK:
                //user chat 
                var content = Lib.getMsgSecondDataValue(mData);
		//replace the Illegal words
		//content = ft.check()
		if (checkSpecword(content,"/popular")==true){
		    content = getPopularword();
		}
		else if(checkSpecword(content,"/stats")==true){
		    content = getUserOnlinetime(Lib.getMsgFirstDataValue(mData));
		}
		
                //broadcast user chat
		send_user_message(-1,conn.user,JSON.stringify({
		    'user': onlineUserMap.get(Lib.getMsgFirstDataValue(mData)),
		    'event': EVENT_TYPE.SPEAK,
		    'values': [content]
		}));
                
                historyContent.add({
                    'user': onlineUserMap.get(uid),
                    'content': content,
                    'time': new Date().getTime()
                });
                break;

            case EVENT_TYPE.LIST_USER:
                // get online user
                conn.send(JSON.stringify({
                    'user': onlineUserMap.get(uid),
                    'event': EVENT_TYPE.LIST_USER,
                    'values': onlineUserMap.values()
                }));
                break;

            case EVENT_TYPE.LIST_HISTORY:
                //get recent chat history
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
            //log error
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
        //del user from user list
        for(var k in onlineUserMap.keySet()) {
            console.log('k is :' + k);
            if(!wss.clients[k]) {
                var logoutUser = onlineUserMap.remove(k);
                if(logoutUser) {
                    //broadcast logout user to online user
		    send_user_message(-1,conn.user,JSON.stringify({
			'uid': k,
			'event': EVENT_TYPE.LOGOUT,
			'values': [logoutUser]
		    }));
		 }
            }
        };
        console.log('User:{\'uid\':' + logoutUser.uid + ',\'nickname\':' + logoutUser.nick + '} has leaved');
        console.log('current connecting counter: ' + wss.clients.length);

    });
});
console.log('Start listening on port ' + PORT);
ft.LoadFilter();
