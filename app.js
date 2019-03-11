const request = require('request');
const signUpUrl = "https://va.idp.liveperson.net/api/account/13350576/signup";
const wsUrl = "wss://va.msg.liveperson.net/ws_api/account/13350576/messaging/consumer?v=3";
let JWT = "";
const WebSocket = require('ws');


request.post(signUpUrl, (err, res, body) =>{
        if (err) {
            console.error(err)
        }
        JWT = JSON.parse(body).jwt;
        const auth = "jwt " + JWT;
        const ws = new WebSocket(wsUrl, {headers: {Authorization: auth}});
        ws.onopen =  () => {
            ws.send(JSON.stringify({"kind":"req","id":1,"type":"cm.ConsumerRequestConversation"}));
        }
        ws.onmessage = (e) => {
            const responseObject = JSON.parse(e.data);
            const convoId = responseObject.body.conversationId;
            ws.send(JSON.stringify({"kind":"req","id":2,"type":"ms.PublishEvent",
            "body":{"dialogId":convoId,
                    "event":{"type":"ContentEvent","contentType":"text/plain",
                            "message":"My first message"}
                    }
            }))
        }
        ws.onerror = (e) => {
            console.log(e.error);
        }
} )
