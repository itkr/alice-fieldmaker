(function(global, document) {

	var $ = function(id) {
		return document.getElementById(id);
	};

	var self = {};

	self.models = (function() {
		var objects = {

			/**
			 * フィールド全体の状態を管理する
			 */
			Field : function(element) {

			},

			/**
			 * フィールドの中のパネル一つ一つの状態を管理する
			 */
			Panel : function(element) {
				var that = this;
				this.C = {
					STATUS_WALL : 0,
					STATUS_TOPBOTTOM : 1,
					STATUS_LEFTRIGHT : 2,
					STATUS_TOPLEFT : 3,
					STATUS_TOPRIGHT : 4,
					STATUS_BOTTOMLEFT : 5,
					STATUS_BOTTOMRIGHT : 6,
					STATUS_FLAT : 7
				}
				var status = 0;

				this.setStatus = function(type) {
					status = type;
					return that;
				};

				this.getStatus = function() {
					return status;
				}
			},

			SelectorButton : function(element, type) {
				var type = 0;
				var selected = false;
				this.is_selected = function() {
					return selected;
				};
				this.select = function() {
					selected = true;
					return this;
				};
				this.unselect = function() {
					selected = false;
					return this;
				};
				this.getType = function() {
					return type;
				};
			},

			SelectorField : function(element) {
				var selectorButtons = [];

				this.appendSelectorButtons = function(elem, type) {
					selectorButtons.push(new self.SelectorButton(elem, type));
				};

			}
		};
		return objects;
	})();

	self.API = (function() {
		var objects = {};
		return objects;
	})();

	global.FieldMaker = self.API;

})(this, this.document);

(function(document) {

	var $ = function(id) {
		return document.getElementById(id);
	}
	var DIR = 'images/';
	var PANELS = 'panels.png';
	var PANEL_SIZE = 48;
	var PANEL_LENGTH = 10;
	var currentPanelId = 0;
	var fieldList = [];
	var imageFileNames = ['panel_wall.png', 'panel_top_bottom.png', 'panel_left_right.png', 'panel_top_left.png', 'panel_top_right.png', 'panel_bottom_left.png', 'panel_bottom_right.png', 'panel_flat.png'];

	window.onload = function() {
		initField($('field'), PANEL_LENGTH, PANEL_SIZE);
		initSelectors($('selector'));
		// 表示させるのは仮
		$('output').innerHTML = fieldList;
	};

	/**
	 * フィールドを初期化する
	 * @param : element 表示先element
	 * @param : panel_len 作成するマップの行数・列数
	 * @param : panel_size 表示するマップの１セルの辺の長さ(px)
	 */
	function initField(element, panel_len, panel_size) {
		var newTable = document.createElement('table');
		var newTr, newTd, newText;
		for (var i = 0; i < panel_len * panel_len; i++) {
			if (i % panel_len === 0) {
				newTr = document.createElement('tr');
				newTable.appendChild(newTr);
			}
			newText = document.createTextNode('');
			newTd = document.createElement('td');
			newTd.style.width = panel_size - 2 + 'px';
			newTd.style.height = panel_size - 2 + 'px';
			newTd.style.backgroundColor = '#cccccc';
			newTd.style.backgroundImage = 'url(' + DIR + PANELS + ')';
			newTd.style.backgroundSize = panel_size * imageFileNames.length + 'px ' + panel_size + 'px';
			if (i % panel_len === 0 || i < panel_len || i > panel_len * panel_len - panel_len || i % panel_len == panel_len - 1) {
				newTd.style.backgroundPosition = 0 * panel_size + 'px' + ' 0';
				currentPanelId = 0;
			} else {
				newTd.style.backgroundPosition = 1 * panel_size + 'px' + ' 0';
				currentPanelId = 7;
			}
			newTd.appendChild(newText);
			newTr.appendChild(newTd);
			(function(_i) {
				newTd.onclick = function() {
					this.style.backgroundPosition = -(currentPanelId * PANEL_SIZE).toString() + 'px' + ' 0';
					fieldList[_i] = currentPanelId;
					// 表示させるのは仮
					$('output').innerHTML = fieldList;
				};
			})(i);
			fieldList[i] = currentPanelId;
		}
		newTable.style.backgroundColor = '#000000';
		newTable.setAttribute('cellspacing', '1');
		element.appendChild(newTable);
	}

	/**
	 * セレクタを初期化する
	 * @param : element 表示先element
	 */
	function initSelectors(element) {
		var images = element.getElementsByTagName('img');
		for (var i = 0; i < imageFileNames.length; i++) {
			(function(_i) {
				var newA = document.createElement('a');
				var newImg = document.createElement('img');
				newImg.setAttribute('src', DIR + imageFileNames[_i]);
				newImg.style.border = '3px solid #ffffff';
				newA.setAttribute('href', 'javascript:void(0)');
				newA.appendChild(newImg);
				element.appendChild(newA);
				newA.onclick = function() {
					for (var x = 0; x < images.length; x++) {
						images[x].style.border = '3px solid #ffffff';
					}
					images[_i].style.border = '3px solid #ff0000';
					currentPanelId = _i;
				};
			})(i);
		}
		images[0].style.border = '3px solid #ff0000';
	}

})(this.document);
