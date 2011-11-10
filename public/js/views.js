;
(function(ns) {
    ns.Base = chorus.viewExtensions.extend({
        makeModel : $.noop,
        additionalContext: $.noop,

        preInitialize : function() {
            this.makeModel();
            this.resource = this.model || this.collection;

        },

        bindCallbacks : function() {
            if (this.resource) {
                if (!this.persistent) this.resource.bind("change", this.render);
                this.resource.bind("reset", this.render);
                this.resource.bind("add", this.render);
            }
        },

        context: function context() {
            if (!this.resource) return false;
            var ctx = $.extend({}, this.resource.attributes);
            ctx.loaded = this.resource.loaded;
            if (this.collection) {
                ctx.models = _.pluck(this.collection.models, "attributes");
            }
            $.extend(ctx, this.additionalContext(ctx));
            return ctx;
        }
    })

    ns.MainContentView = ns.Base.extend({
        className : "main_content",

        postRender : function() {
            this.contentHeader.el = this.$("#content_header");
            this.contentHeader.delegateEvents();
            this.contentHeader.render();

            if (this.contentDetails) {
                this.contentDetails.el = this.$("#content_details");
                this.contentDetails.delegateEvents();
                this.contentDetails.render();
            } else {
                this.$("#content_details").addClass("hidden");
            }

            this.content.el = this.$("#content");
            this.content.delegateEvents();
            this.content.render();
        }
    })
})(chorus.views);