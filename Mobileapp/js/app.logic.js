var brojbodova;
var mustlogin=0;
var loginfailed=0;
var brojkartice;
var imeiprezime;
var imei;
//debug mode
var debug = 1;

//device ready part
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {	
//handlaj back button na androidu
document.addEventListener("backbutton", onBackKeyDown, false);

  ///////////////////////////
  //swipe eventi
  ///////////////////////////
$(document).ready(function () {
	$("#kartica").on("swipeleft", function () {
        $.mobile.changePage("#bodovi", "flip", false, true);
    });
	$("#kartica").on("swiperight", function () {
        $.mobile.changePage("#info", "flip", false, true);
    });
	$("#bodovi").on("swipeleft", function () {
        $.mobile.changePage("#vijesti", "flip", false, true);
    });
	$("#bodovi").on("swiperight", function () {
        $.mobile.changePage("#kartica", "flip", false, true);
    });
	$("#vijesti").on("swipeleft", function () {
        $.mobile.changePage("#info", "flip", false, true);
    });
	$("#vijesti").on("swiperight", function () {
        $.mobile.changePage("#bodovi", "flip", false, true);
    });
	$("#info").on("swipeleft", function () {
        $.mobile.changePage("#kartica", "flip", false, true);
    });
	$("#info").on("swiperight", function () {
        $.mobile.changePage("#vijesti", "flip", false, true);
    });

});
}

function onBackKeyDown() {
    // Handle the back button
}
	
//definicija servisa
var service="http://customerloyalty.comminus.hr/RestService/RestService.svc";

//splashscreen pageinit - provjera da li imaš podatke u localstorageu
 $(document).on("pageinit", "#splash",function(event){
    $(document).ready(function () {
	brojkartice = window.localStorage.getItem("brojkartice");
	imeiprezime=window.localStorage.getItem("imeiprezime");
	//produkcija dohvaća IMEI
	imei=window.localStorage.getItem("imei");
	//test imei
	//imei=358829053089199;
	barkod=window.localStorage.getItem("barkod");
	
	//original provjera
	if (brojkartice == null || imeiprezime == null || imei == null || barkod == null) mustlogin=1;
	
	//test provjera bez IMEI
	//if (brojkartice == null || imeiprezime == null || barkod == null) mustlogin=1;
	
	//redirect
	setTimeout(function() {
		if(mustlogin==1) {
			$.mobile.changePage("#login",{ transition: "fade"});
		}
		else $.mobile.changePage("#kartica",{ transition: "fade"});
	}, 2000);
	//if (mustlogin==1) $.mobile.changePage("#login",{ transition: "fade"});
	//else $.mobile.changePage("#kartica",{ transition: "fade"});
	});
});

//bodovi pagebeforeshow
$(document).on("pagebeforeshow","#bodovi",function(){

  brojkartice = window.localStorage.getItem("brojkartice");
  imei = window.localStorage.getItem("imei");
  $(document).ready(function () {
  
	$.ajax({
                url: service+"/GetBrojBodovaByBrojKartice?brojKartice="+brojkartice+"&imei="+imei ,
                type: "GET", 
                success: function (data) {
                    //alert(data);
					brojbodova=data;
					//$("#cl_infobrojbodova").text("Korisnik "+window.localStorage.getItem("imeiprezime")+" ima na raspolaganju "+brojbodova+" bodova");
					$("#cl_infobrojbodova").html("Korisnik <b>"+window.localStorage.getItem("imeiprezime")+"</b> ima na raspolaganju <b>"+brojbodova+"</b> bodova");
					
                },
                error: function (msg) {
				if(debug) console.log( "Dogodila se pogreška:"+msg);
				$.mobile.changePage("#error_page",{ transition: "fade"});
				}
            });
			
			
    });
 });
$(document).on("pageinit","#kartica",function(){
 $("#kartica-content").css({
  
      "background": "url(images/back_bodovi.png)",
	  "background-repeat":"repeat-y",
	  "background-position":"center center",
	  "background-attachment":"scroll",
	  "background-size":"100%"
      
    });
	});
 
 //kartica pagebeforeshow
$(document).on("pagebeforeshow","#kartica",function(){
 //dohvatit podatke o kartici iz local storagea 
 $("#cl_kartica_ime").text(window.localStorage.getItem("imeiprezime"));
 $("#cl_kartica_broj").text(window.localStorage.getItem("brojkartice")); 
 var picture = localStorage.getItem('barkod_mali');
 var image = document.createElement('img');
 image.src = "data:image/png;base64," + picture;
 image.className = "imgA1";
 var pozicija=$("#barkod_mali");
 pozicija[0].innerHTML="";
 pozicija[0].appendChild(image);
 
 //u slučaju da je već u landscapeu, prije nego učitaš #kartica, prebaci se na #landscape 
 if (window.orientation == 90 )  $.mobile.changePage("#landscape");
  
  
  
});

