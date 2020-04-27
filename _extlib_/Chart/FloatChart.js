
if (!nexacro.FloatChart) {
	nexacro.FloatChart = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent) {
		nexacro._AxisChartBase.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

		this.categorycolumn = new nexacro.BindableValue("");
		this._visibleSeriesset = [];
	};

	var _pFloatChart = nexacro._createPrototype(nexacro._AxisChartBase, nexacro.FloatChart);
	nexacro.FloatChart.prototype = _pFloatChart;
	_pFloatChart._type_name = "FloatChart";


	_pFloatChart.categoryaxis = null;


	_pFloatChart.barsize = undefined;
	_pFloatChart.rotateaxis = true;
	_pFloatChart.waterfall = true;
	_pFloatChart.waterfallsumtext = "Gross";


	_pFloatChart._drawing = false;
	_pFloatChart._isnegativedata = false;

	_pFloatChart._barsize = 0.8;
	_pFloatChart._chartbarsize = 0.8;
	_pFloatChart._barVisibleSeriesCnt = 0;

	_pFloatChart._isTimeData = false;

	_pFloatChart._isCompositeSeries = false;
	_pFloatChart._rotateaxisX = null;
	_pFloatChart._rotateaxisY = null;
	_pFloatChart._invalidcategorycolumn = false;







	_pFloatChart.on_create_contents = function () {
		var control = this.getElement();
		if (control) {
			nexacro._AxisChartBase.prototype.on_create_contents.call(this);
		}
	};

	_pFloatChart.on_destroy_contents = function () {
		this.categorycolumn = null;
		this.barsize = null;

		this._drawing = null;
		this._isnegativedata = null;
		this._barsize = null;
		this._chartbarsize = null;
		this._barVisibleSeriesCnt = null;
		this._isTimeData = null;

		if (this.categoryaxis) {
			this._deleteCategoryaxis();
		}

		nexacro._AxisChartBase.prototype.on_destroy_contents.call(this);

		return true;
	};



	_pFloatChart.set_categoryaxis = function () {
	};

	_pFloatChart.set_categorycolumn = function (v) {
		if (v === undefined || v === null) {
			v = "";
		}

		if (this.categorycolumn._value != v) {
			this.categorycolumn._set(v);
			this.on_apply_categorycolumn();
		}
		if (this._changedData == true) {
			this._reset = true;
			this._draw();
		}
		else {
			this._draw();
		}
	};

	_pFloatChart._checkcategorycolumn = function () {
		var categorycolumn = this.categorycolumn;
		var bindtype = categorycolumn._bindtype;
		if (bindtype == 0) {
			this._invalidcategorycolumn = true;
		}
		else {
			categorycolumn = this._getBindableValue("categorycolumn");
			var binddataset = this._binddataset;
			if (binddataset) {
				var coltype = binddataset._getColumnType(categorycolumn);
				if (!coltype) {
					this._invalidcategorycolumn = true;
				}
				else {
					this._invalidcategorycolumn = false;
				}
			}
		}
	};

	_pFloatChart.on_apply_categorycolumn = function () {
		this.on_apply_binddataset();
	};

	_pFloatChart.set_barsize = function (val) {
		var lVal = null;
		if (val !== undefined && val !== null && val !== "") {
			if (nexacro._isNumber(val)) {
				lVal = val;
			}
			else {
				if (val.length > 0) {
					lVal = +val;
					if (isNaN(lVal)) {
						return;
					}
				}
			}
		}

		if (lVal < 0 || lVal > 100) {
			return;
		}

		if (this.barsize != val) {
			this.barsize = val;
			this.on_apply_barsize(lVal);
		}

		this._reset = true;
		this._draw();
	};

	_pFloatChart.on_apply_barsize = function (barsize) {
		if (!nexacro._ChartGraphicsLib.isEmpty(barsize)) {
			this._barsize = barsize * 0.01;
			this._chartbarsize = barsize * 0.01;
		}
		else {
			this._barsize = 0.8;
			this._chartbarsize = 0.8;
		}
		this._changedData = true;
	};

	_pFloatChart.set_rotateaxis = function (val) {
		if (val === undefined || val === null) {
			return;
		}

		val = nexacro._toBoolean(val);
		if (this.rotateaxis != val) {
			this.rotateaxis = val;
			this.on_apply_rotateaxis();
		}
		this._drawing = false;


		this._reset = true;
		this._draw();
	};

	_pFloatChart.on_apply_rotateaxis = function () {
		var categoryaxis = this.categoryaxis;
		var valueaxes = this.valueaxes;
		var rotateaxis = this.rotateaxis;
		var i;

		if (categoryaxis) {
			categoryaxis.on_apply_opposite(categoryaxis.opposite);
			categoryaxis.on_apply_titlerotate(categoryaxis.titlerotate);
		}
		else {
			if (rotateaxis) {
				this._rotateaxisX = true;
			}
			else {
				this._rotateaxisX = false;
			}
		}

		if (valueaxes.length > 0) {
			for (i = 0; i < valueaxes.length; i++) {
				var valueaxis = valueaxes[i];
				if (valueaxis) {
					valueaxis.on_apply_opposite(valueaxis.opposite);
					valueaxis.on_apply_titlerotate(valueaxis.titlerotate);
				}
			}
		}
		else {
			if (rotateaxis) {
				this._rotateaxisY = true;
			}
			else {
				this._rotateaxisY = false;
			}
		}
		this._xaxes = [];
		this._yaxes = [];
		for (i = 0; i < this._axes.length; i++) {
			var axis = this._axes[i];
			var location = axis._location;
			if (location == "top" || location == "bottom") {
				this._xaxes.push(axis);
			}
			else {
				this._yaxes.push(axis);
			}
		}
		this._rearrange = true;
		this._changedData = true;
	};

	_pFloatChart.set_waterfallsumtext = function (val) {
		if (this.waterfallsumtext != val) {
			this.waterfallsumtext = val;
			this.on_apply_waterfallsumtext(val);
		}
		this._drawing = false;

		this._reset = true;
		this._draw();
	};

	_pFloatChart.on_apply_waterfallsumtext = function (waterfallsumtext) {
		this._rearrange = true;
		this._changedData = true;
	};

	_pFloatChart.set_waterfall = function (val) {
		if (val === undefined || val === null) {
			return;
		}

		val = nexacro._toBoolean(val);
		if (this.waterfall != val) {
			this.waterfall = val;
			this.on_apply_waterfall();
		}
		this._drawing = false;

		this._reset = true;
		this._draw();
	};

	_pFloatChart.on_apply_waterfall = function () {
		this._rearrange = true;
		this._changedData = true;
	};

	_pFloatChart.showSeries = function (id) {
		var s = this.getSeriesByID(id);
		if (s) {
			this._drawing = true;

			this._drawing = false;
			this._changedData = true;

			this._reset = true;
			this._draw();
		}
	};

	_pFloatChart.hideSeries = function (id) {
		var s = this.getSeriesByID(id);
		if (s) {
			this._drawing = true;
			this._drawing = false;
			this._changedData = true;

			this._reset = true;
			this._draw();
		}
	};

	_pFloatChart.showCategoryaxis = function () {
		if (this.categoryaxis) {
			this.categoryaxis.set_visible(true);
		}
	};

	_pFloatChart.hideCategoryaxis = function () {
		if (this.categoryaxis) {
			this.categoryaxis.set_visible(false);
		}
	};

	_pFloatChart._destroySubControl = function () {
		nexacro._AxisChartBase.prototype._destroySubControl.call(this);

		if (this.categoryaxis) {
			this._deleteCategoryaxis();
		}
	};

	_pFloatChart._deleteCategoryaxis = function () {
		var categoryaxis = this.categoryaxis;
		if (categoryaxis) {
			this._deleteAxis(categoryaxis, true);
			this._changedData = true;
		}
	};

	_pFloatChart._createSeries = function (id) {
		var series = new nexacro.ChartFloatSeriesControl(id, this, this._graphicsControl);
		return series;
	};

	_pFloatChart._setSeries = function () {
		var categoryaxis, valueaxis;

		nexacro._AxisChartBase.prototype._setSeries.call(this);

		nexacro._ChartGraphicsLibArray.forEach(this.seriesset, function (obj, index) {
			if (obj) {
				categoryaxis = this.categoryaxis;
				valueaxis = this.getValueaxisByID(obj.valueaxis);

				if (categoryaxis) {
					if (this.valueaxes.length == 0) {
						categoryaxis.on_apply_visible(false);
						categoryaxis.on_apply_boardlinevisible(false);
					}
					else {
						categoryaxis._afterSetProperties();
						categoryaxis.on_apply_visible(categoryaxis.visible);
					}
				}

				if (valueaxis) {
					valueaxis.on_apply_visible(valueaxis.visible);
					obj.on_apply_valueaxis(valueaxis.id);
				}
				else {
					var length = this.valueaxes.length;

					if (length <= 0) {
						return false;
					}
					for (var i = 0; i < length; i++) {
						valueaxis = this.valueaxes[i];
						if (valueaxis) {
							var group = valueaxis._group;
							if (group) {
								var visible = valueaxis.visible;
								if (visible) {
									valueaxis.on_apply_visible(visible);
									obj.on_apply_valueaxis(valueaxis.id);
									break;
								}
							}
						}
					}
				}

				if (!categoryaxis) {
					return false;
				}
				if (categoryaxis._direction == "x") {
					obj._xaxis = categoryaxis;
					obj._yaxis = valueaxis;
				}
				else {
					obj._xaxis = valueaxis;
					obj._yaxis = categoryaxis;
				}
			}
		}, this);
	};

	_pFloatChart._createCategoryaxis = function (o, id) {
		if (this.categoryaxis) {
			return false;
		}

		var axis, location;

		if (!id) {
			id = "Categoryaxis";
		}

		axis = new nexacro.ChartAxisControl(id, this, this._graphicsControl);
		axis._type_name = "ChartCategoryAxisControl";
		axis._type = "categoryAxis";

		if (this._isTimeData && axis.axistype == "datetime") {
			axis._isTimeAxis = true;
		}

		if (o) {
			location = o.opposite ? "top" : "bottom";
		}
		if (this.rotateaxis && this._rotateaxisX) {
			location = "left";
		}

		var opposite = o ? o.opposite : axis.opposite;

		axis.on_apply_opposite(opposite);

		this.categoryaxis = axis;
		this._axes.push(axis);

		if (location == "top" || location == "bottom") {
			this._xaxes.push(axis);
		}
		else {
			this._yaxes.push(axis);
		}

		return axis;
	};

	_pFloatChart._createValueaxes = function (o, id) {
		var location;
		var valueaxis;

		valueaxis = new nexacro.ChartAxisControl(id, this, this._graphicsControl);
		valueaxis._type = "valueAxis";

		if (o) {
			location = o.opposite ? "right" : "left";
		}

		if (this.rotateaxis && this._rotateaxisY) {
			location = "bottom";
		}

		var opposite = o.opposite || valueaxis.opposite;
		valueaxis.on_apply_opposite(opposite);

		this.valueaxes.push(valueaxis);
		this._axes.push(valueaxis);

		if (location == "top" || location == "bottom") {
			this._xaxes.push(valueaxis);
		}
		else {
			this._yaxes.push(valueaxis);
		}
		return valueaxis;
	};

	_pFloatChart._setDatapointFormat = function () {
		nexacro._AxisChartBase.prototype._setDatapointFormat.call(this);
	};

	_pFloatChart._setDatapoint = function () {
		nexacro._AxisChartBase.prototype._setDatapoint.call(this);

		if (this.categoryaxis && this.categoryaxis._isTimeAxis) {
			if (this.categoryaxis._resizeClient) {
				this._reset = true;
			}
			this.categoryaxis.ticks = this.categoryaxis._preGenerateTimeTick();
		}
		var seriesset = this.seriesset;
		this._barsize = this._chartbarsize;

		var visibleSeriesCnt = this.seriesset.length;
		var i;
		var series;
		for (i = 0; i < visibleSeriesCnt; i++) {
			series = seriesset[i];

			if (series) {
				series._baralign = "center";
			}
		}
	};

	_pFloatChart._getHighlightVisible = function () {
		var seriesset = this.seriesset;
		if (seriesset) {
			var length = seriesset.length, highlightbarvisible = false;

			for (var i = 0; i < length; i++) {
				var s = seriesset[i];
				if (s) {
					if (s.highlightbarvisible || s.highlightpointvisible || s.highlightlinevisible) {
						highlightbarvisible = true;
						break;
					}
				}
			}
			return highlightbarvisible;
		}
	};

	_pFloatChart._deleteSeries = function (series_, index) {
		nexacro._ChartBase.prototype._deleteSeries.call(this, series_, index);
		var serieslength = this.seriesset.length;
		var series = this.seriesset;

		if (this.valueaxes) {
			var valueaxes = this.valueaxes;
			for (var i = valueaxes.length - 1; i > -1; i--) {
				var bused = false;
				var valueaxis = valueaxes[i];
				if (valueaxis) {
					for (var j = 0; j < serieslength; j++) {
						var s = series[j];
						if (s) {
							if (s._yaxis && s._yaxis.id == valueaxis.id) {
								bused = true;
							}
						}
					}
				}
				if (!bused || serieslength == 0) {
					valueaxis._used = false;
					valueaxis.on_apply_visible(false);
					valueaxis.on_apply_boardlinevisible(false);
				}
			}
		}

		if (serieslength == 0) {
			if (this.categoryaxis) {
				this.categoryaxis.on_apply_visible(false);
				this.categoryaxis.on_apply_boardlinevisible(false);
			}

			if (this.hrangebar) {
				this.hrangebar.on_apply_visible(false);
			}
			if (this.vrangebar) {
				this.vrangebar.on_apply_visible(false);
			}
		}
	};
}

