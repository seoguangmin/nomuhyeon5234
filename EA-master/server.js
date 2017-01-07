var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
 
app.get('/index.js', function(req, res){
    res.sendFile(__dirname + '/index.js');
});
 
app.get('/index.css', function(req, res){
    res.sendFile(__dirname + '/index.css');
});

ip = function (sockets) {
    return sockets.id;
    //return sockets.request.connection.remoteAddress.substring(7,sockets.request.connection.remoteAddress.length);
}

function getUserIP(req){
    var ipAddress;

    if(!!req.hasOwnProperty('sessionID')){
        ipAddress = req.headers['x-forwarded-for'];
    } else{
        if(!ipAddress){
            var forwardedIpsStr = req.header('x-forwarded-for');

            if(forwardedIpsStr){
                var forwardedIps = forwardedIpsStr.split(',');
                ipAddress = forwardedIps[0];
            }
            if(!ipAddress){
                ipAddress = req.connection.remoteAddress;
            }
        }
    }
    return ipAddress;
} 

io.on('connection', function(socket){
    console.log('connect : '+ip(socket))
    // 누군가 접속하면
    //console.log('socket connect : '+ip(socket));
    // 모두에게 대화명 요청
    
    
    socket.on('connection', function(){ 
        io.emit('getname','');
    });
    
    // 대화명을 알려줬으면
    socket.on('setname', function(name){ 
        // 전달받은 (소켓 고유번호, 대화명)짝을
        var data = {
            name : name,
            socket : ip(socket)
        }
        //  
        // 모두에게 전달
        io.emit('setname',data);
    });

    // 메시지를 전달받았으면
    socket.on('message', function(msg){
        // 그대로 모두에게 전달
        io.emit('message', msg);
        // 대화명 및 소켓 세팅
        var data = {
            name : msg[0],
            socket : ip(socket)
        };
        // 이름 바꿨어요 모두에게 공지
        io.emit('setname',data);
        //console.log(data)
        console.log(ip(socket)+', '+msg[0]+' : '+msg[1])
    });

    // 접속이 끊겼으면
    socket.on('disconnect', function(){ 
        // 모두에게 전달
        var data = {
            name : '',
            socket : ip(socket)
        }
        io.emit('setname',data);
        console.log('disconnect : '+ ip(socket));
    });
    
    // 이쪽이에요
    socket.on('A', function(recieveData){
        var sendData=recieveData
        io.emit('refresh',sendData);
    });
    
    // 버튼 위치 공유하기 - 그대로 방송
    socket.on('run', function(style){ 
        io.emit('run',style);
    });
    
    // 파일 공유 -> 추후 메시지와 통합 필요!
    socket.on('file',function(msg){
        io.emit('file',msg);

        // 이름 바꿨어요 모두에게 공지
        var data = {
            name : msg[0],
            socket : ip(socket)
        };
        io.emit('setname',data);
    });
});
http.listen(process.env.PORT, function(){
    console.log('SERVER IS READY FOR ['+process.env.IP+':'+process.env.PORT+']');
    // 원래는 localhost IP와 80번 포트 (웹)을 사용하나, cloud9 정책에 의해 process.env.IP|PORT 사용
});
// 여기 보고 계신가요
// 네
// 자 그럼 여기서 Run을 누르기전에
// 서버를 내릴게요 ..
//네..
// 서버를 내렸어요 메시지가 안보이죠 .. ??
// 네 안보이네요..
// node - 창을 Terminal 이라고 하는데요, 이게 없어지면 Alt + T 누르시면 새로 생겨요
// 자 그럼 이상태에서 Run을 눌러보시면 ..
// nodemon index.js 입력하셔서 다시 올려보세요
// 명령어를 입력할 수 있는 창이 없을경우 Alt T를 사용
// Run으로 생긴 터미널은 명령어 입력 불가 
// 서버 실행방법 정리
// 1. 위의 index.js 탭 선택 후 Run 버튼 클릭 > 실행
//    아래의 index.js 창 닫기 > 종료
// 2. 아래의 node - 창에서 node index.js 입력 후 엔터 > 실행
//    Ctrl + C > 종료


