// ライブラリ部分
(function(global, document) {

	var $ = function(id) {
		return document.getElementById(id);
	};

	var self = {};

	self.settings = {
		DIR : 'images/',
		PANELS : 'panels.png',
		PANEL_SIZE : 48,
		PANEL_LENGTH : 10,
		PANEL_KIND_NUMBER : 8,
		DEFAULT_LIST : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	};

	self.settings.TYPES = {
		STATUS_WALL : 0,
		STATUS_TOPBOTTOM : 1,
		STATUS_LEFTRIGHT : 2,
		STATUS_TOPLEFT : 3,
		STATUS_TOPRIGHT : 4,
		STATUS_BOTTOMLEFT : 5,
		STATUS_BOTTOMRIGHT : 6,
		STATUS_FLAT : 7
	};

	self.context = (function() {
		var objects = {
			DocumentContext : function() {

			}
		};
		return objects;
	})();

	self.models = (function() {
		var objects = {

			/**
			 * 作成したフィールドの保存を管理する
			 */
			FieldMakerRegistrar : function() {

			},

			/**
			 * フィールド全体の状態を管理する
			 * 引数とかinitとか
			 */
			Field : function(element, selectorField) {
				var panelList = [];
				var defaultList = self.settings.DEFAULT_LIST;
				panelList = defaultList.slice();
				
				var getCallBack = function(position) {
					return function(e) {
						this.style.backgroundPosition = -(selectorField.getSelecting() * self.settings.PANEL_SIZE).toString() + 'px' + ' 0';
						panelList[position] = selectorField.getSelecting();
						// 表示させるのは仮
						$('output').innerHTML = panelList;
					};
				};

				var init = function() {
					var newTable = document.createElement('table');
					var newTr;
					var newTd;
					var panel;
					var i = 0;
					for ( i = 0; i < self.settings.PANEL_LENGTH * self.settings.PANEL_LENGTH; i++) {
						if (i % self.settings.PANEL_LENGTH === 0) {
							newTr = document.createElement('tr');
							newTable.appendChild(newTr);
						}
						newTd = document.createElement('td');
						panel = new FieldMaker.models.Panel(newTd, i, getCallBack(i));
						selectorField.setSelecting(defaultList[i]);
						panel.setStatus(selectorField.getSelecting());
						newTr.appendChild(newTd);
						panelList[i] = selectorField.getSelecting();
					}
					newTable.style.backgroundColor = '#000000';
					newTable.setAttribute('cellspacing', '1');
					element.appendChild(newTable);
				};

				this.getPanelList = function() {
					return panelList;
				};

				init();
			},

			/**
			 * フィールドの中のパネル一つ一つの状態を管理する
			 * 引数は仮、documentContextやコールバック関数をうまく使う
			 */
			Panel : function(element, position, callBack) {
				var status = 0;
				var that = this;

				var init = function() {
					element.style.width = self.settings.PANEL_SIZE - 2 + 'px';
					element.style.height = self.settings.PANEL_SIZE - 2 + 'px';
					element.style.backgroundImage = 'url(' + self.settings.DIR + self.settings.PANELS + ')';
					element.style.backgroundSize = (self.settings.PANEL_SIZE * self.settings.PANEL_KIND_NUMBER + 'px ' + self.settings.PANEL_SIZE + 'px');
					element.onclick = callBack;
				};

				this.setStatus = function(type) {
					status = type;
					element.style.backgroundPosition = -(type * self.settings.PANEL_SIZE).toString() + 'px' + ' 0';
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
			SelectorButton : function(element, type, callBack) {

				var type = type;
				var selecting = false;
				var STYLES = {
					selecting : '3px solid #ff0000',
					unselecting : '3px solid #ffffff'
				}

				var init = function() {
					element.style.width = self.settings.PANEL_SIZE + 'px';
					element.style.height = self.settings.PANEL_SIZE + 'px';
					element.style.backgroundImage = 'url(' + (self.settings.DIR + self.settings.PANELS) + ')'
					element.style.backgroundPosition = -(type * self.settings.PANEL_SIZE).toString() + 'px' + ' 0';
					element.onclick = callBack;
				};

				this.is_selecting = function() {
					return selecting;
				};

				this.select = function() {
					selecting = true;
					element.style.border = STYLES.selecting;
					return this;
				};

				this.unselect = function() {
					selecting = false;
					element.style.border = STYLES.unselecting;
					return this;
				};

				this.getType = function() {
					return type;
				};

				init();
			},

			/**
			 * パネルのボタンを選択するボタンを配置するフィールド
			 * 基本的にこのオブジェクトは一つ作成し処理を委託する（仕様の拡張性のため設計上は複数作成できる）
			 *
			 * SelectorButtonは各々が選択されているかという状態を保持しているが
			 * 実際にはたった一つだけ選択されている状態でなければならないのでSelectorFieldで選択の状態を管理している
			 */
			SelectorField : function(element) {

				var that = this;
				var selectorButtons = [];
				var selectingButtonType = 0;

				var getCallBack = function(type) {
					return function(e) {
						that.setSelecting(type);
					};
				};

				// TODO これは寧ろSelectorButtonのinitでやれば良いと思う
				var appendSelectorButtons = function(type) {
					var elem = document.createElement('div');
					var button = new self.models.SelectorButton(elem, type, getCallBack(type));
					selectorButtons.push(button);
					element.appendChild(elem);
					return this;
				};

				var init = function() {
					var i;
					for ( i = 0; i < self.settings.PANEL_KIND_NUMBER; i++) {
						appendSelectorButtons(i);
					}
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

				init();
			}
		};

		return objects;

	})();

	/**
	 * モジュール公開部分
	 */
	self.API = (function() {
		var objects = {
			models : self.models,
			settings : self.settings,
			initialize : function() {
				return new self.context.DocumentContext()
			}
		};
		return objects;
	})();

	global.FieldMaker = self.API;

})(this, this.document);

// 実際の処理部分
(function(document) {
	var $ = function(id) {
		return document.getElementById(id);
	};
	window.onload = function() {
		var fieldMaker = FieldMaker.initialize();
		var selectorField = new FieldMaker.models.SelectorField($('selector'));
		var field = new FieldMaker.models.Field($('field'), selectorField);
	};
})(this.document);
