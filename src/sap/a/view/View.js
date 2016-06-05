/*----------------------------------------------------------------------*
 * Copyright  (c) 2015 SAP SE. All rights reserved
 * Author       : SAP Custom Development
 * Description  : View
 *----------------------------------------------------------------------*/

import ManagedObject from "sap/ui/base/ManagedObject";

export default class View extends ManagedObject
{
	metadata = {
		properties: {
			frame: {
				type: "object", defaultValue: {}
			}
		},
		aggregations: {
			subviews: {
				type: "sap.a.view.View"
			}
		},
		events: {
			addedToParent: {

			}
		}
	};

	constructor(...args)
	{
		super(...args);
		this.afterInit();
	}

	init()
	{
		this.$element = $(document.createElement(this.getElementTag()));
		this.$element.attr("id", this.getId());
		this.$element.addClass("sap-a-view");
		this.$container = this.$element;
		this.subviewSet = {};

        if (this.__placeAt)
        {
            this.placeAt(this.__placeAt);
            delete this.__placeAt;
        }
	}

	afterInit()
	{

	}

	getElementTag()
	{
		return "div";
	}

	getEmSize(count = 1)
	{
		let size = 0;
		if (window.emSize === undefined)
		{
			size = parseInt($("body").css("font-size"));
			window.emSize = size;
		}
		else
		{
			size = window.emSize;
		}
		return size * count;
	}

	$(selector)
	{
		if (selector === undefined)
		{
			return this.$element;
		}
		return this.$element.find(selector);
	}

	getSubview(index)
	{
		if (typeof (index) === "number")
		{
			return this.getSubviews()[index] ? this.getSubviews()[index] : null;
		}
		else if (typeof (index) === "string")
		{
			return this.subviewSet[index] ? this.subviewSet[index] : null;
		}
		return null;
	}

	addSubview(subview, $parent)
	{
		if (subview === undefined || subview === null)
		{
			return this;
		}
		const $container = $parent ? $parent : this.$container;
		this.addAggregation("subviews", subview);
		$container.append(subview.$element);
		subview.fireAddedToParent();
		this.subviewSet[subview.getId()] = subview;
		return this;
	}

	insertSubview(subview, index = 0)
	{
		const length = this.getSubviews().length;
		if (index < 0)
		{
			index = 0;
		}
		else if (index > length) {
			index = length;
		}

		const targetView = this.getSubviews()[index];
		this.insertAggregation("subviews", subview, index);
		if (index >= length)
		{
			this.addSubview(subview);
		}
		else
		{
			subview.$element.insertBefore(targetView.$element);
		}
		this.subviewSet[subview.getId()] = subview;
		return this;
	}

	removeSubview(subview)
	{
		const removed = this.removeAggregation("subviews", subview);
		if (removed !== null)
		{
			removed.$element.detach();
		}
		this.subviewSet[subview.getId()] = null;
		delete this.subviewSet[subview.getId()];
		return removed;
	}

	removeAllSubviews()
	{
		while (this.getSubviews().length > 0)
		{
			let toBeRemoved = this.getSubviews()[0];
			this.removeSubview(toBeRemoved);
		}
	}

	addStyleClass(cls)
	{
		this.$element.addClass(cls);
		return this;
	}
	hasStyleClass(cls)
	{
		this.$element.hasClass(cls);
	}
	removeStyleClass(cls)
	{
		this.$element.removeClass(cls);
		return this;
	}
	toggleStyleClass(cls, state)
	{
		this.$element.toggleClass(cls, state);
		return this;
	}

	show(options)
	{
		this.$element.show(options);
	}

	hide(options)
	{
		this.$element.hide(options);
	}

	setFrame(frame, invalidate, resetAll)
	{
		if (!resetAll)
		{
			const currentFrame = this.getFrame();
			if (currentFrame !== null)
			{
				frame = $.extend(currentFrame, frame);
			}
		}
		else {
			frame = $.extend({
				width: "",
				height: "",
				top: "",
				left: "",
				right: "",
				bottom: ""
			}, frame);
		}
		this.setProperty("frame", frame);

		this.setSize({
            width: frame.width,
            height: frame.height
        });

        this.setPosition({
            left: frame.left,
            right: frame.right,
            top: frame.top,
            bottom: frame.bottom
        });
	}

    setSize(size)
    {
        if (!size) return;
        const frame = this.getFrame();
        if (size.width !== undefined)
		{
            frame.width = size.width;
			this.$element.css("width", size.width);
		}
		if (size.height !== undefined)
		{
            frame.height = size.height;
			this.$element.css("height", size.height);
		}
    }

    setPosition(position)
    {
        if (!position) return;
        const frame = this.getFrame();
        if (position.left !== undefined && position.left !== null || position.right !== undefined && position.right !== null || position.top !== undefined && position.top !== null || position.bottom !== undefined && position.bottom !== null)
		{
			const pos = this.$element.css("position");
			if (pos === "" || pos === "static" || pos === "relative") {
				this.$element.css("position", "absolute");
			}
		}
		if (position.left !== undefined)
		{
            frame.left = position.left;
			this.$element.css("left", position.left);
		}
		if (position.top !== undefined)
		{
            frame.top = position.top;
			this.$element.css("top", position.top);
		}
		if (position.right !== undefined)
		{
            frame.right = position.right;
			this.$element.css("right", position.right);
		}
		if (position.bottom !== undefined)
		{
            frame.bottom = position.bottom;
			this.$element.css("bottom", position.bottom);
		}
    }

	placeAt(target)
	{
		let $target = null;
		if (typeof (target) === "string")
		{
			$target = $("#" + target);
		}
		else
		{
			$target = $(target);
		}
		$target.append(this.$element);
	}

	getLocale()
	{
		return sap.ui.getCore().getConfiguration().getLocale();
	}

	$msg(bundleId, key, args)
	{
		let msg = "";
		const bundle = nju.app.Application.bundles[bundleId];
		if (bundle)
		{
			msg = bundle.getText(key, args);
		}
		return msg;
	}

	toString()
	{
		return `${this.getMetadata().getName()}[${this.getId()}]`;
	}
}
