chorus.dialogs.SandboxNew = chorus.dialogs.Base.extend({
    className: "sandbox_new",
    title: t("sandbox.new_dialog.title"),

    persistent: true,

    events: {
        "click button.submit": "save"
    },

    subviews: {
        "form > .instance_mode": "instanceMode"
    },

    setup: function() {
        this.instanceMode = new chorus.views.SchemaPicker({allowCreate: true});
        this.instanceMode.bind("change", this.enableOrDisableSaveButton, this);
    },

    makeModel: function() {
        this._super("makeModel", arguments);
        var workspaceId = this.options.launchElement.data("workspaceId");
        this.model = new chorus.models.Sandbox({ workspaceId: workspaceId });
        this.model.bind("saved", this.saved, this);
        this.model.bind("saveFailed", this.saveFailed, this);
        this.model.bind("validationFailed", this.saveFailed, this);
    },

    save: function(e) {
        this.$("button.submit").startLoading("sandbox.adding_sandbox");
        this.model.save(this.instanceMode.fieldValues());
    },

    saved: function() {
        chorus.toast("sandbox.create.toast");
        chorus.router.reload();
    },

    saveFailed: function() {
        this.$("button.submit").stopLoading();
    },

    enableOrDisableSaveButton: function(schemaVal) {
        this.$("button.submit").prop("disabled", !schemaVal);
    }
});