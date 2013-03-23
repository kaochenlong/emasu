var IMAGEW = 820;	
var SLIDESHOW_INTERVAL = 3000;

var nowAt = "main";
var nowDetail = null;
var menuMoving = false;
var nowImage = 1;
var maxImage = 0;
var slideshowIntervalID;
var scrollUpIntervalID;
var scrollDownIntervalID;
var introComplete = false;

///////////////////////////////////////////////////////////////////

$("#test_box").css({display:"none"});		// debug box

$(document).ready(init);

///////////////////////////////////////////////////////////////////

function init()
{	
	$("#logo_mobile").mouseover( mobile_mouseoverFunction );
	$("#logo_mobile").mouseout( mobile_mouseoutFunction );
	
	$("#logo_about").mouseenter( about_mouseenterFunction );
	$("#logo_about").mouseleave( about_mouseleaveFunction );
	$("#logo_about").click( about_clickFunction );
	
	$("#about_close").mouseenter( about_close_mouseenterFunction );
	$("#about_close").mouseleave( about_close_mouseleaveFunction );
	$("#about_close").click( about_closeFunction );
	
	$("#about_logo_mobile").mouseover( about_mobile_mouseoverFunction );
	$("#about_logo_mobile").mouseout( about_mobile_mouseoutFunction );
	
	$("#detail_close").mouseenter(detail_close_mouseenterFunction);
	$("#detail_close").mouseleave(detail_close_mouseleaveFunction);	
	$("#detail_close").click( detail_closeFunction );	

	generateTags();
	
	$("body").mousewheel( mousewheelFunction );	
	$("#top_area").mouseenter( top_mouseenterFunction );
	$("#top_area").mouseleave( top_mouseleaveFunction );
	$("#bottom_area").mouseenter( bottom_mouseenterFunction );
	$("#bottom_area").mouseleave( bottom_mouseleaveFunction );
	$(window).resize( resizeFunction );
}

function generateTags()
{
	for ( var i = 1 ; i < listArray.length; i++ )
	{
		var str = "";
		str += "<div class='s_tag'>";
		str += 		"<div class='s_tag_box'>";
		str += 			"<div class='s_tag_txt1'><a href='#'>> " + listArray[i].name + "</a></div>";
		str += 			"<div class='s_tag_txt2'>" + listArray[i].year + "</div>";
		str += 			"<div class='s_tag_thumb' style='background-image:url(" + listArray[i].folder + "thumb.png)'><a href='#'><img src='images/sign.png' class='img_sign'/></a></div>";
		str += 		"</div>";
		str += "</div>";
		$("#main_nav").append( str );	

		var tar = $(".s_tag:nth-child("+i+")");
		var w = $(".s_tag:nth-child("+i+") .s_tag_box .s_tag_txt1").get(0).clientWidth+1;
		tar.data( {"ow":w, "idx":i} );
		tar.css( { "width":w, "left":0, "top":1200 } );
		tar.delay(i*25).animate( { "width":w, "left":0, "top":2 },250,"easeOutExpo");
		
		tar.bind( "click", s_tag_clickFunction );
		tar.bind( "mouseenter", s_tag_mouseenterFunction );	
		tar.bind( "mouseleave", s_tag_mouseleaveFunction );	
	}
	
	setTimeout(introFinished, (listArray.length*25)+250 );
}

function introFinished()
{
	introComplete = true;
}

///////////////////////////////////////////////////////////////////

function s_tag_mouseenterFunction()
{
	if ( nowAt == "main" && menuMoving == false && introComplete)
	{
		var temp = $(this);
		for ( var i = 1 ; i <= $(".s_tag").length ; i++ )
		{
			var tar = $(".s_tag:nth-child("+i+")");
			tar.stop();
			tar.css( {width:tar.data("ow"), height:32} );		
		}
		temp.animate( {width:344, height:268},200,"easeOutExpo");
		
		var mainTop = parseInt( $("#main_nav").css("top"),10);
		var windowH = window.innerHeight;
		var bottomY = temp.offset().top + 268 - mainTop;

		if ( mainTop > windowH - bottomY )
			$("#main_nav").animate( {top:windowH - bottomY},300,"easeOutExpo" );
	}
}

function s_tag_mouseleaveFunction()
{
	if ( introComplete )
	{
		$(this).animate( {width:$(this).data("ow"), height:32},50,"easeOutExpo");
	}
}

