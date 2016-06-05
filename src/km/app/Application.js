import AdaptiveApplication from "sap/a/app/Application";
import KMeansChart from "../chart/KMeansChart";

export default class Application extends AdaptiveApplication
{
    init()
    {
        super.init();
        this._initChart();
    }

    _initChart()
    {
        this.chart = new KMeansChart("chart", {
            frame: {
                width: 1080,
                height: 1080
            }
        });
        this.addSubview(this.chart);
    }

    initData()
    {
        const centers = [
            {
                x: 22,
                y: 20
            },
            {
                x: 55,
                y: 55
            },
            {
                x: 70,
                y: 20
            }
        ];
        const points = [];
        centers.forEach(center => {
            const count = 50 + Math.random() * 20;
            for (let i = 0; i < count; i++)
            {
                const point = {
                    x: center.x + (Math.random() * 20 - 10),
                    y: center.y + (Math.random() * 20 - 10)
                };
                points.push(point);
            }
        });
        this.chart.drawPoints(points);
        //this.chart.drawPoints(centers, 6, "red");
        this.data = points;
    }

    run()
    {
        this.initData();
        this.runKMeans();
    }

    runKMeans()
    {
        const k = 3;

        let centers = [];
        for (let i = 0; i < k; i++)
        {
            centers.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                points: []
            });
        }

        let avgDistance = Number.MAX_VALUE;
        let convergence = Number.MAX_VALUE;
        while (convergence > 1)
        {
            const points = this.data;
            let sumDistance = 0;
            points.forEach(point => {
                let minDistance = Number.MAX_VALUE
                let belongToCenter = null;
                centers.forEach(center => {
                    const distance = this.getDistance(center, point);
                    if (distance < minDistance)
                    {
                        belongToCenter = center;
                        minDistance = distance;
                    }
                });
                belongToCenter.points.push(point);
                sumDistance += minDistance;
            });

            if (avgDistance === Number.MAX_VALUE)
            {
                avgDistance = sumDistance / points.length;
                convergence = Number.MAX_VALUE;
            }
            else
            {
                const oldAvgDistance = avgDistance;
                avgDistance = sumDistance / points.length;
                convergence = oldAvgDistance - avgDistance;
            }
            console.log(convergence);
            if (convergence < 1)
            {
                break;
            }

            centers = centers.map(center => {
                return this.getCenterOfPoints(center.points);
            });
        }


        const colors = [ "red", "blue", "lightgreen" ];
        centers.forEach((center, i) => {
            const color = colors[i];
            this.chart.drawPoint(center, 6, color);
            console.log(center.points);
            this.chart.drawPoints(center.points, 3, color);
        });

    }


    getDistance(p1, p2)
    {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    getCenterOfPoints(points)
    {
        const x = points.map(point => point.x).reduce((prev, cur) => prev + cur, 0) / points.length;
        const y = points.map(point => point.y).reduce((prev, cur) => prev + cur, 0) / points.length;
        return { x, y, points: [] };
    }
}
