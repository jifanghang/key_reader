$('.controls a.down').click(function(){
	if(!canClick){return false;}
	canClick = false;

	$('.mask').each(function(){
		var el = $(this);
		var nextNote = el.find('li:nth-child(12)').text();

		el.animate({right: -268}, slideSpeed);
		setTimeout(function(){
			el.find('ul').prepend( "<li note="+nextNote+">"+nextNote+"</li>" );
			el.find('li:last-child').remove();
			el.css({right: -189});
		}, slideSpeed+20)
	});

	setTimeout(function(){
		changeOpenNotes();
		showNotes(noteToShow);
		canClick = true;
	}, slideSpeed+20)
	
	return false;
});

$('.controls a.up').click(function(){
	if(!canClick){return false;}
	canClick = false;

	$('.mask').each(function(){
		var el = $(this);
		var nextNote = el.find('li:nth-child(2)').text();

		$( "<li note="+nextNote+">"+nextNote+"</li>" ).appendTo(el.find('ul'));
		el.css({right: -268});
		el.find('li:first-child').remove();
		el.animate({right: -189}, slideSpeed);
		
	});

	changeOpenNotes();
	showNotes(noteToShow);

	setTimeout(function(){
		canClick = true;
	}, slideSpeed+20)
	return false;
});