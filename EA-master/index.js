var socket = io();
var category = "chat";

function init() {
	eas.init();
	eas.event.init();
	inits.chat();
}

function down() {
	if (event.keyCode == 13) {
		push.down();
		localStorage.setItem('message', "메시지");
	}
	else {
		// temp to value
		localStorage.setItem('message', document.getElementById('downleftdown').value);
	}
}

var eas;
eas = {
	init: function() {
		$('<div class="body" ></div>').appendTo($('.background'));
			$('<div class="bodyleft" id="msgbox"></div>').appendTo($('.body'));
				$('<ul id="message"></ul>').appendTo($('.bodyleft'));
			$('<div class="bodyright" id="toolbox"></div>').appendTo($('.body'));
				$('<ul class="lasttime"></ul>').appendTo($('.bodyright'));
				$('<ul id="userlist" class="userlist"></ul>').appendTo($('.bodyright'));
		$('<div class="bottom"/>').appendTo($('.background'));
			$('<div class="down"/>').appendTo($('.bottom'));
				$('<input id="upleftdown" />').appendTo($('.down'));
				$('<input id="downleftdown" onmouseover="enterdown()" onKeyDown="down()" onchange="dropfile();"/>').appendTo($('.down'));
				$('<div class="downright"/>').appendTo($('.down'));
				$('<div class="headright">삭제</div>').appendTo($('.down'));
		$('<div id="button" class="button" onmouseover="run()" onClick="click_button();" />').appendTo($('body'));
		$('<div id="zoomin" value="확대" class="zoomin" onClick="click_zoomin();" />').appendTo($('body'));
		$('<div id="zoomout" value="축소" class="zoomout" onClick="click_zoomout();" />').appendTo($('body'));
		$('<div id="initialize" value="초기화" class="initialize" onClick="click_initialize();" />').appendTo($('body'));
		$('<div id="pushon" value="푸시켜기" class="pushon" onClick="click_pushon();" />').appendTo($('body'));
		$('<div id="pushoff" value="푸시끄기" class="pushoff" onClick="click_pushoff();" />').appendTo($('body'));
		$('<a href="http://eaea.herokuapp.com/" id="home" class="home">챗홈</a>').appendTo($('body')); 
		$('<div id="backon" value="배경켜기" class="backon" onClick="click_backon();" />').appendTo($('body'));
		$('<div id="backoff" value="배경끄기" class="backoff" onClick="click_backoff();" />').appendTo($('body'));
		$('<div id="backoff" value="배경끄기" class="backoff" onClick="click_backoff();" />').appendTo($('body'));
	}
};

// dropfile -> avoid a default action by any file drag&drop ? (checking...)
function dropFile(event) {
	event.preventDefault();
}

// 문자열에서 숫자만 추출
function getNumberOnly(obj) {
	var val = obj.value;
	val = new String(val);
	var regex = /[^0-9]/g;
	val = val.replace(regex, '');

	obj.value = val;
}

// 확대
function click_zoomin() {
	// 현재 글자의 크기를 한 단계 확대
	ts('body', localStorage.getItem('size') * 1.0 + 0.1 || 4);
	// 및 로컬스토리지에 저장
	localStorage.setItem('size', localStorage.getItem('size') * 1.0 + 0.1 || 4);
}

// 축소
function click_zoomout() {
	// 현재 글자의 크기를 한 단계 축소
	ts('body', localStorage.getItem('size') * 1.0 - 0.1 || 2);
	// 및 로컬스토리지에 저장
	localStorage.setItem('size', localStorage.getItem('size') * 1.0 - 0.1 || 2);
}

