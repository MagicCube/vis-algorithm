import AxisChart from "./AxisChart";

export default class XYAxisChart extends AxisChart
{
    afterInit()
    {
        super.afterInit();
        this.initScale();
    }

    initScale()
    {
        this.scaleX = d3.scale.linear().range([ 0, this.contentFrame.width ]).domain([0, 100]);
        this.scaleY = d3.scale.linear().range([ this.contentFrame.height, 0 ]).domain([0, 100]);
    }

    drawPoint(point, radius = 3, color = "")
    {
        if (Array.isArray(point))
        {
            point = {
                x: point[0],
                y: point[1]
            };
        }
        const circle = this.contentGroup.append("circle");
        circle.attr("cx", this.scaleX(point.x))
              .attr("cy", this.scaleY(point.y))
              .attr("r", radius)
              .attr("fill", color);
    }

    drawPoints(points, radius = 3, color = "")
    {
        points.forEach(point => {
            this.drawPoint(point, radius, color);
        });
    }
}
