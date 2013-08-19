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
			 * 引数は仮
			 */
			Panel : function(element, panel_size, imgFileName, imgSize) {

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

				// initial(仮)
				var init = function() {
					element.style.width = panel_size - 2 + 'px';
					element.style.height = panel_size - 2 + 'px';
					element.style.backgroundColor = '#cccccc';
					element.style.backgroundImage = 'url(' + imgFileName + ')';
					element.style.backgroundSize = imgSize;
					element.appendChild(document.createTextNode(''));
				};

				//仮
				this.element = element;

				this.setStatus = function(type) {
					status = type;
					//仮
					element.style.backgroundPosition = -(type * panel_size).toString() + 'px' + ' 0';
					return this;
				};

				this.getStatus = function() {
					return status;
				};

				init();
			},

			SelectorButton : function(element, type) {
				var type = type;
				var selected = false;
				var STYLES = {
					selecting : '3px solid #ff0000',
					unselecting : '3px solid #ffffff'
				}

				this.element = element;
				this.is_selected = function() {
					return selected;
				};
				this.select = function() {
					selected = true;
					//仮
					element.style.border = STYLES.selecting;
					return this;
				};
				this.unselect = function() {
					selected = false;
					//仮
					element.style.border = STYLES.unselecting;
					return this;
				};
				this.getType = function() {
					return type;
				};
			},

			SelectorField : function(element) {
				var selectorButtons = [];
				var selectingButtonType = 0;

				// 仮
				this.element = element;

				this.appendSelectorButtons = function(elem, type) {
					var button = new self.models.SelectorButton(elem, type);
					selectorButtons.push(button);
					// 仮
					return button;
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
	var fieldList = [];
	var imageFileNames = ['panel_wall.png', 'panel_top_bottom.png', 'panel_left_right.png', 'panel_top_left.png', 'panel_top_right.png', 'panel_bottom_left.png', 'panel_bottom_right.png', 'panel_flat.png'];

	window.onload = function() {
		var selectorField = new FieldMaker.models.SelectorField($('selector'))
		initSelectors(selectorField.element, selectorField);
		initField($('field'), PANEL_LENGTH, PANEL_SIZE, selectorField);
		// 表示させるのは仮
		$('output').innerHTML = fieldList;
	};

	/**
	 * フィールドを初期化する
	 * @param : element 表示先element
	 * @param : panel_len 作成するマップの行数・列数
	 * @param : panel_size 表示するマップの１セルの辺の長さ(px)
	 */
	function initField(element, panel_len, panel_size, selectorField) {
		var newTable = document.createElement('table');
		var newTr;
		var newTd;
		var panel;
		var imgFileName;
		var imgSize;
		var i = 0;

		for ( i = 0; i < panel_len * panel_len; i++) {
			if (i % panel_len === 0) {
				newTr = document.createElement('tr');
				newTable.appendChild(newTr);
			}
			newTd = document.createElement('td');
			imgFileName = (DIR + PANELS);
			imgSize = (panel_size * imageFileNames.length + 'px ' + panel_size + 'px');
			panel = new FieldMaker.models.Panel(newTd, panel_size, imgFileName, imgSize);

			//初期表示の変化を付けてる
			// 仮　定数をスタティックに呼び出したい
			selectorField.setSelecting(panel.C.STATUS_FLAT);
			if (i % panel_len === 0 || i < panel_len || i > panel_len * panel_len - panel_len || i % panel_len == panel_len - 1) {
				selectorField.setSelecting(panel.C.STATUS_WALL);
			}

			panel.setStatus(selectorField.getSelecting());
			newTr.appendChild(panel.element);

			(function(_i) {
				panel.element.onclick = function() {
					this.style.backgroundPosition = -(selectorField.getSelecting() * PANEL_SIZE).toString() + 'px' + ' 0';
					fieldList[_i] = selectorField.getSelecting();
					// 表示させるのは仮
					$('output').innerHTML = fieldList;
				};
			})(i);

			fieldList[i] = selectorField.getSelecting();
		}
		newTable.style.backgroundColor = '#000000';
		newTable.setAttribute('cellspacing', '1');
		element.appendChild(newTable);
	}

	/**
	 * セレクタを初期化する
	 * @param : element 表示先element
	 */
	function initSelectors(element, selectorField) {
		var selectorButton;
		for (var i = 0; i < imageFileNames.length; i++) {

			var newDiv = document.createElement('div');

			newDiv.style.width = PANEL_SIZE + 'px';
			newDiv.style.height = PANEL_SIZE + 'px';
			selectorButton = selectorField.appendSelectorButtons(newDiv, i);
			newDiv.style.backgroundImage = 'url(' + (DIR + PANELS) + ')'
			newDiv.style.backgroundPosition = -(i * PANEL_SIZE).toString() + 'px' + ' 0';

			element.appendChild(selectorButton.element);
			(function(_i) {
				selectorButton.element.onclick = function() {
					selectorField.setSelecting(_i);
				};
			})(i);
		}
		selectorField.setSelecting(0);
	}

})(this.document);