// 초기화
function click_initialize() {
	// 현재 글자의 크기를 초기화
	ts('body', 3);
	// 및 로컬스토리지에 저장
	localStorage.setItem('size', 3);
}
// drag&drop file/image upload
function dropfile() {

}
eas.event = {
	init: function() {
		var downright = $('.downright');
		$(downright).bind('click', function() {
			eas.event.onClick(downright);
		});
		var headright = $('.headright');
		$(headright).bind('click', function() {
			eas.event.onClick(headright);
		});
	},
	onClick: function(o) {
		if ($(o).hasClass('hd')) {}
		if ($(o).hasClass('headright')) {
			$('#message').empty();
		}
		if ($(o).hasClass('downright')) {
			push.down();
		}
	}
};
var upleftdown = $('.upleftdown');
var downleftdown = $('.downleftdown');
var downright = $('.downright');
var lasttime = $('.lasttime');
var push;
var inits;
inits = {
	chat: function() {
		$('#upleftdown').val(localStorage.getItem('대화명') || "대화명");
		$('.downright').text("전송");
		$('.zoomin').text("확대");
		$('.zoomout').text("축소");
		$('.initialize').text("초기화");
		$('.pushon').text("푸시켜기");
		$('.pushoff').text("푸시끄기");
		$('.backon').text("배경켜기");
		$('.backoff').text("배경끄기");
		category = "chat";
		localStorage.setItem('size', localStorage.getItem('size') * 1.0 || 2);
		ts('body', localStorage.getItem('size'));
		socket.emit('connection', '');
		if (localStorage.getItem('backon') == 'false') {
			$('body').css('background-image', 'url("")');

		}
		$('#downleftdown').val(localStorage.getItem('message'));
		document.getElementById("katalk").play();
	}
};
push = {
	down: function() {
		var ulc = document.getElementById('upleftdown').value;
		var dlc = document.getElementById('downleftdown').value;
		switch (category) {
			case 'chat': // CSB
				if (ulc.length && dlc.length) // 대화명과 메시지의 길이가 모두 1 이상일 때
				// 서버로 메시지를 전송
					socket.emit('message', [ulc, dlc]);
				// 메시지 작성 란 비워주기
				document.getElementById('downleftdown').value = "";
				// 현재 작성한 대화명을 로컬 스토리지의 '대화명' 키에 저장
				localStorage.setItem('대화명', document.getElementById('upleftdown').value);
				break;
		}
	}
};

socket.on('connect', function(msg) {
	// 연결 알림
	$('#message').append($('<li class="messages">').text('연결했어요..!!'));
	// 스크롤 맨아래로 내리기
	if (document.getElementById("message") != null)
		document.getElementById("msgbox").scrollTop = document.getElementById("message").scrollHeight;
});
socket.on("disconnect", function() {
	// 연결 알림
	$('#message').append($('<li class="messages">').text('연결이 끊겼어요..ㅠㅠ'));
	// 스크롤 맨아래로 내리기
	if (document.getElementById("message") != null)
		document.getElementById("msgbox").scrollTop = document.getElementById("message").scrollHeight;
});

// 대화명 요청받은 경우
socket.on('getname', function(msg) {
	// 대화명 보내기
	if(document.getElementById('upleftdown')!=null)
	socket.emit('setname', document.getElementById('upleftdown').value || '');
});

// 대화명 전달받은 경우
socket.on('setname', function(msg) {
	// 현황판 수정
	userlistadd(msg.name, msg.socket);
});

// 메시지를 전달받은 경우
socket.on('message', function(message) {
	// 대화명과 메시지 채팅창에 표시
	$('#message').append($('<li class="messages">').text('[' + (new Date().format("hh:mm")) + '] ' + message[0] + ' : ' + message[1]));

	// 스크롤 맨아래로 내리기
	if (document.getElementById("message") != null)
		document.getElementById("msgbox").scrollTop = document.getElementById("message").scrollHeight;

	// 마지막 메시지 받은 시간 세팅
	$('.lasttime').text(new Date().format("hh:mm:ss"));
	//document.getElementById("bodyright").value = Date();

	// pushpush@
	if (localStorage.getItem('pushon') == 'true') {
		if (Notification.permission !== "granted")
			Notification.requestPermission();
		else {
			var notification = new Notification('Notification title', {
				icon: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSWcuW9ztHaAEmdfmuOuJ9xqq8SIbXIJjWFX7Afb2i_RxGLO2ZbUg',
				body: '[' + (new Date().format("hh:mm")) + '] ' + message[0] + ' : ' + message[1]
			});
			notification.onclick = function() {
				window.open("http://eas-eaea2121.c9users.io");
			};
			document.getElementById("katalk").play();
		}
	}

});

