import View from "../view/View";

export default class Chart extends View
{
    metadata = {
		properties: {
			padding: { type: "object", defaultValue: { left: 0, top: 0, right: 0, bottom: 0 } }
        }
    };

    init()
    {
        super.init();

        this.addStyleClass("sap-a-chart");
        this.initSvg();
        this.initContentGroup();
    }

    initSvg()
    {
        const element = this.$element[0];
        this.svg = d3.select(element).append("svg");
    }

    initContentGroup()
	{
		this.contentGroup = this.svg.append("g").classed("content", true);
		this._updateContentFrame();
	}

    setSize(size)
    {
        super.setSize(size);
        this.svg.attr("width", size.width)
                .attr("height", size.height);
        this._updateContentFrame();
    }

    setPadding(value)
	{
	    if (typeof(value) == "string" || typeof(value) == "number")
        {
	        value = {
                top: value,
                right: value,
                bottom: value,
                left: value
	        };
        }
		const padding = $.extend({ left: 0, top: 0, right: 0, bottom: 0 }, value);
		this.setProperty("padding", padding);
		this._updateContentFrame();
	}


    _updateContentFrame()
	{
	    var frame = this.getFrame();
	    if (frame === null) return;

        var padding = this.getPadding();
        this.contentFrame = {
            width: frame.width - padding.left - padding.right,
            height: frame.height - padding.top - padding.bottom,
        };

        if (this.contentGroup)
        {
            this.contentGroup.attr("transform", "translate(" + padding.left + "," + padding.top + ")");
        }
	}
}
