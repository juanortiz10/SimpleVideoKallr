var video_out = document.getElementById("vid-box");
var vid_thumb = document.getElementById("vid-thumb");

var vidCount  = 0;

function login(form) {
	var phone = window.phone = PHONE({
	    number        : form.inputUsername.value || "Anonymous",
	    publish_key   : 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c', // Pub Key Juan Ortiz
	    subscribe_key : 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe', // Sub key Juan Ortiz
	});
	var ctrl = window.ctrl = CONTROLLER(phone);
	ctrl.ready(function(){
    form.inputUsername.style.background="#B9F6CA";
    form.usernameSubmit.hidden="true";
    $('#usernameSubmit').prop( "disabled", true );
		ctrl.addLocalStream(vid_thumb);
    $('.fab').css('display', 'none');
    $('#inCall').css('display', 'block');
		addLog("Logged in as " + form.inputUsername.value);
	});
	ctrl.receive(function(session){
	    session.connected(function(session){
				$('.container').css('display', 'none');
        video_out.appendChild(session.video); addLog(session.number + " se ha unido.");
        vidCount++;
      });
	    session.ended(function(session) {
				$('.container').css('display', 'block');
        ctrl.getVideoElement(session.number).remove();
        addLog(session.number + " se ha ido");
        vidCount--;
      });
	});
	ctrl.videoToggled(function(session, isEnabled){
		ctrl.getVideoElement(session.number).toggle(isEnabled);
		addLog(session.number+": video activo - " + isEnabled);
	});
	ctrl.audioToggled(function(session, isEnabled){
		ctrl.getVideoElement(session.number).css("opacity",isEnabled ? 1 : 0.75);
		addLog(session.number+": audio activo - " + isEnabled);
	});
	return false;
}
function makeCall(form){
	if (!window.phone)
    alert("Debes iniciar sesión primero");
	var num = form.number.value;
	if (phone.number()==num)
    return false;
	ctrl.isOnline(num, function(isOn){
		if (isOn)
      ctrl.dial(num);
		else
      alert("Usuario no disponible");
	});
	return false;
}
function mute(){
	var audio = ctrl.toggleAudio();
	if (!audio)
    $('#mute-image').attr('src', 'images/unmute.png');
	else
    $('#mute-image').attr('src', 'images/mute.png');
}
function end(){
	ctrl.hangup();
}
function pause(){
	var video = ctrl.toggleVideo();
	if (!video)
    $('#pause-image').attr('src', 'images/resume.png');
	else
    $('#pause-image').attr('src', 'images/pause.png');
}
function getVideo(number){
	return $('*[data-number="'+number+'"]');
}
function addLog(log){
	$('#logs').append("<p>"+log+"</p>");
}

function errWrap(fxn, form){
  try {
    return fxn(form);
  } catch(err) {
    alert("Navegador no compatible con WEBRTC");
    $('#usernameSubmit').prop( "disabled", false );
    return false;
  }
}
