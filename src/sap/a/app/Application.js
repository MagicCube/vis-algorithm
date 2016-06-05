/*----------------------------------------------------------------------*
 * Copyright  (c) 2015 SAP SE. All rights reserved
 * Author       : SAP Custom Development
 * Description  : View
 *----------------------------------------------------------------------*/

import View from "../view/View";

let __app_singleton = null;

export default class Application extends View
{
    metadata =
    {
        properties:
        {
            busy: {type: "boolean", defaultValue: false }
        }
    };

    static bundles = [];

    constructor(id, options, parent)
    {
        __app_singleton = this;
        if (parent)
        {
            this.__placeAt = parent;
        }
        super(id, options);
    }

    init()
    {
        super.init();
        this.addStyleClass("sap-a-app");
    }

    static getInstance()
    {
        return __app_singleton;
    }


    loadBundle(id, path)
    {
        if (!path)
        {
            path = id + "/i18n/messageBundle.properties";
        }
        const locale = this.getLocale();
        const bundle = jQuery.sap.resources(
        {
            url : jQuery.sap.getResourcePath(path),
            locale : locale.getLanguage()
        });
        nju.app.Application.bundles[id] = bundle;
    }

    setBusy(busy)
    {
        if (this.getBusy() !== busy)
        {
            this.setProperty("busy", busy);
            if (busy)
            {
                this.showOverlay();
            }
            else
            {
                this.hideOverlay();
            }
        }

    }

    showOverlay()
    {
        if (this._$overlay === undefined)
        {
            this._$overlay = $("<div id=aui-overlay class=overlay />");
        }
        $("body").append(this._$overlay);
        this._$overlay.fadeIn(500);
    }

    hideOverlay()
    {
        if (this._$overlay !== undefined)
        {
            this._$overlay.fadeOut(500, () => {
                this._$overlay.detach();
            })
        }
    }

    run()
    {

    }
}