function s_tag_move( dir )
{
	menuMoving = true;		
	
	for ( var i = 1 ; i <= $(".s_tag").length ; i++ )
	{
		var tar = $(".s_tag:nth-child("+i+")");
		var dx;
		if ( dir == "right" )
			dx = ( parseInt( $("#main_nav").css("width"), 10) - parseInt( tar.css("width"), 10) );	
		else if ( dir == "left" )
			dx = 0;
			
		if ( i == $(".s_tag").length )
		{
			if ( dir == "left" )
				tar.delay(i*20).animate({left:dx},700,"easeOutExpo", after_s_tag_move_left);
			else if ( dir == "right" )
				tar.delay(i*20).animate({left:dx},700,"easeOutExpo", after_s_tag_move_right);
		}
		else	
		{
			tar.delay(i*20).animate({left:dx},700,"easeOutExpo");
		}
	}
	
	if ( dir == "right" )
		setTimeout(initDetail,500);
	/*	
	if ( dir == "left" )
	{
		var mainTop = parseInt( $("#main_nav").css("top"),10);
		var windowH = window.innerHeight;
		var totalH = $("#main_nav").get(0).scrollHeight;
		if ( mainTop < windowH - totalH )
			$("#main_nav").animate( {top:windowH - totalH} );
		if ( mainTop > 0 )
			$("#main_nav").animate( {top:0} );		
	}
	*/
}

function after_s_tag_move_right()
{
	menuMoving = false;
	nowAt = "detail";
}

function after_s_tag_move_left()
{
	menuMoving = false;
	nowAt = "main";
}

function changeTagColor( idx , col )
{
	if ( col == "white" )
		$(".s_tag:nth-child(" + idx + ") .s_tag_box").css( {"background-color":"#999999", "color":"#000000"} );
	else if ( col == "black" )
		$(".s_tag:nth-child(" + idx + ") .s_tag_box").css( {"background-color":"#000000", "color":"#FFFFFF"} );
}

function s_tag_clickFunction()
{
	if ( !introComplete )
		return;
		
	if ( menuMoving )
		return;
		
	if ( nowDetail != null )
		changeTagColor( nowDetail , "black"	);
	
	nowDetail = $(this).data("idx");
	if ( nowAt == "main" )
	{
		$(this).css( {width:$(this).data("ow"), height:32} );
		s_tag_move( "right" );
	}
	else if ( nowAt == "detail" )
	{
		changeDetail();
	}
	changeTagColor( nowDetail , "white"	);
	
	/*
	var now = $(this);
	var mainTop = parseInt( $("#main_nav").css("top"),10);
	var windowH = window.innerHeight;
	var tagY = now.offset().top + 16 - mainTop;
	$("#main_nav").animate( {top:windowH/2-tagY},300,"easeOutExpo" );
	*/
}

///////////////////////////////////////////////////////////////////

function initDetail()
{
//	$("#test").val( "nowDetail " + nowDetail);
	
	var i , str, tar;
	$("#detail_txt1").empty();
	$("#detail_txt2").empty();
	$("#detail_txt3").empty();
	$("#detail_image_full").empty();
	$("#detail_indicator ul").empty();
	
	$("#detail_txt1").append( "Project : " + listArray[nowDetail].name2 );	
	$("#detail_txt2").append( "Client : " + listArray[nowDetail].client );	
	$("#detail_txt3").append( "Type : " + listArray[nowDetail].type );		

	
	for ( i = 1 ; i <= listArray[nowDetail].imageNo ; i++ )
	{
		str = "<div class='detail_image_sub'><img src='" + listArray[nowDetail].folder + numToString(i) + listArray[nowDetail].imageType + "' /></div>";
		$("#detail_image_full").append(str);
		tar = $("#detail_image_full .detail_image_sub:nth-child("+i+")");
		tar.css({left:(i-1)*IMAGEW});
	}	
	for ( i = 1 ; i <= listArray[nowDetail].imageNo ; i++ )
	{
		str = "<li><a href='#'><img class='empty_area' src='images/empty.gif' /></a></li>";
		$("#detail_indicator ul").append(str);		
		tar = $("#detail_indicator ul li:nth-child("+i+")");
		tar.data( {"idx":i} );
		tar.bind( "click", indicator_clickFunction );
	}
	
//	if ( listArray[nowDetail].linkUrl != "" )
//	{
//	}
	
	nowImage = 1;
	maxImage = listArray[nowDetail].imageNo;
	showIndicator();
	$("#detail").css( {display:"block",width:0} );
	$("#detail").animate( {width:IMAGEW},1200,"easeOutExpo", startSlideshowIntervalFunction);	
}

function startSlideshowIntervalFunction()
{
	slideshowIntervalID = window.setInterval ( nextImage, SLIDESHOW_INTERVAL );
}

function clearSlideshowIntervalFunction()
{
	window.clearTimeout( slideshowIntervalID );
}

function nextImage()
{
	nowImage++;
	if ( nowImage > maxImage )
		nowImage = 1;
	showIndicator();	
}

function showIndicator()
{
//	$("#test").val( "nowImage " + nowImage );

	for ( var i = 1 ; i <= listArray[nowDetail].imageNo ; i ++ )
	{
		var tar = $("#detail_indicator ul li:nth-child("+i+")");
		if ( i == nowImage )
			tar.css( {backgroundPositionY:"-9px"} ); 
		else
			tar.css( {backgroundPositionY:"0px"} ); 
	}
	$("#detail_image_full").animate( {left:-IMAGEW*(nowImage-1)},750,"easeOutExpo" );
}

function indicator_clickFunction()
{
	nowImage = $(this).data("idx");
	showIndicator();
	clearSlideshowIntervalFunction();
	startSlideshowIntervalFunction();
}