//landscape pagebeforeshow
$(document).on("pagebeforeshow","#landscape",function(){
//dohvatit podatke o kartici iz local storagea
var picture = localStorage.getItem('barkod');
 var image = document.createElement('img');
 image.src = "data:image/png;base64," + picture;
 //image.style.width = "100%";
 var pozicija=$("#barkod_content");
 pozicija[0].innerHTML="";
 pozicija[0].appendChild(image);
 

});

//poslovnice pagebeforeshow
$(document).on("pagebeforeshow","#poslovnice",function(){
 //počisti poslovnice
$("#cl_poslovnice")[0].innerHTML="";
imei = window.localStorage.getItem("imei");
// dohvati poslovnice
  $(document).ready(function () {
            $.ajax({
                url: service+"/GetPoslovnice?imei="+imei ,
                type: "GET", 
                success: function (data) {
					 obj = data;
					 for (i=0;i<obj.length;i++){
						
							$("#cl_poslovnice")[0].innerHTML+=("<div class=\"ui-corner-all custom-corners\"><div class=\"ui-bar ui-bar-a\"><h3 style=\"color:green\">"+obj[i].Naziv+"</h3></div><div class=\"ui-body ui-body-a\"><h3 style=\"color:green;font-size:80%\">"+obj[i].Ulica+" "+obj[i].KucniBroj+", "+obj[i].Mjesto +", "+obj[i].PostanskiBroj+"</h3><p>E-mail:<br><a href=\"mailto:"+obj[i].EMail+"\">"+obj[i].EMail+"</a><br>Telefon:<br>"+obj[i].Telefon+"</p></div></div><p/>");
						
					 }
					 //window.localStorage.setItem("poslovnice", $("#cl_poslovnice")[0].innerHTML);
                },
                error: function (msg) {
				if(debug) console.log( "Dogodila se pogreška:"+msg);
				$.mobile.changePage("#error_page",{ transition: "fade"});
				}
            });
    });
	
	
});


//današnji datum
function gettoday(){
	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    var today = yyyy+'-'+mm+'-'+dd;
	return today;
}
function compareDate(current,active){
var x = new Date(current);
var y = new Date(active);
if (x>y) return false;
else return true;
}

//vijesti pagebeforeshow
$(document).on("pagebeforeshow","#vijesti",function(){
 //očisti vijesti
 $("#cl_news")[0].innerHTML="";
 imei = window.localStorage.getItem("imei");
 var today=gettoday();
  $(document).ready(function () {
            $.ajax({
                url: service+"/GetAkcije?imei="+imei ,
                type: "GET", 
                success: function (data) {
					 obj = data;
					 for (i=0;i<obj.length;i++){
						if(obj[i].Aktivno==true & compareDate(today,obj[i].DostupnoDo)){
							var dateod = obj[i].DostupnoOd;
							var datedo = obj[i].DostupnoDo;
							//var months   = {"01":"Siječnja","02":"Veljače","03":"Ožujka","04":"Travnja","05":"Svibnja","06":"Lipnja","07":"Srpnja", "08":"Kolovoza","09":"Rujna","10":"Listopada","11":"Studenog","12":"Prosinca"};
							var datesplit = dateod.split('-');
							//dateod=datesplit[1] + ' '+ months[datesplit[2]] + ', ' + datesplit[0];
							dateod=datesplit[1] + '.'+ datesplit[2] + '.' + datesplit[0];
							var datesplit = datedo.split('-');
							//datedo=datesplit[1] + ' '+ months[datesplit[2]] + ', ' + datesplit[0];
							datedo=datesplit[1] + '.'+ datesplit[2] + '.' + datesplit[0];
							$("#cl_news")[0].innerHTML+=("<div class=\"ui-corner-all custom-corners\"><div class=\"ui-bar ui-bar-a\"><h3 style=\"color:green\">Akcija "+obj[i].Brand+"</h3><br/><h3 style=\"color:green;font-size:80%\">Traje od "+dateod+" do "+datedo+"</h3></div><div class=\"ui-body ui-body-a\"><p>"+obj[i].Naziv+"</p></div></div><p/>");
						}
					 }
					 
                },
                error: function (msg) {
				if(debug) console.log( "Dogodila se pogreška:"+msg);
				$.mobile.changePage("#error_page",{ transition: "fade"});
				}
            });
    });
});


//login pagebeforeshow
$(document).on("pagebeforeshow","#login",function(){
if (window.localStorage.getItem("loginfailed")=="true") $("#login_error")[0].innerHTML="<b>Prijava nije uspjela</b>";

});
//error_page pagebeforeshow
$(document).on("pagebeforeshow","#error_page",function(){
$("#debug_imei")[0].innerHTML="Kod uređaja:"+window.localStorage.getItem("imei");
});
//fja koja definira ponašanje kod promjene orjentacije
function doOnOrientationChange(){
    switch(window.orientation) 
    {  
      case -90:
      case 90:
        //alert('landscape');
		if ($.mobile.activePage.is("#kartica")){
            $.mobile.changePage("#landscape",{ transition: "fade"});
        }
		break; 
      default:
		//alert('portrait');
		if ($.mobile.activePage.is("#landscape")){
            $.mobile.changePage("#kartica",{ transition: "fade"});
        }
        break; 
    }
  }

