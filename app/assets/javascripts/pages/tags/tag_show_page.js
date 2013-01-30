chorus.pages.TagShowPage = chorus.pages.SearchIndexPage.extend({

    crumbs: function() {
        return [
            { label: t("breadcrumbs.home"), url: "#/" },
            { label: t("breadcrumbs.tags"), url: "#/tags" },
            { label: this.tagModel.name() }
        ];
    },

    setup: function(name) {
        this._super("setup", arguments);
        this.tagModel = new chorus.models.Tag({name: name});
    },

    parseSearchParams: function(){
        var attrs = this._super("parseSearchParams", arguments);
        attrs.isTag = true;
        return attrs;
    },

    title: function() {
        return t("tag.show.title", {
            name: this.tagModel.name()
        });
    },

    typeOptions: function() {
        var options = this._super("typeOptions", arguments);
        _.findWhere(options, {data: "attachment"})["disabled"] = true;
        return options;
    }
});
