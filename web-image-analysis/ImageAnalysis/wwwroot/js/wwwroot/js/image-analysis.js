"use strict";
//import * as signalR from '@microsoft/signalr';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var connection = new signalR.HubConnectionBuilder()
        .withUrl('/analysisHub')
        .build();
    connection.on('ReceiveAnalysis', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var img, canvas, ctx, waitForImage, ready, result, result, rect, scaleX_1, scaleY_1, people, detailsHtml;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log(data);
                    img = document.getElementById('analyzedImage');
                    canvas = document.getElementById('boundingBoxCanvas');
                    ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('2d');
                    waitForImage = function () { return new Promise(function (resolve, reject) {
                        if (img.complete && img.naturalWidth > 0)
                            return resolve();
                        img.addEventListener('load', function () { return resolve(); }, { once: true });
                        img.addEventListener('error', reject, { once: true });
                        if ('decode' in img)
                            img.decode().then(resolve).catch(function () { });
                    }); };
                    if (!data.imageDataUrl) return [3 /*break*/, 2];
                    ready = waitForImage();
                    img.src = data.imageDataUrl;
                    result = document.getElementById('analysisResults');
                    if (result) {
                        result.style.display = 'block';
                    }
                    return [4 /*yield*/, ready];
                case 1:
                    _g.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, waitForImage()];
                case 3:
                    _g.sent();
                    _g.label = 4;
                case 4:
                    if (data.analysisResult && canvas && ctx) {
                        result = data.analysisResult;
                        rect = img.getBoundingClientRect();
                        canvas.width = Math.max(1, Math.round(rect.width || img.naturalWidth));
                        canvas.height = Math.max(1, Math.round(rect.height || img.naturalHeight));
                        scaleX_1 = canvas.width / Math.max(1, img.naturalWidth);
                        scaleY_1 = canvas.height / Math.max(1, img.naturalHeight);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        people = (_b = (_a = result.people) === null || _a === void 0 ? void 0 : _a.values) !== null && _b !== void 0 ? _b : [];
                        if (people.length > 0) {
                            ctx.strokeStyle = '#00FF00';
                            ctx.fillStyle = '#00FF00';
                            people.forEach(function (person) {
                                if (person.confidence > 0.8) {
                                    var x = person.boundingBox.x * scaleX_1;
                                    var y = person.boundingBox.y * scaleY_1;
                                    var w = person.boundingBox.width * scaleX_1;
                                    var h = person.boundingBox.height * scaleY_1;
                                    ctx.strokeRect(x, y, w, h);
                                    ctx.fillText('Person', x, Math.max(10, y - 5));
                                }
                            });
                        }
                        detailsHtml = '';
                        if (result.caption) {
                            detailsHtml += "<div><strong>Caption:</strong> ".concat(result.caption.text, " (Confidence: ").concat(Number(result.caption.confidence).toFixed(2), ")</div>");
                        }
                        if (((_d = (_c = result.tags) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                            detailsHtml += '<div><strong>Tags:</strong> ' + result.tags.values.map(function (t) { return t.name; }).join(', ') + '</div>';
                        }
                        document.getElementById('analysisDetails').innerHTML = detailsHtml;
                    }
                    (_e = document.getElementById('loadingIcon')) === null || _e === void 0 ? void 0 : _e.classList.add('d-none');
                    (_f = document.getElementById('searchIcon')) === null || _f === void 0 ? void 0 : _f.classList.remove('d-none');
                    document.getElementById('submitText').textContent = 'Analyze Image';
                    document.getElementById('submitBtn').disabled = false;
                    return [2 /*return*/];
            }
        });
    }); });
    connection.on('AnalysisFailed', function (errorMessage) {
        var _a, _b;
        alert(errorMessage);
        (_a = document.getElementById('loadingIcon')) === null || _a === void 0 ? void 0 : _a.classList.add('d-none');
        (_b = document.getElementById('searchIcon')) === null || _b === void 0 ? void 0 : _b.classList.remove('d-none');
        document.getElementById('submitText').textContent = 'Analyze Image';
        document.getElementById('submitBtn').disabled = false;
    });
    connection.start().catch(function (err) {
        console.error(err.toString());
    });
    (_a = document.getElementById('uploadForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) {
        var _a;
        e.preventDefault();
        console.log('evet');
        var fileInput = document.getElementById('imageInput');
        var file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file) {
            alert('Please select an image file.');
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a, _b, _c;
            var base64Image = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result).split(',')[1];
            (_b = document.getElementById('loadingIcon')) === null || _b === void 0 ? void 0 : _b.classList.remove('d-none');
            (_c = document.getElementById('searchIcon')) === null || _c === void 0 ? void 0 : _c.classList.add('d-none');
            document.getElementById('submitText').textContent = 'Analyzing...';
            document.getElementById('submitBtn').disabled = true;
            connection.invoke('AnalyzeImage', base64Image).catch(function (err) {
                var _a, _b;
                console.error(err.toString());
                (_a = document.getElementById('loadingIcon')) === null || _a === void 0 ? void 0 : _a.classList.add('d-none');
                (_b = document.getElementById('searchIcon')) === null || _b === void 0 ? void 0 : _b.classList.remove('d-none');
                document.getElementById('submitText').textContent = 'Analyze Image';
                document.getElementById('submitBtn').disabled = false;
            });
        };
        reader.readAsDataURL(file);
    });
});
