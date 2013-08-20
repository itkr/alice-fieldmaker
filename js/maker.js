// ライブラリ部分
(function(global, document) {

	// 仮
	// この辺りの定数はinit()などで実装パートから定義する
	// なので今は実装パートと同じ物を書いている
	var DIR = 'images/';
	var PANELS = 'panels.png';
	var PANEL_SIZE = 48;
	var PANEL_LENGTH = 10;
	var PANEL_KIND_NUMBER = 8;

	var $ = function(id) {
		return document.getElementById(id);
	};

	var self = {};

	self.models = (function() {
		var objects = {

			/**
			 * 作成したフィールドの保存を管理する
			 */
			FieldMakerRegistrar : function() {
				// var panelList = [];
				//
				// this.set = function(index, type) {
				// panelList[index, type];
				// };
			},

			/**
			 * フィールド全体の状態を管理する
			 * 引数とかinitとか
			 */
			Field : function(element, selectorField) {
				var panelList = [];
				var defaultList = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				panelList = defaultList.slice();

				//仮
				var init = function() {
					var newTable = document.createElement('table');
					var newTr;
					var newTd;
					var panel;
					var i = 0;
					for ( i = 0; i < PANEL_LENGTH * PANEL_LENGTH; i++) {
						if (i % PANEL_LENGTH === 0) {
							newTr = document.createElement('tr');
							newTable.appendChild(newTr);
						}
						newTd = document.createElement('td');
						panel = new FieldMaker.models.Panel(newTd, selectorField, panelList, i);
						selectorField.setSelecting(defaultList[i]);
						panel.setStatus(selectorField.getSelecting());
						newTr.appendChild(newTd);
						panelList[i] = selectorField.getSelecting();
					}
					newTable.style.backgroundColor = '#000000';
					newTable.setAttribute('cellspacing', '1');
					element.appendChild(newTable);
				};
				init();
			},

			/**
			 * フィールドの中のパネル一つ一つの状態を管理する
			 * 引数は仮
			 */
			Panel : function(element, selectorField, panelList, position) {

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

				var init = function() {
					element.style.width = PANEL_SIZE - 2 + 'px';
					element.style.height = PANEL_SIZE - 2 + 'px';
					element.style.backgroundColor = '#cccccc';
					element.style.backgroundImage = 'url(' + DIR + PANELS + ')';
					element.style.backgroundSize = (PANEL_SIZE * PANEL_KIND_NUMBER + 'px ' + PANEL_SIZE + 'px');
					element.appendChild(document.createTextNode(''));
					element.onclick = function() {
						this.style.backgroundPosition = -(selectorField.getSelecting() * PANEL_SIZE).toString() + 'px' + ' 0';
						panelList[position] = selectorField.getSelecting();
						// 表示させるのは仮
						$('output').innerHTML = panelList;
					};
				};

				this.setStatus = function(type) {
					status = type;
					element.style.backgroundPosition = -(type * PANEL_SIZE).toString() + 'px' + ' 0';
					return this;
				};

				this.getStatus = function() {
					return status;
				};

				init();
			},

			/**
			 * パネルの種類を選択するためのボタン
			 */
			SelectorButton : function(element, type) {

				var type = type;
				var selected = false;
				var STYLES = {
					selecting : '3px solid #ff0000',
					unselecting : '3px solid #ffffff'
				}

				this.is_selected = function() {
					return selected;
				};

				this.select = function() {
					selected = true;
					element.style.border = STYLES.selecting;
					return this;
				};

				this.unselect = function() {
					selected = false;
					element.style.border = STYLES.unselecting;
					return this;
				};

				this.getType = function() {
					return type;
				};

			},

			/**
			 * パネルのボタンを選択するボタンを配置するフィールド
			 * 基本的にこのオブジェクトは一つ作成し処理を委託する（仕様の拡張性のため設計上は複数作成できる）
			 */
			SelectorField : function(element) {

				var that = this;
				var selectorButtons = [];
				var selectingButtonType = 0;

				this.appendSelectorButtons = function(elem, type) {
					var button = new self.models.SelectorButton(elem, type);
					selectorButtons.push(button);
					elem.style.width = PANEL_SIZE + 'px';
					elem.style.height = PANEL_SIZE + 'px';
					elem.style.backgroundImage = 'url(' + (DIR + PANELS) + ')'
					elem.style.backgroundPosition = -(type * PANEL_SIZE).toString() + 'px' + ' 0';
					elem.onclick = function() {
						that.setSelecting(type);
					};
					element.appendChild(elem);
					return this;
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

	/**
	 * モジュール公開部分
	 */
	self.API = (function() {
		var objects = {
			models : self.models
		};
		return objects;
	})();

	/**
	 * 名前空間の公開
	 */
	global.FieldMaker = self;

})(this, this.document);

// 実際の処理部分
(function(document) {

	var $ = function(id) {
		return document.getElementById(id);
	};

	var DIR = 'images/';
	var PANELS = 'panels.png';
	var PANEL_SIZE = 48;
	var PANEL_LENGTH = 10;
	var PANEL_KIND_NUMBER = 8;

	/**
	 * 初期化
	 */
	window.onload = function() {
		var selectorField = new FieldMaker.models.SelectorField($('selector'))
		initSelectors(selectorField);
		initField($('field'), PANEL_LENGTH, PANEL_SIZE, selectorField);
	};

	/**
	 * フィールドを初期化する
	 */
	function initField(element, panel_len, panel_size, selectorField) {
		var field = new FieldMaker.models.Field(element, selectorField);
	}

	/**
	 * セレクタを初期化する
	 */
	function initSelectors(selectorField) {
		var i;
		for ( i = 0; i < PANEL_KIND_NUMBER; i++) {
			selectorField.appendSelectorButtons(document.createElement('div'), i);
		}
		selectorField.setSelecting(0);
	}

})(this.document);
