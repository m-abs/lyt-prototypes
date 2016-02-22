var fs = require("file-system");
var types = require("utils/types");

var Sound = (function () {
    function Sound() {
        if (arguments.length === 1) {
            var arg = arguments[0];
            var path = types.isString(arg) ? arg.trim() : "";

            if (path.indexOf("~/") === 0) {
                path = fs.path.join(fs.knownFolders.currentApp().path, path.replace("~/", ""));
            }
            var documents = fs.knownFolders.currentApp();
            console.log('folder:', documents.path);
            fs.Folder.fromPath(fs.path.join(documents.path, '')).eachEntity(function (entity) {
                console.log('-', entity.name);
                // Return true to continue, or return false to stop the iteration.
                return true;
            });
            console.log('path', path);
            
            if (!fs.File.exists(path)) {
                console.error("Sound not initialized; file not found.");
                return;
            }
            
            this._path = path;
        }
    }
    return Sound;
})();
exports.Sound = Sound;