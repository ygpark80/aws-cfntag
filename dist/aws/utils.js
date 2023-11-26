"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnknown = exports.handleError = exports.handleSuccess = exports.accountId = exports.region = exports.TagResourceResult = void 0;
var TagResourceResult;
(function (TagResourceResult) {
    TagResourceResult["Success"] = "\u2705";
    TagResourceResult["Error"] = "\u274C";
    TagResourceResult["Unknown"] = "\u2753";
})(TagResourceResult || (exports.TagResourceResult = TagResourceResult = {}));
function region(resource) {
    return resource.StackId.split(':')[3];
}
exports.region = region;
function accountId(resource) {
    return resource.StackId.split(':')[4];
}
exports.accountId = accountId;
function handleSuccess(resource) {
    console.log(`✅ [${resource.ResourceType}] ${resource.PhysicalResourceId}`);
}
exports.handleSuccess = handleSuccess;
function handleError(resource, error) {
    console.log(`❌ [${resource.ResourceType}] ${resource.PhysicalResourceId}: `);
    console.error(error);
}
exports.handleError = handleError;
function handleUnknown(resource) {
    console.log(`❓ [${resource.ResourceType}]: No tagging logic implemented`);
}
exports.handleUnknown = handleUnknown;
exports.default = {
    handleSuccess,
    handleError,
    handleUnknown,
    region,
    accountId,
};