// 푸시알림 사용자 설정
function click_pushoff() {
	localStorage.setItem('pushon', 'false');
	if (Notification.permission !== "granted")
		Notification.requestPermission();
	else {
		var notification = new Notification('푸시 알림 끄기', {
			icon: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSWcuW9ztHaAEmdfmuOuJ9xqq8SIbXIJjWFX7Afb2i_RxGLO2ZbUg',
			body: '푸시 알림 껐어요 ㅎㅎ'
		});
		notification.onclick = function() {
			window.open("http://eas-eaea2121.c9users.io");
		};
	}
}

function click_pushon() {
	localStorage.setItem('pushon', 'true');
	if (Notification.permission !== "granted")
		Notification.requestPermission();
	else {
		var notification = new Notification('푸시 알림 켜기', {
			icon: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSWcuW9ztHaAEmdfmuOuJ9xqq8SIbXIJjWFX7Afb2i_RxGLO2ZbUg',
			body: '푸시 알림 켰어요 ㅎㅎ'
		});
	}
}

function click_backoff() {
	localStorage.setItem('backon', 'false');
	$('body').css('background-image', 'url("")');
}

function click_backon() {
	localStorage.setItem('backon', 'true');
	$('body').css('background-image', 'url("https://i.ytimg.com/vi/ttz4Sr0tZFg/maxresdefault.jpg")');
}

// 이쪽이에요 ㅎㅎ
function click_button() {
	var sendData = 'AOA'
	socket.emit('A', sendData)
}

//강제 새로고침 
socket.on('refresh', function() {
	window.location.reload(true);
})

socket.on('이름을 정해주세요2', function(recieveData) {
	$('#message').append($('<li>').text(recieveData));
});

// 버튼의 이동을 지시!
socket.on('run', function(style) {
	// 버튼의 속성을 실제 변경!
	var btn = document.getElementById("button");
	btn.style.left = style.width + "%";
	btn.style.top = style.height + "%";
});

