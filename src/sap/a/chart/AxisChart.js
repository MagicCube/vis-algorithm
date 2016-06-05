import Chart from "./Chart";

export default class AxisChart extends Chart
{
    init()
    {
        super.init();

        this.addStyleClass("sap-a-axis-chart");
        this._initAxisLayer();
    }

    _initAxisLayer()
    {
        this.axisLayer = this.contentGroup.append("g");
        this.axisLayer.attr("id", "axis-layer")
                      .classed("layer");
    }
}
