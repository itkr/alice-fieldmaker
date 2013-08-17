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
				var type = type;
				var selected = false;

				this.element = element;
				this.is_selected = function() {
					return selected;
				};
				this.select = function() {
					selected = true;
					element.style.border = '3px solid #ff0000';
					//仮
					return this;
				};
				this.unselect = function() {
					selected = false;
					element.style.border = '3px solid #ffffff';
					//仮
					return this;
				};
				this.getType = function() {
					return type;
				};
			},

			SelectorField : function(element) {
				var selectorButtons = [];
				var selectingButtonType = 0;

				this.appendSelectorButtons = function(elem, type) {
					var button = new self.models.SelectorButton(elem, type);
					selectorButtons.push(button);
					return button;
					// 仮
				};

				this.getSelectorButtons = function() {
					return selectorButtons;
				};

				this.setSelecting = function(type) {
					var i;
					selectingButtonType = type;
					for ( i = 0; i < selectorButtons.length; i++) {
						selectorButtons[i].unselect();
					}
					selectorButtons[type].select();
				};

				this.getSelecting = function() {
					return selectingButtonType;
				};
			}
		};
		return objects;
	})();

	self.API = (function() {
		var objects = {
			models : self.models
		};
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
	var selectorField;
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
		var newTr;
		var newTd;
		var newText;
		var i = 0;
		for ( i = 0; i < panel_len * panel_len; i++) {
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
			
			//初期表示の変化を付けてる
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
		var selectorButton;
		selectorField = new FieldMaker.models.SelectorField(element);
		for (var i = 0; i < imageFileNames.length; i++) {
			var newImg = document.createElement('img');
			selectorButton = selectorField.appendSelectorButtons(newImg, i);
			newImg.setAttribute('src', DIR + imageFileNames[selectorButton.getType()]);
			element.appendChild(selectorButton.element);
			(function(_i) {
				selectorButton.element.onclick = function() {
					selectorField.setSelecting(_i);
					currentPanelId = _i;
				};
			})(i);
		}
		selectorField.setSelecting(0);
	}

})(this.document);
