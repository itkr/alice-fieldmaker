(function() {
	var $ = function(id) { return document.getElementById(id); },
	DIR = 'images/',
	PANELS = 'panels.png',
	size = 10,
	currentPanelId = 0,
	fieldList = [],
	imageFileNames = ['panel_wall.png','panel_top_bottom.png','panel_left_right.png','panel_top_left.png','panel_top_right.png','panel_bottom_left.png','panel_bottom_right.png','panel_flat.png'];

	window.onload = function() {
		makeField();
		setSelectors();
		var setAct = function(obj, i){
			return function(){
				this.style.backgroundPosition = -(currentPanelId * 48).toString() + 'px' + ' 0';
				fieldList[i] = currentPanelId;
				$('output').innerHTML = fieldList;
			};
		};
		for(var i=0;i<$('newTable').getElementsByTagName('td').length;i++) {
			$('field').getElementsByTagName('td')[i].onclick = setAct(this, i);
		}
		$('output').innerHTML = fieldList;
	};
	function makeField() {
		var field = $('field'),
		newTable = document.createElement('table'),
		newTr,
		newTd,
		newText;
		newTable.setAttribute('id','newTable')
		for(var i=0;i<size*size;i++) {
			if(i%size===0) {
				newTr = document.createElement('tr');
				newTable.appendChild(newTr);
			}
			newText = document.createTextNode('');
			newTd = document.createElement('td');
			newTd.style.backgroundColor = '#cccccc';
			newTd.style.backgroundImage = 'url('+DIR+PANELS+')';
			if(i%size===0||i<size||i>size*size-size||i%size==size-1) {
				newTd.style.backgroundPosition = 0 * 48 + 'px' + ' 0';
				currentPanelId = 0;
			} else {
				newTd.style.backgroundPosition = 1 * 48 + 'px' + ' 0';
				currentPanelId = 7;
			}
			newTd.appendChild(newText);
			newTr.appendChild(newTd);
			fieldList[i] = currentPanelId;
		}
		newTable.style.backgroundColor = '#000000';
		newTable.setAttribute('cellspacing','1');
		field.appendChild(newTable);
	}

	function setSelectors() {
		var images = $('selector').getElementsByTagName('img');
		for(var i=0;i<imageFileNames.length;i++) {
			(function(_i) {
				var newA = document.createElement('a');
				var newImg = document.createElement('img');
				newImg.setAttribute('src',DIR + imageFileNames[_i]);
				newImg.style.border = '3px solid #ffffff';
				newA.setAttribute('href','javascript:void(0)');
				newA.appendChild(newImg);
				$('selector').appendChild(newA);
				newA.onclick = function() {
					for(var x=0;x<images.length;x++) {
						images[x].style.border = '3px solid #ffffff';
					}
					images[_i].style.border = '3px solid #ff0000';
					currentPanelId = _i;
				};
			})(i);
		}
		images[0].style.border = '3px solid #ff0000';
	}

})();