//bindanje na promjenu orjentacije
window.addEventListener('orientationchange', doOnOrientationChange);

//inicijalni poziv provjere orjentacije
doOnOrientationChange();
 
//login funkcija - onclick
function dologin () {
	//uzmi user/pass iz forme
	var username= $("#login_brkartice")[0].value;
	var password= $("#login_pass")[0].value;
	//password = CryptoJS.SHA512(password);
	//password=password.toString(CryptoJS.enc.Base64);
	//alert (password);
	//////////
	//dohvati imei uređaja
	var imei = "";
	if (window.device) imei=device.uuid;
	else imei="000000000000000";
	//if (debug==1) alert (imei);
	//////////
	//////////
	//pozovi autentikaciju i provjeri me
	//ako je sve ok spremi imei i odi na #kartica, ako nije vrati poruku o krivom loginu
	//dolje je logika kad je sve ok
	//$(document).ready(function () {
  	$.ajax({
                url: service+"/IsUserValid?brojKartice="+username+"&password="+password+"&imei="+imei ,
                type: "GET", 
                success: function (data) {
					if (data==false) {
						//alert("Neispravan broj kartice ili lozinka");
						
						//počisti storage
						window.localStorage.clear();
						window.localStorage.setItem("loginfailed", true);
						//postavi da mora na login
						mustlogin=1;
						//prebaci na login
						//$.mobile.changePage("#login",{ transition: "fade"});
						location.reload();
					}
					else {
					window.localStorage.setItem("loginfailed", false);
	window.localStorage.setItem("brojkartice", username);
	window.localStorage.setItem("imei", imei);
	
	//barkod generator
	var canvas = document.createElement("canvas");
	canvas.id = "ean";
	
	//dohvati veličinu barkod_content
	//canvas.height = $(window).width()*0.8;
	canvas.width = 400;
	canvas.height = 165;
	document.body.appendChild(canvas);
	var card=('0000000000000' + username).substr(-13); 
	$("#ean").EAN13(card, {debug:false, prefix:false});
	var dataURL = canvas.toDataURL("image/png");
	document.body.removeChild(canvas);
    var imgData=dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	window.localStorage.setItem('barkod', imgData); // save image data
	//dohvati veličinu za mali barkod
	canvas.width = 220;
    canvas.height = 110;
	document.body.appendChild(canvas);
	var card=('0000000000000' + username).substr(-13); 
	$("#ean").EAN13(card, {debug:false, prefix:false});
	var dataURL = canvas.toDataURL("image/png");
	document.body.removeChild(canvas);
    var imgData=dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	window.localStorage.setItem('barkod_mali', imgData); // save image data
	
	imei = window.localStorage.getItem("imei");
  	$.ajax({
                url: service+"/GetImeIPrezimeByBrojKartice?brojKartice="+username+"&imei="+imei ,
                type: "GET", 
                success: function (data) {
					imeiprezime=data.ImePrezime;
					window.localStorage.setItem("imeiprezime", imeiprezime);
					$.mobile.changePage("#kartica");
                },
                error: function (msg) {
				if(debug) console.log( "Dogodila se pogreška:"+msg);
				$.mobile.changePage("#error_page",{ transition: "fade"});
				}
            });
					}
					//window.localStorage.setItem("imeiprezime", imeiprezime);
					//$.mobile.changePage("#kartica");
                },
                error: function (msg) {
				if(debug) console.log( "Dogodila se pogreška:"+msg);
				//alert("Sustav nedostupan");
				
				//počisti storage
				window.localStorage.clear();
				window.localStorage.setItem("loginfailed", true);
				//postavi da mora na login
				mustlogin=1;
				//prebaci na login
				//$.mobile.changePage("#login",{ transition: "fade"});
				location.reload();
				}
            });
	}
  
  
  
//logout funkcija - onclick
  function dologout(){
  
  //postavi da mora na login
  mustlogin=1;
  imei=window.localStorage.getItem("imei");
  brojkartice=window.localStorage.getItem("brojkartice");
  //pozovi servis
  $.ajax({
                url: service+"/logOut?brojKartice="+brojkartice+"&imei="+imei ,
                type: "GET", 
                success: function (data) {
					 //prebaci na login
					$.mobile.changePage("#login");				 			 
                },
                error: function (msg) {
				if(debug) console.log( "Dogodila se pogreška:"+msg);
				$.mobile.changePage("#error_page",{ transition: "fade"});
				}
            });
	//počisti storage
  window.localStorage.clear();
 }
  
  