// 인원 리스트 관리 위한 요소 제거 코드뭉치
Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for (var i = this.length - 1; i >= 0; i--) {
		if (this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}

// 엔터키 입력 시 메시지 전송해주는 코드
function enterdown() {
	var e = $.Event("keydown");
	e.which = 13;
	e.keyCode = 13;
	$(document).trigger(e);
}

// 유저 리스트를 관리해주는 착한친구 v0.1
userlistadd = function(name, socket) {
	if (name.length < 1) {
		//console.log(socket+' gone')
		if (document.getElementById(socket) != null) {
			document.getElementById(socket).remove();
		}
		console.log('퇴갤'+socket)
	}
	else if (document.getElementById(socket) == null) { // 기존에 없는 경우
		//console.log(socket+' come')
		$('<ul id="' + socket + '">' + name + '</ul>').appendTo($('.userlist'));
		console.log('뉴비'+socket)
	}
	else {
		console.log('변경'+socket)
		//console.log(socket+' change : '+document.getElementsByClassName(socket))
		//document.getElementsByClassName(socket).innerText = name;
		$('ul#' + socket).text(name);
	}
}

// 버튼 도망가기 신호
function run() {
	// 컨트롤 누른상태에서만 도망가지 않게
	if (!(window.event.ctrlKey || window.event.keyCode == 86)) {
		// 브라우저의 높이, 너비 구하지 않기.. 비율로만!
		var style = {
			width: (Math.floor((Math.random() * 100) - 0)),
			height: (Math.floor((Math.random() * 100) - 0))
		}
		socket.emit('run', style);
	}
}

// 버튼의 실제 이동
function escape() {
	// 컨트롤 누른상태에서만 도망가지 않게
	if (!(window.event.ctrlKey || window.event.keyCode == 86)) {
		// 브라우저의 높이, 너비 구하기.
		var width = document.body.clientWidth - 10;
		var height = document.body.clientHeight - 10;
		// 버튼 불러오기
		var btn = document.getElementById("button");
		// 랜덤한 위치로 이동..
		btn.style.left = (Math.floor((Math.random() * width) - 10)) + "px";
		btn.style.top = (Math.floor((Math.random() * height) - 10)) + "px";
	}
}

// 날짜 시간 알려주는 ..
Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";

	var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case "yyyy":
				return d.getFullYear();
			case "yy":
				return (d.getFullYear() % 1000).zf(2);
			case "MM":
				return (d.getMonth() + 1).zf(2);
			case "dd":
				return d.getDate().zf(2);
			case "E":
				return weekName[d.getDay()];
			case "HH":
				return d.getHours().zf(2);
			case "hh":
				return ((h = d.getHours() % 12) ? h : 12).zf(2);
			case "mm":
				return d.getMinutes().zf(2);
			case "ss":
				return d.getSeconds().zf(2);
			case "a/p":
				return d.getHours() < 12 ? "오전" : "오후";
			default:
				return $1;
		}
	});
};
String.prototype.string = function(len) {
	var s = '',
		i = 0;
	while (i++ < len) {
		s += this;
	}
	return s;
};
String.prototype.zf = function(len) {
	return "0".string(len - this.length) + this;
};
Number.prototype.zf = function(len) {
	return this.toString().zf(len);
};

// 확대, 축소
var tgs = new Array('div', 'td', 'tr', 'li', 'ul', 'input');

function ts(trgt, sz) {
	if (!document.getElementById) return
	var d = document,
		cEl = null,
		i, j, cTags;
	if (!(cEl = d.getElementById(trgt))) cEl = d.getElementsByTagName(trgt)[0];
	cEl.style.fontSize = sz + 'vmin';
	for (i = 0; i < tgs.length; i++) {
		cTags = cEl.getElementsByTagName(tgs[i]);
		for (j = 0; j < cTags.length; j++) cTags[j].style.fontSize = sz + 'vmin';
	}
}

// 카톡 알림음 재생 ..
var currentFile = "";

function playAudio() {
	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var oAudio = document.getElementById('myaudio');
			var btn = document.getElementById('play');
			var audioURL = document.getElementById('audiofile');

			//Skip loading if current file hasn't changed.
			if (audioURL.value !== currentFile) {
				oAudio.src = audioURL.value;
				currentFile = audioURL.value;
			}

			// Tests the paused attribute and set state. 
			if (oAudio.paused) {
				oAudio.play();
				btn.textContent = "Pause";
			}
			else {
				oAudio.pause();
				btn.textContent = "Play";
			}
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			if (window.console && console.error("Error:" + e));
		}
	}
}
// Rewinds the audio file by 30 seconds.
function rewindAudio() {
	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var oAudio = document.getElementById('myaudio');
			oAudio.currentTime -= 30.0;
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			if (window.console && console.error("Error:" + e));
		}
	}
}
// Fast forwards the audio file by 30 seconds.
function forwardAudio() {

	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var oAudio = document.getElementById('myaudio');
			oAudio.currentTime += 30.0;
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			if (window.console && console.error("Error:" + e));
		}
	}
}
// Restart the audio file to the beginning.
function restartAudio() {
	// Check for audio element support.
	if (window.HTMLAudioElement) {
		try {
			var oAudio = document.getElementById('myaudio');
			oAudio.currentTime = 0;
		}
		catch (e) {
			// Fail silently but show in F12 developer tools console
			if (window.console && console.error("Error:" + e));
		}
	}
}
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);