function changeDetail()
{
	clearSlideshowIntervalFunction();
	$("#detail").animate( {width:-1},500,"easeOutExpo", initDetail);	
}

function detail_closeFunction()
{
	clearSlideshowIntervalFunction();
	changeTagColor( nowDetail , "black"	);
	nowDetail = null;
	$("#detail").animate( {width:-1},500,"easeOutExpo", after_detail_close);		
	s_tag_move( "left" );
}

function after_detail_close()
{
	$("#detail").css( {display:"none"} );
}

function detail_close_mouseenterFunction()
{ 
	$("#detail_close").animate({backgroundPositionY:"0px"},200);
}

function detail_close_mouseleaveFunction()
{ 
	$("#detail_close").animate({backgroundPositionY:"-11px"},200);
}

///////////////////////////////////////////////////////////////////

function mobile_mouseoverFunction()
{
	$("#logo_mobile_ext").animate( {opacity:1},300 );
}

function mobile_mouseoutFunction()
{
	$("#logo_mobile_ext").animate( {opacity:0},300 );
}

function about_mouseenterFunction()
{ 
	$("#logo_about").animate({backgroundPositionY:"0px"},200);
}

function about_mouseleaveFunction()
{ 
	$("#logo_about").animate({backgroundPositionY:"-9px"},200);
}

function about_clickFunction()
{ 
	$("#container_about").css({top:0+"%"});
	$("#container_about").animate({opacity:1},1200,"easeOutExpo");
}

///////////////////////////////////////////////////////////////////

function about_mobile_mouseoverFunction()
{
	$("#about_logo_mobile_ext").animate( {opacity:1},300 );
}

function about_mobile_mouseoutFunction()
{
	$("#about_logo_mobile_ext").animate( {opacity:0},300 );
}

function about_close_mouseenterFunction()
{
	$("#container_about_close").animate({backgroundPositionY:"0px"},200);
}

function about_close_mouseleaveFunction()
{
	$("#container_about_close").animate({backgroundPositionY:"-11px"},200);
}

function about_closeFunction()
{
	$("#container_about").animate({opacity:0},1200,"easeOutExpo", after_about_closeFunction);
}

function after_about_closeFunction()
{
	$("#container_about").css({top:-100+"%"});
}

///////////////////////////////////////////////////////////////////

function top_mouseenterFunction()
{
	startScrollUpIntervalFunction();
	scrollFunction(3);
}

function top_mouseleaveFunction()
{
	clearScrollUpIntervalFunction();
}

function bottom_mouseenterFunction()
{
	startScrollDownIntervalFunction();
	scrollFunction(-3);
}

function bottom_mouseleaveFunction()
{
	clearScrollDownIntervalFunction();
}

function startScrollUpIntervalFunction()
{
	scrollUpIntervalID = window.setInterval ( scrollFunction, 5 ,[3]);
}

function clearScrollUpIntervalFunction()
{
	window.clearTimeout( scrollUpIntervalID );
}

function startScrollDownIntervalFunction()
{
	scrollDownIntervalID = window.setInterval ( scrollFunction, 5 ,[-3]);
}

function clearScrollDownIntervalFunction()
{
	window.clearTimeout( scrollDownIntervalID );
}

function mousewheelFunction(event, delta, deltaX, deltaY) 
{
	var d = delta * 30;
	scrollFunction( d );
}

function scrollFunction( delta )
{
	var mainTop = parseInt( $("#main_nav").css("top"),10);
	var windowH = window.innerHeight;
	var totalH = $("#main_nav").get(0).scrollHeight;

	if ( delta < 0 )		// scroll down
	{
		if ( mainTop > windowH - totalH )
		{
			$("#main_nav").css( {top:mainTop+(1*delta)} );
			mainTop = parseInt( $("#main_nav").css("top"),10);
			if ( mainTop < windowH - totalH )
				$("#main_nav").css( {top:windowH - totalH} );
		}
	}
	else if ( delta > 0 )	// scroll up
	{
		$("#main_nav").css( {top:mainTop+(1*delta)} );
		mainTop = parseInt( $("#main_nav").css("top"),10);
		if ( mainTop > 0 )
			$("#main_nav").css( {top:0} );		
	}
}

function resizeFunction()
{
	$("#main_nav").css( {"width":window.innerWidth*0.6} );
	if ( nowAt == "detail" )
	{
		for ( var i = 1 ; i <= $(".s_tag").length ; i++ )
		{
			var tar = $(".s_tag:nth-child("+i+")");
			var dx = ( parseInt( $("#main_nav").css("width"), 10) - parseInt( tar.css("width"), 10) - 2 * parseInt( tar.css("padding"), 10));	
			tar.css({left:dx},800,"easeOutExpo");
		}
	}
}

///////////////////////////////////////////////////////////////////

function numToString( no )
{
	if ( no == 0 )
		return "00";
	else if ( no < 10 )		
		return "0"+String(no);
	else 
		return String(no);
}



