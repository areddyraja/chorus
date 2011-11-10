(function(ns) {

    ns.Bare = chorus.viewExtensions.extend({
        bindCallbacks: function() {
            if (chorus.user) chorus.user.bind("change", this.render);
        }
    })

    ns.Base = ns.Bare.extend({
        className : "logged_in_layout",

        postRender : function() {
            this.header = this.header || new chorus.views.Header();
            this.header.el = this.$("#header");
            this.header.delegateEvents();
            this.header.render();

            this.mainContent.el = this.$("#main_content");
            this.mainContent.delegateEvents();
            this.mainContent.render();

            this.breadcrumbs = new chorus.views.BreadcrumbsView({breadcrumbs: this.crumbs })
            this.breadcrumbs.el = this.$("#breadcrumbs")
            this.breadcrumbs.delegateEvents();
            this.breadcrumbs.render();

            //do we make a default sidebar?
            if (this.sidebar) {
                this.sidebar.el = this.$("#sidebar")
                this.sidebar.delegateEvents()
                this.sidebar.render();
            }
        }
    })

})(chorus.pages)