if (!nexacro.ChartFloatSeriesControl) {
	nexacro.ChartFloatSeriesControl = function (id, parent, graphicsControl) {
		nexacro._SeriesBase.prototype.constructor.apply(this, arguments);

		this._seriesitems = [];
		this.value2column = new nexacro.BindableValue("");
	};

	var _pChartFloatSeriesControl = nexacro._createPrototype(nexacro._SeriesBase, nexacro.ChartFloatSeriesControl);
	nexacro.ChartFloatSeriesControl.prototype = _pChartFloatSeriesControl;
	_pChartFloatSeriesControl._type_name = "ChartFloatSeriesControl";


	_pChartFloatSeriesControl.waterfallsumbarfillstyle = "";
	_pChartFloatSeriesControl.positivebarfillstyle = "";
	_pChartFloatSeriesControl.negativebarfillstyle = "";
	_pChartFloatSeriesControl.baropacity = 1;
	_pChartFloatSeriesControl.barsize = undefined;
	_pChartFloatSeriesControl.barvisible = true;
	_pChartFloatSeriesControl.highlightpositivebarfillstyle = "";
	_pChartFloatSeriesControl.highlightnegativebarfillstyle = "";
	_pChartFloatSeriesControl.highlightbaropacity = 1;
	_pChartFloatSeriesControl.highlightbarvisible = false;
	_pChartFloatSeriesControl.shadowstyle = null;
	_pChartFloatSeriesControl.barradius = 0;
	_pChartFloatSeriesControl.selectpositivebarfillstyle = "";
	_pChartFloatSeriesControl.selectnegativebarfillstyle = "";
	_pChartFloatSeriesControl.selectbaropacity = 1;
	_pChartFloatSeriesControl.valueaxis = "";
	_pChartFloatSeriesControl.autogradation = "none";
	_pChartFloatSeriesControl.waterfallsumbarlinestyle = null;
	_pChartFloatSeriesControl.positivebarlinestyle = null;
	_pChartFloatSeriesControl.negativebarlinestyle = null;
	_pChartFloatSeriesControl.visible = true;
	_pChartFloatSeriesControl.linevisible = false;
	_pChartFloatSeriesControl.itemtextposition = "";
	_pChartFloatSeriesControl.itemtextgap = undefined;


	_pChartFloatSeriesControl._pointshape = null;
	_pChartFloatSeriesControl._borderwidth = null;

	_pChartFloatSeriesControl._color = null;
	_pChartFloatSeriesControl._xaxis = null;
	_pChartFloatSeriesControl._yaxis = null;
	_pChartFloatSeriesControl._changedSeriesColor = true;

	_pChartFloatSeriesControl._barsize = null;
	_pChartFloatSeriesControl._baralign = "center";
	_pChartFloatSeriesControl._barwidth = null;
	_pChartFloatSeriesControl._waterfallsumbarfillstyle = null;
	_pChartFloatSeriesControl._waterfallsumbarlinestyle = null;
	_pChartFloatSeriesControl._positivebarlinestyle = null;
	_pChartFloatSeriesControl._positivebarfillstyle = null;
	_pChartFloatSeriesControl._negativebarlinestyle = null;
	_pChartFloatSeriesControl._negativebarfillstyle = null;
	_pChartFloatSeriesControl._invalidvalue2column = false;
	_pChartFloatSeriesControl._baropacity = null;
	_pChartFloatSeriesControl.waterfalllinestyle = null;
	_pChartFloatSeriesControl._waterfalllinestyle = null;

	_pChartFloatSeriesControl.set_shadowstyle = function (val) {
		if (val == "") {
			val = null;
		}
		this.shadowstyle = val;
		if (val) {
			if (this._shadowstyle == null || this._shadowstyle.value != val) {
				var oldValue;
				if (this._shadowstyle) {
					oldValue = this._shadowstyle.value;
				}
				this._changeContentsProperty("shadowstyle", val, oldValue);

				var shadowstyle = nexacro.ShadowObjectNew(val);
				this._shadowstyle = shadowstyle;
				this.on_apply_shadowstyle(shadowstyle);
			}
		}
		else {
			if (this._shadowstyle) {
				this._shadowstyle = null;
				this.on_apply_shadowstyle(null);
			}
		}
	};
	_pChartFloatSeriesControl.on_apply_shadowstyle = function (shadowstyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "shadowstyle", shadowstyle);

		if (this._chart.legend) {
			this._chart._applyLegendItem();
		}
	};

	_pChartFloatSeriesControl.set_autogradation = function (val) {
		if (!val || val == "") {
			val = "none";
		}
		if (val != this.autogradation) {
			this._changeContentsProperty("autogradation", val, this.autogradation);
			this.autogradation = val;
			this.on_apply_autogradation(val);
		}
		this._chart._draw();
	};
	_pChartFloatSeriesControl.on_apply_autogradation = function (autogradation) {
		this._redrawSeries = false;
	};

	_pChartFloatSeriesControl.set_valueaxis = function (val) {
		if (this.valueaxis != val) {
			this._changeContentsProperty("valueaxis", val, this.valueaxis);
			this.valueaxis = val;
			this.on_apply_valueaxis(val);
		}

		this._chart._draw();
	};
	_pChartFloatSeriesControl.set_value2column = function (v) {
		if (this.value2column._value != v) {
			this._changeContentsProperty("value2column", v, this.value2column);
			this.value2column._set(v);
			this.on_apply_value2column();
		}


		if (this._chart._changedData == true) {
			this._chart._reset = true;
			this._chart._draw();
		}
		else {
			this._chart._draw();
		}
	};

	_pChartFloatSeriesControl.on_apply_value2column = function () {
		var bindtype = this.value2column._bindtype;
		if (bindtype == 0) {
			this._invalidvalue2column = true;
		}
		else {
			var value2column = this._getBindableValue("value2column");
			var binddataset = this._chart._binddataset;
			if (binddataset) {
				var coltype = binddataset._getColumnType(value2column);
				if (!coltype) {
					this._invalidvalue2column = true;
				}
				else {
					this._invalidvalue2column = false;
				}
			}
		}

		this._chart._changedData = true;
	};
	_pChartFloatSeriesControl.on_apply_valueaxis = function (valueaxisid) {
		var valueaxis = this.parent.getValueaxisByID(valueaxisid);
		if (valueaxis) {
			valueaxis._used = true;
			valueaxis._afterSetProperties();

			var usedxAxis = false;
			var usedyAxis = false;
			if (this._chart.seriesset) {
				var seriesset = this._chart.seriesset;
				for (var i = seriesset.length - 1; i > -1; i--) {
					if (seriesset[i] && seriesset[i].id != this.id) {
						if ((seriesset[i]._yaxis && this._yaxis && seriesset[i]._yaxis.id == this._yaxis.id) && !usedyAxis) {
							usedyAxis = true;
						}
						if ((seriesset[i]._xaxis && this._xaxis && seriesset[i]._xaxis.id == this._xaxis.id) && !usedxAxis) {
							usedxAxis = true;
						}
					}
				}
			}
			if (this._xaxis && this._xaxis.id != valueaxis.id && !usedxAxis) {
				if (this._xaxis._type != "categoryAxis") {
					this._xaxis._used = false;
					this._xaxis.on_apply_visible(false);
				}
			}
			if (this._yaxis && this._yaxis.id != valueaxis.id && !usedyAxis) {
				if (this._yaxis._type != "categoryAxis") {
					this._yaxis._used = false;
					this._yaxis.on_apply_visible(false);
				}
			}

			if (valueaxis._direction == "x") {
				if (this.categoryaxis) {
					if (this.categoryaxis._direction == "x") {
						this._xaxis = this.categoryaxis;
						this._yaxis = valueaxis;
					}
					else {
						this._xaxis = valueaxis;
						this._yaxis = this.categoryaxis;
					}
				}
				else {
					this._xaxis = valueaxis;
				}
			}
			else {
				if (this.categoryaxis) {
					if (this.categoryaxis._direction == "x") {
						this._xaxis = this.categoryaxis;
						this._yaxis = valueaxis;
					}
					else {
						this._xaxis = valueaxis;
						this._yaxis = this.categoryaxis;
					}
				}
				else {
					this._yaxis = valueaxis;
				}
			}

			this._chart._changedData = true;
		}
	};

	_pChartFloatSeriesControl.set_visible = function (val) {
		if (val === undefined || val === null) {
			return;
		}

		val = nexacro._toBoolean(val);
		if (this.visible != val) {
			this._changeContentsProperty("visible", val, this.visible);
			this.visible = val;
			this.on_apply_visible();
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_visible = function () {
		if (this._is_initprop) {
			return;
		}

		var visible = this.visible;
		var selecttype = this.selecttype;

		if (visible) {
			if (selecttype) {
				this._chart._changedData = true;
			}
			else {
				this._chart._changedData = true;
				this._applyPropertySeries("Bar", "visible", true);
			}

			if (this.itemtextvisible) {
				this.on_apply_itemtextvisible(true);
			}
		}
		else {
			this._chart._changedData = true;
			this._applyPropertySeries("Bar", "visible", false);

			if (!this._itemtextvisible) {
				this.on_apply_itemtextvisible(false);
			}
		}

		if (this._chart.legend) {
			this._chart._applyLegendItem();
		}
	};

	_pChartFloatSeriesControl.set_barsize = function (val) {
		var lVal = null;
		if (val !== undefined && val !== null && val !== "") {
			if (nexacro._isNumber(val)) {
				lVal = val;
			}
			else {
				if (val.length > 0) {
					lVal = +val;
					if (isNaN(lVal)) {
						return;
					}
				}
			}
		}

		if (lVal < 0 || lVal > 100) {
			return;
		}

		if (this.barsize != val) {
			this.barsize = val;
			this.on_apply_barsize(lVal);
		}

		this._chart._reset = true;
		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_barsize = function (barsize) {
		if (!nexacro._ChartGraphicsLib.isEmpty(barsize)) {
			this._barsize = this.barsize * 0.01;
		}
		else {
			var chartbarsize = this._chart._barsize;
			if (!nexacro._isNull(chartbarsize)) {
				this._barsize = chartbarsize;
			}
		}
		this._chart._changedData = true;
	};

	_pChartFloatSeriesControl.set_waterfalllinestyle = function (val) {
		this.waterfalllinestyle = val;
		if (val) {
			if (this._waterfalllinestyle == null || this._waterfalllinestyle.value != val) {
				var oldValue;
				if (this._waterfalllinestyle) {
					oldValue = this._waterfalllinestyle.value;
				}
				this._changeContentsProperty("waterfalllinestyle", val, oldValue);

				var waterfalllinestyle = nexacro.BorderLineObject(val);
				this._waterfalllinestyle = waterfalllinestyle;
				this.on_apply_waterfalllinestyle(waterfalllinestyle);
			}
		}
		else {
			if (this._waterfalllinestyle) {
				this._waterfalllinestyle = null;
				this.on_apply_waterfalllinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_waterfalllinestyle = function (waterfalllinestyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "waterfalllinestyle", waterfalllinestyle);
	};

	_pChartFloatSeriesControl.set_positivebarlinestyle = function (val) {
		this.positivebarlinestyle = val;
		if (val) {
			if (this._positivebarlinestyle == null || this._positivebarlinestyle.value != val) {
				var oldValue;
				if (this._positivebarlinestyle) {
					oldValue = this._positivebarlinestyle.value;
				}
				this._changeContentsProperty("positivebarlinestyle", val, oldValue);

				var positivebarlinestyle = nexacro.BorderLineObject(val);
				this._positivebarlinestyle = positivebarlinestyle;
				this.on_apply_positivebarlinestyle(positivebarlinestyle);
			}
		}
		else {
			if (this._positivebarlinestyle) {
				this._positivebarlinestyle = null;
				this.on_apply_positivebarlinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_positivebarlinestyle = function (positivebarlinestyle) {
		if (positivebarlinestyle) {
		}
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "positivebarlinestyle", positivebarlinestyle);
	};

	_pChartFloatSeriesControl.set_negativebarlinestyle = function (val) {
		this.negativebarlinestyle = val;
		if (val) {
			if (this._negativebarlinestyle == null || this._negativebarlinestyle.value != val) {
				var oldValue;
				if (this._negativebarlinestyle) {
					oldValue = this._negativebarlinestyle.value;
				}
				this._changeContentsProperty("negativebarlinestyle", val, oldValue);

				var negativebarlinestyle = nexacro.BorderLineObject(val);
				this._negativebarlinestyle = negativebarlinestyle;
				this.on_apply_negativebarlinestyle(negativebarlinestyle);
			}
		}
		else {
			if (this._negativebarlinestyle) {
				this._negativebarlinestyle = null;
				this.on_apply_negativebarlinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_negativebarlinestyle = function (negativebarlinestyle) {
		if (negativebarlinestyle) {
		}
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "negativebarlinestyle", negativebarlinestyle);
	};

	_pChartFloatSeriesControl.set_waterfallsumbarlinestyle = function (val) {
		this.waterfallsumbarlinestyle = val;
		if (val) {
			if (this._waterfallsumbarlinestyle == null || this._waterfallsumbarlinestyle.value != val) {
				var oldValue;
				if (this._waterfallsumbarlinestyle) {
					oldValue = this._waterfallsumbarlinestyle.value;
				}
				this._changeContentsProperty("waterfallsumbarlinestyle", val, oldValue);

				var waterfallsumbarlinestyle = nexacro.BorderLineObject(val);
				this._waterfallsumbarlinestyle = waterfallsumbarlinestyle;
				this.on_apply_waterfallsumbarlinestyle(waterfallsumbarlinestyle);
			}
		}
		else {
			if (this._waterfallsumbarlinestyle) {
				this._waterfallsumbarlinestyle = null;
				this.on_apply_waterfallsumbarlinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_waterfallsumbarlinestyle = function (waterfallsumbarlinestyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "waterfallsumbarlinestyle", waterfallsumbarlinestyle);
	};

	_pChartFloatSeriesControl.set_positivebarfillstyle = function (val) {
		this.positivebarfillstyle = val;
		if (val) {
			if (this._positivebarfillstyle == null || this._positivebarfillstyle.value != val) {
				var oldValue;
				if (this._positivebarfillstyle) {
					oldValue = this._positivebarfillstyle.value;
				}
				this._changeContentsProperty("positivebarfillstyle", val, oldValue);

				var positivebarfillstyle = val;
				var arrColorList = this._spliterColor(val, true);
				if (!arrColorList) {
				}
				else if (arrColorList.length == 1) {
					positivebarfillstyle = arrColorList[0];
				}
				else {
					positivebarfillstyle = arrColorList;
				}

				this._positivebarfillstyle = positivebarfillstyle;
				this.on_apply_positivebarfillstyle(positivebarfillstyle);
			}
		}
		else {
			if (this._positivebarfillstyle) {
				this._positivebarfillstyle = null;
				this.on_apply_positivebarfillstyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_positivebarfillstyle = function (positivebarfillstyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "positivebarfillstyle", positivebarfillstyle);

		if (this._chart.legend) {
			this._chart._applyLegendItem();
		}
	};

	_pChartFloatSeriesControl.set_negativebarfillstyle = function (val) {
		this.negativebarfillstyle = val;
		if (val) {
			if (this._negativebarfillstyle == null || this._negativebarfillstyle.value != val) {
				var oldValue;
				if (this._negativebarfillstyle) {
					oldValue = this._negativebarfillstyle.value;
				}
				this._changeContentsProperty("negativebarfillstyle", val, oldValue);

				var negativebarfillstyle = val;
				var arrColorList = this._spliterColor(val, true);
				if (!arrColorList) {
				}
				else if (arrColorList.length == 1) {
					negativebarfillstyle = arrColorList[0];
				}
				else {
					negativebarfillstyle = arrColorList;
				}

				this._negativebarfillstyle = negativebarfillstyle;
				this.on_apply_negativebarfillstyle(negativebarfillstyle);
			}
		}
		else {
			if (this._negativebarfillstyle) {
				this._negativebarfillstyle = null;
				this.on_apply_negativebarfillstyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_negativebarfillstyle = function (negativebarfillstyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "negativebarfillstyle", negativebarfillstyle);

		if (this._chart.legend) {
			this._chart._applyLegendItem();
		}
	};

	_pChartFloatSeriesControl.set_waterfallsumbarfillstyle = function (val) {
		this.waterfallsumbarfillstyle = val;
		if (val) {
			if (this._waterfallsumbarfillstyle == null || this._waterfallsumbarfillstyle.value != val) {
				var oldValue;
				if (this._waterfallsumbarfillstyle) {
					oldValue = this._waterfallsumbarfillstyle.value;
				}
				this._changeContentsProperty("waterfallsumbarfillstyle", val, oldValue);

				var waterfallsumbarfillstyle = nexacro.BackgroundObject(val, this);

				this._waterfallsumbarfillstyle = waterfallsumbarfillstyle;
				this.on_apply_waterfallsumbarfillstyle(waterfallsumbarfillstyle);
			}
		}
		else {
			if (this._waterfallsumbarfillstyle) {
				this._waterfallsumbarfillstyle = null;
				this.on_apply_waterfallsumbarfillstyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_waterfallsumbarfillstyle = function (waterfallsumbarfillstyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "waterfallsumbarfillstyle", waterfallsumbarfillstyle);

		if (this._chart.legend) {
			this._chart._applyLegendItem();
		}
	};

	_pChartFloatSeriesControl.set_baropacity = function (val) {
		this.baropacity = val;
		if (0 === val || val) {
			if (this._baropacity == null || this._baropacity.value != val) {
				var oldValue;
				if (this._baropacity) {
					oldValue = this._baropacity.value;
				}
				this._changeContentsProperty("baropacity", val, oldValue);

				var baropacity = nexacro.OpacityObject(val);
				this._baropacity = baropacity;
				this.on_apply_baropacity(baropacity);
			}
		}
		else {
			if (this._baropacity) {
				this._baropacity = null;
				this.on_apply_baropacity(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_baropacity = function (opacity) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "baropacity", opacity);
	};

	_pChartFloatSeriesControl.set_highlightbarvisible = function (val) {
		if (val === undefined || val === null) {
			return;
		}

		val = nexacro._toBoolean(val);
		if (this.highlightbarvisible != val) {
			this._changeContentsProperty("highlightbarvisible", val, this.highlightbarvisible);
			this.highlightbarvisible = val;
			this.on_apply_highlightbarvisible(val);
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_highlightbarvisible = function (highlightbarvisible) {
	};

	_pChartFloatSeriesControl.set_highlightpositivebarlinestyle = function (val) {
		this.highlightpositivebarlinestyle = val;
		if (val) {
			if (this._highlightpositivebarlinestyle == null || this._highlightpositivebarlinestyle.value != val) {
				var oldValue;
				if (this._highlightpositivebarlinestyle) {
					oldValue = this._highlightpositivebarlinestyle.value;
				}
				this._changeContentsProperty("highlightpositivebarlinestyle", val, oldValue);

				var highlightpositivebarlinestyle = nexacro.BorderLineObject(val);
				this._highlightpositivebarlinestyle = highlightpositivebarlinestyle;
				this.on_apply_highlightpositivebarlinestyle(highlightpositivebarlinestyle);
			}
		}
		else {
			if (this._pointlinestyle) {
				this._pointlinestyle = null;
				this.on_apply_highlightpositivebarlinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_highlightpositivebarlinestyle = function (highlightpositivebarlinestyle) {
	};

	_pChartFloatSeriesControl.set_highlightnegativebarlinestyle = function (val) {
		this.highlightnegativebarlinestyle = val;
		if (val) {
			if (this._highlightnegativebarlinestyle == null || this._highlightnegativebarlinestyle.value != val) {
				var oldValue;
				if (this._highlightnegativebarlinestyle) {
					oldValue = this._highlightnegativebarlinestyle.value;
				}
				this._changeContentsProperty("highlightnegativebarlinestyle", val, oldValue);

				var highlightnegativebarlinestyle = nexacro.BorderLineObject(val);
				this._highlightnegativebarlinestyle = highlightnegativebarlinestyle;
				this.on_apply_highlightnegativebarlinestyle(highlightnegativebarlinestyle);
			}
		}
		else {
			if (this._pointlinestyle) {
				this._pointlinestyle = null;
				this.on_apply_highlightnegativebarlinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_highlightnegativebarlinestyle = function (highlightnegativebarlinestyle) {
	};

	_pChartFloatSeriesControl.set_highlightpositivebarfillstyle = function (val) {
		this.highlightpositivebarfillstyle = val;
		if (val) {
			if (this._highlightpositivebarfillstyle == null || this._highlightpositivebarfillstyle.value != val) {
				var oldValue;
				if (this._highlightpositivebarfillstyle) {
					oldValue = this._highlightpositivebarfillstyle.value;
				}
				this._changeContentsProperty("highlightpositivebarfillstyle", val, oldValue);

				var highlightpositivebarfillstyle = nexacro.BackgroundObject(val, this);
				this._highlightpositivebarfillstyle = highlightpositivebarfillstyle;
				this.on_apply_highlightpositivebarfillstyle(highlightpositivebarfillstyle);
			}
		}
		else {
			if (this._highlightpositivebarfillstyle) {
				this._highlightpositivebarfillstyle = null;
				this.on_apply_highlightpositivebarfillstyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_highlightpositivebarfillstyle = function (highlightpositivebarfillstyle) {
	};

	_pChartFloatSeriesControl.set_highlightnegativebarfillstyle = function (val) {
		this.highlightnegativebarfillstyle = val;
		if (val) {
			if (this._highlightnegativebarfillstyle == null || this._highlightnegativebarfillstyle.value != val) {
				var oldValue;
				if (this._highlightnegativebarfillstyle) {
					oldValue = this._highlightnegativebarfillstyle.value;
				}
				this._changeContentsProperty("highlightnegativebarfillstyle", val, oldValue);

				var highlightnegativebarfillstyle = nexacro.BackgroundObject(val, this);
				this._highlightnegativebarfillstyle = highlightnegativebarfillstyle;
				this.on_apply_highlightnegativebarfillstyle(highlightnegativebarfillstyle);
			}
		}
		else {
			if (this._highlightnegativebarfillstyle) {
				this._highlightnegativebarfillstyle = null;
				this.on_apply_highlightnegativebarfillstyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_highlightnegativebarfillstyle = function (highlightnegativebarfillstyle) {
	};

	_pChartFloatSeriesControl.set_highlightbaropacity = function (val) {
		this.highlightbaropacity = val;
		if (0 === val || val) {
			if (this._highlightbaropacity == null || this._highlightbaropacity.value != val) {
				var oldValue;
				if (this._highlightbaropacity) {
					oldValue = this._highlightbaropacity.value;
				}
				this._changeContentsProperty("highlightbaropacity", val, oldValue);

				var highlightbaropacity = nexacro.OpacityObject(val);
				this._highlightbaropacity = highlightbaropacity;
				this.on_apply_highlightbaropacity(highlightbaropacity);
			}
		}
		else {
			if (this._highlightbaropacity) {
				this._highlightbaropacity = null;
				this.on_apply_highlightbaropacity(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_highlightbaropacity = function (highlightbaropacity) {
	};

	_pChartFloatSeriesControl.set_selectpositivebarlinestyle = function (val) {
		this.selectpositivebarlinestyle = val;
		if (val) {
			if (this._selectpositivebarlinestyle == null || this._selectpositivebarlinestyle.value != val) {
				var oldValue;
				if (this._selectpositivebarlinestyle) {
					oldValue = this._selectpositivebarlinestyle.value;
				}
				this._changeContentsProperty("selectpositivebarlinestyle", val, oldValue);

				var selectpositivebarlinestyle = nexacro.BorderLineObject(val);
				this._selectpositivebarlinestyle = selectpositivebarlinestyle;
				this.on_apply_selectpositivebarlinestyle(selectpositivebarlinestyle);
			}
		}
		else {
			if (this._selectpositivebarlinestyle) {
				this._selectpositivebarlinestyle = null;
				this.on_apply_selectpositivebarlinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_selectpositivebarlinestyle = function (selectpositivebarlinestyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "selectpositivebarlinestyle", selectpositivebarlinestyle, "select");
	};

	_pChartFloatSeriesControl.set_selectnegativebarlinestyle = function (val) {
		this.selectnegativebarlinestyle = val;
		if (val) {
			if (this._selectnegativebarlinestyle == null || this._selectnegativebarlinestyle.value != val) {
				var oldValue;
				if (this._selectnegativebarlinestyle) {
					oldValue = this._selectnegativebarlinestyle.value;
				}
				this._changeContentsProperty("selectnegativebarlinestyle", val, oldValue);

				var selectnegativebarlinestyle = nexacro.BorderLineObject(val);
				this._selectnegativebarlinestyle = selectnegativebarlinestyle;
				this.on_apply_selectnegativebarlinestyle(selectnegativebarlinestyle);
			}
		}
		else {
			if (this._selectnegativebarlinestyle) {
				this._selectnegativebarlinestyle = null;
				this.on_apply_selectnegativebarlinestyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_selectnegativebarlinestyle = function (selectnegativebarlinestyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "selectnegativebarlinestyle", selectnegativebarlinestyle, "select");
	};

	_pChartFloatSeriesControl.set_selectpositivebarfillstyle = function (val) {
		this.selectpositivebarfillstyle = val;
		if (val) {
			if (this._selectpositivebarfillstyle == null || this._selectpositivebarfillstyle.value != val) {
				var oldValue;
				if (this._selectpositivebarfillstyle) {
					oldValue = this._selectpositivebarfillstyle.value;
				}
				this._changeContentsProperty("selectpositivebarfillstyle", val, oldValue);

				var selectpositivebarfillstyle = nexacro.BackgroundObject(val, this);
				this._selectpositivebarfillstyle = selectpositivebarfillstyle;
				this.on_apply_selectpositivebarfillstyle(selectpositivebarfillstyle);
			}
		}
		else {
			if (this._selectpositivebarfillstyle) {
				this._selectpositivebarfillstyle = null;
				this.on_apply_selectpositivebarfillstyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_selectpositivebarfillstyle = function (selectpositivebarfillstyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "selectpositivebarfillstyle", selectpositivebarfillstyle, "select");
	};

	_pChartFloatSeriesControl.set_selectnegativebarfillstyle = function (val) {
		this.selectnegativebarfillstyle = val;
		if (val) {
			if (this._selectnegativebarfillstyle == null || this._selectnegativebarfillstyle.value != val) {
				var oldValue;
				if (this._selectnegativebarfillstyle) {
					oldValue = this._selectnegativebarfillstyle.value;
				}
				this._changeContentsProperty("selectnegativebarfillstyle", val, oldValue);

				var selectnegativebarfillstyle = nexacro.BackgroundObject(val, this);
				this._selectnegativebarfillstyle = selectnegativebarfillstyle;
				this.on_apply_selectnegativebarfillstyle(selectnegativebarfillstyle);
			}
		}
		else {
			if (this._selectnegativebarfillstyle) {
				this._selectnegativebarfillstyle = null;
				this.on_apply_selectnegativebarfillstyle(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_selectnegativebarfillstyle = function (selectnegativebarfillstyle) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "selectnegativebarfillstyle", selectnegativebarfillstyle, "select");
	};

	_pChartFloatSeriesControl.set_selectbaropacity = function (val) {
		this.selectbaropacity = val;
		if (0 === val || val) {
			if (this._selectbaropacity == null || this._selectbaropacity.value != val) {
				var oldValue;
				if (this._selectbaropacity) {
					oldValue = this._selectbaropacity.value;
				}
				this._changeContentsProperty("selectbaropacity", val, oldValue);

				var selectbaropacity = nexacro.OpacityObject(val);
				this._selectbaropacity = selectbaropacity;
				this.on_apply_selectbaropacity(selectbaropacity);
			}
		}
		else {
			if (this._selectbaropacity) {
				this._selectbaropacity = null;
				this.on_apply_selectbaropacity(null);
			}
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_selectbaropacity = function (selectbaropacity) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "selectbaropacity", selectbaropacity, "select");
	};


	_pChartFloatSeriesControl.set_barradius = function (val) {
		val = parseInt(val);
		this.barradius = val;
		if (val > 0) {
			if (this._barradius == null || this._barradius != val) {
				var oldValue;
				oldValue = this._barradius;
				this._changeContentsProperty("barradius", val, oldValue);
				this._barradius = val;
				this.on_apply_barradius(val);
			}
		}
		else {
			this._barradius = null;
			this.on_apply_barradius(0);
		}

		this._chart._draw();
	};

	_pChartFloatSeriesControl.on_apply_barradius = function (barradius) {
		this._redrawSeries = false;
		this._applyPropertySeries("Bar", "barradius", barradius);

		if (this._chart.legend) {
			this._chart._applyLegendItem();
		}
	};

	_pChartFloatSeriesControl.set_itemtextposition = function (val) {
		var itemtextposition_enum = ["start", "middle", "end", "outside"];
		if (itemtextposition_enum.indexOf(val) == -1) {
			return;
		}

		if (this.itemtextposition != val) {
			this._changeContentsProperty("itemtextposition", val, this.itemtextposition);
			this.itemtextposition = val;
			this.on_apply_itemtextposition();
		}

		this._chart._draw();
	};
	_pChartFloatSeriesControl.on_apply_itemtextposition = function () {
		this._chart._recreate = true;
		this._chart._rearrange = true;
	};

	_pChartFloatSeriesControl.set_itemtextgap = function (val) {
		if (val !== undefined && val !== null && val !== "") {
			if (isNaN(val)) {
				return;
			}

			val = parseInt(val);
		}
		if (this.itemtextgap != val) {
			this._changeContentsProperty("itemtextgap", val, this.itemtextgap);
			this.itemtextgap = val;
			this.on_apply_itemtextgap();
		}
	};

	_pChartFloatSeriesControl.on_apply_itemtextgap = function () {
		this._chart._rearrange = true;
		this._chart._recreate = true;
	};

	_pChartFloatSeriesControl.destroy = function () {
		if (!this._chart) {
			return;
		}

		var seriesGroup = this._chart._graphicsControl.getObjectByID("ChartSeriesGroup");
		var itemLength = this._itemCnt;
		var i;
		var re;
		for (i = 0; i < itemLength; i++) {
			if (seriesGroup) {
				var visible = this.visible, itemID, item;

				if (visible) {
					itemID = this._configIndex + " SeriesBarItem_" + i;
					item = seriesGroup.getObjectByID(itemID);
					if (item) {
						re = seriesGroup.removeChild(item);
						if (item._series) {
							if (re._series) {
								if (re._series._seriesitems.length > 0) {
									for (i = 0; i < re._series._seriesitems.length; i++) {
										if (re._series._seriesitems[i]) {
											if (re._series._seriesitems[i]) {
												delete re._series._seriesitems[i];
												re._series._seriesitems[i] = null;
											}

											delete re._series._seriesitems[i];
											re._series._seriesitems[i] = null;
										}
									}
								}
								delete re._series;
								re._series = null;
							}

							delete item._series;
							item._series = null;
						}

						item.destroy();
						re.destroy();
					}
				}

				if (this.itemtextvisible) {
					itemID = this._configIndex + " SeriesItemText_" + i;
					item = seriesGroup.getObjectByID(itemID);
					if (item) {
						re = seriesGroup.removeChild(item);
						item.destroy();
						re.destroy();
					}
				}
			}
		}

		if (this._seriesitems.length > 0) {
			for (i = 0; i < this._seriesitems.length; i++) {
				if (this._seriesitems[i]) {
					if (this._seriesitems[i]._series) {
						delete this._seriesitems[i]._series;
						this._seriesitems[i]._series = null;
					}

					this._seriesitems[i].destroy();
					delete this._seriesitems[i];
					this._seriesitems[i] = null;
				}
			}
		}

		delete this.valueaxis;
		delete this._xaxis;
		delete this._yaxis;
		delete this._pointshape;

		this.valueaxis = null;
		this.visible = null;
		this.barsize = null;
		this.positivebarlinestyle = null;
		this.positivebarfillstyle = null;
		this.negativebarlinestyle = null;
		this.negativebarfillstyle = null;
		this._positivebarlinestyle = null;
		this._positivebarfillstyle = null;
		this._negativebarlinestyle = null;
		this._negativebarfillstyle = null;
		this.waterfalllinestyle = null;
		this._waterfalllinestyle = null;
		this._baropacity = null;

		this.highlightbarvisible = null;
		this.highlightpositivebarlinestyle = null;
		this.highlightpositivebarfillstyle = null;
		this.highlightnegativebarlinestyle = null;
		this.highlightnegativebarfillstyle = null;
		this._highlightpositivebarlinestyle = null;
		this._highlightpositivebarfillstyle = null;
		this._highlightnegativebarlinestyle = null;
		this._highlightnegativebarfillstyle = null;
		this.highlightbaropacity = null;
		this._highlightbaropacity = null;
		this.selectpositivebarlinestyle = null;
		this.selectpositivebarfillstyle = null;
		this._selectnegativebarlinestyle = null;
		this._selectnegativebarfillstyle = null;
		this.selectbaropacity = null;
		this._selectbaropacity = null;

		this.pointshape = null;
		this.itemtextposition = null;

		this.itemtextgap = null;
		this._pointshape = null;
		this._borderwidth = null;
		this._color = null;
		this._xaxis = null;
		this._yaxis = null;
		this._changedSeriesColor = null;
		this._barsize = null;
		this._groupbarwidth = null;
		this._baralign = null;
		this._barwidth = null;

		this._seriesitems = null;
		this._pointshapeObj = null;
		this._stacktype = null;
		nexacro._SeriesBase.prototype.destroy.call(this);
		return true;
	};

	_pChartFloatSeriesControl._applyPropertySeries = function (type, style, value, select) {
		var item = null, seriesGroup = this._chart._graphicsControl.getObjectByID("ChartSeriesGroup");

		if (seriesGroup) {
			for (var i = 1; i <= this._itemCnt; i++) {
				var itemID = this._configIndex + " Series" + type + "Item_" + (i - 1);

				item = seriesGroup.getObjectByID(itemID);
				if (!nexacro._isNull(item)) {
					if (style == "fillstyle" || style == "pointfillstyle" || style == "lineareafillstyle") {
						item.set_fillstyle(value);
					}
					else if (style == "positivebarlinestyle" || style == "pointlinestyle" || style == "linestyle") {
						item.set_strokepen(value);
					}
					else if (style == "opacity" || style == "pointopacity" || style == "lineopacity" || style == "lineareaopacity") {
						item.set_opacity(value);
					}
					else if (style == "visible" || style == "pointvisible" || style == "linevisible" || style == "lineareavisible") {
						item.set_visible(value);
					}
				}
			}
		}
	};


	_pChartFloatSeriesControl._draw2 = function (redraw) {
		if (!redraw) {
			return;
		}

		this._itemCnt = 0;
		this._itemtextlist = [];
		if (this.visible) {
			this._drawSeriesBars();
		}
	};
	_pChartFloatSeriesControl._draw = function (redraw) {
		nexacro._SeriesBase.prototype._draw.call(this);
		var effect = this._chart_aniframe_obj;
		if (!redraw) {
			if (this._chart._isanimationloading) {
				this._end_animation_series_callback();
			}
			return;
		}
		this._itemCnt = 0;
		this._itemtextlist = [];

		if (effect.enableanimation) {
			if (this._chart._isanimationloading) {
				this._end_animation_series_callback();
			}
			else {
				this._start_animate();
			}
		}
		else {
			this._drawnow();
		}
	};
	_pChartFloatSeriesControl._drawnow = function () {
		if (this.visible) {
			this._drawSeriesBars();
		}
	};

	_pChartFloatSeriesControl._drawSeriesBars = function () {
		var positivebarlinestyle = this.positivebarlinestyle || "1px solid red", negativebarlinestyle = this.negativebarlinestyle || "1px solid blue", positivefillstyle = this._positivebarfillstyle || "#eb495c", negativefillstyle = this._negativebarfillstyle || "#5058eb", opacity = this.baropacity, barLeft, barRight, barwidth, datapoints = this._datapoints, points = datapoints.points, ps = datapoints.pointsize, selectedItem = this._selectedItem, selectpositivebarlinestyle = this.selectpositivebarlinestyle || "1px solid " + this._selectcolor, selectpositivebarfillstyle = this.selectpositivebarfillstyle || this._selectcolor, selectnegativebarlinestyle = this.selectnegativebarlinestyle || "1px solid " + this._selectcolor, selectnegativebarfillstyle = this.selectnegativebarfillstyle || this._selectcolor, selectbaropacity = this.selectbaropacity || this.opacity, isselectitem = false, index = 0, x, y, b, effect = this._chart_aniframe_obj, rotateaxis = this._chart.rotateaxis;

		this.on_apply_barsize(this.barsize);
		barwidth = this._barsize || this._chart._barsize;

		barwidth = this._chart._getcheckTimeAxisBarWidth(barwidth);
		switch (this._baralign) {
			case "left":
				barLeft = 0;
				break;
			case "right":
				barLeft = -barwidth;
				break;
			default:
				barLeft = -barwidth / 2;
		}

		barRight = barLeft + barwidth;

		var paintlinecolor, paintfillcolor, isPositive;
		var pLeng = points.length;
		var nullitem = null;

		var lastIndex = 0;
		if (this._chart.waterfall) {
			for (var i = 0; i < pLeng; i += ps) {
				lastIndex++;
			}
			lastIndex = lastIndex - 1;
		}
		for (var i = 0; i < pLeng; i += ps) {
			var length = selectedItem.length;
			if (length > 0) {
				isselectitem = selectedItem[index];
			}
			x = points[i];
			y = points[i + 1];
			b = points[i + 2];

			isPositive = true;
			if (rotateaxis) {
				if (x < b) {
					isPositive = false;
				}
			}
			else {
				if (y < b) {
					isPositive = false;
				}
			}
			if (effect && effect.isloadanimation) {
				isselectitem = false;
				if (!rotateaxis) {
					y = this._getanimationdrawvalue(y);
				}
				else {
					x = this._getanimationdrawvalue(x);
				}
				b = this._getanimationdrawvalue(b);
			}
			if (isselectitem) {
				if (isPositive) {
					paintlinecolor = selectpositivebarlinestyle;
					paintfillcolor = selectpositivebarfillstyle;
				}
				else {
					paintlinecolor = selectnegativebarlinestyle;
					paintfillcolor = selectnegativebarfillstyle;
				}
				this._drawBar(x, y, b, barLeft, barRight, this._xaxis, this._yaxis, paintlinecolor, paintfillcolor, selectbaropacity, index, nullitem, isPositive, lastIndex);
			}
			else {
				if (this._chart.waterfall && (lastIndex == index)) {
					paintfillcolor = this._waterfallsumbarfillstyle || "green";
					paintlinecolor = this._waterfallsumbarlinestyle || "1px solid #000000";
				}
				else {
					if (isPositive) {
						if (positivefillstyle instanceof Array) {
							paintfillcolor = positivefillstyle[index % positivefillstyle.length];
						}
						else {
							paintfillcolor = positivefillstyle;
						}
						paintlinecolor = positivebarlinestyle;
					}
					else {
						if (negativefillstyle instanceof Array) {
							paintfillcolor = negativefillstyle[index % negativefillstyle.length];
						}
						else {
							paintfillcolor = negativefillstyle;
						}
						paintlinecolor = negativebarlinestyle;
					}
				}
				this._drawBar(x, y, b, barLeft, barRight, this._xaxis, this._yaxis, paintlinecolor, paintfillcolor, opacity, index, nullitem, isPositive, lastIndex);
			}
			index++;
		}
		this._itemCnt = index;
	};


	_pChartFloatSeriesControl._drawBar = function (x, y, b, barLeft, barRight, axisx, axisy, positivebarlinestyle, fillstyle, opacity, index, item, isPositive, lastIndex) {
		var left, right, bottom, top, tmp, rotateaxis = this._chart.rotateaxis, effect = this._chart_aniframe_obj, tickstartgap;
		var waterfall = this._chart.waterfall;

		if (rotateaxis) {
			left = b;
			right = x;
			top = y + barLeft;
			bottom = y + barRight;

			if (right < left) {
				tmp = right;
				right = left;
				left = tmp;
			}
		}
		else {
			left = x + barLeft;
			right = x + barRight;
			bottom = b;
			top = y;

			if (top < bottom) {
				tmp = top;
				top = bottom;
				bottom = tmp;
			}
		}
		if (right < axisx._min || left > axisx._max || top < axisy._min || bottom > axisy._max) {
			return;
		}

		if (left < axisx._min) {
			left = axisx._min;
		}

		if (right > axisx._max) {
			right = axisx._max;
		}

		if (bottom < axisy._min) {
			bottom = axisy._min;
		}

		if (top > axisy._max) {
			top = axisy._max;
		}

		if (axisx.p2c) {
			left = axisx.p2c(left);
			right = axisx.p2c(right);
		}
		if (axisy.p2c) {
			bottom = axisy.p2c(bottom);
			top = axisy.p2c(top);
		}

		if (!rotateaxis) {
			tickstartgap = axisx._tickstartgap;
			if (tickstartgap) {
				left += tickstartgap;
				right += tickstartgap;
			}
		}
		else {
			tickstartgap = axisy._tickstartgap;
			if (tickstartgap) {
				bottom += tickstartgap;
				top += tickstartgap;
			}
		}
		bottom += axisy._tickendspace;
		top += axisy._tickendspace;
		var rect, chart = this._chart, width = 0, height = 0, seriesId, points = [], seriesGroup = chart._seriesGroup, highlightGroup = chart._highlightGroup;
		var waterfalleline;

		width = right - left;
		height = bottom - top;

		if (width < 0) {
			left += width;
			width = Math.abs(width);
		}
		if (height < 0) {
			top += height;
			height = Math.abs(height);
		}

		if (rotateaxis) {
			this._barwidth = height;
		}
		else {
			this._barwidth = width;
		}

		var sv_fillstyle;
		var prevRectId, prevRect;
		if (fillstyle instanceof Array) {
		}
		else {
			if (fillstyle && this.autogradation != "none") {
				var bTarget = false;
				if (fillstyle instanceof nexacro._BackgroundObject) {
					if (!fillstyle.gradient) {
						bTarget = true;
						fillstyle = fillstyle.value;
					}
				}
				else {
					bTarget = (fillstyle.indexOf("gradient") < 0) ? true : false;
				}
				if (bTarget) {
					var anglePos = (this.parent.rotateaxis == true) ? "bottom" : "right";
					var darkcolor1;
					if (this.autogradation == "center") {
						var lightcolor1 = this._shadeColor(fillstyle, -30);
						var lightcolor2 = this._shadeColor(fillstyle, -50);
						darkcolor1 = this._shadeColor(fillstyle, 20);
						sv_fillstyle = "linear-gradient(to " + anglePos + ","
							 + darkcolor1 + " 0%,"
							 + fillstyle + " 25%,"
							 + lightcolor1 + " 40%,"
							 + lightcolor2 + " 50%,"
							 + lightcolor1 + " 60%,"
							 + fillstyle + " 70%,"
							 + darkcolor1 + " 100%)";
					}
					else {
						var darkcolor0 = this._shadeColor(fillstyle, 5);
						darkcolor1 = this._shadeColor(fillstyle, 10);
						var darkcolor2 = this._shadeColor(fillstyle, 25);
						var darkcolor3 = this._shadeColor(fillstyle, 40);
						sv_fillstyle = "linear-gradient(to " + anglePos + ","
							 + darkcolor3 + " 0%,"
							 + darkcolor1 + " 10%,"
							 + darkcolor0 + " 25%,"
							 + fillstyle + " 50%,"
							 + darkcolor0 + " 60%,"
							 + darkcolor1 + " 80%,"
							 + darkcolor2 + " 90%,"
							 + darkcolor3 + " 100%)";
					}
					fillstyle = sv_fillstyle;
				}
			}
		}
		var radius = {
			tl : 0, 
			tr : 0, 
			br : 0, 
			bl : 0
		};
		if (item) {
			var highlightitem = item._barHighlight;
			if (!highlightitem) {
				rect = new nexacro.ChartGraphicsRect(left, top, width, height);
				if (this.shadowstyle) {
					rect.set_shadow(this.shadowstyle);
				}

				if (this.barradius > 0 && this.parent.rotateaxis == true) {
					radius.tl = radius.bl = this.barradius;
					radius.tr = radius.br = this.barradius;
				}
				else {
					radius.bl = radius.br = this.barradius;
					radius.tl = radius.tr = this.barradius;
				}
				if (this.barradius > 0) {
					rect.set_radiusround(radius);
				}

				rect.set_strokepen(positivebarlinestyle);
				if (fillstyle instanceof Array) {
				}
				else {
					rect.set_fillstyle(fillstyle);
				}
				rect.set_opacity(opacity);

				seriesId = this._configIndex + " SeriesHighlightBarItem";
				rect.set_id(seriesId);
				highlightGroup.addChild(rect);

				item._barHighlight = rect;
				rect._item = item;
				rect.index = item.index;
				rect.value = item.value;
			}
			else {
				rect = highlightitem;
			}
		}
		else {
			if (seriesGroup) {
				seriesId = this._configIndex + " SeriesBarItem_" + index;
				rect = seriesGroup.getObjectByID(seriesId);
				if (!rect) {
					rect = new nexacro.ChartGraphicsRect(left, top, width, height);
					rect.set_id(seriesId);
					seriesGroup.addChild(rect);
				}
				else {
					rect.set_x(left);
					rect.set_width(width);
					rect.set_y(top);
					rect.set_height(height);
				}
				rect._ispositive = isPositive;
				if (this.shadowstyle) {
					rect.set_shadow(this.shadowstyle);
				}

				if (this.barradius > 0 && this.parent.rotateaxis == true) {
					radius.tl = radius.bl = this.barradius;
					radius.tr = radius.br = this.barradius;
				}
				else {
					radius.bl = radius.br = this.barradius;
					radius.tl = radius.tr = this.barradius;
				}
				if (this.barradius > 0) {
					rect.set_radiusround(radius);
				}
				rect.set_strokepen(positivebarlinestyle);
				if (fillstyle instanceof Array) {
				}
				else {
					rect.set_fillstyle(fillstyle);
				}
				rect.set_opacity(opacity);


				points[0] = x;
				points[1] = y;
				points[2] = b;

				rect.index = index;
				if (rotateaxis) {
					points[3] = x - b;
					rect.value = x - b;
				}
				else {
					points[3] = y - b;
					rect.value = y - b;
				}

				rect._points = points;
				if (waterfall && index > 0 && (index != lastIndex)) {
					seriesId = this._configIndex + " SerieswaterfallItem_" + index;
					waterfalleline = seriesGroup.getObjectByID(seriesId);
					if (!waterfalleline) {
						waterfalleline = new nexacro.ChartGraphicsLine();
						waterfalleline.set_id(seriesId);
						seriesGroup.addChild(waterfalleline);
					}

					prevRectId = this._configIndex + " SeriesBarItem_" + (index - 1);
					prevRect = seriesGroup.getObjectByID(prevRectId);
					if (prevRect) {
						var px, py, pw, ph, sx1, sx2, sy1, sy2;
						px = prevRect.x;
						py = prevRect.y;
						pw = prevRect._size.width;
						ph = prevRect._size.height;

						if (!rotateaxis) {
							sx1 = px + pw;
							sx2 = left;
							if (prevRect._ispositive) {
								sy1 = py;
							}
							else {
								sy1 = py + ph;
							}
							if (isPositive) {
								sy2 = top + height;
							}
							else {
								sy2 = top;
							}
						}
						else {
							sy1 = py;
							sy2 = top + height;
							if (prevRect._ispositive) {
								sx1 = px + pw;
							}
							else {
								sx1 = px;
							}
							if (isPositive) {
								sx2 = left;
							}
							else {
								sx2 = left + width;
							}
						}
						waterfalleline.set_x1(sx1);
						waterfalleline.set_y1(sy1);
						waterfalleline.set_x2(sx2);
						waterfalleline.set_y2(sy2);

						waterfalleline.set_strokepen(this._waterfalllinestyle || "1px solid #000000");
					}
				}
				if (waterfall && (index == lastIndex)) {
					rect._issum = true;
				}
			}
		}

		var board = this._chart._boardRect, boardWidth = 0, boardHeight = 0, borderWidth = this._chart._boardBorderWidth, borderHeight = this._chart._boardBorderHeight;

		if (board) {
			boardWidth = board.width - borderWidth;
			boardHeight = board.height - borderHeight;
			if (rect) {
				rect._clipitems = [];
				rect.setClipPath(new nexacro.Rect(-left, -top, boardWidth, boardHeight));
			}
		}

		if (rect) {
			rect._series = this;
			this._seriesitems[index] = rect;
		}

		if (rect && !item) {
			var itemtextvisible = this.itemtextvisible;
			if (itemtextvisible) {
				var isEffect = (effect && effect.isloadanimation);
				if (!isEffect) {
					this._drawBarItemText(left, right, bottom, top, width, height, rect);
				}
			}
		}
		return {
			"l" : left, 
			"t" : top, 
			"w" : width, 
			"h" : height, 
			"r" : right, 
			"b" : bottom
		};
	};

	_pChartFloatSeriesControl._drawBarItemText = function (left, right, bottom, top, width, height, item, stackgroupname, index, uservalue) {
		var seriesGroup = this._chart._seriesGroup;
		var itemText, itemtextPosition, itemtextGap;
		itemText = this._createSeriesItemText(item);
		itemtextPosition = this.itemtextposition;
		itemtextGap = this.itemtextgap;

		var rotateaxis = this._chart.rotateaxis;
		function positionstart (itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis) {
			var textTop = 0;
			var textLeft = 0;
			if (!itemtextGap) {
				itemtextGap = 0;
			}

			if (rotateaxis) {
				itemText.set_verticalAlign("middle");
				itemText.set_textAlign("left");
				textTop = top + (height / 2);
				textLeft = left + itemtextGap;
			}
			else {
				itemText.set_verticalAlign("bottom");
				itemText.set_textAlign("center");
				textLeft = left + (width / 2);
				textTop = bottom - itemtextGap;
			}

			itemText.set_x(textLeft);
			itemText.set_y(textTop);
		}
		function positionmiddle (itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis) {
			itemText.set_verticalAlign("middle");
			itemText.set_textAlign("center");
			var textTop = 0;
			var textLeft = 0;
			if (!itemtextGap) {
				itemtextGap = 0;
			}

			if (rotateaxis) {
				textTop = top + (height / 2);
				textLeft = left + (width / 2) + itemtextGap;
			}
			else {
				textLeft = left + (width / 2);
				textTop = top + (height / 2) - itemtextGap;
			}

			itemText.set_x(textLeft);
			itemText.set_y(textTop);
		}
		function positionend (itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis) {
			var textTop = 0;
			var textLeft = 0;
			if (!itemtextGap) {
				itemtextGap = 0;
			}

			if (rotateaxis) {
				itemText.set_verticalAlign("middle");
				itemText.set_textAlign("right");
				textTop = top + (height / 2);
				textLeft = right - itemtextGap;
			}
			else {
				itemText.set_verticalAlign("top");
				itemText.set_textAlign("center");
				textLeft = left + (width / 2);
				textTop = top + itemtextGap;
			}

			itemText.set_x(textLeft);
			itemText.set_y(textTop);
		}
		function positionoutside (itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis) {
			var textTop = 0;
			var textLeft = 0;
			if (!itemtextGap) {
				itemtextGap = 0;
			}

			if (rotateaxis) {
				itemText.set_verticalAlign("middle");
				itemText.set_textAlign("left");
				textTop = top + (height / 2);
				textLeft = right + itemtextGap;
			}
			else {
				itemText.set_verticalAlign("bottom");
				itemText.set_textAlign("center");
				textLeft = left + (width / 2);
				textTop = top - itemtextGap;
			}

			itemText.set_x(textLeft);
			itemText.set_y(textTop);
		}
		if (!nexacro._isNull(itemText)) {
			if (itemtextPosition) {
				switch (itemtextPosition) {
					case "start":
						{

							positionstart(itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis);
						}
						break;
					case "middle":
						{

							positionmiddle(itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis);
						}
						break;
					case "end":
						{

							positionend(itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis);
						}
						break;
					case "outside":
						{

							positionoutside(itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis);
						}
						break;
					default:
						positionmiddle(itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis);
						break;
				}
			}
			else {
				positionmiddle(itemText, left, right, bottom, top, width, height, itemtextGap, rotateaxis);
			}

			this._chart._setChangeInBoardAreaPos(itemText);
			if (stackgroupname !== undefined && stackgroupname !== null) {
			}
			else {
				seriesGroup.addChild(itemText);
				itemText._series = this;
			}
		}
	};

	_pChartFloatSeriesControl._showBarHighlight = function (item) {
		if (!this.highlightbarvisible) {
			return;
		}

		var barHighlight = item._barHighlight;
		if (!barHighlight) {
			var points = item._points, index = item.index, positivebarlinestyle = this.highlightpositivebarlinestyle || "1px solid #eb495c", positivebarfillstyle = this.highlightpositivebarfillstyle || "#ff0000", negativebarlinestyle = this.highlightnegativebarlinestyle || "1px solid #5058eb", negativebarfillstyle = this.highlightnegativebarfillstyle || "#0000ff", baropacity = this.highlightbaropacity, barLeft, barRight;
			var barwidth;

			var x, y, b, isPositive;
			var rotateaxis = this._chart.rotateaxis;
			var paintfillcolor, paintlinecolor;
			x = points[0];
			y = points[1];
			b = points[2];

			isPositive = true;
			if (rotateaxis) {
				if (x < b) {
					isPositive = false;
				}
			}
			else {
				if (y < b) {
					isPositive = false;
				}
			}
			if (isPositive) {
				if (positivebarfillstyle instanceof Array) {
					paintfillcolor = positivebarfillstyle[index % positivebarfillstyle.length];
				}
				else {
					paintfillcolor = positivebarfillstyle;
				}
				paintlinecolor = positivebarlinestyle;
			}
			else {
				if (negativebarfillstyle instanceof Array) {
					paintfillcolor = negativebarfillstyle[index % negativebarfillstyle.length];
				}
				else {
					paintfillcolor = negativebarfillstyle;
				}
				paintlinecolor = negativebarlinestyle;
			}
			this.on_apply_barsize(this.barsize);
			barwidth = this._barsize || this._chart._barsize;

			barwidth = this._chart._getcheckTimeAxisBarWidth(barwidth);
			switch (this._baralign) {
				case "left":
					barLeft = 0;
					break;
				case "right":
					barLeft = -barwidth;
					break;
				default:
					barLeft = -barwidth / 2;
			}

			barRight = barLeft + barwidth;

			this._drawBar(points[0], points[1], points[2], barLeft, barRight, this._xaxis, this._yaxis, paintlinecolor, paintfillcolor, baropacity, index, item);
			this._chart._chageGroupObject(this._chart._seriesGroup, this._chart._highlightGroup, this._itemtextlist, false);
			this._chart._graphicsControl.draw();
		}
	};

	_pChartFloatSeriesControl._hideBarHighlight = function (item) {
		if (!this.highlightbarvisible) {
			return;
		}

		var barHighlight = item._barHighlight;
		if (barHighlight && !nexacro._ChartGraphicsLib.isEmpty(barHighlight.parent)) {
			this._chart._chageGroupObject(this._chart._seriesGroup, this._chart._highlightGroup, this._itemtextlist, true);
			this._chart._highlightGroup.removeChild(barHighlight);
			delete item._barHighlight;

			this._chart._graphicsControl.draw();
		}
	};



	_pChartFloatSeriesControl._findMatchingSeries = function (stacktype) {
		var res = null, allseries;
		var stackobject = this._chart._getVisibleStackGroupObject(this);
		allseries = stackobject._list;
		for (var i = 0; i < allseries.length; ++i) {
			if (this == allseries[i]) {
				break;
			}

			res = allseries[i];
		}
		return res;
	};


	_pChartFloatSeriesControl._setColor = function (colorset) {
		this._color = colorset;
		this._changedSeriesColor = true;

		var changedColorset = this._chart._changedColorset;
		if (changedColorset) {
			var visible = this.visible, pointvisible = this.pointvisible, linevisible = this.linevisible, positivebarlinestyle, fillstyle, linestyle, lineareafillstyle, pointlinestyle, pointfillstyle;
			var width, style, color;
			if (visible) {
				if (this._positivebarlinestyle) {
					width = this._positivebarlinestyle.width;
					style = this._positivebarlinestyle.style;
					color = this._positivebarlinestyle.color;

					positivebarlinestyle = width + " " + style + " " + color;
					this.set_positivebarlinestyle(positivebarlinestyle);
				}
				else {
					positivebarlinestyle = "1px solid " + colorset;
					this._applyPropertySeries("Bar", "positivebarlinestyle", positivebarlinestyle);
				}

				if (this._fillstyle) {
					fillstyle = this._fillstyle;
					this.set_fillstyle(fillstyle);
				}
				else {
					fillstyle = colorset;
					this._applyPropertySeries("Bar", "fillstyle", fillstyle);
				}
			}

			if (linevisible) {
				if (this._linestyle) {
					width = this._linestyle.width;
					style = this._linestyle.style;
					color = this._linestyle.color;

					linestyle = width + " " + style + " " + color;
					this.set_linestyle(linestyle);
				}
				else {
					linestyle = "1px solid " + colorset;
					this._applyPropertySeries("Line", "linestyle", linestyle);
					this.linestyle = linestyle;
				}

				if (this.lineareavisible) {
					if (this._lineareafillstyle) {
						lineareafillstyle = this._lineareafillstyle;
						this.set_lineareafillstyle(lineareafillstyle);
					}
					else {
						lineareafillstyle = colorset;
						this._applyPropertySeries("Area", "lineareafillstyle", lineareafillstyle);
						this.lineareafillstyle = lineareafillstyle;
					}
				}
			}

			if (pointvisible) {
				if (this._pointlinestyle) {
					width = this._pointlinestyle.width;
					style = this._pointlinestyle.style;
					color = this._pointlinestyle.color;

					pointlinestyle = width + " " + style + " " + color;
					this.set_pointlinestyle(pointlinestyle);
				}
				else {
					pointlinestyle = "1px solid " + colorset;
					this._applyPropertySeries("Point", "pointlinestyle", pointlinestyle);
					this.pointlinestyle = pointlinestyle;
				}

				if (this._pointfillstyle) {
					pointfillstyle = this._pointfillstyle;
					this.set_pointfillstyle(pointfillstyle);
				}
				else {
					pointfillstyle = colorset;
					this._applyPropertySeries("Point", "pointfillstyle", pointfillstyle);
					this.pointfillstyle = pointfillstyle;
				}
			}
		}
	};

	_pChartFloatSeriesControl._afterSetProperties = function () {
		var legend = this._chart.legend;
		if (legend) {
			this._chart._applyLegendItem();
		}
	};
}
