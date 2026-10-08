// ==UserScript==
// @name         OJ++
// @namespace    https://github.com/hsn8086/OJ-Plus-Plus
// @version      0.7.1
// @author       hsn8086
// @description  OJ-Plus-Plus：AI 题面翻译、Markdown 视图与一键复制
// @license      GPL-3.0
// @homepageURL  https://github.com/hsn8086/OJ-Plus-Plus
// @supportURL   https://github.com/hsn8086/OJ-Plus-Plus/issues
// @downloadURL  https://raw.githubusercontent.com/hsn8086/OJ-Plus-Plus/main/dist/oj-plus-plus.user.js
// @updateURL    https://raw.githubusercontent.com/hsn8086/OJ-Plus-Plus/main/dist/oj-plus-plus.user.js
// @match        https://ac.nowcoder.com/*
// @match        https://www.nowcoder.com/*
// @match        https://codeforces.com/*
// @match        https://m1.codeforces.com/*
// @match        https://m2.codeforces.com/*
// @match        https://codeforces.ml/*
// @connect      *
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function() {
	"use strict";
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var APP_NAME = "OJ++";
	var en$1 = {
		"common.copied": "Copied",
		"common.copyFailed": "Copy failed",
		"common.close": "Close",
		"common.cancel": "Cancel",
		"common.save": "Save",
		"common.unnamed": "Unnamed",
		"common.notFilled": "Not set",
		"app.settingsTitle": "{name} Settings",
		"app.settingsSaved": "Settings saved",
		"toolbar.group": "{label} toolbar",
		"toolbar.translate": "AI Translate",
		"toolbar.retranslate": "Retranslate",
		"toolbar.markdown": "Markdown view",
		"toolbar.backToOriginal": "Back to original",
		"toolbar.copyOriginal": "Copy original",
		"toolbar.noContent": "Nothing to translate",
		"toolbar.translating": "Translating — click to stop",
		"toolbar.translateFailed": "Translation failed: {message}",
		"toolbar.retry": "Retry: {message}",
		"result.title": "AI Translate",
		"result.copy": "Copy translation",
		"result.collapse": "Collapse",
		"result.expand": "Expand",
		"settings.title": "Settings",
		"settings.tab.general": "Translation",
		"settings.tab.provider": "Providers",
		"settings.tab.advanced": "Advanced",
		"settings.general": "General",
		"settings.basic": "Basic",
		"settings.behavior": "Behavior",
		"settings.providers": "Providers",
		"settings.language": "Language",
		"settings.name": "Name",
		"settings.manage": "Manage",
		"settings.edit": "Edit",
		"settings.duplicate": "Duplicate",
		"settings.delete": "Delete",
		"settings.noProvider": "No providers",
		"settings.noMatch": "No matches",
		"settings.search": "Search...",
		"settings.reset": "Reset to defaults",
		"settings.resetConfirm": "Reset to default settings? Your current configuration will be cleared.",
		"settings.saveFailed": "Save failed: {message}",
		"settings.uiLanguage": "Interface language",
		"settings.uiLanguageHint": "Language used for the settings panel and buttons. Follows the browser language by default.",
		"settings.localeAuto": "Follow browser",
		"settings.localeZh": "简体中文",
		"settings.localeEn": "English",
		"settings.targetLang": "Target language",
		"settings.targetLangHint": "Language for translations, e.g. 简体中文 / English / 日本語.",
		"settings.targetLangPlaceholder": "简体中文",
		"settings.extraPrompt": "Extra prompt",
		"settings.extraPromptPlaceholder": "e.g. Keep proper nouns in English; keep explanations brief.",
		"settings.extraPromptHint": "Appended after the built-in translation prompt.",
		"settings.wholeBlock": "Whole block",
		"settings.wholeBlockHint": "Send the whole block to the model in one request for fuller context. When off, content is split by headings and paragraphs, which suits very long problem statements or models with smaller context windows.",
		"settings.autoTranslate": "Auto-translate problem statement",
		"settings.autoTranslateHint": "Automatically translate the problem statement area when a problem page opens.",
		"settings.streaming": "Streaming",
		"settings.streamingHint": "Render as it generates for a faster first paint. When off, the full translation appears at once. Falls back automatically if the Provider or script manager doesn't support it.",
		"settings.theme": "Site theme",
		"settings.themeHint": "Only affects styles the script adds for the site. If the site has its own dark mode, keep “Follow system”.",
		"settings.themeAuto": "Follow system",
		"settings.themeLight": "Light",
		"settings.themeDark": "Dark",
		"settings.timeout": "Timeout (ms)",
		"settings.retries": "Retries",
		"settings.retriesHint": "Only applies to network errors and 5xx responses.",
		"settings.addProvider": "Add provider",
		"settings.editProvider": "Edit provider",
		"settings.backToList": "Back to list",
		"settings.chooseProvider": "Choose a provider",
		"settings.chooseProviderHint": "Start from a preset, or pick Custom and fill it in yourself.",
		"settings.providerSearch": "Search providers…",
		"settings.noProviderMatch": "No matching provider",
		"settings.providerList": "Configured",
		"settings.providerListEmpty": "No providers yet. Click “Add provider” above to start.",
		"settings.enableProvider": "Enabled",
		"settings.confirmAdd": "Add",
		"settings.deleteConfirm": "Delete this provider?",
		"settings.inUse": "In use",
		"settings.addFromPreset": "Add from preset",
		"settings.add": "Add",
		"settings.providerActive": "Active: {name} · {model}",
		"settings.manageProviders": "Manage providers",
		"settings.providerConfig": "Basic configuration",
		"settings.advancedOptions": "Advanced options",
		"settings.actions": "Actions",
		"settings.deleteProvider": "Delete",
		"settings.providerName": "Label",
		"settings.providerNamePlaceholder": "Name this configuration",
		"settings.protocol": "Protocol",
		"settings.protocolHint": "Determines the request body format and how responses are parsed.",
		"settings.baseUrl": "Base URL",
		"settings.baseUrlHint": "Up to /v1 is enough — the script appends /chat/completions, /responses, or /messages. You can also enter the full endpoint.",
		"settings.model": "Model",
		"settings.apiKeyPlaceholder": "Leave empty for local services",
		"settings.apiKeyHint": "Stored in this platform's local storage and sent with requests to your configured endpoint. Leave empty for local inference services; no auth header is sent.",
		"settings.reasoning": "Reasoning",
		"settings.reasoningHint": "Maps to the thinking field; only some Providers support it.",
		"settings.reasoningEffort": "Reasoning effort",
		"settings.reasoningEffortHint": "Maps to reasoning_effort / reasoning.effort.",
		"settings.effortDefault": "Model default",
		"settings.effortEnabled": "On",
		"settings.effortDisabled": "Off",
		"settings.headers": "Extra headers",
		"settings.headersPlaceholder": "X-Custom-Header: value\\nOne per line",
		"settings.headersHint": "One Key: Value per line; overrides default headers with the same name.",
		"settings.body": "Extra request body fields",
		"settings.bodyHint": "A JSON object merged into the request body; can override any field, such as top_p or max_tokens.",
		"settings.test": "Test connection",
		"settings.testing": "Testing…",
		"settings.testOk": "Connected. Model replied: {reply}",
		"settings.testFail": "Connection failed: {message}",
		"settings.copyProvider": "Duplicate configuration",
		"settings.providerCopySuffix": "{name} copy",
		"settings.keepOne": "At least one configuration is required.",
		"settings.providerFooter": "Configurations are stored in this platform's local storage. Translation content and API Key are sent to your configured Provider; you can test the connection on the Providers tab.",
		"settings.preview": "Configuration preview (Key hidden)",
		"settings.importPlaceholder": "Paste exported JSON, then click Import",
		"settings.import": "Import",
		"settings.importMissing": "Missing providers array",
		"settings.importOk": "Imported. Takes effect after saving.",
		"settings.importFail": "Import failed: {message}",
		"settings.importTitle": "Import configuration",
		"translate.status": "Translating…",
		"translate.statusChunk": "Translating chunk {index}/{total}…",
		"translate.unknownProvider": "Not configured",
		"error.noProvider": "No Provider configured yet. Open the settings panel and add one first.",
		"error.noModel": "Model name is empty",
		"error.requestFailed": "Translation request failed",
		"error.emptyResponse": "The endpoint returned an empty response; the model may not support this or the prompt was rejected",
		"error.emptyButOk": "(Empty response, but status code is OK)",
		"error.network": "Network request failed. Check your connection or the endpoint URL.",
		"error.timeout": "Request timed out",
		"error.streamRead": "Failed to read the Streaming response",
		"error.notUserscript": "Install OJ++ through Tampermonkey or Violentmonkey and grant the required permissions",
		"error.baseUrlEmpty": "Base URL is empty. Please fill it in the settings.",
		"site.nowcoder": "Nowcoder",
		"site.codeforces": "Codeforces",
		"section.statement": "Problem statement",
		"section.input": "Input",
		"section.output": "Output",
		"section.note": "Note",
		"section.solution": "Solution",
		"preset.customOpenAI": "Custom (OpenAI Chat compatible)"
	};
	var zh = {
		"common.copied": "已复制",
		"common.copyFailed": "复制失败",
		"common.close": "关闭",
		"common.cancel": "取消",
		"common.save": "保存",
		"common.unnamed": "未命名",
		"common.notFilled": "未填",
		"app.settingsTitle": "{name} 设置",
		"app.settingsSaved": "设置已保存",
		"toolbar.group": "{label}工具栏",
		"toolbar.translate": "AI 翻译",
		"toolbar.retranslate": "重新翻译",
		"toolbar.markdown": "Markdown 视图",
		"toolbar.backToOriginal": "返回原始内容",
		"toolbar.copyOriginal": "复制原文",
		"toolbar.noContent": "没有可翻译的内容",
		"toolbar.translating": "翻译中，点击中止",
		"toolbar.translateFailed": "翻译失败：{message}",
		"toolbar.retry": "重试：{message}",
		"result.title": "AI 翻译",
		"result.copy": "复制译文",
		"result.collapse": "收起",
		"result.expand": "展开",
		"settings.title": "设置",
		"settings.tab.general": "翻译设置",
		"settings.tab.provider": "提供商",
		"settings.tab.advanced": "高级",
		"settings.general": "通用",
		"settings.basic": "基础配置",
		"settings.behavior": "翻译行为",
		"settings.providers": "提供商",
		"settings.language": "界面语言",
		"settings.name": "名称",
		"settings.manage": "管理",
		"settings.edit": "编辑",
		"settings.duplicate": "复制",
		"settings.delete": "删除",
		"settings.noProvider": "无提供商",
		"settings.noMatch": "无匹配结果",
		"settings.search": "搜索...",
		"settings.reset": "恢复默认",
		"settings.resetConfirm": "确定恢复默认设置？当前配置会被清空。",
		"settings.saveFailed": "保存失败：{message}",
		"settings.uiLanguage": "界面语言",
		"settings.uiLanguageHint": "设置面板和按钮使用的语言。自动跟随浏览器语言。",
		"settings.localeAuto": "跟随浏览器",
		"settings.localeZh": "简体中文",
		"settings.localeEn": "English",
		"settings.targetLang": "目标语言",
		"settings.targetLangHint": "译文使用的语言，例如 简体中文 / English / 日本語。",
		"settings.targetLangPlaceholder": "简体中文",
		"settings.extraPrompt": "追加提示词",
		"settings.extraPromptPlaceholder": "例如：专有名词保留英文原文；解释尽量简短。",
		"settings.extraPromptHint": "会拼接到内置翻译提示词之后。",
		"settings.wholeBlock": "整段翻译",
		"settings.wholeBlockHint": "开启后把整块内容一次性发给模型，上下文更完整；关闭则按标题和段落切块，适合超长题面或上下文窗口较小的模型。",
		"settings.autoTranslate": "自动翻译题面",
		"settings.autoTranslateHint": "打开题目页后自动翻译题目描述区域。",
		"settings.streaming": "流式显示",
		"settings.streamingHint": "边生成边渲染，首屏更快。关闭后等整段译完再一次性显示；服务商或脚本管理器不支持时会自动回退。",
		"settings.theme": "站点配色",
		"settings.themeHint": "只影响脚本为站点补的样式；站点自身有暗色模式时选「跟随系统」即可。",
		"settings.themeAuto": "跟随系统",
		"settings.themeLight": "浅色",
		"settings.themeDark": "暗色",
		"settings.timeout": "超时（毫秒）",
		"settings.retries": "失败重试次数",
		"settings.retriesHint": "仅对网络错误和 5xx 生效。",
		"settings.addProvider": "添加提供商",
		"settings.editProvider": "编辑提供商",
		"settings.backToList": "返回列表",
		"settings.chooseProvider": "选择提供商",
		"settings.chooseProviderHint": "从预设开始，或选择自定义自己填。",
		"settings.providerSearch": "查找提供商…",
		"settings.noProviderMatch": "没有匹配的提供商",
		"settings.providerList": "已配置",
		"settings.providerListEmpty": "还没有提供商，点上面的「添加提供商」开始。",
		"settings.enableProvider": "启用",
		"settings.confirmAdd": "添加",
		"settings.deleteConfirm": "删除这个提供商？",
		"settings.inUse": "使用中",
		"settings.addFromPreset": "从预设新增",
		"settings.add": "新增",
		"settings.providerActive": "当前使用：{name} · {model}",
		"settings.manageProviders": "管理提供商",
		"settings.providerConfig": "基础配置",
		"settings.advancedOptions": "高级选项",
		"settings.actions": "操作",
		"settings.deleteProvider": "删除",
		"settings.providerName": "备注名",
		"settings.providerNamePlaceholder": "给这个配置起个名字",
		"settings.protocol": "接口协议",
		"settings.protocolHint": "决定请求体格式与响应解析方式。",
		"settings.baseUrl": "接口地址",
		"settings.baseUrlHint": "填到 /v1 即可，脚本会自动补 /chat/completions、/responses 或 /messages；也可直接填完整端点。",
		"settings.model": "模型",
		"settings.apiKeyPlaceholder": "本地服务可留空",
		"settings.apiKeyHint": "保存在当前平台的本地存储中，随请求发送到你配置的接口。本地推理服务可以留空，此时不会发送认证头。",
		"settings.reasoning": "推理开关",
		"settings.reasoningHint": "对应 thinking 字段，部分服务商才支持。",
		"settings.reasoningEffort": "推理强度",
		"settings.reasoningEffortHint": "对应 reasoning_effort / reasoning.effort。",
		"settings.effortDefault": "跟随模型默认",
		"settings.effortEnabled": "开启",
		"settings.effortDisabled": "关闭",
		"settings.headers": "额外请求头",
		"settings.headersPlaceholder": "X-Custom-Header: value\n每行一个",
		"settings.headersHint": "每行 Key: Value，会覆盖同名默认请求头。",
		"settings.body": "额外请求体字段",
		"settings.bodyHint": "JSON 对象，会合并进请求体，可覆盖任意字段，例如 top_p、max_tokens。",
		"settings.test": "测试连接",
		"settings.testing": "正在测试…",
		"settings.testOk": "连接成功，模型回复：{reply}",
		"settings.testFail": "连接失败：{message}",
		"settings.copyProvider": "复制配置",
		"settings.providerCopySuffix": "{name} 副本",
		"settings.keepOne": "至少保留一个配置。",
		"settings.providerFooter": "配置保存在当前平台的本地存储中。翻译内容与 API Key 发往你配置的提供商；可在「提供商」页测试连接。",
		"settings.preview": "配置预览（已隐藏 Key）",
		"settings.importPlaceholder": "粘贴导出的 JSON 后点「导入」",
		"settings.import": "导入",
		"settings.importMissing": "缺少 providers 数组",
		"settings.importOk": "导入成功，保存后生效。",
		"settings.importFail": "导入失败：{message}",
		"settings.importTitle": "导入配置",
		"translate.status": "正在翻译…",
		"translate.statusChunk": "正在翻译第 {index}/{total} 段…",
		"translate.unknownProvider": "未配置",
		"error.noProvider": "还没有配置任何提供商，请先打开设置面板添加一个",
		"error.noModel": "未填写模型名",
		"error.requestFailed": "翻译请求失败",
		"error.emptyResponse": "接口返回了空内容，可能是模型不支持或提示词被拒绝",
		"error.emptyButOk": "(空响应，但状态码正常)",
		"error.network": "网络请求失败，请检查网络或接口地址",
		"error.timeout": "请求超时",
		"error.streamRead": "读取流式响应失败",
		"error.notUserscript": "请通过 Tampermonkey 或 Violentmonkey 安装 OJ++，并允许脚本所需权限",
		"error.baseUrlEmpty": "接口地址为空，请在设置里填写",
		"site.nowcoder": "牛客",
		"site.codeforces": "Codeforces",
		"section.statement": "题目描述",
		"section.input": "输入描述",
		"section.output": "输出描述",
		"section.note": "提示",
		"section.solution": "题解",
		"preset.customOpenAI": "自定义（兼容 OpenAI Chat）"
	};
	var CATALOGS = {
		zh,
		en: en$1
	};
	function resolveLocale(setting, languages) {
		if (setting === "zh" || setting === "en") return setting;
		const first = (languages ?? (typeof navigator !== "undefined" ? navigator.languages ?? [] : []))[0] ?? "";
		return /^zh\b/i.test(first) ? "zh" : "en";
	}
	var current = "zh";
	var listeners = new Set();
	function getLocale() {
		return current;
	}
	function setLocale(locale) {
		if (locale === current) return;
		current = locale;
		for (const listener of listeners) listener(locale);
	}
	function t(key, params) {
		const template = CATALOGS[current][key] ?? zh[key] ?? key;
		if (!params) return template;
		return template.replace(/\{(\w+)\}/g, (match, name) => name in params ? String(params[name]) : match);
	}
	var SETTINGS_KEY = "ojpp:settings";
	var DEFAULT_TARGET_LANG = "简体中文";
	var DEFAULT_MODEL = "gpt-6-luna";
	var PROTOCOL_LABEL = {
		"openai-chat": "OpenAI Chat Completions",
		"openai-responses": "OpenAI Responses",
		anthropic: "Anthropic Messages"
	};
	var PROVIDER_PRESETS = [
		{
			key: "openai",
			label: "OpenAI（Chat Completions）",
			protocol: "openai-chat",
			baseUrl: "https://api.openai.com/v1",
			model: DEFAULT_MODEL
		},
		{
			key: "openai-responses",
			label: "OpenAI（Responses）",
			protocol: "openai-responses",
			baseUrl: "https://api.openai.com/v1",
			model: DEFAULT_MODEL
		},
		{
			key: "anthropic",
			label: "Anthropic Claude",
			protocol: "anthropic",
			baseUrl: "https://api.anthropic.com/v1",
			model: "claude-sonnet-4-5"
		},
		{
			key: "deepseek",
			label: "DeepSeek",
			protocol: "openai-chat",
			baseUrl: "https://api.deepseek.com/v1",
			model: "deepseek-chat"
		},
		{
			key: "openrouter",
			label: "OpenRouter",
			protocol: "openai-chat",
			baseUrl: "https://openrouter.ai/api/v1",
			model: "openai/gpt-4o-mini"
		},
		{
			key: "custom",
			get label() {
				return t("preset.customOpenAI");
			},
			protocol: "openai-chat",
			baseUrl: "",
			model: DEFAULT_MODEL
		}
	];
	function newId() {
		return Math.random().toString(36).slice(2, 10);
	}
	function createProvider(preset) {
		return {
			id: newId(),
			name: preset.label,
			protocol: preset.protocol,
			baseUrl: preset.baseUrl,
			apiKey: "",
			model: preset.model,
			headers: {},
			body: {},
			reasoning: {
				enabled: null,
				effort: ""
			}
		};
	}
	function defaultSettings() {
		const openai = createProvider(PROVIDER_PRESETS[0]);
		return {
			version: 1,
			activeProviderId: openai.id,
			providers: [openai],
			targetLang: DEFAULT_TARGET_LANG,
			extraPrompt: "",
			translateWholeBlock: true,
			autoTranslate: false,
			timeoutMs: 12e4,
			retries: 1,
			streaming: true,
			locale: "auto",
			theme: "auto"
		};
	}
	function migrate(raw) {
		const base = defaultSettings();
		if (!raw || typeof raw !== "object") return base;
		const input = raw;
		const providers = Array.isArray(input.providers) ? input.providers.filter((p) => !!p && typeof p === "object").map((p) => {
			const merged = {
				...createProvider(PROVIDER_PRESETS[0]),
				...p,
				headers: p.headers ?? {},
				body: p.body ?? {},
				reasoning: p.reasoning ?? {
					enabled: null,
					effort: ""
				}
			};
			const legacy = p.temperature;
			if (typeof legacy === "number") merged.body = {
				temperature: legacy,
				...merged.body
			};
			return merged;
		}) : base.providers;
		const settings = {
			...base,
			...input,
			providers,
			version: base.version
		};
		if (!settings.providers.some((p) => p.id === settings.activeProviderId)) settings.activeProviderId = settings.providers[0]?.id ?? null;
		return settings;
	}
	async function loadSettings(storage) {
		return migrate(await storage.get(SETTINGS_KEY));
	}
	async function saveSettings(storage, settings) {
		await storage.set(SETTINGS_KEY, settings);
	}
	function svg(path, viewBox = "0 0 24 24") {
		return `<svg viewBox="${viewBox}" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
	}
	var ICON_TRANSLATE = svg("<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18\"/><path d=\"M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z\"/>");
	var ICON_MARKDOWN = svg("<path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"/><path d=\"M14 3v5h5\"/><path d=\"M9 13v4\"/><path d=\"M12 15l2 2 2-2\"/>");
	var ICON_COPY = svg("<rect x=\"9\" y=\"9\" width=\"12\" height=\"12\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/>");
	var ICON_SETTINGS = svg("<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.6a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 0z\"/>");
	var ICON_CHECK = svg("<path d=\"M20 6 9 17l-5-5\"/>");
	var ICON_CHEVRON = svg("<path d=\"m6 15 6-6 6 6\"/>");
	var ICON_CHEVRON_RIGHT = svg("<path d=\"m6 9 6 6 6-6\"/>");
	var ICON_CROSS = svg("<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>");
	var ICON_SPINNER = svg("<path d=\"M21 12a9 9 0 1 1-6.2-8.6\"/>");
	function setIcon(button, icon, title) {
		button.innerHTML = icon;
		button.title = title;
		button.setAttribute("aria-label", title);
	}
	function iconButton(icon, title, className = "") {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `ojpp-icon-btn ${className}`.trim();
		setIcon(button, icon, title);
		return button;
	}
	function bindCopy(button, readText, writeClipboard) {
		const icon = button.innerHTML;
		const title = button.title;
		let timer;
		button.addEventListener("click", async () => {
			clearTimeout(timer);
			button.disabled = true;
			try {
				await writeClipboard(readText());
				button.dataset.state = "done";
				setIcon(button, ICON_CHECK, t("common.copied"));
			} catch {
				button.dataset.state = "error";
				setIcon(button, ICON_CROSS, t("common.copyFailed"));
			}
			timer = setTimeout(() => {
				button.dataset.state = "";
				setIcon(button, icon, title);
				button.disabled = false;
			}, 1500);
		});
	}
	function createSseParser() {
		let buffer = "";
		return (chunk) => {
			buffer += chunk;
			const events = [];
			for (;;) {
				const match = /\r?\n\r?\n/.exec(buffer);
				if (!match) break;
				const block = buffer.slice(0, match.index);
				buffer = buffer.slice(match.index + match[0].length);
				const data = block.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).replace(/^ /, "")).join("\n");
				if (data) events.push(data);
			}
			return events;
		};
	}
	function parseJson(text) {
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	}
	function trimSlash(url) {
		return url.replace(/\/+$/, "");
	}
	function resolveUrl(baseUrl, fallbackBase, suffix) {
		const base = trimSlash((baseUrl || fallbackBase).trim());
		if (!base) throw new Error(t("error.baseUrlEmpty"));
		if (/\/[a-z0-9-]+$/i.test(base) && /(completions|messages|responses|chat)$/i.test(base)) return base;
		return base + suffix;
	}
	function mergeHeaders(base, extra) {
		const out = { ...base };
		for (const [key, value] of Object.entries(extra)) if (key.trim()) out[key.trim()] = value;
		return out;
	}
	function authHeader(name, value) {
		const key = value.trim();
		return key ? { [name]: name === "Authorization" ? `Bearer ${key}` : key } : {};
	}
	function compact(obj) {
		const out = {};
		for (const [key, value] of Object.entries(obj)) if (value !== void 0 && value !== null) out[key] = value;
		return out;
	}
	function streamReader(pick) {
		return () => {
			let acc = "";
			const parser = createSseParser();
			let seen = 0;
			return (raw) => {
				for (const event of parser(raw.slice(seen))) {
					if (event === "[DONE]") continue;
					const text = pick(parseJson(event));
					if (text) acc += text;
				}
				seen = raw.length;
				return acc || null;
			};
		};
	}
	var openaiChatStream = streamReader((payload) => {
		return normalizeContent(payload?.choices?.[0]?.delta?.content) || null;
	});
	var openaiResponsesStream = streamReader((payload) => {
		const data = payload;
		if (typeof data?.delta === "string" && data.delta) return data.delta;
		if (typeof data?.output_text === "string" && data.output_text) return data.output_text;
		return null;
	});
	var anthropicStream = streamReader((payload) => {
		const data = payload;
		if (data?.type === "content_block_delta" && typeof data.delta?.text === "string") return data.delta.text;
		return null;
	});
	var openaiChat = {
		protocol: "openai-chat",
		label: "OpenAI Chat Completions",
		defaultBaseUrl: "https://api.openai.com/v1",
		defaultModel: DEFAULT_MODEL,
		build(cfg, req) {
			const url = resolveUrl(cfg.baseUrl, this.defaultBaseUrl, "/chat/completions");
			const body = compact({
				model: cfg.model || this.defaultModel,
				messages: req.messages,
				...req.stream ? { stream: true } : {},
				...cfg.reasoning.enabled === null ? {} : { thinking: { type: cfg.reasoning.enabled ? "enabled" : "disabled" } },
				...cfg.reasoning.effort && cfg.reasoning.enabled !== false ? { reasoning_effort: cfg.reasoning.effort } : {},
				...cfg.body
			});
			return {
				url,
				headers: mergeHeaders({
					"Content-Type": "application/json",
					...authHeader("Authorization", cfg.apiKey)
				}, cfg.headers),
				body
			};
		},
		extractText(payload) {
			const message = payload?.choices?.[0]?.message;
			if (!message) return "";
			return normalizeContent(message.content);
		},
		createStreamReader: openaiChatStream,
		extractError(payload) {
			const data = payload;
			return data?.error?.message || data?.message || "";
		}
	};
	var openaiResponses = {
		protocol: "openai-responses",
		label: "OpenAI Responses",
		defaultBaseUrl: "https://api.openai.com/v1",
		defaultModel: DEFAULT_MODEL,
		build(cfg, req) {
			const url = resolveUrl(cfg.baseUrl, this.defaultBaseUrl, "/responses");
			const body = compact({
				model: cfg.model || this.defaultModel,
				input: req.messages.map((m) => ({
					role: m.role,
					content: m.content
				})),
				...req.stream ? { stream: true } : {},
				...cfg.reasoning.effort ? { reasoning: { effort: cfg.reasoning.effort } } : {},
				...cfg.body
			});
			return {
				url,
				headers: mergeHeaders({
					"Content-Type": "application/json",
					...authHeader("Authorization", cfg.apiKey)
				}, cfg.headers),
				body
			};
		},
		extractText(payload) {
			const data = payload;
			if (typeof data?.output_text === "string" && data.output_text) return data.output_text;
			if (Array.isArray(data?.output)) {
				const parts = [];
				for (const item of data.output) for (const chunk of item?.content ?? []) if (typeof chunk?.text === "string") parts.push(chunk.text);
				if (parts.length) return parts.join("");
			}
			return normalizeContent(data?.choices?.[0]?.message?.content);
		},
		createStreamReader: openaiResponsesStream,
		extractError(payload) {
			const data = payload;
			return data?.error?.message || data?.message || "";
		}
	};
	var anthropic = {
		protocol: "anthropic",
		label: "Anthropic Messages",
		defaultBaseUrl: "https://api.anthropic.com/v1",
		defaultModel: "claude-sonnet-4-5",
		build(cfg, req) {
			const url = resolveUrl(cfg.baseUrl, this.defaultBaseUrl, "/messages");
			const system = req.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
			const messages = req.messages.filter((m) => m.role !== "system").map((m) => ({
				role: m.role,
				content: m.content
			}));
			const body = compact({
				model: cfg.model || this.defaultModel,
				max_tokens: 8192,
				...system ? { system } : {},
				messages,
				...req.stream ? { stream: true } : {},
				...cfg.reasoning.effort && cfg.reasoning.enabled !== false ? { thinking: {
					type: "enabled",
					budget_tokens: effortToBudget(cfg.reasoning.effort)
				} } : {},
				...cfg.body
			});
			return {
				url,
				headers: mergeHeaders({
					"Content-Type": "application/json",
					...authHeader("x-api-key", cfg.apiKey),
					"anthropic-version": "2023-06-01",
					"anthropic-dangerous-direct-browser-access": "true"
				}, cfg.headers),
				body
			};
		},
		extractText(payload) {
			const data = payload;
			if (!Array.isArray(data?.content)) return "";
			return data.content.filter((block) => block?.type === "text" && typeof block.text === "string").map((block) => block.text).join("");
		},
		createStreamReader: anthropicStream,
		extractError(payload) {
			const data = payload;
			return data?.error?.message || data?.message || "";
		}
	};
	function effortToBudget(effort) {
		return {
			low: 2048,
			minimal: 1024,
			medium: 8192,
			high: 16384,
			xhigh: 32768
		}[effort] ?? 4096;
	}
	function normalizeContent(content) {
		if (typeof content === "string") return content;
		if (Array.isArray(content)) return content.map((part) => {
			if (typeof part === "string") return part;
			const p = part;
			return typeof p?.text === "string" ? p.text : "";
		}).join("");
		return "";
	}
	var ADAPTERS = {
		"openai-chat": openaiChat,
		"openai-responses": openaiResponses,
		anthropic
	};
	function getAdapter(protocol) {
		return ADAPTERS[protocol] ?? openaiChat;
	}
	var AiError = class extends Error {
		status;
		constructor(message, status) {
			super(message);
			this.name = "AiError";
			this.status = status;
		}
	};
	async function ask(request, settings, prompt, systemPrompt, options = {}) {
		const cfg = settings.providers.find((p) => p.id === settings.activeProviderId);
		if (!cfg) throw new AiError(t("error.noProvider"));
		if (!cfg.model.trim()) throw new AiError(t("error.noModel"));
		const attempts = Math.max(1, settings.retries + 1);
		let lastError;
		const shown = [];
		const optionsWithGuard = options.onDelta ? {
			...options,
			onDelta: (text) => {
				shown.push(text);
				options.onDelta(text);
			}
		} : options;
		for (let i = 0; i < attempts; i += 1) {
			if (options.signal?.aborted) throw new DOMException("Aborted", "AbortError");
			try {
				return await once(request, settings, cfg, prompt, systemPrompt, optionsWithGuard);
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") throw error;
				lastError = error;
				if (error instanceof AiError && isFatal(error.status)) break;
				if (shown.length > 0) break;
				if (i < attempts - 1) await sleep(600 * (i + 1), options.signal);
			}
		}
		throw lastError instanceof Error ? lastError : new AiError("翻译请求失败");
	}
	async function once(request, settings, cfg, prompt, systemPrompt, options) {
		const adapter = getAdapter(cfg.protocol);
		const wantStream = !!(options.stream && options.onDelta && adapter.createStreamReader);
		const messages = [{
			role: "system",
			content: systemPrompt
		}, {
			role: "user",
			content: prompt
		}];
		const build = (stream) => {
			const { url, headers, body } = adapter.build(cfg, {
				messages,
				stream
			});
			return {
				method: "POST",
				url,
				headers,
				body: JSON.stringify(body),
				timeoutMs: settings.timeoutMs,
				signal: options.signal
			};
		};
		if (wantStream) {
			let streamed = false;
			const readStream = adapter.createStreamReader();
			try {
				const res = await options.stream({
					...build(true),
					onChunk: (raw) => {
						const text = readStream(raw);
						if (text) {
							streamed = true;
							options.onDelta(text);
						}
					}
				});
				if (res.status < 200 || res.status >= 300) {
					const payload = safeJson(res.text);
					const detail = payload && adapter.extractError?.(payload) || truncate(res.text, 400) || res.statusText;
					throw new AiError(`${res.status} ${detail}`, res.status);
				}
				const finalText = readStream(res.text) ?? "";
				if (finalText.trim()) return finalText;
				const fallback = adapter.extractText(safeJson(res.text));
				if (fallback.trim()) return fallback;
				throw new AiError(t("error.emptyResponse"));
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") throw error;
				if (error instanceof AiError && isFatal(error.status)) throw error;
				if (streamed) throw error;
			}
		}
		const res = await request(build(false));
		const payload = safeJson(res.text);
		if (res.status < 200 || res.status >= 300) {
			const detail = payload && adapter.extractError?.(payload) || truncate(res.text, 400) || res.statusText;
			throw new AiError(`${res.status} ${detail}`, res.status);
		}
		const text = adapter.extractText(payload);
		if (!text.trim()) throw new AiError(t("error.emptyResponse"));
		if (wantStream) options.onDelta(text);
		return text;
	}
	function safeJson(text) {
		if (!text) return null;
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	}
	function isFatal(status) {
		return status === 400 || status === 401 || status === 403 || status === 404;
	}
	function sleep(ms, signal) {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				signal?.removeEventListener("abort", onAbort);
				resolve();
			}, ms);
			function onAbort() {
				clearTimeout(timer);
				reject(new DOMException("Aborted", "AbortError"));
			}
			signal?.addEventListener("abort", onAbort, { once: true });
		});
	}
	function truncate(text, max) {
		const clean = text.replace(/\s+/g, " ").trim();
		return clean.length > max ? `${clean.slice(0, max)}…` : clean;
	}
	async function testConnection(request, settings, cfg) {
		const adapter = getAdapter(cfg.protocol);
		const { url, headers, body } = adapter.build(cfg, { messages: [{
			role: "user",
			content: "reply with the single word: ok"
		}] });
		if (cfg.protocol === "anthropic") body.max_tokens = 16;
		const res = await request({
			method: "POST",
			url,
			headers,
			body: JSON.stringify(body),
			timeoutMs: Math.min(settings.timeoutMs, 3e4)
		});
		let payload;
		try {
			payload = JSON.parse(res.text);
		} catch {
			payload = null;
		}
		if (res.status < 200 || res.status >= 300) {
			const detail = payload && adapter.extractError?.(payload) || truncate(res.text, 300);
			throw new AiError(`${res.status} ${detail}`, res.status);
		}
		return adapter.extractText(payload) || t("error.emptyButOk");
	}
	function buildSystemPrompt(settings) {
		const lines = [
			`你是一名编程竞赛（算法竞赛）题面的专业译者。把用户给出的 Markdown 文本翻译成${settings.targetLang.trim() || "简体中文"}。`,
			"",
			"硬性要求：",
			"1. 只输出译文本身，不要任何前言、解释、总结或代码块包裹。",
			"2. 原样保留 Markdown 结构：标题层级、列表、表格、引用、代码块、加粗斜体、链接。",
			"3. 原样保留 LaTeX 公式（$...$ 与 $$...$$）以及公式内的所有字符，绝不翻译、改写或换行。",
			"   译文里出现的 $ 分隔符数量必须与原文一致，不要去掉、不要改成别的写法。",
			"4. 变量名、函数名、类名、宏、复杂度记号（如 O(n log n)）、输入输出样例、文件名保持原样。",
			"5. 不要翻译代码块内部的内容，只翻译代码块外的说明文字。",
			"6. 术语按中文竞赛习惯翻译，例如：sample → 样例，constraint → 数据范围，subtask → 子任务，",
			"   test case → 测试点，interactive → 交互题，time limit → 时间限制。",
			"7. 保持原文的段落划分，不要把多个段落合并成一段，也不要增加原文没有的段落。",
			"8. 如果原文已经是目标语言，直接原样返回。"
		];
		if (settings.extraPrompt.trim()) lines.push("", "额外要求：", settings.extraPrompt.trim());
		return lines.join("\n");
	}
	function chunkMarkdown(source, maxChars = 3e3) {
		const text = source.trim();
		if (text.length <= maxChars) return text ? [text] : [];
		const sections = text.split(/\n(?=#{1,6}\s)/);
		const chunks = [];
		for (const section of sections) {
			if (section.length <= maxChars) {
				chunks.push(section);
				continue;
			}
			const paragraphs = section.split(/\n{2,}/);
			let buffer = "";
			for (const para of paragraphs) {
				if (buffer && buffer.length + para.length + 2 > maxChars) {
					chunks.push(buffer);
					buffer = "";
				}
				if (para.length > maxChars) {
					const lines = para.split("\n");
					let lineBuffer = "";
					for (const line of lines) {
						if (lineBuffer && lineBuffer.length + line.length + 1 > maxChars) {
							chunks.push(lineBuffer);
							lineBuffer = "";
						}
						lineBuffer = lineBuffer ? `${lineBuffer}\n${line}` : line;
					}
					if (lineBuffer) chunks.push(lineBuffer);
					continue;
				}
				buffer = buffer ? `${buffer}\n\n${para}` : para;
			}
			if (buffer) chunks.push(buffer);
		}
		return chunks.filter((c) => c.trim());
	}
	async function translateMarkdown(request, { settings, markdown, signal, onStatus, onPartial, stream, streaming }) {
		const cfg = settings.providers.find((p) => p.id === settings.activeProviderId);
		const system = buildSystemPrompt(settings);
		const chunks = settings.translateWholeBlock ? [markdown] : chunkMarkdown(markdown);
		const started = Date.now();
		const out = [];
		const useStream = !!stream && streaming !== false;
		for (const [index, chunk] of chunks.entries()) {
			signal?.throwIfAborted();
			onStatus?.(chunks.length === 1 ? t("translate.status") : t("translate.statusChunk", {
				index: index + 1,
				total: chunks.length
			}));
			const done = out.length;
			const translated = await ask(request, settings, chunk, system, {
				signal,
				stream,
				onDelta: useStream ? (text) => onPartial?.([...out, text].join("\n\n")) : void 0
			});
			out.push(translated.trim());
			onPartial?.(out.slice(0, done + 1).join("\n\n"));
		}
		return {
			markdown: out.join("\n\n"),
			providerName: cfg?.name ?? t("translate.unknownProvider"),
			model: cfg?.model ?? "",
			elapsedMs: Date.now() - started
		};
	}
	var decodeCache = {};
	function getDecodeCache(exclude) {
		let cache = decodeCache[exclude];
		if (cache) return cache;
		cache = decodeCache[exclude] = [];
		for (let i = 0; i < 128; i++) {
			const ch = String.fromCharCode(i);
			cache.push(ch);
		}
		for (let i = 0; i < exclude.length; i++) {
			const ch = exclude.charCodeAt(i);
			cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
		}
		return cache;
	}
	function decode$1(string, exclude) {
		if (typeof exclude !== "string") exclude = decode$1.defaultChars;
		const cache = getDecodeCache(exclude);
		return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
			let result = "";
			for (let i = 0, l = seq.length; i < l; i += 3) {
				const b1 = parseInt(seq.slice(i + 1, i + 3), 16);
				if (b1 < 128) {
					result += cache[b1];
					continue;
				}
				if ((b1 & 224) === 192 && i + 3 < l) {
					const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
					if ((b2 & 192) === 128) {
						const chr = b1 << 6 & 1984 | b2 & 63;
						if (chr < 128) result += "��";
						else result += String.fromCharCode(chr);
						i += 3;
						continue;
					}
				}
				if ((b1 & 240) === 224 && i + 6 < l) {
					const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
					const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
					if ((b2 & 192) === 128 && (b3 & 192) === 128) {
						const chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
						if (chr < 2048 || chr >= 55296 && chr <= 57343) result += "���";
						else result += String.fromCharCode(chr);
						i += 6;
						continue;
					}
				}
				if ((b1 & 248) === 240 && i + 9 < l) {
					const b2 = parseInt(seq.slice(i + 4, i + 6), 16);
					const b3 = parseInt(seq.slice(i + 7, i + 9), 16);
					const b4 = parseInt(seq.slice(i + 10, i + 12), 16);
					if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
						let chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
						if (chr < 65536 || chr > 1114111) result += "����";
						else {
							chr -= 65536;
							result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
						}
						i += 9;
						continue;
					}
				}
				result += "�";
			}
			return result;
		});
	}
	decode$1.defaultChars = ";/?:@&=+$,#";
	decode$1.componentChars = "";
	var encodeCache = {};
	function getEncodeCache(exclude) {
		let cache = encodeCache[exclude];
		if (cache) return cache;
		cache = encodeCache[exclude] = [];
		for (let i = 0; i < 128; i++) {
			const ch = String.fromCharCode(i);
			if (/^[0-9a-z]$/i.test(ch)) cache.push(ch);
			else cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
		}
		for (let i = 0; i < exclude.length; i++) cache[exclude.charCodeAt(i)] = exclude[i];
		return cache;
	}
	function encode$1(string, exclude, keepEscaped) {
		if (typeof exclude !== "string") {
			keepEscaped = exclude;
			exclude = encode$1.defaultChars;
		}
		if (typeof keepEscaped === "undefined") keepEscaped = true;
		const cache = getEncodeCache(exclude);
		let result = "";
		for (let i = 0, l = string.length; i < l; i++) {
			const code = string.charCodeAt(i);
			if (keepEscaped && code === 37 && i + 2 < l) {
				if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
					result += string.slice(i, i + 3);
					i += 2;
					continue;
				}
			}
			if (code < 128) {
				result += cache[code];
				continue;
			}
			if (code >= 55296 && code <= 57343) {
				if (code >= 55296 && code <= 56319 && i + 1 < l) {
					const nextCode = string.charCodeAt(i + 1);
					if (nextCode >= 56320 && nextCode <= 57343) {
						result += encodeURIComponent(string[i] + string[i + 1]);
						i++;
						continue;
					}
				}
				result += "%EF%BF%BD";
				continue;
			}
			result += encodeURIComponent(string[i]);
		}
		return result;
	}
	encode$1.defaultChars = ";/?:@&=+$,-_.!~*'()#";
	encode$1.componentChars = "-_.!~*'()";
	function format(url) {
		let result = "";
		result += url.protocol || "";
		result += url.slashes ? "//" : "";
		result += url.auth ? url.auth + "@" : "";
		if (url.hostname && url.hostname.indexOf(":") !== -1) result += "[" + url.hostname + "]";
		else result += url.hostname || "";
		result += url.port ? ":" + url.port : "";
		result += url.pathname || "";
		result += url.search || "";
		result += url.hash || "";
		return result;
	}
	function Url() {
		this.protocol = null;
		this.slashes = null;
		this.auth = null;
		this.port = null;
		this.hostname = null;
		this.hash = null;
		this.search = null;
		this.pathname = null;
	}
	var protocolPattern = /^([a-z0-9.+-]+:)/i;
	var portPattern = /:[0-9]*$/;
	var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
	var unwise = [
		"{",
		"}",
		"|",
		"\\",
		"^",
		"`"
	].concat([
		"<",
		">",
		"\"",
		"`",
		" ",
		"\r",
		"\n",
		"	"
	]);
	var autoEscape = ["'"].concat(unwise);
	var nonHostChars = [
		"%",
		"/",
		"?",
		";",
		"#"
	].concat(autoEscape);
	var hostEndingChars = [
		"/",
		"?",
		"#"
	];
	var hostnameMaxLen = 255;
	var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
	var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
	var hostlessProtocol = {
		javascript: true,
		"javascript:": true
	};
	var slashedProtocol = {
		http: true,
		https: true,
		ftp: true,
		gopher: true,
		file: true,
		"http:": true,
		"https:": true,
		"ftp:": true,
		"gopher:": true,
		"file:": true
	};
	function urlParse(url, slashesDenoteHost) {
		if (url && url instanceof Url) return url;
		const u = new Url();
		u.parse(url, slashesDenoteHost);
		return u;
	}
	Url.prototype.parse = function(url, slashesDenoteHost) {
		let lowerProto, hec, slashes;
		let rest = url;
		rest = rest.trim();
		if (!slashesDenoteHost && url.split("#").length === 1) {
			const simplePath = simplePathPattern.exec(rest);
			if (simplePath) {
				this.pathname = simplePath[1];
				if (simplePath[2]) this.search = simplePath[2];
				return this;
			}
		}
		let proto = protocolPattern.exec(rest);
		if (proto) {
			proto = proto[0];
			lowerProto = proto.toLowerCase();
			this.protocol = proto;
			rest = rest.substr(proto.length);
		}
		if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
			slashes = rest.substr(0, 2) === "//";
			if (slashes && !(proto && hostlessProtocol[proto])) {
				rest = rest.substr(2);
				this.slashes = true;
			}
		}
		if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
			let hostEnd = -1;
			for (let i = 0; i < hostEndingChars.length; i++) {
				hec = rest.indexOf(hostEndingChars[i]);
				if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
			}
			let auth, atSign;
			if (hostEnd === -1) atSign = rest.lastIndexOf("@");
			else atSign = rest.lastIndexOf("@", hostEnd);
			if (atSign !== -1) {
				auth = rest.slice(0, atSign);
				rest = rest.slice(atSign + 1);
				this.auth = auth;
			}
			hostEnd = -1;
			for (let i = 0; i < nonHostChars.length; i++) {
				hec = rest.indexOf(nonHostChars[i]);
				if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
			}
			if (hostEnd === -1) hostEnd = rest.length;
			if (rest[hostEnd - 1] === ":") hostEnd--;
			const host = rest.slice(0, hostEnd);
			rest = rest.slice(hostEnd);
			this.parseHost(host);
			this.hostname = this.hostname || "";
			const ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
			if (!ipv6Hostname) {
				const hostparts = this.hostname.split(/\./);
				for (let i = 0, l = hostparts.length; i < l; i++) {
					const part = hostparts[i];
					if (!part) continue;
					if (!part.match(hostnamePartPattern)) {
						let newpart = "";
						for (let j = 0, k = part.length; j < k; j++) if (part.charCodeAt(j) > 127) newpart += "x";
						else newpart += part[j];
						if (!newpart.match(hostnamePartPattern)) {
							const validParts = hostparts.slice(0, i);
							const notHost = hostparts.slice(i + 1);
							const bit = part.match(hostnamePartStart);
							if (bit) {
								validParts.push(bit[1]);
								notHost.unshift(bit[2]);
							}
							if (notHost.length) rest = notHost.join(".") + rest;
							this.hostname = validParts.join(".");
							break;
						}
					}
				}
			}
			if (this.hostname.length > hostnameMaxLen) this.hostname = "";
			if (ipv6Hostname) this.hostname = this.hostname.substr(1, this.hostname.length - 2);
		}
		const hash = rest.indexOf("#");
		if (hash !== -1) {
			this.hash = rest.substr(hash);
			rest = rest.slice(0, hash);
		}
		const qm = rest.indexOf("?");
		if (qm !== -1) {
			this.search = rest.substr(qm);
			rest = rest.slice(0, qm);
		}
		if (rest) this.pathname = rest;
		if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) this.pathname = "";
		return this;
	};
	Url.prototype.parseHost = function(host) {
		let port = portPattern.exec(host);
		if (port) {
			port = port[0];
			if (port !== ":") this.port = port.substr(1);
			host = host.substr(0, host.length - port.length);
		}
		if (host) this.hostname = host;
	};
	var mdurl_exports = __exportAll({
		decode: () => decode$1,
		encode: () => encode$1,
		format: () => format,
		parse: () => urlParse
	});
	var regex_default$5 = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var regex_default$4 = /[\0-\x1F\x7F-\x9F]/;
	var regex_default$3 = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
	var regex_default$2 = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
	var regex_default$1 = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/;
	var regex_default = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
	var uc_micro_exports = __exportAll({
		Any: () => regex_default$5,
		Cc: () => regex_default$4,
		Cf: () => regex_default$3,
		P: () => regex_default$2,
		S: () => regex_default$1,
		Z: () => regex_default
	});
	var decode_data_html_default = new Uint16Array("ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻\"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌".split("").map((c) => c.charCodeAt(0)));
	var decode_data_xml_default = new Uint16Array("Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((c) => c.charCodeAt(0)));
	var _a;
	var decodeMap = new Map([
		[0, 65533],
		[128, 8364],
		[130, 8218],
		[131, 402],
		[132, 8222],
		[133, 8230],
		[134, 8224],
		[135, 8225],
		[136, 710],
		[137, 8240],
		[138, 352],
		[139, 8249],
		[140, 338],
		[142, 381],
		[145, 8216],
		[146, 8217],
		[147, 8220],
		[148, 8221],
		[149, 8226],
		[150, 8211],
		[151, 8212],
		[152, 732],
		[153, 8482],
		[154, 353],
		[155, 8250],
		[156, 339],
		[158, 382],
		[159, 376]
	]);
	var fromCodePoint$1 = (_a = String.fromCodePoint) !== null && _a !== void 0 ? _a : function(codePoint) {
		let output = "";
		if (codePoint > 65535) {
			codePoint -= 65536;
			output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
			codePoint = 56320 | codePoint & 1023;
		}
		output += String.fromCharCode(codePoint);
		return output;
	};
	function replaceCodePoint(codePoint) {
		var _a;
		if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) return 65533;
		return (_a = decodeMap.get(codePoint)) !== null && _a !== void 0 ? _a : codePoint;
	}
	var CharCodes;
	(function(CharCodes) {
		CharCodes[CharCodes["NUM"] = 35] = "NUM";
		CharCodes[CharCodes["SEMI"] = 59] = "SEMI";
		CharCodes[CharCodes["EQUALS"] = 61] = "EQUALS";
		CharCodes[CharCodes["ZERO"] = 48] = "ZERO";
		CharCodes[CharCodes["NINE"] = 57] = "NINE";
		CharCodes[CharCodes["LOWER_A"] = 97] = "LOWER_A";
		CharCodes[CharCodes["LOWER_F"] = 102] = "LOWER_F";
		CharCodes[CharCodes["LOWER_X"] = 120] = "LOWER_X";
		CharCodes[CharCodes["LOWER_Z"] = 122] = "LOWER_Z";
		CharCodes[CharCodes["UPPER_A"] = 65] = "UPPER_A";
		CharCodes[CharCodes["UPPER_F"] = 70] = "UPPER_F";
		CharCodes[CharCodes["UPPER_Z"] = 90] = "UPPER_Z";
	})(CharCodes || (CharCodes = {}));
	var TO_LOWER_BIT = 32;
	var BinTrieFlags;
	(function(BinTrieFlags) {
		BinTrieFlags[BinTrieFlags["VALUE_LENGTH"] = 49152] = "VALUE_LENGTH";
		BinTrieFlags[BinTrieFlags["BRANCH_LENGTH"] = 16256] = "BRANCH_LENGTH";
		BinTrieFlags[BinTrieFlags["JUMP_TABLE"] = 127] = "JUMP_TABLE";
	})(BinTrieFlags || (BinTrieFlags = {}));
	function isNumber(code) {
		return code >= CharCodes.ZERO && code <= CharCodes.NINE;
	}
	function isHexadecimalCharacter(code) {
		return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_F || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_F;
	}
	function isAsciiAlphaNumeric(code) {
		return code >= CharCodes.UPPER_A && code <= CharCodes.UPPER_Z || code >= CharCodes.LOWER_A && code <= CharCodes.LOWER_Z || isNumber(code);
	}
	function isEntityInAttributeInvalidEnd(code) {
		return code === CharCodes.EQUALS || isAsciiAlphaNumeric(code);
	}
	var EntityDecoderState;
	(function(EntityDecoderState) {
		EntityDecoderState[EntityDecoderState["EntityStart"] = 0] = "EntityStart";
		EntityDecoderState[EntityDecoderState["NumericStart"] = 1] = "NumericStart";
		EntityDecoderState[EntityDecoderState["NumericDecimal"] = 2] = "NumericDecimal";
		EntityDecoderState[EntityDecoderState["NumericHex"] = 3] = "NumericHex";
		EntityDecoderState[EntityDecoderState["NamedEntity"] = 4] = "NamedEntity";
	})(EntityDecoderState || (EntityDecoderState = {}));
	var DecodingMode;
	(function(DecodingMode) {
		DecodingMode[DecodingMode["Legacy"] = 0] = "Legacy";
		DecodingMode[DecodingMode["Strict"] = 1] = "Strict";
		DecodingMode[DecodingMode["Attribute"] = 2] = "Attribute";
	})(DecodingMode || (DecodingMode = {}));
	var EntityDecoder = class {
		constructor(decodeTree, emitCodePoint, errors) {
			this.decodeTree = decodeTree;
			this.emitCodePoint = emitCodePoint;
			this.errors = errors;
			this.state = EntityDecoderState.EntityStart;
			this.consumed = 1;
			this.result = 0;
			this.treeIndex = 0;
			this.excess = 1;
			this.decodeMode = DecodingMode.Strict;
		}
		startEntity(decodeMode) {
			this.decodeMode = decodeMode;
			this.state = EntityDecoderState.EntityStart;
			this.result = 0;
			this.treeIndex = 0;
			this.excess = 1;
			this.consumed = 1;
		}
		write(str, offset) {
			switch (this.state) {
				case EntityDecoderState.EntityStart:
					if (str.charCodeAt(offset) === CharCodes.NUM) {
						this.state = EntityDecoderState.NumericStart;
						this.consumed += 1;
						return this.stateNumericStart(str, offset + 1);
					}
					this.state = EntityDecoderState.NamedEntity;
					return this.stateNamedEntity(str, offset);
				case EntityDecoderState.NumericStart: return this.stateNumericStart(str, offset);
				case EntityDecoderState.NumericDecimal: return this.stateNumericDecimal(str, offset);
				case EntityDecoderState.NumericHex: return this.stateNumericHex(str, offset);
				case EntityDecoderState.NamedEntity: return this.stateNamedEntity(str, offset);
			}
		}
		stateNumericStart(str, offset) {
			if (offset >= str.length) return -1;
			if ((str.charCodeAt(offset) | TO_LOWER_BIT) === CharCodes.LOWER_X) {
				this.state = EntityDecoderState.NumericHex;
				this.consumed += 1;
				return this.stateNumericHex(str, offset + 1);
			}
			this.state = EntityDecoderState.NumericDecimal;
			return this.stateNumericDecimal(str, offset);
		}
		addToNumericResult(str, start, end, base) {
			if (start !== end) {
				const digitCount = end - start;
				this.result = this.result * Math.pow(base, digitCount) + parseInt(str.substr(start, digitCount), base);
				this.consumed += digitCount;
			}
		}
		stateNumericHex(str, offset) {
			const startIdx = offset;
			while (offset < str.length) {
				const char = str.charCodeAt(offset);
				if (isNumber(char) || isHexadecimalCharacter(char)) offset += 1;
				else {
					this.addToNumericResult(str, startIdx, offset, 16);
					return this.emitNumericEntity(char, 3);
				}
			}
			this.addToNumericResult(str, startIdx, offset, 16);
			return -1;
		}
		stateNumericDecimal(str, offset) {
			const startIdx = offset;
			while (offset < str.length) {
				const char = str.charCodeAt(offset);
				if (isNumber(char)) offset += 1;
				else {
					this.addToNumericResult(str, startIdx, offset, 10);
					return this.emitNumericEntity(char, 2);
				}
			}
			this.addToNumericResult(str, startIdx, offset, 10);
			return -1;
		}
		emitNumericEntity(lastCp, expectedLength) {
			var _a;
			if (this.consumed <= expectedLength) {
				(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
				return 0;
			}
			if (lastCp === CharCodes.SEMI) this.consumed += 1;
			else if (this.decodeMode === DecodingMode.Strict) return 0;
			this.emitCodePoint(replaceCodePoint(this.result), this.consumed);
			if (this.errors) {
				if (lastCp !== CharCodes.SEMI) this.errors.missingSemicolonAfterCharacterReference();
				this.errors.validateNumericCharacterReference(this.result);
			}
			return this.consumed;
		}
		stateNamedEntity(str, offset) {
			const { decodeTree } = this;
			let current = decodeTree[this.treeIndex];
			let valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
			for (; offset < str.length; offset++, this.excess++) {
				const char = str.charCodeAt(offset);
				this.treeIndex = determineBranch(decodeTree, current, this.treeIndex + Math.max(1, valueLength), char);
				if (this.treeIndex < 0) return this.result === 0 || this.decodeMode === DecodingMode.Attribute && (valueLength === 0 || isEntityInAttributeInvalidEnd(char)) ? 0 : this.emitNotTerminatedNamedEntity();
				current = decodeTree[this.treeIndex];
				valueLength = (current & BinTrieFlags.VALUE_LENGTH) >> 14;
				if (valueLength !== 0) {
					if (char === CharCodes.SEMI) return this.emitNamedEntityData(this.treeIndex, valueLength, this.consumed + this.excess);
					if (this.decodeMode !== DecodingMode.Strict) {
						this.result = this.treeIndex;
						this.consumed += this.excess;
						this.excess = 0;
					}
				}
			}
			return -1;
		}
		emitNotTerminatedNamedEntity() {
			var _a;
			const { result, decodeTree } = this;
			const valueLength = (decodeTree[result] & BinTrieFlags.VALUE_LENGTH) >> 14;
			this.emitNamedEntityData(result, valueLength, this.consumed);
			(_a = this.errors) === null || _a === void 0 || _a.missingSemicolonAfterCharacterReference();
			return this.consumed;
		}
		emitNamedEntityData(result, valueLength, consumed) {
			const { decodeTree } = this;
			this.emitCodePoint(valueLength === 1 ? decodeTree[result] & ~BinTrieFlags.VALUE_LENGTH : decodeTree[result + 1], consumed);
			if (valueLength === 3) this.emitCodePoint(decodeTree[result + 2], consumed);
			return consumed;
		}
		end() {
			var _a;
			switch (this.state) {
				case EntityDecoderState.NamedEntity: return this.result !== 0 && (this.decodeMode !== DecodingMode.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
				case EntityDecoderState.NumericDecimal: return this.emitNumericEntity(0, 2);
				case EntityDecoderState.NumericHex: return this.emitNumericEntity(0, 3);
				case EntityDecoderState.NumericStart:
					(_a = this.errors) === null || _a === void 0 || _a.absenceOfDigitsInNumericCharacterReference(this.consumed);
					return 0;
				case EntityDecoderState.EntityStart: return 0;
			}
		}
	};
	function getDecoder(decodeTree) {
		let ret = "";
		const decoder = new EntityDecoder(decodeTree, (str) => ret += fromCodePoint$1(str));
		return function decodeWithTrie(str, decodeMode) {
			let lastIndex = 0;
			let offset = 0;
			while ((offset = str.indexOf("&", offset)) >= 0) {
				ret += str.slice(lastIndex, offset);
				decoder.startEntity(decodeMode);
				const len = decoder.write(str, offset + 1);
				if (len < 0) {
					lastIndex = offset + decoder.end();
					break;
				}
				lastIndex = offset + len;
				offset = len === 0 ? lastIndex + 1 : lastIndex;
			}
			const result = ret + str.slice(lastIndex);
			ret = "";
			return result;
		};
	}
	function determineBranch(decodeTree, current, nodeIdx, char) {
		const branchCount = (current & BinTrieFlags.BRANCH_LENGTH) >> 7;
		const jumpOffset = current & BinTrieFlags.JUMP_TABLE;
		if (branchCount === 0) return jumpOffset !== 0 && char === jumpOffset ? nodeIdx : -1;
		if (jumpOffset) {
			const value = char - jumpOffset;
			return value < 0 || value >= branchCount ? -1 : decodeTree[nodeIdx + value] - 1;
		}
		let lo = nodeIdx;
		let hi = lo + branchCount - 1;
		while (lo <= hi) {
			const mid = lo + hi >>> 1;
			const midVal = decodeTree[mid];
			if (midVal < char) lo = mid + 1;
			else if (midVal > char) hi = mid - 1;
			else return decodeTree[mid + branchCount];
		}
		return -1;
	}
	var htmlDecoder = getDecoder(decode_data_html_default);
	getDecoder(decode_data_xml_default);
	function decodeHTML(str, mode = DecodingMode.Legacy) {
		return htmlDecoder(str, mode);
	}
	function decodeHTMLStrict(str) {
		return htmlDecoder(str, DecodingMode.Strict);
	}
	var utils_exports = __exportAll({
		arrayReplaceAt: () => arrayReplaceAt,
		asciiTrim: () => asciiTrim,
		assign: () => assign$1,
		escapeHtml: () => escapeHtml$1,
		escapeRE: () => escapeRE$1,
		fromCodePoint: () => fromCodePoint,
		has: () => has$1,
		isMdAsciiPunct: () => isMdAsciiPunct,
		isPunctChar: () => isPunctChar,
		isPunctCharCode: () => isPunctCharCode,
		isSpace: () => isSpace,
		isString: () => isString$1,
		isValidEntityCode: () => isValidEntityCode,
		isWhiteSpace: () => isWhiteSpace,
		lib: () => lib,
		normalizeReference: () => normalizeReference,
		unescapeAll: () => unescapeAll,
		unescapeMd: () => unescapeMd
	});
	function _class$1(obj) {
		return Object.prototype.toString.call(obj);
	}
	function isString$1(obj) {
		return _class$1(obj) === "[object String]";
	}
	var _hasOwnProperty = Object.prototype.hasOwnProperty;
	function has$1(object, key) {
		return _hasOwnProperty.call(object, key);
	}
	function assign$1(obj) {
		Array.prototype.slice.call(arguments, 1).forEach(function(source) {
			if (!source) return;
			if (typeof source !== "object") throw new TypeError(source + "must be object");
			Object.keys(source).forEach(function(key) {
				obj[key] = source[key];
			});
		});
		return obj;
	}
	function arrayReplaceAt(src, pos, newElements) {
		return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
	}
	function isValidEntityCode(c) {
		if (c >= 55296 && c <= 57343) return false;
		if (c >= 64976 && c <= 65007) return false;
		if ((c & 65535) === 65535 || (c & 65535) === 65534) return false;
		if (c >= 0 && c <= 8) return false;
		if (c === 11) return false;
		if (c >= 14 && c <= 31) return false;
		if (c >= 127 && c <= 159) return false;
		if (c > 1114111) return false;
		return true;
	}
	function fromCodePoint(c) {
		if (c > 65535) {
			c -= 65536;
			const surrogate1 = 55296 + (c >> 10);
			const surrogate2 = 56320 + (c & 1023);
			return String.fromCharCode(surrogate1, surrogate2);
		}
		return String.fromCharCode(c);
	}
	var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
	var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + /&([a-z#][a-z0-9]{1,31});/gi.source, "gi");
	var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
	function replaceEntityPattern(match, name) {
		if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
			const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
			if (isValidEntityCode(code)) return fromCodePoint(code);
			return match;
		}
		const decoded = decodeHTML(match);
		if (decoded !== match) return decoded;
		return match;
	}
	function unescapeMd(str) {
		if (str.indexOf("\\") < 0) return str;
		return str.replace(UNESCAPE_MD_RE, "$1");
	}
	function unescapeAll(str) {
		if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) return str;
		return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity) {
			if (escaped) return escaped;
			return replaceEntityPattern(match, entity);
		});
	}
	var HTML_ESCAPE_TEST_RE = /[&<>"]/;
	var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
	var HTML_REPLACEMENTS = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
	function replaceUnsafeChar(ch) {
		return HTML_REPLACEMENTS[ch];
	}
	function escapeHtml$1(str) {
		if (HTML_ESCAPE_TEST_RE.test(str)) return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
		return str;
	}
	var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
	function escapeRE$1(str) {
		return str.replace(REGEXP_ESCAPE_RE, "\\$&");
	}
	function isSpace(code) {
		switch (code) {
			case 9:
			case 32: return true;
		}
		return false;
	}
	function isWhiteSpace(code) {
		if (code >= 8192 && code <= 8202) return true;
		switch (code) {
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 32:
			case 160:
			case 5760:
			case 8239:
			case 8287:
			case 12288: return true;
		}
		return false;
	}
	function isPunctChar(ch) {
		return regex_default$2.test(ch) || regex_default$1.test(ch);
	}
	function isPunctCharCode(code) {
		return isPunctChar(fromCodePoint(code));
	}
	function isMdAsciiPunct(ch) {
		switch (ch) {
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 45:
			case 46:
			case 47:
			case 58:
			case 59:
			case 60:
			case 61:
			case 62:
			case 63:
			case 64:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 123:
			case 124:
			case 125:
			case 126: return true;
			default: return false;
		}
	}
	function normalizeReference(str) {
		str = str.trim().replace(/\s+/g, " ");
		if ("ẞ".toLowerCase() === "Ṿ") str = str.replace(/ẞ/g, "ß");
		return str.toLowerCase().toUpperCase();
	}
	function isAsciiTrimmable(c) {
		return c === 32 || c === 9 || c === 10 || c === 13;
	}
	function asciiTrim(str) {
		let start = 0;
		for (; start < str.length; start++) if (!isAsciiTrimmable(str.charCodeAt(start))) break;
		let end = str.length - 1;
		for (; end >= start; end--) if (!isAsciiTrimmable(str.charCodeAt(end))) break;
		return str.slice(start, end + 1);
	}
	var lib = {
		mdurl: mdurl_exports,
		ucmicro: uc_micro_exports
	};
	function parseLinkLabel(state, start, disableNested) {
		let level, found, marker, prevPos;
		const max = state.posMax;
		const oldPos = state.pos;
		state.pos = start + 1;
		level = 1;
		while (state.pos < max) {
			marker = state.src.charCodeAt(state.pos);
			if (marker === 93) {
				level--;
				if (level === 0) {
					found = true;
					break;
				}
			}
			prevPos = state.pos;
			state.md.inline.skipToken(state);
			if (marker === 91) {
				if (prevPos === state.pos - 1) level++;
				else if (disableNested) {
					state.pos = oldPos;
					return -1;
				}
			}
		}
		let labelEnd = -1;
		if (found) labelEnd = state.pos;
		state.pos = oldPos;
		return labelEnd;
	}
	function parseLinkDestination(str, start, max) {
		let code;
		let pos = start;
		const result = {
			ok: false,
			pos: 0,
			str: ""
		};
		if (str.charCodeAt(pos) === 60) {
			pos++;
			while (pos < max) {
				code = str.charCodeAt(pos);
				if (code === 10) return result;
				if (code === 60) return result;
				if (code === 62) {
					result.pos = pos + 1;
					result.str = unescapeAll(str.slice(start + 1, pos));
					result.ok = true;
					return result;
				}
				if (code === 92 && pos + 1 < max) {
					pos += 2;
					continue;
				}
				pos++;
			}
			return result;
		}
		let level = 0;
		while (pos < max) {
			code = str.charCodeAt(pos);
			if (code === 32) break;
			if (code < 32 || code === 127) break;
			if (code === 92 && pos + 1 < max) {
				if (str.charCodeAt(pos + 1) === 32) {
					pos++;
					continue;
				}
				pos += 2;
				continue;
			}
			if (code === 40) {
				level++;
				if (level > 32) return result;
			}
			if (code === 41) {
				if (level === 0) break;
				level--;
			}
			pos++;
		}
		if (start === pos) return result;
		if (level !== 0) return result;
		result.str = unescapeAll(str.slice(start, pos));
		result.pos = pos;
		result.ok = true;
		return result;
	}
	function parseLinkTitle(str, start, max, prev_state) {
		let code;
		let pos = start;
		const state = {
			ok: false,
			can_continue: false,
			pos: 0,
			str: "",
			marker: 0
		};
		if (prev_state) {
			state.str = prev_state.str;
			state.marker = prev_state.marker;
		} else {
			if (pos >= max) return state;
			let marker = str.charCodeAt(pos);
			if (marker !== 34 && marker !== 39 && marker !== 40) return state;
			start++;
			pos++;
			if (marker === 40) marker = 41;
			state.marker = marker;
		}
		while (pos < max) {
			code = str.charCodeAt(pos);
			if (code === state.marker) {
				state.pos = pos + 1;
				state.str += unescapeAll(str.slice(start, pos));
				state.ok = true;
				return state;
			} else if (code === 40 && state.marker === 41) return state;
			else if (code === 92 && pos + 1 < max) pos++;
			pos++;
		}
		state.can_continue = true;
		state.str += unescapeAll(str.slice(start, pos));
		return state;
	}
	var helpers_exports = __exportAll({
		parseLinkDestination: () => parseLinkDestination,
		parseLinkLabel: () => parseLinkLabel,
		parseLinkTitle: () => parseLinkTitle
	});
	var default_rules = {};
	default_rules.code_inline = function(tokens, idx, options, env, slf) {
		const token = tokens[idx];
		return "<code" + slf.renderAttrs(token) + ">" + escapeHtml$1(token.content) + "</code>";
	};
	default_rules.code_block = function(tokens, idx, options, env, slf) {
		const token = tokens[idx];
		return "<pre" + slf.renderAttrs(token) + "><code>" + escapeHtml$1(tokens[idx].content) + "</code></pre>\n";
	};
	default_rules.fence = function(tokens, idx, options, env, slf) {
		const token = tokens[idx];
		const info = token.info ? unescapeAll(token.info).trim() : "";
		let langName = "";
		let langAttrs = "";
		if (info) {
			const arr = info.split(/(\s+)/g);
			langName = arr[0];
			langAttrs = arr.slice(2).join("");
		}
		let highlighted;
		if (options.highlight) highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml$1(token.content);
		else highlighted = escapeHtml$1(token.content);
		if (highlighted.indexOf("<pre") === 0) return highlighted + "\n";
		if (info) {
			const i = token.attrIndex("class");
			const tmpAttrs = token.attrs ? token.attrs.slice() : [];
			if (i < 0) tmpAttrs.push(["class", options.langPrefix + langName]);
			else {
				tmpAttrs[i] = tmpAttrs[i].slice();
				tmpAttrs[i][1] += " " + options.langPrefix + langName;
			}
			const tmpToken = { attrs: tmpAttrs };
			return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>\n`;
		}
		return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`;
	};
	default_rules.image = function(tokens, idx, options, env, slf) {
		const token = tokens[idx];
		token.attrs[token.attrIndex("alt")][1] = slf.renderInlineAsText(token.children, options, env);
		return slf.renderToken(tokens, idx, options);
	};
	default_rules.hardbreak = function(tokens, idx, options) {
		return options.xhtmlOut ? "<br />\n" : "<br>\n";
	};
	default_rules.softbreak = function(tokens, idx, options) {
		return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
	};
	default_rules.text = function(tokens, idx) {
		return escapeHtml$1(tokens[idx].content);
	};
	default_rules.html_block = function(tokens, idx) {
		return tokens[idx].content;
	};
	default_rules.html_inline = function(tokens, idx) {
		return tokens[idx].content;
	};
	function Renderer() {
		this.rules = assign$1({}, default_rules);
	}
	Renderer.prototype.renderAttrs = function renderAttrs(token) {
		let i, l, result;
		if (!token.attrs) return "";
		result = "";
		for (i = 0, l = token.attrs.length; i < l; i++) result += " " + escapeHtml$1(token.attrs[i][0]) + "=\"" + escapeHtml$1(token.attrs[i][1]) + "\"";
		return result;
	};
	Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
		const token = tokens[idx];
		let result = "";
		if (token.hidden) return "";
		if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) result += "\n";
		result += (token.nesting === -1 ? "</" : "<") + token.tag;
		result += this.renderAttrs(token);
		if (token.nesting === 0 && options.xhtmlOut) result += " /";
		let needLf = false;
		if (token.block) {
			needLf = true;
			if (token.nesting === 1) {
				if (idx + 1 < tokens.length) {
					const nextToken = tokens[idx + 1];
					if (nextToken.type === "inline" || nextToken.hidden) needLf = false;
					else if (nextToken.nesting === -1 && nextToken.tag === token.tag) needLf = false;
				}
			}
		}
		result += needLf ? ">\n" : ">";
		return result;
	};
	Renderer.prototype.renderInline = function(tokens, options, env) {
		let result = "";
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const type = tokens[i].type;
			if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
			else result += this.renderToken(tokens, i, options);
		}
		return result;
	};
	Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
		let result = "";
		for (let i = 0, len = tokens.length; i < len; i++) switch (tokens[i].type) {
			case "text":
				result += tokens[i].content;
				break;
			case "image":
				result += this.renderInlineAsText(tokens[i].children, options, env);
				break;
			case "html_inline":
			case "html_block":
				result += tokens[i].content;
				break;
			case "softbreak":
			case "hardbreak": result += "\n";
		}
		return result;
	};
	Renderer.prototype.render = function(tokens, options, env) {
		let result = "";
		const rules = this.rules;
		for (let i = 0, len = tokens.length; i < len; i++) {
			const type = tokens[i].type;
			if (type === "inline") result += this.renderInline(tokens[i].children, options, env);
			else if (typeof rules[type] !== "undefined") result += rules[type](tokens, i, options, env, this);
			else result += this.renderToken(tokens, i, options, env);
		}
		return result;
	};
	function Ruler() {
		this.__rules__ = [];
		this.__cache__ = null;
	}
	Ruler.prototype.__find__ = function(name) {
		for (let i = 0; i < this.__rules__.length; i++) if (this.__rules__[i].name === name) return i;
		return -1;
	};
	Ruler.prototype.__compile__ = function() {
		const self = this;
		const chains = [""];
		self.__rules__.forEach(function(rule) {
			if (!rule.enabled) return;
			rule.alt.forEach(function(altName) {
				if (chains.indexOf(altName) < 0) chains.push(altName);
			});
		});
		self.__cache__ = {};
		chains.forEach(function(chain) {
			self.__cache__[chain] = [];
			self.__rules__.forEach(function(rule) {
				if (!rule.enabled) return;
				if (chain && rule.alt.indexOf(chain) < 0) return;
				self.__cache__[chain].push(rule.fn);
			});
		});
	};
	Ruler.prototype.at = function(name, fn, options) {
		const index = this.__find__(name);
		const opt = options || {};
		if (index === -1) throw new Error("Parser rule not found: " + name);
		this.__rules__[index].fn = fn;
		this.__rules__[index].alt = opt.alt || [];
		this.__cache__ = null;
	};
	Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
		const index = this.__find__(beforeName);
		const opt = options || {};
		if (index === -1) throw new Error("Parser rule not found: " + beforeName);
		this.__rules__.splice(index, 0, {
			name: ruleName,
			enabled: true,
			fn,
			alt: opt.alt || []
		});
		this.__cache__ = null;
	};
	Ruler.prototype.after = function(afterName, ruleName, fn, options) {
		const index = this.__find__(afterName);
		const opt = options || {};
		if (index === -1) throw new Error("Parser rule not found: " + afterName);
		this.__rules__.splice(index + 1, 0, {
			name: ruleName,
			enabled: true,
			fn,
			alt: opt.alt || []
		});
		this.__cache__ = null;
	};
	Ruler.prototype.push = function(ruleName, fn, options) {
		const opt = options || {};
		this.__rules__.push({
			name: ruleName,
			enabled: true,
			fn,
			alt: opt.alt || []
		});
		this.__cache__ = null;
	};
	Ruler.prototype.enable = function(list, ignoreInvalid) {
		if (!Array.isArray(list)) list = [list];
		const result = [];
		list.forEach(function(name) {
			const idx = this.__find__(name);
			if (idx < 0) {
				if (ignoreInvalid) return;
				throw new Error("Rules manager: invalid rule name " + name);
			}
			this.__rules__[idx].enabled = true;
			result.push(name);
		}, this);
		this.__cache__ = null;
		return result;
	};
	Ruler.prototype.enableOnly = function(list, ignoreInvalid) {
		if (!Array.isArray(list)) list = [list];
		this.__rules__.forEach(function(rule) {
			rule.enabled = false;
		});
		this.enable(list, ignoreInvalid);
	};
	Ruler.prototype.disable = function(list, ignoreInvalid) {
		if (!Array.isArray(list)) list = [list];
		const result = [];
		list.forEach(function(name) {
			const idx = this.__find__(name);
			if (idx < 0) {
				if (ignoreInvalid) return;
				throw new Error("Rules manager: invalid rule name " + name);
			}
			this.__rules__[idx].enabled = false;
			result.push(name);
		}, this);
		this.__cache__ = null;
		return result;
	};
	Ruler.prototype.getRules = function(chainName) {
		if (this.__cache__ === null) this.__compile__();
		return this.__cache__[chainName] || [];
	};
	function Token$1(type, tag, nesting) {
		this.type = type;
		this.tag = tag;
		this.attrs = null;
		this.map = null;
		this.nesting = nesting;
		this.level = 0;
		this.children = null;
		this.content = "";
		this.markup = "";
		this.info = "";
		this.meta = null;
		this.block = false;
		this.hidden = false;
	}
	Token$1.prototype.attrIndex = function attrIndex(name) {
		if (!this.attrs) return -1;
		const attrs = this.attrs;
		for (let i = 0, len = attrs.length; i < len; i++) if (attrs[i][0] === name) return i;
		return -1;
	};
	Token$1.prototype.attrPush = function attrPush(attrData) {
		if (this.attrs) this.attrs.push(attrData);
		else this.attrs = [attrData];
	};
	Token$1.prototype.attrSet = function attrSet(name, value) {
		const idx = this.attrIndex(name);
		const attrData = [name, value];
		if (idx < 0) this.attrPush(attrData);
		else this.attrs[idx] = attrData;
	};
	Token$1.prototype.attrGet = function attrGet(name) {
		const idx = this.attrIndex(name);
		let value = null;
		if (idx >= 0) value = this.attrs[idx][1];
		return value;
	};
	Token$1.prototype.attrJoin = function attrJoin(name, value) {
		const idx = this.attrIndex(name);
		if (idx < 0) this.attrPush([name, value]);
		else this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
	};
	function StateCore(src, md, env) {
		this.src = src;
		this.env = env;
		this.tokens = [];
		this.inlineMode = false;
		this.md = md;
	}
	StateCore.prototype.Token = Token$1;
	var NEWLINES_RE = /\r\n?|\n/g;
	var NULL_RE = /\0/g;
	function normalize(state) {
		let str;
		str = state.src.replace(NEWLINES_RE, "\n");
		str = str.replace(NULL_RE, "�");
		state.src = str;
	}
	function block(state) {
		let token;
		if (state.inlineMode) {
			token = new state.Token("inline", "", 0);
			token.content = state.src;
			token.map = [0, 1];
			token.children = [];
			state.tokens.push(token);
		} else state.md.block.parse(state.src, state.md, state.env, state.tokens);
	}
	function inline(state) {
		const tokens = state.tokens;
		for (let i = 0, l = tokens.length; i < l; i++) {
			const tok = tokens[i];
			if (tok.type === "inline") state.md.inline.parse(tok.content, state.md, state.env, tok.children);
		}
	}
	function isLinkOpen$1(str) {
		return /^<a[>\s]/i.test(str);
	}
	function isLinkClose$1(str) {
		return /^<\/a\s*>/i.test(str);
	}
	function linkify$1(state) {
		const blockTokens = state.tokens;
		if (!state.md.options.linkify) return;
		for (let j = 0, l = blockTokens.length; j < l; j++) {
			if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) continue;
			const tokens = blockTokens[j].children;
			const replacements = [];
			let htmlLinkLevel = 0;
			for (let i = tokens.length - 1; i >= 0; i--) {
				const currentToken = tokens[i];
				if (currentToken.type === "link_close") {
					i--;
					while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") i--;
					continue;
				}
				if (currentToken.type === "html_inline") {
					if (isLinkOpen$1(currentToken.content) && htmlLinkLevel > 0) htmlLinkLevel--;
					if (isLinkClose$1(currentToken.content)) htmlLinkLevel++;
				}
				if (htmlLinkLevel > 0) continue;
				if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
					const text = currentToken.content;
					let links = state.md.linkify.match(text);
					const nodes = [];
					let level = currentToken.level;
					let lastPos = 0;
					if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") links = links.slice(1);
					for (let ln = 0; ln < links.length; ln++) {
						const url = links[ln].url;
						const fullUrl = state.md.normalizeLink(url);
						if (!state.md.validateLink(fullUrl)) continue;
						let urlText = links[ln].text;
						if (!links[ln].schema) urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
						else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
						else urlText = state.md.normalizeLinkText(urlText);
						const pos = links[ln].index;
						if (pos > lastPos) {
							const token = new state.Token("text", "", 0);
							token.content = text.slice(lastPos, pos);
							token.level = level;
							nodes.push(token);
						}
						const token_o = new state.Token("link_open", "a", 1);
						token_o.attrs = [["href", fullUrl]];
						token_o.level = level++;
						token_o.markup = "linkify";
						token_o.info = "auto";
						nodes.push(token_o);
						const token_t = new state.Token("text", "", 0);
						token_t.content = urlText;
						token_t.level = level;
						nodes.push(token_t);
						const token_c = new state.Token("link_close", "a", -1);
						token_c.level = --level;
						token_c.markup = "linkify";
						token_c.info = "auto";
						nodes.push(token_c);
						lastPos = links[ln].lastIndex;
					}
					if (lastPos < text.length) {
						const token = new state.Token("text", "", 0);
						token.content = text.slice(lastPos);
						token.level = level;
						nodes.push(token);
					}
					replacements.push({
						index: i,
						nodes
					});
				}
			}
			if (replacements.length > 0) {
				let newTokensLength = tokens.length;
				for (const replacement of replacements) newTokensLength += replacement.nodes.length - 1;
				const newTokens = new Array(newTokensLength);
				let replacementIndex = 0;
				let newTokenIndex = 0;
				replacements.reverse();
				for (let i = 0; i < tokens.length; i++) {
					const replacement = replacements[replacementIndex];
					if (replacement?.index === i) {
						for (const node of replacement.nodes) newTokens[newTokenIndex++] = node;
						replacementIndex++;
					} else newTokens[newTokenIndex++] = tokens[i];
				}
				blockTokens[j].children = newTokens;
			}
		}
	}
	var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
	var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
	var SCOPED_ABBR_RE = /\((c|tm|r)\)/gi;
	var SCOPED_ABBR = {
		c: "©",
		r: "®",
		tm: "™"
	};
	function replaceFn(match, name) {
		return SCOPED_ABBR[name.toLowerCase()];
	}
	function replace_scoped(inlineTokens) {
		let inside_autolink = 0;
		for (let i = inlineTokens.length - 1; i >= 0; i--) {
			const token = inlineTokens[i];
			if (token.type === "text" && !inside_autolink) token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
			if (token.type === "link_open" && token.info === "auto") inside_autolink--;
			if (token.type === "link_close" && token.info === "auto") inside_autolink++;
		}
	}
	function replace_rare(inlineTokens) {
		let inside_autolink = 0;
		for (let i = inlineTokens.length - 1; i >= 0; i--) {
			const token = inlineTokens[i];
			if (token.type === "text" && !inside_autolink) {
				if (RARE_RE.test(token.content)) token.content = token.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–");
			}
			if (token.type === "link_open" && token.info === "auto") inside_autolink--;
			if (token.type === "link_close" && token.info === "auto") inside_autolink++;
		}
	}
	function replace(state) {
		let blkIdx;
		if (!state.md.options.typographer) return;
		for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
			if (state.tokens[blkIdx].type !== "inline") continue;
			if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) replace_scoped(state.tokens[blkIdx].children);
			if (RARE_RE.test(state.tokens[blkIdx].content)) replace_rare(state.tokens[blkIdx].children);
		}
	}
	var QUOTE_TEST_RE = /['"]/;
	var QUOTE_RE = /['"]/g;
	var APOSTROPHE = "’";
	var MAX_OPENERS = 1e3;
	function truncateStack(stack, heads, length) {
		while (stack.length > length) {
			const item = stack.pop();
			if (item.isSingleQuote) heads.single = item.prevSameQuoteIdx;
			else heads.double = item.prevSameQuoteIdx;
		}
	}
	function addReplacement(replacements, tokenIdx, pos, ch) {
		if (!replacements[tokenIdx]) replacements[tokenIdx] = [];
		replacements[tokenIdx].push({
			pos,
			ch
		});
	}
	function applyReplacements(str, replacements) {
		let result = "";
		let lastPos = 0;
		replacements.sort((a, b) => a.pos - b.pos);
		for (let i = 0; i < replacements.length; i++) {
			const replacement = replacements[i];
			result += str.slice(lastPos, replacement.pos) + replacement.ch;
			lastPos = replacement.pos + 1;
		}
		return result + str.slice(lastPos);
	}
	function process_inlines(tokens, state) {
		let j;
		const stack = [];
		const heads = {
			single: -1,
			double: -1
		};
		const replacements = {};
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const thisLevel = tokens[i].level;
			for (j = stack.length - 1; j >= 0; j--) if (stack[j].level <= thisLevel) break;
			truncateStack(stack, heads, j + 1);
			if (token.type !== "text") continue;
			const text = token.content;
			let pos = 0;
			const max = text.length;
			OUTER: while (pos < max) {
				QUOTE_RE.lastIndex = pos;
				const t = QUOTE_RE.exec(text);
				if (!t) break;
				let canOpen = true;
				let canClose = true;
				pos = t.index + 1;
				const isSingle = t[0] === "'";
				let lastChar = 32;
				if (t.index - 1 >= 0) lastChar = text.charCodeAt(t.index - 1);
				else for (j = i - 1; j >= 0; j--) {
					if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
					if (!tokens[j].content) continue;
					lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
					break;
				}
				let nextChar = 32;
				if (pos < max) nextChar = text.charCodeAt(pos);
				else for (j = i + 1; j < tokens.length; j++) {
					if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
					if (!tokens[j].content) continue;
					nextChar = tokens[j].content.charCodeAt(0);
					break;
				}
				const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
				const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
				const isLastWhiteSpace = isWhiteSpace(lastChar);
				const isNextWhiteSpace = isWhiteSpace(nextChar);
				if (isNextWhiteSpace) canOpen = false;
				else if (isNextPunctChar) {
					if (!(isLastWhiteSpace || isLastPunctChar)) canOpen = false;
				}
				if (isLastWhiteSpace) canClose = false;
				else if (isLastPunctChar) {
					if (!(isNextWhiteSpace || isNextPunctChar)) canClose = false;
				}
				if (nextChar === 34 && t[0] === "\"") {
					if (lastChar >= 48 && lastChar <= 57) canClose = canOpen = false;
				}
				if (canOpen && canClose) {
					canOpen = isLastPunctChar;
					canClose = isNextPunctChar;
				}
				if (!canOpen && !canClose) {
					if (isSingle) addReplacement(replacements, i, t.index, APOSTROPHE);
					continue;
				}
				if (canClose) {
					j = isSingle ? heads.single : heads.double;
					if (j >= 0 && stack[j].level === thisLevel) {
						const item = stack[j];
						let openQuote;
						let closeQuote;
						if (isSingle) {
							openQuote = state.md.options.quotes[2];
							closeQuote = state.md.options.quotes[3];
						} else {
							openQuote = state.md.options.quotes[0];
							closeQuote = state.md.options.quotes[1];
						}
						addReplacement(replacements, i, t.index, closeQuote);
						addReplacement(replacements, item.tokenIdx, item.contentPos, openQuote);
						truncateStack(stack, heads, j);
						continue OUTER;
					}
				}
				if (canOpen) {
					if (stack.length >= MAX_OPENERS) return;
					stack.push({
						tokenIdx: i,
						contentPos: t.index,
						isSingleQuote: isSingle,
						level: thisLevel,
						prevSameQuoteIdx: isSingle ? heads.single : heads.double
					});
					if (isSingle) heads.single = stack.length - 1;
					else heads.double = stack.length - 1;
				} else if (canClose && isSingle) addReplacement(replacements, i, t.index, APOSTROPHE);
			}
		}
		Object.keys(replacements).forEach(function(tokenIdx) {
			tokens[tokenIdx].content = applyReplacements(tokens[tokenIdx].content, replacements[tokenIdx]);
		});
	}
	function smartquotes(state) {
		if (!state.md.options.typographer) return;
		for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
			if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) continue;
			process_inlines(state.tokens[blkIdx].children, state);
		}
	}
	function text_join(state) {
		let curr, last;
		const blockTokens = state.tokens;
		const l = blockTokens.length;
		for (let j = 0; j < l; j++) {
			if (blockTokens[j].type !== "inline") continue;
			const tokens = blockTokens[j].children;
			const max = tokens.length;
			for (curr = 0; curr < max; curr++) if (tokens[curr].type === "text_special") tokens[curr].type = "text";
			for (curr = last = 0; curr < max; curr++) if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
			else {
				if (curr !== last) tokens[last] = tokens[curr];
				last++;
			}
			if (curr !== last) tokens.length = last;
		}
	}
	var _rules$2 = [
		["normalize", normalize],
		["block", block],
		["inline", inline],
		["linkify", linkify$1],
		["replacements", replace],
		["smartquotes", smartquotes],
		["text_join", text_join]
	];
	function Core() {
		this.ruler = new Ruler();
		for (let i = 0; i < _rules$2.length; i++) this.ruler.push(_rules$2[i][0], _rules$2[i][1]);
	}
	Core.prototype.process = function(state) {
		const rules = this.ruler.getRules("");
		for (let i = 0, l = rules.length; i < l; i++) rules[i](state);
	};
	Core.prototype.State = StateCore;
	function StateBlock(src, md, env, tokens) {
		this.src = src;
		this.md = md;
		this.env = env;
		this.tokens = tokens;
		this.bMarks = [];
		this.eMarks = [];
		this.tShift = [];
		this.sCount = [];
		this.bsCount = [];
		this.blkIndent = 0;
		this.line = 0;
		this.lineMax = 0;
		this.tight = false;
		this.ddIndent = -1;
		this.listIndent = -1;
		this.parentType = "root";
		this.level = 0;
		const s = this.src;
		for (let start = 0, pos = 0, indent = 0, offset = 0, len = s.length, indent_found = false; pos < len; pos++) {
			const ch = s.charCodeAt(pos);
			if (!indent_found) {
				if (isSpace(ch)) {
					indent++;
					if (ch === 9) offset += 4 - offset % 4;
					else offset++;
					continue;
				} else indent_found = true;
			}
			if (ch === 10 || pos === len - 1) {
				if (ch !== 10) pos++;
				this.bMarks.push(start);
				this.eMarks.push(pos);
				this.tShift.push(indent);
				this.sCount.push(offset);
				this.bsCount.push(0);
				indent_found = false;
				indent = 0;
				offset = 0;
				start = pos + 1;
			}
		}
		this.bMarks.push(s.length);
		this.eMarks.push(s.length);
		this.tShift.push(0);
		this.sCount.push(0);
		this.bsCount.push(0);
		this.lineMax = this.bMarks.length - 1;
	}
	StateBlock.prototype.push = function(type, tag, nesting) {
		const token = new Token$1(type, tag, nesting);
		token.block = true;
		if (nesting < 0) this.level--;
		token.level = this.level;
		if (nesting > 0) this.level++;
		this.tokens.push(token);
		return token;
	};
	StateBlock.prototype.isEmpty = function isEmpty(line) {
		return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
	};
	StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
		for (let max = this.lineMax; from < max; from++) if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) break;
		return from;
	};
	StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
		for (let max = this.src.length; pos < max; pos++) if (!isSpace(this.src.charCodeAt(pos))) break;
		return pos;
	};
	StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
		if (pos <= min) return pos;
		while (pos > min) if (!isSpace(this.src.charCodeAt(--pos))) return pos + 1;
		return pos;
	};
	StateBlock.prototype.skipChars = function skipChars(pos, code) {
		for (let max = this.src.length; pos < max; pos++) if (this.src.charCodeAt(pos) !== code) break;
		return pos;
	};
	StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
		if (pos <= min) return pos;
		while (pos > min) if (code !== this.src.charCodeAt(--pos)) return pos + 1;
		return pos;
	};
	StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
		if (begin >= end) return "";
		const queue = new Array(end - begin);
		for (let i = 0, line = begin; line < end; line++, i++) {
			let lineIndent = 0;
			const lineStart = this.bMarks[line];
			let first = lineStart;
			let last;
			if (line + 1 < end || keepLastLF) last = this.eMarks[line] + 1;
			else last = this.eMarks[line];
			while (first < last && lineIndent < indent) {
				const ch = this.src.charCodeAt(first);
				if (isSpace(ch)) {
					if (ch === 9) lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
					else lineIndent++;
				} else if (first - lineStart < this.tShift[line]) lineIndent++;
				else break;
				first++;
			}
			if (lineIndent > indent) queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
			else queue[i] = this.src.slice(first, last);
		}
		return queue.join("");
	};
	StateBlock.prototype.Token = Token$1;
	var MAX_AUTOCOMPLETED_CELLS = 65536;
	function getLine(state, line) {
		const pos = state.bMarks[line] + state.tShift[line];
		const max = state.eMarks[line];
		return state.src.slice(pos, max);
	}
	function escapedSplit(str) {
		const result = [];
		const max = str.length;
		let pos = 0;
		let ch = str.charCodeAt(pos);
		let isEscaped = false;
		let lastPos = 0;
		let current = "";
		while (pos < max) {
			if (ch === 124) {
				if (!isEscaped) {
					result.push(current + str.substring(lastPos, pos));
					current = "";
					lastPos = pos + 1;
				} else {
					current += str.substring(lastPos, pos - 1);
					lastPos = pos;
				}
			}
			isEscaped = ch === 92;
			pos++;
			ch = str.charCodeAt(pos);
		}
		result.push(current + str.substring(lastPos));
		return result;
	}
	function table(state, startLine, endLine, silent) {
		if (startLine + 2 > endLine) return false;
		let nextLine = startLine + 1;
		if (state.sCount[nextLine] < state.blkIndent) return false;
		if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
		let pos = state.bMarks[nextLine] + state.tShift[nextLine];
		if (pos >= state.eMarks[nextLine]) return false;
		const firstCh = state.src.charCodeAt(pos++);
		if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) return false;
		if (pos >= state.eMarks[nextLine]) return false;
		const secondCh = state.src.charCodeAt(pos++);
		if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) return false;
		if (firstCh === 45 && isSpace(secondCh)) return false;
		while (pos < state.eMarks[nextLine]) {
			const ch = state.src.charCodeAt(pos);
			if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) return false;
			pos++;
		}
		let lineText = getLine(state, startLine + 1);
		let columns = lineText.split("|");
		const aligns = [];
		for (let i = 0; i < columns.length; i++) {
			const t = columns[i].trim();
			if (!t) {
				if (i === 0 || i === columns.length - 1) continue;
				else return false;
			}
			if (!/^:?-+:?$/.test(t)) return false;
			if (t.charCodeAt(t.length - 1) === 58) aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
			else if (t.charCodeAt(0) === 58) aligns.push("left");
			else aligns.push("");
		}
		lineText = getLine(state, startLine).trim();
		if (lineText.indexOf("|") === -1) return false;
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		columns = escapedSplit(lineText);
		if (columns.length && columns[0] === "") columns.shift();
		if (columns.length && columns[columns.length - 1] === "") columns.pop();
		const columnCount = columns.length;
		if (columnCount === 0 || columnCount !== aligns.length) return false;
		if (silent) return true;
		const oldParentType = state.parentType;
		state.parentType = "table";
		const terminatorRules = state.md.block.ruler.getRules("blockquote");
		const token_to = state.push("table_open", "table", 1);
		const tableLines = [startLine, 0];
		token_to.map = tableLines;
		const token_tho = state.push("thead_open", "thead", 1);
		token_tho.map = [startLine, startLine + 1];
		const token_htro = state.push("tr_open", "tr", 1);
		token_htro.map = [startLine, startLine + 1];
		for (let i = 0; i < columns.length; i++) {
			const token_ho = state.push("th_open", "th", 1);
			if (aligns[i]) token_ho.attrs = [["style", "text-align:" + aligns[i]]];
			const token_il = state.push("inline", "", 0);
			token_il.content = columns[i].trim();
			token_il.children = [];
			state.push("th_close", "th", -1);
		}
		state.push("tr_close", "tr", -1);
		state.push("thead_close", "thead", -1);
		let tbodyLines;
		let autocompletedCells = 0;
		for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
			if (state.sCount[nextLine] < state.blkIndent) break;
			let terminate = false;
			for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
				terminate = true;
				break;
			}
			if (terminate) break;
			lineText = getLine(state, nextLine).trim();
			if (!lineText) break;
			if (state.sCount[nextLine] - state.blkIndent >= 4) break;
			columns = escapedSplit(lineText);
			if (columns.length && columns[0] === "") columns.shift();
			if (columns.length && columns[columns.length - 1] === "") columns.pop();
			autocompletedCells += columnCount - columns.length;
			if (autocompletedCells > MAX_AUTOCOMPLETED_CELLS) break;
			if (nextLine === startLine + 2) {
				const token_tbo = state.push("tbody_open", "tbody", 1);
				token_tbo.map = tbodyLines = [startLine + 2, 0];
			}
			const token_tro = state.push("tr_open", "tr", 1);
			token_tro.map = [nextLine, nextLine + 1];
			for (let i = 0; i < columnCount; i++) {
				const token_tdo = state.push("td_open", "td", 1);
				if (aligns[i]) token_tdo.attrs = [["style", "text-align:" + aligns[i]]];
				const token_il = state.push("inline", "", 0);
				token_il.content = columns[i] ? columns[i].trim() : "";
				token_il.children = [];
				state.push("td_close", "td", -1);
			}
			state.push("tr_close", "tr", -1);
		}
		if (tbodyLines) {
			state.push("tbody_close", "tbody", -1);
			tbodyLines[1] = nextLine;
		}
		state.push("table_close", "table", -1);
		tableLines[1] = nextLine;
		state.parentType = oldParentType;
		state.line = nextLine;
		return true;
	}
	function code(state, startLine, endLine) {
		if (state.sCount[startLine] - state.blkIndent < 4) return false;
		let nextLine = startLine + 1;
		let last = nextLine;
		while (nextLine < endLine) {
			if (state.isEmpty(nextLine)) {
				nextLine++;
				continue;
			}
			if (state.sCount[nextLine] - state.blkIndent >= 4) {
				nextLine++;
				last = nextLine;
				continue;
			}
			break;
		}
		state.line = last;
		const token = state.push("code_block", "code", 0);
		token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
		token.map = [startLine, state.line];
		return true;
	}
	function fence(state, startLine, endLine, silent) {
		let pos = state.bMarks[startLine] + state.tShift[startLine];
		let max = state.eMarks[startLine];
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		if (pos + 3 > max) return false;
		const marker = state.src.charCodeAt(pos);
		if (marker !== 126 && marker !== 96) return false;
		let mem = pos;
		pos = state.skipChars(pos, marker);
		let len = pos - mem;
		if (len < 3) return false;
		const markup = state.src.slice(mem, pos);
		const params = state.src.slice(pos, max);
		if (marker === 96) {
			if (params.indexOf(String.fromCharCode(marker)) >= 0) return false;
		}
		if (silent) return true;
		let nextLine = startLine;
		let haveEndMarker = false;
		for (;;) {
			nextLine++;
			if (nextLine >= endLine) break;
			pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
			max = state.eMarks[nextLine];
			if (pos < max && state.sCount[nextLine] < state.blkIndent) break;
			if (state.src.charCodeAt(pos) !== marker) continue;
			if (state.sCount[nextLine] - state.blkIndent >= 4) continue;
			pos = state.skipChars(pos, marker);
			if (pos - mem < len) continue;
			pos = state.skipSpaces(pos);
			if (pos < max) continue;
			haveEndMarker = true;
			break;
		}
		len = state.sCount[startLine];
		state.line = nextLine + (haveEndMarker ? 1 : 0);
		const token = state.push("fence", "code", 0);
		token.info = params;
		token.content = state.getLines(startLine + 1, nextLine, len, true);
		token.markup = markup;
		token.map = [startLine, state.line];
		return true;
	}
	function blockquote(state, startLine, endLine, silent) {
		let pos = state.bMarks[startLine] + state.tShift[startLine];
		let max = state.eMarks[startLine];
		const oldLineMax = state.lineMax;
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		if (state.src.charCodeAt(pos) !== 62) return false;
		if (silent) return true;
		const oldBMarks = [];
		const oldBSCount = [];
		const oldSCount = [];
		const oldTShift = [];
		const terminatorRules = state.md.block.ruler.getRules("blockquote");
		const oldParentType = state.parentType;
		state.parentType = "blockquote";
		let lastLineEmpty = false;
		let nextLine;
		for (nextLine = startLine; nextLine < endLine; nextLine++) {
			const isOutdented = state.sCount[nextLine] < state.blkIndent;
			pos = state.bMarks[nextLine] + state.tShift[nextLine];
			max = state.eMarks[nextLine];
			if (pos >= max) break;
			if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
				let initial = state.sCount[nextLine] + 1;
				let spaceAfterMarker;
				let adjustTab;
				if (state.src.charCodeAt(pos) === 32) {
					pos++;
					initial++;
					adjustTab = false;
					spaceAfterMarker = true;
				} else if (state.src.charCodeAt(pos) === 9) {
					spaceAfterMarker = true;
					if ((state.bsCount[nextLine] + initial) % 4 === 3) {
						pos++;
						initial++;
						adjustTab = false;
					} else adjustTab = true;
				} else spaceAfterMarker = false;
				let offset = initial;
				oldBMarks.push(state.bMarks[nextLine]);
				state.bMarks[nextLine] = pos;
				while (pos < max) {
					const ch = state.src.charCodeAt(pos);
					if (isSpace(ch)) {
						if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
						else offset++;
					} else break;
					pos++;
				}
				lastLineEmpty = pos >= max;
				oldBSCount.push(state.bsCount[nextLine]);
				state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
				oldSCount.push(state.sCount[nextLine]);
				state.sCount[nextLine] = offset - initial;
				oldTShift.push(state.tShift[nextLine]);
				state.tShift[nextLine] = pos - state.bMarks[nextLine];
				continue;
			}
			if (lastLineEmpty) break;
			let terminate = false;
			for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
				terminate = true;
				break;
			}
			if (terminate) {
				state.lineMax = nextLine;
				if (state.blkIndent !== 0) {
					oldBMarks.push(state.bMarks[nextLine]);
					oldBSCount.push(state.bsCount[nextLine]);
					oldTShift.push(state.tShift[nextLine]);
					oldSCount.push(state.sCount[nextLine]);
					state.sCount[nextLine] -= state.blkIndent;
				}
				break;
			}
			oldBMarks.push(state.bMarks[nextLine]);
			oldBSCount.push(state.bsCount[nextLine]);
			oldTShift.push(state.tShift[nextLine]);
			oldSCount.push(state.sCount[nextLine]);
			state.sCount[nextLine] = -1;
		}
		const oldIndent = state.blkIndent;
		state.blkIndent = 0;
		const token_o = state.push("blockquote_open", "blockquote", 1);
		token_o.markup = ">";
		const lines = [startLine, 0];
		token_o.map = lines;
		state.md.block.tokenize(state, startLine, nextLine);
		const token_c = state.push("blockquote_close", "blockquote", -1);
		token_c.markup = ">";
		state.lineMax = oldLineMax;
		state.parentType = oldParentType;
		lines[1] = state.line;
		for (let i = 0; i < oldTShift.length; i++) {
			state.bMarks[i + startLine] = oldBMarks[i];
			state.tShift[i + startLine] = oldTShift[i];
			state.sCount[i + startLine] = oldSCount[i];
			state.bsCount[i + startLine] = oldBSCount[i];
		}
		state.blkIndent = oldIndent;
		return true;
	}
	function hr(state, startLine, endLine, silent) {
		const max = state.eMarks[startLine];
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		let pos = state.bMarks[startLine] + state.tShift[startLine];
		const marker = state.src.charCodeAt(pos++);
		if (marker !== 42 && marker !== 45 && marker !== 95) return false;
		let cnt = 1;
		while (pos < max) {
			const ch = state.src.charCodeAt(pos++);
			if (ch !== marker && !isSpace(ch)) return false;
			if (ch === marker) cnt++;
		}
		if (cnt < 3) return false;
		if (silent) return true;
		state.line = startLine + 1;
		const token = state.push("hr", "hr", 0);
		token.map = [startLine, state.line];
		token.markup = Array(cnt + 1).join(String.fromCharCode(marker));
		return true;
	}
	function skipBulletListMarker(state, startLine) {
		const max = state.eMarks[startLine];
		let pos = state.bMarks[startLine] + state.tShift[startLine];
		const marker = state.src.charCodeAt(pos++);
		if (marker !== 42 && marker !== 45 && marker !== 43) return -1;
		if (pos < max) {
			if (!isSpace(state.src.charCodeAt(pos))) return -1;
		}
		return pos;
	}
	function skipOrderedListMarker(state, startLine) {
		const start = state.bMarks[startLine] + state.tShift[startLine];
		const max = state.eMarks[startLine];
		let pos = start;
		if (pos + 1 >= max) return -1;
		let ch = state.src.charCodeAt(pos++);
		if (ch < 48 || ch > 57) return -1;
		for (;;) {
			if (pos >= max) return -1;
			ch = state.src.charCodeAt(pos++);
			if (ch >= 48 && ch <= 57) {
				if (pos - start >= 10) return -1;
				continue;
			}
			if (ch === 41 || ch === 46) break;
			return -1;
		}
		if (pos < max) {
			ch = state.src.charCodeAt(pos);
			if (!isSpace(ch)) return -1;
		}
		return pos;
	}
	function markTightParagraphs(state, idx) {
		const level = state.level + 2;
		for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
			state.tokens[i + 2].hidden = true;
			state.tokens[i].hidden = true;
			i += 2;
		}
	}
	function list(state, startLine, endLine, silent) {
		let max, pos, start, token;
		let nextLine = startLine;
		let tight = true;
		if (state.sCount[nextLine] - state.blkIndent >= 4) return false;
		if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) return false;
		let isTerminatingParagraph = false;
		if (silent && state.parentType === "paragraph") {
			if (state.sCount[nextLine] >= state.blkIndent) isTerminatingParagraph = true;
		}
		let isOrdered;
		let markerValue;
		let posAfterMarker;
		if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
			isOrdered = true;
			start = state.bMarks[nextLine] + state.tShift[nextLine];
			markerValue = Number(state.src.slice(start, posAfterMarker - 1));
			if (isTerminatingParagraph && markerValue !== 1) return false;
		} else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) isOrdered = false;
		else return false;
		if (isTerminatingParagraph) {
			if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
		}
		if (silent) return true;
		const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
		const listTokIdx = state.tokens.length;
		if (isOrdered) {
			token = state.push("ordered_list_open", "ol", 1);
			if (markerValue !== 1) token.attrs = [["start", markerValue]];
		} else token = state.push("bullet_list_open", "ul", 1);
		const listLines = [nextLine, 0];
		token.map = listLines;
		token.markup = String.fromCharCode(markerCharCode);
		let prevEmptyEnd = false;
		const terminatorRules = state.md.block.ruler.getRules("list");
		const oldParentType = state.parentType;
		state.parentType = "list";
		while (nextLine < endLine) {
			pos = posAfterMarker;
			max = state.eMarks[nextLine];
			const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
			let offset = initial;
			while (pos < max) {
				const ch = state.src.charCodeAt(pos);
				if (ch === 9) offset += 4 - (offset + state.bsCount[nextLine]) % 4;
				else if (ch === 32) offset++;
				else break;
				pos++;
			}
			const contentStart = pos;
			let indentAfterMarker;
			if (contentStart >= max) indentAfterMarker = 1;
			else indentAfterMarker = offset - initial;
			if (indentAfterMarker > 4) indentAfterMarker = 1;
			const indent = initial + indentAfterMarker;
			token = state.push("list_item_open", "li", 1);
			token.markup = String.fromCharCode(markerCharCode);
			const itemLines = [nextLine, 0];
			token.map = itemLines;
			if (isOrdered) token.info = state.src.slice(start, posAfterMarker - 1);
			const oldTight = state.tight;
			const oldTShift = state.tShift[nextLine];
			const oldSCount = state.sCount[nextLine];
			const oldListIndent = state.listIndent;
			state.listIndent = state.blkIndent;
			state.blkIndent = indent;
			state.tight = true;
			state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
			state.sCount[nextLine] = offset;
			if (contentStart >= max && state.isEmpty(nextLine + 1)) state.line = Math.min(state.line + 2, endLine);
			else state.md.block.tokenize(state, nextLine, endLine, true);
			if (!state.tight || prevEmptyEnd) tight = false;
			prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
			state.blkIndent = state.listIndent;
			state.listIndent = oldListIndent;
			state.tShift[nextLine] = oldTShift;
			state.sCount[nextLine] = oldSCount;
			state.tight = oldTight;
			token = state.push("list_item_close", "li", -1);
			token.markup = String.fromCharCode(markerCharCode);
			nextLine = state.line;
			itemLines[1] = nextLine;
			if (nextLine >= endLine) break;
			if (state.sCount[nextLine] < state.blkIndent) break;
			if (state.sCount[nextLine] - state.blkIndent >= 4) break;
			let terminate = false;
			for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
				terminate = true;
				break;
			}
			if (terminate) break;
			if (isOrdered) {
				posAfterMarker = skipOrderedListMarker(state, nextLine);
				if (posAfterMarker < 0) break;
				start = state.bMarks[nextLine] + state.tShift[nextLine];
			} else {
				posAfterMarker = skipBulletListMarker(state, nextLine);
				if (posAfterMarker < 0) break;
			}
			if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) break;
		}
		if (isOrdered) token = state.push("ordered_list_close", "ol", -1);
		else token = state.push("bullet_list_close", "ul", -1);
		token.markup = String.fromCharCode(markerCharCode);
		listLines[1] = nextLine;
		state.line = nextLine;
		state.parentType = oldParentType;
		if (tight) markTightParagraphs(state, listTokIdx);
		return true;
	}
	function reference(state, startLine, _endLine, silent) {
		let pos = state.bMarks[startLine] + state.tShift[startLine];
		let max = state.eMarks[startLine];
		let nextLine = startLine + 1;
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		if (state.src.charCodeAt(pos) !== 91) return false;
		function getNextLine(nextLine) {
			const endLine = state.lineMax;
			if (nextLine >= endLine || state.isEmpty(nextLine)) return null;
			let isContinuation = false;
			if (state.sCount[nextLine] - state.blkIndent > 3) isContinuation = true;
			if (state.sCount[nextLine] < 0) isContinuation = true;
			if (!isContinuation) {
				const terminatorRules = state.md.block.ruler.getRules("reference");
				const oldParentType = state.parentType;
				state.parentType = "reference";
				let terminate = false;
				for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
					terminate = true;
					break;
				}
				state.parentType = oldParentType;
				if (terminate) return null;
			}
			const pos = state.bMarks[nextLine] + state.tShift[nextLine];
			const max = state.eMarks[nextLine];
			return state.src.slice(pos, max + 1);
		}
		let str = state.src.slice(pos, max + 1);
		max = str.length;
		let labelEnd = -1;
		for (pos = 1; pos < max; pos++) {
			const ch = str.charCodeAt(pos);
			if (ch === 91) return false;
			else if (ch === 93) {
				labelEnd = pos;
				break;
			} else if (ch === 10) {
				const lineContent = getNextLine(nextLine);
				if (lineContent !== null) {
					str += lineContent;
					max = str.length;
					nextLine++;
				}
			} else if (ch === 92) {
				pos++;
				if (pos < max && str.charCodeAt(pos) === 10) {
					const lineContent = getNextLine(nextLine);
					if (lineContent !== null) {
						str += lineContent;
						max = str.length;
						nextLine++;
					}
				}
			}
		}
		if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) return false;
		for (pos = labelEnd + 2; pos < max; pos++) {
			const ch = str.charCodeAt(pos);
			if (ch === 10) {
				const lineContent = getNextLine(nextLine);
				if (lineContent !== null) {
					str += lineContent;
					max = str.length;
					nextLine++;
				}
			} else if (isSpace(ch)) {} else break;
		}
		const destRes = state.md.helpers.parseLinkDestination(str, pos, max);
		if (!destRes.ok) return false;
		const href = state.md.normalizeLink(destRes.str);
		if (!state.md.validateLink(href)) return false;
		pos = destRes.pos;
		const destEndPos = pos;
		const destEndLineNo = nextLine;
		const start = pos;
		for (; pos < max; pos++) {
			const ch = str.charCodeAt(pos);
			if (ch === 10) {
				const lineContent = getNextLine(nextLine);
				if (lineContent !== null) {
					str += lineContent;
					max = str.length;
					nextLine++;
				}
			} else if (isSpace(ch)) {} else break;
		}
		let titleRes = state.md.helpers.parseLinkTitle(str, pos, max);
		while (titleRes.can_continue) {
			const lineContent = getNextLine(nextLine);
			if (lineContent === null) break;
			str += lineContent;
			pos = max;
			max = str.length;
			nextLine++;
			titleRes = state.md.helpers.parseLinkTitle(str, pos, max, titleRes);
		}
		let title;
		if (pos < max && start !== pos && titleRes.ok) {
			title = titleRes.str;
			pos = titleRes.pos;
		} else {
			title = "";
			pos = destEndPos;
			nextLine = destEndLineNo;
		}
		while (pos < max) {
			if (!isSpace(str.charCodeAt(pos))) break;
			pos++;
		}
		if (pos < max && str.charCodeAt(pos) !== 10) {
			if (title) {
				title = "";
				pos = destEndPos;
				nextLine = destEndLineNo;
				while (pos < max) {
					if (!isSpace(str.charCodeAt(pos))) break;
					pos++;
				}
			}
		}
		if (pos < max && str.charCodeAt(pos) !== 10) return false;
		const label = normalizeReference(str.slice(1, labelEnd));
		if (!label) return false;
		if (silent) return true;
		if (typeof state.env.references === "undefined") state.env.references = {};
		if (typeof state.env.references[label] === "undefined") state.env.references[label] = {
			title,
			href
		};
		state.line = nextLine;
		return true;
	}
	var html_blocks_default = [
		"address",
		"article",
		"aside",
		"base",
		"basefont",
		"blockquote",
		"body",
		"caption",
		"center",
		"col",
		"colgroup",
		"dd",
		"details",
		"dialog",
		"dir",
		"div",
		"dl",
		"dt",
		"fieldset",
		"figcaption",
		"figure",
		"footer",
		"form",
		"frame",
		"frameset",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"head",
		"header",
		"hr",
		"html",
		"iframe",
		"legend",
		"li",
		"link",
		"main",
		"menu",
		"menuitem",
		"nav",
		"noframes",
		"ol",
		"optgroup",
		"option",
		"p",
		"param",
		"search",
		"section",
		"summary",
		"table",
		"tbody",
		"td",
		"tfoot",
		"th",
		"thead",
		"title",
		"tr",
		"track",
		"ul"
	];
	var open_tag = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>";
	var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
	var HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)");
	var HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
	var HTML_SEQUENCES = [
		[
			/^<(script|pre|style|textarea)(?=(\s|>|$))/i,
			/<\/(script|pre|style|textarea)>/i,
			true
		],
		[
			/^<!--/,
			/-->/,
			true
		],
		[
			/^<\?/,
			/\?>/,
			true
		],
		[
			/^<![A-Za-z]/,
			/>/,
			true
		],
		[
			/^<!\[CDATA\[/,
			/\]\]>/,
			true
		],
		[
			new RegExp("^</?(" + html_blocks_default.join("|") + ")(?=(\\s|/?>|$))", "i"),
			/^$/,
			true
		],
		[
			new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"),
			/^$/,
			false
		]
	];
	function html_block(state, startLine, endLine, silent) {
		let pos = state.bMarks[startLine] + state.tShift[startLine];
		let max = state.eMarks[startLine];
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		if (!state.md.options.html) return false;
		if (state.src.charCodeAt(pos) !== 60) return false;
		let lineText = state.src.slice(pos, max);
		let i = 0;
		for (; i < HTML_SEQUENCES.length; i++) if (HTML_SEQUENCES[i][0].test(lineText)) break;
		if (i === HTML_SEQUENCES.length) return false;
		if (silent) return HTML_SEQUENCES[i][2];
		let nextLine = startLine + 1;
		const endsOnBlankLine = HTML_SEQUENCES[i][1].test("");
		if (!HTML_SEQUENCES[i][1].test(lineText)) for (; nextLine < endLine; nextLine++) {
			if (state.sCount[nextLine] < state.blkIndent) {
				if (endsOnBlankLine || !state.isEmpty(nextLine)) break;
			}
			pos = state.bMarks[nextLine] + state.tShift[nextLine];
			max = state.eMarks[nextLine];
			lineText = state.src.slice(pos, max);
			if (HTML_SEQUENCES[i][1].test(lineText)) {
				if (lineText.length !== 0) nextLine++;
				break;
			}
		}
		state.line = nextLine;
		const token = state.push("html_block", "", 0);
		token.map = [startLine, nextLine];
		token.content = state.getLines(startLine, nextLine, state.blkIndent, true);
		return true;
	}
	function heading(state, startLine, endLine, silent) {
		let pos = state.bMarks[startLine] + state.tShift[startLine];
		let max = state.eMarks[startLine];
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		let ch = state.src.charCodeAt(pos);
		if (ch !== 35 || pos >= max) return false;
		let level = 1;
		ch = state.src.charCodeAt(++pos);
		while (ch === 35 && pos < max && level <= 6) {
			level++;
			ch = state.src.charCodeAt(++pos);
		}
		if (level > 6 || pos < max && !isSpace(ch)) return false;
		if (silent) return true;
		max = state.skipSpacesBack(max, pos);
		const tmp = state.skipCharsBack(max, 35, pos);
		if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) max = tmp;
		state.line = startLine + 1;
		const token_o = state.push("heading_open", "h" + String(level), 1);
		token_o.markup = "########".slice(0, level);
		token_o.map = [startLine, state.line];
		const token_i = state.push("inline", "", 0);
		token_i.content = asciiTrim(state.src.slice(pos, max));
		token_i.map = [startLine, state.line];
		token_i.children = [];
		const token_c = state.push("heading_close", "h" + String(level), -1);
		token_c.markup = "########".slice(0, level);
		return true;
	}
	function lheading(state, startLine, endLine) {
		const terminatorRules = state.md.block.ruler.getRules("paragraph");
		if (state.sCount[startLine] - state.blkIndent >= 4) return false;
		const oldParentType = state.parentType;
		state.parentType = "paragraph";
		let level = 0;
		let marker;
		let nextLine = startLine + 1;
		for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
			if (state.sCount[nextLine] - state.blkIndent > 3) continue;
			if (state.sCount[nextLine] >= state.blkIndent) {
				let pos = state.bMarks[nextLine] + state.tShift[nextLine];
				const max = state.eMarks[nextLine];
				if (pos < max) {
					marker = state.src.charCodeAt(pos);
					if (marker === 45 || marker === 61) {
						pos = state.skipChars(pos, marker);
						pos = state.skipSpaces(pos);
						if (pos >= max) {
							level = marker === 61 ? 1 : 2;
							break;
						}
					}
				}
			}
			if (state.sCount[nextLine] < 0) continue;
			let terminate = false;
			for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
				terminate = true;
				break;
			}
			if (terminate) break;
		}
		if (!level) {
			state.parentType = oldParentType;
			return false;
		}
		const content = asciiTrim(state.getLines(startLine, nextLine, state.blkIndent, false));
		state.line = nextLine + 1;
		const token_o = state.push("heading_open", "h" + String(level), 1);
		token_o.markup = String.fromCharCode(marker);
		token_o.map = [startLine, state.line];
		const token_i = state.push("inline", "", 0);
		token_i.content = content;
		token_i.map = [startLine, state.line - 1];
		token_i.children = [];
		const token_c = state.push("heading_close", "h" + String(level), -1);
		token_c.markup = String.fromCharCode(marker);
		state.parentType = oldParentType;
		return true;
	}
	function paragraph(state, startLine, endLine) {
		const terminatorRules = state.md.block.ruler.getRules("paragraph");
		const oldParentType = state.parentType;
		let nextLine = startLine + 1;
		state.parentType = "paragraph";
		for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
			if (state.sCount[nextLine] - state.blkIndent > 3) continue;
			if (state.sCount[nextLine] < 0) continue;
			let terminate = false;
			for (let i = 0, l = terminatorRules.length; i < l; i++) if (terminatorRules[i](state, nextLine, endLine, true)) {
				terminate = true;
				break;
			}
			if (terminate) break;
		}
		const content = asciiTrim(state.getLines(startLine, nextLine, state.blkIndent, false));
		state.line = nextLine;
		const token_o = state.push("paragraph_open", "p", 1);
		token_o.map = [startLine, state.line];
		const token_i = state.push("inline", "", 0);
		token_i.content = content;
		token_i.map = [startLine, state.line];
		token_i.children = [];
		state.push("paragraph_close", "p", -1);
		state.parentType = oldParentType;
		return true;
	}
	var _rules$1 = [
		[
			"table",
			table,
			["paragraph", "reference"]
		],
		["code", code],
		[
			"fence",
			fence,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"blockquote",
			blockquote,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"hr",
			hr,
			[
				"paragraph",
				"reference",
				"blockquote",
				"list"
			]
		],
		[
			"list",
			list,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["reference", reference],
		[
			"html_block",
			html_block,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		[
			"heading",
			heading,
			[
				"paragraph",
				"reference",
				"blockquote"
			]
		],
		["lheading", lheading],
		["paragraph", paragraph]
	];
	function ParserBlock() {
		this.ruler = new Ruler();
		for (let i = 0; i < _rules$1.length; i++) this.ruler.push(_rules$1[i][0], _rules$1[i][1], { alt: (_rules$1[i][2] || []).slice() });
	}
	ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const maxNesting = state.md.options.maxNesting;
		let line = startLine;
		let hasEmptyLines = false;
		while (line < endLine) {
			state.line = line = state.skipEmptyLines(line);
			if (line >= endLine) break;
			if (state.sCount[line] < state.blkIndent) break;
			if (state.level >= maxNesting) {
				state.line = endLine;
				break;
			}
			const prevLine = state.line;
			let ok = false;
			for (let i = 0; i < len; i++) {
				ok = rules[i](state, line, endLine, false);
				if (ok) {
					if (prevLine >= state.line) throw new Error("block rule didn't increment state.line");
					break;
				}
			}
			if (!ok) throw new Error("none of the block rules matched");
			state.tight = !hasEmptyLines;
			if (state.isEmpty(state.line - 1)) hasEmptyLines = true;
			line = state.line;
			if (line < endLine && state.isEmpty(line)) {
				hasEmptyLines = true;
				line++;
				state.line = line;
			}
		}
	};
	ParserBlock.prototype.parse = function(src, md, env, outTokens) {
		if (!src) return;
		const state = new this.State(src, md, env, outTokens);
		this.tokenize(state, state.line, state.lineMax);
	};
	ParserBlock.prototype.State = StateBlock;
	function StateInline(src, md, env, outTokens) {
		this.src = src;
		this.env = env;
		this.md = md;
		this.tokens = outTokens;
		this.tokens_meta = Array(outTokens.length);
		this.pos = 0;
		this.posMax = this.src.length;
		this.level = 0;
		this.pending = "";
		this.pendingLevel = 0;
		this.cache = {};
		this.delimiters = [];
		this._prev_delimiters = [];
		this.backticks = {};
		this.backticksScanned = false;
		this.linkLevel = 0;
	}
	StateInline.prototype.pushPending = function() {
		const token = new Token$1("text", "", 0);
		token.content = this.pending;
		token.level = this.pendingLevel;
		this.tokens.push(token);
		this.pending = "";
		return token;
	};
	StateInline.prototype.push = function(type, tag, nesting) {
		if (this.pending) this.pushPending();
		const token = new Token$1(type, tag, nesting);
		let token_meta = null;
		if (nesting < 0) {
			this.level--;
			this.delimiters = this._prev_delimiters.pop();
		}
		token.level = this.level;
		if (nesting > 0) {
			this.level++;
			this._prev_delimiters.push(this.delimiters);
			this.delimiters = [];
			token_meta = { delimiters: this.delimiters };
		}
		this.pendingLevel = this.level;
		this.tokens.push(token);
		this.tokens_meta.push(token_meta);
		return token;
	};
	StateInline.prototype.scanDelims = function(start, canSplitWord) {
		const max = this.posMax;
		const marker = this.src.charCodeAt(start);
		let lastChar;
		if (start === 0) lastChar = 32;
		else if (start === 1) {
			lastChar = this.src.charCodeAt(0);
			if ((lastChar & 63488) === 55296) lastChar = 65533;
		} else {
			lastChar = this.src.charCodeAt(start - 1);
			if ((lastChar & 64512) === 56320) {
				const highSurr = this.src.charCodeAt(start - 2);
				lastChar = (highSurr & 64512) === 55296 ? 65536 + (highSurr - 55296 << 10) + (lastChar - 56320) : 65533;
			} else if ((lastChar & 64512) === 55296) lastChar = 65533;
		}
		let pos = start;
		while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
		const count = pos - start;
		let nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
		if ((nextChar & 64512) === 55296) {
			const lowSurr = this.src.charCodeAt(pos + 1);
			nextChar = (lowSurr & 64512) === 56320 ? 65536 + (nextChar - 55296 << 10) + (lowSurr - 56320) : 65533;
		} else if ((nextChar & 64512) === 56320) nextChar = 65533;
		const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar);
		const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar);
		const isLastWhiteSpace = isWhiteSpace(lastChar);
		const isNextWhiteSpace = isWhiteSpace(nextChar);
		const left_flanking = !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar);
		const right_flanking = !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar);
		return {
			can_open: left_flanking && (canSplitWord || !right_flanking || isLastPunctChar),
			can_close: right_flanking && (canSplitWord || !left_flanking || isNextPunctChar),
			length: count
		};
	};
	StateInline.prototype.Token = Token$1;
	function isTerminatorChar(ch) {
		switch (ch) {
			case 10:
			case 33:
			case 35:
			case 36:
			case 37:
			case 38:
			case 42:
			case 43:
			case 45:
			case 58:
			case 60:
			case 61:
			case 62:
			case 64:
			case 91:
			case 92:
			case 93:
			case 94:
			case 95:
			case 96:
			case 123:
			case 125:
			case 126: return true;
			default: return false;
		}
	}
	function text$2(state, silent) {
		let pos = state.pos;
		while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) pos++;
		if (pos === state.pos) return false;
		if (!silent) state.pending += state.src.slice(state.pos, pos);
		state.pos = pos;
		return true;
	}
	function isAsciiAlpha(code) {
		return code >= 65 && code <= 90 || code >= 97 && code <= 122;
	}
	function isSchemeChar(code) {
		return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 45 || code === 46;
	}
	function linkify(state, silent) {
		if (!state.md.options.linkify) return false;
		if (state.linkLevel > 0) return false;
		const pos = state.pos;
		const max = state.posMax;
		if (pos + 3 > max) return false;
		if (state.src.charCodeAt(pos) !== 58) return false;
		if (state.src.charCodeAt(pos + 1) !== 47) return false;
		if (state.src.charCodeAt(pos + 2) !== 47) return false;
		const protoMin = pos - Math.min(10, state.pending.length, pos);
		let protoStart = pos;
		while (protoStart > protoMin && isSchemeChar(state.src.charCodeAt(protoStart - 1))) protoStart--;
		if (protoStart === pos || !isAsciiAlpha(state.src.charCodeAt(protoStart))) return false;
		const protoLength = pos - protoStart;
		const link = state.md.linkify.matchAtStart(state.src.slice(protoStart));
		if (!link) return false;
		let url = link.url;
		if (url.length <= protoLength) return false;
		let urlEnd = url.length;
		while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 42) urlEnd--;
		if (urlEnd !== url.length) url = url.slice(0, urlEnd);
		const fullUrl = state.md.normalizeLink(url);
		if (!state.md.validateLink(fullUrl)) return false;
		if (!silent) {
			state.pending = state.pending.slice(0, -protoLength);
			const token_o = state.push("link_open", "a", 1);
			token_o.attrs = [["href", fullUrl]];
			token_o.markup = "linkify";
			token_o.info = "auto";
			const token_t = state.push("text", "", 0);
			token_t.content = state.md.normalizeLinkText(url);
			const token_c = state.push("link_close", "a", -1);
			token_c.markup = "linkify";
			token_c.info = "auto";
		}
		state.pos += url.length - protoLength;
		return true;
	}
	function newline(state, silent) {
		let pos = state.pos;
		if (state.src.charCodeAt(pos) !== 10) return false;
		const pmax = state.pending.length - 1;
		const max = state.posMax;
		if (!silent) {
			if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
				if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
					let ws = pmax - 1;
					while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
					state.pending = state.pending.slice(0, ws);
					state.push("hardbreak", "br", 0);
				} else {
					state.pending = state.pending.slice(0, -1);
					state.push("softbreak", "br", 0);
				}
			} else state.push("softbreak", "br", 0);
		}
		pos++;
		while (pos < max && isSpace(state.src.charCodeAt(pos))) pos++;
		state.pos = pos;
		return true;
	}
	var ESCAPED = [];
	for (let i = 0; i < 256; i++) ESCAPED.push(0);
	"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
		ESCAPED[ch.charCodeAt(0)] = 1;
	});
	function escape$1(state, silent) {
		let pos = state.pos;
		const max = state.posMax;
		if (state.src.charCodeAt(pos) !== 92) return false;
		pos++;
		if (pos >= max) return false;
		let ch1 = state.src.charCodeAt(pos);
		if (ch1 === 10) {
			if (!silent) state.push("hardbreak", "br", 0);
			pos++;
			while (pos < max) {
				ch1 = state.src.charCodeAt(pos);
				if (!isSpace(ch1)) break;
				pos++;
			}
			state.pos = pos;
			return true;
		}
		if (ch1 === 32) {
			if (!silent) {
				const token = state.push("text_special", "", 0);
				token.content = "\\";
				token.markup = "\\";
				token.info = "escape";
			}
			state.pos = pos;
			return true;
		}
		let escapedStr = state.src[pos];
		if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
			const ch2 = state.src.charCodeAt(pos + 1);
			if (ch2 >= 56320 && ch2 <= 57343) {
				escapedStr += state.src[pos + 1];
				pos++;
			}
		}
		const origStr = "\\" + escapedStr;
		if (!silent) {
			const token = state.push("text_special", "", 0);
			if (ch1 < 256 && ESCAPED[ch1] !== 0) token.content = escapedStr;
			else token.content = origStr;
			token.markup = origStr;
			token.info = "escape";
		}
		state.pos = pos + 1;
		return true;
	}
	function backtick(state, silent) {
		let pos = state.pos;
		if (state.src.charCodeAt(pos) !== 96) return false;
		const start = pos;
		pos++;
		const max = state.posMax;
		while (pos < max && state.src.charCodeAt(pos) === 96) pos++;
		const marker = state.src.slice(start, pos);
		const openerLength = marker.length;
		if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
			if (!silent) state.pending += marker;
			state.pos += openerLength;
			return true;
		}
		let matchEnd = pos;
		let matchStart;
		while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
			matchEnd = matchStart + 1;
			while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) matchEnd++;
			const closerLength = matchEnd - matchStart;
			if (closerLength === openerLength) {
				if (!silent) {
					const token = state.push("code_inline", "code", 0);
					token.markup = marker;
					token.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
				}
				state.pos = matchEnd;
				return true;
			}
			state.backticks[closerLength] = matchStart;
		}
		state.backticksScanned = true;
		if (!silent) state.pending += marker;
		state.pos += openerLength;
		return true;
	}
	function strikethrough_tokenize(state, silent) {
		const start = state.pos;
		const marker = state.src.charCodeAt(start);
		if (silent) return false;
		if (marker !== 126) return false;
		const scanned = state.scanDelims(state.pos, true);
		let len = scanned.length;
		const ch = String.fromCharCode(marker);
		if (len < 2) return false;
		let token;
		if (len % 2) {
			token = state.push("text", "", 0);
			token.content = ch;
			len--;
		}
		for (let i = 0; i < len; i += 2) {
			token = state.push("text", "", 0);
			token.content = ch + ch;
			state.delimiters.push({
				marker,
				length: 0,
				token: state.tokens.length - 1,
				end: -1,
				open: scanned.can_open,
				close: scanned.can_close
			});
		}
		state.pos += scanned.length;
		return true;
	}
	function postProcess$2(state, delimiters) {
		let token;
		const loneMarkers = [];
		const max = delimiters.length;
		for (let i = 0; i < max; i++) {
			const startDelim = delimiters[i];
			if (startDelim.marker !== 126) continue;
			if (startDelim.end === -1) continue;
			const endDelim = delimiters[startDelim.end];
			token = state.tokens[startDelim.token];
			token.type = "s_open";
			token.tag = "s";
			token.nesting = 1;
			token.markup = "~~";
			token.content = "";
			token = state.tokens[endDelim.token];
			token.type = "s_close";
			token.tag = "s";
			token.nesting = -1;
			token.markup = "~~";
			token.content = "";
			if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") loneMarkers.push(endDelim.token - 1);
		}
		while (loneMarkers.length) {
			const i = loneMarkers.pop();
			let j = i + 1;
			while (j < state.tokens.length && state.tokens[j].type === "s_close") j++;
			j--;
			if (i !== j) {
				token = state.tokens[j];
				state.tokens[j] = state.tokens[i];
				state.tokens[i] = token;
			}
		}
	}
	function strikethrough_postProcess(state) {
		const tokens_meta = state.tokens_meta;
		const max = state.tokens_meta.length;
		postProcess$2(state, state.delimiters);
		for (let curr = 0; curr < max; curr++) if (tokens_meta[curr] && tokens_meta[curr].delimiters) postProcess$2(state, tokens_meta[curr].delimiters);
	}
	var strikethrough_default = {
		tokenize: strikethrough_tokenize,
		postProcess: strikethrough_postProcess
	};
	function emphasis_tokenize(state, silent) {
		const start = state.pos;
		const marker = state.src.charCodeAt(start);
		if (silent) return false;
		if (marker !== 95 && marker !== 42) return false;
		const scanned = state.scanDelims(state.pos, marker === 42);
		for (let i = 0; i < scanned.length; i++) {
			const token = state.push("text", "", 0);
			token.content = String.fromCharCode(marker);
			state.delimiters.push({
				marker,
				length: scanned.length,
				token: state.tokens.length - 1,
				end: -1,
				open: scanned.can_open,
				close: scanned.can_close
			});
		}
		state.pos += scanned.length;
		return true;
	}
	function postProcess$1(state, delimiters) {
		const max = delimiters.length;
		for (let i = max - 1; i >= 0; i--) {
			const startDelim = delimiters[i];
			if (startDelim.marker !== 95 && startDelim.marker !== 42) continue;
			if (startDelim.end === -1) continue;
			const endDelim = delimiters[startDelim.end];
			const isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && delimiters[startDelim.end + 1].token === endDelim.token + 1;
			const ch = String.fromCharCode(startDelim.marker);
			const token_o = state.tokens[startDelim.token];
			token_o.type = isStrong ? "strong_open" : "em_open";
			token_o.tag = isStrong ? "strong" : "em";
			token_o.nesting = 1;
			token_o.markup = isStrong ? ch + ch : ch;
			token_o.content = "";
			const token_c = state.tokens[endDelim.token];
			token_c.type = isStrong ? "strong_close" : "em_close";
			token_c.tag = isStrong ? "strong" : "em";
			token_c.nesting = -1;
			token_c.markup = isStrong ? ch + ch : ch;
			token_c.content = "";
			if (isStrong) {
				state.tokens[delimiters[i - 1].token].content = "";
				state.tokens[delimiters[startDelim.end + 1].token].content = "";
				i--;
			}
		}
	}
	function emphasis_post_process(state) {
		const tokens_meta = state.tokens_meta;
		const max = state.tokens_meta.length;
		postProcess$1(state, state.delimiters);
		for (let curr = 0; curr < max; curr++) if (tokens_meta[curr] && tokens_meta[curr].delimiters) postProcess$1(state, tokens_meta[curr].delimiters);
	}
	var emphasis_default = {
		tokenize: emphasis_tokenize,
		postProcess: emphasis_post_process
	};
	function link(state, silent) {
		let code, label, res, ref;
		let href = "";
		let title = "";
		let start = state.pos;
		let parseReference = true;
		if (state.src.charCodeAt(state.pos) !== 91) return false;
		const oldPos = state.pos;
		const max = state.posMax;
		const labelStart = state.pos + 1;
		const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
		if (labelEnd < 0) return false;
		let pos = labelEnd + 1;
		if (pos < max && state.src.charCodeAt(pos) === 40) {
			parseReference = false;
			pos++;
			for (; pos < max; pos++) {
				code = state.src.charCodeAt(pos);
				if (!isSpace(code) && code !== 10) break;
			}
			if (pos >= max) return false;
			start = pos;
			res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
			if (res.ok) {
				href = state.md.normalizeLink(res.str);
				if (state.md.validateLink(href)) pos = res.pos;
				else href = "";
				start = pos;
				for (; pos < max; pos++) {
					code = state.src.charCodeAt(pos);
					if (!isSpace(code) && code !== 10) break;
				}
				res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
				if (pos < max && start !== pos && res.ok) {
					title = res.str;
					pos = res.pos;
					for (; pos < max; pos++) {
						code = state.src.charCodeAt(pos);
						if (!isSpace(code) && code !== 10) break;
					}
				}
			}
			if (pos >= max || state.src.charCodeAt(pos) !== 41) parseReference = true;
			pos++;
		}
		if (parseReference) {
			if (typeof state.env.references === "undefined") return false;
			if (pos < max && state.src.charCodeAt(pos) === 91) {
				start = pos + 1;
				pos = state.md.helpers.parseLinkLabel(state, pos);
				if (pos >= 0) label = state.src.slice(start, pos++);
				else pos = labelEnd + 1;
			} else pos = labelEnd + 1;
			if (!label) label = state.src.slice(labelStart, labelEnd);
			ref = state.env.references[normalizeReference(label)];
			if (!ref) {
				state.pos = oldPos;
				return false;
			}
			href = ref.href;
			title = ref.title;
		}
		if (!silent) {
			state.pos = labelStart;
			state.posMax = labelEnd;
			const token_o = state.push("link_open", "a", 1);
			const attrs = [["href", href]];
			token_o.attrs = attrs;
			if (title) attrs.push(["title", title]);
			state.linkLevel++;
			state.md.inline.tokenize(state);
			state.linkLevel--;
			state.push("link_close", "a", -1);
		}
		state.pos = pos;
		state.posMax = max;
		return true;
	}
	function image(state, silent) {
		let code, content, label, pos, ref, res, title, start;
		let href = "";
		const oldPos = state.pos;
		const max = state.posMax;
		if (state.src.charCodeAt(state.pos) !== 33) return false;
		if (state.src.charCodeAt(state.pos + 1) !== 91) return false;
		const labelStart = state.pos + 2;
		const labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
		if (labelEnd < 0) return false;
		pos = labelEnd + 1;
		if (pos < max && state.src.charCodeAt(pos) === 40) {
			pos++;
			for (; pos < max; pos++) {
				code = state.src.charCodeAt(pos);
				if (!isSpace(code) && code !== 10) break;
			}
			if (pos >= max) return false;
			start = pos;
			res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
			if (res.ok) {
				href = state.md.normalizeLink(res.str);
				if (state.md.validateLink(href)) pos = res.pos;
				else href = "";
			}
			start = pos;
			for (; pos < max; pos++) {
				code = state.src.charCodeAt(pos);
				if (!isSpace(code) && code !== 10) break;
			}
			res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
			if (pos < max && start !== pos && res.ok) {
				title = res.str;
				pos = res.pos;
				for (; pos < max; pos++) {
					code = state.src.charCodeAt(pos);
					if (!isSpace(code) && code !== 10) break;
				}
			} else title = "";
			if (pos >= max || state.src.charCodeAt(pos) !== 41) {
				state.pos = oldPos;
				return false;
			}
			pos++;
		} else {
			if (typeof state.env.references === "undefined") return false;
			if (pos < max && state.src.charCodeAt(pos) === 91) {
				start = pos + 1;
				pos = state.md.helpers.parseLinkLabel(state, pos);
				if (pos >= 0) label = state.src.slice(start, pos++);
				else pos = labelEnd + 1;
			} else pos = labelEnd + 1;
			if (!label) label = state.src.slice(labelStart, labelEnd);
			ref = state.env.references[normalizeReference(label)];
			if (!ref) {
				state.pos = oldPos;
				return false;
			}
			href = ref.href;
			title = ref.title;
		}
		if (!silent) {
			content = state.src.slice(labelStart, labelEnd);
			const tokens = [];
			state.md.inline.parse(content, state.md, state.env, tokens);
			const token = state.push("image", "img", 0);
			const attrs = [["src", href], ["alt", ""]];
			token.attrs = attrs;
			token.children = tokens;
			token.content = content;
			if (title) attrs.push(["title", title]);
		}
		state.pos = pos;
		state.posMax = max;
		return true;
	}
	var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
	var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
	function autolink(state, silent) {
		let pos = state.pos;
		if (state.src.charCodeAt(pos) !== 60) return false;
		const start = state.pos;
		const max = state.posMax;
		for (;;) {
			if (++pos >= max) return false;
			const ch = state.src.charCodeAt(pos);
			if (ch === 60) return false;
			if (ch === 62) break;
		}
		const url = state.src.slice(start + 1, pos);
		if (AUTOLINK_RE.test(url)) {
			const fullUrl = state.md.normalizeLink(url);
			if (!state.md.validateLink(fullUrl)) return false;
			if (!silent) {
				const token_o = state.push("link_open", "a", 1);
				token_o.attrs = [["href", fullUrl]];
				token_o.markup = "autolink";
				token_o.info = "auto";
				const token_t = state.push("text", "", 0);
				token_t.content = state.md.normalizeLinkText(url);
				const token_c = state.push("link_close", "a", -1);
				token_c.markup = "autolink";
				token_c.info = "auto";
			}
			state.pos += url.length + 2;
			return true;
		}
		if (EMAIL_RE.test(url)) {
			const fullUrl = state.md.normalizeLink("mailto:" + url);
			if (!state.md.validateLink(fullUrl)) return false;
			if (!silent) {
				const token_o = state.push("link_open", "a", 1);
				token_o.attrs = [["href", fullUrl]];
				token_o.markup = "autolink";
				token_o.info = "auto";
				const token_t = state.push("text", "", 0);
				token_t.content = state.md.normalizeLinkText(url);
				const token_c = state.push("link_close", "a", -1);
				token_c.markup = "autolink";
				token_c.info = "auto";
			}
			state.pos += url.length + 2;
			return true;
		}
		return false;
	}
	function isLinkOpen(str) {
		return /^<a[>\s]/i.test(str);
	}
	function isLinkClose(str) {
		return /^<\/a\s*>/i.test(str);
	}
	function isLetter(ch) {
		const lc = ch | 32;
		return lc >= 97 && lc <= 122;
	}
	function html_inline(state, silent) {
		if (!state.md.options.html) return false;
		const max = state.posMax;
		const pos = state.pos;
		if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) return false;
		const ch = state.src.charCodeAt(pos + 1);
		if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) return false;
		const match = state.src.slice(pos).match(HTML_TAG_RE);
		if (!match) return false;
		if (!silent) {
			const token = state.push("html_inline", "", 0);
			token.content = match[0];
			if (isLinkOpen(token.content)) state.linkLevel++;
			if (isLinkClose(token.content)) state.linkLevel--;
		}
		state.pos += match[0].length;
		return true;
	}
	var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
	var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
	function entity(state, silent) {
		const pos = state.pos;
		const max = state.posMax;
		if (state.src.charCodeAt(pos) !== 38) return false;
		if (pos + 1 >= max) return false;
		if (state.src.charCodeAt(pos + 1) === 35) {
			const match = state.src.slice(pos).match(DIGITAL_RE);
			if (match) {
				if (!silent) {
					const code = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
					const token = state.push("text_special", "", 0);
					token.content = isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(65533);
					token.markup = match[0];
					token.info = "entity";
				}
				state.pos += match[0].length;
				return true;
			}
		} else {
			const match = state.src.slice(pos).match(NAMED_RE);
			if (match) {
				const decoded = decodeHTMLStrict(match[0]);
				if (decoded !== match[0]) {
					if (!silent) {
						const token = state.push("text_special", "", 0);
						token.content = decoded;
						token.markup = match[0];
						token.info = "entity";
					}
					state.pos += match[0].length;
					return true;
				}
			}
		}
		return false;
	}
	function processDelimiters(delimiters) {
		const openersBottom = {};
		const max = delimiters.length;
		if (!max) return;
		let headerIdx = 0;
		let lastTokenIdx = -2;
		const jumps = [];
		for (let closerIdx = 0; closerIdx < max; closerIdx++) {
			const closer = delimiters[closerIdx];
			jumps.push(0);
			if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) headerIdx = closerIdx;
			lastTokenIdx = closer.token;
			closer.length = closer.length || 0;
			if (!closer.close) continue;
			if (!openersBottom.hasOwnProperty(closer.marker)) openersBottom[closer.marker] = [
				-1,
				-1,
				-1,
				-1,
				-1,
				-1
			];
			const minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
			let openerIdx = headerIdx - jumps[headerIdx] - 1;
			let newMinOpenerIdx = openerIdx;
			for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
				const opener = delimiters[openerIdx];
				if (opener.marker !== closer.marker) continue;
				if (opener.open && opener.end < 0) {
					let isOddMatch = false;
					if (opener.close || closer.open) {
						if ((opener.length + closer.length) % 3 === 0) {
							if (opener.length % 3 !== 0 || closer.length % 3 !== 0) isOddMatch = true;
						}
					}
					if (!isOddMatch) {
						const lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
						jumps[closerIdx] = closerIdx - openerIdx + lastJump;
						jumps[openerIdx] = lastJump;
						closer.open = false;
						opener.end = closerIdx;
						opener.close = false;
						newMinOpenerIdx = -1;
						lastTokenIdx = -2;
						break;
					}
				}
			}
			if (newMinOpenerIdx !== -1) openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
		}
	}
	function link_pairs(state) {
		const tokens_meta = state.tokens_meta;
		const max = state.tokens_meta.length;
		processDelimiters(state.delimiters);
		for (let curr = 0; curr < max; curr++) if (tokens_meta[curr] && tokens_meta[curr].delimiters) processDelimiters(tokens_meta[curr].delimiters);
	}
	function fragments_join(state) {
		let curr, last;
		let level = 0;
		const tokens = state.tokens;
		const max = state.tokens.length;
		for (curr = last = 0; curr < max; curr++) {
			if (tokens[curr].nesting < 0) level--;
			tokens[curr].level = level;
			if (tokens[curr].nesting > 0) level++;
			if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
			else {
				if (curr !== last) tokens[last] = tokens[curr];
				last++;
			}
		}
		if (curr !== last) tokens.length = last;
	}
	var _rules = [
		["text", text$2],
		["linkify", linkify],
		["newline", newline],
		["escape", escape$1],
		["backticks", backtick],
		["strikethrough", strikethrough_default.tokenize],
		["emphasis", emphasis_default.tokenize],
		["link", link],
		["image", image],
		["autolink", autolink],
		["html_inline", html_inline],
		["entity", entity]
	];
	var _rules2 = [
		["balance_pairs", link_pairs],
		["strikethrough", strikethrough_default.postProcess],
		["emphasis", emphasis_default.postProcess],
		["fragments_join", fragments_join]
	];
	function ParserInline() {
		this.ruler = new Ruler();
		for (let i = 0; i < _rules.length; i++) this.ruler.push(_rules[i][0], _rules[i][1]);
		this.ruler2 = new Ruler();
		for (let i = 0; i < _rules2.length; i++) this.ruler2.push(_rules2[i][0], _rules2[i][1]);
	}
	ParserInline.prototype.skipToken = function(state) {
		const pos = state.pos;
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const maxNesting = state.md.options.maxNesting;
		const cache = state.cache;
		if (typeof cache[pos] !== "undefined") {
			state.pos = cache[pos];
			return;
		}
		let ok = false;
		if (state.level < maxNesting) for (let i = 0; i < len; i++) {
			state.level++;
			ok = rules[i](state, true);
			state.level--;
			if (ok) {
				if (pos >= state.pos) throw new Error("inline rule didn't increment state.pos");
				break;
			}
		}
		else state.pos = state.posMax;
		if (!ok) state.pos++;
		cache[pos] = state.pos;
	};
	ParserInline.prototype.tokenize = function(state) {
		const rules = this.ruler.getRules("");
		const len = rules.length;
		const end = state.posMax;
		const maxNesting = state.md.options.maxNesting;
		while (state.pos < end) {
			const prevPos = state.pos;
			let ok = false;
			if (state.level < maxNesting) for (let i = 0; i < len; i++) {
				ok = rules[i](state, false);
				if (ok) {
					if (prevPos >= state.pos) throw new Error("inline rule didn't increment state.pos");
					break;
				}
			}
			if (ok) {
				if (state.pos >= end) break;
				continue;
			}
			state.pending += state.src[state.pos++];
		}
		if (state.pending) state.pushPending();
	};
	ParserInline.prototype.parse = function(str, md, env, outTokens) {
		const state = new this.State(str, md, env, outTokens);
		this.tokenize(state);
		const rules = this.ruler2.getRules("");
		const len = rules.length;
		for (let i = 0; i < len; i++) rules[i](state);
	};
	ParserInline.prototype.State = StateInline;
	function re_default(opts) {
		const re = {};
		opts = opts || {};
		re.src_Any = regex_default$5.source;
		re.src_Cc = regex_default$4.source;
		re.src_Z = regex_default.source;
		re.src_P = regex_default$2.source;
		re.src_ZPCc = [
			re.src_Z,
			re.src_P,
			re.src_Cc
		].join("|");
		re.src_ZCc = [re.src_Z, re.src_Cc].join("|");
		const text_separators = "[><｜]";
		re.src_pseudo_letter = `(?:(?!${text_separators}|${re.src_ZPCc})${re.src_Any})`;
		re.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
		re.src_auth = `(?:(?:(?!${re.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`;
		re.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
		re.src_host_terminator = `(?=$|${text_separators}|${re.src_ZPCc})(?!${opts["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${re.src_ZPCc}))`;
		re.src_path = `(?:[/?#](?:(?!${re.src_ZCc}|${text_separators}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${re.src_ZCc}|\\]).)*\\]|\\((?:(?!${re.src_ZCc}|[)]).)*\\)|\\{(?:(?!${re.src_ZCc}|[}]).)*\\}|\\"(?:(?!${re.src_ZCc}|["]).)+\\"|\\'(?:(?!${re.src_ZCc}|[']).)+\\'|\\'(?=${re.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${re.src_ZCc}|[.]|$)|` + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + `,(?!${re.src_ZCc}|$)|;(?!${re.src_ZCc}|$)|\\!+(?!${re.src_ZCc}|[!]|$)|\\?(?!${re.src_ZCc}|[?]|$))+|\\/)?`;
		re.src_email_name = "[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\\"\\.a-zA-Z0-9_]{0,63}";
		re.src_xn = "xn--[a-z0-9\\-]{1,59}";
		re.src_domain_root = "(?:" + re.src_xn + `|${re.src_pseudo_letter}{1,63})`;
		re.src_domain = "(?:" + re.src_xn + `|(?:${re.src_pseudo_letter})|(?:${re.src_pseudo_letter}(?:-|${re.src_pseudo_letter}){0,61}${re.src_pseudo_letter}))`;
		re.src_host = `(?:(?:(?:(?:${re.src_domain})\\.)*${re.src_domain}))`;
		re.tpl_host_fuzzy = "(?:" + re.src_ip4 + `|(?:(?:(?:${re.src_domain})\\.)+(?:%TLDS%)))`;
		re.tpl_host_no_ip_fuzzy = `(?:(?:(?:${re.src_domain})\\.)+(?:%TLDS%))`;
		re.src_host_strict = re.src_host + re.src_host_terminator;
		re.tpl_host_fuzzy_strict = re.tpl_host_fuzzy + re.src_host_terminator;
		re.src_host_port_strict = re.src_host + re.src_port + re.src_host_terminator;
		re.tpl_host_port_fuzzy_strict = re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;
		re.tpl_host_port_no_ip_fuzzy_strict = re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;
		re.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${re.src_ZPCc}|>|$))`;
		re.tpl_email_fuzzy = `(^|${text_separators}|"|\\(|${re.src_ZCc})(${re.src_email_name}@${re.tpl_host_fuzzy_strict})`;
		re.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${re.src_ZPCc}))((?![$+<=>^\`|\uff5c])${re.tpl_host_port_fuzzy_strict}${re.src_path})`;
		re.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${re.src_ZPCc}))((?![$+<=>^\`|\uff5c])${re.tpl_host_port_no_ip_fuzzy_strict}${re.src_path})`;
		return re;
	}
	function assign(obj) {
		Array.prototype.slice.call(arguments, 1).forEach(function(source) {
			if (!source) return;
			Object.keys(source).forEach(function(key) {
				obj[key] = source[key];
			});
		});
		return obj;
	}
	function _class(obj) {
		return Object.prototype.toString.call(obj);
	}
	function isString(obj) {
		return _class(obj) === "[object String]";
	}
	function isObject(obj) {
		return _class(obj) === "[object Object]";
	}
	function isRegExp(obj) {
		return _class(obj) === "[object RegExp]";
	}
	function isFunction(obj) {
		return _class(obj) === "[object Function]";
	}
	function escapeRE(str) {
		return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	}
	var defaultOptions = {
		fuzzyLink: true,
		fuzzyEmail: true,
		fuzzyIP: false
	};
	function isOptionsObj(obj) {
		return Object.keys(obj || {}).reduce(function(acc, k) {
			return acc || defaultOptions.hasOwnProperty(k);
		}, false);
	}
	var defaultSchemas = {
		"http:": { validate: function(text, pos, self) {
			const tail = text.slice(pos);
			if (!self.re.http) self.re.http = new RegExp(`^\\/\\/${self.re.src_auth}${self.re.src_host_port_strict}${self.re.src_path}`, "i");
			if (self.re.http.test(tail)) return tail.match(self.re.http)[0].length;
			return 0;
		} },
		"https:": "http:",
		"ftp:": "http:",
		"//": { validate: function(text, pos, self) {
			const tail = text.slice(pos);
			if (!self.re.no_http) self.re.no_http = new RegExp("^" + self.re.src_auth + `(?:localhost|(?:(?:${self.re.src_domain})\\.)+${self.re.src_domain_root})` + self.re.src_port + self.re.src_host_terminator + self.re.src_path, "i");
			if (self.re.no_http.test(tail)) {
				if (pos >= 3 && text[pos - 3] === ":") return 0;
				if (pos >= 3 && text[pos - 3] === "/") return 0;
				return tail.match(self.re.no_http)[0].length;
			}
			return 0;
		} },
		"mailto:": { validate: function(text, pos, self) {
			const tail = text.slice(pos);
			if (!self.re.mailto) self.re.mailto = new RegExp(`^${self.re.src_email_name}@${self.re.src_host_strict}`, "i");
			if (self.re.mailto.test(tail)) return tail.match(self.re.mailto)[0].length;
			return 0;
		} }
	};
	var tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
	var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
	function createValidator(re) {
		return function(text, pos) {
			const tail = text.slice(pos);
			if (re.test(tail)) return tail.match(re)[0].length;
			return 0;
		};
	}
	function createNormalizer() {
		return function(match, self) {
			self.normalize(match);
		};
	}
	function compile(self) {
		const re = self.re = re_default(self.__opts__);
		const tlds = self.__tlds__.slice();
		self.onCompile();
		if (!self.__tlds_replaced__) tlds.push(tlds_2ch_src_re);
		tlds.push(re.src_xn);
		re.src_tlds = tlds.join("|");
		function untpl(tpl) {
			return tpl.replace("%TLDS%", re.src_tlds);
		}
		re.email_fuzzy = RegExp(untpl(re.tpl_email_fuzzy), "i");
		re.email_fuzzy_global = RegExp(untpl(re.tpl_email_fuzzy), "ig");
		re.link_fuzzy = RegExp(untpl(re.tpl_link_fuzzy), "i");
		re.link_fuzzy_global = RegExp(untpl(re.tpl_link_fuzzy), "ig");
		re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "i");
		re.link_no_ip_fuzzy_global = RegExp(untpl(re.tpl_link_no_ip_fuzzy), "ig");
		re.host_fuzzy_test = RegExp(untpl(re.tpl_host_fuzzy_test), "i");
		const aliases = [];
		self.__compiled__ = {};
		function schemaError(name, val) {
			throw new Error(`(LinkifyIt) Invalid schema "${name}": ${val}`);
		}
		Object.keys(self.__schemas__).forEach(function(name) {
			const val = self.__schemas__[name];
			if (val === null) return;
			const compiled = {
				validate: null,
				link: null
			};
			self.__compiled__[name] = compiled;
			if (isObject(val)) {
				if (isRegExp(val.validate)) compiled.validate = createValidator(val.validate);
				else if (isFunction(val.validate)) compiled.validate = val.validate;
				else schemaError(name, val);
				if (isFunction(val.normalize)) compiled.normalize = val.normalize;
				else if (!val.normalize) compiled.normalize = createNormalizer();
				else schemaError(name, val);
				return;
			}
			if (isString(val)) {
				aliases.push(name);
				return;
			}
			schemaError(name, val);
		});
		aliases.forEach(function(alias) {
			if (!self.__compiled__[self.__schemas__[alias]]) return;
			self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
			self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
		});
		self.__compiled__[""] = {
			validate: null,
			normalize: createNormalizer()
		};
		const slist = Object.keys(self.__compiled__).filter(function(name) {
			return name.length > 0 && self.__compiled__[name];
		}).map(escapeRE).join("|");
		self.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${re.src_ZPCc}))(${slist})`, "i");
		self.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${re.src_ZPCc}))(${slist})`, "ig");
		self.re.schema_at_start = RegExp(`^${self.re.schema_search.source}`, "i");
		self.re.pretest = RegExp(`(${self.re.schema_test.source})|(${self.re.host_fuzzy_test.source})|@`, "i");
	}
	function Match(text, schema, index, lastIndex) {
		const raw = text.slice(index, lastIndex);
		this.schema = schema.toLowerCase();
		this.index = index;
		this.lastIndex = lastIndex;
		this.raw = raw;
		this.text = raw;
		this.url = raw;
	}
	function LinkifyIt(schemas, options) {
		if (!(this instanceof LinkifyIt)) return new LinkifyIt(schemas, options);
		if (!options) {
			if (isOptionsObj(schemas)) {
				options = schemas;
				schemas = {};
			}
		}
		this.__opts__ = assign({}, defaultOptions, options);
		this.__schemas__ = assign({}, defaultSchemas, schemas);
		this.__compiled__ = {};
		this.__tlds__ = tlds_default;
		this.__tlds_replaced__ = false;
		this.re = {};
		compile(this);
	}
	LinkifyIt.prototype.add = function add(schema, definition) {
		this.__schemas__[schema] = definition;
		compile(this);
		return this;
	};
	LinkifyIt.prototype.set = function set(options) {
		this.__opts__ = assign(this.__opts__, options);
		return this;
	};
	LinkifyIt.prototype.test = function test(text) {
		if (!text.length) return false;
		let m, re;
		if (this.re.schema_test.test(text)) {
			re = this.re.schema_search;
			re.lastIndex = 0;
			while ((m = re.exec(text)) !== null) if (this.testSchemaAt(text, m[2], re.lastIndex)) return true;
		}
		if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
			if (text.search(this.re.host_fuzzy_test) >= 0) {
				if (text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !== null) return true;
			}
		}
		if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
			if (text.indexOf("@") >= 0) {
				if (text.match(this.re.email_fuzzy) !== null) return true;
			}
		}
		return false;
	};
	LinkifyIt.prototype.pretest = function pretest(text) {
		return this.re.pretest.test(text);
	};
	LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
		if (!this.__compiled__[schema.toLowerCase()]) return 0;
		return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
	};
	LinkifyIt.prototype.match = function match(text) {
		const result = [];
		const type_schemed = [];
		const type_fuzzy_link = [];
		const type_fuzzy_email = [];
		let m, len, re;
		function choose(a, b) {
			if (!a) return b;
			if (!b) return a;
			if (a.index !== b.index) return a.index < b.index ? a : b;
			return a.lastIndex >= b.lastIndex ? a : b;
		}
		if (!text.length) return null;
		if (this.re.schema_test.test(text)) {
			re = this.re.schema_search;
			re.lastIndex = 0;
			while ((m = re.exec(text)) !== null) {
				len = this.testSchemaAt(text, m[2], re.lastIndex);
				if (len) type_schemed.push({
					schema: m[2],
					index: m.index + m[1].length,
					lastIndex: m.index + m[0].length + len
				});
			}
		}
		if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
			re = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global;
			re.lastIndex = 0;
			while ((m = re.exec(text)) !== null) type_fuzzy_link.push({
				schema: "",
				index: m.index + m[1].length,
				lastIndex: m.index + m[0].length
			});
		}
		if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
			re = this.re.email_fuzzy_global;
			re.lastIndex = 0;
			while ((m = re.exec(text)) !== null) type_fuzzy_email.push({
				schema: "mailto:",
				index: m.index + m[1].length,
				lastIndex: m.index + m[0].length
			});
		}
		const indexes = [
			0,
			0,
			0
		];
		let lastIndex = 0;
		for (;;) {
			const candidates = [
				type_schemed[indexes[0]],
				type_fuzzy_email[indexes[1]],
				type_fuzzy_link[indexes[2]]
			];
			const candidate = choose(choose(candidates[0], candidates[1]), candidates[2]);
			if (!candidate) break;
			if (candidate === candidates[0]) indexes[0]++;
			else if (candidate === candidates[1]) indexes[1]++;
			else indexes[2]++;
			if (candidate.index < lastIndex) continue;
			const match = new Match(text, candidate.schema, candidate.index, candidate.lastIndex);
			this.__compiled__[match.schema].normalize(match, this);
			result.push(match);
			lastIndex = candidate.lastIndex;
		}
		if (result.length) return result;
		return null;
	};
	LinkifyIt.prototype.matchAtStart = function matchAtStart(text) {
		if (!text.length) return null;
		const m = this.re.schema_at_start.exec(text);
		if (!m) return null;
		const len = this.testSchemaAt(text, m[2], m[0].length);
		if (!len) return null;
		const match = new Match(text, m[2], m.index + m[1].length, m.index + m[0].length + len);
		this.__compiled__[match.schema].normalize(match, this);
		return match;
	};
	LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
		list = Array.isArray(list) ? list : [list];
		if (!keepOld) {
			this.__tlds__ = list.slice();
			this.__tlds_replaced__ = true;
			compile(this);
			return this;
		}
		this.__tlds__ = this.__tlds__.concat(list).sort().filter(function(el, idx, arr) {
			return el !== arr[idx - 1];
		}).reverse();
		compile(this);
		return this;
	};
	LinkifyIt.prototype.normalize = function normalize(match) {
		if (!match.schema) match.url = `http://${match.url}`;
		if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) match.url = `mailto:${match.url}`;
	};
	LinkifyIt.prototype.onCompile = function onCompile() {};
	var maxInt = 2147483647;
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128;
	var delimiter = "-";
	var regexPunycode = /^xn--/;
	var regexNonASCII = /[^\0-\x7F]/;
	var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
	var errors = {
		"overflow": "Overflow: input needs wider integers to process",
		"not-basic": "Illegal input >= 0x80 (not a basic code point)",
		"invalid-input": "Invalid input"
	};
	var baseMinusTMin = 35;
	var floor = Math.floor;
	var stringFromCharCode = String.fromCharCode;
	function error(type) {
		throw new RangeError(errors[type]);
	}
	function map(array, callback) {
		const result = [];
		let length = array.length;
		while (length--) result[length] = callback(array[length]);
		return result;
	}
	function mapDomain(domain, callback) {
		const parts = domain.split("@");
		let result = "";
		if (parts.length > 1) {
			result = parts[0] + "@";
			domain = parts[1];
		}
		domain = domain.replace(regexSeparators, ".");
		const encoded = map(domain.split("."), callback).join(".");
		return result + encoded;
	}
	function ucs2decode(string) {
		const output = [];
		let counter = 0;
		const length = string.length;
		while (counter < length) {
			const value = string.charCodeAt(counter++);
			if (value >= 55296 && value <= 56319 && counter < length) {
				const extra = string.charCodeAt(counter++);
				if ((extra & 64512) == 56320) output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
				else {
					output.push(value);
					counter--;
				}
			} else output.push(value);
		}
		return output;
	}
	var ucs2encode = (codePoints) => String.fromCodePoint(...codePoints);
	var basicToDigit = function(codePoint) {
		if (codePoint >= 48 && codePoint < 58) return 26 + (codePoint - 48);
		if (codePoint >= 65 && codePoint < 91) return codePoint - 65;
		if (codePoint >= 97 && codePoint < 123) return codePoint - 97;
		return base;
	};
	var digitToBasic = function(digit, flag) {
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	};
	var adapt = function(delta, numPoints, firstTime) {
		let k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (; delta > 455; k += base) delta = floor(delta / baseMinusTMin);
		return floor(k + 36 * delta / (delta + skew));
	};
	var decode = function(input) {
		const output = [];
		const inputLength = input.length;
		let i = 0;
		let n = initialN;
		let bias = initialBias;
		let basic = input.lastIndexOf(delimiter);
		if (basic < 0) basic = 0;
		for (let j = 0; j < basic; ++j) {
			if (input.charCodeAt(j) >= 128) error("not-basic");
			output.push(input.charCodeAt(j));
		}
		for (let index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
			const oldi = i;
			for (let w = 1, k = base;; k += base) {
				if (index >= inputLength) error("invalid-input");
				const digit = basicToDigit(input.charCodeAt(index++));
				if (digit >= base) error("invalid-input");
				if (digit > floor((maxInt - i) / w)) error("overflow");
				i += digit * w;
				const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
				if (digit < t) break;
				const baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) error("overflow");
				w *= baseMinusT;
			}
			const out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);
			if (floor(i / out) > maxInt - n) error("overflow");
			n += floor(i / out);
			i %= out;
			output.splice(i++, 0, n);
		}
		return String.fromCodePoint(...output);
	};
	var encode = function(input) {
		const output = [];
		input = ucs2decode(input);
		const inputLength = input.length;
		let n = initialN;
		let delta = 0;
		let bias = initialBias;
		for (const currentValue of input) if (currentValue < 128) output.push(stringFromCharCode(currentValue));
		const basicLength = output.length;
		let handledCPCount = basicLength;
		if (basicLength) output.push(delimiter);
		while (handledCPCount < inputLength) {
			let m = maxInt;
			for (const currentValue of input) if (currentValue >= n && currentValue < m) m = currentValue;
			const handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) error("overflow");
			delta += (m - n) * handledCPCountPlusOne;
			n = m;
			for (const currentValue of input) {
				if (currentValue < n && ++delta > maxInt) error("overflow");
				if (currentValue === n) {
					let q = delta;
					for (let k = base;; k += base) {
						const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) break;
						const qMinusT = q - t;
						const baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor(qMinusT / baseMinusT);
					}
					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
					delta = 0;
					++handledCPCount;
				}
			}
			++delta;
			++n;
		}
		return output.join("");
	};
	var toUnicode = function(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
		});
	};
	var toASCII = function(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
		});
	};
	var punycode = {
		"version": "2.3.1",
		"ucs2": {
			"decode": ucs2decode,
			"encode": ucs2encode
		},
		"decode": decode,
		"encode": encode,
		"toASCII": toASCII,
		"toUnicode": toUnicode
	};
	var config = {
		default: {
			options: {
				html: false,
				xhtmlOut: false,
				breaks: false,
				langPrefix: "language-",
				linkify: false,
				typographer: false,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 100
			},
			components: {
				core: {},
				block: {},
				inline: {}
			}
		},
		zero: {
			options: {
				html: false,
				xhtmlOut: false,
				breaks: false,
				langPrefix: "language-",
				linkify: false,
				typographer: false,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 20
			},
			components: {
				core: { rules: [
					"normalize",
					"block",
					"inline",
					"text_join"
				] },
				block: { rules: ["paragraph"] },
				inline: {
					rules: ["text"],
					rules2: ["balance_pairs", "fragments_join"]
				}
			}
		},
		commonmark: {
			options: {
				html: true,
				xhtmlOut: true,
				breaks: false,
				langPrefix: "language-",
				linkify: false,
				typographer: false,
				quotes: "“”‘’",
				highlight: null,
				maxNesting: 20
			},
			components: {
				core: { rules: [
					"normalize",
					"block",
					"inline",
					"text_join"
				] },
				block: { rules: [
					"blockquote",
					"code",
					"fence",
					"heading",
					"hr",
					"html_block",
					"lheading",
					"list",
					"reference",
					"paragraph"
				] },
				inline: {
					rules: [
						"autolink",
						"backticks",
						"emphasis",
						"entity",
						"escape",
						"html_inline",
						"image",
						"link",
						"newline",
						"text"
					],
					rules2: [
						"balance_pairs",
						"emphasis",
						"fragments_join"
					]
				}
			}
		}
	};
	var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
	var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
	function validateLink(url) {
		const str = url.trim().toLowerCase();
		return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true;
	}
	var RECODE_HOSTNAME_FOR = [
		"http:",
		"https:",
		"mailto:"
	];
	function normalizeLink(url) {
		const parsed = urlParse(url, true);
		if (parsed.hostname) {
			if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
				parsed.hostname = punycode.toASCII(parsed.hostname);
			} catch (er) {}
		}
		return encode$1(format(parsed));
	}
	function normalizeLinkText(url) {
		const parsed = urlParse(url, true);
		if (parsed.hostname) {
			if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) try {
				parsed.hostname = punycode.toUnicode(parsed.hostname);
			} catch (er) {}
		}
		return decode$1(format(parsed), decode$1.defaultChars + "%");
	}
	function MarkdownIt(presetName, options) {
		if (!(this instanceof MarkdownIt)) return new MarkdownIt(presetName, options);
		if (!options) {
			if (!isString$1(presetName)) {
				options = presetName || {};
				presetName = "default";
			}
		}
		this.inline = new ParserInline();
		this.block = new ParserBlock();
		this.core = new Core();
		this.renderer = new Renderer();
		this.linkify = new LinkifyIt();
		this.validateLink = validateLink;
		this.normalizeLink = normalizeLink;
		this.normalizeLinkText = normalizeLinkText;
		this.utils = utils_exports;
		this.helpers = assign$1({}, helpers_exports);
		this.options = {};
		this.configure(presetName);
		if (options) this.set(options);
	}
	MarkdownIt.prototype.set = function(options) {
		assign$1(this.options, options);
		return this;
	};
	MarkdownIt.prototype.configure = function(presets) {
		const self = this;
		if (isString$1(presets)) {
			const presetName = presets;
			presets = config[presetName];
			if (!presets) throw new Error("Wrong `markdown-it` preset \"" + presetName + "\", check name");
		}
		if (!presets) throw new Error("Wrong `markdown-it` preset, can't be empty");
		if (presets.options) self.set(presets.options);
		if (presets.components) Object.keys(presets.components).forEach(function(name) {
			if (presets.components[name].rules) self[name].ruler.enableOnly(presets.components[name].rules);
			if (presets.components[name].rules2) self[name].ruler2.enableOnly(presets.components[name].rules2);
		});
		return this;
	};
	MarkdownIt.prototype.enable = function(list, ignoreInvalid) {
		let result = [];
		if (!Array.isArray(list)) list = [list];
		[
			"core",
			"block",
			"inline"
		].forEach(function(chain) {
			result = result.concat(this[chain].ruler.enable(list, true));
		}, this);
		result = result.concat(this.inline.ruler2.enable(list, true));
		const missed = list.filter(function(name) {
			return result.indexOf(name) < 0;
		});
		if (missed.length && !ignoreInvalid) throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
		return this;
	};
	MarkdownIt.prototype.disable = function(list, ignoreInvalid) {
		let result = [];
		if (!Array.isArray(list)) list = [list];
		[
			"core",
			"block",
			"inline"
		].forEach(function(chain) {
			result = result.concat(this[chain].ruler.disable(list, true));
		}, this);
		result = result.concat(this.inline.ruler2.disable(list, true));
		const missed = list.filter(function(name) {
			return result.indexOf(name) < 0;
		});
		if (missed.length && !ignoreInvalid) throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
		return this;
	};
	MarkdownIt.prototype.use = function(plugin) {
		const args = [this].concat(Array.prototype.slice.call(arguments, 1));
		plugin.apply(plugin, args);
		return this;
	};
	MarkdownIt.prototype.parse = function(src, env) {
		if (typeof src !== "string") throw new Error("Input data should be a String");
		const state = new this.core.State(src, this, env);
		this.core.process(state);
		return state.tokens;
	};
	MarkdownIt.prototype.render = function(src, env) {
		env = env || {};
		return this.renderer.render(this.parse(src, env), this.options, env);
	};
	MarkdownIt.prototype.parseInline = function(src, env) {
		const state = new this.core.State(src, this, env);
		state.inlineMode = true;
		this.core.process(state);
		return state.tokens;
	};
	MarkdownIt.prototype.renderInline = function(src, env) {
		env = env || {};
		return this.renderer.render(this.parseInline(src, env), this.options, env);
	};
	var ParseError = class ParseError extends Error {
		constructor(message, token) {
			var error = "KaTeX parse error: " + message;
			var start;
			var end;
			var loc = token && token.loc;
			if (loc && loc.start <= loc.end) {
				var input = loc.lexer.input;
				start = loc.start;
				end = loc.end;
				if (start === input.length) error += " at end of input: ";
				else error += " at position " + (start + 1) + ": ";
				var underlined = input.slice(start, end).replace(/[^]/g, "$&̲");
				var left;
				if (start > 15) left = "…" + input.slice(start - 15, start);
				else left = input.slice(0, start);
				var right;
				if (end + 15 < input.length) right = input.slice(end, end + 15) + "…";
				else right = input.slice(end);
				error += left + underlined + right;
			}
			super(error);
			this.name = "ParseError";
			this.position = void 0;
			this.length = void 0;
			this.rawMessage = void 0;
			Object.setPrototypeOf(this, ParseError.prototype);
			this.position = start;
			if (start != null && end != null) this.length = end - start;
			this.rawMessage = message;
		}
	};
	var uppercase = /([A-Z])/g;
	var hyphenate = (str) => str.replace(uppercase, "-$1").toLowerCase();
	var ESCAPE_LOOKUP = {
		"&": "&amp;",
		">": "&gt;",
		"<": "&lt;",
		"\"": "&quot;",
		"'": "&#x27;"
	};
	var ESCAPE_REGEX = /[&><"']/g;
	var escape = (text) => String(text).replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
	var getBaseElem = (group) => {
		if (group.type === "ordgroup") {
			if (group.body.length === 1) return getBaseElem(group.body[0]);
			else return group;
		} else if (group.type === "color") {
			if (group.body.length === 1) return getBaseElem(group.body[0]);
			else return group;
		} else if (group.type === "font") return getBaseElem(group.body);
		else return group;
	};
	var characterNodesTypes = new Set([
		"mathord",
		"textord",
		"atom"
	]);
	var isCharacterBox = (group) => characterNodesTypes.has(getBaseElem(group).type);
	var protocolFromUrl = (url) => {
		var protocol = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(url);
		if (!protocol) return "_relative";
		if (protocol[2] !== ":") return null;
		if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(protocol[1])) return null;
		return protocol[1].toLowerCase();
	};
	var SETTINGS_SCHEMA = {
		displayMode: {
			type: "boolean",
			description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
			cli: "-d, --display-mode"
		},
		output: {
			type: { enum: [
				"htmlAndMathml",
				"html",
				"mathml"
			] },
			description: "Determines the markup language of the output.",
			cli: "-F, --format <type>"
		},
		leqno: {
			type: "boolean",
			description: "Render display math in leqno style (left-justified tags)."
		},
		fleqn: {
			type: "boolean",
			description: "Render display math flush left."
		},
		throwOnError: {
			type: "boolean",
			default: true,
			cli: "-t, --no-throw-on-error",
			cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
		},
		errorColor: {
			type: "string",
			default: "#cc0000",
			cli: "-c, --error-color <color>",
			cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
			cliProcessor: (color) => "#" + color
		},
		macros: {
			type: "object",
			cli: "-m, --macro <def>",
			cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
			cliDefault: [],
			cliProcessor: (def, defs) => {
				defs.push(def);
				return defs;
			}
		},
		minRuleThickness: {
			type: "number",
			description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
			processor: (t) => Math.max(0, t),
			cli: "--min-rule-thickness <size>",
			cliProcessor: parseFloat
		},
		colorIsTextColor: {
			type: "boolean",
			description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
			cli: "-b, --color-is-text-color"
		},
		strict: {
			type: [
				{ enum: [
					"warn",
					"ignore",
					"error"
				] },
				"boolean",
				"function"
			],
			description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
			cli: "-S, --strict",
			cliDefault: false
		},
		trust: {
			type: ["boolean", "function"],
			description: "Trust the input, enabling all HTML features such as \\url.",
			cli: "-T, --trust"
		},
		maxSize: {
			type: "number",
			default: Infinity,
			description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
			processor: (s) => Math.max(0, s),
			cli: "-s, --max-size <n>",
			cliProcessor: parseInt
		},
		maxExpand: {
			type: "number",
			default: 1e3,
			description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
			processor: (n) => Math.max(0, n),
			cli: "-e, --max-expand <n>",
			cliProcessor: (n) => n === "Infinity" ? Infinity : parseInt(n)
		},
		globalGroup: {
			type: "boolean",
			cli: false
		}
	};
	function getImplicitDefault(type) {
		if (typeof type !== "string") return type.enum[0];
		switch (type) {
			case "boolean": return false;
			case "string": return "";
			case "number": return 0;
			case "object": return {};
			default: throw new Error("Unexpected schema type; settings must declare an explicit default.");
		}
	}
	function getDefaultValue(schema) {
		if (schema.default !== void 0) return schema.default;
		return getImplicitDefault(Array.isArray(schema.type) ? schema.type[0] : schema.type);
	}
	function applySetting(target, prop, options, schema) {
		var optionValue = options[prop];
		target[prop] = optionValue !== void 0 ? schema.processor ? schema.processor(optionValue) : optionValue : getDefaultValue(schema);
	}
	var Settings = class {
		constructor(options) {
			if (options === void 0) options = {};
			this.displayMode = void 0;
			this.output = void 0;
			this.leqno = void 0;
			this.fleqn = void 0;
			this.throwOnError = void 0;
			this.errorColor = void 0;
			this.macros = void 0;
			this.minRuleThickness = void 0;
			this.colorIsTextColor = void 0;
			this.strict = void 0;
			this.trust = void 0;
			this.maxSize = void 0;
			this.maxExpand = void 0;
			this.globalGroup = void 0;
			options = options || {};
			for (var prop of Object.keys(SETTINGS_SCHEMA)) {
				var schema = SETTINGS_SCHEMA[prop];
				if (schema) applySetting(this, prop, options, schema);
			}
		}
		reportNonstrict(errorCode, errorMsg, token) {
			var strict = this.strict;
			if (typeof strict === "function") strict = strict(errorCode, errorMsg, token);
			if (!strict || strict === "ignore") return;
			else if (strict === true || strict === "error") throw new ParseError("LaTeX-incompatible input and strict mode is set to 'error': " + (errorMsg + " [" + errorCode + "]"), token);
			else if (strict === "warn") typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
			else typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
		}
		useStrictBehavior(errorCode, errorMsg, token) {
			var strict = this.strict;
			if (typeof strict === "function") try {
				strict = strict(errorCode, errorMsg, token);
			} catch (error) {
				strict = "error";
			}
			if (!strict || strict === "ignore") return false;
			else if (strict === true || strict === "error") return true;
			else if (strict === "warn") {
				typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (errorMsg + " [" + errorCode + "]"));
				return false;
			} else {
				typeof console !== "undefined" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + strict + "': " + errorMsg + " [" + errorCode + "]"));
				return false;
			}
		}
		isTrusted(context) {
			if ("url" in context && context.url && !context.protocol) {
				var protocol = protocolFromUrl(context.url);
				if (protocol == null) return false;
				context.protocol = protocol;
			}
			var trust = typeof this.trust === "function" ? this.trust(context) : this.trust;
			return Boolean(trust);
		}
	};
	var Style = class {
		constructor(id, size, cramped) {
			this.id = void 0;
			this.size = void 0;
			this.cramped = void 0;
			this.id = id;
			this.size = size;
			this.cramped = cramped;
		}
		sup() {
			return styles[sup[this.id]];
		}
		sub() {
			return styles[sub[this.id]];
		}
		fracNum() {
			return styles[fracNum[this.id]];
		}
		fracDen() {
			return styles[fracDen[this.id]];
		}
		cramp() {
			return styles[cramp[this.id]];
		}
		text() {
			return styles[text$1[this.id]];
		}
		isTight() {
			return this.size >= 2;
		}
	};
	var D$1 = 0;
	var Dc = 1;
	var T$1 = 2;
	var Tc = 3;
	var S = 4;
	var Sc = 5;
	var SS = 6;
	var SSc = 7;
	var styles = [
		new Style(D$1, 0, false),
		new Style(Dc, 0, true),
		new Style(T$1, 1, false),
		new Style(Tc, 1, true),
		new Style(S, 2, false),
		new Style(Sc, 2, true),
		new Style(SS, 3, false),
		new Style(SSc, 3, true)
	];
	var sup = [
		S,
		Sc,
		S,
		Sc,
		SS,
		SSc,
		SS,
		SSc
	];
	var sub = [
		Sc,
		Sc,
		Sc,
		Sc,
		SSc,
		SSc,
		SSc,
		SSc
	];
	var fracNum = [
		T$1,
		Tc,
		S,
		Sc,
		SS,
		SSc,
		SS,
		SSc
	];
	var fracDen = [
		Tc,
		Tc,
		Sc,
		Sc,
		SSc,
		SSc,
		SSc,
		SSc
	];
	var cramp = [
		Dc,
		Dc,
		Tc,
		Tc,
		Sc,
		Sc,
		SSc,
		SSc
	];
	var text$1 = [
		D$1,
		Dc,
		T$1,
		Tc,
		T$1,
		Tc,
		T$1,
		Tc
	];
	var Style$1 = {
		DISPLAY: styles[D$1],
		TEXT: styles[T$1],
		SCRIPT: styles[S],
		SCRIPTSCRIPT: styles[SS]
	};
	var scriptData = [
		{
			name: "latin",
			blocks: [[256, 591], [768, 879]]
		},
		{
			name: "cyrillic",
			blocks: [[1024, 1279]]
		},
		{
			name: "armenian",
			blocks: [[1328, 1423]]
		},
		{
			name: "brahmic",
			blocks: [[2304, 4255]]
		},
		{
			name: "georgian",
			blocks: [[4256, 4351]]
		},
		{
			name: "cjk",
			blocks: [
				[12288, 12543],
				[19968, 40879],
				[65280, 65376]
			]
		},
		{
			name: "hangul",
			blocks: [[44032, 55215]]
		}
	];
	function scriptFromCodepoint(codepoint) {
		for (var i = 0; i < scriptData.length; i++) {
			var script = scriptData[i];
			for (var _i = 0; _i < script.blocks.length; _i++) {
				var block = script.blocks[_i];
				if (codepoint >= block[0] && codepoint <= block[1]) return script.name;
			}
		}
		return null;
	}
	var allBlocks = [];
	scriptData.forEach((s) => s.blocks.forEach((b) => allBlocks.push(...b)));
	function supportedCodepoint(codepoint) {
		for (var i = 0; i < allBlocks.length; i += 2) if (codepoint >= allBlocks[i] && codepoint <= allBlocks[i + 1]) return true;
		return false;
	}
	var doubleBrushStroke = (svgPath) => svgPath + " " + svgPath;
	var hLinePad = 80;
	var sqrtMain = function sqrtMain(extraVinculum, hLinePad) {
		return "M95," + (622 + extraVinculum + hLinePad) + "\nc-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14\nc0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54\nc44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10\ns173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429\nc69,-144,104.5,-217.7,106.5,-221\nl" + extraVinculum / 2.075 + " -" + extraVinculum + "\nc5.3,-9.3,12,-14,20,-14\nH400000v" + (40 + extraVinculum) + "H845.2724\ns-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7\nc-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z\nM" + (834 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "h-400000z";
	};
	var sqrtSize1 = function sqrtSize1(extraVinculum, hLinePad) {
		return "M263," + (601 + extraVinculum + hLinePad) + "c0.7,0,18,39.7,52,119\nc34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120\nc340,-704.7,510.7,-1060.3,512,-1067\nl" + extraVinculum / 2.084 + " -" + extraVinculum + "\nc4.7,-7.3,11,-11,19,-11\nH40000v" + (40 + extraVinculum) + "H1012.3\ns-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232\nc-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1\ns-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26\nc-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z\nM" + (1001 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "h-400000z";
	};
	var sqrtSize2 = function sqrtSize2(extraVinculum, hLinePad) {
		return "M983 " + (10 + extraVinculum + hLinePad) + "\nl" + extraVinculum / 3.13 + " -" + extraVinculum + "\nc4,-6.7,10,-10,18,-10 H400000v" + (40 + extraVinculum) + "\nH1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7\ns-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744\nc-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30\nc26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722\nc56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5\nc53.7,-170.3,84.5,-266.8,92.5,-289.5z\nM" + (1001 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "h-400000z";
	};
	var sqrtSize3 = function sqrtSize3(extraVinculum, hLinePad) {
		return "M424," + (2398 + extraVinculum + hLinePad) + "\nc-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514\nc0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20\ns-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121\ns209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081\nl" + extraVinculum / 4.223 + " -" + extraVinculum + "c4,-6.7,10,-10,18,-10 H400000\nv" + (40 + extraVinculum) + "H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185\nc-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M" + (1001 + extraVinculum) + " " + hLinePad + "\nh400000v" + (40 + extraVinculum) + "h-400000z";
	};
	var sqrtSize4 = function sqrtSize4(extraVinculum, hLinePad) {
		return "M473," + (2713 + extraVinculum + hLinePad) + "\nc339.3,-1799.3,509.3,-2700,510,-2702 l" + extraVinculum / 5.298 + " -" + extraVinculum + "\nc3.3,-7.3,9.3,-11,18,-11 H400000v" + (40 + extraVinculum) + "H1017.7\ns-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200\nc0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26\ns76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,\n606zM" + (1001 + extraVinculum) + " " + hLinePad + "h400000v" + (40 + extraVinculum) + "H1017.7z";
	};
	var phasePath = function phasePath(y) {
		var x = y / 2;
		return "M400000 " + y + " H0 L" + x + " 0 l65 45 L145 " + (y - 80) + " H400000z";
	};
	var sqrtTall = function sqrtTall(extraVinculum, hLinePad, viewBoxHeight) {
		var vertSegment = viewBoxHeight - 54 - hLinePad - extraVinculum;
		return "M702 " + (extraVinculum + hLinePad) + "H400000" + (40 + extraVinculum) + "\nH742v" + vertSegment + "l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1\nh-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170\nc-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667\n219 661 l218 661zM702 " + hLinePad + "H400000v" + (40 + extraVinculum) + "H742z";
	};
	var sqrtPath = function sqrtPath(size, extraVinculum, viewBoxHeight) {
		extraVinculum = 1e3 * extraVinculum;
		var path = "";
		switch (size) {
			case "sqrtMain":
				path = sqrtMain(extraVinculum, hLinePad);
				break;
			case "sqrtSize1":
				path = sqrtSize1(extraVinculum, hLinePad);
				break;
			case "sqrtSize2":
				path = sqrtSize2(extraVinculum, hLinePad);
				break;
			case "sqrtSize3":
				path = sqrtSize3(extraVinculum, hLinePad);
				break;
			case "sqrtSize4":
				path = sqrtSize4(extraVinculum, hLinePad);
				break;
			case "sqrtTall": path = sqrtTall(extraVinculum, hLinePad, viewBoxHeight);
		}
		return path;
	};
	var innerPath = function innerPath(name, height) {
		switch (name) {
			case "⎜": return doubleBrushStroke("M291 0 H417 V" + height + " H291z");
			case "∣": return doubleBrushStroke("M145 0 H188 V" + height + " H145z");
			case "∥": return doubleBrushStroke("M145 0 H188 V" + height + " H145z") + doubleBrushStroke("M367 0 H410 V" + height + " H367z");
			case "⎟": return doubleBrushStroke("M457 0 H583 V" + height + " H457z");
			case "⎢": return doubleBrushStroke("M319 0 H403 V" + height + " H319z");
			case "⎥": return doubleBrushStroke("M263 0 H347 V" + height + " H263z");
			case "⎪": return doubleBrushStroke("M384 0 H504 V" + height + " H384z");
			case "⏐": return doubleBrushStroke("M312 0 H355 V" + height + " H312z");
			case "‖": return doubleBrushStroke("M257 0 H300 V" + height + " H257z") + doubleBrushStroke("M478 0 H521 V" + height + " H478z");
			default: return "";
		}
	};
	var path = {
		doubleleftarrow: "M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",
		doublerightarrow: "M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",
		leftarrow: "M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",
		leftbrace: "M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",
		leftbraceunder: "M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",
		leftgroup: "M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",
		leftgroupunder: "M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",
		leftharpoon: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",
		leftharpoonplus: "M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",
		leftharpoondown: "M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",
		leftharpoondownplus: "M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",
		lefthook: "M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",
		leftlinesegment: doubleBrushStroke("M40 281 V428 H0 V94 H40 V241 H400000 v40z"),
		leftbracketunder: doubleBrushStroke("M0 0 h120 V290 H399995 v120 H0z"),
		leftbracketover: doubleBrushStroke("M0 440 h120 V150 H399995 v-120 H0z"),
		leftmapsto: doubleBrushStroke("M40 281 V448H0V74H40V241H400000v40z"),
		leftToFrom: "M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",
		longequal: doubleBrushStroke("M0 50 h400000 v40H0z m0 194h40000v40H0z"),
		midbrace: "M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",
		midbraceunder: "M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",
		oiintSize1: "M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z",
		oiintSize2: "M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z",
		oiiintSize1: "M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z",
		oiiintSize2: "M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z",
		rightarrow: "M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",
		rightbrace: "M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",
		rightbraceunder: "M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",
		rightgroup: "M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",
		rightgroupunder: "M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",
		rightharpoon: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",
		rightharpoonplus: "M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",
		rightharpoondown: "M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",
		rightharpoondownplus: "M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",
		righthook: "M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",
		rightlinesegment: doubleBrushStroke("M399960 241 V94 h40 V428 h-40 V281 H0 v-40z"),
		rightbracketunder: doubleBrushStroke("M399995 0 h-120 V290 H0 v120 H400000z"),
		rightbracketover: doubleBrushStroke("M399995 440 h-120 V150 H0 v-120 H399995z"),
		rightToFrom: "M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",
		twoheadleftarrow: "M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",
		twoheadrightarrow: "M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",
		tilde1: "M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",
		tilde2: "M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",
		tilde3: "M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",
		tilde4: "M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",
		vec: "M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z",
		widehat1: "M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",
		widehat2: "M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
		widehat3: "M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
		widehat4: "M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",
		widecheck1: "M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z",
		widecheck2: "M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
		widecheck3: "M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
		widecheck4: "M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",
		baraboveleftarrow: "M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z",
		rightarrowabovebar: "M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z",
		baraboveshortleftharpoon: "M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z",
		rightharpoonaboveshortbar: "M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z",
		shortbaraboveleftharpoon: "M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z",
		shortrightharpoonabovebar: "M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z"
	};
	var tallDelim = function tallDelim(label, midHeight) {
		switch (label) {
			case "lbrack": return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v1759 v84 h347 v-84\nH403z M403 1759 V0 H319 V1759 v" + midHeight + " v1759 v84 h84z";
			case "rbrack": return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v1759 H0 v84 H347z\nM347 1759 V0 H263 V1759 v" + midHeight + " v1759 h84z";
			case "vert": return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z";
			case "doublevert": return "M145 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M188 15 H145 v585 v" + midHeight + " v585 h43z\nM367 15 v585 v" + midHeight + " v585 c2.667,10,9.667,15,21,15\nc10,0,16.667,-5,20,-15 v-585 v" + -midHeight + " v-585 c-2.667,-10,-9.667,-15,-21,-15\nc-10,0,-16.667,5,-20,15z M410 15 H367 v585 v" + midHeight + " v585 h43z";
			case "lfloor": return "M319 602 V0 H403 V602 v" + midHeight + " v1715 h263 v84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
			case "rfloor": return "M319 602 V0 H403 V602 v" + midHeight + " v1799 H0 v-84 H319z\nMM319 602 V0 H403 V602 v" + midHeight + " v1715 H319z";
			case "lceil": return "M403 1759 V84 H666 V0 H319 V1759 v" + midHeight + " v602 h84z\nM403 1759 V0 H319 V1759 v" + midHeight + " v602 h84z";
			case "rceil": return "M347 1759 V0 H0 V84 H263 V1759 v" + midHeight + " v602 h84z\nM347 1759 V0 h-84 V1759 v" + midHeight + " v602 h84z";
			case "lparen": return "M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1\nc-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,\n-36,557 l0," + (midHeight + 84) + "c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,\n949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9\nc0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,\n-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189\nl0,-" + (midHeight + 92) + "c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,\n-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z";
			case "rparen": return "M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,\n63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5\nc11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0," + (midHeight + 9) + "\nc-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664\nc-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11\nc0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17\nc242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558\nl0,-" + (midHeight + 144) + "c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,\n-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z";
			default: throw new Error("Unknown stretchy delimiter.");
		}
	};
	function isMathDomNode(node) {
		return "toText" in node;
	}
	var DocumentFragment = class {
		constructor(children) {
			this.children = void 0;
			this.classes = void 0;
			this.height = void 0;
			this.depth = void 0;
			this.maxFontSize = void 0;
			this.style = void 0;
			this.children = children;
			this.classes = [];
			this.height = 0;
			this.depth = 0;
			this.maxFontSize = 0;
			this.style = {};
		}
		hasClass(className) {
			return this.classes.includes(className);
		}
		toNode() {
			var frag = document.createDocumentFragment();
			for (var i = 0; i < this.children.length; i++) frag.appendChild(this.children[i].toNode());
			return frag;
		}
		toMarkup() {
			var markup = "";
			for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
			return markup;
		}
		toText() {
			return this.children.map((child) => {
				if (isMathDomNode(child)) return child.toText();
				throw new Error("Expected MathDomNode with toText, got " + child.constructor.name);
			}).join("");
		}
	};
	var ptPerUnit = {
		"pt": 1,
		"mm": 7227 / 2540,
		"cm": 7227 / 254,
		"in": 72.27,
		"bp": 803 / 800,
		"pc": 12,
		"dd": 1238 / 1157,
		"cc": 14856 / 1157,
		"nd": 685 / 642,
		"nc": 1370 / 107,
		"sp": 1 / 65536,
		"px": 803 / 800
	};
	var relativeUnit = {
		"ex": true,
		"em": true,
		"mu": true
	};
	var validUnit = function validUnit(unit) {
		if (typeof unit !== "string") unit = unit.unit;
		return unit in ptPerUnit || unit in relativeUnit || unit === "ex";
	};
	var calculateSize = function calculateSize(sizeValue, options) {
		var scale;
		if (sizeValue.unit in ptPerUnit) scale = ptPerUnit[sizeValue.unit] / options.fontMetrics().ptPerEm / options.sizeMultiplier;
		else if (sizeValue.unit === "mu") scale = options.fontMetrics().cssEmPerMu;
		else {
			var unitOptions;
			if (options.style.isTight()) unitOptions = options.havingStyle(options.style.text());
			else unitOptions = options;
			if (sizeValue.unit === "ex") scale = unitOptions.fontMetrics().xHeight;
			else if (sizeValue.unit === "em") scale = unitOptions.fontMetrics().quad;
			else throw new ParseError("Invalid unit: '" + sizeValue.unit + "'");
			if (unitOptions !== options) scale *= unitOptions.sizeMultiplier / options.sizeMultiplier;
		}
		return Math.min(sizeValue.number * scale, options.maxSize);
	};
	var makeEm = function makeEm(n) {
		return +n.toFixed(4) + "em";
	};
	var createClass = function createClass(classes) {
		return classes.filter((cls) => cls).join(" ");
	};
	var cssStyleToString = function cssStyleToString(style) {
		var styles = "";
		for (var key of Object.keys(style)) {
			var value = style[key];
			if (value !== void 0) styles += hyphenate(key) + ":" + value + ";";
		}
		return styles;
	};
	var initNode = function initNode(classes, options, style) {
		this.classes = classes || [];
		this.attributes = {};
		this.height = 0;
		this.depth = 0;
		this.maxFontSize = 0;
		this.style = style || {};
		if (options) {
			if (options.style.isTight()) this.classes.push("mtight");
			var color = options.getColor();
			if (color) this.style.color = color;
		}
	};
	var toNode = function toNode(tagName) {
		var node = document.createElement(tagName);
		node.className = createClass(this.classes);
		Object.assign(node.style, this.style);
		for (var attr of Object.keys(this.attributes)) node.setAttribute(attr, this.attributes[attr]);
		for (var i = 0; i < this.children.length; i++) node.appendChild(this.children[i].toNode());
		return node;
	};
	var invalidAttributeNameRegex = /[\s"'>/=\x00-\x1f]/;
	var toMarkup = function toMarkup(tagName) {
		var markup = "<" + tagName;
		if (this.classes.length) markup += " class=\"" + escape(createClass(this.classes)) + "\"";
		var styles = cssStyleToString(this.style);
		if (styles) markup += " style=\"" + escape(styles) + "\"";
		for (var attr of Object.keys(this.attributes)) {
			if (invalidAttributeNameRegex.test(attr)) throw new ParseError("Invalid attribute name '" + attr + "'");
			markup += " " + attr + "=\"" + escape(this.attributes[attr]) + "\"";
		}
		markup += ">";
		for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
		markup += "</" + tagName + ">";
		return markup;
	};
	var Span = class {
		constructor(classes, children, options, style) {
			this.children = void 0;
			this.attributes = void 0;
			this.classes = void 0;
			this.height = void 0;
			this.depth = void 0;
			this.width = void 0;
			this.maxFontSize = void 0;
			this.style = void 0;
			this.italic = void 0;
			initNode.call(this, classes, options, style);
			this.children = children || [];
		}
		setAttribute(attribute, value) {
			this.attributes[attribute] = value;
		}
		hasClass(className) {
			return this.classes.includes(className);
		}
		toNode() {
			return toNode.call(this, "span");
		}
		toMarkup() {
			return toMarkup.call(this, "span");
		}
	};
	var Anchor = class {
		constructor(href, classes, children, options) {
			this.children = void 0;
			this.attributes = void 0;
			this.classes = void 0;
			this.height = void 0;
			this.depth = void 0;
			this.maxFontSize = void 0;
			this.style = void 0;
			initNode.call(this, classes, options);
			this.children = children || [];
			this.setAttribute("href", href);
		}
		setAttribute(attribute, value) {
			this.attributes[attribute] = value;
		}
		hasClass(className) {
			return this.classes.includes(className);
		}
		toNode() {
			return toNode.call(this, "a");
		}
		toMarkup() {
			return toMarkup.call(this, "a");
		}
	};
	var Img = class {
		constructor(src, alt, style) {
			this.src = void 0;
			this.alt = void 0;
			this.classes = void 0;
			this.height = void 0;
			this.depth = void 0;
			this.maxFontSize = void 0;
			this.style = void 0;
			this.alt = alt;
			this.src = src;
			this.classes = ["mord"];
			this.height = 0;
			this.depth = 0;
			this.maxFontSize = 0;
			this.style = style;
		}
		hasClass(className) {
			return this.classes.includes(className);
		}
		toNode() {
			var node = document.createElement("img");
			node.src = this.src;
			node.alt = this.alt;
			node.className = "mord";
			Object.assign(node.style, this.style);
			return node;
		}
		toMarkup() {
			var markup = "<img src=\"" + escape(this.src) + "\"" + (" alt=\"" + escape(this.alt) + "\"");
			var styles = cssStyleToString(this.style);
			if (styles) markup += " style=\"" + escape(styles) + "\"";
			markup += "'/>";
			return markup;
		}
	};
	var iCombinations = {
		"î": "ı̂",
		"ï": "ı̈",
		"í": "ı́",
		"ì": "ı̀"
	};
	var SymbolNode = class {
		constructor(text, height, depth, italic, skew, width, classes, style) {
			this.text = void 0;
			this.height = void 0;
			this.depth = void 0;
			this.italic = void 0;
			this.skew = void 0;
			this.width = void 0;
			this.maxFontSize = void 0;
			this.classes = void 0;
			this.style = void 0;
			this.text = text;
			this.height = height || 0;
			this.depth = depth || 0;
			this.italic = italic || 0;
			this.skew = skew || 0;
			this.width = width || 0;
			this.classes = classes || [];
			this.style = style || {};
			this.maxFontSize = 0;
			var script = scriptFromCodepoint(this.text.charCodeAt(0));
			if (script) this.classes.push(script + "_fallback");
			if (/[îïíì]/.test(this.text)) this.text = iCombinations[this.text];
		}
		hasClass(className) {
			return this.classes.includes(className);
		}
		toNode() {
			var node = document.createTextNode(this.text);
			var span = null;
			if (this.italic > 0) {
				span = document.createElement("span");
				span.style.marginRight = makeEm(this.italic);
			}
			if (this.classes.length > 0) {
				span = span || document.createElement("span");
				span.className = createClass(this.classes);
			}
			if (Object.keys(this.style).length > 0) {
				span = span || document.createElement("span");
				Object.assign(span.style, this.style);
			}
			if (span) {
				span.appendChild(node);
				return span;
			} else return node;
		}
		toMarkup() {
			var needsSpan = false;
			var markup = "<span";
			if (this.classes.length) {
				needsSpan = true;
				markup += " class=\"";
				markup += escape(createClass(this.classes));
				markup += "\"";
			}
			var styles = "";
			if (this.italic > 0) styles += "margin-right:" + makeEm(this.italic) + ";";
			styles += cssStyleToString(this.style);
			if (styles) {
				needsSpan = true;
				markup += " style=\"" + escape(styles) + "\"";
			}
			var escaped = escape(this.text);
			if (needsSpan) {
				markup += ">";
				markup += escaped;
				markup += "</span>";
				return markup;
			} else return escaped;
		}
	};
	var SvgNode = class {
		constructor(children, attributes) {
			this.children = void 0;
			this.attributes = void 0;
			this.children = children || [];
			this.attributes = attributes || {};
		}
		toNode() {
			var node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			for (var attr of Object.keys(this.attributes)) node.setAttribute(attr, this.attributes[attr]);
			for (var i = 0; i < this.children.length; i++) node.appendChild(this.children[i].toNode());
			return node;
		}
		toMarkup() {
			var markup = "<svg xmlns=\"http://www.w3.org/2000/svg\"";
			for (var attr of Object.keys(this.attributes)) markup += " " + attr + "=\"" + escape(this.attributes[attr]) + "\"";
			markup += ">";
			for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
			markup += "</svg>";
			return markup;
		}
	};
	var PathNode = class {
		constructor(pathName, alternate) {
			this.pathName = void 0;
			this.alternate = void 0;
			this.pathName = pathName;
			this.alternate = alternate;
		}
		toNode() {
			var node = document.createElementNS("http://www.w3.org/2000/svg", "path");
			if (this.alternate) node.setAttribute("d", this.alternate);
			else node.setAttribute("d", path[this.pathName]);
			return node;
		}
		toMarkup() {
			if (this.alternate) return "<path d=\"" + escape(this.alternate) + "\"/>";
			else return "<path d=\"" + escape(path[this.pathName]) + "\"/>";
		}
	};
	var LineNode = class {
		constructor(attributes) {
			this.attributes = void 0;
			this.attributes = attributes || {};
		}
		toNode() {
			var node = document.createElementNS("http://www.w3.org/2000/svg", "line");
			for (var attr of Object.keys(this.attributes)) node.setAttribute(attr, this.attributes[attr]);
			return node;
		}
		toMarkup() {
			var markup = "<line";
			for (var attr of Object.keys(this.attributes)) markup += " " + attr + "=\"" + escape(this.attributes[attr]) + "\"";
			markup += "/>";
			return markup;
		}
	};
	function assertSymbolDomNode(group) {
		if (group instanceof SymbolNode) return group;
		else throw new Error("Expected symbolNode but got " + String(group) + ".");
	}
	function assertSpan(group) {
		if (group instanceof Span) return group;
		else throw new Error("Expected span<HtmlDomNode> but got " + String(group) + ".");
	}
	var hasHtmlDomChildren = (node) => node instanceof Span || node instanceof Anchor || node instanceof DocumentFragment;
	var fontMetricsData = {
		"AMS-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"65": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"66": [
				0,
				.68889,
				0,
				0,
				.66667
			],
			"67": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"68": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"69": [
				0,
				.68889,
				0,
				0,
				.66667
			],
			"70": [
				0,
				.68889,
				0,
				0,
				.61111
			],
			"71": [
				0,
				.68889,
				0,
				0,
				.77778
			],
			"72": [
				0,
				.68889,
				0,
				0,
				.77778
			],
			"73": [
				0,
				.68889,
				0,
				0,
				.38889
			],
			"74": [
				.16667,
				.68889,
				0,
				0,
				.5
			],
			"75": [
				0,
				.68889,
				0,
				0,
				.77778
			],
			"76": [
				0,
				.68889,
				0,
				0,
				.66667
			],
			"77": [
				0,
				.68889,
				0,
				0,
				.94445
			],
			"78": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"79": [
				.16667,
				.68889,
				0,
				0,
				.77778
			],
			"80": [
				0,
				.68889,
				0,
				0,
				.61111
			],
			"81": [
				.16667,
				.68889,
				0,
				0,
				.77778
			],
			"82": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"83": [
				0,
				.68889,
				0,
				0,
				.55556
			],
			"84": [
				0,
				.68889,
				0,
				0,
				.66667
			],
			"85": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"86": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"87": [
				0,
				.68889,
				0,
				0,
				1
			],
			"88": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"89": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"90": [
				0,
				.68889,
				0,
				0,
				.66667
			],
			"107": [
				0,
				.68889,
				0,
				0,
				.55556
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"165": [
				0,
				.675,
				.025,
				0,
				.75
			],
			"174": [
				.15559,
				.69224,
				0,
				0,
				.94666
			],
			"240": [
				0,
				.68889,
				0,
				0,
				.55556
			],
			"295": [
				0,
				.68889,
				0,
				0,
				.54028
			],
			"710": [
				0,
				.825,
				0,
				0,
				2.33334
			],
			"732": [
				0,
				.9,
				0,
				0,
				2.33334
			],
			"770": [
				0,
				.825,
				0,
				0,
				2.33334
			],
			"771": [
				0,
				.9,
				0,
				0,
				2.33334
			],
			"989": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"1008": [
				0,
				.43056,
				.04028,
				0,
				.66667
			],
			"8245": [
				0,
				.54986,
				0,
				0,
				.275
			],
			"8463": [
				0,
				.68889,
				0,
				0,
				.54028
			],
			"8487": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"8498": [
				0,
				.68889,
				0,
				0,
				.55556
			],
			"8502": [
				0,
				.68889,
				0,
				0,
				.66667
			],
			"8503": [
				0,
				.68889,
				0,
				0,
				.44445
			],
			"8504": [
				0,
				.68889,
				0,
				0,
				.66667
			],
			"8513": [
				0,
				.68889,
				0,
				0,
				.63889
			],
			"8592": [
				-.03598,
				.46402,
				0,
				0,
				.5
			],
			"8594": [
				-.03598,
				.46402,
				0,
				0,
				.5
			],
			"8602": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8603": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8606": [
				.01354,
				.52239,
				0,
				0,
				1
			],
			"8608": [
				.01354,
				.52239,
				0,
				0,
				1
			],
			"8610": [
				.01354,
				.52239,
				0,
				0,
				1.11111
			],
			"8611": [
				.01354,
				.52239,
				0,
				0,
				1.11111
			],
			"8619": [
				0,
				.54986,
				0,
				0,
				1
			],
			"8620": [
				0,
				.54986,
				0,
				0,
				1
			],
			"8621": [
				-.13313,
				.37788,
				0,
				0,
				1.38889
			],
			"8622": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8624": [
				0,
				.69224,
				0,
				0,
				.5
			],
			"8625": [
				0,
				.69224,
				0,
				0,
				.5
			],
			"8630": [
				0,
				.43056,
				0,
				0,
				1
			],
			"8631": [
				0,
				.43056,
				0,
				0,
				1
			],
			"8634": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8635": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8638": [
				.19444,
				.69224,
				0,
				0,
				.41667
			],
			"8639": [
				.19444,
				.69224,
				0,
				0,
				.41667
			],
			"8642": [
				.19444,
				.69224,
				0,
				0,
				.41667
			],
			"8643": [
				.19444,
				.69224,
				0,
				0,
				.41667
			],
			"8644": [
				.1808,
				.675,
				0,
				0,
				1
			],
			"8646": [
				.1808,
				.675,
				0,
				0,
				1
			],
			"8647": [
				.1808,
				.675,
				0,
				0,
				1
			],
			"8648": [
				.19444,
				.69224,
				0,
				0,
				.83334
			],
			"8649": [
				.1808,
				.675,
				0,
				0,
				1
			],
			"8650": [
				.19444,
				.69224,
				0,
				0,
				.83334
			],
			"8651": [
				.01354,
				.52239,
				0,
				0,
				1
			],
			"8652": [
				.01354,
				.52239,
				0,
				0,
				1
			],
			"8653": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8654": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8655": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8666": [
				.13667,
				.63667,
				0,
				0,
				1
			],
			"8667": [
				.13667,
				.63667,
				0,
				0,
				1
			],
			"8669": [
				-.13313,
				.37788,
				0,
				0,
				1
			],
			"8672": [
				-.064,
				.437,
				0,
				0,
				1.334
			],
			"8674": [
				-.064,
				.437,
				0,
				0,
				1.334
			],
			"8705": [
				0,
				.825,
				0,
				0,
				.5
			],
			"8708": [
				0,
				.68889,
				0,
				0,
				.55556
			],
			"8709": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"8717": [
				0,
				.43056,
				0,
				0,
				.42917
			],
			"8722": [
				-.03598,
				.46402,
				0,
				0,
				.5
			],
			"8724": [
				.08198,
				.69224,
				0,
				0,
				.77778
			],
			"8726": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"8733": [
				0,
				.69224,
				0,
				0,
				.77778
			],
			"8736": [
				0,
				.69224,
				0,
				0,
				.72222
			],
			"8737": [
				0,
				.69224,
				0,
				0,
				.72222
			],
			"8738": [
				.03517,
				.52239,
				0,
				0,
				.72222
			],
			"8739": [
				.08167,
				.58167,
				0,
				0,
				.22222
			],
			"8740": [
				.25142,
				.74111,
				0,
				0,
				.27778
			],
			"8741": [
				.08167,
				.58167,
				0,
				0,
				.38889
			],
			"8742": [
				.25142,
				.74111,
				0,
				0,
				.5
			],
			"8756": [
				0,
				.69224,
				0,
				0,
				.66667
			],
			"8757": [
				0,
				.69224,
				0,
				0,
				.66667
			],
			"8764": [
				-.13313,
				.36687,
				0,
				0,
				.77778
			],
			"8765": [
				-.13313,
				.37788,
				0,
				0,
				.77778
			],
			"8769": [
				-.13313,
				.36687,
				0,
				0,
				.77778
			],
			"8770": [
				-.03625,
				.46375,
				0,
				0,
				.77778
			],
			"8774": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8776": [
				-.01688,
				.48312,
				0,
				0,
				.77778
			],
			"8778": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"8782": [
				.06062,
				.54986,
				0,
				0,
				.77778
			],
			"8783": [
				.06062,
				.54986,
				0,
				0,
				.77778
			],
			"8785": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8786": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8787": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8790": [
				0,
				.69224,
				0,
				0,
				.77778
			],
			"8791": [
				.22958,
				.72958,
				0,
				0,
				.77778
			],
			"8796": [
				.08198,
				.91667,
				0,
				0,
				.77778
			],
			"8806": [
				.25583,
				.75583,
				0,
				0,
				.77778
			],
			"8807": [
				.25583,
				.75583,
				0,
				0,
				.77778
			],
			"8808": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"8809": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"8812": [
				.25583,
				.75583,
				0,
				0,
				.5
			],
			"8814": [
				.20576,
				.70576,
				0,
				0,
				.77778
			],
			"8815": [
				.20576,
				.70576,
				0,
				0,
				.77778
			],
			"8816": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8817": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8818": [
				.22958,
				.72958,
				0,
				0,
				.77778
			],
			"8819": [
				.22958,
				.72958,
				0,
				0,
				.77778
			],
			"8822": [
				.1808,
				.675,
				0,
				0,
				.77778
			],
			"8823": [
				.1808,
				.675,
				0,
				0,
				.77778
			],
			"8828": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"8829": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"8830": [
				.22958,
				.72958,
				0,
				0,
				.77778
			],
			"8831": [
				.22958,
				.72958,
				0,
				0,
				.77778
			],
			"8832": [
				.20576,
				.70576,
				0,
				0,
				.77778
			],
			"8833": [
				.20576,
				.70576,
				0,
				0,
				.77778
			],
			"8840": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8841": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8842": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8843": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8847": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"8848": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"8858": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8859": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8861": [
				.08198,
				.58198,
				0,
				0,
				.77778
			],
			"8862": [
				0,
				.675,
				0,
				0,
				.77778
			],
			"8863": [
				0,
				.675,
				0,
				0,
				.77778
			],
			"8864": [
				0,
				.675,
				0,
				0,
				.77778
			],
			"8865": [
				0,
				.675,
				0,
				0,
				.77778
			],
			"8872": [
				0,
				.69224,
				0,
				0,
				.61111
			],
			"8873": [
				0,
				.69224,
				0,
				0,
				.72222
			],
			"8874": [
				0,
				.69224,
				0,
				0,
				.88889
			],
			"8876": [
				0,
				.68889,
				0,
				0,
				.61111
			],
			"8877": [
				0,
				.68889,
				0,
				0,
				.61111
			],
			"8878": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"8879": [
				0,
				.68889,
				0,
				0,
				.72222
			],
			"8882": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"8883": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"8884": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"8885": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"8888": [
				0,
				.54986,
				0,
				0,
				1.11111
			],
			"8890": [
				.19444,
				.43056,
				0,
				0,
				.55556
			],
			"8891": [
				.19444,
				.69224,
				0,
				0,
				.61111
			],
			"8892": [
				.19444,
				.69224,
				0,
				0,
				.61111
			],
			"8901": [
				0,
				.54986,
				0,
				0,
				.27778
			],
			"8903": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"8905": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"8906": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"8907": [
				0,
				.69224,
				0,
				0,
				.77778
			],
			"8908": [
				0,
				.69224,
				0,
				0,
				.77778
			],
			"8909": [
				-.03598,
				.46402,
				0,
				0,
				.77778
			],
			"8910": [
				0,
				.54986,
				0,
				0,
				.76042
			],
			"8911": [
				0,
				.54986,
				0,
				0,
				.76042
			],
			"8912": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"8913": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"8914": [
				0,
				.54986,
				0,
				0,
				.66667
			],
			"8915": [
				0,
				.54986,
				0,
				0,
				.66667
			],
			"8916": [
				0,
				.69224,
				0,
				0,
				.66667
			],
			"8918": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"8919": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"8920": [
				.03517,
				.54986,
				0,
				0,
				1.33334
			],
			"8921": [
				.03517,
				.54986,
				0,
				0,
				1.33334
			],
			"8922": [
				.38569,
				.88569,
				0,
				0,
				.77778
			],
			"8923": [
				.38569,
				.88569,
				0,
				0,
				.77778
			],
			"8926": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"8927": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"8928": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8929": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8934": [
				.23222,
				.74111,
				0,
				0,
				.77778
			],
			"8935": [
				.23222,
				.74111,
				0,
				0,
				.77778
			],
			"8936": [
				.23222,
				.74111,
				0,
				0,
				.77778
			],
			"8937": [
				.23222,
				.74111,
				0,
				0,
				.77778
			],
			"8938": [
				.20576,
				.70576,
				0,
				0,
				.77778
			],
			"8939": [
				.20576,
				.70576,
				0,
				0,
				.77778
			],
			"8940": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8941": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"8994": [
				.19444,
				.69224,
				0,
				0,
				.77778
			],
			"8995": [
				.19444,
				.69224,
				0,
				0,
				.77778
			],
			"9416": [
				.15559,
				.69224,
				0,
				0,
				.90222
			],
			"9484": [
				0,
				.69224,
				0,
				0,
				.5
			],
			"9488": [
				0,
				.69224,
				0,
				0,
				.5
			],
			"9492": [
				0,
				.37788,
				0,
				0,
				.5
			],
			"9496": [
				0,
				.37788,
				0,
				0,
				.5
			],
			"9585": [
				.19444,
				.68889,
				0,
				0,
				.88889
			],
			"9586": [
				.19444,
				.74111,
				0,
				0,
				.88889
			],
			"9632": [
				0,
				.675,
				0,
				0,
				.77778
			],
			"9633": [
				0,
				.675,
				0,
				0,
				.77778
			],
			"9650": [
				0,
				.54986,
				0,
				0,
				.72222
			],
			"9651": [
				0,
				.54986,
				0,
				0,
				.72222
			],
			"9654": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"9660": [
				0,
				.54986,
				0,
				0,
				.72222
			],
			"9661": [
				0,
				.54986,
				0,
				0,
				.72222
			],
			"9664": [
				.03517,
				.54986,
				0,
				0,
				.77778
			],
			"9674": [
				.11111,
				.69224,
				0,
				0,
				.66667
			],
			"9733": [
				.19444,
				.69224,
				0,
				0,
				.94445
			],
			"10003": [
				0,
				.69224,
				0,
				0,
				.83334
			],
			"10016": [
				0,
				.69224,
				0,
				0,
				.83334
			],
			"10731": [
				.11111,
				.69224,
				0,
				0,
				.66667
			],
			"10846": [
				.19444,
				.75583,
				0,
				0,
				.61111
			],
			"10877": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"10878": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"10885": [
				.25583,
				.75583,
				0,
				0,
				.77778
			],
			"10886": [
				.25583,
				.75583,
				0,
				0,
				.77778
			],
			"10887": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"10888": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"10889": [
				.26167,
				.75726,
				0,
				0,
				.77778
			],
			"10890": [
				.26167,
				.75726,
				0,
				0,
				.77778
			],
			"10891": [
				.48256,
				.98256,
				0,
				0,
				.77778
			],
			"10892": [
				.48256,
				.98256,
				0,
				0,
				.77778
			],
			"10901": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"10902": [
				.13667,
				.63667,
				0,
				0,
				.77778
			],
			"10933": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"10934": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"10935": [
				.26167,
				.75726,
				0,
				0,
				.77778
			],
			"10936": [
				.26167,
				.75726,
				0,
				0,
				.77778
			],
			"10937": [
				.26167,
				.75726,
				0,
				0,
				.77778
			],
			"10938": [
				.26167,
				.75726,
				0,
				0,
				.77778
			],
			"10949": [
				.25583,
				.75583,
				0,
				0,
				.77778
			],
			"10950": [
				.25583,
				.75583,
				0,
				0,
				.77778
			],
			"10955": [
				.28481,
				.79383,
				0,
				0,
				.77778
			],
			"10956": [
				.28481,
				.79383,
				0,
				0,
				.77778
			],
			"57350": [
				.08167,
				.58167,
				0,
				0,
				.22222
			],
			"57351": [
				.08167,
				.58167,
				0,
				0,
				.38889
			],
			"57352": [
				.08167,
				.58167,
				0,
				0,
				.77778
			],
			"57353": [
				0,
				.43056,
				.04028,
				0,
				.66667
			],
			"57356": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"57357": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"57358": [
				.41951,
				.91951,
				0,
				0,
				.77778
			],
			"57359": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"57360": [
				.30274,
				.79383,
				0,
				0,
				.77778
			],
			"57361": [
				.41951,
				.91951,
				0,
				0,
				.77778
			],
			"57366": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"57367": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"57368": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"57369": [
				.25142,
				.75726,
				0,
				0,
				.77778
			],
			"57370": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"57371": [
				.13597,
				.63597,
				0,
				0,
				.77778
			]
		},
		"Caligraphic-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"65": [
				0,
				.68333,
				0,
				.19445,
				.79847
			],
			"66": [
				0,
				.68333,
				.03041,
				.13889,
				.65681
			],
			"67": [
				0,
				.68333,
				.05834,
				.13889,
				.52653
			],
			"68": [
				0,
				.68333,
				.02778,
				.08334,
				.77139
			],
			"69": [
				0,
				.68333,
				.08944,
				.11111,
				.52778
			],
			"70": [
				0,
				.68333,
				.09931,
				.11111,
				.71875
			],
			"71": [
				.09722,
				.68333,
				.0593,
				.11111,
				.59487
			],
			"72": [
				0,
				.68333,
				.00965,
				.11111,
				.84452
			],
			"73": [
				0,
				.68333,
				.07382,
				0,
				.54452
			],
			"74": [
				.09722,
				.68333,
				.18472,
				.16667,
				.67778
			],
			"75": [
				0,
				.68333,
				.01445,
				.05556,
				.76195
			],
			"76": [
				0,
				.68333,
				0,
				.13889,
				.68972
			],
			"77": [
				0,
				.68333,
				0,
				.13889,
				1.2009
			],
			"78": [
				0,
				.68333,
				.14736,
				.08334,
				.82049
			],
			"79": [
				0,
				.68333,
				.02778,
				.11111,
				.79611
			],
			"80": [
				0,
				.68333,
				.08222,
				.08334,
				.69556
			],
			"81": [
				.09722,
				.68333,
				0,
				.11111,
				.81667
			],
			"82": [
				0,
				.68333,
				0,
				.08334,
				.8475
			],
			"83": [
				0,
				.68333,
				.075,
				.13889,
				.60556
			],
			"84": [
				0,
				.68333,
				.25417,
				0,
				.54464
			],
			"85": [
				0,
				.68333,
				.09931,
				.08334,
				.62583
			],
			"86": [
				0,
				.68333,
				.08222,
				0,
				.61278
			],
			"87": [
				0,
				.68333,
				.08222,
				.08334,
				.98778
			],
			"88": [
				0,
				.68333,
				.14643,
				.13889,
				.7133
			],
			"89": [
				.09722,
				.68333,
				.08222,
				.08334,
				.66834
			],
			"90": [
				0,
				.68333,
				.07944,
				.13889,
				.72473
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			]
		},
		"Fraktur-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69141,
				0,
				0,
				.29574
			],
			"34": [
				0,
				.69141,
				0,
				0,
				.21471
			],
			"38": [
				0,
				.69141,
				0,
				0,
				.73786
			],
			"39": [
				0,
				.69141,
				0,
				0,
				.21201
			],
			"40": [
				.24982,
				.74947,
				0,
				0,
				.38865
			],
			"41": [
				.24982,
				.74947,
				0,
				0,
				.38865
			],
			"42": [
				0,
				.62119,
				0,
				0,
				.27764
			],
			"43": [
				.08319,
				.58283,
				0,
				0,
				.75623
			],
			"44": [
				0,
				.10803,
				0,
				0,
				.27764
			],
			"45": [
				.08319,
				.58283,
				0,
				0,
				.75623
			],
			"46": [
				0,
				.10803,
				0,
				0,
				.27764
			],
			"47": [
				.24982,
				.74947,
				0,
				0,
				.50181
			],
			"48": [
				0,
				.47534,
				0,
				0,
				.50181
			],
			"49": [
				0,
				.47534,
				0,
				0,
				.50181
			],
			"50": [
				0,
				.47534,
				0,
				0,
				.50181
			],
			"51": [
				.18906,
				.47534,
				0,
				0,
				.50181
			],
			"52": [
				.18906,
				.47534,
				0,
				0,
				.50181
			],
			"53": [
				.18906,
				.47534,
				0,
				0,
				.50181
			],
			"54": [
				0,
				.69141,
				0,
				0,
				.50181
			],
			"55": [
				.18906,
				.47534,
				0,
				0,
				.50181
			],
			"56": [
				0,
				.69141,
				0,
				0,
				.50181
			],
			"57": [
				.18906,
				.47534,
				0,
				0,
				.50181
			],
			"58": [
				0,
				.47534,
				0,
				0,
				.21606
			],
			"59": [
				.12604,
				.47534,
				0,
				0,
				.21606
			],
			"61": [
				-.13099,
				.36866,
				0,
				0,
				.75623
			],
			"63": [
				0,
				.69141,
				0,
				0,
				.36245
			],
			"65": [
				0,
				.69141,
				0,
				0,
				.7176
			],
			"66": [
				0,
				.69141,
				0,
				0,
				.88397
			],
			"67": [
				0,
				.69141,
				0,
				0,
				.61254
			],
			"68": [
				0,
				.69141,
				0,
				0,
				.83158
			],
			"69": [
				0,
				.69141,
				0,
				0,
				.66278
			],
			"70": [
				.12604,
				.69141,
				0,
				0,
				.61119
			],
			"71": [
				0,
				.69141,
				0,
				0,
				.78539
			],
			"72": [
				.06302,
				.69141,
				0,
				0,
				.7203
			],
			"73": [
				0,
				.69141,
				0,
				0,
				.55448
			],
			"74": [
				.12604,
				.69141,
				0,
				0,
				.55231
			],
			"75": [
				0,
				.69141,
				0,
				0,
				.66845
			],
			"76": [
				0,
				.69141,
				0,
				0,
				.66602
			],
			"77": [
				0,
				.69141,
				0,
				0,
				1.04953
			],
			"78": [
				0,
				.69141,
				0,
				0,
				.83212
			],
			"79": [
				0,
				.69141,
				0,
				0,
				.82699
			],
			"80": [
				.18906,
				.69141,
				0,
				0,
				.82753
			],
			"81": [
				.03781,
				.69141,
				0,
				0,
				.82699
			],
			"82": [
				0,
				.69141,
				0,
				0,
				.82807
			],
			"83": [
				0,
				.69141,
				0,
				0,
				.82861
			],
			"84": [
				0,
				.69141,
				0,
				0,
				.66899
			],
			"85": [
				0,
				.69141,
				0,
				0,
				.64576
			],
			"86": [
				0,
				.69141,
				0,
				0,
				.83131
			],
			"87": [
				0,
				.69141,
				0,
				0,
				1.04602
			],
			"88": [
				0,
				.69141,
				0,
				0,
				.71922
			],
			"89": [
				.18906,
				.69141,
				0,
				0,
				.83293
			],
			"90": [
				.12604,
				.69141,
				0,
				0,
				.60201
			],
			"91": [
				.24982,
				.74947,
				0,
				0,
				.27764
			],
			"93": [
				.24982,
				.74947,
				0,
				0,
				.27764
			],
			"94": [
				0,
				.69141,
				0,
				0,
				.49965
			],
			"97": [
				0,
				.47534,
				0,
				0,
				.50046
			],
			"98": [
				0,
				.69141,
				0,
				0,
				.51315
			],
			"99": [
				0,
				.47534,
				0,
				0,
				.38946
			],
			"100": [
				0,
				.62119,
				0,
				0,
				.49857
			],
			"101": [
				0,
				.47534,
				0,
				0,
				.40053
			],
			"102": [
				.18906,
				.69141,
				0,
				0,
				.32626
			],
			"103": [
				.18906,
				.47534,
				0,
				0,
				.5037
			],
			"104": [
				.18906,
				.69141,
				0,
				0,
				.52126
			],
			"105": [
				0,
				.69141,
				0,
				0,
				.27899
			],
			"106": [
				0,
				.69141,
				0,
				0,
				.28088
			],
			"107": [
				0,
				.69141,
				0,
				0,
				.38946
			],
			"108": [
				0,
				.69141,
				0,
				0,
				.27953
			],
			"109": [
				0,
				.47534,
				0,
				0,
				.76676
			],
			"110": [
				0,
				.47534,
				0,
				0,
				.52666
			],
			"111": [
				0,
				.47534,
				0,
				0,
				.48885
			],
			"112": [
				.18906,
				.52396,
				0,
				0,
				.50046
			],
			"113": [
				.18906,
				.47534,
				0,
				0,
				.48912
			],
			"114": [
				0,
				.47534,
				0,
				0,
				.38919
			],
			"115": [
				0,
				.47534,
				0,
				0,
				.44266
			],
			"116": [
				0,
				.62119,
				0,
				0,
				.33301
			],
			"117": [
				0,
				.47534,
				0,
				0,
				.5172
			],
			"118": [
				0,
				.52396,
				0,
				0,
				.5118
			],
			"119": [
				0,
				.52396,
				0,
				0,
				.77351
			],
			"120": [
				.18906,
				.47534,
				0,
				0,
				.38865
			],
			"121": [
				.18906,
				.47534,
				0,
				0,
				.49884
			],
			"122": [
				.18906,
				.47534,
				0,
				0,
				.39054
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"8216": [
				0,
				.69141,
				0,
				0,
				.21471
			],
			"8217": [
				0,
				.69141,
				0,
				0,
				.21471
			],
			"58112": [
				0,
				.62119,
				0,
				0,
				.49749
			],
			"58113": [
				0,
				.62119,
				0,
				0,
				.4983
			],
			"58114": [
				.18906,
				.69141,
				0,
				0,
				.33328
			],
			"58115": [
				.18906,
				.69141,
				0,
				0,
				.32923
			],
			"58116": [
				.18906,
				.47534,
				0,
				0,
				.50343
			],
			"58117": [
				0,
				.69141,
				0,
				0,
				.33301
			],
			"58118": [
				0,
				.62119,
				0,
				0,
				.33409
			],
			"58119": [
				0,
				.47534,
				0,
				0,
				.50073
			]
		},
		"Main-Bold": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69444,
				0,
				0,
				.35
			],
			"34": [
				0,
				.69444,
				0,
				0,
				.60278
			],
			"35": [
				.19444,
				.69444,
				0,
				0,
				.95833
			],
			"36": [
				.05556,
				.75,
				0,
				0,
				.575
			],
			"37": [
				.05556,
				.75,
				0,
				0,
				.95833
			],
			"38": [
				0,
				.69444,
				0,
				0,
				.89444
			],
			"39": [
				0,
				.69444,
				0,
				0,
				.31944
			],
			"40": [
				.25,
				.75,
				0,
				0,
				.44722
			],
			"41": [
				.25,
				.75,
				0,
				0,
				.44722
			],
			"42": [
				0,
				.75,
				0,
				0,
				.575
			],
			"43": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"44": [
				.19444,
				.15556,
				0,
				0,
				.31944
			],
			"45": [
				0,
				.44444,
				0,
				0,
				.38333
			],
			"46": [
				0,
				.15556,
				0,
				0,
				.31944
			],
			"47": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"48": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"49": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"50": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"51": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"52": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"53": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"54": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"55": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"56": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"57": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"58": [
				0,
				.44444,
				0,
				0,
				.31944
			],
			"59": [
				.19444,
				.44444,
				0,
				0,
				.31944
			],
			"60": [
				.08556,
				.58556,
				0,
				0,
				.89444
			],
			"61": [
				-.10889,
				.39111,
				0,
				0,
				.89444
			],
			"62": [
				.08556,
				.58556,
				0,
				0,
				.89444
			],
			"63": [
				0,
				.69444,
				0,
				0,
				.54305
			],
			"64": [
				0,
				.69444,
				0,
				0,
				.89444
			],
			"65": [
				0,
				.68611,
				0,
				0,
				.86944
			],
			"66": [
				0,
				.68611,
				0,
				0,
				.81805
			],
			"67": [
				0,
				.68611,
				0,
				0,
				.83055
			],
			"68": [
				0,
				.68611,
				0,
				0,
				.88194
			],
			"69": [
				0,
				.68611,
				0,
				0,
				.75555
			],
			"70": [
				0,
				.68611,
				0,
				0,
				.72361
			],
			"71": [
				0,
				.68611,
				0,
				0,
				.90416
			],
			"72": [
				0,
				.68611,
				0,
				0,
				.9
			],
			"73": [
				0,
				.68611,
				0,
				0,
				.43611
			],
			"74": [
				0,
				.68611,
				0,
				0,
				.59444
			],
			"75": [
				0,
				.68611,
				0,
				0,
				.90138
			],
			"76": [
				0,
				.68611,
				0,
				0,
				.69166
			],
			"77": [
				0,
				.68611,
				0,
				0,
				1.09166
			],
			"78": [
				0,
				.68611,
				0,
				0,
				.9
			],
			"79": [
				0,
				.68611,
				0,
				0,
				.86388
			],
			"80": [
				0,
				.68611,
				0,
				0,
				.78611
			],
			"81": [
				.19444,
				.68611,
				0,
				0,
				.86388
			],
			"82": [
				0,
				.68611,
				0,
				0,
				.8625
			],
			"83": [
				0,
				.68611,
				0,
				0,
				.63889
			],
			"84": [
				0,
				.68611,
				0,
				0,
				.8
			],
			"85": [
				0,
				.68611,
				0,
				0,
				.88472
			],
			"86": [
				0,
				.68611,
				.01597,
				0,
				.86944
			],
			"87": [
				0,
				.68611,
				.01597,
				0,
				1.18888
			],
			"88": [
				0,
				.68611,
				0,
				0,
				.86944
			],
			"89": [
				0,
				.68611,
				.02875,
				0,
				.86944
			],
			"90": [
				0,
				.68611,
				0,
				0,
				.70277
			],
			"91": [
				.25,
				.75,
				0,
				0,
				.31944
			],
			"92": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"93": [
				.25,
				.75,
				0,
				0,
				.31944
			],
			"94": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"95": [
				.31,
				.13444,
				.03194,
				0,
				.575
			],
			"97": [
				0,
				.44444,
				0,
				0,
				.55902
			],
			"98": [
				0,
				.69444,
				0,
				0,
				.63889
			],
			"99": [
				0,
				.44444,
				0,
				0,
				.51111
			],
			"100": [
				0,
				.69444,
				0,
				0,
				.63889
			],
			"101": [
				0,
				.44444,
				0,
				0,
				.52708
			],
			"102": [
				0,
				.69444,
				.10903,
				0,
				.35139
			],
			"103": [
				.19444,
				.44444,
				.01597,
				0,
				.575
			],
			"104": [
				0,
				.69444,
				0,
				0,
				.63889
			],
			"105": [
				0,
				.69444,
				0,
				0,
				.31944
			],
			"106": [
				.19444,
				.69444,
				0,
				0,
				.35139
			],
			"107": [
				0,
				.69444,
				0,
				0,
				.60694
			],
			"108": [
				0,
				.69444,
				0,
				0,
				.31944
			],
			"109": [
				0,
				.44444,
				0,
				0,
				.95833
			],
			"110": [
				0,
				.44444,
				0,
				0,
				.63889
			],
			"111": [
				0,
				.44444,
				0,
				0,
				.575
			],
			"112": [
				.19444,
				.44444,
				0,
				0,
				.63889
			],
			"113": [
				.19444,
				.44444,
				0,
				0,
				.60694
			],
			"114": [
				0,
				.44444,
				0,
				0,
				.47361
			],
			"115": [
				0,
				.44444,
				0,
				0,
				.45361
			],
			"116": [
				0,
				.63492,
				0,
				0,
				.44722
			],
			"117": [
				0,
				.44444,
				0,
				0,
				.63889
			],
			"118": [
				0,
				.44444,
				.01597,
				0,
				.60694
			],
			"119": [
				0,
				.44444,
				.01597,
				0,
				.83055
			],
			"120": [
				0,
				.44444,
				0,
				0,
				.60694
			],
			"121": [
				.19444,
				.44444,
				.01597,
				0,
				.60694
			],
			"122": [
				0,
				.44444,
				0,
				0,
				.51111
			],
			"123": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"124": [
				.25,
				.75,
				0,
				0,
				.31944
			],
			"125": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"126": [
				.35,
				.34444,
				0,
				0,
				.575
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"163": [
				0,
				.69444,
				0,
				0,
				.86853
			],
			"168": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"172": [
				0,
				.44444,
				0,
				0,
				.76666
			],
			"176": [
				0,
				.69444,
				0,
				0,
				.86944
			],
			"177": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"184": [
				.17014,
				0,
				0,
				0,
				.51111
			],
			"198": [
				0,
				.68611,
				0,
				0,
				1.04166
			],
			"215": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"216": [
				.04861,
				.73472,
				0,
				0,
				.89444
			],
			"223": [
				0,
				.69444,
				0,
				0,
				.59722
			],
			"230": [
				0,
				.44444,
				0,
				0,
				.83055
			],
			"247": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"248": [
				.09722,
				.54167,
				0,
				0,
				.575
			],
			"305": [
				0,
				.44444,
				0,
				0,
				.31944
			],
			"338": [
				0,
				.68611,
				0,
				0,
				1.16944
			],
			"339": [
				0,
				.44444,
				0,
				0,
				.89444
			],
			"567": [
				.19444,
				.44444,
				0,
				0,
				.35139
			],
			"710": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"711": [
				0,
				.63194,
				0,
				0,
				.575
			],
			"713": [
				0,
				.59611,
				0,
				0,
				.575
			],
			"714": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"715": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"728": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"729": [
				0,
				.69444,
				0,
				0,
				.31944
			],
			"730": [
				0,
				.69444,
				0,
				0,
				.86944
			],
			"732": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"733": [
				0,
				.69444,
				0,
				0,
				.575
			],
			"915": [
				0,
				.68611,
				0,
				0,
				.69166
			],
			"916": [
				0,
				.68611,
				0,
				0,
				.95833
			],
			"920": [
				0,
				.68611,
				0,
				0,
				.89444
			],
			"923": [
				0,
				.68611,
				0,
				0,
				.80555
			],
			"926": [
				0,
				.68611,
				0,
				0,
				.76666
			],
			"928": [
				0,
				.68611,
				0,
				0,
				.9
			],
			"931": [
				0,
				.68611,
				0,
				0,
				.83055
			],
			"933": [
				0,
				.68611,
				0,
				0,
				.89444
			],
			"934": [
				0,
				.68611,
				0,
				0,
				.83055
			],
			"936": [
				0,
				.68611,
				0,
				0,
				.89444
			],
			"937": [
				0,
				.68611,
				0,
				0,
				.83055
			],
			"8211": [
				0,
				.44444,
				.03194,
				0,
				.575
			],
			"8212": [
				0,
				.44444,
				.03194,
				0,
				1.14999
			],
			"8216": [
				0,
				.69444,
				0,
				0,
				.31944
			],
			"8217": [
				0,
				.69444,
				0,
				0,
				.31944
			],
			"8220": [
				0,
				.69444,
				0,
				0,
				.60278
			],
			"8221": [
				0,
				.69444,
				0,
				0,
				.60278
			],
			"8224": [
				.19444,
				.69444,
				0,
				0,
				.51111
			],
			"8225": [
				.19444,
				.69444,
				0,
				0,
				.51111
			],
			"8242": [
				0,
				.55556,
				0,
				0,
				.34444
			],
			"8407": [
				0,
				.72444,
				.15486,
				0,
				.575
			],
			"8463": [
				0,
				.69444,
				0,
				0,
				.66759
			],
			"8465": [
				0,
				.69444,
				0,
				0,
				.83055
			],
			"8467": [
				0,
				.69444,
				0,
				0,
				.47361
			],
			"8472": [
				.19444,
				.44444,
				0,
				0,
				.74027
			],
			"8476": [
				0,
				.69444,
				0,
				0,
				.83055
			],
			"8501": [
				0,
				.69444,
				0,
				0,
				.70277
			],
			"8592": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8593": [
				.19444,
				.69444,
				0,
				0,
				.575
			],
			"8594": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8595": [
				.19444,
				.69444,
				0,
				0,
				.575
			],
			"8596": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8597": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"8598": [
				.19444,
				.69444,
				0,
				0,
				1.14999
			],
			"8599": [
				.19444,
				.69444,
				0,
				0,
				1.14999
			],
			"8600": [
				.19444,
				.69444,
				0,
				0,
				1.14999
			],
			"8601": [
				.19444,
				.69444,
				0,
				0,
				1.14999
			],
			"8636": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8637": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8640": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8641": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8656": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8657": [
				.19444,
				.69444,
				0,
				0,
				.70277
			],
			"8658": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8659": [
				.19444,
				.69444,
				0,
				0,
				.70277
			],
			"8660": [
				-.10889,
				.39111,
				0,
				0,
				1.14999
			],
			"8661": [
				.25,
				.75,
				0,
				0,
				.70277
			],
			"8704": [
				0,
				.69444,
				0,
				0,
				.63889
			],
			"8706": [
				0,
				.69444,
				.06389,
				0,
				.62847
			],
			"8707": [
				0,
				.69444,
				0,
				0,
				.63889
			],
			"8709": [
				.05556,
				.75,
				0,
				0,
				.575
			],
			"8711": [
				0,
				.68611,
				0,
				0,
				.95833
			],
			"8712": [
				.08556,
				.58556,
				0,
				0,
				.76666
			],
			"8715": [
				.08556,
				.58556,
				0,
				0,
				.76666
			],
			"8722": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"8723": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"8725": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"8726": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"8727": [
				-.02778,
				.47222,
				0,
				0,
				.575
			],
			"8728": [
				-.02639,
				.47361,
				0,
				0,
				.575
			],
			"8729": [
				-.02639,
				.47361,
				0,
				0,
				.575
			],
			"8730": [
				.18,
				.82,
				0,
				0,
				.95833
			],
			"8733": [
				0,
				.44444,
				0,
				0,
				.89444
			],
			"8734": [
				0,
				.44444,
				0,
				0,
				1.14999
			],
			"8736": [
				0,
				.69224,
				0,
				0,
				.72222
			],
			"8739": [
				.25,
				.75,
				0,
				0,
				.31944
			],
			"8741": [
				.25,
				.75,
				0,
				0,
				.575
			],
			"8743": [
				0,
				.55556,
				0,
				0,
				.76666
			],
			"8744": [
				0,
				.55556,
				0,
				0,
				.76666
			],
			"8745": [
				0,
				.55556,
				0,
				0,
				.76666
			],
			"8746": [
				0,
				.55556,
				0,
				0,
				.76666
			],
			"8747": [
				.19444,
				.69444,
				.12778,
				0,
				.56875
			],
			"8764": [
				-.10889,
				.39111,
				0,
				0,
				.89444
			],
			"8768": [
				.19444,
				.69444,
				0,
				0,
				.31944
			],
			"8771": [
				.00222,
				.50222,
				0,
				0,
				.89444
			],
			"8773": [
				.027,
				.638,
				0,
				0,
				.894
			],
			"8776": [
				.02444,
				.52444,
				0,
				0,
				.89444
			],
			"8781": [
				.00222,
				.50222,
				0,
				0,
				.89444
			],
			"8801": [
				.00222,
				.50222,
				0,
				0,
				.89444
			],
			"8804": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"8805": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"8810": [
				.08556,
				.58556,
				0,
				0,
				1.14999
			],
			"8811": [
				.08556,
				.58556,
				0,
				0,
				1.14999
			],
			"8826": [
				.08556,
				.58556,
				0,
				0,
				.89444
			],
			"8827": [
				.08556,
				.58556,
				0,
				0,
				.89444
			],
			"8834": [
				.08556,
				.58556,
				0,
				0,
				.89444
			],
			"8835": [
				.08556,
				.58556,
				0,
				0,
				.89444
			],
			"8838": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"8839": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"8846": [
				0,
				.55556,
				0,
				0,
				.76666
			],
			"8849": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"8850": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"8851": [
				0,
				.55556,
				0,
				0,
				.76666
			],
			"8852": [
				0,
				.55556,
				0,
				0,
				.76666
			],
			"8853": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"8854": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"8855": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"8856": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"8857": [
				.13333,
				.63333,
				0,
				0,
				.89444
			],
			"8866": [
				0,
				.69444,
				0,
				0,
				.70277
			],
			"8867": [
				0,
				.69444,
				0,
				0,
				.70277
			],
			"8868": [
				0,
				.69444,
				0,
				0,
				.89444
			],
			"8869": [
				0,
				.69444,
				0,
				0,
				.89444
			],
			"8900": [
				-.02639,
				.47361,
				0,
				0,
				.575
			],
			"8901": [
				-.02639,
				.47361,
				0,
				0,
				.31944
			],
			"8902": [
				-.02778,
				.47222,
				0,
				0,
				.575
			],
			"8968": [
				.25,
				.75,
				0,
				0,
				.51111
			],
			"8969": [
				.25,
				.75,
				0,
				0,
				.51111
			],
			"8970": [
				.25,
				.75,
				0,
				0,
				.51111
			],
			"8971": [
				.25,
				.75,
				0,
				0,
				.51111
			],
			"8994": [
				-.13889,
				.36111,
				0,
				0,
				1.14999
			],
			"8995": [
				-.13889,
				.36111,
				0,
				0,
				1.14999
			],
			"9651": [
				.19444,
				.69444,
				0,
				0,
				1.02222
			],
			"9657": [
				-.02778,
				.47222,
				0,
				0,
				.575
			],
			"9661": [
				.19444,
				.69444,
				0,
				0,
				1.02222
			],
			"9667": [
				-.02778,
				.47222,
				0,
				0,
				.575
			],
			"9711": [
				.19444,
				.69444,
				0,
				0,
				1.14999
			],
			"9824": [
				.12963,
				.69444,
				0,
				0,
				.89444
			],
			"9825": [
				.12963,
				.69444,
				0,
				0,
				.89444
			],
			"9826": [
				.12963,
				.69444,
				0,
				0,
				.89444
			],
			"9827": [
				.12963,
				.69444,
				0,
				0,
				.89444
			],
			"9837": [
				0,
				.75,
				0,
				0,
				.44722
			],
			"9838": [
				.19444,
				.69444,
				0,
				0,
				.44722
			],
			"9839": [
				.19444,
				.69444,
				0,
				0,
				.44722
			],
			"10216": [
				.25,
				.75,
				0,
				0,
				.44722
			],
			"10217": [
				.25,
				.75,
				0,
				0,
				.44722
			],
			"10815": [
				0,
				.68611,
				0,
				0,
				.9
			],
			"10927": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"10928": [
				.19667,
				.69667,
				0,
				0,
				.89444
			],
			"57376": [
				.19444,
				.69444,
				0,
				0,
				0
			]
		},
		"Main-BoldItalic": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69444,
				.11417,
				0,
				.38611
			],
			"34": [
				0,
				.69444,
				.07939,
				0,
				.62055
			],
			"35": [
				.19444,
				.69444,
				.06833,
				0,
				.94444
			],
			"37": [
				.05556,
				.75,
				.12861,
				0,
				.94444
			],
			"38": [
				0,
				.69444,
				.08528,
				0,
				.88555
			],
			"39": [
				0,
				.69444,
				.12945,
				0,
				.35555
			],
			"40": [
				.25,
				.75,
				.15806,
				0,
				.47333
			],
			"41": [
				.25,
				.75,
				.03306,
				0,
				.47333
			],
			"42": [
				0,
				.75,
				.14333,
				0,
				.59111
			],
			"43": [
				.10333,
				.60333,
				.03306,
				0,
				.88555
			],
			"44": [
				.19444,
				.14722,
				0,
				0,
				.35555
			],
			"45": [
				0,
				.44444,
				.02611,
				0,
				.41444
			],
			"46": [
				0,
				.14722,
				0,
				0,
				.35555
			],
			"47": [
				.25,
				.75,
				.15806,
				0,
				.59111
			],
			"48": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"49": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"50": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"51": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"52": [
				.19444,
				.64444,
				.13167,
				0,
				.59111
			],
			"53": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"54": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"55": [
				.19444,
				.64444,
				.13167,
				0,
				.59111
			],
			"56": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"57": [
				0,
				.64444,
				.13167,
				0,
				.59111
			],
			"58": [
				0,
				.44444,
				.06695,
				0,
				.35555
			],
			"59": [
				.19444,
				.44444,
				.06695,
				0,
				.35555
			],
			"61": [
				-.10889,
				.39111,
				.06833,
				0,
				.88555
			],
			"63": [
				0,
				.69444,
				.11472,
				0,
				.59111
			],
			"64": [
				0,
				.69444,
				.09208,
				0,
				.88555
			],
			"65": [
				0,
				.68611,
				0,
				0,
				.86555
			],
			"66": [
				0,
				.68611,
				.0992,
				0,
				.81666
			],
			"67": [
				0,
				.68611,
				.14208,
				0,
				.82666
			],
			"68": [
				0,
				.68611,
				.09062,
				0,
				.87555
			],
			"69": [
				0,
				.68611,
				.11431,
				0,
				.75666
			],
			"70": [
				0,
				.68611,
				.12903,
				0,
				.72722
			],
			"71": [
				0,
				.68611,
				.07347,
				0,
				.89527
			],
			"72": [
				0,
				.68611,
				.17208,
				0,
				.8961
			],
			"73": [
				0,
				.68611,
				.15681,
				0,
				.47166
			],
			"74": [
				0,
				.68611,
				.145,
				0,
				.61055
			],
			"75": [
				0,
				.68611,
				.14208,
				0,
				.89499
			],
			"76": [
				0,
				.68611,
				0,
				0,
				.69777
			],
			"77": [
				0,
				.68611,
				.17208,
				0,
				1.07277
			],
			"78": [
				0,
				.68611,
				.17208,
				0,
				.8961
			],
			"79": [
				0,
				.68611,
				.09062,
				0,
				.85499
			],
			"80": [
				0,
				.68611,
				.0992,
				0,
				.78721
			],
			"81": [
				.19444,
				.68611,
				.09062,
				0,
				.85499
			],
			"82": [
				0,
				.68611,
				.02559,
				0,
				.85944
			],
			"83": [
				0,
				.68611,
				.11264,
				0,
				.64999
			],
			"84": [
				0,
				.68611,
				.12903,
				0,
				.7961
			],
			"85": [
				0,
				.68611,
				.17208,
				0,
				.88083
			],
			"86": [
				0,
				.68611,
				.18625,
				0,
				.86555
			],
			"87": [
				0,
				.68611,
				.18625,
				0,
				1.15999
			],
			"88": [
				0,
				.68611,
				.15681,
				0,
				.86555
			],
			"89": [
				0,
				.68611,
				.19803,
				0,
				.86555
			],
			"90": [
				0,
				.68611,
				.14208,
				0,
				.70888
			],
			"91": [
				.25,
				.75,
				.1875,
				0,
				.35611
			],
			"93": [
				.25,
				.75,
				.09972,
				0,
				.35611
			],
			"94": [
				0,
				.69444,
				.06709,
				0,
				.59111
			],
			"95": [
				.31,
				.13444,
				.09811,
				0,
				.59111
			],
			"97": [
				0,
				.44444,
				.09426,
				0,
				.59111
			],
			"98": [
				0,
				.69444,
				.07861,
				0,
				.53222
			],
			"99": [
				0,
				.44444,
				.05222,
				0,
				.53222
			],
			"100": [
				0,
				.69444,
				.10861,
				0,
				.59111
			],
			"101": [
				0,
				.44444,
				.085,
				0,
				.53222
			],
			"102": [
				.19444,
				.69444,
				.21778,
				0,
				.4
			],
			"103": [
				.19444,
				.44444,
				.105,
				0,
				.53222
			],
			"104": [
				0,
				.69444,
				.09426,
				0,
				.59111
			],
			"105": [
				0,
				.69326,
				.11387,
				0,
				.35555
			],
			"106": [
				.19444,
				.69326,
				.1672,
				0,
				.35555
			],
			"107": [
				0,
				.69444,
				.11111,
				0,
				.53222
			],
			"108": [
				0,
				.69444,
				.10861,
				0,
				.29666
			],
			"109": [
				0,
				.44444,
				.09426,
				0,
				.94444
			],
			"110": [
				0,
				.44444,
				.09426,
				0,
				.64999
			],
			"111": [
				0,
				.44444,
				.07861,
				0,
				.59111
			],
			"112": [
				.19444,
				.44444,
				.07861,
				0,
				.59111
			],
			"113": [
				.19444,
				.44444,
				.105,
				0,
				.53222
			],
			"114": [
				0,
				.44444,
				.11111,
				0,
				.50167
			],
			"115": [
				0,
				.44444,
				.08167,
				0,
				.48694
			],
			"116": [
				0,
				.63492,
				.09639,
				0,
				.385
			],
			"117": [
				0,
				.44444,
				.09426,
				0,
				.62055
			],
			"118": [
				0,
				.44444,
				.11111,
				0,
				.53222
			],
			"119": [
				0,
				.44444,
				.11111,
				0,
				.76777
			],
			"120": [
				0,
				.44444,
				.12583,
				0,
				.56055
			],
			"121": [
				.19444,
				.44444,
				.105,
				0,
				.56166
			],
			"122": [
				0,
				.44444,
				.13889,
				0,
				.49055
			],
			"126": [
				.35,
				.34444,
				.11472,
				0,
				.59111
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"168": [
				0,
				.69444,
				.11473,
				0,
				.59111
			],
			"176": [
				0,
				.69444,
				0,
				0,
				.94888
			],
			"184": [
				.17014,
				0,
				0,
				0,
				.53222
			],
			"198": [
				0,
				.68611,
				.11431,
				0,
				1.02277
			],
			"216": [
				.04861,
				.73472,
				.09062,
				0,
				.88555
			],
			"223": [
				.19444,
				.69444,
				.09736,
				0,
				.665
			],
			"230": [
				0,
				.44444,
				.085,
				0,
				.82666
			],
			"248": [
				.09722,
				.54167,
				.09458,
				0,
				.59111
			],
			"305": [
				0,
				.44444,
				.09426,
				0,
				.35555
			],
			"338": [
				0,
				.68611,
				.11431,
				0,
				1.14054
			],
			"339": [
				0,
				.44444,
				.085,
				0,
				.82666
			],
			"567": [
				.19444,
				.44444,
				.04611,
				0,
				.385
			],
			"710": [
				0,
				.69444,
				.06709,
				0,
				.59111
			],
			"711": [
				0,
				.63194,
				.08271,
				0,
				.59111
			],
			"713": [
				0,
				.59444,
				.10444,
				0,
				.59111
			],
			"714": [
				0,
				.69444,
				.08528,
				0,
				.59111
			],
			"715": [
				0,
				.69444,
				0,
				0,
				.59111
			],
			"728": [
				0,
				.69444,
				.10333,
				0,
				.59111
			],
			"729": [
				0,
				.69444,
				.12945,
				0,
				.35555
			],
			"730": [
				0,
				.69444,
				0,
				0,
				.94888
			],
			"732": [
				0,
				.69444,
				.11472,
				0,
				.59111
			],
			"733": [
				0,
				.69444,
				.11472,
				0,
				.59111
			],
			"915": [
				0,
				.68611,
				.12903,
				0,
				.69777
			],
			"916": [
				0,
				.68611,
				0,
				0,
				.94444
			],
			"920": [
				0,
				.68611,
				.09062,
				0,
				.88555
			],
			"923": [
				0,
				.68611,
				0,
				0,
				.80666
			],
			"926": [
				0,
				.68611,
				.15092,
				0,
				.76777
			],
			"928": [
				0,
				.68611,
				.17208,
				0,
				.8961
			],
			"931": [
				0,
				.68611,
				.11431,
				0,
				.82666
			],
			"933": [
				0,
				.68611,
				.10778,
				0,
				.88555
			],
			"934": [
				0,
				.68611,
				.05632,
				0,
				.82666
			],
			"936": [
				0,
				.68611,
				.10778,
				0,
				.88555
			],
			"937": [
				0,
				.68611,
				.0992,
				0,
				.82666
			],
			"8211": [
				0,
				.44444,
				.09811,
				0,
				.59111
			],
			"8212": [
				0,
				.44444,
				.09811,
				0,
				1.18221
			],
			"8216": [
				0,
				.69444,
				.12945,
				0,
				.35555
			],
			"8217": [
				0,
				.69444,
				.12945,
				0,
				.35555
			],
			"8220": [
				0,
				.69444,
				.16772,
				0,
				.62055
			],
			"8221": [
				0,
				.69444,
				.07939,
				0,
				.62055
			]
		},
		"Main-Italic": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69444,
				.12417,
				0,
				.30667
			],
			"34": [
				0,
				.69444,
				.06961,
				0,
				.51444
			],
			"35": [
				.19444,
				.69444,
				.06616,
				0,
				.81777
			],
			"37": [
				.05556,
				.75,
				.13639,
				0,
				.81777
			],
			"38": [
				0,
				.69444,
				.09694,
				0,
				.76666
			],
			"39": [
				0,
				.69444,
				.12417,
				0,
				.30667
			],
			"40": [
				.25,
				.75,
				.16194,
				0,
				.40889
			],
			"41": [
				.25,
				.75,
				.03694,
				0,
				.40889
			],
			"42": [
				0,
				.75,
				.14917,
				0,
				.51111
			],
			"43": [
				.05667,
				.56167,
				.03694,
				0,
				.76666
			],
			"44": [
				.19444,
				.10556,
				0,
				0,
				.30667
			],
			"45": [
				0,
				.43056,
				.02826,
				0,
				.35778
			],
			"46": [
				0,
				.10556,
				0,
				0,
				.30667
			],
			"47": [
				.25,
				.75,
				.16194,
				0,
				.51111
			],
			"48": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"49": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"50": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"51": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"52": [
				.19444,
				.64444,
				.13556,
				0,
				.51111
			],
			"53": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"54": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"55": [
				.19444,
				.64444,
				.13556,
				0,
				.51111
			],
			"56": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"57": [
				0,
				.64444,
				.13556,
				0,
				.51111
			],
			"58": [
				0,
				.43056,
				.0582,
				0,
				.30667
			],
			"59": [
				.19444,
				.43056,
				.0582,
				0,
				.30667
			],
			"61": [
				-.13313,
				.36687,
				.06616,
				0,
				.76666
			],
			"63": [
				0,
				.69444,
				.1225,
				0,
				.51111
			],
			"64": [
				0,
				.69444,
				.09597,
				0,
				.76666
			],
			"65": [
				0,
				.68333,
				0,
				0,
				.74333
			],
			"66": [
				0,
				.68333,
				.10257,
				0,
				.70389
			],
			"67": [
				0,
				.68333,
				.14528,
				0,
				.71555
			],
			"68": [
				0,
				.68333,
				.09403,
				0,
				.755
			],
			"69": [
				0,
				.68333,
				.12028,
				0,
				.67833
			],
			"70": [
				0,
				.68333,
				.13305,
				0,
				.65277
			],
			"71": [
				0,
				.68333,
				.08722,
				0,
				.77361
			],
			"72": [
				0,
				.68333,
				.16389,
				0,
				.74333
			],
			"73": [
				0,
				.68333,
				.15806,
				0,
				.38555
			],
			"74": [
				0,
				.68333,
				.14028,
				0,
				.525
			],
			"75": [
				0,
				.68333,
				.14528,
				0,
				.76888
			],
			"76": [
				0,
				.68333,
				0,
				0,
				.62722
			],
			"77": [
				0,
				.68333,
				.16389,
				0,
				.89666
			],
			"78": [
				0,
				.68333,
				.16389,
				0,
				.74333
			],
			"79": [
				0,
				.68333,
				.09403,
				0,
				.76666
			],
			"80": [
				0,
				.68333,
				.10257,
				0,
				.67833
			],
			"81": [
				.19444,
				.68333,
				.09403,
				0,
				.76666
			],
			"82": [
				0,
				.68333,
				.03868,
				0,
				.72944
			],
			"83": [
				0,
				.68333,
				.11972,
				0,
				.56222
			],
			"84": [
				0,
				.68333,
				.13305,
				0,
				.71555
			],
			"85": [
				0,
				.68333,
				.16389,
				0,
				.74333
			],
			"86": [
				0,
				.68333,
				.18361,
				0,
				.74333
			],
			"87": [
				0,
				.68333,
				.18361,
				0,
				.99888
			],
			"88": [
				0,
				.68333,
				.15806,
				0,
				.74333
			],
			"89": [
				0,
				.68333,
				.19383,
				0,
				.74333
			],
			"90": [
				0,
				.68333,
				.14528,
				0,
				.61333
			],
			"91": [
				.25,
				.75,
				.1875,
				0,
				.30667
			],
			"93": [
				.25,
				.75,
				.10528,
				0,
				.30667
			],
			"94": [
				0,
				.69444,
				.06646,
				0,
				.51111
			],
			"95": [
				.31,
				.12056,
				.09208,
				0,
				.51111
			],
			"97": [
				0,
				.43056,
				.07671,
				0,
				.51111
			],
			"98": [
				0,
				.69444,
				.06312,
				0,
				.46
			],
			"99": [
				0,
				.43056,
				.05653,
				0,
				.46
			],
			"100": [
				0,
				.69444,
				.10333,
				0,
				.51111
			],
			"101": [
				0,
				.43056,
				.07514,
				0,
				.46
			],
			"102": [
				.19444,
				.69444,
				.21194,
				0,
				.30667
			],
			"103": [
				.19444,
				.43056,
				.08847,
				0,
				.46
			],
			"104": [
				0,
				.69444,
				.07671,
				0,
				.51111
			],
			"105": [
				0,
				.65536,
				.1019,
				0,
				.30667
			],
			"106": [
				.19444,
				.65536,
				.14467,
				0,
				.30667
			],
			"107": [
				0,
				.69444,
				.10764,
				0,
				.46
			],
			"108": [
				0,
				.69444,
				.10333,
				0,
				.25555
			],
			"109": [
				0,
				.43056,
				.07671,
				0,
				.81777
			],
			"110": [
				0,
				.43056,
				.07671,
				0,
				.56222
			],
			"111": [
				0,
				.43056,
				.06312,
				0,
				.51111
			],
			"112": [
				.19444,
				.43056,
				.06312,
				0,
				.51111
			],
			"113": [
				.19444,
				.43056,
				.08847,
				0,
				.46
			],
			"114": [
				0,
				.43056,
				.10764,
				0,
				.42166
			],
			"115": [
				0,
				.43056,
				.08208,
				0,
				.40889
			],
			"116": [
				0,
				.61508,
				.09486,
				0,
				.33222
			],
			"117": [
				0,
				.43056,
				.07671,
				0,
				.53666
			],
			"118": [
				0,
				.43056,
				.10764,
				0,
				.46
			],
			"119": [
				0,
				.43056,
				.10764,
				0,
				.66444
			],
			"120": [
				0,
				.43056,
				.12042,
				0,
				.46389
			],
			"121": [
				.19444,
				.43056,
				.08847,
				0,
				.48555
			],
			"122": [
				0,
				.43056,
				.12292,
				0,
				.40889
			],
			"126": [
				.35,
				.31786,
				.11585,
				0,
				.51111
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"168": [
				0,
				.66786,
				.10474,
				0,
				.51111
			],
			"176": [
				0,
				.69444,
				0,
				0,
				.83129
			],
			"184": [
				.17014,
				0,
				0,
				0,
				.46
			],
			"198": [
				0,
				.68333,
				.12028,
				0,
				.88277
			],
			"216": [
				.04861,
				.73194,
				.09403,
				0,
				.76666
			],
			"223": [
				.19444,
				.69444,
				.10514,
				0,
				.53666
			],
			"230": [
				0,
				.43056,
				.07514,
				0,
				.71555
			],
			"248": [
				.09722,
				.52778,
				.09194,
				0,
				.51111
			],
			"338": [
				0,
				.68333,
				.12028,
				0,
				.98499
			],
			"339": [
				0,
				.43056,
				.07514,
				0,
				.71555
			],
			"710": [
				0,
				.69444,
				.06646,
				0,
				.51111
			],
			"711": [
				0,
				.62847,
				.08295,
				0,
				.51111
			],
			"713": [
				0,
				.56167,
				.10333,
				0,
				.51111
			],
			"714": [
				0,
				.69444,
				.09694,
				0,
				.51111
			],
			"715": [
				0,
				.69444,
				0,
				0,
				.51111
			],
			"728": [
				0,
				.69444,
				.10806,
				0,
				.51111
			],
			"729": [
				0,
				.66786,
				.11752,
				0,
				.30667
			],
			"730": [
				0,
				.69444,
				0,
				0,
				.83129
			],
			"732": [
				0,
				.66786,
				.11585,
				0,
				.51111
			],
			"733": [
				0,
				.69444,
				.1225,
				0,
				.51111
			],
			"915": [
				0,
				.68333,
				.13305,
				0,
				.62722
			],
			"916": [
				0,
				.68333,
				0,
				0,
				.81777
			],
			"920": [
				0,
				.68333,
				.09403,
				0,
				.76666
			],
			"923": [
				0,
				.68333,
				0,
				0,
				.69222
			],
			"926": [
				0,
				.68333,
				.15294,
				0,
				.66444
			],
			"928": [
				0,
				.68333,
				.16389,
				0,
				.74333
			],
			"931": [
				0,
				.68333,
				.12028,
				0,
				.71555
			],
			"933": [
				0,
				.68333,
				.11111,
				0,
				.76666
			],
			"934": [
				0,
				.68333,
				.05986,
				0,
				.71555
			],
			"936": [
				0,
				.68333,
				.11111,
				0,
				.76666
			],
			"937": [
				0,
				.68333,
				.10257,
				0,
				.71555
			],
			"8211": [
				0,
				.43056,
				.09208,
				0,
				.51111
			],
			"8212": [
				0,
				.43056,
				.09208,
				0,
				1.02222
			],
			"8216": [
				0,
				.69444,
				.12417,
				0,
				.30667
			],
			"8217": [
				0,
				.69444,
				.12417,
				0,
				.30667
			],
			"8220": [
				0,
				.69444,
				.1685,
				0,
				.51444
			],
			"8221": [
				0,
				.69444,
				.06961,
				0,
				.51444
			],
			"8463": [
				0,
				.68889,
				0,
				0,
				.54028
			]
		},
		"Main-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"34": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"35": [
				.19444,
				.69444,
				0,
				0,
				.83334
			],
			"36": [
				.05556,
				.75,
				0,
				0,
				.5
			],
			"37": [
				.05556,
				.75,
				0,
				0,
				.83334
			],
			"38": [
				0,
				.69444,
				0,
				0,
				.77778
			],
			"39": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"40": [
				.25,
				.75,
				0,
				0,
				.38889
			],
			"41": [
				.25,
				.75,
				0,
				0,
				.38889
			],
			"42": [
				0,
				.75,
				0,
				0,
				.5
			],
			"43": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"44": [
				.19444,
				.10556,
				0,
				0,
				.27778
			],
			"45": [
				0,
				.43056,
				0,
				0,
				.33333
			],
			"46": [
				0,
				.10556,
				0,
				0,
				.27778
			],
			"47": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"48": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"49": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"50": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"51": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"52": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"53": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"54": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"55": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"56": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"57": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"58": [
				0,
				.43056,
				0,
				0,
				.27778
			],
			"59": [
				.19444,
				.43056,
				0,
				0,
				.27778
			],
			"60": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"61": [
				-.13313,
				.36687,
				0,
				0,
				.77778
			],
			"62": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"63": [
				0,
				.69444,
				0,
				0,
				.47222
			],
			"64": [
				0,
				.69444,
				0,
				0,
				.77778
			],
			"65": [
				0,
				.68333,
				0,
				0,
				.75
			],
			"66": [
				0,
				.68333,
				0,
				0,
				.70834
			],
			"67": [
				0,
				.68333,
				0,
				0,
				.72222
			],
			"68": [
				0,
				.68333,
				0,
				0,
				.76389
			],
			"69": [
				0,
				.68333,
				0,
				0,
				.68056
			],
			"70": [
				0,
				.68333,
				0,
				0,
				.65278
			],
			"71": [
				0,
				.68333,
				0,
				0,
				.78472
			],
			"72": [
				0,
				.68333,
				0,
				0,
				.75
			],
			"73": [
				0,
				.68333,
				0,
				0,
				.36111
			],
			"74": [
				0,
				.68333,
				0,
				0,
				.51389
			],
			"75": [
				0,
				.68333,
				0,
				0,
				.77778
			],
			"76": [
				0,
				.68333,
				0,
				0,
				.625
			],
			"77": [
				0,
				.68333,
				0,
				0,
				.91667
			],
			"78": [
				0,
				.68333,
				0,
				0,
				.75
			],
			"79": [
				0,
				.68333,
				0,
				0,
				.77778
			],
			"80": [
				0,
				.68333,
				0,
				0,
				.68056
			],
			"81": [
				.19444,
				.68333,
				0,
				0,
				.77778
			],
			"82": [
				0,
				.68333,
				0,
				0,
				.73611
			],
			"83": [
				0,
				.68333,
				0,
				0,
				.55556
			],
			"84": [
				0,
				.68333,
				0,
				0,
				.72222
			],
			"85": [
				0,
				.68333,
				0,
				0,
				.75
			],
			"86": [
				0,
				.68333,
				.01389,
				0,
				.75
			],
			"87": [
				0,
				.68333,
				.01389,
				0,
				1.02778
			],
			"88": [
				0,
				.68333,
				0,
				0,
				.75
			],
			"89": [
				0,
				.68333,
				.025,
				0,
				.75
			],
			"90": [
				0,
				.68333,
				0,
				0,
				.61111
			],
			"91": [
				.25,
				.75,
				0,
				0,
				.27778
			],
			"92": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"93": [
				.25,
				.75,
				0,
				0,
				.27778
			],
			"94": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"95": [
				.31,
				.12056,
				.02778,
				0,
				.5
			],
			"97": [
				0,
				.43056,
				0,
				0,
				.5
			],
			"98": [
				0,
				.69444,
				0,
				0,
				.55556
			],
			"99": [
				0,
				.43056,
				0,
				0,
				.44445
			],
			"100": [
				0,
				.69444,
				0,
				0,
				.55556
			],
			"101": [
				0,
				.43056,
				0,
				0,
				.44445
			],
			"102": [
				0,
				.69444,
				.07778,
				0,
				.30556
			],
			"103": [
				.19444,
				.43056,
				.01389,
				0,
				.5
			],
			"104": [
				0,
				.69444,
				0,
				0,
				.55556
			],
			"105": [
				0,
				.66786,
				0,
				0,
				.27778
			],
			"106": [
				.19444,
				.66786,
				0,
				0,
				.30556
			],
			"107": [
				0,
				.69444,
				0,
				0,
				.52778
			],
			"108": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"109": [
				0,
				.43056,
				0,
				0,
				.83334
			],
			"110": [
				0,
				.43056,
				0,
				0,
				.55556
			],
			"111": [
				0,
				.43056,
				0,
				0,
				.5
			],
			"112": [
				.19444,
				.43056,
				0,
				0,
				.55556
			],
			"113": [
				.19444,
				.43056,
				0,
				0,
				.52778
			],
			"114": [
				0,
				.43056,
				0,
				0,
				.39167
			],
			"115": [
				0,
				.43056,
				0,
				0,
				.39445
			],
			"116": [
				0,
				.61508,
				0,
				0,
				.38889
			],
			"117": [
				0,
				.43056,
				0,
				0,
				.55556
			],
			"118": [
				0,
				.43056,
				.01389,
				0,
				.52778
			],
			"119": [
				0,
				.43056,
				.01389,
				0,
				.72222
			],
			"120": [
				0,
				.43056,
				0,
				0,
				.52778
			],
			"121": [
				.19444,
				.43056,
				.01389,
				0,
				.52778
			],
			"122": [
				0,
				.43056,
				0,
				0,
				.44445
			],
			"123": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"124": [
				.25,
				.75,
				0,
				0,
				.27778
			],
			"125": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"126": [
				.35,
				.31786,
				0,
				0,
				.5
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"163": [
				0,
				.69444,
				0,
				0,
				.76909
			],
			"167": [
				.19444,
				.69444,
				0,
				0,
				.44445
			],
			"168": [
				0,
				.66786,
				0,
				0,
				.5
			],
			"172": [
				0,
				.43056,
				0,
				0,
				.66667
			],
			"176": [
				0,
				.69444,
				0,
				0,
				.75
			],
			"177": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"182": [
				.19444,
				.69444,
				0,
				0,
				.61111
			],
			"184": [
				.17014,
				0,
				0,
				0,
				.44445
			],
			"198": [
				0,
				.68333,
				0,
				0,
				.90278
			],
			"215": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"216": [
				.04861,
				.73194,
				0,
				0,
				.77778
			],
			"223": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"230": [
				0,
				.43056,
				0,
				0,
				.72222
			],
			"247": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"248": [
				.09722,
				.52778,
				0,
				0,
				.5
			],
			"305": [
				0,
				.43056,
				0,
				0,
				.27778
			],
			"338": [
				0,
				.68333,
				0,
				0,
				1.01389
			],
			"339": [
				0,
				.43056,
				0,
				0,
				.77778
			],
			"567": [
				.19444,
				.43056,
				0,
				0,
				.30556
			],
			"710": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"711": [
				0,
				.62847,
				0,
				0,
				.5
			],
			"713": [
				0,
				.56778,
				0,
				0,
				.5
			],
			"714": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"715": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"728": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"729": [
				0,
				.66786,
				0,
				0,
				.27778
			],
			"730": [
				0,
				.69444,
				0,
				0,
				.75
			],
			"732": [
				0,
				.66786,
				0,
				0,
				.5
			],
			"733": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"915": [
				0,
				.68333,
				0,
				0,
				.625
			],
			"916": [
				0,
				.68333,
				0,
				0,
				.83334
			],
			"920": [
				0,
				.68333,
				0,
				0,
				.77778
			],
			"923": [
				0,
				.68333,
				0,
				0,
				.69445
			],
			"926": [
				0,
				.68333,
				0,
				0,
				.66667
			],
			"928": [
				0,
				.68333,
				0,
				0,
				.75
			],
			"931": [
				0,
				.68333,
				0,
				0,
				.72222
			],
			"933": [
				0,
				.68333,
				0,
				0,
				.77778
			],
			"934": [
				0,
				.68333,
				0,
				0,
				.72222
			],
			"936": [
				0,
				.68333,
				0,
				0,
				.77778
			],
			"937": [
				0,
				.68333,
				0,
				0,
				.72222
			],
			"8211": [
				0,
				.43056,
				.02778,
				0,
				.5
			],
			"8212": [
				0,
				.43056,
				.02778,
				0,
				1
			],
			"8216": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"8217": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"8220": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"8221": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"8224": [
				.19444,
				.69444,
				0,
				0,
				.44445
			],
			"8225": [
				.19444,
				.69444,
				0,
				0,
				.44445
			],
			"8230": [
				0,
				.123,
				0,
				0,
				1.172
			],
			"8242": [
				0,
				.55556,
				0,
				0,
				.275
			],
			"8407": [
				0,
				.71444,
				.15382,
				0,
				.5
			],
			"8463": [
				0,
				.68889,
				0,
				0,
				.54028
			],
			"8465": [
				0,
				.69444,
				0,
				0,
				.72222
			],
			"8467": [
				0,
				.69444,
				0,
				.11111,
				.41667
			],
			"8472": [
				.19444,
				.43056,
				0,
				.11111,
				.63646
			],
			"8476": [
				0,
				.69444,
				0,
				0,
				.72222
			],
			"8501": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"8592": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8593": [
				.19444,
				.69444,
				0,
				0,
				.5
			],
			"8594": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8595": [
				.19444,
				.69444,
				0,
				0,
				.5
			],
			"8596": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8597": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"8598": [
				.19444,
				.69444,
				0,
				0,
				1
			],
			"8599": [
				.19444,
				.69444,
				0,
				0,
				1
			],
			"8600": [
				.19444,
				.69444,
				0,
				0,
				1
			],
			"8601": [
				.19444,
				.69444,
				0,
				0,
				1
			],
			"8614": [
				.011,
				.511,
				0,
				0,
				1
			],
			"8617": [
				.011,
				.511,
				0,
				0,
				1.126
			],
			"8618": [
				.011,
				.511,
				0,
				0,
				1.126
			],
			"8636": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8637": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8640": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8641": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8652": [
				.011,
				.671,
				0,
				0,
				1
			],
			"8656": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8657": [
				.19444,
				.69444,
				0,
				0,
				.61111
			],
			"8658": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8659": [
				.19444,
				.69444,
				0,
				0,
				.61111
			],
			"8660": [
				-.13313,
				.36687,
				0,
				0,
				1
			],
			"8661": [
				.25,
				.75,
				0,
				0,
				.61111
			],
			"8704": [
				0,
				.69444,
				0,
				0,
				.55556
			],
			"8706": [
				0,
				.69444,
				.05556,
				.08334,
				.5309
			],
			"8707": [
				0,
				.69444,
				0,
				0,
				.55556
			],
			"8709": [
				.05556,
				.75,
				0,
				0,
				.5
			],
			"8711": [
				0,
				.68333,
				0,
				0,
				.83334
			],
			"8712": [
				.0391,
				.5391,
				0,
				0,
				.66667
			],
			"8715": [
				.0391,
				.5391,
				0,
				0,
				.66667
			],
			"8722": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"8723": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"8725": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"8726": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"8727": [
				-.03472,
				.46528,
				0,
				0,
				.5
			],
			"8728": [
				-.05555,
				.44445,
				0,
				0,
				.5
			],
			"8729": [
				-.05555,
				.44445,
				0,
				0,
				.5
			],
			"8730": [
				.2,
				.8,
				0,
				0,
				.83334
			],
			"8733": [
				0,
				.43056,
				0,
				0,
				.77778
			],
			"8734": [
				0,
				.43056,
				0,
				0,
				1
			],
			"8736": [
				0,
				.69224,
				0,
				0,
				.72222
			],
			"8739": [
				.25,
				.75,
				0,
				0,
				.27778
			],
			"8741": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"8743": [
				0,
				.55556,
				0,
				0,
				.66667
			],
			"8744": [
				0,
				.55556,
				0,
				0,
				.66667
			],
			"8745": [
				0,
				.55556,
				0,
				0,
				.66667
			],
			"8746": [
				0,
				.55556,
				0,
				0,
				.66667
			],
			"8747": [
				.19444,
				.69444,
				.11111,
				0,
				.41667
			],
			"8764": [
				-.13313,
				.36687,
				0,
				0,
				.77778
			],
			"8768": [
				.19444,
				.69444,
				0,
				0,
				.27778
			],
			"8771": [
				-.03625,
				.46375,
				0,
				0,
				.77778
			],
			"8773": [
				-.022,
				.589,
				0,
				0,
				.778
			],
			"8776": [
				-.01688,
				.48312,
				0,
				0,
				.77778
			],
			"8781": [
				-.03625,
				.46375,
				0,
				0,
				.77778
			],
			"8784": [
				-.133,
				.673,
				0,
				0,
				.778
			],
			"8801": [
				-.03625,
				.46375,
				0,
				0,
				.77778
			],
			"8804": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8805": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8810": [
				.0391,
				.5391,
				0,
				0,
				1
			],
			"8811": [
				.0391,
				.5391,
				0,
				0,
				1
			],
			"8826": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"8827": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"8834": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"8835": [
				.0391,
				.5391,
				0,
				0,
				.77778
			],
			"8838": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8839": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8846": [
				0,
				.55556,
				0,
				0,
				.66667
			],
			"8849": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8850": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"8851": [
				0,
				.55556,
				0,
				0,
				.66667
			],
			"8852": [
				0,
				.55556,
				0,
				0,
				.66667
			],
			"8853": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"8854": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"8855": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"8856": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"8857": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"8866": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"8867": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"8868": [
				0,
				.69444,
				0,
				0,
				.77778
			],
			"8869": [
				0,
				.69444,
				0,
				0,
				.77778
			],
			"8872": [
				.249,
				.75,
				0,
				0,
				.867
			],
			"8900": [
				-.05555,
				.44445,
				0,
				0,
				.5
			],
			"8901": [
				-.05555,
				.44445,
				0,
				0,
				.27778
			],
			"8902": [
				-.03472,
				.46528,
				0,
				0,
				.5
			],
			"8904": [
				.005,
				.505,
				0,
				0,
				.9
			],
			"8942": [
				.03,
				.903,
				0,
				0,
				.278
			],
			"8943": [
				-.19,
				.313,
				0,
				0,
				1.172
			],
			"8945": [
				-.1,
				.823,
				0,
				0,
				1.282
			],
			"8968": [
				.25,
				.75,
				0,
				0,
				.44445
			],
			"8969": [
				.25,
				.75,
				0,
				0,
				.44445
			],
			"8970": [
				.25,
				.75,
				0,
				0,
				.44445
			],
			"8971": [
				.25,
				.75,
				0,
				0,
				.44445
			],
			"8994": [
				-.14236,
				.35764,
				0,
				0,
				1
			],
			"8995": [
				-.14236,
				.35764,
				0,
				0,
				1
			],
			"9136": [
				.244,
				.744,
				0,
				0,
				.412
			],
			"9137": [
				.244,
				.745,
				0,
				0,
				.412
			],
			"9651": [
				.19444,
				.69444,
				0,
				0,
				.88889
			],
			"9657": [
				-.03472,
				.46528,
				0,
				0,
				.5
			],
			"9661": [
				.19444,
				.69444,
				0,
				0,
				.88889
			],
			"9667": [
				-.03472,
				.46528,
				0,
				0,
				.5
			],
			"9711": [
				.19444,
				.69444,
				0,
				0,
				1
			],
			"9824": [
				.12963,
				.69444,
				0,
				0,
				.77778
			],
			"9825": [
				.12963,
				.69444,
				0,
				0,
				.77778
			],
			"9826": [
				.12963,
				.69444,
				0,
				0,
				.77778
			],
			"9827": [
				.12963,
				.69444,
				0,
				0,
				.77778
			],
			"9837": [
				0,
				.75,
				0,
				0,
				.38889
			],
			"9838": [
				.19444,
				.69444,
				0,
				0,
				.38889
			],
			"9839": [
				.19444,
				.69444,
				0,
				0,
				.38889
			],
			"10216": [
				.25,
				.75,
				0,
				0,
				.38889
			],
			"10217": [
				.25,
				.75,
				0,
				0,
				.38889
			],
			"10222": [
				.244,
				.744,
				0,
				0,
				.412
			],
			"10223": [
				.244,
				.745,
				0,
				0,
				.412
			],
			"10229": [
				.011,
				.511,
				0,
				0,
				1.609
			],
			"10230": [
				.011,
				.511,
				0,
				0,
				1.638
			],
			"10231": [
				.011,
				.511,
				0,
				0,
				1.859
			],
			"10232": [
				.024,
				.525,
				0,
				0,
				1.609
			],
			"10233": [
				.024,
				.525,
				0,
				0,
				1.638
			],
			"10234": [
				.024,
				.525,
				0,
				0,
				1.858
			],
			"10236": [
				.011,
				.511,
				0,
				0,
				1.638
			],
			"10815": [
				0,
				.68333,
				0,
				0,
				.75
			],
			"10927": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"10928": [
				.13597,
				.63597,
				0,
				0,
				.77778
			],
			"57376": [
				.19444,
				.69444,
				0,
				0,
				0
			]
		},
		"Math-BoldItalic": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"48": [
				0,
				.44444,
				0,
				0,
				.575
			],
			"49": [
				0,
				.44444,
				0,
				0,
				.575
			],
			"50": [
				0,
				.44444,
				0,
				0,
				.575
			],
			"51": [
				.19444,
				.44444,
				0,
				0,
				.575
			],
			"52": [
				.19444,
				.44444,
				0,
				0,
				.575
			],
			"53": [
				.19444,
				.44444,
				0,
				0,
				.575
			],
			"54": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"55": [
				.19444,
				.44444,
				0,
				0,
				.575
			],
			"56": [
				0,
				.64444,
				0,
				0,
				.575
			],
			"57": [
				.19444,
				.44444,
				0,
				0,
				.575
			],
			"65": [
				0,
				.68611,
				0,
				0,
				.86944
			],
			"66": [
				0,
				.68611,
				.04835,
				0,
				.8664
			],
			"67": [
				0,
				.68611,
				.06979,
				0,
				.81694
			],
			"68": [
				0,
				.68611,
				.03194,
				0,
				.93812
			],
			"69": [
				0,
				.68611,
				.05451,
				0,
				.81007
			],
			"70": [
				0,
				.68611,
				.15972,
				0,
				.68889
			],
			"71": [
				0,
				.68611,
				0,
				0,
				.88673
			],
			"72": [
				0,
				.68611,
				.08229,
				0,
				.98229
			],
			"73": [
				0,
				.68611,
				.07778,
				0,
				.51111
			],
			"74": [
				0,
				.68611,
				.10069,
				0,
				.63125
			],
			"75": [
				0,
				.68611,
				.06979,
				0,
				.97118
			],
			"76": [
				0,
				.68611,
				0,
				0,
				.75555
			],
			"77": [
				0,
				.68611,
				.11424,
				0,
				1.14201
			],
			"78": [
				0,
				.68611,
				.11424,
				0,
				.95034
			],
			"79": [
				0,
				.68611,
				.03194,
				0,
				.83666
			],
			"80": [
				0,
				.68611,
				.15972,
				0,
				.72309
			],
			"81": [
				.19444,
				.68611,
				0,
				0,
				.86861
			],
			"82": [
				0,
				.68611,
				.00421,
				0,
				.87235
			],
			"83": [
				0,
				.68611,
				.05382,
				0,
				.69271
			],
			"84": [
				0,
				.68611,
				.15972,
				0,
				.63663
			],
			"85": [
				0,
				.68611,
				.11424,
				0,
				.80027
			],
			"86": [
				0,
				.68611,
				.25555,
				0,
				.67778
			],
			"87": [
				0,
				.68611,
				.15972,
				0,
				1.09305
			],
			"88": [
				0,
				.68611,
				.07778,
				0,
				.94722
			],
			"89": [
				0,
				.68611,
				.25555,
				0,
				.67458
			],
			"90": [
				0,
				.68611,
				.06979,
				0,
				.77257
			],
			"97": [
				0,
				.44444,
				0,
				0,
				.63287
			],
			"98": [
				0,
				.69444,
				0,
				0,
				.52083
			],
			"99": [
				0,
				.44444,
				0,
				0,
				.51342
			],
			"100": [
				0,
				.69444,
				0,
				0,
				.60972
			],
			"101": [
				0,
				.44444,
				0,
				0,
				.55361
			],
			"102": [
				.19444,
				.69444,
				.11042,
				0,
				.56806
			],
			"103": [
				.19444,
				.44444,
				.03704,
				0,
				.5449
			],
			"104": [
				0,
				.69444,
				0,
				0,
				.66759
			],
			"105": [
				0,
				.69326,
				0,
				0,
				.4048
			],
			"106": [
				.19444,
				.69326,
				.0622,
				0,
				.47083
			],
			"107": [
				0,
				.69444,
				.01852,
				0,
				.6037
			],
			"108": [
				0,
				.69444,
				.0088,
				0,
				.34815
			],
			"109": [
				0,
				.44444,
				0,
				0,
				1.0324
			],
			"110": [
				0,
				.44444,
				0,
				0,
				.71296
			],
			"111": [
				0,
				.44444,
				0,
				0,
				.58472
			],
			"112": [
				.19444,
				.44444,
				0,
				0,
				.60092
			],
			"113": [
				.19444,
				.44444,
				.03704,
				0,
				.54213
			],
			"114": [
				0,
				.44444,
				.03194,
				0,
				.5287
			],
			"115": [
				0,
				.44444,
				0,
				0,
				.53125
			],
			"116": [
				0,
				.63492,
				0,
				0,
				.41528
			],
			"117": [
				0,
				.44444,
				0,
				0,
				.68102
			],
			"118": [
				0,
				.44444,
				.03704,
				0,
				.56666
			],
			"119": [
				0,
				.44444,
				.02778,
				0,
				.83148
			],
			"120": [
				0,
				.44444,
				0,
				0,
				.65903
			],
			"121": [
				.19444,
				.44444,
				.03704,
				0,
				.59028
			],
			"122": [
				0,
				.44444,
				.04213,
				0,
				.55509
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"915": [
				0,
				.68611,
				.15972,
				0,
				.65694
			],
			"916": [
				0,
				.68611,
				0,
				0,
				.95833
			],
			"920": [
				0,
				.68611,
				.03194,
				0,
				.86722
			],
			"923": [
				0,
				.68611,
				0,
				0,
				.80555
			],
			"926": [
				0,
				.68611,
				.07458,
				0,
				.84125
			],
			"928": [
				0,
				.68611,
				.08229,
				0,
				.98229
			],
			"931": [
				0,
				.68611,
				.05451,
				0,
				.88507
			],
			"933": [
				0,
				.68611,
				.15972,
				0,
				.67083
			],
			"934": [
				0,
				.68611,
				0,
				0,
				.76666
			],
			"936": [
				0,
				.68611,
				.11653,
				0,
				.71402
			],
			"937": [
				0,
				.68611,
				.04835,
				0,
				.8789
			],
			"945": [
				0,
				.44444,
				0,
				0,
				.76064
			],
			"946": [
				.19444,
				.69444,
				.03403,
				0,
				.65972
			],
			"947": [
				.19444,
				.44444,
				.06389,
				0,
				.59003
			],
			"948": [
				0,
				.69444,
				.03819,
				0,
				.52222
			],
			"949": [
				0,
				.44444,
				0,
				0,
				.52882
			],
			"950": [
				.19444,
				.69444,
				.06215,
				0,
				.50833
			],
			"951": [
				.19444,
				.44444,
				.03704,
				0,
				.6
			],
			"952": [
				0,
				.69444,
				.03194,
				0,
				.5618
			],
			"953": [
				0,
				.44444,
				0,
				0,
				.41204
			],
			"954": [
				0,
				.44444,
				0,
				0,
				.66759
			],
			"955": [
				0,
				.69444,
				0,
				0,
				.67083
			],
			"956": [
				.19444,
				.44444,
				0,
				0,
				.70787
			],
			"957": [
				0,
				.44444,
				.06898,
				0,
				.57685
			],
			"958": [
				.19444,
				.69444,
				.03021,
				0,
				.50833
			],
			"959": [
				0,
				.44444,
				0,
				0,
				.58472
			],
			"960": [
				0,
				.44444,
				.03704,
				0,
				.68241
			],
			"961": [
				.19444,
				.44444,
				0,
				0,
				.6118
			],
			"962": [
				.09722,
				.44444,
				.07917,
				0,
				.42361
			],
			"963": [
				0,
				.44444,
				.03704,
				0,
				.68588
			],
			"964": [
				0,
				.44444,
				.13472,
				0,
				.52083
			],
			"965": [
				0,
				.44444,
				.03704,
				0,
				.63055
			],
			"966": [
				.19444,
				.44444,
				0,
				0,
				.74722
			],
			"967": [
				.19444,
				.44444,
				0,
				0,
				.71805
			],
			"968": [
				.19444,
				.69444,
				.03704,
				0,
				.75833
			],
			"969": [
				0,
				.44444,
				.03704,
				0,
				.71782
			],
			"977": [
				0,
				.69444,
				0,
				0,
				.69155
			],
			"981": [
				.19444,
				.69444,
				0,
				0,
				.7125
			],
			"982": [
				0,
				.44444,
				.03194,
				0,
				.975
			],
			"1009": [
				.19444,
				.44444,
				0,
				0,
				.6118
			],
			"1013": [
				0,
				.44444,
				0,
				0,
				.48333
			],
			"57649": [
				0,
				.44444,
				0,
				0,
				.39352
			],
			"57911": [
				.19444,
				.44444,
				0,
				0,
				.43889
			]
		},
		"Math-Italic": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"48": [
				0,
				.43056,
				0,
				0,
				.5
			],
			"49": [
				0,
				.43056,
				0,
				0,
				.5
			],
			"50": [
				0,
				.43056,
				0,
				0,
				.5
			],
			"51": [
				.19444,
				.43056,
				0,
				0,
				.5
			],
			"52": [
				.19444,
				.43056,
				0,
				0,
				.5
			],
			"53": [
				.19444,
				.43056,
				0,
				0,
				.5
			],
			"54": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"55": [
				.19444,
				.43056,
				0,
				0,
				.5
			],
			"56": [
				0,
				.64444,
				0,
				0,
				.5
			],
			"57": [
				.19444,
				.43056,
				0,
				0,
				.5
			],
			"65": [
				0,
				.68333,
				0,
				.13889,
				.75
			],
			"66": [
				0,
				.68333,
				.05017,
				.08334,
				.75851
			],
			"67": [
				0,
				.68333,
				.07153,
				.08334,
				.71472
			],
			"68": [
				0,
				.68333,
				.02778,
				.05556,
				.82792
			],
			"69": [
				0,
				.68333,
				.05764,
				.08334,
				.7382
			],
			"70": [
				0,
				.68333,
				.13889,
				.08334,
				.64306
			],
			"71": [
				0,
				.68333,
				0,
				.08334,
				.78625
			],
			"72": [
				0,
				.68333,
				.08125,
				.05556,
				.83125
			],
			"73": [
				0,
				.68333,
				.07847,
				.11111,
				.43958
			],
			"74": [
				0,
				.68333,
				.09618,
				.16667,
				.55451
			],
			"75": [
				0,
				.68333,
				.07153,
				.05556,
				.84931
			],
			"76": [
				0,
				.68333,
				0,
				.02778,
				.68056
			],
			"77": [
				0,
				.68333,
				.10903,
				.08334,
				.97014
			],
			"78": [
				0,
				.68333,
				.10903,
				.08334,
				.80347
			],
			"79": [
				0,
				.68333,
				.02778,
				.08334,
				.76278
			],
			"80": [
				0,
				.68333,
				.13889,
				.08334,
				.64201
			],
			"81": [
				.19444,
				.68333,
				0,
				.08334,
				.79056
			],
			"82": [
				0,
				.68333,
				.00773,
				.08334,
				.75929
			],
			"83": [
				0,
				.68333,
				.05764,
				.08334,
				.6132
			],
			"84": [
				0,
				.68333,
				.13889,
				.08334,
				.58438
			],
			"85": [
				0,
				.68333,
				.10903,
				.02778,
				.68278
			],
			"86": [
				0,
				.68333,
				.22222,
				0,
				.58333
			],
			"87": [
				0,
				.68333,
				.13889,
				0,
				.94445
			],
			"88": [
				0,
				.68333,
				.07847,
				.08334,
				.82847
			],
			"89": [
				0,
				.68333,
				.22222,
				0,
				.58056
			],
			"90": [
				0,
				.68333,
				.07153,
				.08334,
				.68264
			],
			"97": [
				0,
				.43056,
				0,
				0,
				.52859
			],
			"98": [
				0,
				.69444,
				0,
				0,
				.42917
			],
			"99": [
				0,
				.43056,
				0,
				.05556,
				.43276
			],
			"100": [
				0,
				.69444,
				0,
				.16667,
				.52049
			],
			"101": [
				0,
				.43056,
				0,
				.05556,
				.46563
			],
			"102": [
				.19444,
				.69444,
				.10764,
				.16667,
				.48959
			],
			"103": [
				.19444,
				.43056,
				.03588,
				.02778,
				.47697
			],
			"104": [
				0,
				.69444,
				0,
				0,
				.57616
			],
			"105": [
				0,
				.65952,
				0,
				0,
				.34451
			],
			"106": [
				.19444,
				.65952,
				.05724,
				0,
				.41181
			],
			"107": [
				0,
				.69444,
				.03148,
				0,
				.5206
			],
			"108": [
				0,
				.69444,
				.01968,
				.08334,
				.29838
			],
			"109": [
				0,
				.43056,
				0,
				0,
				.87801
			],
			"110": [
				0,
				.43056,
				0,
				0,
				.60023
			],
			"111": [
				0,
				.43056,
				0,
				.05556,
				.48472
			],
			"112": [
				.19444,
				.43056,
				0,
				.08334,
				.50313
			],
			"113": [
				.19444,
				.43056,
				.03588,
				.08334,
				.44641
			],
			"114": [
				0,
				.43056,
				.02778,
				.05556,
				.45116
			],
			"115": [
				0,
				.43056,
				0,
				.05556,
				.46875
			],
			"116": [
				0,
				.61508,
				0,
				.08334,
				.36111
			],
			"117": [
				0,
				.43056,
				0,
				.02778,
				.57246
			],
			"118": [
				0,
				.43056,
				.03588,
				.02778,
				.48472
			],
			"119": [
				0,
				.43056,
				.02691,
				.08334,
				.71592
			],
			"120": [
				0,
				.43056,
				0,
				.02778,
				.57153
			],
			"121": [
				.19444,
				.43056,
				.03588,
				.05556,
				.49028
			],
			"122": [
				0,
				.43056,
				.04398,
				.05556,
				.46505
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"915": [
				0,
				.68333,
				.13889,
				.08334,
				.61528
			],
			"916": [
				0,
				.68333,
				0,
				.16667,
				.83334
			],
			"920": [
				0,
				.68333,
				.02778,
				.08334,
				.76278
			],
			"923": [
				0,
				.68333,
				0,
				.16667,
				.69445
			],
			"926": [
				0,
				.68333,
				.07569,
				.08334,
				.74236
			],
			"928": [
				0,
				.68333,
				.08125,
				.05556,
				.83125
			],
			"931": [
				0,
				.68333,
				.05764,
				.08334,
				.77986
			],
			"933": [
				0,
				.68333,
				.13889,
				.05556,
				.58333
			],
			"934": [
				0,
				.68333,
				0,
				.08334,
				.66667
			],
			"936": [
				0,
				.68333,
				.11,
				.05556,
				.61222
			],
			"937": [
				0,
				.68333,
				.05017,
				.08334,
				.7724
			],
			"945": [
				0,
				.43056,
				.0037,
				.02778,
				.6397
			],
			"946": [
				.19444,
				.69444,
				.05278,
				.08334,
				.56563
			],
			"947": [
				.19444,
				.43056,
				.05556,
				0,
				.51773
			],
			"948": [
				0,
				.69444,
				.03785,
				.05556,
				.44444
			],
			"949": [
				0,
				.43056,
				0,
				.08334,
				.46632
			],
			"950": [
				.19444,
				.69444,
				.07378,
				.08334,
				.4375
			],
			"951": [
				.19444,
				.43056,
				.03588,
				.05556,
				.49653
			],
			"952": [
				0,
				.69444,
				.02778,
				.08334,
				.46944
			],
			"953": [
				0,
				.43056,
				0,
				.05556,
				.35394
			],
			"954": [
				0,
				.43056,
				0,
				0,
				.57616
			],
			"955": [
				0,
				.69444,
				0,
				0,
				.58334
			],
			"956": [
				.19444,
				.43056,
				0,
				.02778,
				.60255
			],
			"957": [
				0,
				.43056,
				.06366,
				.02778,
				.49398
			],
			"958": [
				.19444,
				.69444,
				.04601,
				.11111,
				.4375
			],
			"959": [
				0,
				.43056,
				0,
				.05556,
				.48472
			],
			"960": [
				0,
				.43056,
				.03588,
				0,
				.57003
			],
			"961": [
				.19444,
				.43056,
				0,
				.08334,
				.51702
			],
			"962": [
				.09722,
				.43056,
				.07986,
				.08334,
				.36285
			],
			"963": [
				0,
				.43056,
				.03588,
				0,
				.57141
			],
			"964": [
				0,
				.43056,
				.1132,
				.02778,
				.43715
			],
			"965": [
				0,
				.43056,
				.03588,
				.02778,
				.54028
			],
			"966": [
				.19444,
				.43056,
				0,
				.08334,
				.65417
			],
			"967": [
				.19444,
				.43056,
				0,
				.05556,
				.62569
			],
			"968": [
				.19444,
				.69444,
				.03588,
				.11111,
				.65139
			],
			"969": [
				0,
				.43056,
				.03588,
				0,
				.62245
			],
			"977": [
				0,
				.69444,
				0,
				.08334,
				.59144
			],
			"981": [
				.19444,
				.69444,
				0,
				.08334,
				.59583
			],
			"982": [
				0,
				.43056,
				.02778,
				0,
				.82813
			],
			"1009": [
				.19444,
				.43056,
				0,
				.08334,
				.51702
			],
			"1013": [
				0,
				.43056,
				0,
				.05556,
				.4059
			],
			"57649": [
				0,
				.43056,
				0,
				.02778,
				.32246
			],
			"57911": [
				.19444,
				.43056,
				0,
				.08334,
				.38403
			]
		},
		"SansSerif-Bold": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69444,
				0,
				0,
				.36667
			],
			"34": [
				0,
				.69444,
				0,
				0,
				.55834
			],
			"35": [
				.19444,
				.69444,
				0,
				0,
				.91667
			],
			"36": [
				.05556,
				.75,
				0,
				0,
				.55
			],
			"37": [
				.05556,
				.75,
				0,
				0,
				1.02912
			],
			"38": [
				0,
				.69444,
				0,
				0,
				.83056
			],
			"39": [
				0,
				.69444,
				0,
				0,
				.30556
			],
			"40": [
				.25,
				.75,
				0,
				0,
				.42778
			],
			"41": [
				.25,
				.75,
				0,
				0,
				.42778
			],
			"42": [
				0,
				.75,
				0,
				0,
				.55
			],
			"43": [
				.11667,
				.61667,
				0,
				0,
				.85556
			],
			"44": [
				.10556,
				.13056,
				0,
				0,
				.30556
			],
			"45": [
				0,
				.45833,
				0,
				0,
				.36667
			],
			"46": [
				0,
				.13056,
				0,
				0,
				.30556
			],
			"47": [
				.25,
				.75,
				0,
				0,
				.55
			],
			"48": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"49": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"50": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"51": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"52": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"53": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"54": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"55": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"56": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"57": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"58": [
				0,
				.45833,
				0,
				0,
				.30556
			],
			"59": [
				.10556,
				.45833,
				0,
				0,
				.30556
			],
			"61": [
				-.09375,
				.40625,
				0,
				0,
				.85556
			],
			"63": [
				0,
				.69444,
				0,
				0,
				.51945
			],
			"64": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"65": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"66": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"67": [
				0,
				.69444,
				0,
				0,
				.70278
			],
			"68": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"69": [
				0,
				.69444,
				0,
				0,
				.64167
			],
			"70": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"71": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"72": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"73": [
				0,
				.69444,
				0,
				0,
				.33056
			],
			"74": [
				0,
				.69444,
				0,
				0,
				.51945
			],
			"75": [
				0,
				.69444,
				0,
				0,
				.76389
			],
			"76": [
				0,
				.69444,
				0,
				0,
				.58056
			],
			"77": [
				0,
				.69444,
				0,
				0,
				.97778
			],
			"78": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"79": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"80": [
				0,
				.69444,
				0,
				0,
				.70278
			],
			"81": [
				.10556,
				.69444,
				0,
				0,
				.79445
			],
			"82": [
				0,
				.69444,
				0,
				0,
				.70278
			],
			"83": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"84": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"85": [
				0,
				.69444,
				0,
				0,
				.76389
			],
			"86": [
				0,
				.69444,
				.01528,
				0,
				.73334
			],
			"87": [
				0,
				.69444,
				.01528,
				0,
				1.03889
			],
			"88": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"89": [
				0,
				.69444,
				.0275,
				0,
				.73334
			],
			"90": [
				0,
				.69444,
				0,
				0,
				.67223
			],
			"91": [
				.25,
				.75,
				0,
				0,
				.34306
			],
			"93": [
				.25,
				.75,
				0,
				0,
				.34306
			],
			"94": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"95": [
				.35,
				.10833,
				.03056,
				0,
				.55
			],
			"97": [
				0,
				.45833,
				0,
				0,
				.525
			],
			"98": [
				0,
				.69444,
				0,
				0,
				.56111
			],
			"99": [
				0,
				.45833,
				0,
				0,
				.48889
			],
			"100": [
				0,
				.69444,
				0,
				0,
				.56111
			],
			"101": [
				0,
				.45833,
				0,
				0,
				.51111
			],
			"102": [
				0,
				.69444,
				.07639,
				0,
				.33611
			],
			"103": [
				.19444,
				.45833,
				.01528,
				0,
				.55
			],
			"104": [
				0,
				.69444,
				0,
				0,
				.56111
			],
			"105": [
				0,
				.69444,
				0,
				0,
				.25556
			],
			"106": [
				.19444,
				.69444,
				0,
				0,
				.28611
			],
			"107": [
				0,
				.69444,
				0,
				0,
				.53056
			],
			"108": [
				0,
				.69444,
				0,
				0,
				.25556
			],
			"109": [
				0,
				.45833,
				0,
				0,
				.86667
			],
			"110": [
				0,
				.45833,
				0,
				0,
				.56111
			],
			"111": [
				0,
				.45833,
				0,
				0,
				.55
			],
			"112": [
				.19444,
				.45833,
				0,
				0,
				.56111
			],
			"113": [
				.19444,
				.45833,
				0,
				0,
				.56111
			],
			"114": [
				0,
				.45833,
				.01528,
				0,
				.37222
			],
			"115": [
				0,
				.45833,
				0,
				0,
				.42167
			],
			"116": [
				0,
				.58929,
				0,
				0,
				.40417
			],
			"117": [
				0,
				.45833,
				0,
				0,
				.56111
			],
			"118": [
				0,
				.45833,
				.01528,
				0,
				.5
			],
			"119": [
				0,
				.45833,
				.01528,
				0,
				.74445
			],
			"120": [
				0,
				.45833,
				0,
				0,
				.5
			],
			"121": [
				.19444,
				.45833,
				.01528,
				0,
				.5
			],
			"122": [
				0,
				.45833,
				0,
				0,
				.47639
			],
			"126": [
				.35,
				.34444,
				0,
				0,
				.55
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"168": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"176": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"180": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"184": [
				.17014,
				0,
				0,
				0,
				.48889
			],
			"305": [
				0,
				.45833,
				0,
				0,
				.25556
			],
			"567": [
				.19444,
				.45833,
				0,
				0,
				.28611
			],
			"710": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"711": [
				0,
				.63542,
				0,
				0,
				.55
			],
			"713": [
				0,
				.63778,
				0,
				0,
				.55
			],
			"728": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"729": [
				0,
				.69444,
				0,
				0,
				.30556
			],
			"730": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"732": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"733": [
				0,
				.69444,
				0,
				0,
				.55
			],
			"915": [
				0,
				.69444,
				0,
				0,
				.58056
			],
			"916": [
				0,
				.69444,
				0,
				0,
				.91667
			],
			"920": [
				0,
				.69444,
				0,
				0,
				.85556
			],
			"923": [
				0,
				.69444,
				0,
				0,
				.67223
			],
			"926": [
				0,
				.69444,
				0,
				0,
				.73334
			],
			"928": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"931": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"933": [
				0,
				.69444,
				0,
				0,
				.85556
			],
			"934": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"936": [
				0,
				.69444,
				0,
				0,
				.85556
			],
			"937": [
				0,
				.69444,
				0,
				0,
				.79445
			],
			"8211": [
				0,
				.45833,
				.03056,
				0,
				.55
			],
			"8212": [
				0,
				.45833,
				.03056,
				0,
				1.10001
			],
			"8216": [
				0,
				.69444,
				0,
				0,
				.30556
			],
			"8217": [
				0,
				.69444,
				0,
				0,
				.30556
			],
			"8220": [
				0,
				.69444,
				0,
				0,
				.55834
			],
			"8221": [
				0,
				.69444,
				0,
				0,
				.55834
			]
		},
		"SansSerif-Italic": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69444,
				.05733,
				0,
				.31945
			],
			"34": [
				0,
				.69444,
				.00316,
				0,
				.5
			],
			"35": [
				.19444,
				.69444,
				.05087,
				0,
				.83334
			],
			"36": [
				.05556,
				.75,
				.11156,
				0,
				.5
			],
			"37": [
				.05556,
				.75,
				.03126,
				0,
				.83334
			],
			"38": [
				0,
				.69444,
				.03058,
				0,
				.75834
			],
			"39": [
				0,
				.69444,
				.07816,
				0,
				.27778
			],
			"40": [
				.25,
				.75,
				.13164,
				0,
				.38889
			],
			"41": [
				.25,
				.75,
				.02536,
				0,
				.38889
			],
			"42": [
				0,
				.75,
				.11775,
				0,
				.5
			],
			"43": [
				.08333,
				.58333,
				.02536,
				0,
				.77778
			],
			"44": [
				.125,
				.08333,
				0,
				0,
				.27778
			],
			"45": [
				0,
				.44444,
				.01946,
				0,
				.33333
			],
			"46": [
				0,
				.08333,
				0,
				0,
				.27778
			],
			"47": [
				.25,
				.75,
				.13164,
				0,
				.5
			],
			"48": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"49": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"50": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"51": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"52": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"53": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"54": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"55": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"56": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"57": [
				0,
				.65556,
				.11156,
				0,
				.5
			],
			"58": [
				0,
				.44444,
				.02502,
				0,
				.27778
			],
			"59": [
				.125,
				.44444,
				.02502,
				0,
				.27778
			],
			"61": [
				-.13,
				.37,
				.05087,
				0,
				.77778
			],
			"63": [
				0,
				.69444,
				.11809,
				0,
				.47222
			],
			"64": [
				0,
				.69444,
				.07555,
				0,
				.66667
			],
			"65": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"66": [
				0,
				.69444,
				.08293,
				0,
				.66667
			],
			"67": [
				0,
				.69444,
				.11983,
				0,
				.63889
			],
			"68": [
				0,
				.69444,
				.07555,
				0,
				.72223
			],
			"69": [
				0,
				.69444,
				.11983,
				0,
				.59722
			],
			"70": [
				0,
				.69444,
				.13372,
				0,
				.56945
			],
			"71": [
				0,
				.69444,
				.11983,
				0,
				.66667
			],
			"72": [
				0,
				.69444,
				.08094,
				0,
				.70834
			],
			"73": [
				0,
				.69444,
				.13372,
				0,
				.27778
			],
			"74": [
				0,
				.69444,
				.08094,
				0,
				.47222
			],
			"75": [
				0,
				.69444,
				.11983,
				0,
				.69445
			],
			"76": [
				0,
				.69444,
				0,
				0,
				.54167
			],
			"77": [
				0,
				.69444,
				.08094,
				0,
				.875
			],
			"78": [
				0,
				.69444,
				.08094,
				0,
				.70834
			],
			"79": [
				0,
				.69444,
				.07555,
				0,
				.73611
			],
			"80": [
				0,
				.69444,
				.08293,
				0,
				.63889
			],
			"81": [
				.125,
				.69444,
				.07555,
				0,
				.73611
			],
			"82": [
				0,
				.69444,
				.08293,
				0,
				.64584
			],
			"83": [
				0,
				.69444,
				.09205,
				0,
				.55556
			],
			"84": [
				0,
				.69444,
				.13372,
				0,
				.68056
			],
			"85": [
				0,
				.69444,
				.08094,
				0,
				.6875
			],
			"86": [
				0,
				.69444,
				.1615,
				0,
				.66667
			],
			"87": [
				0,
				.69444,
				.1615,
				0,
				.94445
			],
			"88": [
				0,
				.69444,
				.13372,
				0,
				.66667
			],
			"89": [
				0,
				.69444,
				.17261,
				0,
				.66667
			],
			"90": [
				0,
				.69444,
				.11983,
				0,
				.61111
			],
			"91": [
				.25,
				.75,
				.15942,
				0,
				.28889
			],
			"93": [
				.25,
				.75,
				.08719,
				0,
				.28889
			],
			"94": [
				0,
				.69444,
				.0799,
				0,
				.5
			],
			"95": [
				.35,
				.09444,
				.08616,
				0,
				.5
			],
			"97": [
				0,
				.44444,
				.00981,
				0,
				.48056
			],
			"98": [
				0,
				.69444,
				.03057,
				0,
				.51667
			],
			"99": [
				0,
				.44444,
				.08336,
				0,
				.44445
			],
			"100": [
				0,
				.69444,
				.09483,
				0,
				.51667
			],
			"101": [
				0,
				.44444,
				.06778,
				0,
				.44445
			],
			"102": [
				0,
				.69444,
				.21705,
				0,
				.30556
			],
			"103": [
				.19444,
				.44444,
				.10836,
				0,
				.5
			],
			"104": [
				0,
				.69444,
				.01778,
				0,
				.51667
			],
			"105": [
				0,
				.67937,
				.09718,
				0,
				.23889
			],
			"106": [
				.19444,
				.67937,
				.09162,
				0,
				.26667
			],
			"107": [
				0,
				.69444,
				.08336,
				0,
				.48889
			],
			"108": [
				0,
				.69444,
				.09483,
				0,
				.23889
			],
			"109": [
				0,
				.44444,
				.01778,
				0,
				.79445
			],
			"110": [
				0,
				.44444,
				.01778,
				0,
				.51667
			],
			"111": [
				0,
				.44444,
				.06613,
				0,
				.5
			],
			"112": [
				.19444,
				.44444,
				.0389,
				0,
				.51667
			],
			"113": [
				.19444,
				.44444,
				.04169,
				0,
				.51667
			],
			"114": [
				0,
				.44444,
				.10836,
				0,
				.34167
			],
			"115": [
				0,
				.44444,
				.0778,
				0,
				.38333
			],
			"116": [
				0,
				.57143,
				.07225,
				0,
				.36111
			],
			"117": [
				0,
				.44444,
				.04169,
				0,
				.51667
			],
			"118": [
				0,
				.44444,
				.10836,
				0,
				.46111
			],
			"119": [
				0,
				.44444,
				.10836,
				0,
				.68334
			],
			"120": [
				0,
				.44444,
				.09169,
				0,
				.46111
			],
			"121": [
				.19444,
				.44444,
				.10836,
				0,
				.46111
			],
			"122": [
				0,
				.44444,
				.08752,
				0,
				.43472
			],
			"126": [
				.35,
				.32659,
				.08826,
				0,
				.5
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"168": [
				0,
				.67937,
				.06385,
				0,
				.5
			],
			"176": [
				0,
				.69444,
				0,
				0,
				.73752
			],
			"184": [
				.17014,
				0,
				0,
				0,
				.44445
			],
			"305": [
				0,
				.44444,
				.04169,
				0,
				.23889
			],
			"567": [
				.19444,
				.44444,
				.04169,
				0,
				.26667
			],
			"710": [
				0,
				.69444,
				.0799,
				0,
				.5
			],
			"711": [
				0,
				.63194,
				.08432,
				0,
				.5
			],
			"713": [
				0,
				.60889,
				.08776,
				0,
				.5
			],
			"714": [
				0,
				.69444,
				.09205,
				0,
				.5
			],
			"715": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"728": [
				0,
				.69444,
				.09483,
				0,
				.5
			],
			"729": [
				0,
				.67937,
				.07774,
				0,
				.27778
			],
			"730": [
				0,
				.69444,
				0,
				0,
				.73752
			],
			"732": [
				0,
				.67659,
				.08826,
				0,
				.5
			],
			"733": [
				0,
				.69444,
				.09205,
				0,
				.5
			],
			"915": [
				0,
				.69444,
				.13372,
				0,
				.54167
			],
			"916": [
				0,
				.69444,
				0,
				0,
				.83334
			],
			"920": [
				0,
				.69444,
				.07555,
				0,
				.77778
			],
			"923": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"926": [
				0,
				.69444,
				.12816,
				0,
				.66667
			],
			"928": [
				0,
				.69444,
				.08094,
				0,
				.70834
			],
			"931": [
				0,
				.69444,
				.11983,
				0,
				.72222
			],
			"933": [
				0,
				.69444,
				.09031,
				0,
				.77778
			],
			"934": [
				0,
				.69444,
				.04603,
				0,
				.72222
			],
			"936": [
				0,
				.69444,
				.09031,
				0,
				.77778
			],
			"937": [
				0,
				.69444,
				.08293,
				0,
				.72222
			],
			"8211": [
				0,
				.44444,
				.08616,
				0,
				.5
			],
			"8212": [
				0,
				.44444,
				.08616,
				0,
				1
			],
			"8216": [
				0,
				.69444,
				.07816,
				0,
				.27778
			],
			"8217": [
				0,
				.69444,
				.07816,
				0,
				.27778
			],
			"8220": [
				0,
				.69444,
				.14205,
				0,
				.5
			],
			"8221": [
				0,
				.69444,
				.00316,
				0,
				.5
			]
		},
		"SansSerif-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"33": [
				0,
				.69444,
				0,
				0,
				.31945
			],
			"34": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"35": [
				.19444,
				.69444,
				0,
				0,
				.83334
			],
			"36": [
				.05556,
				.75,
				0,
				0,
				.5
			],
			"37": [
				.05556,
				.75,
				0,
				0,
				.83334
			],
			"38": [
				0,
				.69444,
				0,
				0,
				.75834
			],
			"39": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"40": [
				.25,
				.75,
				0,
				0,
				.38889
			],
			"41": [
				.25,
				.75,
				0,
				0,
				.38889
			],
			"42": [
				0,
				.75,
				0,
				0,
				.5
			],
			"43": [
				.08333,
				.58333,
				0,
				0,
				.77778
			],
			"44": [
				.125,
				.08333,
				0,
				0,
				.27778
			],
			"45": [
				0,
				.44444,
				0,
				0,
				.33333
			],
			"46": [
				0,
				.08333,
				0,
				0,
				.27778
			],
			"47": [
				.25,
				.75,
				0,
				0,
				.5
			],
			"48": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"49": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"50": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"51": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"52": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"53": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"54": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"55": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"56": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"57": [
				0,
				.65556,
				0,
				0,
				.5
			],
			"58": [
				0,
				.44444,
				0,
				0,
				.27778
			],
			"59": [
				.125,
				.44444,
				0,
				0,
				.27778
			],
			"61": [
				-.13,
				.37,
				0,
				0,
				.77778
			],
			"63": [
				0,
				.69444,
				0,
				0,
				.47222
			],
			"64": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"65": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"66": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"67": [
				0,
				.69444,
				0,
				0,
				.63889
			],
			"68": [
				0,
				.69444,
				0,
				0,
				.72223
			],
			"69": [
				0,
				.69444,
				0,
				0,
				.59722
			],
			"70": [
				0,
				.69444,
				0,
				0,
				.56945
			],
			"71": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"72": [
				0,
				.69444,
				0,
				0,
				.70834
			],
			"73": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"74": [
				0,
				.69444,
				0,
				0,
				.47222
			],
			"75": [
				0,
				.69444,
				0,
				0,
				.69445
			],
			"76": [
				0,
				.69444,
				0,
				0,
				.54167
			],
			"77": [
				0,
				.69444,
				0,
				0,
				.875
			],
			"78": [
				0,
				.69444,
				0,
				0,
				.70834
			],
			"79": [
				0,
				.69444,
				0,
				0,
				.73611
			],
			"80": [
				0,
				.69444,
				0,
				0,
				.63889
			],
			"81": [
				.125,
				.69444,
				0,
				0,
				.73611
			],
			"82": [
				0,
				.69444,
				0,
				0,
				.64584
			],
			"83": [
				0,
				.69444,
				0,
				0,
				.55556
			],
			"84": [
				0,
				.69444,
				0,
				0,
				.68056
			],
			"85": [
				0,
				.69444,
				0,
				0,
				.6875
			],
			"86": [
				0,
				.69444,
				.01389,
				0,
				.66667
			],
			"87": [
				0,
				.69444,
				.01389,
				0,
				.94445
			],
			"88": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"89": [
				0,
				.69444,
				.025,
				0,
				.66667
			],
			"90": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"91": [
				.25,
				.75,
				0,
				0,
				.28889
			],
			"93": [
				.25,
				.75,
				0,
				0,
				.28889
			],
			"94": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"95": [
				.35,
				.09444,
				.02778,
				0,
				.5
			],
			"97": [
				0,
				.44444,
				0,
				0,
				.48056
			],
			"98": [
				0,
				.69444,
				0,
				0,
				.51667
			],
			"99": [
				0,
				.44444,
				0,
				0,
				.44445
			],
			"100": [
				0,
				.69444,
				0,
				0,
				.51667
			],
			"101": [
				0,
				.44444,
				0,
				0,
				.44445
			],
			"102": [
				0,
				.69444,
				.06944,
				0,
				.30556
			],
			"103": [
				.19444,
				.44444,
				.01389,
				0,
				.5
			],
			"104": [
				0,
				.69444,
				0,
				0,
				.51667
			],
			"105": [
				0,
				.67937,
				0,
				0,
				.23889
			],
			"106": [
				.19444,
				.67937,
				0,
				0,
				.26667
			],
			"107": [
				0,
				.69444,
				0,
				0,
				.48889
			],
			"108": [
				0,
				.69444,
				0,
				0,
				.23889
			],
			"109": [
				0,
				.44444,
				0,
				0,
				.79445
			],
			"110": [
				0,
				.44444,
				0,
				0,
				.51667
			],
			"111": [
				0,
				.44444,
				0,
				0,
				.5
			],
			"112": [
				.19444,
				.44444,
				0,
				0,
				.51667
			],
			"113": [
				.19444,
				.44444,
				0,
				0,
				.51667
			],
			"114": [
				0,
				.44444,
				.01389,
				0,
				.34167
			],
			"115": [
				0,
				.44444,
				0,
				0,
				.38333
			],
			"116": [
				0,
				.57143,
				0,
				0,
				.36111
			],
			"117": [
				0,
				.44444,
				0,
				0,
				.51667
			],
			"118": [
				0,
				.44444,
				.01389,
				0,
				.46111
			],
			"119": [
				0,
				.44444,
				.01389,
				0,
				.68334
			],
			"120": [
				0,
				.44444,
				0,
				0,
				.46111
			],
			"121": [
				.19444,
				.44444,
				.01389,
				0,
				.46111
			],
			"122": [
				0,
				.44444,
				0,
				0,
				.43472
			],
			"126": [
				.35,
				.32659,
				0,
				0,
				.5
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"168": [
				0,
				.67937,
				0,
				0,
				.5
			],
			"176": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"184": [
				.17014,
				0,
				0,
				0,
				.44445
			],
			"305": [
				0,
				.44444,
				0,
				0,
				.23889
			],
			"567": [
				.19444,
				.44444,
				0,
				0,
				.26667
			],
			"710": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"711": [
				0,
				.63194,
				0,
				0,
				.5
			],
			"713": [
				0,
				.60889,
				0,
				0,
				.5
			],
			"714": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"715": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"728": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"729": [
				0,
				.67937,
				0,
				0,
				.27778
			],
			"730": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"732": [
				0,
				.67659,
				0,
				0,
				.5
			],
			"733": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"915": [
				0,
				.69444,
				0,
				0,
				.54167
			],
			"916": [
				0,
				.69444,
				0,
				0,
				.83334
			],
			"920": [
				0,
				.69444,
				0,
				0,
				.77778
			],
			"923": [
				0,
				.69444,
				0,
				0,
				.61111
			],
			"926": [
				0,
				.69444,
				0,
				0,
				.66667
			],
			"928": [
				0,
				.69444,
				0,
				0,
				.70834
			],
			"931": [
				0,
				.69444,
				0,
				0,
				.72222
			],
			"933": [
				0,
				.69444,
				0,
				0,
				.77778
			],
			"934": [
				0,
				.69444,
				0,
				0,
				.72222
			],
			"936": [
				0,
				.69444,
				0,
				0,
				.77778
			],
			"937": [
				0,
				.69444,
				0,
				0,
				.72222
			],
			"8211": [
				0,
				.44444,
				.02778,
				0,
				.5
			],
			"8212": [
				0,
				.44444,
				.02778,
				0,
				1
			],
			"8216": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"8217": [
				0,
				.69444,
				0,
				0,
				.27778
			],
			"8220": [
				0,
				.69444,
				0,
				0,
				.5
			],
			"8221": [
				0,
				.69444,
				0,
				0,
				.5
			]
		},
		"Script-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"65": [
				0,
				.7,
				.22925,
				0,
				.80253
			],
			"66": [
				0,
				.7,
				.04087,
				0,
				.90757
			],
			"67": [
				0,
				.7,
				.1689,
				0,
				.66619
			],
			"68": [
				0,
				.7,
				.09371,
				0,
				.77443
			],
			"69": [
				0,
				.7,
				.18583,
				0,
				.56162
			],
			"70": [
				0,
				.7,
				.13634,
				0,
				.89544
			],
			"71": [
				0,
				.7,
				.17322,
				0,
				.60961
			],
			"72": [
				0,
				.7,
				.29694,
				0,
				.96919
			],
			"73": [
				0,
				.7,
				.19189,
				0,
				.80907
			],
			"74": [
				.27778,
				.7,
				.19189,
				0,
				1.05159
			],
			"75": [
				0,
				.7,
				.31259,
				0,
				.91364
			],
			"76": [
				0,
				.7,
				.19189,
				0,
				.87373
			],
			"77": [
				0,
				.7,
				.15981,
				0,
				1.08031
			],
			"78": [
				0,
				.7,
				.3525,
				0,
				.9015
			],
			"79": [
				0,
				.7,
				.08078,
				0,
				.73787
			],
			"80": [
				0,
				.7,
				.08078,
				0,
				1.01262
			],
			"81": [
				0,
				.7,
				.03305,
				0,
				.88282
			],
			"82": [
				0,
				.7,
				.06259,
				0,
				.85
			],
			"83": [
				0,
				.7,
				.19189,
				0,
				.86767
			],
			"84": [
				0,
				.7,
				.29087,
				0,
				.74697
			],
			"85": [
				0,
				.7,
				.25815,
				0,
				.79996
			],
			"86": [
				0,
				.7,
				.27523,
				0,
				.62204
			],
			"87": [
				0,
				.7,
				.27523,
				0,
				.80532
			],
			"88": [
				0,
				.7,
				.26006,
				0,
				.94445
			],
			"89": [
				0,
				.7,
				.2939,
				0,
				.70961
			],
			"90": [
				0,
				.7,
				.24037,
				0,
				.8212
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			]
		},
		"Size1-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"40": [
				.35001,
				.85,
				0,
				0,
				.45834
			],
			"41": [
				.35001,
				.85,
				0,
				0,
				.45834
			],
			"47": [
				.35001,
				.85,
				0,
				0,
				.57778
			],
			"91": [
				.35001,
				.85,
				0,
				0,
				.41667
			],
			"92": [
				.35001,
				.85,
				0,
				0,
				.57778
			],
			"93": [
				.35001,
				.85,
				0,
				0,
				.41667
			],
			"123": [
				.35001,
				.85,
				0,
				0,
				.58334
			],
			"125": [
				.35001,
				.85,
				0,
				0,
				.58334
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"710": [
				0,
				.72222,
				0,
				0,
				.55556
			],
			"732": [
				0,
				.72222,
				0,
				0,
				.55556
			],
			"770": [
				0,
				.72222,
				0,
				0,
				.55556
			],
			"771": [
				0,
				.72222,
				0,
				0,
				.55556
			],
			"8214": [
				-99e-5,
				.601,
				0,
				0,
				.77778
			],
			"8593": [
				1e-5,
				.6,
				0,
				0,
				.66667
			],
			"8595": [
				1e-5,
				.6,
				0,
				0,
				.66667
			],
			"8657": [
				1e-5,
				.6,
				0,
				0,
				.77778
			],
			"8659": [
				1e-5,
				.6,
				0,
				0,
				.77778
			],
			"8719": [
				.25001,
				.75,
				0,
				0,
				.94445
			],
			"8720": [
				.25001,
				.75,
				0,
				0,
				.94445
			],
			"8721": [
				.25001,
				.75,
				0,
				0,
				1.05556
			],
			"8730": [
				.35001,
				.85,
				0,
				0,
				1
			],
			"8739": [
				-.00599,
				.606,
				0,
				0,
				.33333
			],
			"8741": [
				-.00599,
				.606,
				0,
				0,
				.55556
			],
			"8747": [
				.30612,
				.805,
				.19445,
				0,
				.47222
			],
			"8748": [
				.306,
				.805,
				.19445,
				0,
				.47222
			],
			"8749": [
				.306,
				.805,
				.19445,
				0,
				.47222
			],
			"8750": [
				.30612,
				.805,
				.19445,
				0,
				.47222
			],
			"8896": [
				.25001,
				.75,
				0,
				0,
				.83334
			],
			"8897": [
				.25001,
				.75,
				0,
				0,
				.83334
			],
			"8898": [
				.25001,
				.75,
				0,
				0,
				.83334
			],
			"8899": [
				.25001,
				.75,
				0,
				0,
				.83334
			],
			"8968": [
				.35001,
				.85,
				0,
				0,
				.47222
			],
			"8969": [
				.35001,
				.85,
				0,
				0,
				.47222
			],
			"8970": [
				.35001,
				.85,
				0,
				0,
				.47222
			],
			"8971": [
				.35001,
				.85,
				0,
				0,
				.47222
			],
			"9168": [
				-99e-5,
				.601,
				0,
				0,
				.66667
			],
			"10216": [
				.35001,
				.85,
				0,
				0,
				.47222
			],
			"10217": [
				.35001,
				.85,
				0,
				0,
				.47222
			],
			"10752": [
				.25001,
				.75,
				0,
				0,
				1.11111
			],
			"10753": [
				.25001,
				.75,
				0,
				0,
				1.11111
			],
			"10754": [
				.25001,
				.75,
				0,
				0,
				1.11111
			],
			"10756": [
				.25001,
				.75,
				0,
				0,
				.83334
			],
			"10758": [
				.25001,
				.75,
				0,
				0,
				.83334
			]
		},
		"Size2-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"40": [
				.65002,
				1.15,
				0,
				0,
				.59722
			],
			"41": [
				.65002,
				1.15,
				0,
				0,
				.59722
			],
			"47": [
				.65002,
				1.15,
				0,
				0,
				.81111
			],
			"91": [
				.65002,
				1.15,
				0,
				0,
				.47222
			],
			"92": [
				.65002,
				1.15,
				0,
				0,
				.81111
			],
			"93": [
				.65002,
				1.15,
				0,
				0,
				.47222
			],
			"123": [
				.65002,
				1.15,
				0,
				0,
				.66667
			],
			"125": [
				.65002,
				1.15,
				0,
				0,
				.66667
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"710": [
				0,
				.75,
				0,
				0,
				1
			],
			"732": [
				0,
				.75,
				0,
				0,
				1
			],
			"770": [
				0,
				.75,
				0,
				0,
				1
			],
			"771": [
				0,
				.75,
				0,
				0,
				1
			],
			"8719": [
				.55001,
				1.05,
				0,
				0,
				1.27778
			],
			"8720": [
				.55001,
				1.05,
				0,
				0,
				1.27778
			],
			"8721": [
				.55001,
				1.05,
				0,
				0,
				1.44445
			],
			"8730": [
				.65002,
				1.15,
				0,
				0,
				1
			],
			"8747": [
				.86225,
				1.36,
				.44445,
				0,
				.55556
			],
			"8748": [
				.862,
				1.36,
				.44445,
				0,
				.55556
			],
			"8749": [
				.862,
				1.36,
				.44445,
				0,
				.55556
			],
			"8750": [
				.86225,
				1.36,
				.44445,
				0,
				.55556
			],
			"8896": [
				.55001,
				1.05,
				0,
				0,
				1.11111
			],
			"8897": [
				.55001,
				1.05,
				0,
				0,
				1.11111
			],
			"8898": [
				.55001,
				1.05,
				0,
				0,
				1.11111
			],
			"8899": [
				.55001,
				1.05,
				0,
				0,
				1.11111
			],
			"8968": [
				.65002,
				1.15,
				0,
				0,
				.52778
			],
			"8969": [
				.65002,
				1.15,
				0,
				0,
				.52778
			],
			"8970": [
				.65002,
				1.15,
				0,
				0,
				.52778
			],
			"8971": [
				.65002,
				1.15,
				0,
				0,
				.52778
			],
			"10216": [
				.65002,
				1.15,
				0,
				0,
				.61111
			],
			"10217": [
				.65002,
				1.15,
				0,
				0,
				.61111
			],
			"10752": [
				.55001,
				1.05,
				0,
				0,
				1.51112
			],
			"10753": [
				.55001,
				1.05,
				0,
				0,
				1.51112
			],
			"10754": [
				.55001,
				1.05,
				0,
				0,
				1.51112
			],
			"10756": [
				.55001,
				1.05,
				0,
				0,
				1.11111
			],
			"10758": [
				.55001,
				1.05,
				0,
				0,
				1.11111
			]
		},
		"Size3-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"40": [
				.95003,
				1.45,
				0,
				0,
				.73611
			],
			"41": [
				.95003,
				1.45,
				0,
				0,
				.73611
			],
			"47": [
				.95003,
				1.45,
				0,
				0,
				1.04445
			],
			"91": [
				.95003,
				1.45,
				0,
				0,
				.52778
			],
			"92": [
				.95003,
				1.45,
				0,
				0,
				1.04445
			],
			"93": [
				.95003,
				1.45,
				0,
				0,
				.52778
			],
			"123": [
				.95003,
				1.45,
				0,
				0,
				.75
			],
			"125": [
				.95003,
				1.45,
				0,
				0,
				.75
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"710": [
				0,
				.75,
				0,
				0,
				1.44445
			],
			"732": [
				0,
				.75,
				0,
				0,
				1.44445
			],
			"770": [
				0,
				.75,
				0,
				0,
				1.44445
			],
			"771": [
				0,
				.75,
				0,
				0,
				1.44445
			],
			"8730": [
				.95003,
				1.45,
				0,
				0,
				1
			],
			"8968": [
				.95003,
				1.45,
				0,
				0,
				.58334
			],
			"8969": [
				.95003,
				1.45,
				0,
				0,
				.58334
			],
			"8970": [
				.95003,
				1.45,
				0,
				0,
				.58334
			],
			"8971": [
				.95003,
				1.45,
				0,
				0,
				.58334
			],
			"10216": [
				.95003,
				1.45,
				0,
				0,
				.75
			],
			"10217": [
				.95003,
				1.45,
				0,
				0,
				.75
			]
		},
		"Size4-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.25
			],
			"40": [
				1.25003,
				1.75,
				0,
				0,
				.79167
			],
			"41": [
				1.25003,
				1.75,
				0,
				0,
				.79167
			],
			"47": [
				1.25003,
				1.75,
				0,
				0,
				1.27778
			],
			"91": [
				1.25003,
				1.75,
				0,
				0,
				.58334
			],
			"92": [
				1.25003,
				1.75,
				0,
				0,
				1.27778
			],
			"93": [
				1.25003,
				1.75,
				0,
				0,
				.58334
			],
			"123": [
				1.25003,
				1.75,
				0,
				0,
				.80556
			],
			"125": [
				1.25003,
				1.75,
				0,
				0,
				.80556
			],
			"160": [
				0,
				0,
				0,
				0,
				.25
			],
			"710": [
				0,
				.825,
				0,
				0,
				1.8889
			],
			"732": [
				0,
				.825,
				0,
				0,
				1.8889
			],
			"770": [
				0,
				.825,
				0,
				0,
				1.8889
			],
			"771": [
				0,
				.825,
				0,
				0,
				1.8889
			],
			"8730": [
				1.25003,
				1.75,
				0,
				0,
				1
			],
			"8968": [
				1.25003,
				1.75,
				0,
				0,
				.63889
			],
			"8969": [
				1.25003,
				1.75,
				0,
				0,
				.63889
			],
			"8970": [
				1.25003,
				1.75,
				0,
				0,
				.63889
			],
			"8971": [
				1.25003,
				1.75,
				0,
				0,
				.63889
			],
			"9115": [
				.64502,
				1.155,
				0,
				0,
				.875
			],
			"9116": [
				1e-5,
				.6,
				0,
				0,
				.875
			],
			"9117": [
				.64502,
				1.155,
				0,
				0,
				.875
			],
			"9118": [
				.64502,
				1.155,
				0,
				0,
				.875
			],
			"9119": [
				1e-5,
				.6,
				0,
				0,
				.875
			],
			"9120": [
				.64502,
				1.155,
				0,
				0,
				.875
			],
			"9121": [
				.64502,
				1.155,
				0,
				0,
				.66667
			],
			"9122": [
				-99e-5,
				.601,
				0,
				0,
				.66667
			],
			"9123": [
				.64502,
				1.155,
				0,
				0,
				.66667
			],
			"9124": [
				.64502,
				1.155,
				0,
				0,
				.66667
			],
			"9125": [
				-99e-5,
				.601,
				0,
				0,
				.66667
			],
			"9126": [
				.64502,
				1.155,
				0,
				0,
				.66667
			],
			"9127": [
				1e-5,
				.9,
				0,
				0,
				.88889
			],
			"9128": [
				.65002,
				1.15,
				0,
				0,
				.88889
			],
			"9129": [
				.90001,
				0,
				0,
				0,
				.88889
			],
			"9130": [
				0,
				.3,
				0,
				0,
				.88889
			],
			"9131": [
				1e-5,
				.9,
				0,
				0,
				.88889
			],
			"9132": [
				.65002,
				1.15,
				0,
				0,
				.88889
			],
			"9133": [
				.90001,
				0,
				0,
				0,
				.88889
			],
			"9143": [
				.88502,
				.915,
				0,
				0,
				1.05556
			],
			"10216": [
				1.25003,
				1.75,
				0,
				0,
				.80556
			],
			"10217": [
				1.25003,
				1.75,
				0,
				0,
				.80556
			],
			"57344": [
				-.00499,
				.605,
				0,
				0,
				1.05556
			],
			"57345": [
				-.00499,
				.605,
				0,
				0,
				1.05556
			],
			"57680": [
				0,
				.12,
				0,
				0,
				.45
			],
			"57681": [
				0,
				.12,
				0,
				0,
				.45
			],
			"57682": [
				0,
				.12,
				0,
				0,
				.45
			],
			"57683": [
				0,
				.12,
				0,
				0,
				.45
			]
		},
		"Typewriter-Regular": {
			"32": [
				0,
				0,
				0,
				0,
				.525
			],
			"33": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"34": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"35": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"36": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"37": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"38": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"39": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"40": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"41": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"42": [
				0,
				.52083,
				0,
				0,
				.525
			],
			"43": [
				-.08056,
				.53055,
				0,
				0,
				.525
			],
			"44": [
				.13889,
				.125,
				0,
				0,
				.525
			],
			"45": [
				-.08056,
				.53055,
				0,
				0,
				.525
			],
			"46": [
				0,
				.125,
				0,
				0,
				.525
			],
			"47": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"48": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"49": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"50": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"51": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"52": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"53": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"54": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"55": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"56": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"57": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"58": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"59": [
				.13889,
				.43056,
				0,
				0,
				.525
			],
			"60": [
				-.05556,
				.55556,
				0,
				0,
				.525
			],
			"61": [
				-.19549,
				.41562,
				0,
				0,
				.525
			],
			"62": [
				-.05556,
				.55556,
				0,
				0,
				.525
			],
			"63": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"64": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"65": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"66": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"67": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"68": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"69": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"70": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"71": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"72": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"73": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"74": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"75": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"76": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"77": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"78": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"79": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"80": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"81": [
				.13889,
				.61111,
				0,
				0,
				.525
			],
			"82": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"83": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"84": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"85": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"86": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"87": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"88": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"89": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"90": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"91": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"92": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"93": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"94": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"95": [
				.09514,
				0,
				0,
				0,
				.525
			],
			"96": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"97": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"98": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"99": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"100": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"101": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"102": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"103": [
				.22222,
				.43056,
				0,
				0,
				.525
			],
			"104": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"105": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"106": [
				.22222,
				.61111,
				0,
				0,
				.525
			],
			"107": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"108": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"109": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"110": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"111": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"112": [
				.22222,
				.43056,
				0,
				0,
				.525
			],
			"113": [
				.22222,
				.43056,
				0,
				0,
				.525
			],
			"114": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"115": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"116": [
				0,
				.55358,
				0,
				0,
				.525
			],
			"117": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"118": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"119": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"120": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"121": [
				.22222,
				.43056,
				0,
				0,
				.525
			],
			"122": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"123": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"124": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"125": [
				.08333,
				.69444,
				0,
				0,
				.525
			],
			"126": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"127": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"160": [
				0,
				0,
				0,
				0,
				.525
			],
			"176": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"184": [
				.19445,
				0,
				0,
				0,
				.525
			],
			"305": [
				0,
				.43056,
				0,
				0,
				.525
			],
			"567": [
				.22222,
				.43056,
				0,
				0,
				.525
			],
			"711": [
				0,
				.56597,
				0,
				0,
				.525
			],
			"713": [
				0,
				.56555,
				0,
				0,
				.525
			],
			"714": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"715": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"728": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"730": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"770": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"771": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"776": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"915": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"916": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"920": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"923": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"926": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"928": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"931": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"933": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"934": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"936": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"937": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"8216": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"8217": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"8242": [
				0,
				.61111,
				0,
				0,
				.525
			],
			"9251": [
				.11111,
				.21944,
				0,
				0,
				.525
			]
		}
	};
	var sigmasAndXis = {
		slant: [
			.25,
			.25,
			.25
		],
		space: [
			0,
			0,
			0
		],
		stretch: [
			0,
			0,
			0
		],
		shrink: [
			0,
			0,
			0
		],
		xHeight: [
			.431,
			.431,
			.431
		],
		quad: [
			1,
			1.171,
			1.472
		],
		extraSpace: [
			0,
			0,
			0
		],
		num1: [
			.677,
			.732,
			.925
		],
		num2: [
			.394,
			.384,
			.387
		],
		num3: [
			.444,
			.471,
			.504
		],
		denom1: [
			.686,
			.752,
			1.025
		],
		denom2: [
			.345,
			.344,
			.532
		],
		sup1: [
			.413,
			.503,
			.504
		],
		sup2: [
			.363,
			.431,
			.404
		],
		sup3: [
			.289,
			.286,
			.294
		],
		sub1: [
			.15,
			.143,
			.2
		],
		sub2: [
			.247,
			.286,
			.4
		],
		supDrop: [
			.386,
			.353,
			.494
		],
		subDrop: [
			.05,
			.071,
			.1
		],
		delim1: [
			2.39,
			1.7,
			1.98
		],
		delim2: [
			1.01,
			1.157,
			1.42
		],
		axisHeight: [
			.25,
			.25,
			.25
		],
		defaultRuleThickness: [
			.04,
			.049,
			.049
		],
		bigOpSpacing1: [
			.111,
			.111,
			.111
		],
		bigOpSpacing2: [
			.166,
			.166,
			.166
		],
		bigOpSpacing3: [
			.2,
			.2,
			.2
		],
		bigOpSpacing4: [
			.6,
			.611,
			.611
		],
		bigOpSpacing5: [
			.1,
			.143,
			.143
		],
		sqrtRuleThickness: [
			.04,
			.04,
			.04
		],
		ptPerEm: [
			10,
			10,
			10
		],
		doubleRuleSep: [
			.2,
			.2,
			.2
		],
		arrayRuleWidth: [
			.04,
			.04,
			.04
		],
		fboxsep: [
			.3,
			.3,
			.3
		],
		fboxrule: [
			.04,
			.04,
			.04
		]
	};
	var extraCharacterMap = {
		"Å": "A",
		"Ð": "D",
		"Þ": "o",
		"å": "a",
		"ð": "d",
		"þ": "o",
		"А": "A",
		"Б": "B",
		"В": "B",
		"Г": "F",
		"Д": "A",
		"Е": "E",
		"Ж": "K",
		"З": "3",
		"И": "N",
		"Й": "N",
		"К": "K",
		"Л": "N",
		"М": "M",
		"Н": "H",
		"О": "O",
		"П": "N",
		"Р": "P",
		"С": "C",
		"Т": "T",
		"У": "y",
		"Ф": "O",
		"Х": "X",
		"Ц": "U",
		"Ч": "h",
		"Ш": "W",
		"Щ": "W",
		"Ъ": "B",
		"Ы": "X",
		"Ь": "B",
		"Э": "3",
		"Ю": "X",
		"Я": "R",
		"а": "a",
		"б": "b",
		"в": "a",
		"г": "r",
		"д": "y",
		"е": "e",
		"ж": "m",
		"з": "e",
		"и": "n",
		"й": "n",
		"к": "n",
		"л": "n",
		"м": "m",
		"н": "n",
		"о": "o",
		"п": "n",
		"р": "p",
		"с": "c",
		"т": "o",
		"у": "y",
		"ф": "b",
		"х": "x",
		"ц": "n",
		"ч": "n",
		"ш": "w",
		"щ": "w",
		"ъ": "a",
		"ы": "m",
		"ь": "a",
		"э": "e",
		"ю": "m",
		"я": "r"
	};
	function setFontMetrics(fontName, metrics) {
		fontMetricsData[fontName] = metrics;
	}
	function getCharacterMetrics(character, font, mode) {
		if (!fontMetricsData[font]) throw new Error("Font metrics not found for font: " + font + ".");
		var ch = character.charCodeAt(0);
		var metrics = fontMetricsData[font][ch];
		if (!metrics && character[0] in extraCharacterMap) {
			ch = extraCharacterMap[character[0]].charCodeAt(0);
			metrics = fontMetricsData[font][ch];
		}
		if (!metrics && mode === "text") {
			if (supportedCodepoint(ch)) metrics = fontMetricsData[font][77];
		}
		if (metrics) return {
			depth: metrics[0],
			height: metrics[1],
			italic: metrics[2],
			skew: metrics[3],
			width: metrics[4]
		};
	}
	var fontMetricsBySizeIndex = {};
	function getGlobalMetrics(size) {
		var sizeIndex;
		if (size >= 5) sizeIndex = 0;
		else if (size >= 3) sizeIndex = 1;
		else sizeIndex = 2;
		if (!fontMetricsBySizeIndex[sizeIndex]) {
			var metrics = fontMetricsBySizeIndex[sizeIndex] = { cssEmPerMu: sigmasAndXis.quad[sizeIndex] / 18 };
			for (var key in sigmasAndXis) if (sigmasAndXis.hasOwnProperty(key)) metrics[key] = sigmasAndXis[key][sizeIndex];
		}
		return fontMetricsBySizeIndex[sizeIndex];
	}
	var symbols = {
		"math": {},
		"text": {}
	};
	function defineSymbol(mode, font, group, replace, name, acceptUnicodeChar) {
		symbols[mode][name] = {
			font,
			group,
			replace
		};
		if (acceptUnicodeChar && replace) symbols[mode][replace] = symbols[mode][name];
	}
	var math = "math";
	var text = "text";
	var main = "main";
	var ams = "ams";
	var accent = "accent-token";
	var bin = "bin";
	var close = "close";
	var inner = "inner";
	var mathord = "mathord";
	var op = "op-token";
	var open = "open";
	var punct = "punct";
	var rel = "rel";
	var spacing = "spacing";
	var textord = "textord";
	defineSymbol(math, main, rel, "≡", "\\equiv", true);
	defineSymbol(math, main, rel, "≺", "\\prec", true);
	defineSymbol(math, main, rel, "≻", "\\succ", true);
	defineSymbol(math, main, rel, "∼", "\\sim", true);
	defineSymbol(math, main, rel, "⊥", "\\perp");
	defineSymbol(math, main, rel, "⪯", "\\preceq", true);
	defineSymbol(math, main, rel, "⪰", "\\succeq", true);
	defineSymbol(math, main, rel, "≃", "\\simeq", true);
	defineSymbol(math, main, rel, "∣", "\\mid", true);
	defineSymbol(math, main, rel, "≪", "\\ll", true);
	defineSymbol(math, main, rel, "≫", "\\gg", true);
	defineSymbol(math, main, rel, "≍", "\\asymp", true);
	defineSymbol(math, main, rel, "∥", "\\parallel");
	defineSymbol(math, main, rel, "⋈", "\\bowtie", true);
	defineSymbol(math, main, rel, "⌣", "\\smile", true);
	defineSymbol(math, main, rel, "⊑", "\\sqsubseteq", true);
	defineSymbol(math, main, rel, "⊒", "\\sqsupseteq", true);
	defineSymbol(math, main, rel, "≐", "\\doteq", true);
	defineSymbol(math, main, rel, "⌢", "\\frown", true);
	defineSymbol(math, main, rel, "∋", "\\ni", true);
	defineSymbol(math, main, rel, "∝", "\\propto", true);
	defineSymbol(math, main, rel, "⊢", "\\vdash", true);
	defineSymbol(math, main, rel, "⊣", "\\dashv", true);
	defineSymbol(math, main, rel, "∋", "\\owns");
	defineSymbol(math, main, punct, ".", "\\ldotp");
	defineSymbol(math, main, punct, "⋅", "\\cdotp");
	defineSymbol(math, main, punct, "⋅", "·");
	defineSymbol(text, main, textord, "⋅", "·");
	defineSymbol(math, main, textord, "#", "\\#");
	defineSymbol(text, main, textord, "#", "\\#");
	defineSymbol(math, main, textord, "&", "\\&");
	defineSymbol(text, main, textord, "&", "\\&");
	defineSymbol(math, main, textord, "ℵ", "\\aleph", true);
	defineSymbol(math, main, textord, "∀", "\\forall", true);
	defineSymbol(math, main, textord, "ℏ", "\\hbar", true);
	defineSymbol(math, main, textord, "∃", "\\exists", true);
	defineSymbol(math, main, textord, "∇", "\\nabla", true);
	defineSymbol(math, main, textord, "♭", "\\flat", true);
	defineSymbol(math, main, textord, "ℓ", "\\ell", true);
	defineSymbol(math, main, textord, "♮", "\\natural", true);
	defineSymbol(math, main, textord, "♣", "\\clubsuit", true);
	defineSymbol(math, main, textord, "℘", "\\wp", true);
	defineSymbol(math, main, textord, "♯", "\\sharp", true);
	defineSymbol(math, main, textord, "♢", "\\diamondsuit", true);
	defineSymbol(math, main, textord, "ℜ", "\\Re", true);
	defineSymbol(math, main, textord, "♡", "\\heartsuit", true);
	defineSymbol(math, main, textord, "ℑ", "\\Im", true);
	defineSymbol(math, main, textord, "♠", "\\spadesuit", true);
	defineSymbol(math, main, textord, "§", "\\S", true);
	defineSymbol(text, main, textord, "§", "\\S");
	defineSymbol(math, main, textord, "¶", "\\P", true);
	defineSymbol(text, main, textord, "¶", "\\P");
	defineSymbol(math, main, textord, "†", "\\dag");
	defineSymbol(text, main, textord, "†", "\\dag");
	defineSymbol(text, main, textord, "†", "\\textdagger");
	defineSymbol(math, main, textord, "‡", "\\ddag");
	defineSymbol(text, main, textord, "‡", "\\ddag");
	defineSymbol(text, main, textord, "‡", "\\textdaggerdbl");
	defineSymbol(math, main, close, "⎱", "\\rmoustache", true);
	defineSymbol(math, main, open, "⎰", "\\lmoustache", true);
	defineSymbol(math, main, close, "⟯", "\\rgroup", true);
	defineSymbol(math, main, open, "⟮", "\\lgroup", true);
	defineSymbol(math, main, bin, "∓", "\\mp", true);
	defineSymbol(math, main, bin, "⊖", "\\ominus", true);
	defineSymbol(math, main, bin, "⊎", "\\uplus", true);
	defineSymbol(math, main, bin, "⊓", "\\sqcap", true);
	defineSymbol(math, main, bin, "∗", "\\ast");
	defineSymbol(math, main, bin, "⊔", "\\sqcup", true);
	defineSymbol(math, main, bin, "◯", "\\bigcirc", true);
	defineSymbol(math, main, bin, "∙", "\\bullet", true);
	defineSymbol(math, main, bin, "‡", "\\ddagger");
	defineSymbol(math, main, bin, "≀", "\\wr", true);
	defineSymbol(math, main, bin, "⨿", "\\amalg");
	defineSymbol(math, main, bin, "&", "\\And");
	defineSymbol(math, main, rel, "⟵", "\\longleftarrow", true);
	defineSymbol(math, main, rel, "⇐", "\\Leftarrow", true);
	defineSymbol(math, main, rel, "⟸", "\\Longleftarrow", true);
	defineSymbol(math, main, rel, "⟶", "\\longrightarrow", true);
	defineSymbol(math, main, rel, "⇒", "\\Rightarrow", true);
	defineSymbol(math, main, rel, "⟹", "\\Longrightarrow", true);
	defineSymbol(math, main, rel, "↔", "\\leftrightarrow", true);
	defineSymbol(math, main, rel, "⟷", "\\longleftrightarrow", true);
	defineSymbol(math, main, rel, "⇔", "\\Leftrightarrow", true);
	defineSymbol(math, main, rel, "⟺", "\\Longleftrightarrow", true);
	defineSymbol(math, main, rel, "↦", "\\mapsto", true);
	defineSymbol(math, main, rel, "⟼", "\\longmapsto", true);
	defineSymbol(math, main, rel, "↗", "\\nearrow", true);
	defineSymbol(math, main, rel, "↩", "\\hookleftarrow", true);
	defineSymbol(math, main, rel, "↪", "\\hookrightarrow", true);
	defineSymbol(math, main, rel, "↘", "\\searrow", true);
	defineSymbol(math, main, rel, "↼", "\\leftharpoonup", true);
	defineSymbol(math, main, rel, "⇀", "\\rightharpoonup", true);
	defineSymbol(math, main, rel, "↙", "\\swarrow", true);
	defineSymbol(math, main, rel, "↽", "\\leftharpoondown", true);
	defineSymbol(math, main, rel, "⇁", "\\rightharpoondown", true);
	defineSymbol(math, main, rel, "↖", "\\nwarrow", true);
	defineSymbol(math, main, rel, "⇌", "\\rightleftharpoons", true);
	defineSymbol(math, ams, rel, "≮", "\\nless", true);
	defineSymbol(math, ams, rel, "", "\\@nleqslant");
	defineSymbol(math, ams, rel, "", "\\@nleqq");
	defineSymbol(math, ams, rel, "⪇", "\\lneq", true);
	defineSymbol(math, ams, rel, "≨", "\\lneqq", true);
	defineSymbol(math, ams, rel, "", "\\@lvertneqq");
	defineSymbol(math, ams, rel, "⋦", "\\lnsim", true);
	defineSymbol(math, ams, rel, "⪉", "\\lnapprox", true);
	defineSymbol(math, ams, rel, "⊀", "\\nprec", true);
	defineSymbol(math, ams, rel, "⋠", "\\npreceq", true);
	defineSymbol(math, ams, rel, "⋨", "\\precnsim", true);
	defineSymbol(math, ams, rel, "⪹", "\\precnapprox", true);
	defineSymbol(math, ams, rel, "≁", "\\nsim", true);
	defineSymbol(math, ams, rel, "", "\\@nshortmid");
	defineSymbol(math, ams, rel, "∤", "\\nmid", true);
	defineSymbol(math, ams, rel, "⊬", "\\nvdash", true);
	defineSymbol(math, ams, rel, "⊭", "\\nvDash", true);
	defineSymbol(math, ams, rel, "⋪", "\\ntriangleleft");
	defineSymbol(math, ams, rel, "⋬", "\\ntrianglelefteq", true);
	defineSymbol(math, ams, rel, "⊊", "\\subsetneq", true);
	defineSymbol(math, ams, rel, "", "\\@varsubsetneq");
	defineSymbol(math, ams, rel, "⫋", "\\subsetneqq", true);
	defineSymbol(math, ams, rel, "", "\\@varsubsetneqq");
	defineSymbol(math, ams, rel, "≯", "\\ngtr", true);
	defineSymbol(math, ams, rel, "", "\\@ngeqslant");
	defineSymbol(math, ams, rel, "", "\\@ngeqq");
	defineSymbol(math, ams, rel, "⪈", "\\gneq", true);
	defineSymbol(math, ams, rel, "≩", "\\gneqq", true);
	defineSymbol(math, ams, rel, "", "\\@gvertneqq");
	defineSymbol(math, ams, rel, "⋧", "\\gnsim", true);
	defineSymbol(math, ams, rel, "⪊", "\\gnapprox", true);
	defineSymbol(math, ams, rel, "⊁", "\\nsucc", true);
	defineSymbol(math, ams, rel, "⋡", "\\nsucceq", true);
	defineSymbol(math, ams, rel, "⋩", "\\succnsim", true);
	defineSymbol(math, ams, rel, "⪺", "\\succnapprox", true);
	defineSymbol(math, ams, rel, "≆", "\\ncong", true);
	defineSymbol(math, ams, rel, "", "\\@nshortparallel");
	defineSymbol(math, ams, rel, "∦", "\\nparallel", true);
	defineSymbol(math, ams, rel, "⊯", "\\nVDash", true);
	defineSymbol(math, ams, rel, "⋫", "\\ntriangleright");
	defineSymbol(math, ams, rel, "⋭", "\\ntrianglerighteq", true);
	defineSymbol(math, ams, rel, "", "\\@nsupseteqq");
	defineSymbol(math, ams, rel, "⊋", "\\supsetneq", true);
	defineSymbol(math, ams, rel, "", "\\@varsupsetneq");
	defineSymbol(math, ams, rel, "⫌", "\\supsetneqq", true);
	defineSymbol(math, ams, rel, "", "\\@varsupsetneqq");
	defineSymbol(math, ams, rel, "⊮", "\\nVdash", true);
	defineSymbol(math, ams, rel, "⪵", "\\precneqq", true);
	defineSymbol(math, ams, rel, "⪶", "\\succneqq", true);
	defineSymbol(math, ams, rel, "", "\\@nsubseteqq");
	defineSymbol(math, ams, bin, "⊴", "\\unlhd");
	defineSymbol(math, ams, bin, "⊵", "\\unrhd");
	defineSymbol(math, ams, rel, "↚", "\\nleftarrow", true);
	defineSymbol(math, ams, rel, "↛", "\\nrightarrow", true);
	defineSymbol(math, ams, rel, "⇍", "\\nLeftarrow", true);
	defineSymbol(math, ams, rel, "⇏", "\\nRightarrow", true);
	defineSymbol(math, ams, rel, "↮", "\\nleftrightarrow", true);
	defineSymbol(math, ams, rel, "⇎", "\\nLeftrightarrow", true);
	defineSymbol(math, ams, rel, "△", "\\vartriangle");
	defineSymbol(math, ams, textord, "ℏ", "\\hslash");
	defineSymbol(math, ams, textord, "▽", "\\triangledown");
	defineSymbol(math, ams, textord, "◊", "\\lozenge");
	defineSymbol(math, ams, textord, "Ⓢ", "\\circledS");
	defineSymbol(math, ams, textord, "®", "\\circledR");
	defineSymbol(text, ams, textord, "®", "\\circledR");
	defineSymbol(math, ams, textord, "∡", "\\measuredangle", true);
	defineSymbol(math, ams, textord, "∄", "\\nexists");
	defineSymbol(math, ams, textord, "℧", "\\mho");
	defineSymbol(math, ams, textord, "Ⅎ", "\\Finv", true);
	defineSymbol(math, ams, textord, "⅁", "\\Game", true);
	defineSymbol(math, ams, textord, "‵", "\\backprime");
	defineSymbol(math, ams, textord, "▲", "\\blacktriangle");
	defineSymbol(math, ams, textord, "▼", "\\blacktriangledown");
	defineSymbol(math, ams, textord, "■", "\\blacksquare");
	defineSymbol(math, ams, textord, "⧫", "\\blacklozenge");
	defineSymbol(math, ams, textord, "★", "\\bigstar");
	defineSymbol(math, ams, textord, "∢", "\\sphericalangle", true);
	defineSymbol(math, ams, textord, "∁", "\\complement", true);
	defineSymbol(math, ams, textord, "ð", "\\eth", true);
	defineSymbol(text, main, textord, "ð", "ð");
	defineSymbol(math, ams, textord, "╱", "\\diagup");
	defineSymbol(math, ams, textord, "╲", "\\diagdown");
	defineSymbol(math, ams, textord, "□", "\\square");
	defineSymbol(math, ams, textord, "□", "\\Box");
	defineSymbol(math, ams, textord, "◊", "\\Diamond");
	defineSymbol(math, ams, textord, "¥", "\\yen", true);
	defineSymbol(text, ams, textord, "¥", "\\yen", true);
	defineSymbol(math, ams, textord, "✓", "\\checkmark", true);
	defineSymbol(text, ams, textord, "✓", "\\checkmark");
	defineSymbol(math, ams, textord, "ℶ", "\\beth", true);
	defineSymbol(math, ams, textord, "ℸ", "\\daleth", true);
	defineSymbol(math, ams, textord, "ℷ", "\\gimel", true);
	defineSymbol(math, ams, textord, "ϝ", "\\digamma", true);
	defineSymbol(math, ams, textord, "ϰ", "\\varkappa");
	defineSymbol(math, ams, open, "┌", "\\@ulcorner", true);
	defineSymbol(math, ams, close, "┐", "\\@urcorner", true);
	defineSymbol(math, ams, open, "└", "\\@llcorner", true);
	defineSymbol(math, ams, close, "┘", "\\@lrcorner", true);
	defineSymbol(math, ams, rel, "≦", "\\leqq", true);
	defineSymbol(math, ams, rel, "⩽", "\\leqslant", true);
	defineSymbol(math, ams, rel, "⪕", "\\eqslantless", true);
	defineSymbol(math, ams, rel, "≲", "\\lesssim", true);
	defineSymbol(math, ams, rel, "⪅", "\\lessapprox", true);
	defineSymbol(math, ams, rel, "≊", "\\approxeq", true);
	defineSymbol(math, ams, bin, "⋖", "\\lessdot");
	defineSymbol(math, ams, rel, "⋘", "\\lll", true);
	defineSymbol(math, ams, rel, "≶", "\\lessgtr", true);
	defineSymbol(math, ams, rel, "⋚", "\\lesseqgtr", true);
	defineSymbol(math, ams, rel, "⪋", "\\lesseqqgtr", true);
	defineSymbol(math, ams, rel, "≑", "\\doteqdot");
	defineSymbol(math, ams, rel, "≓", "\\risingdotseq", true);
	defineSymbol(math, ams, rel, "≒", "\\fallingdotseq", true);
	defineSymbol(math, ams, rel, "∽", "\\backsim", true);
	defineSymbol(math, ams, rel, "⋍", "\\backsimeq", true);
	defineSymbol(math, ams, rel, "⫅", "\\subseteqq", true);
	defineSymbol(math, ams, rel, "⋐", "\\Subset", true);
	defineSymbol(math, ams, rel, "⊏", "\\sqsubset", true);
	defineSymbol(math, ams, rel, "≼", "\\preccurlyeq", true);
	defineSymbol(math, ams, rel, "⋞", "\\curlyeqprec", true);
	defineSymbol(math, ams, rel, "≾", "\\precsim", true);
	defineSymbol(math, ams, rel, "⪷", "\\precapprox", true);
	defineSymbol(math, ams, rel, "⊲", "\\vartriangleleft");
	defineSymbol(math, ams, rel, "⊴", "\\trianglelefteq");
	defineSymbol(math, ams, rel, "⊨", "\\vDash", true);
	defineSymbol(math, ams, rel, "⊪", "\\Vvdash", true);
	defineSymbol(math, ams, rel, "⌣", "\\smallsmile");
	defineSymbol(math, ams, rel, "⌢", "\\smallfrown");
	defineSymbol(math, ams, rel, "≏", "\\bumpeq", true);
	defineSymbol(math, ams, rel, "≎", "\\Bumpeq", true);
	defineSymbol(math, ams, rel, "≧", "\\geqq", true);
	defineSymbol(math, ams, rel, "⩾", "\\geqslant", true);
	defineSymbol(math, ams, rel, "⪖", "\\eqslantgtr", true);
	defineSymbol(math, ams, rel, "≳", "\\gtrsim", true);
	defineSymbol(math, ams, rel, "⪆", "\\gtrapprox", true);
	defineSymbol(math, ams, bin, "⋗", "\\gtrdot");
	defineSymbol(math, ams, rel, "⋙", "\\ggg", true);
	defineSymbol(math, ams, rel, "≷", "\\gtrless", true);
	defineSymbol(math, ams, rel, "⋛", "\\gtreqless", true);
	defineSymbol(math, ams, rel, "⪌", "\\gtreqqless", true);
	defineSymbol(math, ams, rel, "≖", "\\eqcirc", true);
	defineSymbol(math, ams, rel, "≗", "\\circeq", true);
	defineSymbol(math, ams, rel, "≜", "\\triangleq", true);
	defineSymbol(math, ams, rel, "∼", "\\thicksim");
	defineSymbol(math, ams, rel, "≈", "\\thickapprox");
	defineSymbol(math, ams, rel, "⫆", "\\supseteqq", true);
	defineSymbol(math, ams, rel, "⋑", "\\Supset", true);
	defineSymbol(math, ams, rel, "⊐", "\\sqsupset", true);
	defineSymbol(math, ams, rel, "≽", "\\succcurlyeq", true);
	defineSymbol(math, ams, rel, "⋟", "\\curlyeqsucc", true);
	defineSymbol(math, ams, rel, "≿", "\\succsim", true);
	defineSymbol(math, ams, rel, "⪸", "\\succapprox", true);
	defineSymbol(math, ams, rel, "⊳", "\\vartriangleright");
	defineSymbol(math, ams, rel, "⊵", "\\trianglerighteq");
	defineSymbol(math, ams, rel, "⊩", "\\Vdash", true);
	defineSymbol(math, ams, rel, "∣", "\\shortmid");
	defineSymbol(math, ams, rel, "∥", "\\shortparallel");
	defineSymbol(math, ams, rel, "≬", "\\between", true);
	defineSymbol(math, ams, rel, "⋔", "\\pitchfork", true);
	defineSymbol(math, ams, rel, "∝", "\\varpropto");
	defineSymbol(math, ams, rel, "◀", "\\blacktriangleleft");
	defineSymbol(math, ams, rel, "∴", "\\therefore", true);
	defineSymbol(math, ams, rel, "∍", "\\backepsilon");
	defineSymbol(math, ams, rel, "▶", "\\blacktriangleright");
	defineSymbol(math, ams, rel, "∵", "\\because", true);
	defineSymbol(math, ams, rel, "⋘", "\\llless");
	defineSymbol(math, ams, rel, "⋙", "\\gggtr");
	defineSymbol(math, ams, bin, "⊲", "\\lhd");
	defineSymbol(math, ams, bin, "⊳", "\\rhd");
	defineSymbol(math, ams, rel, "≂", "\\eqsim", true);
	defineSymbol(math, main, rel, "⋈", "\\Join");
	defineSymbol(math, ams, rel, "≑", "\\Doteq", true);
	defineSymbol(math, ams, bin, "∔", "\\dotplus", true);
	defineSymbol(math, ams, bin, "∖", "\\smallsetminus");
	defineSymbol(math, ams, bin, "⋒", "\\Cap", true);
	defineSymbol(math, ams, bin, "⋓", "\\Cup", true);
	defineSymbol(math, ams, bin, "⩞", "\\doublebarwedge", true);
	defineSymbol(math, ams, bin, "⊟", "\\boxminus", true);
	defineSymbol(math, ams, bin, "⊞", "\\boxplus", true);
	defineSymbol(math, ams, bin, "⋇", "\\divideontimes", true);
	defineSymbol(math, ams, bin, "⋉", "\\ltimes", true);
	defineSymbol(math, ams, bin, "⋊", "\\rtimes", true);
	defineSymbol(math, ams, bin, "⋋", "\\leftthreetimes", true);
	defineSymbol(math, ams, bin, "⋌", "\\rightthreetimes", true);
	defineSymbol(math, ams, bin, "⋏", "\\curlywedge", true);
	defineSymbol(math, ams, bin, "⋎", "\\curlyvee", true);
	defineSymbol(math, ams, bin, "⊝", "\\circleddash", true);
	defineSymbol(math, ams, bin, "⊛", "\\circledast", true);
	defineSymbol(math, ams, bin, "⋅", "\\centerdot");
	defineSymbol(math, ams, bin, "⊺", "\\intercal", true);
	defineSymbol(math, ams, bin, "⋒", "\\doublecap");
	defineSymbol(math, ams, bin, "⋓", "\\doublecup");
	defineSymbol(math, ams, bin, "⊠", "\\boxtimes", true);
	defineSymbol(math, ams, rel, "⇢", "\\dashrightarrow", true);
	defineSymbol(math, ams, rel, "⇠", "\\dashleftarrow", true);
	defineSymbol(math, ams, rel, "⇇", "\\leftleftarrows", true);
	defineSymbol(math, ams, rel, "⇆", "\\leftrightarrows", true);
	defineSymbol(math, ams, rel, "⇚", "\\Lleftarrow", true);
	defineSymbol(math, ams, rel, "↞", "\\twoheadleftarrow", true);
	defineSymbol(math, ams, rel, "↢", "\\leftarrowtail", true);
	defineSymbol(math, ams, rel, "↫", "\\looparrowleft", true);
	defineSymbol(math, ams, rel, "⇋", "\\leftrightharpoons", true);
	defineSymbol(math, ams, rel, "↶", "\\curvearrowleft", true);
	defineSymbol(math, ams, rel, "↺", "\\circlearrowleft", true);
	defineSymbol(math, ams, rel, "↰", "\\Lsh", true);
	defineSymbol(math, ams, rel, "⇈", "\\upuparrows", true);
	defineSymbol(math, ams, rel, "↿", "\\upharpoonleft", true);
	defineSymbol(math, ams, rel, "⇃", "\\downharpoonleft", true);
	defineSymbol(math, main, rel, "⊶", "\\origof", true);
	defineSymbol(math, main, rel, "⊷", "\\imageof", true);
	defineSymbol(math, ams, rel, "⊸", "\\multimap", true);
	defineSymbol(math, ams, rel, "↭", "\\leftrightsquigarrow", true);
	defineSymbol(math, ams, rel, "⇉", "\\rightrightarrows", true);
	defineSymbol(math, ams, rel, "⇄", "\\rightleftarrows", true);
	defineSymbol(math, ams, rel, "↠", "\\twoheadrightarrow", true);
	defineSymbol(math, ams, rel, "↣", "\\rightarrowtail", true);
	defineSymbol(math, ams, rel, "↬", "\\looparrowright", true);
	defineSymbol(math, ams, rel, "↷", "\\curvearrowright", true);
	defineSymbol(math, ams, rel, "↻", "\\circlearrowright", true);
	defineSymbol(math, ams, rel, "↱", "\\Rsh", true);
	defineSymbol(math, ams, rel, "⇊", "\\downdownarrows", true);
	defineSymbol(math, ams, rel, "↾", "\\upharpoonright", true);
	defineSymbol(math, ams, rel, "⇂", "\\downharpoonright", true);
	defineSymbol(math, ams, rel, "⇝", "\\rightsquigarrow", true);
	defineSymbol(math, ams, rel, "⇝", "\\leadsto");
	defineSymbol(math, ams, rel, "⇛", "\\Rrightarrow", true);
	defineSymbol(math, ams, rel, "↾", "\\restriction");
	defineSymbol(math, main, textord, "‘", "`");
	defineSymbol(math, main, textord, "$", "\\$");
	defineSymbol(text, main, textord, "$", "\\$");
	defineSymbol(text, main, textord, "$", "\\textdollar");
	defineSymbol(math, main, textord, "%", "\\%");
	defineSymbol(text, main, textord, "%", "\\%");
	defineSymbol(math, main, textord, "_", "\\_");
	defineSymbol(text, main, textord, "_", "\\_");
	defineSymbol(text, main, textord, "_", "\\textunderscore");
	defineSymbol(math, main, textord, "∠", "\\angle", true);
	defineSymbol(math, main, textord, "∞", "\\infty", true);
	defineSymbol(math, main, textord, "′", "\\prime");
	defineSymbol(math, main, textord, "△", "\\triangle");
	defineSymbol(math, main, textord, "Γ", "\\Gamma", true);
	defineSymbol(math, main, textord, "Δ", "\\Delta", true);
	defineSymbol(math, main, textord, "Θ", "\\Theta", true);
	defineSymbol(math, main, textord, "Λ", "\\Lambda", true);
	defineSymbol(math, main, textord, "Ξ", "\\Xi", true);
	defineSymbol(math, main, textord, "Π", "\\Pi", true);
	defineSymbol(math, main, textord, "Σ", "\\Sigma", true);
	defineSymbol(math, main, textord, "Υ", "\\Upsilon", true);
	defineSymbol(math, main, textord, "Φ", "\\Phi", true);
	defineSymbol(math, main, textord, "Ψ", "\\Psi", true);
	defineSymbol(math, main, textord, "Ω", "\\Omega", true);
	defineSymbol(math, main, textord, "A", "Α");
	defineSymbol(math, main, textord, "B", "Β");
	defineSymbol(math, main, textord, "E", "Ε");
	defineSymbol(math, main, textord, "Z", "Ζ");
	defineSymbol(math, main, textord, "H", "Η");
	defineSymbol(math, main, textord, "I", "Ι");
	defineSymbol(math, main, textord, "K", "Κ");
	defineSymbol(math, main, textord, "M", "Μ");
	defineSymbol(math, main, textord, "N", "Ν");
	defineSymbol(math, main, textord, "O", "Ο");
	defineSymbol(math, main, textord, "P", "Ρ");
	defineSymbol(math, main, textord, "T", "Τ");
	defineSymbol(math, main, textord, "X", "Χ");
	defineSymbol(math, main, textord, "¬", "\\neg", true);
	defineSymbol(math, main, textord, "¬", "\\lnot");
	defineSymbol(math, main, textord, "⊤", "\\top");
	defineSymbol(math, main, textord, "⊥", "\\bot");
	defineSymbol(math, main, textord, "∅", "\\emptyset");
	defineSymbol(math, ams, textord, "∅", "\\varnothing");
	defineSymbol(math, main, mathord, "α", "\\alpha", true);
	defineSymbol(math, main, mathord, "β", "\\beta", true);
	defineSymbol(math, main, mathord, "γ", "\\gamma", true);
	defineSymbol(math, main, mathord, "δ", "\\delta", true);
	defineSymbol(math, main, mathord, "ϵ", "\\epsilon", true);
	defineSymbol(math, main, mathord, "ζ", "\\zeta", true);
	defineSymbol(math, main, mathord, "η", "\\eta", true);
	defineSymbol(math, main, mathord, "θ", "\\theta", true);
	defineSymbol(math, main, mathord, "ι", "\\iota", true);
	defineSymbol(math, main, mathord, "κ", "\\kappa", true);
	defineSymbol(math, main, mathord, "λ", "\\lambda", true);
	defineSymbol(math, main, mathord, "μ", "\\mu", true);
	defineSymbol(math, main, mathord, "ν", "\\nu", true);
	defineSymbol(math, main, mathord, "ξ", "\\xi", true);
	defineSymbol(math, main, mathord, "ο", "\\omicron", true);
	defineSymbol(math, main, mathord, "π", "\\pi", true);
	defineSymbol(math, main, mathord, "ρ", "\\rho", true);
	defineSymbol(math, main, mathord, "σ", "\\sigma", true);
	defineSymbol(math, main, mathord, "τ", "\\tau", true);
	defineSymbol(math, main, mathord, "υ", "\\upsilon", true);
	defineSymbol(math, main, mathord, "ϕ", "\\phi", true);
	defineSymbol(math, main, mathord, "χ", "\\chi", true);
	defineSymbol(math, main, mathord, "ψ", "\\psi", true);
	defineSymbol(math, main, mathord, "ω", "\\omega", true);
	defineSymbol(math, main, mathord, "ε", "\\varepsilon", true);
	defineSymbol(math, main, mathord, "ϑ", "\\vartheta", true);
	defineSymbol(math, main, mathord, "ϖ", "\\varpi", true);
	defineSymbol(math, main, mathord, "ϱ", "\\varrho", true);
	defineSymbol(math, main, mathord, "ς", "\\varsigma", true);
	defineSymbol(math, main, mathord, "φ", "\\varphi", true);
	defineSymbol(math, main, bin, "∗", "*", true);
	defineSymbol(math, main, bin, "+", "+");
	defineSymbol(math, main, bin, "−", "-", true);
	defineSymbol(math, main, bin, "⋅", "\\cdot", true);
	defineSymbol(math, main, bin, "∘", "\\circ", true);
	defineSymbol(math, main, bin, "÷", "\\div", true);
	defineSymbol(math, main, bin, "±", "\\pm", true);
	defineSymbol(math, main, bin, "×", "\\times", true);
	defineSymbol(math, main, bin, "∩", "\\cap", true);
	defineSymbol(math, main, bin, "∪", "\\cup", true);
	defineSymbol(math, main, bin, "∖", "\\setminus", true);
	defineSymbol(math, main, bin, "∧", "\\land");
	defineSymbol(math, main, bin, "∨", "\\lor");
	defineSymbol(math, main, bin, "∧", "\\wedge", true);
	defineSymbol(math, main, bin, "∨", "\\vee", true);
	defineSymbol(math, main, textord, "√", "\\surd");
	defineSymbol(math, main, open, "⟨", "\\langle", true);
	defineSymbol(math, main, open, "∣", "\\lvert");
	defineSymbol(math, main, open, "∥", "\\lVert");
	defineSymbol(math, main, close, "?", "?");
	defineSymbol(math, main, close, "!", "!");
	defineSymbol(math, main, close, "⟩", "\\rangle", true);
	defineSymbol(math, main, close, "∣", "\\rvert");
	defineSymbol(math, main, close, "∥", "\\rVert");
	defineSymbol(math, main, rel, "=", "=");
	defineSymbol(math, main, rel, ":", ":");
	defineSymbol(math, main, rel, "≈", "\\approx", true);
	defineSymbol(math, main, rel, "≅", "\\cong", true);
	defineSymbol(math, main, rel, "≥", "\\ge");
	defineSymbol(math, main, rel, "≥", "\\geq", true);
	defineSymbol(math, main, rel, "←", "\\gets");
	defineSymbol(math, main, rel, ">", "\\gt", true);
	defineSymbol(math, main, rel, "∈", "\\in", true);
	defineSymbol(math, main, rel, "", "\\@not");
	defineSymbol(math, main, rel, "⊂", "\\subset", true);
	defineSymbol(math, main, rel, "⊃", "\\supset", true);
	defineSymbol(math, main, rel, "⊆", "\\subseteq", true);
	defineSymbol(math, main, rel, "⊇", "\\supseteq", true);
	defineSymbol(math, ams, rel, "⊈", "\\nsubseteq", true);
	defineSymbol(math, ams, rel, "⊉", "\\nsupseteq", true);
	defineSymbol(math, main, rel, "⊨", "\\models");
	defineSymbol(math, main, rel, "←", "\\leftarrow", true);
	defineSymbol(math, main, rel, "≤", "\\le");
	defineSymbol(math, main, rel, "≤", "\\leq", true);
	defineSymbol(math, main, rel, "<", "\\lt", true);
	defineSymbol(math, main, rel, "→", "\\rightarrow", true);
	defineSymbol(math, main, rel, "→", "\\to");
	defineSymbol(math, ams, rel, "≱", "\\ngeq", true);
	defineSymbol(math, ams, rel, "≰", "\\nleq", true);
	defineSymbol(math, main, spacing, "\xA0", "\\ ");
	defineSymbol(math, main, spacing, "\xA0", "\\space");
	defineSymbol(math, main, spacing, "\xA0", "\\nobreakspace");
	defineSymbol(text, main, spacing, "\xA0", "\\ ");
	defineSymbol(text, main, spacing, "\xA0", " ");
	defineSymbol(text, main, spacing, "\xA0", "\\space");
	defineSymbol(text, main, spacing, "\xA0", "\\nobreakspace");
	defineSymbol(math, main, spacing, "", "\\nobreak");
	defineSymbol(math, main, spacing, "", "\\allowbreak");
	defineSymbol(math, main, punct, ",", ",");
	defineSymbol(math, main, punct, ";", ";");
	defineSymbol(math, ams, bin, "⊼", "\\barwedge", true);
	defineSymbol(math, ams, bin, "⊻", "\\veebar", true);
	defineSymbol(math, main, bin, "⊙", "\\odot", true);
	defineSymbol(math, main, bin, "⊕", "\\oplus", true);
	defineSymbol(math, main, bin, "⊗", "\\otimes", true);
	defineSymbol(math, main, textord, "∂", "\\partial", true);
	defineSymbol(math, main, bin, "⊘", "\\oslash", true);
	defineSymbol(math, ams, bin, "⊚", "\\circledcirc", true);
	defineSymbol(math, ams, bin, "⊡", "\\boxdot", true);
	defineSymbol(math, main, bin, "△", "\\bigtriangleup");
	defineSymbol(math, main, bin, "▽", "\\bigtriangledown");
	defineSymbol(math, main, bin, "†", "\\dagger");
	defineSymbol(math, main, bin, "⋄", "\\diamond");
	defineSymbol(math, main, bin, "⋆", "\\star");
	defineSymbol(math, main, bin, "◃", "\\triangleleft");
	defineSymbol(math, main, bin, "▹", "\\triangleright");
	defineSymbol(math, main, open, "{", "\\{");
	defineSymbol(text, main, textord, "{", "\\{");
	defineSymbol(text, main, textord, "{", "\\textbraceleft");
	defineSymbol(math, main, close, "}", "\\}");
	defineSymbol(text, main, textord, "}", "\\}");
	defineSymbol(text, main, textord, "}", "\\textbraceright");
	defineSymbol(math, main, open, "{", "\\lbrace");
	defineSymbol(math, main, close, "}", "\\rbrace");
	defineSymbol(math, main, open, "[", "\\lbrack", true);
	defineSymbol(text, main, textord, "[", "\\lbrack", true);
	defineSymbol(math, main, close, "]", "\\rbrack", true);
	defineSymbol(text, main, textord, "]", "\\rbrack", true);
	defineSymbol(math, main, open, "(", "\\lparen", true);
	defineSymbol(math, main, close, ")", "\\rparen", true);
	defineSymbol(text, main, textord, "<", "\\textless", true);
	defineSymbol(text, main, textord, ">", "\\textgreater", true);
	defineSymbol(math, main, open, "⌊", "\\lfloor", true);
	defineSymbol(math, main, close, "⌋", "\\rfloor", true);
	defineSymbol(math, main, open, "⌈", "\\lceil", true);
	defineSymbol(math, main, close, "⌉", "\\rceil", true);
	defineSymbol(math, main, textord, "\\", "\\backslash");
	defineSymbol(math, main, textord, "∣", "|");
	defineSymbol(math, main, textord, "∣", "\\vert");
	defineSymbol(text, main, textord, "|", "\\textbar", true);
	defineSymbol(math, main, textord, "∥", "\\|");
	defineSymbol(math, main, textord, "∥", "\\Vert");
	defineSymbol(text, main, textord, "∥", "\\textbardbl");
	defineSymbol(text, main, textord, "~", "\\textasciitilde");
	defineSymbol(text, main, textord, "\\", "\\textbackslash");
	defineSymbol(text, main, textord, "^", "\\textasciicircum");
	defineSymbol(math, main, rel, "↑", "\\uparrow", true);
	defineSymbol(math, main, rel, "⇑", "\\Uparrow", true);
	defineSymbol(math, main, rel, "↓", "\\downarrow", true);
	defineSymbol(math, main, rel, "⇓", "\\Downarrow", true);
	defineSymbol(math, main, rel, "↕", "\\updownarrow", true);
	defineSymbol(math, main, rel, "⇕", "\\Updownarrow", true);
	defineSymbol(math, main, op, "∐", "\\coprod");
	defineSymbol(math, main, op, "⋁", "\\bigvee");
	defineSymbol(math, main, op, "⋀", "\\bigwedge");
	defineSymbol(math, main, op, "⨄", "\\biguplus");
	defineSymbol(math, main, op, "⋂", "\\bigcap");
	defineSymbol(math, main, op, "⋃", "\\bigcup");
	defineSymbol(math, main, op, "∫", "\\int");
	defineSymbol(math, main, op, "∫", "\\intop");
	defineSymbol(math, main, op, "∬", "\\iint");
	defineSymbol(math, main, op, "∭", "\\iiint");
	defineSymbol(math, main, op, "∏", "\\prod");
	defineSymbol(math, main, op, "∑", "\\sum");
	defineSymbol(math, main, op, "⨂", "\\bigotimes");
	defineSymbol(math, main, op, "⨁", "\\bigoplus");
	defineSymbol(math, main, op, "⨀", "\\bigodot");
	defineSymbol(math, main, op, "∮", "\\oint");
	defineSymbol(math, main, op, "∯", "\\oiint");
	defineSymbol(math, main, op, "∰", "\\oiiint");
	defineSymbol(math, main, op, "⨆", "\\bigsqcup");
	defineSymbol(math, main, op, "∫", "\\smallint");
	defineSymbol(text, main, inner, "…", "\\textellipsis");
	defineSymbol(math, main, inner, "…", "\\mathellipsis");
	defineSymbol(text, main, inner, "…", "\\ldots", true);
	defineSymbol(math, main, inner, "…", "\\ldots", true);
	defineSymbol(math, main, inner, "⋯", "\\@cdots", true);
	defineSymbol(math, main, inner, "⋱", "\\ddots", true);
	defineSymbol(math, main, textord, "⋮", "\\varvdots");
	defineSymbol(text, main, textord, "⋮", "\\varvdots");
	defineSymbol(math, main, accent, "ˊ", "\\acute");
	defineSymbol(math, main, accent, "ˋ", "\\grave");
	defineSymbol(math, main, accent, "¨", "\\ddot");
	defineSymbol(math, main, accent, "~", "\\tilde");
	defineSymbol(math, main, accent, "ˉ", "\\bar");
	defineSymbol(math, main, accent, "˘", "\\breve");
	defineSymbol(math, main, accent, "ˇ", "\\check");
	defineSymbol(math, main, accent, "^", "\\hat");
	defineSymbol(math, main, accent, "⃗", "\\vec");
	defineSymbol(math, main, accent, "˙", "\\dot");
	defineSymbol(math, main, accent, "˚", "\\mathring");
	defineSymbol(math, main, mathord, "", "\\@imath");
	defineSymbol(math, main, mathord, "", "\\@jmath");
	defineSymbol(math, main, textord, "ı", "ı");
	defineSymbol(math, main, textord, "ȷ", "ȷ");
	defineSymbol(text, main, textord, "ı", "\\i", true);
	defineSymbol(text, main, textord, "ȷ", "\\j", true);
	defineSymbol(text, main, textord, "ß", "\\ss", true);
	defineSymbol(text, main, textord, "æ", "\\ae", true);
	defineSymbol(text, main, textord, "œ", "\\oe", true);
	defineSymbol(text, main, textord, "ø", "\\o", true);
	defineSymbol(text, main, textord, "Æ", "\\AE", true);
	defineSymbol(text, main, textord, "Œ", "\\OE", true);
	defineSymbol(text, main, textord, "Ø", "\\O", true);
	defineSymbol(text, main, accent, "ˊ", "\\'");
	defineSymbol(text, main, accent, "ˋ", "\\`");
	defineSymbol(text, main, accent, "ˆ", "\\^");
	defineSymbol(text, main, accent, "˜", "\\~");
	defineSymbol(text, main, accent, "ˉ", "\\=");
	defineSymbol(text, main, accent, "˘", "\\u");
	defineSymbol(text, main, accent, "˙", "\\.");
	defineSymbol(text, main, accent, "¸", "\\c");
	defineSymbol(text, main, accent, "˚", "\\r");
	defineSymbol(text, main, accent, "ˇ", "\\v");
	defineSymbol(text, main, accent, "¨", "\\\"");
	defineSymbol(text, main, accent, "˝", "\\H");
	defineSymbol(text, main, accent, "◯", "\\textcircled");
	var ligatures = {
		"--": true,
		"---": true,
		"``": true,
		"''": true
	};
	defineSymbol(text, main, textord, "–", "--", true);
	defineSymbol(text, main, textord, "–", "\\textendash");
	defineSymbol(text, main, textord, "—", "---", true);
	defineSymbol(text, main, textord, "—", "\\textemdash");
	defineSymbol(text, main, textord, "‘", "`", true);
	defineSymbol(text, main, textord, "‘", "\\textquoteleft");
	defineSymbol(text, main, textord, "’", "'", true);
	defineSymbol(text, main, textord, "’", "\\textquoteright");
	defineSymbol(text, main, textord, "“", "``", true);
	defineSymbol(text, main, textord, "“", "\\textquotedblleft");
	defineSymbol(text, main, textord, "”", "''", true);
	defineSymbol(text, main, textord, "”", "\\textquotedblright");
	defineSymbol(math, main, textord, "°", "\\degree", true);
	defineSymbol(text, main, textord, "°", "\\degree");
	defineSymbol(text, main, textord, "°", "\\textdegree", true);
	defineSymbol(math, main, textord, "£", "\\pounds");
	defineSymbol(math, main, textord, "£", "\\mathsterling", true);
	defineSymbol(text, main, textord, "£", "\\pounds");
	defineSymbol(text, main, textord, "£", "\\textsterling", true);
	defineSymbol(math, ams, textord, "✠", "\\maltese");
	defineSymbol(text, ams, textord, "✠", "\\maltese");
	var mathTextSymbols = "0123456789/@.\"";
	for (var i = 0; i < mathTextSymbols.length; i++) {
		var ch = mathTextSymbols.charAt(i);
		defineSymbol(math, main, textord, ch, ch);
	}
	var textSymbols = "0123456789!@*()-=+\";:?/.,";
	for (var _i = 0; _i < textSymbols.length; _i++) {
		var _ch = textSymbols.charAt(_i);
		defineSymbol(text, main, textord, _ch, _ch);
	}
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (var _i2 = 0; _i2 < letters.length; _i2++) {
		var _ch2 = letters.charAt(_i2);
		defineSymbol(math, main, mathord, _ch2, _ch2);
		defineSymbol(text, main, textord, _ch2, _ch2);
	}
	defineSymbol(math, ams, textord, "C", "ℂ");
	defineSymbol(text, ams, textord, "C", "ℂ");
	defineSymbol(math, ams, textord, "H", "ℍ");
	defineSymbol(text, ams, textord, "H", "ℍ");
	defineSymbol(math, ams, textord, "N", "ℕ");
	defineSymbol(text, ams, textord, "N", "ℕ");
	defineSymbol(math, ams, textord, "P", "ℙ");
	defineSymbol(text, ams, textord, "P", "ℙ");
	defineSymbol(math, ams, textord, "Q", "ℚ");
	defineSymbol(text, ams, textord, "Q", "ℚ");
	defineSymbol(math, ams, textord, "R", "ℝ");
	defineSymbol(text, ams, textord, "R", "ℝ");
	defineSymbol(math, ams, textord, "Z", "ℤ");
	defineSymbol(text, ams, textord, "Z", "ℤ");
	defineSymbol(math, main, mathord, "h", "ℎ");
	defineSymbol(text, main, mathord, "h", "ℎ");
	var wideChar;
	for (var _i3 = 0; _i3 < letters.length; _i3++) {
		var _ch3 = letters.charAt(_i3);
		wideChar = String.fromCharCode(55349, 56320 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56372 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56424 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56580 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56684 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56736 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56788 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56840 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		wideChar = String.fromCharCode(55349, 56944 + _i3);
		defineSymbol(math, main, mathord, _ch3, wideChar);
		defineSymbol(text, main, textord, _ch3, wideChar);
		if (_i3 < 26) {
			wideChar = String.fromCharCode(55349, 56632 + _i3);
			defineSymbol(math, main, mathord, _ch3, wideChar);
			defineSymbol(text, main, textord, _ch3, wideChar);
			wideChar = String.fromCharCode(55349, 56476 + _i3);
			defineSymbol(math, main, mathord, _ch3, wideChar);
			defineSymbol(text, main, textord, _ch3, wideChar);
		}
	}
	wideChar = String.fromCharCode(55349, 56668);
	defineSymbol(math, main, mathord, "k", wideChar);
	defineSymbol(text, main, textord, "k", wideChar);
	for (var _i4 = 0; _i4 < 10; _i4++) {
		var _ch4 = _i4.toString();
		wideChar = String.fromCharCode(55349, 57294 + _i4);
		defineSymbol(math, main, mathord, _ch4, wideChar);
		defineSymbol(text, main, textord, _ch4, wideChar);
		wideChar = String.fromCharCode(55349, 57314 + _i4);
		defineSymbol(math, main, mathord, _ch4, wideChar);
		defineSymbol(text, main, textord, _ch4, wideChar);
		wideChar = String.fromCharCode(55349, 57324 + _i4);
		defineSymbol(math, main, mathord, _ch4, wideChar);
		defineSymbol(text, main, textord, _ch4, wideChar);
		wideChar = String.fromCharCode(55349, 57334 + _i4);
		defineSymbol(math, main, mathord, _ch4, wideChar);
		defineSymbol(text, main, textord, _ch4, wideChar);
	}
	var extraLatin = "ÐÞþ";
	for (var _i5 = 0; _i5 < extraLatin.length; _i5++) {
		var _ch5 = extraLatin.charAt(_i5);
		defineSymbol(math, main, mathord, _ch5, _ch5);
		defineSymbol(text, main, textord, _ch5, _ch5);
	}
	var boldUpright = {
		mathClass: "mathbf",
		textClass: "textbf",
		font: "Main-Bold"
	};
	var italic = {
		mathClass: "mathnormal",
		textClass: "textit",
		font: "Math-Italic"
	};
	var boldItalic = {
		mathClass: "boldsymbol",
		textClass: "boldsymbol",
		font: "Main-BoldItalic"
	};
	var script = {
		mathClass: "mathscr",
		textClass: "textscr",
		font: "Script-Regular"
	};
	var noFont = {
		mathClass: "",
		textClass: "",
		font: ""
	};
	var fraktur = {
		mathClass: "mathfrak",
		textClass: "textfrak",
		font: "Fraktur-Regular"
	};
	var doubleStruck = {
		mathClass: "mathbb",
		textClass: "textbb",
		font: "AMS-Regular"
	};
	var boldFraktur = {
		mathClass: "mathboldfrak",
		textClass: "textboldfrak",
		font: "Fraktur-Regular"
	};
	var sansSerif = {
		mathClass: "mathsf",
		textClass: "textsf",
		font: "SansSerif-Regular"
	};
	var boldSansSerif = {
		mathClass: "mathboldsf",
		textClass: "textboldsf",
		font: "SansSerif-Bold"
	};
	var italicSansSerif = {
		mathClass: "mathitsf",
		textClass: "textitsf",
		font: "SansSerif-Italic"
	};
	var monospace = {
		mathClass: "mathtt",
		textClass: "texttt",
		font: "Typewriter-Regular"
	};
	var wideLatinLetterData = [
		boldUpright,
		boldUpright,
		italic,
		italic,
		boldItalic,
		boldItalic,
		script,
		noFont,
		noFont,
		noFont,
		fraktur,
		fraktur,
		doubleStruck,
		doubleStruck,
		boldFraktur,
		boldFraktur,
		sansSerif,
		sansSerif,
		boldSansSerif,
		boldSansSerif,
		italicSansSerif,
		italicSansSerif,
		noFont,
		noFont,
		monospace,
		monospace
	];
	var wideNumeralData = [
		boldUpright,
		noFont,
		sansSerif,
		boldSansSerif,
		monospace
	];
	var wideCharacterFont = (wideChar) => {
		var H = wideChar.charCodeAt(0);
		var L = wideChar.charCodeAt(1);
		var codePoint = (H - 55296) * 1024 + (L - 56320) + 65536;
		if (119808 <= codePoint && codePoint < 120484) return wideLatinLetterData[Math.floor((codePoint - 119808) / 26)];
		else if (120782 <= codePoint && codePoint <= 120831) return wideNumeralData[Math.floor((codePoint - 120782) / 10)];
		else if (codePoint === 120485 || codePoint === 120486) return wideLatinLetterData[0];
		else if (120486 < codePoint && codePoint < 120782) return noFont;
		else throw new ParseError("Unsupported character: " + wideChar);
	};
	var lookupSymbol = function lookupSymbol(value, fontName, mode) {
		if (symbols[mode][value]) {
			var replacement = symbols[mode][value].replace;
			if (replacement) value = replacement;
		}
		return {
			value,
			metrics: getCharacterMetrics(value, fontName, mode)
		};
	};
	var makeSymbol = function makeSymbol(value, fontName, mode, options, classes) {
		var lookup = lookupSymbol(value, fontName, mode);
		var metrics = lookup.metrics;
		value = lookup.value;
		var symbolNode;
		if (metrics) {
			var italic = metrics.italic;
			if (mode === "text" || options && options.font === "mathit") italic = 0;
			symbolNode = new SymbolNode(value, metrics.height, metrics.depth, italic, metrics.skew, metrics.width, classes);
		} else {
			typeof console !== "undefined" && console.warn("No character metrics " + ("for '" + value + "' in style '" + fontName + "' and mode '" + mode + "'"));
			symbolNode = new SymbolNode(value, 0, 0, 0, 0, 0, classes);
		}
		if (options) {
			symbolNode.maxFontSize = options.sizeMultiplier;
			if (options.style.isTight()) symbolNode.classes.push("mtight");
			var color = options.getColor();
			if (color) symbolNode.style.color = color;
		}
		return symbolNode;
	};
	var mathsym = function mathsym(value, mode, options, classes) {
		if (classes === void 0) classes = [];
		if (options.font === "boldsymbol" && lookupSymbol(value, "Main-Bold", mode).metrics) return makeSymbol(value, "Main-Bold", mode, options, classes.concat(["mathbf"]));
		else if (value === "\\" || symbols[mode][value].font === "main") return makeSymbol(value, "Main-Regular", mode, options, classes);
		else return makeSymbol(value, "AMS-Regular", mode, options, classes.concat(["amsrm"]));
	};
	var boldSymbol = function boldSymbol(value, mode, type) {
		if (type !== "textord" && lookupSymbol(value, "Math-BoldItalic", mode).metrics) return {
			fontName: "Math-BoldItalic",
			fontClass: "boldsymbol"
		};
		else return {
			fontName: "Main-Bold",
			fontClass: "mathbf"
		};
	};
	var makeOrd = function makeOrd(group, options, type) {
		var mode = group.mode;
		var text = group.text;
		var classes = ["mord"];
		var { font, fontFamily, fontWeight, fontShape } = options;
		var useFont = mode === "math" || mode === "text" && !!font;
		var fontOrFamily = useFont ? font : fontFamily;
		var wideFontName = "";
		var wideFontClass = "";
		if (text.charCodeAt(0) === 55349) {
			var wideCharData = wideCharacterFont(text);
			wideFontName = wideCharData.font;
			wideFontClass = wideCharData[mode + "Class"];
		}
		if (wideFontName) return makeSymbol(text, wideFontName, mode, options, classes.concat(wideFontClass));
		else if (fontOrFamily) {
			var fontName;
			var fontClasses;
			if (fontOrFamily === "boldsymbol") {
				var fontData = boldSymbol(text, mode, type);
				fontName = fontData.fontName;
				fontClasses = [fontData.fontClass];
			} else if (useFont) {
				fontName = fontMap[font].fontName;
				fontClasses = [font];
			} else {
				fontName = retrieveTextFontName(fontFamily, fontWeight, fontShape);
				fontClasses = [
					fontFamily,
					fontWeight,
					fontShape
				];
			}
			if (lookupSymbol(text, fontName, mode).metrics) return makeSymbol(text, fontName, mode, options, classes.concat(fontClasses));
			else if (ligatures.hasOwnProperty(text) && fontName.slice(0, 10) === "Typewriter") {
				var parts = [];
				for (var i = 0; i < text.length; i++) parts.push(makeSymbol(text[i], fontName, mode, options, classes.concat(fontClasses)));
				return makeFragment(parts);
			}
		}
		if (type === "mathord") return makeSymbol(text, "Math-Italic", mode, options, classes.concat(["mathnormal"]));
		else if (type === "textord") {
			var _font = symbols[mode][text] && symbols[mode][text].font;
			if (_font === "ams") return makeSymbol(text, retrieveTextFontName("amsrm", fontWeight, fontShape), mode, options, classes.concat("amsrm", fontWeight, fontShape));
			else if (_font === "main" || !_font) return makeSymbol(text, retrieveTextFontName("textrm", fontWeight, fontShape), mode, options, classes.concat(fontWeight, fontShape));
			else {
				var _fontName3 = retrieveTextFontName(_font, fontWeight, fontShape);
				return makeSymbol(text, _fontName3, mode, options, classes.concat(_fontName3, fontWeight, fontShape));
			}
		} else throw new Error("unexpected type: " + type + " in makeOrd");
	};
	var canCombine = (prev, next) => {
		if (createClass(prev.classes) !== createClass(next.classes) || prev.skew !== next.skew || prev.maxFontSize !== next.maxFontSize || prev.italic !== 0 && prev.hasClass("mathnormal")) return false;
		if (prev.classes.length === 1) {
			var cls = prev.classes[0];
			if (cls === "mbin" || cls === "mord") return false;
		}
		for (var key of Object.keys(prev.style)) if (prev.style[key] !== next.style[key]) return false;
		for (var _key of Object.keys(next.style)) if (prev.style[_key] !== next.style[_key]) return false;
		return true;
	};
	var tryCombineChars = (chars) => {
		for (var i = 0; i < chars.length - 1; i++) {
			var prev = chars[i];
			var next = chars[i + 1];
			if (prev instanceof SymbolNode && next instanceof SymbolNode && canCombine(prev, next)) {
				prev.text += next.text;
				prev.height = Math.max(prev.height, next.height);
				prev.depth = Math.max(prev.depth, next.depth);
				prev.italic = next.italic;
				chars.splice(i + 1, 1);
				i--;
			}
		}
		return chars;
	};
	var sizeElementFromChildren = function sizeElementFromChildren(elem) {
		var height = 0;
		var depth = 0;
		var maxFontSize = 0;
		for (var i = 0; i < elem.children.length; i++) {
			var child = elem.children[i];
			if (child.height > height) height = child.height;
			if (child.depth > depth) depth = child.depth;
			if (child.maxFontSize > maxFontSize) maxFontSize = child.maxFontSize;
		}
		elem.height = height;
		elem.depth = depth;
		elem.maxFontSize = maxFontSize;
	};
	var makeSpan = function makeSpan(classes, children, options, style) {
		var span = new Span(classes, children, options, style);
		sizeElementFromChildren(span);
		return span;
	};
	var makeSvgSpan = (classes, children, options, style) => new Span(classes, children, options, style);
	var makeLineSpan = function makeLineSpan(className, options, thickness) {
		var line = makeSpan([className], [], options);
		line.height = Math.max(thickness || options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
		line.style.borderBottomWidth = makeEm(line.height);
		line.maxFontSize = 1;
		return line;
	};
	var makeAnchor = function makeAnchor(href, classes, children, options) {
		var anchor = new Anchor(href, classes, children, options);
		sizeElementFromChildren(anchor);
		return anchor;
	};
	var makeFragment = function makeFragment(children) {
		var fragment = new DocumentFragment(children);
		sizeElementFromChildren(fragment);
		return fragment;
	};
	var wrapFragment = function wrapFragment(group, options) {
		if (group instanceof DocumentFragment) return makeSpan([], [group], options);
		return group;
	};
	var getVListChildrenAndDepth = function getVListChildrenAndDepth(params) {
		if (params.positionType === "individualShift") {
			var oldChildren = params.children;
			var children = [oldChildren[0]];
			var _depth = -oldChildren[0].shift - oldChildren[0].elem.depth;
			var currPos = _depth;
			for (var i = 1; i < oldChildren.length; i++) {
				var diff = -oldChildren[i].shift - currPos - oldChildren[i].elem.depth;
				var size = diff - (oldChildren[i - 1].elem.height + oldChildren[i - 1].elem.depth);
				currPos = currPos + diff;
				children.push({
					type: "kern",
					size
				});
				children.push(oldChildren[i]);
			}
			return {
				children,
				depth: _depth
			};
		}
		var depth;
		if (params.positionType === "top") {
			var bottom = params.positionData;
			for (var _i = 0; _i < params.children.length; _i++) {
				var child = params.children[_i];
				bottom -= child.type === "kern" ? child.size : child.elem.height + child.elem.depth;
			}
			depth = bottom;
		} else if (params.positionType === "bottom") depth = -params.positionData;
		else {
			var firstChild = params.children[0];
			if (firstChild.type !== "elem") throw new Error("First child must have type \"elem\".");
			if (params.positionType === "shift") depth = -firstChild.elem.depth - params.positionData;
			else if (params.positionType === "firstBaseline") depth = -firstChild.elem.depth;
			else throw new Error("Invalid positionType " + params.positionType + ".");
		}
		return {
			children: params.children,
			depth
		};
	};
	var makeVList = function makeVList(params, options) {
		var { children, depth } = getVListChildrenAndDepth(params);
		var pstrutSize = 0;
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			if (child.type === "elem") {
				var elem = child.elem;
				pstrutSize = Math.max(pstrutSize, elem.maxFontSize, elem.height);
			}
		}
		pstrutSize += 2;
		var pstrut = makeSpan(["pstrut"], []);
		pstrut.style.height = makeEm(pstrutSize);
		var realChildren = [];
		var minPos = depth;
		var maxPos = depth;
		var currPos = depth;
		for (var _i2 = 0; _i2 < children.length; _i2++) {
			var _child = children[_i2];
			if (_child.type === "kern") currPos += _child.size;
			else {
				var _elem = _child.elem;
				var classes = _child.wrapperClasses || [];
				var style = _child.wrapperStyle || {};
				var childWrap = makeSpan(classes, [pstrut, _elem], void 0, style);
				childWrap.style.top = makeEm(-pstrutSize - currPos - _elem.depth);
				if (_child.marginLeft) childWrap.style.marginLeft = _child.marginLeft;
				if (_child.marginRight) childWrap.style.marginRight = _child.marginRight;
				realChildren.push(childWrap);
				currPos += _elem.height + _elem.depth;
			}
			minPos = Math.min(minPos, currPos);
			maxPos = Math.max(maxPos, currPos);
		}
		var vlist = makeSpan(["vlist"], realChildren);
		vlist.style.height = makeEm(maxPos);
		var rows;
		if (minPos < 0) {
			var depthStrut = makeSpan(["vlist"], [makeSpan([], [])]);
			depthStrut.style.height = makeEm(-minPos);
			rows = [makeSpan(["vlist-r"], [vlist, makeSpan(["vlist-s"], [new SymbolNode("​")])]), makeSpan(["vlist-r"], [depthStrut])];
		} else rows = [makeSpan(["vlist-r"], [vlist])];
		var vtable = makeSpan(["vlist-t"], rows);
		if (rows.length === 2) vtable.classes.push("vlist-t2");
		vtable.height = maxPos;
		vtable.depth = -minPos;
		return vtable;
	};
	var makeGlue = (measurement, options) => {
		var rule = makeSpan(["mspace"], [], options);
		var size = calculateSize(measurement, options);
		rule.style.marginRight = makeEm(size);
		return rule;
	};
	var retrieveTextFontName = (fontFamily, fontWeight, fontShape) => {
		var baseFontName;
		var fontStylesName;
		switch (fontFamily) {
			case "amsrm":
				baseFontName = "AMS";
				break;
			case "textrm":
				baseFontName = "Main";
				break;
			case "textsf":
				baseFontName = "SansSerif";
				break;
			case "texttt":
				baseFontName = "Typewriter";
				break;
			default: baseFontName = fontFamily;
		}
		if (fontWeight === "textbf" && fontShape === "textit") fontStylesName = "BoldItalic";
		else if (fontWeight === "textbf") fontStylesName = "Bold";
		else if (fontShape === "textit") fontStylesName = "Italic";
		else fontStylesName = "Regular";
		return baseFontName + "-" + fontStylesName;
	};
	var fontMap = {
		"mathbf": {
			variant: "bold",
			fontName: "Main-Bold"
		},
		"mathrm": {
			variant: "normal",
			fontName: "Main-Regular"
		},
		"textit": {
			variant: "italic",
			fontName: "Main-Italic"
		},
		"mathit": {
			variant: "italic",
			fontName: "Main-Italic"
		},
		"mathnormal": {
			variant: "italic",
			fontName: "Math-Italic"
		},
		"mathsfit": {
			variant: "sans-serif-italic",
			fontName: "SansSerif-Italic"
		},
		"mathbb": {
			variant: "double-struck",
			fontName: "AMS-Regular"
		},
		"mathcal": {
			variant: "script",
			fontName: "Caligraphic-Regular"
		},
		"mathfrak": {
			variant: "fraktur",
			fontName: "Fraktur-Regular"
		},
		"mathscr": {
			variant: "script",
			fontName: "Script-Regular"
		},
		"mathsf": {
			variant: "sans-serif",
			fontName: "SansSerif-Regular"
		},
		"mathtt": {
			variant: "monospace",
			fontName: "Typewriter-Regular"
		}
	};
	var svgData = {
		vec: [
			"vec",
			.471,
			.714
		],
		oiintSize1: [
			"oiintSize1",
			.957,
			.499
		],
		oiintSize2: [
			"oiintSize2",
			1.472,
			.659
		],
		oiiintSize1: [
			"oiiintSize1",
			1.304,
			.499
		],
		oiiintSize2: [
			"oiiintSize2",
			1.98,
			.659
		]
	};
	var staticSvg = function staticSvg(value, options) {
		var [pathName, width, height] = svgData[value];
		var span = makeSvgSpan(["overlay"], [new SvgNode([new PathNode(pathName)], {
			"width": makeEm(width),
			"height": makeEm(height),
			"style": "width:" + makeEm(width),
			"viewBox": "0 0 " + 1e3 * width + " " + 1e3 * height,
			"preserveAspectRatio": "xMinYMin"
		})], options);
		span.height = height;
		span.style.height = makeEm(height);
		span.style.width = makeEm(width);
		return span;
	};
	var thinspace = {
		number: 3,
		unit: "mu"
	};
	var mediumspace = {
		number: 4,
		unit: "mu"
	};
	var thickspace = {
		number: 5,
		unit: "mu"
	};
	var spacings = {
		mord: {
			mop: thinspace,
			mbin: mediumspace,
			mrel: thickspace,
			minner: thinspace
		},
		mop: {
			mord: thinspace,
			mop: thinspace,
			mrel: thickspace,
			minner: thinspace
		},
		mbin: {
			mord: mediumspace,
			mop: mediumspace,
			mopen: mediumspace,
			minner: mediumspace
		},
		mrel: {
			mord: thickspace,
			mop: thickspace,
			mopen: thickspace,
			minner: thickspace
		},
		mopen: {},
		mclose: {
			mop: thinspace,
			mbin: mediumspace,
			mrel: thickspace,
			minner: thinspace
		},
		mpunct: {
			mord: thinspace,
			mop: thinspace,
			mrel: thickspace,
			mopen: thinspace,
			mclose: thinspace,
			mpunct: thinspace,
			minner: thinspace
		},
		minner: {
			mord: thinspace,
			mop: thinspace,
			mbin: mediumspace,
			mrel: thickspace,
			mopen: thinspace,
			mpunct: thinspace,
			minner: thinspace
		}
	};
	var tightSpacings = {
		mord: { mop: thinspace },
		mop: {
			mord: thinspace,
			mop: thinspace
		},
		mbin: {},
		mrel: {},
		mopen: {},
		mclose: { mop: thinspace },
		mpunct: {},
		minner: { mop: thinspace }
	};
	var _functions = {};
	var _htmlGroupBuilders = {};
	var _mathmlGroupBuilders = {};
	function defineFunction(_ref) {
		var { type, names, props, handler, htmlBuilder, mathmlBuilder } = _ref;
		var data = {
			type,
			numArgs: props.numArgs,
			argTypes: props.argTypes,
			allowedInArgument: !!props.allowedInArgument,
			allowedInText: !!props.allowedInText,
			allowedInMath: props.allowedInMath === void 0 ? true : props.allowedInMath,
			numOptionalArgs: props.numOptionalArgs || 0,
			infix: !!props.infix,
			primitive: !!props.primitive,
			handler
		};
		for (var i = 0; i < names.length; ++i) _functions[names[i]] = data;
		if (type) {
			if (htmlBuilder) _htmlGroupBuilders[type] = htmlBuilder;
			if (mathmlBuilder) _mathmlGroupBuilders[type] = mathmlBuilder;
		}
	}
	function defineFunctionBuilders(_ref2) {
		var { type, htmlBuilder, mathmlBuilder } = _ref2;
		defineFunction({
			type,
			names: [],
			props: { numArgs: 0 },
			handler() {
				throw new Error("Should never be called.");
			},
			htmlBuilder,
			mathmlBuilder
		});
	}
	var normalizeArgument = function normalizeArgument(arg) {
		return arg.type === "ordgroup" && arg.body.length === 1 ? arg.body[0] : arg;
	};
	var ordargument = function ordargument(arg) {
		return arg.type === "ordgroup" ? arg.body : [arg];
	};
	var binLeftCanceller = new Set([
		"leftmost",
		"mbin",
		"mopen",
		"mrel",
		"mop",
		"mpunct"
	]);
	var binRightCanceller = new Set([
		"rightmost",
		"mrel",
		"mclose",
		"mpunct"
	]);
	var styleMap$1 = {
		"display": Style$1.DISPLAY,
		"text": Style$1.TEXT,
		"script": Style$1.SCRIPT,
		"scriptscript": Style$1.SCRIPTSCRIPT
	};
	var DomEnum = {
		mord: "mord",
		mop: "mop",
		mbin: "mbin",
		mrel: "mrel",
		mopen: "mopen",
		mclose: "mclose",
		mpunct: "mpunct",
		minner: "minner"
	};
	var buildExpression$1 = function buildExpression(expression, options, isRealGroup, surrounding) {
		if (surrounding === void 0) surrounding = [null, null];
		var groups = [];
		for (var i = 0; i < expression.length; i++) {
			var output = buildGroup$1(expression[i], options);
			if (output instanceof DocumentFragment) {
				var children = output.children;
				groups.push(...children);
			} else groups.push(output);
		}
		tryCombineChars(groups);
		if (!isRealGroup) return groups;
		var glueOptions = options;
		if (expression.length === 1) {
			var node = expression[0];
			if (node.type === "sizing") glueOptions = options.havingSize(node.size);
			else if (node.type === "styling") glueOptions = options.havingStyle(styleMap$1[node.style]);
		}
		var dummyPrev = makeSpan([surrounding[0] || "leftmost"], [], options);
		var dummyNext = makeSpan([surrounding[1] || "rightmost"], [], options);
		var isRoot = isRealGroup === "root";
		_traverseNonSpaceNodes(groups, (node, prev) => {
			var prevType = prev.classes[0];
			var type = node.classes[0];
			if (prevType === "mbin" && binRightCanceller.has(type)) prev.classes[0] = "mord";
			else if (type === "mbin" && binLeftCanceller.has(prevType)) node.classes[0] = "mord";
		}, { node: dummyPrev }, dummyNext, isRoot);
		_traverseNonSpaceNodes(groups, (node, prev) => {
			var _tightSpacings$prevTy, _spacings$prevType;
			var prevType = getTypeOfDomTree(prev);
			var type = getTypeOfDomTree(node);
			var space = prevType && type ? node.hasClass("mtight") ? (_tightSpacings$prevTy = tightSpacings[prevType]) == null ? void 0 : _tightSpacings$prevTy[type] : (_spacings$prevType = spacings[prevType]) == null ? void 0 : _spacings$prevType[type] : null;
			if (space) return makeGlue(space, glueOptions);
		}, { node: dummyPrev }, dummyNext, isRoot);
		return groups;
	};
	var _traverseNonSpaceNodes = function traverseNonSpaceNodes(nodes, callback, prev, next, isRoot) {
		if (next) nodes.push(next);
		var i = 0;
		for (; i < nodes.length; i++) {
			var node = nodes[i];
			var partialGroup = checkPartialGroup(node);
			if (partialGroup) {
				_traverseNonSpaceNodes(partialGroup.children, callback, prev, null, isRoot);
				continue;
			}
			var nonspace = !node.hasClass("mspace");
			if (nonspace) {
				var result = callback(node, prev.node);
				if (result) {
					if (prev.insertAfter) prev.insertAfter(result);
					else {
						nodes.unshift(result);
						i++;
					}
				}
			}
			if (nonspace) prev.node = node;
			else if (isRoot && node.hasClass("newline")) prev.node = makeSpan(["leftmost"]);
			prev.insertAfter = ((index) => (n) => {
				nodes.splice(index + 1, 0, n);
				i++;
			})(i);
		}
		if (next) nodes.pop();
	};
	var checkPartialGroup = function checkPartialGroup(node) {
		if (node instanceof DocumentFragment || node instanceof Anchor || node instanceof Span && node.hasClass("enclosing")) return node;
		return null;
	};
	var _getOutermostNode = function getOutermostNode(node, side) {
		var partialGroup = checkPartialGroup(node);
		if (partialGroup) {
			var children = partialGroup.children;
			if (children.length) {
				if (side === "right") return _getOutermostNode(children[children.length - 1], "right");
				else if (side === "left") return _getOutermostNode(children[0], "left");
			}
		}
		return node;
	};
	var getTypeOfDomTree = function getTypeOfDomTree(node, side) {
		if (!node) return null;
		if (side) node = _getOutermostNode(node, side);
		return DomEnum[node.classes[0]] || null;
	};
	var makeNullDelimiter = function makeNullDelimiter(options, classes) {
		var moreClasses = ["nulldelimiter"].concat(options.baseSizingClasses());
		return makeSpan(classes.concat(moreClasses));
	};
	var buildGroup$1 = function buildGroup(group, options, baseOptions) {
		if (!group) return makeSpan();
		if (_htmlGroupBuilders[group.type]) {
			var groupNode = _htmlGroupBuilders[group.type](group, options);
			if (baseOptions && options.size !== baseOptions.size) {
				groupNode = makeSpan(options.sizingClasses(baseOptions), [groupNode], options);
				var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
				groupNode.height *= multiplier;
				groupNode.depth *= multiplier;
			}
			return groupNode;
		} else throw new ParseError("Got group of unknown type: '" + group.type + "'");
	};
	function buildHTMLUnbreakable(children, options) {
		var body = makeSpan(["base"], children, options);
		var strut = makeSpan(["strut"]);
		strut.style.height = makeEm(body.height + body.depth);
		if (body.depth) strut.style.verticalAlign = makeEm(-body.depth);
		body.children.unshift(strut);
		return body;
	}
	function buildHTML(tree, options) {
		var tag = null;
		if (tree.length === 1 && tree[0].type === "tag") {
			tag = tree[0].tag;
			tree = tree[0].body;
		}
		var expression = buildExpression$1(tree, options, "root");
		var eqnNum;
		if (expression.length === 2 && expression[1].hasClass("tag")) eqnNum = expression.pop();
		var children = [];
		var parts = [];
		for (var i = 0; i < expression.length; i++) {
			parts.push(expression[i]);
			if (expression[i].hasClass("mbin") || expression[i].hasClass("mrel") || expression[i].hasClass("allowbreak")) {
				var nobreak = false;
				while (i < expression.length - 1 && expression[i + 1].hasClass("mspace") && !expression[i + 1].hasClass("newline")) {
					i++;
					parts.push(expression[i]);
					if (expression[i].hasClass("nobreak")) nobreak = true;
				}
				if (!nobreak) {
					children.push(buildHTMLUnbreakable(parts, options));
					parts = [];
				}
			} else if (expression[i].hasClass("newline")) {
				parts.pop();
				if (parts.length > 0) {
					children.push(buildHTMLUnbreakable(parts, options));
					parts = [];
				}
				children.push(expression[i]);
			}
		}
		if (parts.length > 0) children.push(buildHTMLUnbreakable(parts, options));
		var tagChild;
		if (tag) {
			tagChild = buildHTMLUnbreakable(buildExpression$1(tag, options, true), options);
			tagChild.classes = ["tag"];
			children.push(tagChild);
		} else if (eqnNum) children.push(eqnNum);
		var htmlNode = makeSpan(["katex-html"], children);
		htmlNode.setAttribute("aria-hidden", "true");
		if (tagChild) {
			var strut = tagChild.children[0];
			strut.style.height = makeEm(htmlNode.height + htmlNode.depth);
			if (htmlNode.depth) strut.style.verticalAlign = makeEm(-htmlNode.depth);
		}
		return htmlNode;
	}
	function newDocumentFragment(children) {
		return new DocumentFragment(children);
	}
	var MathNode = class {
		constructor(type, children, classes) {
			this.type = void 0;
			this.attributes = void 0;
			this.children = void 0;
			this.classes = void 0;
			this.type = type;
			this.attributes = {};
			this.children = children || [];
			this.classes = classes || [];
		}
		setAttribute(name, value) {
			this.attributes[name] = value;
		}
		getAttribute(name) {
			return this.attributes[name];
		}
		toNode() {
			var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
			for (var attr in this.attributes) if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) node.setAttribute(attr, this.attributes[attr]);
			if (this.classes.length > 0) node.className = createClass(this.classes);
			for (var i = 0; i < this.children.length; i++) if (this.children[i] instanceof TextNode && this.children[i + 1] instanceof TextNode) {
				var text = this.children[i].toText() + this.children[++i].toText();
				while (this.children[i + 1] instanceof TextNode) text += this.children[++i].toText();
				node.appendChild(new TextNode(text).toNode());
			} else node.appendChild(this.children[i].toNode());
			return node;
		}
		toMarkup() {
			var markup = "<" + this.type;
			for (var attr in this.attributes) if (Object.prototype.hasOwnProperty.call(this.attributes, attr)) {
				markup += " " + attr + "=\"";
				markup += escape(this.attributes[attr]);
				markup += "\"";
			}
			if (this.classes.length > 0) markup += " class =\"" + escape(createClass(this.classes)) + "\"";
			markup += ">";
			for (var i = 0; i < this.children.length; i++) markup += this.children[i].toMarkup();
			markup += "</" + this.type + ">";
			return markup;
		}
		toText() {
			return this.children.map((child) => child.toText()).join("");
		}
	};
	var TextNode = class {
		constructor(text) {
			this.text = void 0;
			this.text = text;
		}
		toNode() {
			return document.createTextNode(this.text);
		}
		toMarkup() {
			return escape(this.toText());
		}
		toText() {
			return this.text;
		}
	};
	var SpaceNode = class {
		constructor(width) {
			this.width = void 0;
			this.character = void 0;
			this.width = width;
			if (width >= .05555 && width <= .05556) this.character = " ";
			else if (width >= .1666 && width <= .1667) this.character = " ";
			else if (width >= .2222 && width <= .2223) this.character = " ";
			else if (width >= .2777 && width <= .2778) this.character = "  ";
			else if (width >= -.05556 && width <= -.05555) this.character = " ⁣";
			else if (width >= -.1667 && width <= -.1666) this.character = " ⁣";
			else if (width >= -.2223 && width <= -.2222) this.character = " ⁣";
			else if (width >= -.2778 && width <= -.2777) this.character = " ⁣";
			else this.character = null;
		}
		toNode() {
			if (this.character) return document.createTextNode(this.character);
			else {
				var node = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
				node.setAttribute("width", makeEm(this.width));
				return node;
			}
		}
		toMarkup() {
			if (this.character) return "<mtext>" + this.character + "</mtext>";
			else return "<mspace width=\"" + makeEm(this.width) + "\"/>";
		}
		toText() {
			if (this.character) return this.character;
			else return " ";
		}
	};
	var noVariantSymbols = new Set(["\\imath", "\\jmath"]);
	var rowLikeTypes = new Set(["mrow", "mtable"]);
	var makeText = function makeText(text, mode, options) {
		if (symbols[mode][text] && symbols[mode][text].replace && text.charCodeAt(0) !== 55349 && !(ligatures.hasOwnProperty(text) && options && (options.fontFamily && options.fontFamily.slice(4, 6) === "tt" || options.font && options.font.slice(4, 6) === "tt"))) text = symbols[mode][text].replace;
		return new TextNode(text);
	};
	var makeRow = function makeRow(body) {
		if (body.length === 1) return body[0];
		else return new MathNode("mrow", body);
	};
	var mathFontVariants = {
		mathit: "italic",
		boldsymbol: (group) => group.type === "textord" ? "bold" : "bold-italic",
		mathbf: "bold",
		mathbb: "double-struck",
		mathsfit: "sans-serif-italic",
		mathfrak: "fraktur",
		mathscr: "script",
		mathcal: "script",
		mathsf: "sans-serif",
		mathtt: "monospace"
	};
	var getVariant = (group, options) => {
		if (group.mode === "text") {
			if (options.fontFamily === "texttt") return "monospace";
			else if (options.fontFamily === "textsf") {
				if (options.fontShape === "textit" && options.fontWeight === "textbf") return "sans-serif-bold-italic";
				else if (options.fontShape === "textit") return "sans-serif-italic";
				else if (options.fontWeight === "textbf") return "bold-sans-serif";
				else return "sans-serif";
			} else if (options.fontShape === "textit" && options.fontWeight === "textbf") return "bold-italic";
			else if (options.fontShape === "textit") return "italic";
			else if (options.fontWeight === "textbf") return "bold";
		}
		var font = options.font;
		if (!font || font === "mathnormal") return null;
		var mode = group.mode;
		var mathVariant = mathFontVariants[font];
		if (mathVariant) return typeof mathVariant === "function" ? mathVariant(group) : mathVariant;
		var text = group.text;
		if (noVariantSymbols.has(text)) return null;
		if (symbols[mode][text]) {
			var replacement = symbols[mode][text].replace;
			if (replacement) text = replacement;
		}
		var fontName = fontMap[font].fontName;
		if (getCharacterMetrics(text, fontName, mode)) return fontMap[font].variant;
		return null;
	};
	function isNumberPunctuation(group) {
		if (!group) return false;
		if (group.type === "mi" && group.children.length === 1) {
			var child = group.children[0];
			return child instanceof TextNode && child.text === ".";
		} else if (group.type === "mo" && group.children.length === 1 && group.getAttribute("separator") === "true" && group.getAttribute("lspace") === "0em" && group.getAttribute("rspace") === "0em") {
			var _child = group.children[0];
			return _child instanceof TextNode && _child.text === ",";
		} else return false;
	}
	var buildExpression = function buildExpression(expression, options, isOrdgroup) {
		if (expression.length === 1) {
			var group = buildGroup(expression[0], options);
			if (isOrdgroup && group instanceof MathNode && group.type === "mo") {
				group.setAttribute("lspace", "0em");
				group.setAttribute("rspace", "0em");
			}
			return [group];
		}
		var groups = [];
		var lastGroup;
		for (var i = 0; i < expression.length; i++) {
			var _group = buildGroup(expression[i], options);
			if (_group instanceof MathNode && lastGroup instanceof MathNode) {
				if (_group.type === "mtext" && lastGroup.type === "mtext" && _group.getAttribute("mathvariant") === lastGroup.getAttribute("mathvariant")) {
					lastGroup.children.push(..._group.children);
					continue;
				} else if (_group.type === "mn" && lastGroup.type === "mn") {
					lastGroup.children.push(..._group.children);
					continue;
				} else if (isNumberPunctuation(_group) && lastGroup.type === "mn") {
					lastGroup.children.push(..._group.children);
					continue;
				} else if (_group.type === "mn" && isNumberPunctuation(lastGroup)) {
					_group.children = [...lastGroup.children, ..._group.children];
					groups.pop();
				} else if ((_group.type === "msup" || _group.type === "msub") && _group.children.length >= 1 && (lastGroup.type === "mn" || isNumberPunctuation(lastGroup))) {
					var base = _group.children[0];
					if (base instanceof MathNode && base.type === "mn") {
						base.children = [...lastGroup.children, ...base.children];
						groups.pop();
					}
				} else if (lastGroup.type === "mi" && lastGroup.children.length === 1) {
					var lastChild = lastGroup.children[0];
					if (lastChild instanceof TextNode && lastChild.text === "̸" && (_group.type === "mo" || _group.type === "mi" || _group.type === "mn")) {
						var child = _group.children[0];
						if (child instanceof TextNode && child.text.length > 0) {
							child.text = child.text.slice(0, 1) + "̸" + child.text.slice(1);
							groups.pop();
						}
					}
				}
			}
			groups.push(_group);
			lastGroup = _group;
		}
		return groups;
	};
	var buildExpressionRow = function buildExpressionRow(expression, options, isOrdgroup) {
		return makeRow(buildExpression(expression, options, isOrdgroup));
	};
	var buildGroup = function buildGroup(group, options) {
		if (!group) return new MathNode("mrow");
		if (_mathmlGroupBuilders[group.type]) return _mathmlGroupBuilders[group.type](group, options);
		else throw new ParseError("Got group of unknown type: '" + group.type + "'");
	};
	function buildMathML(tree, texExpression, options, isDisplayMode, forMathmlOnly) {
		var expression = buildExpression(tree, options);
		var wrapper;
		if (expression.length === 1 && expression[0] instanceof MathNode && rowLikeTypes.has(expression[0].type)) wrapper = expression[0];
		else wrapper = new MathNode("mrow", expression);
		var annotation = new MathNode("annotation", [new TextNode(texExpression)]);
		annotation.setAttribute("encoding", "application/x-tex");
		var math = new MathNode("math", [new MathNode("semantics", [wrapper, annotation])]);
		math.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML");
		if (isDisplayMode) math.setAttribute("display", "block");
		return makeSpan([forMathmlOnly ? "katex" : "katex-mathml"], [math]);
	}
	var sizeStyleMap = [
		[
			1,
			1,
			1
		],
		[
			2,
			1,
			1
		],
		[
			3,
			1,
			1
		],
		[
			4,
			2,
			1
		],
		[
			5,
			2,
			1
		],
		[
			6,
			3,
			1
		],
		[
			7,
			4,
			2
		],
		[
			8,
			6,
			3
		],
		[
			9,
			7,
			6
		],
		[
			10,
			8,
			7
		],
		[
			11,
			10,
			9
		]
	];
	var sizeMultipliers = [
		.5,
		.6,
		.7,
		.8,
		.9,
		1,
		1.2,
		1.44,
		1.728,
		2.074,
		2.488
	];
	var sizeAtStyle = function sizeAtStyle(size, style) {
		return style.size < 2 ? size : sizeStyleMap[size - 1][style.size - 1];
	};
	var Options = class Options {
		constructor(data) {
			this.style = void 0;
			this.color = void 0;
			this.size = void 0;
			this.textSize = void 0;
			this.phantom = void 0;
			this.font = void 0;
			this.fontFamily = void 0;
			this.fontWeight = void 0;
			this.fontShape = void 0;
			this.sizeMultiplier = void 0;
			this.maxSize = void 0;
			this.minRuleThickness = void 0;
			this._fontMetrics = void 0;
			this.style = data.style;
			this.color = data.color;
			this.size = data.size || Options.BASESIZE;
			this.textSize = data.textSize || this.size;
			this.phantom = !!data.phantom;
			this.font = data.font || "";
			this.fontFamily = data.fontFamily || "";
			this.fontWeight = data.fontWeight || "";
			this.fontShape = data.fontShape || "";
			this.sizeMultiplier = sizeMultipliers[this.size - 1];
			this.maxSize = data.maxSize;
			this.minRuleThickness = data.minRuleThickness;
			this._fontMetrics = void 0;
		}
		extend(extension) {
			var data = {
				style: this.style,
				size: this.size,
				textSize: this.textSize,
				color: this.color,
				phantom: this.phantom,
				font: this.font,
				fontFamily: this.fontFamily,
				fontWeight: this.fontWeight,
				fontShape: this.fontShape,
				maxSize: this.maxSize,
				minRuleThickness: this.minRuleThickness
			};
			Object.assign(data, extension);
			return new Options(data);
		}
		havingStyle(style) {
			if (this.style === style) return this;
			else return this.extend({
				style,
				size: sizeAtStyle(this.textSize, style)
			});
		}
		havingCrampedStyle() {
			return this.havingStyle(this.style.cramp());
		}
		havingSize(size) {
			if (this.size === size && this.textSize === size) return this;
			else return this.extend({
				style: this.style.text(),
				size,
				textSize: size,
				sizeMultiplier: sizeMultipliers[size - 1]
			});
		}
		havingBaseStyle(style) {
			style = style || this.style.text();
			var wantSize = sizeAtStyle(Options.BASESIZE, style);
			if (this.size === wantSize && this.textSize === Options.BASESIZE && this.style === style) return this;
			else return this.extend({
				style,
				size: wantSize
			});
		}
		havingBaseSizing() {
			var size;
			switch (this.style.id) {
				case 4:
				case 5:
					size = 3;
					break;
				case 6:
				case 7:
					size = 1;
					break;
				default: size = 6;
			}
			return this.extend({
				style: this.style.text(),
				size
			});
		}
		withColor(color) {
			return this.extend({ color });
		}
		withPhantom() {
			return this.extend({ phantom: true });
		}
		withFont(font) {
			return this.extend({ font });
		}
		withTextFontFamily(fontFamily) {
			return this.extend({
				fontFamily,
				font: ""
			});
		}
		withTextFontWeight(fontWeight) {
			return this.extend({
				fontWeight,
				font: ""
			});
		}
		withTextFontShape(fontShape) {
			return this.extend({
				fontShape,
				font: ""
			});
		}
		sizingClasses(oldOptions) {
			if (oldOptions.size !== this.size) return [
				"sizing",
				"reset-size" + oldOptions.size,
				"size" + this.size
			];
			else return [];
		}
		baseSizingClasses() {
			if (this.size !== Options.BASESIZE) return [
				"sizing",
				"reset-size" + this.size,
				"size" + Options.BASESIZE
			];
			else return [];
		}
		fontMetrics() {
			if (!this._fontMetrics) this._fontMetrics = getGlobalMetrics(this.size);
			return this._fontMetrics;
		}
		getColor() {
			if (this.phantom) return "transparent";
			else return this.color;
		}
	};
	Options.BASESIZE = 6;
	var optionsFromSettings = function optionsFromSettings(settings) {
		return new Options({
			style: settings.displayMode ? Style$1.DISPLAY : Style$1.TEXT,
			maxSize: settings.maxSize,
			minRuleThickness: settings.minRuleThickness
		});
	};
	var displayWrap = function displayWrap(node, settings) {
		if (settings.displayMode) {
			var classes = ["katex-display"];
			if (settings.leqno) classes.push("leqno");
			if (settings.fleqn) classes.push("fleqn");
			node = makeSpan(classes, [node]);
		}
		return node;
	};
	var buildTree = function buildTree(tree, expression, settings) {
		var options = optionsFromSettings(settings);
		var katexNode;
		if (settings.output === "mathml") return buildMathML(tree, expression, options, settings.displayMode, true);
		else if (settings.output === "html") katexNode = makeSpan(["katex"], [buildHTML(tree, options)]);
		else katexNode = makeSpan(["katex"], [buildMathML(tree, expression, options, settings.displayMode, false), buildHTML(tree, options)]);
		return displayWrap(katexNode, settings);
	};
	var buildHTMLTree = function buildHTMLTree(tree, expression, settings) {
		return displayWrap(makeSpan(["katex"], [buildHTML(tree, optionsFromSettings(settings))]), settings);
	};
	var stretchyCodePoint = {
		widehat: "^",
		widecheck: "ˇ",
		widetilde: "~",
		utilde: "~",
		overleftarrow: "←",
		underleftarrow: "←",
		xleftarrow: "←",
		overrightarrow: "→",
		underrightarrow: "→",
		xrightarrow: "→",
		underbrace: "⏟",
		overbrace: "⏞",
		underbracket: "⎵",
		overbracket: "⎴",
		overgroup: "⏠",
		undergroup: "⏡",
		overleftrightarrow: "↔",
		underleftrightarrow: "↔",
		xleftrightarrow: "↔",
		Overrightarrow: "⇒",
		xRightarrow: "⇒",
		overleftharpoon: "↼",
		xleftharpoonup: "↼",
		overrightharpoon: "⇀",
		xrightharpoonup: "⇀",
		xLeftarrow: "⇐",
		xLeftrightarrow: "⇔",
		xhookleftarrow: "↩",
		xhookrightarrow: "↪",
		xmapsto: "↦",
		xrightharpoondown: "⇁",
		xleftharpoondown: "↽",
		xrightleftharpoons: "⇌",
		xleftrightharpoons: "⇋",
		xtwoheadleftarrow: "↞",
		xtwoheadrightarrow: "↠",
		xlongequal: "=",
		xtofrom: "⇄",
		xrightleftarrows: "⇄",
		xrightequilibrium: "⇌",
		xleftequilibrium: "⇋",
		"\\cdrightarrow": "→",
		"\\cdleftarrow": "←",
		"\\cdlongequal": "="
	};
	var stretchyMathML = function stretchyMathML(label) {
		var node = new MathNode("mo", [new TextNode(stretchyCodePoint[label.replace(/^\\/, "")])]);
		node.setAttribute("stretchy", "true");
		return node;
	};
	var katexImagesData = {
		overrightarrow: [
			["rightarrow"],
			.888,
			522,
			"xMaxYMin"
		],
		overleftarrow: [
			["leftarrow"],
			.888,
			522,
			"xMinYMin"
		],
		underrightarrow: [
			["rightarrow"],
			.888,
			522,
			"xMaxYMin"
		],
		underleftarrow: [
			["leftarrow"],
			.888,
			522,
			"xMinYMin"
		],
		xrightarrow: [
			["rightarrow"],
			1.469,
			522,
			"xMaxYMin"
		],
		"\\cdrightarrow": [
			["rightarrow"],
			3,
			522,
			"xMaxYMin"
		],
		xleftarrow: [
			["leftarrow"],
			1.469,
			522,
			"xMinYMin"
		],
		"\\cdleftarrow": [
			["leftarrow"],
			3,
			522,
			"xMinYMin"
		],
		Overrightarrow: [
			["doublerightarrow"],
			.888,
			560,
			"xMaxYMin"
		],
		xRightarrow: [
			["doublerightarrow"],
			1.526,
			560,
			"xMaxYMin"
		],
		xLeftarrow: [
			["doubleleftarrow"],
			1.526,
			560,
			"xMinYMin"
		],
		overleftharpoon: [
			["leftharpoon"],
			.888,
			522,
			"xMinYMin"
		],
		xleftharpoonup: [
			["leftharpoon"],
			.888,
			522,
			"xMinYMin"
		],
		xleftharpoondown: [
			["leftharpoondown"],
			.888,
			522,
			"xMinYMin"
		],
		overrightharpoon: [
			["rightharpoon"],
			.888,
			522,
			"xMaxYMin"
		],
		xrightharpoonup: [
			["rightharpoon"],
			.888,
			522,
			"xMaxYMin"
		],
		xrightharpoondown: [
			["rightharpoondown"],
			.888,
			522,
			"xMaxYMin"
		],
		xlongequal: [
			["longequal"],
			.888,
			334,
			"xMinYMin"
		],
		"\\cdlongequal": [
			["longequal"],
			3,
			334,
			"xMinYMin"
		],
		xtwoheadleftarrow: [
			["twoheadleftarrow"],
			.888,
			334,
			"xMinYMin"
		],
		xtwoheadrightarrow: [
			["twoheadrightarrow"],
			.888,
			334,
			"xMaxYMin"
		],
		overleftrightarrow: [
			["leftarrow", "rightarrow"],
			.888,
			522
		],
		overbrace: [
			[
				"leftbrace",
				"midbrace",
				"rightbrace"
			],
			1.6,
			548
		],
		underbrace: [
			[
				"leftbraceunder",
				"midbraceunder",
				"rightbraceunder"
			],
			1.6,
			548
		],
		underleftrightarrow: [
			["leftarrow", "rightarrow"],
			.888,
			522
		],
		xleftrightarrow: [
			["leftarrow", "rightarrow"],
			1.75,
			522
		],
		xLeftrightarrow: [
			["doubleleftarrow", "doublerightarrow"],
			1.75,
			560
		],
		xrightleftharpoons: [
			["leftharpoondownplus", "rightharpoonplus"],
			1.75,
			716
		],
		xleftrightharpoons: [
			["leftharpoonplus", "rightharpoondownplus"],
			1.75,
			716
		],
		xhookleftarrow: [
			["leftarrow", "righthook"],
			1.08,
			522
		],
		xhookrightarrow: [
			["lefthook", "rightarrow"],
			1.08,
			522
		],
		overlinesegment: [
			["leftlinesegment", "rightlinesegment"],
			.888,
			522
		],
		underlinesegment: [
			["leftlinesegment", "rightlinesegment"],
			.888,
			522
		],
		overbracket: [
			["leftbracketover", "rightbracketover"],
			1.6,
			440
		],
		underbracket: [
			["leftbracketunder", "rightbracketunder"],
			1.6,
			410
		],
		overgroup: [
			["leftgroup", "rightgroup"],
			.888,
			342
		],
		undergroup: [
			["leftgroupunder", "rightgroupunder"],
			.888,
			342
		],
		xmapsto: [
			["leftmapsto", "rightarrow"],
			1.5,
			522
		],
		xtofrom: [
			["leftToFrom", "rightToFrom"],
			1.75,
			528
		],
		xrightleftarrows: [
			["baraboveleftarrow", "rightarrowabovebar"],
			1.75,
			901
		],
		xrightequilibrium: [
			["baraboveshortleftharpoon", "rightharpoonaboveshortbar"],
			1.75,
			716
		],
		xleftequilibrium: [
			["shortbaraboveleftharpoon", "shortrightharpoonabovebar"],
			1.75,
			716
		]
	};
	var wideAccentLabels = new Set([
		"widehat",
		"widecheck",
		"widetilde",
		"utilde"
	]);
	var stretchySvg = function stretchySvg(group, options) {
		function buildSvgSpan_() {
			var viewBoxWidth = 4e5;
			var label = group.label.slice(1);
			if (wideAccentLabels.has(label) && "base" in group) {
				var numChars = group.base.type === "ordgroup" ? group.base.body.length : 1;
				var viewBoxHeight;
				var pathName;
				var _height;
				if (numChars > 5) {
					if (label === "widehat" || label === "widecheck") {
						viewBoxHeight = 420;
						viewBoxWidth = 2364;
						_height = .42;
						pathName = label + "4";
					} else {
						viewBoxHeight = 312;
						viewBoxWidth = 2340;
						_height = .34;
						pathName = "tilde4";
					}
				} else {
					var imgIndex = [
						1,
						1,
						2,
						2,
						3,
						3
					][numChars];
					if (label === "widehat" || label === "widecheck") {
						viewBoxWidth = [
							0,
							1062,
							2364,
							2364,
							2364
						][imgIndex];
						viewBoxHeight = [
							0,
							239,
							300,
							360,
							420
						][imgIndex];
						_height = [
							0,
							.24,
							.3,
							.3,
							.36,
							.42
						][imgIndex];
						pathName = label + imgIndex;
					} else {
						viewBoxWidth = [
							0,
							600,
							1033,
							2339,
							2340
						][imgIndex];
						viewBoxHeight = [
							0,
							260,
							286,
							306,
							312
						][imgIndex];
						_height = [
							0,
							.26,
							.286,
							.3,
							.306,
							.34
						][imgIndex];
						pathName = "tilde" + imgIndex;
					}
				}
				return {
					span: makeSvgSpan([], [new SvgNode([new PathNode(pathName)], {
						"width": "100%",
						"height": makeEm(_height),
						"viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight,
						"preserveAspectRatio": "none"
					})], options),
					minWidth: 0,
					height: _height
				};
			} else {
				var spans = [];
				var data = katexImagesData[label];
				if (!data) throw new Error("No SVG data for \"" + label + "\".");
				var [paths, _minWidth, _viewBoxHeight] = data;
				var _height2 = _viewBoxHeight / 1e3;
				var numSvgChildren = paths.length;
				var widthClasses;
				var aligns;
				if (numSvgChildren === 1) {
					if (data.length !== 4) throw new Error("Expected 4-tuple for single-path SVG data \"" + label + "\".");
					widthClasses = ["hide-tail"];
					aligns = [data[3]];
				} else if (numSvgChildren === 2) {
					widthClasses = ["halfarrow-left", "halfarrow-right"];
					aligns = ["xMinYMin", "xMaxYMin"];
				} else if (numSvgChildren === 3) {
					widthClasses = [
						"brace-left",
						"brace-center",
						"brace-right"
					];
					aligns = [
						"xMinYMin",
						"xMidYMin",
						"xMaxYMin"
					];
				} else throw new Error("Correct katexImagesData or update code here to support\n                    " + numSvgChildren + " children.");
				for (var i = 0; i < numSvgChildren; i++) {
					var _svgNode = new SvgNode([new PathNode(paths[i])], {
						"width": "400em",
						"height": makeEm(_height2),
						"viewBox": "0 0 " + viewBoxWidth + " " + _viewBoxHeight,
						"preserveAspectRatio": aligns[i] + " slice"
					});
					var _span = makeSvgSpan([widthClasses[i]], [_svgNode], options);
					if (numSvgChildren === 1) return {
						span: _span,
						minWidth: _minWidth,
						height: _height2
					};
					else {
						_span.style.height = makeEm(_height2);
						spans.push(_span);
					}
				}
				return {
					span: makeSpan(["stretchy"], spans, options),
					minWidth: _minWidth,
					height: _height2
				};
			}
		}
		var { span, minWidth, height } = buildSvgSpan_();
		span.height = height;
		span.style.height = makeEm(height);
		if (minWidth > 0) span.style.minWidth = makeEm(minWidth);
		return span;
	};
	var stretchyEnclose = function stretchyEnclose(inner, label, topPad, bottomPad, options) {
		var img;
		var totalHeight = inner.height + inner.depth + topPad + bottomPad;
		if (/fbox|color|angl/.test(label)) {
			img = makeSpan(["stretchy", label], [], options);
			if (label === "fbox") {
				var color = options.color && options.getColor();
				if (color) img.style.borderColor = color;
			}
		} else {
			var lines = [];
			if (/^[bx]cancel$/.test(label)) lines.push(new LineNode({
				"x1": "0",
				"y1": "0",
				"x2": "100%",
				"y2": "100%",
				"stroke-width": "0.046em"
			}));
			if (/^x?cancel$/.test(label)) lines.push(new LineNode({
				"x1": "0",
				"y1": "100%",
				"x2": "100%",
				"y2": "0",
				"stroke-width": "0.046em"
			}));
			img = makeSvgSpan([], [new SvgNode(lines, {
				"width": "100%",
				"height": makeEm(totalHeight)
			})], options);
		}
		img.height = totalHeight;
		img.style.height = makeEm(totalHeight);
		return img;
	};
	var ATOMS = {
		"bin": 1,
		"close": 1,
		"inner": 1,
		"open": 1,
		"punct": 1,
		"rel": 1
	};
	var NON_ATOMS = {
		"accent-token": 1,
		"mathord": 1,
		"op-token": 1,
		"spacing": 1,
		"textord": 1
	};
	function isAtom(value) {
		return value in ATOMS;
	}
	function assertNodeType(node, type) {
		if (!node || node.type !== type) throw new Error("Expected node of type " + type + ", but got " + (node ? "node of type " + node.type : String(node)));
		return node;
	}
	function assertSymbolNodeType(node) {
		var typedNode = checkSymbolNodeType(node);
		if (!typedNode) throw new Error("Expected node of symbol group type, but got " + (node ? "node of type " + node.type : String(node)));
		return typedNode;
	}
	function checkSymbolNodeType(node) {
		if (node && (node.type === "atom" || NON_ATOMS.hasOwnProperty(node.type))) return node;
		return null;
	}
	var getBaseSymbol = (group) => {
		if (group instanceof SymbolNode) return group;
		if (hasHtmlDomChildren(group) && group.children.length === 1) return getBaseSymbol(group.children[0]);
	};
	var htmlBuilder$a = (grp, options) => {
		var base;
		var group;
		var supSubGroup;
		if (grp && grp.type === "supsub") {
			group = assertNodeType(grp.base, "accent");
			base = group.base;
			grp.base = base;
			supSubGroup = assertSpan(buildGroup$1(grp, options));
			grp.base = group;
		} else {
			group = assertNodeType(grp, "accent");
			base = group.base;
		}
		var body = buildGroup$1(base, options.havingCrampedStyle());
		var mustShift = group.isShifty && isCharacterBox(base);
		var skew = 0;
		if (mustShift) {
			var _getBaseSymbol$skew, _getBaseSymbol;
			skew = (_getBaseSymbol$skew = (_getBaseSymbol = getBaseSymbol(body)) == null ? void 0 : _getBaseSymbol.skew) != null ? _getBaseSymbol$skew : 0;
		}
		var accentBelow = group.label === "\\c";
		var clearance = accentBelow ? body.height + body.depth : Math.min(body.height, options.fontMetrics().xHeight);
		var accentBody;
		if (!group.isStretchy) {
			var accent;
			var width;
			if (group.label === "\\vec") {
				accent = staticSvg("vec", options);
				width = svgData.vec[1];
			} else {
				accent = makeOrd({
					type: "textord",
					mode: group.mode,
					text: group.label
				}, options, "textord");
				accent = assertSymbolDomNode(accent);
				accent.italic = 0;
				width = accent.width;
				if (accentBelow) clearance += accent.depth;
			}
			accentBody = makeSpan(["accent-body"], [accent]);
			var accentFull = group.label === "\\textcircled";
			if (accentFull) {
				accentBody.classes.push("accent-full");
				clearance = body.height;
			}
			var left = skew;
			if (!accentFull) left -= width / 2;
			accentBody.style.left = makeEm(left);
			if (group.label === "\\textcircled") accentBody.style.top = ".2em";
			accentBody = makeVList({
				positionType: "firstBaseline",
				children: [
					{
						type: "elem",
						elem: body
					},
					{
						type: "kern",
						size: -clearance
					},
					{
						type: "elem",
						elem: accentBody
					}
				]
			});
		} else {
			accentBody = stretchySvg(group, options);
			accentBody = makeVList({
				positionType: "firstBaseline",
				children: [{
					type: "elem",
					elem: body
				}, {
					type: "elem",
					elem: accentBody,
					wrapperClasses: ["svg-align"],
					wrapperStyle: skew > 0 ? {
						width: "calc(100% - " + makeEm(2 * skew) + ")",
						marginLeft: makeEm(2 * skew)
					} : void 0
				}]
			});
		}
		var accentWrap = makeSpan(["mord", "accent"], [accentBody], options);
		if (supSubGroup) {
			supSubGroup.children[0] = accentWrap;
			supSubGroup.height = Math.max(accentWrap.height, supSubGroup.height);
			supSubGroup.classes[0] = "mord";
			return supSubGroup;
		} else return accentWrap;
	};
	var mathmlBuilder$9 = (group, options) => {
		var accentNode = group.isStretchy ? stretchyMathML(group.label) : new MathNode("mo", [makeText(group.label, group.mode)]);
		var node = new MathNode("mover", [buildGroup(group.base, options), accentNode]);
		node.setAttribute("accent", "true");
		return node;
	};
	var NON_STRETCHY_ACCENT_REGEX = new RegExp([
		"\\acute",
		"\\grave",
		"\\ddot",
		"\\tilde",
		"\\bar",
		"\\breve",
		"\\check",
		"\\hat",
		"\\vec",
		"\\dot",
		"\\mathring"
	].map((accent) => "\\" + accent).join("|"));
	defineFunction({
		type: "accent",
		names: [
			"\\acute",
			"\\grave",
			"\\ddot",
			"\\tilde",
			"\\bar",
			"\\breve",
			"\\check",
			"\\hat",
			"\\vec",
			"\\dot",
			"\\mathring",
			"\\widecheck",
			"\\widehat",
			"\\widetilde",
			"\\overrightarrow",
			"\\overleftarrow",
			"\\Overrightarrow",
			"\\overleftrightarrow",
			"\\overgroup",
			"\\overlinesegment",
			"\\overleftharpoon",
			"\\overrightharpoon"
		],
		props: { numArgs: 1 },
		handler: (context, args) => {
			var base = normalizeArgument(args[0]);
			var isStretchy = !NON_STRETCHY_ACCENT_REGEX.test(context.funcName);
			var isShifty = !isStretchy || context.funcName === "\\widehat" || context.funcName === "\\widetilde" || context.funcName === "\\widecheck";
			return {
				type: "accent",
				mode: context.parser.mode,
				label: context.funcName,
				isStretchy,
				isShifty,
				base
			};
		},
		htmlBuilder: htmlBuilder$a,
		mathmlBuilder: mathmlBuilder$9
	});
	defineFunction({
		type: "accent",
		names: [
			"\\'",
			"\\`",
			"\\^",
			"\\~",
			"\\=",
			"\\u",
			"\\.",
			"\\\"",
			"\\c",
			"\\r",
			"\\H",
			"\\v",
			"\\textcircled"
		],
		props: {
			numArgs: 1,
			allowedInText: true,
			allowedInMath: true,
			argTypes: ["primitive"]
		},
		handler: (context, args) => {
			var base = args[0];
			var mode = context.parser.mode;
			if (mode === "math") {
				context.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + context.funcName + " works only in text mode");
				mode = "text";
			}
			return {
				type: "accent",
				mode,
				label: context.funcName,
				isStretchy: false,
				isShifty: true,
				base
			};
		},
		htmlBuilder: htmlBuilder$a,
		mathmlBuilder: mathmlBuilder$9
	});
	defineFunction({
		type: "accentUnder",
		names: [
			"\\underleftarrow",
			"\\underrightarrow",
			"\\underleftrightarrow",
			"\\undergroup",
			"\\underlinesegment",
			"\\utilde"
		],
		props: { numArgs: 1 },
		handler: (_ref, args) => {
			var { parser, funcName } = _ref;
			var base = args[0];
			return {
				type: "accentUnder",
				mode: parser.mode,
				label: funcName,
				base
			};
		},
		htmlBuilder: (group, options) => {
			var innerGroup = buildGroup$1(group.base, options);
			var accentBody = stretchySvg(group, options);
			var kern = group.label === "\\utilde" ? .12 : 0;
			return makeSpan(["mord", "accentunder"], [makeVList({
				positionType: "top",
				positionData: innerGroup.height,
				children: [
					{
						type: "elem",
						elem: accentBody,
						wrapperClasses: ["svg-align"]
					},
					{
						type: "kern",
						size: kern
					},
					{
						type: "elem",
						elem: innerGroup
					}
				]
			})], options);
		},
		mathmlBuilder: (group, options) => {
			var accentNode = stretchyMathML(group.label);
			var node = new MathNode("munder", [buildGroup(group.base, options), accentNode]);
			node.setAttribute("accentunder", "true");
			return node;
		}
	});
	var paddedNode = (group) => {
		var node = new MathNode("mpadded", group ? [group] : []);
		node.setAttribute("width", "+0.6em");
		node.setAttribute("lspace", "0.3em");
		return node;
	};
	defineFunction({
		type: "xArrow",
		names: [
			"\\xleftarrow",
			"\\xrightarrow",
			"\\xLeftarrow",
			"\\xRightarrow",
			"\\xleftrightarrow",
			"\\xLeftrightarrow",
			"\\xhookleftarrow",
			"\\xhookrightarrow",
			"\\xmapsto",
			"\\xrightharpoondown",
			"\\xrightharpoonup",
			"\\xleftharpoondown",
			"\\xleftharpoonup",
			"\\xrightleftharpoons",
			"\\xleftrightharpoons",
			"\\xlongequal",
			"\\xtwoheadrightarrow",
			"\\xtwoheadleftarrow",
			"\\xtofrom",
			"\\xrightleftarrows",
			"\\xrightequilibrium",
			"\\xleftequilibrium",
			"\\\\cdrightarrow",
			"\\\\cdleftarrow",
			"\\\\cdlongequal"
		],
		props: {
			numArgs: 1,
			numOptionalArgs: 1
		},
		handler(_ref, args, optArgs) {
			var { parser, funcName } = _ref;
			return {
				type: "xArrow",
				mode: parser.mode,
				label: funcName,
				body: args[0],
				below: optArgs[0]
			};
		},
		htmlBuilder(group, options) {
			var style = options.style;
			var newOptions = options.havingStyle(style.sup());
			var upperGroup = wrapFragment(buildGroup$1(group.body, newOptions, options), options);
			var arrowPrefix = group.label.slice(0, 2) === "\\x" ? "x" : "cd";
			upperGroup.classes.push(arrowPrefix + "-arrow-pad");
			var lowerGroup;
			if (group.below) {
				newOptions = options.havingStyle(style.sub());
				lowerGroup = wrapFragment(buildGroup$1(group.below, newOptions, options), options);
				lowerGroup.classes.push(arrowPrefix + "-arrow-pad");
			}
			var arrowBody = stretchySvg(group, options);
			var arrowShift = -options.fontMetrics().axisHeight + .5 * arrowBody.height;
			var upperShift = -options.fontMetrics().axisHeight - .5 * arrowBody.height - .111;
			if (upperGroup.depth > .25 || group.label === "\\xleftequilibrium") upperShift -= upperGroup.depth;
			var vlist;
			if (lowerGroup) {
				var lowerShift = -options.fontMetrics().axisHeight + lowerGroup.height + .5 * arrowBody.height + .111;
				vlist = makeVList({
					positionType: "individualShift",
					children: [
						{
							type: "elem",
							elem: upperGroup,
							shift: upperShift
						},
						{
							type: "elem",
							elem: arrowBody,
							shift: arrowShift,
							wrapperClasses: ["svg-align"]
						},
						{
							type: "elem",
							elem: lowerGroup,
							shift: lowerShift
						}
					]
				});
			} else vlist = makeVList({
				positionType: "individualShift",
				children: [{
					type: "elem",
					elem: upperGroup,
					shift: upperShift
				}, {
					type: "elem",
					elem: arrowBody,
					shift: arrowShift,
					wrapperClasses: ["svg-align"]
				}]
			});
			return makeSpan(["mrel", "x-arrow"], [vlist], options);
		},
		mathmlBuilder(group, options) {
			var arrowNode = stretchyMathML(group.label);
			arrowNode.setAttribute("minsize", group.label.charAt(0) === "x" ? "1.75em" : "3.0em");
			var node;
			if (group.body) {
				var upperNode = paddedNode(buildGroup(group.body, options));
				if (group.below) node = new MathNode("munderover", [
					arrowNode,
					paddedNode(buildGroup(group.below, options)),
					upperNode
				]);
				else node = new MathNode("mover", [arrowNode, upperNode]);
			} else if (group.below) node = new MathNode("munder", [arrowNode, paddedNode(buildGroup(group.below, options))]);
			else {
				node = paddedNode();
				node = new MathNode("mover", [arrowNode, node]);
			}
			return node;
		}
	});
	function htmlBuilder$9(group, options) {
		var elements = buildExpression$1(group.body, options, true);
		return makeSpan([group.mclass], elements, options);
	}
	function mathmlBuilder$8(group, options) {
		var node;
		var inner = buildExpression(group.body, options);
		if (group.mclass === "minner") node = new MathNode("mpadded", inner);
		else if (group.mclass === "mord") {
			if (group.isCharacterBox) {
				node = inner[0];
				node.type = "mi";
			} else node = new MathNode("mi", inner);
		} else {
			if (group.isCharacterBox) {
				node = inner[0];
				node.type = "mo";
			} else node = new MathNode("mo", inner);
			if (group.mclass === "mbin") {
				node.attributes.lspace = "0.22em";
				node.attributes.rspace = "0.22em";
			} else if (group.mclass === "mpunct") {
				node.attributes.lspace = "0em";
				node.attributes.rspace = "0.17em";
			} else if (group.mclass === "mopen" || group.mclass === "mclose") {
				node.attributes.lspace = "0em";
				node.attributes.rspace = "0em";
			} else if (group.mclass === "minner") {
				node.attributes.lspace = "0.0556em";
				node.attributes.width = "+0.1111em";
			}
		}
		return node;
	}
	defineFunction({
		type: "mclass",
		names: [
			"\\mathord",
			"\\mathbin",
			"\\mathrel",
			"\\mathopen",
			"\\mathclose",
			"\\mathpunct",
			"\\mathinner"
		],
		props: {
			numArgs: 1,
			primitive: true
		},
		handler(_ref, args) {
			var { parser, funcName } = _ref;
			var body = args[0];
			return {
				type: "mclass",
				mode: parser.mode,
				mclass: "m" + funcName.slice(5),
				body: ordargument(body),
				isCharacterBox: isCharacterBox(body)
			};
		},
		htmlBuilder: htmlBuilder$9,
		mathmlBuilder: mathmlBuilder$8
	});
	var binrelClass = (arg) => {
		var atom = arg.type === "ordgroup" && arg.body.length ? arg.body[0] : arg;
		if (atom.type === "atom" && (atom.family === "bin" || atom.family === "rel")) return "m" + atom.family;
		else return "mord";
	};
	defineFunction({
		type: "mclass",
		names: ["\\@binrel"],
		props: { numArgs: 2 },
		handler(_ref2, args) {
			var { parser } = _ref2;
			return {
				type: "mclass",
				mode: parser.mode,
				mclass: binrelClass(args[0]),
				body: ordargument(args[1]),
				isCharacterBox: isCharacterBox(args[1])
			};
		}
	});
	defineFunction({
		type: "mclass",
		names: [
			"\\stackrel",
			"\\overset",
			"\\underset"
		],
		props: { numArgs: 2 },
		handler(_ref3, args) {
			var { parser, funcName } = _ref3;
			var baseArg = args[1];
			var shiftedArg = args[0];
			var mclass;
			if (funcName !== "\\stackrel") mclass = binrelClass(baseArg);
			else mclass = "mrel";
			var baseOp = {
				type: "op",
				mode: baseArg.mode,
				limits: true,
				alwaysHandleSupSub: true,
				parentIsSupSub: false,
				symbol: false,
				suppressBaseShift: funcName !== "\\stackrel",
				body: ordargument(baseArg)
			};
			var supsub = {
				type: "supsub",
				mode: shiftedArg.mode,
				base: baseOp,
				sup: funcName === "\\underset" ? null : shiftedArg,
				sub: funcName === "\\underset" ? shiftedArg : null
			};
			return {
				type: "mclass",
				mode: parser.mode,
				mclass,
				body: [supsub],
				isCharacterBox: isCharacterBox(supsub)
			};
		},
		htmlBuilder: htmlBuilder$9,
		mathmlBuilder: mathmlBuilder$8
	});
	defineFunction({
		type: "pmb",
		names: ["\\pmb"],
		props: {
			numArgs: 1,
			allowedInText: true
		},
		handler(_ref, args) {
			var { parser } = _ref;
			return {
				type: "pmb",
				mode: parser.mode,
				mclass: binrelClass(args[0]),
				body: ordargument(args[0])
			};
		},
		htmlBuilder(group, options) {
			var elements = buildExpression$1(group.body, options, true);
			var node = makeSpan([group.mclass], elements, options);
			node.style.textShadow = "0.02em 0.01em 0.04px";
			return node;
		},
		mathmlBuilder(group, style) {
			var node = new MathNode("mstyle", buildExpression(group.body, style));
			node.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px");
			return node;
		}
	});
	var cdArrowFunctionName = {
		">": "\\\\cdrightarrow",
		"<": "\\\\cdleftarrow",
		"=": "\\\\cdlongequal",
		"A": "\\uparrow",
		"V": "\\downarrow",
		"|": "\\Vert",
		".": "no arrow"
	};
	var newCell = () => {
		return {
			type: "styling",
			body: [],
			mode: "math",
			style: "display",
			resetFont: true
		};
	};
	var isStartOfArrow = (node) => {
		return node.type === "textord" && node.text === "@";
	};
	var isLabelEnd = (node, endChar) => {
		return (node.type === "mathord" || node.type === "atom") && node.text === endChar;
	};
	function cdArrow(arrowChar, labels, parser) {
		var funcName = cdArrowFunctionName[arrowChar];
		switch (funcName) {
			case "\\\\cdrightarrow":
			case "\\\\cdleftarrow": return parser.callFunction(funcName, [labels[0]], [labels[1]]);
			case "\\uparrow":
			case "\\downarrow":
				var leftLabel = parser.callFunction("\\\\cdleft", [labels[0]], []);
				var bareArrow = {
					type: "atom",
					text: funcName,
					mode: "math",
					family: "rel"
				};
				var arrowGroup = {
					type: "ordgroup",
					mode: "math",
					body: [
						leftLabel,
						parser.callFunction("\\Big", [bareArrow], []),
						parser.callFunction("\\\\cdright", [labels[1]], [])
					]
				};
				return parser.callFunction("\\\\cdparent", [arrowGroup], []);
			case "\\\\cdlongequal": return parser.callFunction("\\\\cdlongequal", [], []);
			case "\\Vert": return parser.callFunction("\\Big", [{
				type: "textord",
				text: "\\Vert",
				mode: "math"
			}], []);
			default: return {
				type: "textord",
				text: " ",
				mode: "math"
			};
		}
	}
	function parseCD(parser) {
		var parsedRows = [];
		parser.gullet.beginGroup();
		parser.gullet.macros.set("\\cr", "\\\\\\relax");
		parser.gullet.beginGroup();
		while (true) {
			parsedRows.push(parser.parseExpression(false, "\\\\"));
			parser.gullet.endGroup();
			parser.gullet.beginGroup();
			var next = parser.fetch().text;
			if (next === "&" || next === "\\\\") parser.consume();
			else if (next === "\\end") {
				if (parsedRows[parsedRows.length - 1].length === 0) parsedRows.pop();
				break;
			} else throw new ParseError("Expected \\\\ or \\cr or \\end", parser.nextToken);
		}
		var row = [];
		var body = [row];
		for (var i = 0; i < parsedRows.length; i++) {
			var rowNodes = parsedRows[i];
			var cell = newCell();
			for (var j = 0; j < rowNodes.length; j++) if (!isStartOfArrow(rowNodes[j])) cell.body.push(rowNodes[j]);
			else {
				row.push(cell);
				j += 1;
				var arrowChar = assertSymbolNodeType(rowNodes[j]).text;
				var labels = new Array(2);
				labels[0] = {
					type: "ordgroup",
					mode: "math",
					body: []
				};
				labels[1] = {
					type: "ordgroup",
					mode: "math",
					body: []
				};
				if ("=|.".includes(arrowChar));
				else if ("<>AV".includes(arrowChar)) for (var labelNum = 0; labelNum < 2; labelNum++) {
					var inLabel = true;
					for (var k = j + 1; k < rowNodes.length; k++) {
						if (isLabelEnd(rowNodes[k], arrowChar)) {
							inLabel = false;
							j = k;
							break;
						}
						if (isStartOfArrow(rowNodes[k])) throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[k]);
						labels[labelNum].body.push(rowNodes[k]);
					}
					if (inLabel) throw new ParseError("Missing a " + arrowChar + " character to complete a CD arrow.", rowNodes[j]);
				}
				else throw new ParseError("Expected one of \"<>AV=|.\" after @", rowNodes[j]);
				var wrappedArrow = {
					type: "styling",
					body: [cdArrow(arrowChar, labels, parser)],
					mode: "math",
					style: "display",
					resetFont: true
				};
				row.push(wrappedArrow);
				cell = newCell();
			}
			if (i % 2 === 0) row.push(cell);
			else row.shift();
			row = [];
			body.push(row);
		}
		parser.gullet.endGroup();
		parser.gullet.endGroup();
		return {
			type: "array",
			mode: "math",
			body,
			arraystretch: 1,
			addJot: true,
			rowGaps: [null],
			cols: new Array(body[0].length).fill({
				type: "align",
				align: "c",
				pregap: .25,
				postgap: .25
			}),
			colSeparationType: "CD",
			hLinesBeforeRow: new Array(body.length + 1).fill([])
		};
	}
	defineFunction({
		type: "cdlabel",
		names: ["\\\\cdleft", "\\\\cdright"],
		props: { numArgs: 1 },
		handler(_ref, args) {
			var { parser, funcName } = _ref;
			return {
				type: "cdlabel",
				mode: parser.mode,
				side: funcName.slice(4),
				label: args[0]
			};
		},
		htmlBuilder(group, options) {
			var newOptions = options.havingStyle(options.style.sup());
			var label = wrapFragment(buildGroup$1(group.label, newOptions, options), options);
			label.classes.push("cd-label-" + group.side);
			label.style.bottom = makeEm(.8 - label.depth);
			label.height = 0;
			label.depth = 0;
			return label;
		},
		mathmlBuilder(group, options) {
			var label = new MathNode("mrow", [buildGroup(group.label, options)]);
			label = new MathNode("mpadded", [label]);
			label.setAttribute("width", "0");
			if (group.side === "left") label.setAttribute("lspace", "-1width");
			label.setAttribute("voffset", "0.7em");
			label = new MathNode("mstyle", [label]);
			label.setAttribute("displaystyle", "false");
			label.setAttribute("scriptlevel", "1");
			return label;
		}
	});
	defineFunction({
		type: "cdlabelparent",
		names: ["\\\\cdparent"],
		props: { numArgs: 1 },
		handler(_ref2, args) {
			var { parser } = _ref2;
			return {
				type: "cdlabelparent",
				mode: parser.mode,
				fragment: args[0]
			};
		},
		htmlBuilder(group, options) {
			var parent = wrapFragment(buildGroup$1(group.fragment, options), options);
			parent.classes.push("cd-vert-arrow");
			return parent;
		},
		mathmlBuilder(group, options) {
			return new MathNode("mrow", [buildGroup(group.fragment, options)]);
		}
	});
	defineFunction({
		type: "textord",
		names: ["\\@char"],
		props: {
			numArgs: 1,
			allowedInText: true
		},
		handler(_ref, args) {
			var { parser } = _ref;
			var group = assertNodeType(args[0], "ordgroup").body;
			var number = "";
			for (var i = 0; i < group.length; i++) {
				var node = assertNodeType(group[i], "textord");
				number += node.text;
			}
			var code = parseInt(number);
			var text;
			if (isNaN(code)) throw new ParseError("\\@char has non-numeric argument " + number);
			else if (code < 0 || code >= 1114111) throw new ParseError("\\@char with invalid code point " + number);
			else if (code <= 65535) text = String.fromCharCode(code);
			else {
				code -= 65536;
				text = String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
			}
			return {
				type: "textord",
				mode: parser.mode,
				text
			};
		}
	});
	var htmlBuilder$8 = (group, options) => {
		return makeFragment(buildExpression$1(group.body, options.withColor(group.color), false));
	};
	var mathmlBuilder$7 = (group, options) => {
		var node = new MathNode("mstyle", buildExpression(group.body, options.withColor(group.color)));
		node.setAttribute("mathcolor", group.color);
		return node;
	};
	defineFunction({
		type: "color",
		names: ["\\textcolor"],
		props: {
			numArgs: 2,
			allowedInText: true,
			argTypes: ["color", "original"]
		},
		handler(_ref, args) {
			var { parser } = _ref;
			var color = assertNodeType(args[0], "color-token").color;
			var body = args[1];
			return {
				type: "color",
				mode: parser.mode,
				color,
				body: ordargument(body)
			};
		},
		htmlBuilder: htmlBuilder$8,
		mathmlBuilder: mathmlBuilder$7
	});
	defineFunction({
		type: "color",
		names: ["\\color"],
		props: {
			numArgs: 1,
			allowedInText: true,
			argTypes: ["color"]
		},
		handler(_ref2, args) {
			var { parser, breakOnTokenText } = _ref2;
			var color = assertNodeType(args[0], "color-token").color;
			parser.gullet.macros.set("\\current@color", color);
			var body = parser.parseExpression(true, breakOnTokenText);
			return {
				type: "color",
				mode: parser.mode,
				color,
				body
			};
		},
		htmlBuilder: htmlBuilder$8,
		mathmlBuilder: mathmlBuilder$7
	});
	defineFunction({
		type: "cr",
		names: ["\\\\"],
		props: {
			numArgs: 0,
			numOptionalArgs: 0,
			allowedInText: true
		},
		handler(_ref, args, optArgs) {
			var { parser } = _ref;
			var size = parser.gullet.future().text === "[" ? parser.parseSizeGroup(true) : null;
			var newLine = !parser.settings.displayMode || !parser.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
			return {
				type: "cr",
				mode: parser.mode,
				newLine,
				size: size && assertNodeType(size, "size").value
			};
		},
		htmlBuilder(group, options) {
			var span = makeSpan(["mspace"], [], options);
			if (group.newLine) {
				span.classes.push("newline");
				if (group.size) span.style.marginTop = makeEm(calculateSize(group.size, options));
			}
			return span;
		},
		mathmlBuilder(group, options) {
			var node = new MathNode("mspace");
			if (group.newLine) {
				node.setAttribute("linebreak", "newline");
				if (group.size) node.setAttribute("height", makeEm(calculateSize(group.size, options)));
			}
			return node;
		}
	});
	var globalMap = {
		"\\global": "\\global",
		"\\long": "\\\\globallong",
		"\\\\globallong": "\\\\globallong",
		"\\def": "\\gdef",
		"\\gdef": "\\gdef",
		"\\edef": "\\xdef",
		"\\xdef": "\\xdef",
		"\\let": "\\\\globallet",
		"\\futurelet": "\\\\globalfuture"
	};
	var checkControlSequence = (tok) => {
		var name = tok.text;
		if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) throw new ParseError("Expected a control sequence", tok);
		return name;
	};
	var getRHS = (parser) => {
		var tok = parser.gullet.popToken();
		if (tok.text === "=") {
			tok = parser.gullet.popToken();
			if (tok.text === " ") tok = parser.gullet.popToken();
		}
		return tok;
	};
	var letCommand = (parser, name, tok, global) => {
		var macro = parser.gullet.macros.get(tok.text);
		if (macro == null) {
			tok.noexpand = true;
			macro = {
				tokens: [tok],
				numArgs: 0,
				unexpandable: !parser.gullet.isExpandable(tok.text)
			};
		}
		parser.gullet.macros.set(name, macro, global);
	};
	defineFunction({
		type: "internal",
		names: [
			"\\global",
			"\\long",
			"\\\\globallong"
		],
		props: {
			numArgs: 0,
			allowedInText: true
		},
		handler(_ref) {
			var { parser, funcName } = _ref;
			parser.consumeSpaces();
			var token = parser.fetch();
			if (globalMap[token.text]) {
				if (funcName === "\\global" || funcName === "\\\\globallong") token.text = globalMap[token.text];
				return assertNodeType(parser.parseFunction(), "internal");
			}
			throw new ParseError("Invalid token after macro prefix", token);
		}
	});
	defineFunction({
		type: "internal",
		names: [
			"\\def",
			"\\gdef",
			"\\edef",
			"\\xdef"
		],
		props: {
			numArgs: 0,
			allowedInText: true,
			primitive: true
		},
		handler(_ref2) {
			var { parser, funcName } = _ref2;
			var tok = parser.gullet.popToken();
			var name = tok.text;
			if (/^(?:[\\{}$&#^_]|EOF)$/.test(name)) throw new ParseError("Expected a control sequence", tok);
			var numArgs = 0;
			var insert;
			var delimiters = [[]];
			while (parser.gullet.future().text !== "{") {
				tok = parser.gullet.popToken();
				if (tok.text === "#") {
					if (parser.gullet.future().text === "{") {
						insert = parser.gullet.future();
						delimiters[numArgs].push("{");
						break;
					}
					tok = parser.gullet.popToken();
					if (!/^[1-9]$/.test(tok.text)) throw new ParseError("Invalid argument number \"" + tok.text + "\"");
					if (parseInt(tok.text) !== numArgs + 1) throw new ParseError("Argument number \"" + tok.text + "\" out of order");
					numArgs++;
					delimiters.push([]);
				} else if (tok.text === "EOF") throw new ParseError("Expected a macro definition");
				else delimiters[numArgs].push(tok.text);
			}
			var { tokens } = parser.gullet.consumeArg();
			if (insert) tokens.unshift(insert);
			if (funcName === "\\edef" || funcName === "\\xdef") {
				tokens = parser.gullet.expandTokens(tokens);
				tokens.reverse();
			}
			parser.gullet.macros.set(name, {
				tokens,
				numArgs,
				delimiters
			}, funcName === globalMap[funcName]);
			return {
				type: "internal",
				mode: parser.mode
			};
		}
	});
	defineFunction({
		type: "internal",
		names: ["\\let", "\\\\globallet"],
		props: {
			numArgs: 0,
			allowedInText: true,
			primitive: true
		},
		handler(_ref3) {
			var { parser, funcName } = _ref3;
			var name = checkControlSequence(parser.gullet.popToken());
			parser.gullet.consumeSpaces();
			letCommand(parser, name, getRHS(parser), funcName === "\\\\globallet");
			return {
				type: "internal",
				mode: parser.mode
			};
		}
	});
	defineFunction({
		type: "internal",
		names: ["\\futurelet", "\\\\globalfuture"],
		props: {
			numArgs: 0,
			allowedInText: true,
			primitive: true
		},
		handler(_ref4) {
			var { parser, funcName } = _ref4;
			var name = checkControlSequence(parser.gullet.popToken());
			var middle = parser.gullet.popToken();
			var tok = parser.gullet.popToken();
			letCommand(parser, name, tok, funcName === "\\\\globalfuture");
			parser.gullet.pushToken(tok);
			parser.gullet.pushToken(middle);
			return {
				type: "internal",
				mode: parser.mode
			};
		}
	});
	var getMetrics = function getMetrics(symbol, font, mode) {
		var metrics = getCharacterMetrics(symbols.math[symbol] && symbols.math[symbol].replace || symbol, font, mode);
		if (!metrics) throw new Error("Unsupported symbol " + symbol + " and font size " + font + ".");
		return metrics;
	};
	var styleWrap = function styleWrap(delim, toStyle, options, classes) {
		var newOptions = options.havingBaseStyle(toStyle);
		var span = makeSpan(classes.concat(newOptions.sizingClasses(options)), [delim], options);
		var delimSizeMultiplier = newOptions.sizeMultiplier / options.sizeMultiplier;
		span.height *= delimSizeMultiplier;
		span.depth *= delimSizeMultiplier;
		span.maxFontSize = newOptions.sizeMultiplier;
		return span;
	};
	var centerSpan = function centerSpan(span, options, style) {
		var newOptions = options.havingBaseStyle(style);
		var shift = (1 - options.sizeMultiplier / newOptions.sizeMultiplier) * options.fontMetrics().axisHeight;
		span.classes.push("delimcenter");
		span.style.top = makeEm(shift);
		span.height -= shift;
		span.depth += shift;
	};
	var makeSmallDelim = function makeSmallDelim(delim, style, center, options, mode, classes) {
		var span = styleWrap(makeSymbol(delim, "Main-Regular", mode, options), style, options, classes);
		if (center) centerSpan(span, options, style);
		return span;
	};
	var mathrmSize = function mathrmSize(value, size, mode, options) {
		return makeSymbol(value, "Size" + size + "-Regular", mode, options);
	};
	var makeLargeDelim = function makeLargeDelim(delim, size, center, options, mode, classes) {
		var inner = mathrmSize(delim, size, mode, options);
		var span = styleWrap(makeSpan(["delimsizing", "size" + size], [inner], options), Style$1.TEXT, options, classes);
		if (center) centerSpan(span, options, Style$1.TEXT);
		return span;
	};
	var makeGlyphSpan = function makeGlyphSpan(symbol, font, mode) {
		var sizeClass;
		if (font === "Size1-Regular") sizeClass = "delim-size1";
		else sizeClass = "delim-size4";
		return {
			type: "elem",
			elem: makeSpan(["delimsizinginner", sizeClass], [makeSpan([], [makeSymbol(symbol, font, mode)])])
		};
	};
	var makeInner = function makeInner(ch, height, options) {
		var width = fontMetricsData["Size4-Regular"][ch.charCodeAt(0)] ? fontMetricsData["Size4-Regular"][ch.charCodeAt(0)][4] : fontMetricsData["Size1-Regular"][ch.charCodeAt(0)][4];
		var span = makeSvgSpan([], [new SvgNode([new PathNode("inner", innerPath(ch, Math.round(1e3 * height)))], {
			"width": makeEm(width),
			"height": makeEm(height),
			"style": "width:" + makeEm(width),
			"viewBox": "0 0 " + 1e3 * width + " " + Math.round(1e3 * height),
			"preserveAspectRatio": "xMinYMin"
		})], options);
		span.height = height;
		span.style.height = makeEm(height);
		span.style.width = makeEm(width);
		return {
			type: "elem",
			elem: span
		};
	};
	var lapInEms = .008;
	var lap = {
		type: "kern",
		size: -1 * lapInEms
	};
	var verts = new Set([
		"|",
		"\\lvert",
		"\\rvert",
		"\\vert"
	]);
	var doubleVerts = new Set([
		"\\|",
		"\\lVert",
		"\\rVert",
		"\\Vert"
	]);
	var makeStackedDelim = function makeStackedDelim(delim, heightTotal, center, options, mode, classes) {
		var top;
		var middle;
		var repeat;
		var bottom;
		var svgLabel = "";
		var viewBoxWidth = 0;
		top = repeat = bottom = delim;
		middle = null;
		var font = "Size1-Regular";
		if (delim === "\\uparrow") repeat = bottom = "⏐";
		else if (delim === "\\Uparrow") repeat = bottom = "‖";
		else if (delim === "\\downarrow") top = repeat = "⏐";
		else if (delim === "\\Downarrow") top = repeat = "‖";
		else if (delim === "\\updownarrow") {
			top = "\\uparrow";
			repeat = "⏐";
			bottom = "\\downarrow";
		} else if (delim === "\\Updownarrow") {
			top = "\\Uparrow";
			repeat = "‖";
			bottom = "\\Downarrow";
		} else if (verts.has(delim)) {
			repeat = "∣";
			svgLabel = "vert";
			viewBoxWidth = 333;
		} else if (doubleVerts.has(delim)) {
			repeat = "∥";
			svgLabel = "doublevert";
			viewBoxWidth = 556;
		} else if (delim === "[" || delim === "\\lbrack") {
			top = "⎡";
			repeat = "⎢";
			bottom = "⎣";
			font = "Size4-Regular";
			svgLabel = "lbrack";
			viewBoxWidth = 667;
		} else if (delim === "]" || delim === "\\rbrack") {
			top = "⎤";
			repeat = "⎥";
			bottom = "⎦";
			font = "Size4-Regular";
			svgLabel = "rbrack";
			viewBoxWidth = 667;
		} else if (delim === "\\lfloor" || delim === "⌊") {
			repeat = top = "⎢";
			bottom = "⎣";
			font = "Size4-Regular";
			svgLabel = "lfloor";
			viewBoxWidth = 667;
		} else if (delim === "\\lceil" || delim === "⌈") {
			top = "⎡";
			repeat = bottom = "⎢";
			font = "Size4-Regular";
			svgLabel = "lceil";
			viewBoxWidth = 667;
		} else if (delim === "\\rfloor" || delim === "⌋") {
			repeat = top = "⎥";
			bottom = "⎦";
			font = "Size4-Regular";
			svgLabel = "rfloor";
			viewBoxWidth = 667;
		} else if (delim === "\\rceil" || delim === "⌉") {
			top = "⎤";
			repeat = bottom = "⎥";
			font = "Size4-Regular";
			svgLabel = "rceil";
			viewBoxWidth = 667;
		} else if (delim === "(" || delim === "\\lparen") {
			top = "⎛";
			repeat = "⎜";
			bottom = "⎝";
			font = "Size4-Regular";
			svgLabel = "lparen";
			viewBoxWidth = 875;
		} else if (delim === ")" || delim === "\\rparen") {
			top = "⎞";
			repeat = "⎟";
			bottom = "⎠";
			font = "Size4-Regular";
			svgLabel = "rparen";
			viewBoxWidth = 875;
		} else if (delim === "\\{" || delim === "\\lbrace") {
			top = "⎧";
			middle = "⎨";
			bottom = "⎩";
			repeat = "⎪";
			font = "Size4-Regular";
		} else if (delim === "\\}" || delim === "\\rbrace") {
			top = "⎫";
			middle = "⎬";
			bottom = "⎭";
			repeat = "⎪";
			font = "Size4-Regular";
		} else if (delim === "\\lgroup" || delim === "⟮") {
			top = "⎧";
			bottom = "⎩";
			repeat = "⎪";
			font = "Size4-Regular";
		} else if (delim === "\\rgroup" || delim === "⟯") {
			top = "⎫";
			bottom = "⎭";
			repeat = "⎪";
			font = "Size4-Regular";
		} else if (delim === "\\lmoustache" || delim === "⎰") {
			top = "⎧";
			bottom = "⎭";
			repeat = "⎪";
			font = "Size4-Regular";
		} else if (delim === "\\rmoustache" || delim === "⎱") {
			top = "⎫";
			bottom = "⎩";
			repeat = "⎪";
			font = "Size4-Regular";
		}
		var topMetrics = getMetrics(top, font, mode);
		var topHeightTotal = topMetrics.height + topMetrics.depth;
		var repeatMetrics = getMetrics(repeat, font, mode);
		var repeatHeightTotal = repeatMetrics.height + repeatMetrics.depth;
		var bottomMetrics = getMetrics(bottom, font, mode);
		var bottomHeightTotal = bottomMetrics.height + bottomMetrics.depth;
		var middleHeightTotal = 0;
		var middleFactor = 1;
		if (middle !== null) {
			var middleMetrics = getMetrics(middle, font, mode);
			middleHeightTotal = middleMetrics.height + middleMetrics.depth;
			middleFactor = 2;
		}
		var minHeight = topHeightTotal + bottomHeightTotal + middleHeightTotal;
		var realHeightTotal = minHeight + Math.max(0, Math.ceil((heightTotal - minHeight) / (middleFactor * repeatHeightTotal))) * middleFactor * repeatHeightTotal;
		var axisHeight = options.fontMetrics().axisHeight;
		if (center) axisHeight *= options.sizeMultiplier;
		var depth = realHeightTotal / 2 - axisHeight;
		var stack = [];
		if (svgLabel.length > 0) {
			var midHeight = realHeightTotal - topHeightTotal - bottomHeightTotal;
			var viewBoxHeight = Math.round(realHeightTotal * 1e3);
			var pathStr = tallDelim(svgLabel, Math.round(midHeight * 1e3));
			var path = new PathNode(svgLabel, pathStr);
			var width = makeEm(viewBoxWidth / 1e3);
			var height = makeEm(viewBoxHeight / 1e3);
			var wrapper = makeSvgSpan([], [new SvgNode([path], {
				"width": width,
				"height": height,
				"viewBox": "0 0 " + viewBoxWidth + " " + viewBoxHeight
			})], options);
			wrapper.height = viewBoxHeight / 1e3;
			wrapper.style.width = width;
			wrapper.style.height = height;
			stack.push({
				type: "elem",
				elem: wrapper
			});
		} else {
			stack.push(makeGlyphSpan(bottom, font, mode));
			stack.push(lap);
			if (middle === null) {
				var innerHeight = realHeightTotal - topHeightTotal - bottomHeightTotal + 2 * lapInEms;
				stack.push(makeInner(repeat, innerHeight, options));
			} else {
				var _innerHeight = (realHeightTotal - topHeightTotal - bottomHeightTotal - middleHeightTotal) / 2 + 2 * lapInEms;
				stack.push(makeInner(repeat, _innerHeight, options));
				stack.push(lap);
				stack.push(makeGlyphSpan(middle, font, mode));
				stack.push(lap);
				stack.push(makeInner(repeat, _innerHeight, options));
			}
			stack.push(lap);
			stack.push(makeGlyphSpan(top, font, mode));
		}
		var newOptions = options.havingBaseStyle(Style$1.TEXT);
		return styleWrap(makeSpan(["delimsizing", "mult"], [makeVList({
			positionType: "bottom",
			positionData: depth,
			children: stack
		})], newOptions), Style$1.TEXT, options, classes);
	};
	var vbPad = 80;
	var emPad = .08;
	var sqrtSvg = function sqrtSvg(sqrtName, height, viewBoxHeight, extraVinculum, options) {
		return makeSvgSpan(["hide-tail"], [new SvgNode([new PathNode(sqrtName, sqrtPath(sqrtName, extraVinculum, viewBoxHeight))], {
			"width": "400em",
			"height": makeEm(height),
			"viewBox": "0 0 400000 " + viewBoxHeight,
			"preserveAspectRatio": "xMinYMin slice"
		})], options);
	};
	var makeSqrtImage = function makeSqrtImage(height, options) {
		var newOptions = options.havingBaseSizing();
		var delim = traverseSequence("\\surd", height * newOptions.sizeMultiplier, stackLargeDelimiterSequence, newOptions);
		var sizeMultiplier = newOptions.sizeMultiplier;
		var extraVinculum = Math.max(0, options.minRuleThickness - options.fontMetrics().sqrtRuleThickness);
		var span;
		var spanHeight;
		var texHeight;
		var viewBoxHeight;
		var advanceWidth;
		if (delim.type === "small") {
			viewBoxHeight = 1e3 + 1e3 * extraVinculum + vbPad;
			if (height < 1) sizeMultiplier = 1;
			else if (height < 1.4) sizeMultiplier = .7;
			spanHeight = (1 + extraVinculum + emPad) / sizeMultiplier;
			texHeight = (1 + extraVinculum) / sizeMultiplier;
			span = sqrtSvg("sqrtMain", spanHeight, viewBoxHeight, extraVinculum, options);
			span.style.minWidth = "0.853em";
			advanceWidth = .833 / sizeMultiplier;
		} else if (delim.type === "large") {
			viewBoxHeight = (1e3 + vbPad) * sizeToMaxHeight[delim.size];
			texHeight = (sizeToMaxHeight[delim.size] + extraVinculum) / sizeMultiplier;
			spanHeight = (sizeToMaxHeight[delim.size] + extraVinculum + emPad) / sizeMultiplier;
			span = sqrtSvg("sqrtSize" + delim.size, spanHeight, viewBoxHeight, extraVinculum, options);
			span.style.minWidth = "1.02em";
			advanceWidth = 1 / sizeMultiplier;
		} else {
			spanHeight = height + extraVinculum + emPad;
			texHeight = height + extraVinculum;
			viewBoxHeight = Math.floor(1e3 * height + extraVinculum) + vbPad;
			span = sqrtSvg("sqrtTall", spanHeight, viewBoxHeight, extraVinculum, options);
			span.style.minWidth = "0.742em";
			advanceWidth = 1.056;
		}
		span.height = texHeight;
		span.style.height = makeEm(spanHeight);
		return {
			span,
			advanceWidth,
			ruleWidth: (options.fontMetrics().sqrtRuleThickness + extraVinculum) * sizeMultiplier
		};
	};
	var stackLargeDelimiters = new Set([
		"(",
		"\\lparen",
		")",
		"\\rparen",
		"[",
		"\\lbrack",
		"]",
		"\\rbrack",
		"\\{",
		"\\lbrace",
		"\\}",
		"\\rbrace",
		"\\lfloor",
		"\\rfloor",
		"⌊",
		"⌋",
		"\\lceil",
		"\\rceil",
		"⌈",
		"⌉",
		"\\surd"
	]);
	var stackAlwaysDelimiters = new Set([
		"\\uparrow",
		"\\downarrow",
		"\\updownarrow",
		"\\Uparrow",
		"\\Downarrow",
		"\\Updownarrow",
		"|",
		"\\|",
		"\\vert",
		"\\Vert",
		"\\lvert",
		"\\rvert",
		"\\lVert",
		"\\rVert",
		"\\lgroup",
		"\\rgroup",
		"⟮",
		"⟯",
		"\\lmoustache",
		"\\rmoustache",
		"⎰",
		"⎱"
	]);
	var stackNeverDelimiters = new Set([
		"<",
		">",
		"\\langle",
		"\\rangle",
		"/",
		"\\backslash",
		"\\lt",
		"\\gt"
	]);
	var sizeToMaxHeight = [
		0,
		1.2,
		1.8,
		2.4,
		3
	];
	var makeSizedDelim = function makeSizedDelim(delim, size, options, mode, classes) {
		if (delim === "<" || delim === "\\lt" || delim === "⟨") delim = "\\langle";
		else if (delim === ">" || delim === "\\gt" || delim === "⟩") delim = "\\rangle";
		if (stackLargeDelimiters.has(delim) || stackNeverDelimiters.has(delim)) return makeLargeDelim(delim, size, false, options, mode, classes);
		else if (stackAlwaysDelimiters.has(delim)) return makeStackedDelim(delim, sizeToMaxHeight[size], false, options, mode, classes);
		else throw new ParseError("Illegal delimiter: '" + delim + "'");
	};
	var stackNeverDelimiterSequence = [
		{
			type: "small",
			style: Style$1.SCRIPTSCRIPT
		},
		{
			type: "small",
			style: Style$1.SCRIPT
		},
		{
			type: "small",
			style: Style$1.TEXT
		},
		{
			type: "large",
			size: 1
		},
		{
			type: "large",
			size: 2
		},
		{
			type: "large",
			size: 3
		},
		{
			type: "large",
			size: 4
		}
	];
	var stackAlwaysDelimiterSequence = [
		{
			type: "small",
			style: Style$1.SCRIPTSCRIPT
		},
		{
			type: "small",
			style: Style$1.SCRIPT
		},
		{
			type: "small",
			style: Style$1.TEXT
		},
		{ type: "stack" }
	];
	var stackLargeDelimiterSequence = [
		{
			type: "small",
			style: Style$1.SCRIPTSCRIPT
		},
		{
			type: "small",
			style: Style$1.SCRIPT
		},
		{
			type: "small",
			style: Style$1.TEXT
		},
		{
			type: "large",
			size: 1
		},
		{
			type: "large",
			size: 2
		},
		{
			type: "large",
			size: 3
		},
		{
			type: "large",
			size: 4
		},
		{ type: "stack" }
	];
	var delimTypeToFont = function delimTypeToFont(type) {
		if (type.type === "small") return "Main-Regular";
		else if (type.type === "large") return "Size" + type.size + "-Regular";
		else if (type.type === "stack") return "Size4-Regular";
		else {
			var delimKind = type.type;
			throw new Error("Add support for delim type '" + delimKind + "' here.");
		}
	};
	var traverseSequence = function traverseSequence(delim, height, sequence, options) {
		for (var i = Math.min(2, 3 - options.style.size); i < sequence.length; i++) {
			var delimType = sequence[i];
			if (delimType.type === "stack") break;
			var metrics = getMetrics(delim, delimTypeToFont(delimType), "math");
			var heightDepth = metrics.height + metrics.depth;
			if (delimType.type === "small") {
				var newOptions = options.havingBaseStyle(delimType.style);
				heightDepth *= newOptions.sizeMultiplier;
			}
			if (heightDepth > height) return delimType;
		}
		return sequence[sequence.length - 1];
	};
	var makeCustomSizedDelim = function makeCustomSizedDelim(delim, height, center, options, mode, classes) {
		if (delim === "<" || delim === "\\lt" || delim === "⟨") delim = "\\langle";
		else if (delim === ">" || delim === "\\gt" || delim === "⟩") delim = "\\rangle";
		var sequence;
		if (stackNeverDelimiters.has(delim)) sequence = stackNeverDelimiterSequence;
		else if (stackLargeDelimiters.has(delim)) sequence = stackLargeDelimiterSequence;
		else sequence = stackAlwaysDelimiterSequence;
		var delimType = traverseSequence(delim, height, sequence, options);
		if (delimType.type === "small") return makeSmallDelim(delim, delimType.style, center, options, mode, classes);
		else if (delimType.type === "large") return makeLargeDelim(delim, delimType.size, center, options, mode, classes);
		else return makeStackedDelim(delim, height, center, options, mode, classes);
	};
	var makeLeftRightDelim = function makeLeftRightDelim(delim, height, depth, options, mode, classes) {
		var axisHeight = options.fontMetrics().axisHeight * options.sizeMultiplier;
		var delimiterFactor = 901;
		var delimiterExtend = 5 / options.fontMetrics().ptPerEm;
		var maxDistFromAxis = Math.max(height - axisHeight, depth + axisHeight);
		return makeCustomSizedDelim(delim, Math.max(maxDistFromAxis / 500 * delimiterFactor, 2 * maxDistFromAxis - delimiterExtend), true, options, mode, classes);
	};
	var delimiterSizes = {
		"\\bigl": {
			mclass: "mopen",
			size: 1
		},
		"\\Bigl": {
			mclass: "mopen",
			size: 2
		},
		"\\biggl": {
			mclass: "mopen",
			size: 3
		},
		"\\Biggl": {
			mclass: "mopen",
			size: 4
		},
		"\\bigr": {
			mclass: "mclose",
			size: 1
		},
		"\\Bigr": {
			mclass: "mclose",
			size: 2
		},
		"\\biggr": {
			mclass: "mclose",
			size: 3
		},
		"\\Biggr": {
			mclass: "mclose",
			size: 4
		},
		"\\bigm": {
			mclass: "mrel",
			size: 1
		},
		"\\Bigm": {
			mclass: "mrel",
			size: 2
		},
		"\\biggm": {
			mclass: "mrel",
			size: 3
		},
		"\\Biggm": {
			mclass: "mrel",
			size: 4
		},
		"\\big": {
			mclass: "mord",
			size: 1
		},
		"\\Big": {
			mclass: "mord",
			size: 2
		},
		"\\bigg": {
			mclass: "mord",
			size: 3
		},
		"\\Bigg": {
			mclass: "mord",
			size: 4
		}
	};
	var delimiters = new Set([
		"(",
		"\\lparen",
		")",
		"\\rparen",
		"[",
		"\\lbrack",
		"]",
		"\\rbrack",
		"\\{",
		"\\lbrace",
		"\\}",
		"\\rbrace",
		"\\lfloor",
		"\\rfloor",
		"⌊",
		"⌋",
		"\\lceil",
		"\\rceil",
		"⌈",
		"⌉",
		"<",
		">",
		"\\langle",
		"⟨",
		"\\rangle",
		"⟩",
		"\\lt",
		"\\gt",
		"\\lvert",
		"\\rvert",
		"\\lVert",
		"\\rVert",
		"\\lgroup",
		"\\rgroup",
		"⟮",
		"⟯",
		"\\lmoustache",
		"\\rmoustache",
		"⎰",
		"⎱",
		"/",
		"\\backslash",
		"|",
		"\\vert",
		"\\|",
		"\\Vert",
		"\\uparrow",
		"\\Uparrow",
		"\\downarrow",
		"\\Downarrow",
		"\\updownarrow",
		"\\Updownarrow",
		"."
	]);
	function isMiddleDelimNode(node) {
		return "isMiddle" in node;
	}
	function checkDelimiter(delim, context) {
		var symDelim = checkSymbolNodeType(delim);
		if (symDelim && delimiters.has(symDelim.text)) return symDelim;
		else if (symDelim) throw new ParseError("Invalid delimiter '" + symDelim.text + "' after '" + context.funcName + "'", delim);
		else throw new ParseError("Invalid delimiter type '" + delim.type + "'", delim);
	}
	defineFunction({
		type: "delimsizing",
		names: [
			"\\bigl",
			"\\Bigl",
			"\\biggl",
			"\\Biggl",
			"\\bigr",
			"\\Bigr",
			"\\biggr",
			"\\Biggr",
			"\\bigm",
			"\\Bigm",
			"\\biggm",
			"\\Biggm",
			"\\big",
			"\\Big",
			"\\bigg",
			"\\Bigg"
		],
		props: {
			numArgs: 1,
			argTypes: ["primitive"]
		},
		handler: (context, args) => {
			var delim = checkDelimiter(args[0], context);
			return {
				type: "delimsizing",
				mode: context.parser.mode,
				size: delimiterSizes[context.funcName].size,
				mclass: delimiterSizes[context.funcName].mclass,
				delim: delim.text
			};
		},
		htmlBuilder: (group, options) => {
			if (group.delim === ".") return makeSpan([group.mclass]);
			return makeSizedDelim(group.delim, group.size, options, group.mode, [group.mclass]);
		},
		mathmlBuilder: (group) => {
			var children = [];
			if (group.delim !== ".") children.push(makeText(group.delim, group.mode));
			var node = new MathNode("mo", children);
			if (group.mclass === "mopen" || group.mclass === "mclose") node.setAttribute("fence", "true");
			else node.setAttribute("fence", "false");
			node.setAttribute("stretchy", "true");
			var size = makeEm(sizeToMaxHeight[group.size]);
			node.setAttribute("minsize", size);
			node.setAttribute("maxsize", size);
			return node;
		}
	});
	function assertParsed(group) {
		if (!group.body) throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
	}
	defineFunction({
		type: "leftright-right",
		names: ["\\right"],
		props: {
			numArgs: 1,
			primitive: true
		},
		handler: (context, args) => {
			var color = context.parser.gullet.macros.get("\\current@color");
			if (color && typeof color !== "string") throw new ParseError("\\current@color set to non-string in \\right");
			return {
				type: "leftright-right",
				mode: context.parser.mode,
				delim: checkDelimiter(args[0], context).text,
				color
			};
		}
	});
	defineFunction({
		type: "leftright",
		names: ["\\left"],
		props: {
			numArgs: 1,
			primitive: true
		},
		handler: (context, args) => {
			var delim = checkDelimiter(args[0], context);
			var parser = context.parser;
			++parser.leftrightDepth;
			var body = parser.parseExpression(false);
			--parser.leftrightDepth;
			parser.expect("\\right", false);
			var right = assertNodeType(parser.parseFunction(), "leftright-right");
			return {
				type: "leftright",
				mode: parser.mode,
				body,
				left: delim.text,
				right: right.delim,
				rightColor: right.color
			};
		},
		htmlBuilder: (group, options) => {
			assertParsed(group);
			var inner = buildExpression$1(group.body, options, true, ["mopen", "mclose"]);
			var innerHeight = 0;
			var innerDepth = 0;
			var hadMiddle = false;
			for (var i = 0; i < inner.length; i++) {
				var node = inner[i];
				if (isMiddleDelimNode(node)) hadMiddle = true;
				else {
					innerHeight = Math.max(inner[i].height, innerHeight);
					innerDepth = Math.max(inner[i].depth, innerDepth);
				}
			}
			innerHeight *= options.sizeMultiplier;
			innerDepth *= options.sizeMultiplier;
			var leftDelim;
			if (group.left === ".") leftDelim = makeNullDelimiter(options, ["mopen"]);
			else leftDelim = makeLeftRightDelim(group.left, innerHeight, innerDepth, options, group.mode, ["mopen"]);
			inner.unshift(leftDelim);
			if (hadMiddle) for (var _i = 1; _i < inner.length; _i++) {
				var middleDelim = inner[_i];
				if (isMiddleDelimNode(middleDelim)) {
					var isMiddle = middleDelim.isMiddle;
					inner[_i] = makeLeftRightDelim(isMiddle.delim, innerHeight, innerDepth, isMiddle.options, group.mode, []);
				}
			}
			var rightDelim;
			if (group.right === ".") rightDelim = makeNullDelimiter(options, ["mclose"]);
			else {
				var colorOptions = group.rightColor ? options.withColor(group.rightColor) : options;
				rightDelim = makeLeftRightDelim(group.right, innerHeight, innerDepth, colorOptions, group.mode, ["mclose"]);
			}
			inner.push(rightDelim);
			return makeSpan(["minner"], inner, options);
		},
		mathmlBuilder: (group, options) => {
			assertParsed(group);
			var inner = buildExpression(group.body, options);
			if (group.left !== ".") {
				var leftNode = new MathNode("mo", [makeText(group.left, group.mode)]);
				leftNode.setAttribute("fence", "true");
				inner.unshift(leftNode);
			}
			if (group.right !== ".") {
				var rightNode = new MathNode("mo", [makeText(group.right, group.mode)]);
				rightNode.setAttribute("fence", "true");
				if (group.rightColor) rightNode.setAttribute("mathcolor", group.rightColor);
				inner.push(rightNode);
			}
			return makeRow(inner);
		}
	});
	defineFunction({
		type: "middle",
		names: ["\\middle"],
		props: {
			numArgs: 1,
			primitive: true
		},
		handler: (context, args) => {
			var delim = checkDelimiter(args[0], context);
			if (!context.parser.leftrightDepth) throw new ParseError("\\middle without preceding \\left", delim);
			return {
				type: "middle",
				mode: context.parser.mode,
				delim: delim.text
			};
		},
		htmlBuilder: (group, options) => {
			var middleDelim;
			if (group.delim === ".") middleDelim = makeNullDelimiter(options, []);
			else {
				middleDelim = makeSizedDelim(group.delim, 1, options, group.mode, []);
				middleDelim.isMiddle = {
					delim: group.delim,
					options
				};
			}
			return middleDelim;
		},
		mathmlBuilder: (group, options) => {
			var middleNode = new MathNode("mo", [group.delim === "\\vert" || group.delim === "|" ? makeText("|", "text") : makeText(group.delim, group.mode)]);
			middleNode.setAttribute("fence", "true");
			middleNode.setAttribute("lspace", "0.05em");
			middleNode.setAttribute("rspace", "0.05em");
			return middleNode;
		}
	});
	var htmlBuilder$7 = (group, options) => {
		var inner = wrapFragment(buildGroup$1(group.body, options), options);
		var label = group.label.slice(1);
		var scale = options.sizeMultiplier;
		var img;
		var imgShift;
		var isSingleChar = isCharacterBox(group.body);
		if (label === "sout") {
			img = makeSpan(["stretchy", "sout"]);
			img.height = options.fontMetrics().defaultRuleThickness / scale;
			imgShift = -.5 * options.fontMetrics().xHeight;
		} else if (label === "phase") {
			var lineWeight = calculateSize({
				number: .6,
				unit: "pt"
			}, options);
			var clearance = calculateSize({
				number: .35,
				unit: "ex"
			}, options);
			var newOptions = options.havingBaseSizing();
			scale = scale / newOptions.sizeMultiplier;
			var angleHeight = inner.height + inner.depth + lineWeight + clearance;
			inner.style.paddingLeft = makeEm(angleHeight / 2 + lineWeight);
			var viewBoxHeight = Math.floor(1e3 * angleHeight * scale);
			img = makeSvgSpan(["hide-tail"], [new SvgNode([new PathNode("phase", phasePath(viewBoxHeight))], {
				"width": "400em",
				"height": makeEm(viewBoxHeight / 1e3),
				"viewBox": "0 0 400000 " + viewBoxHeight,
				"preserveAspectRatio": "xMinYMin slice"
			})], options);
			img.style.height = makeEm(angleHeight);
			imgShift = inner.depth + lineWeight + clearance;
		} else {
			if (/cancel/.test(label)) {
				if (!isSingleChar) inner.classes.push("cancel-pad");
			} else if (label === "angl") inner.classes.push("anglpad");
			else inner.classes.push("boxpad");
			var topPad;
			var bottomPad;
			var ruleThickness = 0;
			if (/box/.test(label)) {
				ruleThickness = Math.max(options.fontMetrics().fboxrule, options.minRuleThickness);
				topPad = options.fontMetrics().fboxsep + (label === "colorbox" ? 0 : ruleThickness);
				bottomPad = topPad;
			} else if (label === "angl") {
				ruleThickness = Math.max(options.fontMetrics().defaultRuleThickness, options.minRuleThickness);
				topPad = 4 * ruleThickness;
				bottomPad = Math.max(0, .25 - inner.depth);
			} else {
				topPad = isSingleChar ? .2 : 0;
				bottomPad = topPad;
			}
			img = stretchyEnclose(inner, label, topPad, bottomPad, options);
			if (/fbox|boxed|fcolorbox/.test(label)) {
				img.style.borderStyle = "solid";
				img.style.borderWidth = makeEm(ruleThickness);
			} else if (label === "angl" && ruleThickness !== .049) {
				img.style.borderTopWidth = makeEm(ruleThickness);
				img.style.borderRightWidth = makeEm(ruleThickness);
			}
			imgShift = inner.depth + bottomPad;
			if (group.backgroundColor) {
				img.style.backgroundColor = group.backgroundColor;
				if (group.borderColor) img.style.borderColor = group.borderColor;
			}
		}
		var vlist;
		if (group.backgroundColor) vlist = makeVList({
			positionType: "individualShift",
			children: [{
				type: "elem",
				elem: img,
				shift: imgShift
			}, {
				type: "elem",
				elem: inner,
				shift: 0
			}]
		});
		else {
			var classes = /cancel|phase/.test(label) ? ["svg-align"] : [];
			vlist = makeVList({
				positionType: "individualShift",
				children: [{
					type: "elem",
					elem: inner,
					shift: 0
				}, {
					type: "elem",
					elem: img,
					shift: imgShift,
					wrapperClasses: classes
				}]
			});
		}
		if (/cancel/.test(label)) {
			vlist.height = inner.height;
			vlist.depth = inner.depth;
		}
		if (/cancel/.test(label) && !isSingleChar) return makeSpan(["mord", "cancel-lap"], [vlist], options);
		else return makeSpan(["mord"], [vlist], options);
	};
	var mathmlBuilder$6 = (group, options) => {
		var fboxsep;
		var node = new MathNode(group.label.includes("colorbox") ? "mpadded" : "menclose", [buildGroup(group.body, options)]);
		switch (group.label) {
			case "\\cancel":
				node.setAttribute("notation", "updiagonalstrike");
				break;
			case "\\bcancel":
				node.setAttribute("notation", "downdiagonalstrike");
				break;
			case "\\phase":
				node.setAttribute("notation", "phasorangle");
				break;
			case "\\sout":
				node.setAttribute("notation", "horizontalstrike");
				break;
			case "\\fbox":
				node.setAttribute("notation", "box");
				break;
			case "\\angl":
				node.setAttribute("notation", "actuarial");
				break;
			case "\\fcolorbox":
			case "\\colorbox":
				fboxsep = options.fontMetrics().fboxsep * options.fontMetrics().ptPerEm;
				node.setAttribute("width", "+" + 2 * fboxsep + "pt");
				node.setAttribute("height", "+" + 2 * fboxsep + "pt");
				node.setAttribute("lspace", fboxsep + "pt");
				node.setAttribute("voffset", fboxsep + "pt");
				if (group.label === "\\fcolorbox") {
					var thk = Math.max(options.fontMetrics().fboxrule, options.minRuleThickness);
					node.setAttribute("style", "border: " + makeEm(thk) + " solid " + group.borderColor);
				}
				break;
			case "\\xcancel": node.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
		}
		if (group.backgroundColor) node.setAttribute("mathbackground", group.backgroundColor);
		return node;
	};
	defineFunction({
		type: "enclose",
		names: ["\\colorbox"],
		props: {
			numArgs: 2,
			allowedInText: true,
			argTypes: ["color", "hbox"]
		},
		handler(_ref, args, optArgs) {
			var { parser, funcName } = _ref;
			var color = assertNodeType(args[0], "color-token").color;
			var body = args[1];
			return {
				type: "enclose",
				mode: parser.mode,
				label: funcName,
				backgroundColor: color,
				body
			};
		},
		htmlBuilder: htmlBuilder$7,
		mathmlBuilder: mathmlBuilder$6
	});
	defineFunction({
		type: "enclose",
		names: ["\\fcolorbox"],
		props: {
			numArgs: 3,
			allowedInText: true,
			argTypes: [
				"color",
				"color",
				"hbox"
			]
		},
		handler(_ref2, args, optArgs) {
			var { parser, funcName } = _ref2;
			var borderColor = assertNodeType(args[0], "color-token").color;
			var backgroundColor = assertNodeType(args[1], "color-token").color;
			var body = args[2];
			return {
				type: "enclose",
				mode: parser.mode,
				label: funcName,
				backgroundColor,
				borderColor,
				body
			};
		},
		htmlBuilder: htmlBuilder$7,
		mathmlBuilder: mathmlBuilder$6
	});
	defineFunction({
		type: "enclose",
		names: ["\\fbox"],
		props: {
			numArgs: 1,
			argTypes: ["hbox"],
			allowedInText: true
		},
		handler(_ref3, args) {
			var { parser } = _ref3;
			return {
				type: "enclose",
				mode: parser.mode,
				label: "\\fbox",
				body: args[0]
			};
		}
	});
	defineFunction({
		type: "enclose",
		names: [
			"\\cancel",
			"\\bcancel",
			"\\xcancel",
			"\\phase"
		],
		props: { numArgs: 1 },
		handler(_ref4, args) {
			var { parser, funcName } = _ref4;
			var body = args[0];
			return {
				type: "enclose",
				mode: parser.mode,
				label: funcName,
				body
			};
		},
		htmlBuilder: htmlBuilder$7,
		mathmlBuilder: mathmlBuilder$6
	});
	defineFunction({
		type: "enclose",
		names: ["\\sout"],
		props: {
			numArgs: 1,
			allowedInText: true
		},
		handler(_ref5, args) {
			var { parser, funcName } = _ref5;
			if (parser.mode === "math") parser.settings.reportNonstrict("mathVsSout", "LaTeX's \\sout works only in text mode");
			var body = args[0];
			return {
				type: "enclose",
				mode: parser.mode,
				label: funcName,
				body
			};
		},
		htmlBuilder: htmlBuilder$7,
		mathmlBuilder: mathmlBuilder$6
	});
	defineFunction({
		type: "enclose",
		names: ["\\angl"],
		props: {
			numArgs: 1,
			argTypes: ["hbox"],
			allowedInText: false
		},
		handler(_ref6, args) {
			var { parser } = _ref6;
			return {
				type: "enclose",
				mode: parser.mode,
				label: "\\angl",
				body: args[0]
			};
		}
	});
	var _environments = {};
	function defineEnvironment(_ref) {
		var { type, names, props, handler, htmlBuilder, mathmlBuilder } = _ref;
		var data = {
			type,
			numArgs: props.numArgs || 0,
			allowedInText: false,
			numOptionalArgs: 0,
			handler
		};
		for (var i = 0; i < names.length; ++i) _environments[names[i]] = data;
		if (htmlBuilder) _htmlGroupBuilders[type] = htmlBuilder;
		if (mathmlBuilder) _mathmlGroupBuilders[type] = mathmlBuilder;
	}
	var _macros = {};
	function defineMacro(name, body) {
		_macros[name] = body;
	}
	var SourceLocation = class SourceLocation {
		constructor(lexer, start, end) {
			this.lexer = void 0;
			this.start = void 0;
			this.end = void 0;
			this.lexer = lexer;
			this.start = start;
			this.end = end;
		}
		static range(first, second) {
			if (!second) return first && first.loc;
			else if (!first || !first.loc || !second.loc || first.loc.lexer !== second.loc.lexer) return null;
			else return new SourceLocation(first.loc.lexer, first.loc.start, second.loc.end);
		}
	};
	var Token = class Token {
		constructor(text, loc) {
			this.text = void 0;
			this.loc = void 0;
			this.noexpand = void 0;
			this.treatAsRelax = void 0;
			this.text = text;
			this.loc = loc;
		}
		range(endToken, text) {
			return new Token(text, SourceLocation.range(this, endToken));
		}
	};
	function getHLines(parser) {
		var hlineInfo = [];
		parser.consumeSpaces();
		var nxt = parser.fetch().text;
		if (nxt === "\\relax") {
			parser.consume();
			parser.consumeSpaces();
			nxt = parser.fetch().text;
		}
		while (nxt === "\\hline" || nxt === "\\hdashline") {
			parser.consume();
			hlineInfo.push(nxt === "\\hdashline");
			parser.consumeSpaces();
			nxt = parser.fetch().text;
		}
		return hlineInfo;
	}
	var validateAmsEnvironmentContext = (context) => {
		if (!context.parser.settings.displayMode) throw new ParseError("{" + context.envName + "} can be used only in display mode.");
	};
	var gatherEnvironments = new Set(["gather", "gather*"]);
	function getAutoTag(name) {
		if (!name.includes("ed")) return !name.includes("*");
	}
	function parseArray(parser, _ref, style) {
		var { hskipBeforeAndAfter, addJot, cols, arraystretch, colSeparationType, autoTag, singleRow, emptySingleRow, maxNumCols, leqno } = _ref;
		parser.gullet.beginGroup();
		if (!singleRow) parser.gullet.macros.set("\\cr", "\\\\\\relax");
		if (!arraystretch) {
			var stretch = parser.gullet.expandMacroAsText("\\arraystretch");
			if (stretch == null) arraystretch = 1;
			else {
				arraystretch = parseFloat(stretch);
				if (!arraystretch || arraystretch < 0) throw new ParseError("Invalid \\arraystretch: " + stretch);
			}
		}
		parser.gullet.beginGroup();
		var row = [];
		var body = [row];
		var rowGaps = [];
		var hLinesBeforeRow = [];
		var tags = autoTag != null ? [] : void 0;
		function beginRow() {
			if (autoTag) parser.gullet.macros.set("\\@eqnsw", "1", true);
		}
		function endRow() {
			if (tags) {
				if (parser.gullet.macros.get("\\df@tag")) {
					tags.push(parser.subparse([new Token("\\df@tag")]));
					parser.gullet.macros.set("\\df@tag", void 0, true);
				} else tags.push(Boolean(autoTag) && parser.gullet.macros.get("\\@eqnsw") === "1");
			}
		}
		beginRow();
		hLinesBeforeRow.push(getHLines(parser));
		while (true) {
			var cellBody = parser.parseExpression(false, singleRow ? "\\end" : "\\\\");
			parser.gullet.endGroup();
			parser.gullet.beginGroup();
			var cell = {
				type: "ordgroup",
				mode: parser.mode,
				body: cellBody
			};
			if (style) cell = {
				type: "styling",
				mode: parser.mode,
				style,
				resetFont: true,
				body: [cell]
			};
			row.push(cell);
			var next = parser.fetch().text;
			if (next === "&") {
				if (maxNumCols && row.length === maxNumCols) {
					if (singleRow || colSeparationType) throw new ParseError("Too many tab characters: &", parser.nextToken);
					else parser.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
				}
				parser.consume();
			} else if (next === "\\end") {
				endRow();
				if (row.length === 1 && cell.type === "styling" && cell.body.length === 1 && cell.body[0].type === "ordgroup" && cell.body[0].body.length === 0 && (body.length > 1 || !emptySingleRow)) body.pop();
				if (hLinesBeforeRow.length < body.length + 1) hLinesBeforeRow.push([]);
				break;
			} else if (next === "\\\\") {
				parser.consume();
				var size = void 0;
				if (parser.gullet.future().text !== " ") size = parser.parseSizeGroup(true);
				rowGaps.push(size ? size.value : null);
				endRow();
				hLinesBeforeRow.push(getHLines(parser));
				row = [];
				body.push(row);
				beginRow();
			} else throw new ParseError("Expected & or \\\\ or \\cr or \\end", parser.nextToken);
		}
		parser.gullet.endGroup();
		parser.gullet.endGroup();
		return {
			type: "array",
			mode: parser.mode,
			addJot,
			arraystretch,
			body,
			cols,
			rowGaps,
			hskipBeforeAndAfter,
			hLinesBeforeRow,
			colSeparationType,
			tags,
			leqno
		};
	}
	function dCellStyle(envName) {
		if (envName.slice(0, 1) === "d") return "display";
		else return "text";
	}
	var htmlBuilder$6 = function htmlBuilder(group, options) {
		var r;
		var c;
		var nr = group.body.length;
		var hLinesBeforeRow = group.hLinesBeforeRow;
		var nc = 0;
		var body = new Array(nr);
		var hlines = [];
		var ruleThickness = Math.max(options.fontMetrics().arrayRuleWidth, options.minRuleThickness);
		var pt = 1 / options.fontMetrics().ptPerEm;
		var arraycolsep = 5 * pt;
		if (group.colSeparationType && group.colSeparationType === "small") arraycolsep = .2778 * (options.havingStyle(Style$1.SCRIPT).sizeMultiplier / options.sizeMultiplier);
		var baselineskip = group.colSeparationType === "CD" ? calculateSize({
			number: 3,
			unit: "ex"
		}, options) : 12 * pt;
		var jot = 3 * pt;
		var arrayskip = group.arraystretch * baselineskip;
		var arstrutHeight = .7 * arrayskip;
		var arstrutDepth = .3 * arrayskip;
		var totalHeight = 0;
		function setHLinePos(hlinesInGap) {
			for (var i = 0; i < hlinesInGap.length; ++i) {
				if (i > 0) totalHeight += .25;
				hlines.push({
					pos: totalHeight,
					isDashed: hlinesInGap[i]
				});
			}
		}
		setHLinePos(hLinesBeforeRow[0]);
		for (r = 0; r < group.body.length; ++r) {
			var inrow = group.body[r];
			var height = arstrutHeight;
			var depth = arstrutDepth;
			if (nc < inrow.length) nc = inrow.length;
			var outrow = {
				cells: new Array(inrow.length),
				height: 0,
				depth: 0,
				pos: 0
			};
			for (c = 0; c < inrow.length; ++c) {
				var elt = buildGroup$1(inrow[c], options);
				if (depth < elt.depth) depth = elt.depth;
				if (height < elt.height) height = elt.height;
				outrow.cells[c] = elt;
			}
			var rowGap = group.rowGaps[r];
			var gap = 0;
			if (rowGap) {
				gap = calculateSize(rowGap, options);
				if (gap > 0) {
					gap += arstrutDepth;
					if (depth < gap) depth = gap;
					gap = 0;
				}
			}
			if (group.addJot && r < group.body.length - 1) depth += jot;
			outrow.height = height;
			outrow.depth = depth;
			totalHeight += height;
			outrow.pos = totalHeight;
			totalHeight += depth + gap;
			body[r] = outrow;
			setHLinePos(hLinesBeforeRow[r + 1]);
		}
		var offset = totalHeight / 2 + options.fontMetrics().axisHeight;
		var colDescriptions = group.cols || [];
		var cols = [];
		var colSep;
		var colDescrNum;
		var tagSpans = [];
		if (group.tags && group.tags.some((tag) => tag)) for (r = 0; r < nr; ++r) {
			var rw = body[r];
			var shift = rw.pos - offset;
			var tag = group.tags[r];
			var tagSpan = void 0;
			if (tag === true) tagSpan = makeSpan(["eqn-num"], [], options);
			else if (tag === false) tagSpan = makeSpan([], [], options);
			else tagSpan = makeSpan([], buildExpression$1(tag, options, true), options);
			tagSpan.depth = rw.depth;
			tagSpan.height = rw.height;
			tagSpans.push({
				type: "elem",
				elem: tagSpan,
				shift
			});
		}
		for (c = 0, colDescrNum = 0; c < nc || colDescrNum < colDescriptions.length; ++c, ++colDescrNum) {
			var _colDescr3;
			var colDescr = colDescriptions[colDescrNum];
			var firstSeparator = true;
			while (((_colDescr = colDescr) == null ? void 0 : _colDescr.type) === "separator") {
				var _colDescr;
				if (!firstSeparator) {
					colSep = makeSpan(["arraycolsep"], []);
					colSep.style.width = makeEm(options.fontMetrics().doubleRuleSep);
					cols.push(colSep);
				}
				if (colDescr.separator === "|" || colDescr.separator === ":") {
					var lineType = colDescr.separator === "|" ? "solid" : "dashed";
					var separator = makeSpan(["vertical-separator"], [], options);
					separator.style.height = makeEm(totalHeight);
					separator.style.borderRightWidth = makeEm(ruleThickness);
					separator.style.borderRightStyle = lineType;
					separator.style.margin = "0 " + makeEm(-ruleThickness / 2);
					var _shift = totalHeight - offset;
					if (_shift) separator.style.verticalAlign = makeEm(-_shift);
					cols.push(separator);
				} else throw new ParseError("Invalid separator type: " + colDescr.separator);
				colDescrNum++;
				colDescr = colDescriptions[colDescrNum];
				firstSeparator = false;
			}
			if (c >= nc) continue;
			var sepwidth = void 0;
			if (c > 0 || group.hskipBeforeAndAfter) {
				var _colDescr$pregap, _colDescr2;
				sepwidth = (_colDescr$pregap = (_colDescr2 = colDescr) == null ? void 0 : _colDescr2.pregap) != null ? _colDescr$pregap : arraycolsep;
				if (sepwidth !== 0) {
					colSep = makeSpan(["arraycolsep"], []);
					colSep.style.width = makeEm(sepwidth);
					cols.push(colSep);
				}
			}
			var colElems = [];
			for (r = 0; r < nr; ++r) {
				var row = body[r];
				var elem = row.cells[c];
				if (!elem) continue;
				var _shift2 = row.pos - offset;
				elem.depth = row.depth;
				elem.height = row.height;
				colElems.push({
					type: "elem",
					elem,
					shift: _shift2
				});
			}
			var colVList = makeVList({
				positionType: "individualShift",
				children: colElems
			});
			var colSpan = makeSpan(["col-align-" + (((_colDescr3 = colDescr) == null ? void 0 : _colDescr3.align) || "c")], [colVList]);
			cols.push(colSpan);
			if (c < nc - 1 || group.hskipBeforeAndAfter) {
				var _colDescr$postgap, _colDescr4;
				sepwidth = (_colDescr$postgap = (_colDescr4 = colDescr) == null ? void 0 : _colDescr4.postgap) != null ? _colDescr$postgap : arraycolsep;
				if (sepwidth !== 0) {
					colSep = makeSpan(["arraycolsep"], []);
					colSep.style.width = makeEm(sepwidth);
					cols.push(colSep);
				}
			}
		}
		var tableBody = makeSpan(["mtable"], cols);
		if (hlines.length > 0) {
			var line = makeLineSpan("hline", options, ruleThickness);
			var dashes = makeLineSpan("hdashline", options, ruleThickness);
			var vListElems = [{
				type: "elem",
				elem: tableBody,
				shift: 0
			}];
			while (hlines.length > 0) {
				var hline = hlines.pop();
				var lineShift = hline.pos - offset;
				if (hline.isDashed) vListElems.push({
					type: "elem",
					elem: dashes,
					shift: lineShift
				});
				else vListElems.push({
					type: "elem",
					elem: line,
					shift: lineShift
				});
			}
			tableBody = makeVList({
				positionType: "individualShift",
				children: vListElems
			});
		}
		if (tagSpans.length === 0) return makeSpan(["mord"], [tableBody], options);
		else {
			var tagCol = makeSpan(["tag"], [makeVList({
				positionType: "individualShift",
				children: tagSpans
			})], options);
			return makeFragment([tableBody, tagCol]);
		}
	};
	var alignMap = {
		c: "center ",
		l: "left ",
		r: "right "
	};
	var mathmlBuilder$5 = function mathmlBuilder(group, options) {
		var tbl = [];
		var glue = new MathNode("mtd", [], ["mtr-glue"]);
		var tag = new MathNode("mtd", [], ["mml-eqn-num"]);
		for (var i = 0; i < group.body.length; i++) {
			var rw = group.body[i];
			var row = [];
			for (var j = 0; j < rw.length; j++) row.push(new MathNode("mtd", [buildGroup(rw[j], options)]));
			if (group.tags && group.tags[i]) {
				row.unshift(glue);
				row.push(glue);
				if (group.leqno) row.unshift(tag);
				else row.push(tag);
			}
			tbl.push(new MathNode("mtr", row));
		}
		var table = new MathNode("mtable", tbl);
		var gap = group.arraystretch === .5 ? .1 : .16 + group.arraystretch - 1 + (group.addJot ? .09 : 0);
		table.setAttribute("rowspacing", makeEm(gap));
		var menclose = "";
		var align = "";
		if (group.cols && group.cols.length > 0) {
			var cols = group.cols;
			var columnLines = "";
			var prevTypeWasAlign = false;
			var iStart = 0;
			var iEnd = cols.length;
			if (cols[0].type === "separator") {
				menclose += "top ";
				iStart = 1;
			}
			if (cols[cols.length - 1].type === "separator") {
				menclose += "bottom ";
				iEnd -= 1;
			}
			for (var _i = iStart; _i < iEnd; _i++) {
				var col = cols[_i];
				if (col.type === "align") {
					align += alignMap[col.align];
					if (prevTypeWasAlign) columnLines += "none ";
					prevTypeWasAlign = true;
				} else if (col.type === "separator") {
					if (prevTypeWasAlign) {
						columnLines += col.separator === "|" ? "solid " : "dashed ";
						prevTypeWasAlign = false;
					}
				}
			}
			table.setAttribute("columnalign", align.trim());
			if (/[sd]/.test(columnLines)) table.setAttribute("columnlines", columnLines.trim());
		}
		if (group.colSeparationType === "align") {
			var _cols = group.cols || [];
			var spacing = "";
			for (var _i2 = 1; _i2 < _cols.length; _i2++) spacing += _i2 % 2 ? "0em " : "1em ";
			table.setAttribute("columnspacing", spacing.trim());
		} else if (group.colSeparationType === "alignat" || group.colSeparationType === "gather") table.setAttribute("columnspacing", "0em");
		else if (group.colSeparationType === "small") table.setAttribute("columnspacing", "0.2778em");
		else if (group.colSeparationType === "CD") table.setAttribute("columnspacing", "0.5em");
		else table.setAttribute("columnspacing", "1em");
		var rowLines = "";
		var hlines = group.hLinesBeforeRow;
		menclose += hlines[0].length > 0 ? "left " : "";
		menclose += hlines[hlines.length - 1].length > 0 ? "right " : "";
		for (var _i3 = 1; _i3 < hlines.length - 1; _i3++) rowLines += hlines[_i3].length === 0 ? "none " : hlines[_i3][0] ? "dashed " : "solid ";
		if (/[sd]/.test(rowLines)) table.setAttribute("rowlines", rowLines.trim());
		if (menclose !== "") {
			table = new MathNode("menclose", [table]);
			table.setAttribute("notation", menclose.trim());
		}
		if (group.arraystretch && group.arraystretch < 1) {
			table = new MathNode("mstyle", [table]);
			table.setAttribute("scriptlevel", "1");
		}
		return table;
	};
	var alignedHandler = function alignedHandler(context, args) {
		if (!context.envName.includes("ed")) validateAmsEnvironmentContext(context);
		var cols = [];
		var separationType = context.envName.includes("at") ? "alignat" : "align";
		var isSplit = context.envName === "split";
		var res = parseArray(context.parser, {
			cols,
			addJot: true,
			autoTag: isSplit ? void 0 : getAutoTag(context.envName),
			emptySingleRow: true,
			colSeparationType: separationType,
			maxNumCols: isSplit ? 2 : void 0,
			leqno: context.parser.settings.leqno
		}, "display");
		var numMaths = 0;
		var numCols = 0;
		var emptyGroup = {
			type: "ordgroup",
			mode: context.mode,
			body: []
		};
		if (args[0] && args[0].type === "ordgroup") {
			var arg0 = "";
			for (var i = 0; i < args[0].body.length; i++) {
				var textord = assertNodeType(args[0].body[i], "textord");
				arg0 += textord.text;
			}
			numMaths = Number(arg0);
			numCols = numMaths * 2;
		}
		var isAligned = !numCols;
		res.body.forEach(function(row) {
			for (var _i4 = 1; _i4 < row.length; _i4 += 2) assertNodeType(assertNodeType(row[_i4], "styling").body[0], "ordgroup").body.unshift(emptyGroup);
			if (!isAligned) {
				var curMaths = row.length / 2;
				if (numMaths < curMaths) throw new ParseError("Too many math in a row: " + ("expected " + numMaths + ", but got " + curMaths), row[0]);
			} else if (numCols < row.length) numCols = row.length;
		});
		for (var _i5 = 0; _i5 < numCols; ++_i5) {
			var align = "r";
			var pregap = 0;
			if (_i5 % 2 === 1) align = "l";
			else if (_i5 > 0 && isAligned) pregap = 1;
			cols[_i5] = {
				type: "align",
				align,
				pregap,
				postgap: 0
			};
		}
		res.colSeparationType = isAligned ? "align" : "alignat";
		return res;
	};
	defineEnvironment({
		type: "array",
		names: ["array", "darray"],
		props: { numArgs: 1 },
		handler(context, args) {
			var cols = (checkSymbolNodeType(args[0]) ? [args[0]] : assertNodeType(args[0], "ordgroup").body).map(function(nde) {
				var ca = assertSymbolNodeType(nde).text;
				if ("lcr".includes(ca)) return {
					type: "align",
					align: ca
				};
				else if (ca === "|") return {
					type: "separator",
					separator: "|"
				};
				else if (ca === ":") return {
					type: "separator",
					separator: ":"
				};
				throw new ParseError("Unknown column alignment: " + ca, nde);
			});
			var res = {
				cols,
				hskipBeforeAndAfter: true,
				maxNumCols: cols.length
			};
			return parseArray(context.parser, res, dCellStyle(context.envName));
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: [
			"matrix",
			"pmatrix",
			"bmatrix",
			"Bmatrix",
			"vmatrix",
			"Vmatrix",
			"matrix*",
			"pmatrix*",
			"bmatrix*",
			"Bmatrix*",
			"vmatrix*",
			"Vmatrix*"
		],
		props: { numArgs: 0 },
		handler(context) {
			var delimiters = {
				"matrix": null,
				"pmatrix": ["(", ")"],
				"bmatrix": ["[", "]"],
				"Bmatrix": ["\\{", "\\}"],
				"vmatrix": ["|", "|"],
				"Vmatrix": ["\\Vert", "\\Vert"]
			}[context.envName.replace("*", "")];
			var colAlign = "c";
			var payload = {
				hskipBeforeAndAfter: false,
				cols: [{
					type: "align",
					align: colAlign
				}]
			};
			if (context.envName.charAt(context.envName.length - 1) === "*") {
				var parser = context.parser;
				parser.consumeSpaces();
				if (parser.fetch().text === "[") {
					parser.consume();
					parser.consumeSpaces();
					colAlign = parser.fetch().text;
					if (!"lcr".includes(colAlign)) throw new ParseError("Expected l or c or r", parser.nextToken);
					parser.consume();
					parser.consumeSpaces();
					parser.expect("]");
					parser.consume();
					payload.cols = [{
						type: "align",
						align: colAlign
					}];
				}
			}
			var res = parseArray(context.parser, payload, dCellStyle(context.envName));
			var numCols = Math.max(0, ...res.body.map((row) => row.length));
			res.cols = new Array(numCols).fill({
				type: "align",
				align: colAlign
			});
			return delimiters ? {
				type: "leftright",
				mode: context.mode,
				body: [res],
				left: delimiters[0],
				right: delimiters[1],
				rightColor: void 0
			} : res;
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: ["smallmatrix"],
		props: { numArgs: 0 },
		handler(context) {
			var res = parseArray(context.parser, { arraystretch: .5 }, "script");
			res.colSeparationType = "small";
			return res;
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: ["subarray"],
		props: { numArgs: 1 },
		handler(context, args) {
			var cols = (checkSymbolNodeType(args[0]) ? [args[0]] : assertNodeType(args[0], "ordgroup").body).map(function(nde) {
				var ca = assertSymbolNodeType(nde).text;
				if ("lc".includes(ca)) return {
					type: "align",
					align: ca
				};
				throw new ParseError("Unknown column alignment: " + ca, nde);
			});
			if (cols.length > 1) throw new ParseError("{subarray} can contain only one column");
			var payload = {
				cols,
				hskipBeforeAndAfter: false,
				arraystretch: .5
			};
			var res = parseArray(context.parser, payload, "script");
			if (res.body.length > 0 && res.body[0].length > 1) throw new ParseError("{subarray} can contain only one column");
			return res;
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: [
			"cases",
			"dcases",
			"rcases",
			"drcases"
		],
		props: { numArgs: 0 },
		handler(context) {
			var res = parseArray(context.parser, {
				arraystretch: 1.2,
				cols: [{
					type: "align",
					align: "l",
					pregap: 0,
					postgap: 1
				}, {
					type: "align",
					align: "l",
					pregap: 0,
					postgap: 0
				}]
			}, dCellStyle(context.envName));
			return {
				type: "leftright",
				mode: context.mode,
				body: [res],
				left: context.envName.includes("r") ? "." : "\\{",
				right: context.envName.includes("r") ? "\\}" : ".",
				rightColor: void 0
			};
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: [
			"align",
			"align*",
			"aligned",
			"split"
		],
		props: { numArgs: 0 },
		handler: alignedHandler,
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: [
			"gathered",
			"gather",
			"gather*"
		],
		props: { numArgs: 0 },
		handler(context) {
			if (gatherEnvironments.has(context.envName)) validateAmsEnvironmentContext(context);
			var res = {
				cols: [{
					type: "align",
					align: "c"
				}],
				addJot: true,
				colSeparationType: "gather",
				autoTag: getAutoTag(context.envName),
				emptySingleRow: true,
				leqno: context.parser.settings.leqno
			};
			return parseArray(context.parser, res, "display");
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: [
			"alignat",
			"alignat*",
			"alignedat"
		],
		props: { numArgs: 1 },
		handler: alignedHandler,
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: ["equation", "equation*"],
		props: { numArgs: 0 },
		handler(context) {
			validateAmsEnvironmentContext(context);
			var res = {
				autoTag: getAutoTag(context.envName),
				emptySingleRow: true,
				singleRow: true,
				maxNumCols: 1,
				leqno: context.parser.settings.leqno
			};
			return parseArray(context.parser, res, "display");
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineEnvironment({
		type: "array",
		names: ["CD"],
		props: { numArgs: 0 },
		handler(context) {
			validateAmsEnvironmentContext(context);
			return parseCD(context.parser);
		},
		htmlBuilder: htmlBuilder$6,
		mathmlBuilder: mathmlBuilder$5
	});
	defineMacro("\\nonumber", "\\gdef\\@eqnsw{0}");
	defineMacro("\\notag", "\\nonumber");
	defineFunction({
		type: "text",
		names: ["\\hline", "\\hdashline"],
		props: {
			numArgs: 0,
			allowedInText: true,
			allowedInMath: true
		},
		handler(context, args) {
			throw new ParseError(context.funcName + " valid only within array environment");
		}
	});
	var environments = _environments;
	defineFunction({
		type: "environment",
		names: ["\\begin", "\\end"],
		props: {
			numArgs: 1,
			argTypes: ["text"]
		},
		handler(_ref, args) {
			var { parser, funcName } = _ref;
			var nameGroup = args[0];
			if (nameGroup.type !== "ordgroup") throw new ParseError("Invalid environment name", nameGroup);
			var envName = "";
			for (var i = 0; i < nameGroup.body.length; ++i) envName += assertNodeType(nameGroup.body[i], "textord").text;
			if (funcName === "\\begin") {
				if (!environments.hasOwnProperty(envName)) throw new ParseError("No such environment: " + envName, nameGroup);
				var env = environments[envName];
				var { args: _args, optArgs } = parser.parseArguments("\\begin{" + envName + "}", env);
				var context = {
					mode: parser.mode,
					envName,
					parser
				};
				var result = env.handler(context, _args, optArgs);
				parser.expect("\\end", false);
				var endNameToken = parser.nextToken;
				var end = assertNodeType(parser.parseFunction(), "environment");
				if (end.name !== envName) throw new ParseError("Mismatch: \\begin{" + envName + "} matched by \\end{" + end.name + "}", endNameToken);
				return result;
			}
			return {
				type: "environment",
				mode: parser.mode,
				name: envName,
				nameGroup
			};
		}
	});
	var htmlBuilder$5 = (group, options) => {
		var font = group.font;
		var newOptions = options.withFont(font);
		return buildGroup$1(group.body, newOptions);
	};
	var mathmlBuilder$4 = (group, options) => {
		var font = group.font;
		var newOptions = options.withFont(font);
		return buildGroup(group.body, newOptions);
	};
	var fontAliases = {
		"\\Bbb": "\\mathbb",
		"\\bold": "\\mathbf",
		"\\frak": "\\mathfrak"
	};
	defineFunction({
		type: "font",
		names: [
			"\\mathrm",
			"\\mathit",
			"\\mathbf",
			"\\mathnormal",
			"\\mathsfit",
			"\\mathbb",
			"\\mathcal",
			"\\mathfrak",
			"\\mathscr",
			"\\mathsf",
			"\\mathtt",
			"\\Bbb",
			"\\bold",
			"\\frak"
		],
		props: {
			numArgs: 1,
			allowedInArgument: true
		},
		handler: (_ref, args) => {
			var { parser, funcName } = _ref;
			var body = normalizeArgument(args[0]);
			var func = funcName;
			if (func in fontAliases) func = fontAliases[func];
			return {
				type: "font",
				mode: parser.mode,
				font: func.slice(1),
				body
			};
		},
		htmlBuilder: htmlBuilder$5,
		mathmlBuilder: mathmlBuilder$4
	});
	defineFunction({
		type: "mclass",
		names: ["\\boldsymbol", "\\bm"],
		props: { numArgs: 1 },
		handler: (_ref2, args) => {
			var { parser } = _ref2;
			var body = args[0];
			return {
				type: "mclass",
				mode: parser.mode,
				mclass: binrelClass(body),
				body: [{
					type: "font",
					mode: parser.mode,
					font: "boldsymbol",
					body
				}],
				isCharacterBox: isCharacterBox(body)
			};
		}
	});
	defineFunction({
		type: "font",
		names: [
			"\\rm",
			"\\sf",
			"\\tt",
			"\\bf",
			"\\it",
			"\\cal"
		],
		props: {
			numArgs: 0,
			allowedInText: true
		},
		handler: (_ref3, args) => {
			var { parser, funcName, breakOnTokenText } = _ref3;
			var { mode } = parser;
			var body = parser.parseExpression(true, breakOnTokenText);
			return {
				type: "font",
				mode,
				font: "math" + funcName.slice(1),
				body: {
					type: "ordgroup",
					mode: parser.mode,
					body
				}
			};
		},
		htmlBuilder: htmlBuilder$5,
		mathmlBuilder: mathmlBuilder$4
	});
	var htmlBuilder$4 = (group, options) => {
		var style = options.style;
		var nstyle = style.fracNum();
		var dstyle = style.fracDen();
		var newOptions = options.havingStyle(nstyle);
		var numerm = buildGroup$1(group.numer, newOptions, options);
		if (group.continued) {
			var hStrut = 8.5 / options.fontMetrics().ptPerEm;
			var dStrut = 3.5 / options.fontMetrics().ptPerEm;
			numerm.height = numerm.height < hStrut ? hStrut : numerm.height;
			numerm.depth = numerm.depth < dStrut ? dStrut : numerm.depth;
		}
		newOptions = options.havingStyle(dstyle);
		var denomm = buildGroup$1(group.denom, newOptions, options);
		var rule;
		var ruleWidth;
		var ruleSpacing;
		if (group.hasBarLine) {
			if (group.barSize) {
				ruleWidth = calculateSize(group.barSize, options);
				rule = makeLineSpan("frac-line", options, ruleWidth);
			} else rule = makeLineSpan("frac-line", options);
			ruleWidth = rule.height;
			ruleSpacing = rule.height;
		} else {
			rule = null;
			ruleWidth = 0;
			ruleSpacing = options.fontMetrics().defaultRuleThickness;
		}
		var numShift;
		var clearance;
		var denomShift;
		if (style.size === Style$1.DISPLAY.size) {
			numShift = options.fontMetrics().num1;
			if (ruleWidth > 0) clearance = 3 * ruleSpacing;
			else clearance = 7 * ruleSpacing;
			denomShift = options.fontMetrics().denom1;
		} else {
			if (ruleWidth > 0) {
				numShift = options.fontMetrics().num2;
				clearance = ruleSpacing;
			} else {
				numShift = options.fontMetrics().num3;
				clearance = 3 * ruleSpacing;
			}
			denomShift = options.fontMetrics().denom2;
		}
		var frac;
		if (!rule) {
			var candidateClearance = numShift - numerm.depth - (denomm.height - denomShift);
			if (candidateClearance < clearance) {
				numShift += .5 * (clearance - candidateClearance);
				denomShift += .5 * (clearance - candidateClearance);
			}
			frac = makeVList({
				positionType: "individualShift",
				children: [{
					type: "elem",
					elem: denomm,
					shift: denomShift
				}, {
					type: "elem",
					elem: numerm,
					shift: -numShift
				}]
			});
		} else {
			var axisHeight = options.fontMetrics().axisHeight;
			if (numShift - numerm.depth - (axisHeight + .5 * ruleWidth) < clearance) numShift += clearance - (numShift - numerm.depth - (axisHeight + .5 * ruleWidth));
			if (axisHeight - .5 * ruleWidth - (denomm.height - denomShift) < clearance) denomShift += clearance - (axisHeight - .5 * ruleWidth - (denomm.height - denomShift));
			var midShift = -(axisHeight - .5 * ruleWidth);
			frac = makeVList({
				positionType: "individualShift",
				children: [
					{
						type: "elem",
						elem: denomm,
						shift: denomShift
					},
					{
						type: "elem",
						elem: rule,
						shift: midShift
					},
					{
						type: "elem",
						elem: numerm,
						shift: -numShift
					}
				]
			});
		}
		newOptions = options.havingStyle(style);
		frac.height *= newOptions.sizeMultiplier / options.sizeMultiplier;
		frac.depth *= newOptions.sizeMultiplier / options.sizeMultiplier;
		var delimSize;
		if (style.size === Style$1.DISPLAY.size) delimSize = options.fontMetrics().delim1;
		else if (style.size === Style$1.SCRIPTSCRIPT.size) delimSize = options.havingStyle(Style$1.SCRIPT).fontMetrics().delim2;
		else delimSize = options.fontMetrics().delim2;
		var leftDelim;
		var rightDelim;
		if (group.leftDelim == null) leftDelim = makeNullDelimiter(options, ["mopen"]);
		else leftDelim = makeCustomSizedDelim(group.leftDelim, delimSize, true, options.havingStyle(style), group.mode, ["mopen"]);
		if (group.continued) rightDelim = makeSpan([]);
		else if (group.rightDelim == null) rightDelim = makeNullDelimiter(options, ["mclose"]);
		else rightDelim = makeCustomSizedDelim(group.rightDelim, delimSize, true, options.havingStyle(style), group.mode, ["mclose"]);
		return makeSpan(["mord"].concat(newOptions.sizingClasses(options)), [
			leftDelim,
			makeSpan(["mfrac"], [frac]),
			rightDelim
		], options);
	};
	var mathmlBuilder$3 = (group, options) => {
		var node = new MathNode("mfrac", [buildGroup(group.numer, options), buildGroup(group.denom, options)]);
		if (!group.hasBarLine) node.setAttribute("linethickness", "0px");
		else if (group.barSize) {
			var ruleWidth = calculateSize(group.barSize, options);
			node.setAttribute("linethickness", makeEm(ruleWidth));
		}
		if (group.leftDelim != null || group.rightDelim != null) {
			var withDelims = [];
			if (group.leftDelim != null) {
				var leftOp = new MathNode("mo", [new TextNode(group.leftDelim.replace("\\", ""))]);
				leftOp.setAttribute("fence", "true");
				withDelims.push(leftOp);
			}
			withDelims.push(node);
			if (group.rightDelim != null) {
				var rightOp = new MathNode("mo", [new TextNode(group.rightDelim.replace("\\", ""))]);
				rightOp.setAttribute("fence", "true");
				withDelims.push(rightOp);
			}
			return makeRow(withDelims);
		}
		return node;
	};
	var wrapWithStyle = (frac, style) => {
		if (!style) return frac;
		return {
			type: "styling",
			mode: frac.mode,
			style,
			body: [frac]
		};
	};
	defineFunction({
		type: "genfrac",
		names: [
			"\\cfrac",
			"\\dfrac",
			"\\frac",
			"\\tfrac",
			"\\dbinom",
			"\\binom",
			"\\tbinom",
			"\\\\atopfrac",
			"\\\\bracefrac",
			"\\\\brackfrac"
		],
		props: {
			numArgs: 2,
			allowedInArgument: true
		},
		handler: (_ref, args) => {
			var { parser, funcName } = _ref;
			var numer = args[0];
			var denom = args[1];
			var hasBarLine;
			var leftDelim = null;
			var rightDelim = null;
			switch (funcName) {
				case "\\cfrac":
				case "\\dfrac":
				case "\\frac":
				case "\\tfrac":
					hasBarLine = true;
					break;
				case "\\\\atopfrac":
					hasBarLine = false;
					break;
				case "\\dbinom":
				case "\\binom":
				case "\\tbinom":
					hasBarLine = false;
					leftDelim = "(";
					rightDelim = ")";
					break;
				case "\\\\bracefrac":
					hasBarLine = false;
					leftDelim = "\\{";
					rightDelim = "\\}";
					break;
				case "\\\\brackfrac":
					hasBarLine = false;
					leftDelim = "[";
					rightDelim = "]";
					break;
				default: throw new Error("Unrecognized genfrac command");
			}
			var continued = funcName === "\\cfrac";
			var style = null;
			if (continued || funcName.startsWith("\\d")) style = "display";
			else if (funcName.startsWith("\\t")) style = "text";
			return wrapWithStyle({
				type: "genfrac",
				mode: parser.mode,
				numer,
				denom,
				continued,
				hasBarLine,
				leftDelim,
				rightDelim,
				barSize: null
			}, style);
		},
		htmlBuilder: htmlBuilder$4,
		mathmlBuilder: mathmlBuilder$3
	});
	defineFunction({
		type: "infix",
		names: [
			"\\over",
			"\\choose",
			"\\atop",
			"\\brace",
			"\\brack"
		],
		props: {
			numArgs: 0,
			infix: true
		},
		handler(_ref2) {
			var { parser, funcName, token } = _ref2;
			var replaceWith;
			switch (funcName) {
				case "\\over":
					replaceWith = "\\frac";
					break;
				case "\\choose":
					replaceWith = "\\binom";
					break;
				case "\\atop":
					replaceWith = "\\\\atopfrac";
					break;
				case "\\brace":
					replaceWith = "\\\\bracefrac";
					break;
				case "\\brack":
					replaceWith = "\\\\brackfrac";
					break;
				default: throw new Error("Unrecognized infix genfrac command");
			}
			return {
				type: "infix",
				mode: parser.mode,
				replaceWith,
				token
			};
		}
	});
	var stylArray = [
		"display",
		"text",
		"script",
		"scriptscript"
	];
	var delimFromValue = function delimFromValue(delimString) {
		var delim = null;
		if (delimString.length > 0) {
			delim = delimString;
			delim = delim === "." ? null : delim;
		}
		return delim;
	};
	defineFunction({
		type: "genfrac",
		names: ["\\genfrac"],
		props: {
			numArgs: 6,
			allowedInArgument: true,
			argTypes: [
				"math",
				"math",
				"size",
				"text",
				"math",
				"math"
			]
		},
		handler(_ref3, args) {
			var { parser } = _ref3;
			var numer = args[4];
			var denom = args[5];
			var leftNode = normalizeArgument(args[0]);
			var leftDelim = leftNode.type === "atom" && leftNode.family === "open" ? delimFromValue(leftNode.text) : null;
			var rightNode = normalizeArgument(args[1]);
			var rightDelim = rightNode.type === "atom" && rightNode.family === "close" ? delimFromValue(rightNode.text) : null;
			var barNode = assertNodeType(args[2], "size");
			var hasBarLine;
			var barSize = null;
			if (barNode.isBlank) hasBarLine = true;
			else {
				barSize = barNode.value;
				hasBarLine = barSize.number > 0;
			}
			var size = null;
			var styl = args[3];
			if (styl.type === "ordgroup") {
				if (styl.body.length > 0) {
					var textOrd = assertNodeType(styl.body[0], "textord");
					size = stylArray[Number(textOrd.text)];
				}
			} else {
				styl = assertNodeType(styl, "textord");
				size = stylArray[Number(styl.text)];
			}
			return wrapWithStyle({
				type: "genfrac",
				mode: parser.mode,
				numer,
				denom,
				continued: false,
				hasBarLine,
				barSize,
				leftDelim,
				rightDelim
			}, size);
		}
	});
	defineFunction({
		type: "infix",
		names: ["\\above"],
		props: {
			numArgs: 1,
			argTypes: ["size"],
			infix: true
		},
		handler(_ref4, args) {
			var { parser, funcName, token } = _ref4;
			return {
				type: "infix",
				mode: parser.mode,
				replaceWith: "\\\\abovefrac",
				size: assertNodeType(args[0], "size").value,
				token
			};
		}
	});
	defineFunction({
		type: "genfrac",
		names: ["\\\\abovefrac"],
		props: {
			numArgs: 3,
			argTypes: [
				"math",
				"size",
				"math"
			]
		},
		handler: (_ref5, args) => {
			var { parser, funcName } = _ref5;
			var numer = args[0];
			var barSize = assertNodeType(args[1], "infix").size;
			if (!barSize) throw new Error("\\\\abovefrac expected size, but got " + String(barSize));
			var denom = args[2];
			var hasBarLine = barSize.number > 0;
			return {
				type: "genfrac",
				mode: parser.mode,
				numer,
				denom,
				continued: false,
				hasBarLine,
				barSize,
				leftDelim: null,
				rightDelim: null
			};
		}
	});
	var htmlBuilder$3 = (grp, options) => {
		var style = options.style;
		var supSubGroup;
		var group;
		if (grp.type === "supsub") {
			supSubGroup = grp.sup ? buildGroup$1(grp.sup, options.havingStyle(style.sup()), options) : buildGroup$1(grp.sub, options.havingStyle(style.sub()), options);
			group = assertNodeType(grp.base, "horizBrace");
		} else group = assertNodeType(grp, "horizBrace");
		var body = buildGroup$1(group.base, options.havingBaseStyle(Style$1.DISPLAY));
		var braceBody = stretchySvg(group, options);
		var vlist;
		if (group.isOver) vlist = makeVList({
			positionType: "firstBaseline",
			children: [
				{
					type: "elem",
					elem: body
				},
				{
					type: "kern",
					size: .1
				},
				{
					type: "elem",
					elem: braceBody,
					wrapperClasses: ["svg-align"]
				}
			]
		});
		else vlist = makeVList({
			positionType: "bottom",
			positionData: body.depth + .1 + braceBody.height,
			children: [
				{
					type: "elem",
					elem: braceBody,
					wrapperClasses: ["svg-align"]
				},
				{
					type: "kern",
					size: .1
				},
				{
					type: "elem",
					elem: body
				}
			]
		});
		if (supSubGroup) {
			var vSpan = makeSpan(["minner", group.isOver ? "mover" : "munder"], [vlist], options);
			if (group.isOver) vlist = makeVList({
				positionType: "firstBaseline",
				children: [
					{
						type: "elem",
						elem: vSpan
					},
					{
						type: "kern",
						size: .2
					},
					{
						type: "elem",
						elem: supSubGroup
					}
				]
			});
			else vlist = makeVList({
				positionType: "bottom",
				positionData: vSpan.depth + .2 + supSubGroup.height + supSubGroup.depth,
				children: [
					{
						type: "elem",
						elem: supSubGroup
					},
					{
						type: "kern",
						size: .2
					},
					{
						type: "elem",
						elem: vSpan
					}
				]
			});
		}
		return makeSpan(["minner", group.isOver ? "mover" : "munder"], [vlist], options);
	};
	var mathmlBuilder$2 = (group, options) => {
		var accentNode = stretchyMathML(group.label);
		return new MathNode(group.isOver ? "mover" : "munder", [buildGroup(group.base, options), accentNode]);
	};
	defineFunction({
		type: "horizBrace",
		names: [
			"\\overbrace",
			"\\underbrace",
			"\\overbracket",
			"\\underbracket"
		],
		props: { numArgs: 1 },
		handler(_ref, args) {
			var { parser, funcName } = _ref;
			return {
				type: "horizBrace",
				mode: parser.mode,
				label: funcName,
				isOver: funcName.includes("\\over"),
				base: args[0]
			};
		},
		htmlBuilder: htmlBuilder$3,
		mathmlBuilder: mathmlBuilder$2
	});
	defineFunction({
		type: "href",
		names: ["\\href"],
		props: {
			numArgs: 2,
			argTypes: ["url", "original"],
			allowedInText: true
		},
		handler: (_ref, args) => {
			var { parser } = _ref;
			var body = args[1];
			var href = assertNodeType(args[0], "url").url;
			if (!parser.settings.isTrusted({
				command: "\\href",
				url: href
			})) return parser.formatUnsupportedCmd("\\href");
			return {
				type: "href",
				mode: parser.mode,
				href,
				body: ordargument(body)
			};
		},
		htmlBuilder: (group, options) => {
			var elements = buildExpression$1(group.body, options, false);
			return makeAnchor(group.href, [], elements, options);
		},
		mathmlBuilder: (group, options) => {
			var math = buildExpressionRow(group.body, options);
			if (!(math instanceof MathNode)) math = new MathNode("mrow", [math]);
			math.setAttribute("href", group.href);
			return math;
		}
	});
	defineFunction({
		type: "href",
		names: ["\\url"],
		props: {
			numArgs: 1,
			argTypes: ["url"],
			allowedInText: true
		},
		handler: (_ref2, args) => {
			var { parser } = _ref2;
			var href = assertNodeType(args[0], "url").url;
			if (!parser.settings.isTrusted({
				command: "\\url",
				url: href
			})) return parser.formatUnsupportedCmd("\\url");
			var chars = [];
			for (var i = 0; i < href.length; i++) {
				var c = href[i];
				if (c === "~") c = "\\textasciitilde";
				chars.push({
					type: "textord",
					mode: "text",
					text: c
				});
			}
			var body = {
				type: "text",
				mode: parser.mode,
				font: "\\texttt",
				body: chars
			};
			return {
				type: "href",
				mode: parser.mode,
				href,
				body: ordargument(body)
			};
		}
	});
	defineFunction({
		type: "hbox",
		names: ["\\hbox"],
		props: {
			numArgs: 1,
			argTypes: ["text"],
			allowedInText: true,
			primitive: true
		},
		handler(_ref, args) {
			var { parser } = _ref;
			return {
				type: "hbox",
				mode: parser.mode,
				body: ordargument(args[0])
			};
		},
		htmlBuilder(group, options) {
			return makeFragment(buildExpression$1(group.body, options.withFont(""), false));
		},
		mathmlBuilder(group, options) {
			return new MathNode("mrow", buildExpression(group.body, options.withFont("")));
		}
	});
	defineFunction({
		type: "html",
		names: [
			"\\htmlClass",
			"\\htmlId",
			"\\htmlStyle",
			"\\htmlData"
		],
		props: {
			numArgs: 2,
			argTypes: ["raw", "original"],
			allowedInText: true
		},
		handler: (_ref, args) => {
			var { parser, funcName, token } = _ref;
			var value = assertNodeType(args[0], "raw").string;
			var body = args[1];
			if (parser.settings.strict) parser.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
			var trustContext;
			var attributes = {};
			switch (funcName) {
				case "\\htmlClass":
					attributes.class = value;
					trustContext = {
						command: "\\htmlClass",
						class: value
					};
					break;
				case "\\htmlId":
					attributes.id = value;
					trustContext = {
						command: "\\htmlId",
						id: value
					};
					break;
				case "\\htmlStyle":
					attributes.style = value;
					trustContext = {
						command: "\\htmlStyle",
						style: value
					};
					break;
				case "\\htmlData":
					var data = value.split(",");
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						var firstEquals = item.indexOf("=");
						if (firstEquals < 0) throw new ParseError("\\htmlData key/value '" + item + "' missing equals sign");
						var key = item.slice(0, firstEquals);
						var _value = item.slice(firstEquals + 1);
						attributes["data-" + key.trim()] = _value;
					}
					trustContext = {
						command: "\\htmlData",
						attributes
					};
					break;
				default: throw new Error("Unrecognized html command");
			}
			if (!parser.settings.isTrusted(trustContext)) return parser.formatUnsupportedCmd(funcName);
			return {
				type: "html",
				mode: parser.mode,
				attributes,
				body: ordargument(body)
			};
		},
		htmlBuilder: (group, options) => {
			var elements = buildExpression$1(group.body, options, false);
			var classes = ["enclosing"];
			if (group.attributes.class) classes.push(...group.attributes.class.trim().split(/\s+/));
			var span = makeSpan(classes, elements, options);
			for (var attr in group.attributes) if (attr !== "class" && group.attributes.hasOwnProperty(attr)) span.setAttribute(attr, group.attributes[attr]);
			return span;
		},
		mathmlBuilder: (group, options) => {
			return buildExpressionRow(group.body, options);
		}
	});
	defineFunction({
		type: "htmlmathml",
		names: ["\\html@mathml"],
		props: {
			numArgs: 2,
			allowedInArgument: true,
			allowedInText: true
		},
		handler: (_ref, args) => {
			var { parser } = _ref;
			return {
				type: "htmlmathml",
				mode: parser.mode,
				html: ordargument(args[0]),
				mathml: ordargument(args[1])
			};
		},
		htmlBuilder: (group, options) => {
			return makeFragment(buildExpression$1(group.html, options, false));
		},
		mathmlBuilder: (group, options) => {
			return buildExpressionRow(group.mathml, options);
		}
	});
	var sizeData = function sizeData(str) {
		if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(str)) return {
			number: +str,
			unit: "bp"
		};
		else {
			var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(str);
			if (!match) throw new ParseError("Invalid size: '" + str + "' in \\includegraphics");
			var data = {
				number: +(match[1] + match[2]),
				unit: match[3]
			};
			if (!validUnit(data)) throw new ParseError("Invalid unit: '" + data.unit + "' in \\includegraphics.");
			return data;
		}
	};
	defineFunction({
		type: "includegraphics",
		names: ["\\includegraphics"],
		props: {
			numArgs: 1,
			numOptionalArgs: 1,
			argTypes: ["raw", "url"],
			allowedInText: false
		},
		handler: (_ref, args, optArgs) => {
			var { parser } = _ref;
			var width = {
				number: 0,
				unit: "em"
			};
			var height = {
				number: .9,
				unit: "em"
			};
			var totalheight = {
				number: 0,
				unit: "em"
			};
			var alt = "";
			if (optArgs[0]) {
				var attributes = assertNodeType(optArgs[0], "raw").string.split(",");
				for (var i = 0; i < attributes.length; i++) {
					var keyVal = attributes[i].split("=");
					if (keyVal.length === 2) {
						var str = keyVal[1].trim();
						switch (keyVal[0].trim()) {
							case "alt":
								alt = str;
								break;
							case "width":
								width = sizeData(str);
								break;
							case "height":
								height = sizeData(str);
								break;
							case "totalheight":
								totalheight = sizeData(str);
								break;
							default: throw new ParseError("Invalid key: '" + keyVal[0] + "' in \\includegraphics.");
						}
					}
				}
			}
			var src = assertNodeType(args[0], "url").url;
			if (alt === "") {
				alt = src;
				alt = alt.replace(/^.*[\\/]/, "");
				alt = alt.substring(0, alt.lastIndexOf("."));
			}
			if (!parser.settings.isTrusted({
				command: "\\includegraphics",
				url: src
			})) return parser.formatUnsupportedCmd("\\includegraphics");
			return {
				type: "includegraphics",
				mode: parser.mode,
				alt,
				width,
				height,
				totalheight,
				src
			};
		},
		htmlBuilder: (group, options) => {
			var height = calculateSize(group.height, options);
			var depth = 0;
			if (group.totalheight.number > 0) depth = calculateSize(group.totalheight, options) - height;
			var width = 0;
			if (group.width.number > 0) width = calculateSize(group.width, options);
			var style = { height: makeEm(height + depth) };
			if (width > 0) style.width = makeEm(width);
			if (depth > 0) style.verticalAlign = makeEm(-depth);
			var node = new Img(group.src, group.alt, style);
			node.height = height;
			node.depth = depth;
			return node;
		},
		mathmlBuilder: (group, options) => {
			var node = new MathNode("mglyph", []);
			node.setAttribute("alt", group.alt);
			var height = calculateSize(group.height, options);
			var depth = 0;
			if (group.totalheight.number > 0) {
				depth = calculateSize(group.totalheight, options) - height;
				node.setAttribute("valign", makeEm(-depth));
			}
			node.setAttribute("height", makeEm(height + depth));
			if (group.width.number > 0) {
				var width = calculateSize(group.width, options);
				node.setAttribute("width", makeEm(width));
			}
			node.setAttribute("src", group.src);
			return node;
		}
	});
	defineFunction({
		type: "kern",
		names: [
			"\\kern",
			"\\mkern",
			"\\hskip",
			"\\mskip"
		],
		props: {
			numArgs: 1,
			argTypes: ["size"],
			primitive: true,
			allowedInText: true
		},
		handler(_ref, args) {
			var { parser, funcName } = _ref;
			var size = assertNodeType(args[0], "size");
			if (parser.settings.strict) {
				var mathFunction = funcName[1] === "m";
				var muUnit = size.value.unit === "mu";
				if (mathFunction) {
					if (!muUnit) parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " supports only mu units, " + ("not " + size.value.unit + " units"));
					if (parser.mode !== "math") parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " works only in math mode");
				} else if (muUnit) parser.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + funcName + " doesn't support mu units");
			}
			return {
				type: "kern",
				mode: parser.mode,
				dimension: size.value
			};
		},
		htmlBuilder(group, options) {
			return makeGlue(group.dimension, options);
		},
		mathmlBuilder(group, options) {
			return new SpaceNode(calculateSize(group.dimension, options));
		}
	});
	defineFunction({
		type: "lap",
		names: [
			"\\mathllap",
			"\\mathrlap",
			"\\mathclap"
		],
		props: {
			numArgs: 1,
			allowedInText: true
		},
		handler: (_ref, args) => {
			var { parser, funcName } = _ref;
			var body = args[0];
			return {
				type: "lap",
				mode: parser.mode,
				alignment: funcName.slice(5),
				body
			};
		},
		htmlBuilder: (group, options) => {
			var inner;
			if (group.alignment === "clap") {
				inner = makeSpan([], [buildGroup$1(group.body, options)]);
				inner = makeSpan(["inner"], [inner], options);
			} else inner = makeSpan(["inner"], [buildGroup$1(group.body, options)]);
			var fix = makeSpan(["fix"], []);
			var node = makeSpan([group.alignment], [inner, fix], options);
			var strut = makeSpan(["strut"]);
			strut.style.height = makeEm(node.height + node.depth);
			if (node.depth) strut.style.verticalAlign = makeEm(-node.depth);
			node.children.unshift(strut);
			node = makeSpan(["thinbox"], [node], options);
			return makeSpan(["mord", "vbox"], [node], options);
		},
		mathmlBuilder: (group, options) => {
			var node = new MathNode("mpadded", [buildGroup(group.body, options)]);
			if (group.alignment !== "rlap") {
				var offset = group.alignment === "llap" ? "-1" : "-0.5";
				node.setAttribute("lspace", offset + "width");
			}
			node.setAttribute("width", "0px");
			return node;
		}
	});
	defineFunction({
		type: "styling",
		names: ["\\(", "$"],
		props: {
			numArgs: 0,
			allowedInText: true,
			allowedInMath: false
		},
		handler(_ref, args) {
			var { funcName, parser } = _ref;
			var outerMode = parser.mode;
			parser.switchMode("math");
			var close = funcName === "\\(" ? "\\)" : "$";
			var body = parser.parseExpression(false, close);
			parser.expect(close);
			parser.switchMode(outerMode);
			return {
				type: "styling",
				mode: parser.mode,
				style: "text",
				resetFont: true,
				body
			};
		}
	});
	defineFunction({
		type: "text",
		names: ["\\)", "\\]"],
		props: {
			numArgs: 0,
			allowedInText: true,
			allowedInMath: false
		},
		handler(context, args) {
			throw new ParseError("Mismatched " + context.funcName);
		}
	});
	var chooseMathStyle = (group, options) => {
		switch (options.style.size) {
			case Style$1.DISPLAY.size: return group.display;
			case Style$1.TEXT.size: return group.text;
			case Style$1.SCRIPT.size: return group.script;
			case Style$1.SCRIPTSCRIPT.size: return group.scriptscript;
			default: return group.text;
		}
	};
	defineFunction({
		type: "mathchoice",
		names: ["\\mathchoice"],
		props: {
			numArgs: 4,
			primitive: true
		},
		handler: (_ref, args) => {
			var { parser } = _ref;
			return {
				type: "mathchoice",
				mode: parser.mode,
				display: ordargument(args[0]),
				text: ordargument(args[1]),
				script: ordargument(args[2]),
				scriptscript: ordargument(args[3])
			};
		},
		htmlBuilder: (group, options) => {
			return makeFragment(buildExpression$1(chooseMathStyle(group, options), options, false));
		},
		mathmlBuilder: (group, options) => {
			return buildExpressionRow(chooseMathStyle(group, options), options);
		}
	});
	var assembleSupSub = (base, supGroup, subGroup, options, style, slant, baseShift) => {
		base = makeSpan([], [base]);
		var subIsSingleCharacter = subGroup && isCharacterBox(subGroup);
		var sub;
		var sup;
		if (supGroup) {
			var elem = buildGroup$1(supGroup, options.havingStyle(style.sup()), options);
			sup = {
				elem,
				kern: Math.max(options.fontMetrics().bigOpSpacing1, options.fontMetrics().bigOpSpacing3 - elem.depth)
			};
		}
		if (subGroup) {
			var _elem = buildGroup$1(subGroup, options.havingStyle(style.sub()), options);
			sub = {
				elem: _elem,
				kern: Math.max(options.fontMetrics().bigOpSpacing2, options.fontMetrics().bigOpSpacing4 - _elem.height)
			};
		}
		var finalGroup;
		if (sup && sub) finalGroup = makeVList({
			positionType: "bottom",
			positionData: options.fontMetrics().bigOpSpacing5 + sub.elem.height + sub.elem.depth + sub.kern + base.depth + baseShift,
			children: [
				{
					type: "kern",
					size: options.fontMetrics().bigOpSpacing5
				},
				{
					type: "elem",
					elem: sub.elem,
					marginLeft: makeEm(-slant)
				},
				{
					type: "kern",
					size: sub.kern
				},
				{
					type: "elem",
					elem: base
				},
				{
					type: "kern",
					size: sup.kern
				},
				{
					type: "elem",
					elem: sup.elem,
					marginLeft: makeEm(slant)
				},
				{
					type: "kern",
					size: options.fontMetrics().bigOpSpacing5
				}
			]
		});
		else if (sub) finalGroup = makeVList({
			positionType: "top",
			positionData: base.height - baseShift,
			children: [
				{
					type: "kern",
					size: options.fontMetrics().bigOpSpacing5
				},
				{
					type: "elem",
					elem: sub.elem,
					marginLeft: makeEm(-slant)
				},
				{
					type: "kern",
					size: sub.kern
				},
				{
					type: "elem",
					elem: base
				}
			]
		});
		else if (sup) finalGroup = makeVList({
			positionType: "bottom",
			positionData: base.depth + baseShift,
			children: [
				{
					type: "elem",
					elem: base
				},
				{
					type: "kern",
					size: sup.kern
				},
				{
					type: "elem",
					elem: sup.elem,
					marginLeft: makeEm(slant)
				},
				{
					type: "kern",
					size: options.fontMetrics().bigOpSpacing5
				}
			]
		});
		else return base;
		var parts = [finalGroup];
		if (sub && slant !== 0 && !subIsSingleCharacter) {
			var spacer = makeSpan(["mspace"], [], options);
			spacer.style.marginRight = makeEm(slant);
			parts.unshift(spacer);
		}
		return makeSpan(["mop", "op-limits"], parts, options);
	};
	var noSuccessor = new Set(["\\smallint"]);
	var htmlBuilder$2 = (grp, options) => {
		var supGroup;
		var subGroup;
		var hasLimits = false;
		var group;
		if (grp.type === "supsub") {
			supGroup = grp.sup;
			subGroup = grp.sub;
			group = assertNodeType(grp.base, "op");
			hasLimits = true;
		} else group = assertNodeType(grp, "op");
		var style = options.style;
		var large = false;
		if (style.size === Style$1.DISPLAY.size && group.symbol && !noSuccessor.has(group.name)) large = true;
		var base;
		var symbolItalic;
		if (group.symbol) {
			var fontName = large ? "Size2-Regular" : "Size1-Regular";
			var stash = "";
			if (group.name === "\\oiint" || group.name === "\\oiiint") {
				stash = group.name.slice(1);
				group.name = stash === "oiint" ? "\\iint" : "\\iiint";
			}
			base = makeSymbol(group.name, fontName, "math", options, [
				"mop",
				"op-symbol",
				large ? "large-op" : "small-op"
			]);
			symbolItalic = base.italic;
			if (stash.length > 0) {
				var oval = staticSvg(stash + "Size" + (large ? "2" : "1"), options);
				base = makeVList({
					positionType: "individualShift",
					children: [{
						type: "elem",
						elem: base,
						shift: 0
					}, {
						type: "elem",
						elem: oval,
						shift: large ? .08 : 0
					}]
				});
				group.name = "\\" + stash;
				base.classes.unshift("mop");
				base.italic = symbolItalic;
			}
		} else if (group.body) {
			var inner = buildExpression$1(group.body, options, true);
			if (inner.length === 1 && inner[0] instanceof SymbolNode) {
				base = inner[0];
				base.classes[0] = "mop";
			} else base = makeSpan(["mop"], inner, options);
		} else {
			var output = [];
			for (var i = 1; i < group.name.length; i++) output.push(mathsym(group.name[i], group.mode, options));
			base = makeSpan(["mop"], output, options);
		}
		var baseShift = 0;
		var slant = 0;
		if ((base instanceof SymbolNode || group.name === "\\oiint" || group.name === "\\oiiint") && !group.suppressBaseShift) {
			var _base$italic;
			baseShift = (base.height - base.depth) / 2 - options.fontMetrics().axisHeight;
			slant = (_base$italic = base.italic) != null ? _base$italic : 0;
		}
		if (hasLimits) return assembleSupSub(base, supGroup, subGroup, options, style, slant, baseShift);
		else {
			if (baseShift) {
				base.style.position = "relative";
				base.style.top = makeEm(baseShift);
			}
			return base;
		}
	};
	var mathmlBuilder$1 = (group, options) => {
		var node;
		if (group.symbol) {
			node = new MathNode("mo", [makeText(group.name, group.mode)]);
			if (noSuccessor.has(group.name)) node.setAttribute("largeop", "false");
		} else if (group.body) node = new MathNode("mo", buildExpression(group.body, options));
		else {
			node = new MathNode("mi", [new TextNode(group.name.slice(1))]);
			var operator = new MathNode("mo", [makeText("⁡", "text")]);
			if (group.parentIsSupSub) node = new MathNode("mrow", [node, operator]);
			else node = newDocumentFragment([node, operator]);
		}
		return node;
	};
	var singleCharBigOps = {
		"∏": "\\prod",
		"∐": "\\coprod",
		"∑": "\\sum",
		"⋀": "\\bigwedge",
		"⋁": "\\bigvee",
		"⋂": "\\bigcap",
		"⋃": "\\bigcup",
		"⨀": "\\bigodot",
		"⨁": "\\bigoplus",
		"⨂": "\\bigotimes",
		"⨄": "\\biguplus",
		"⨆": "\\bigsqcup"
	};
	defineFunction({
		type: "op",
		names: [
			"\\coprod",
			"\\bigvee",
			"\\bigwedge",
			"\\biguplus",
			"\\bigcap",
			"\\bigcup",
			"\\intop",
			"\\prod",
			"\\sum",
			"\\bigotimes",
			"\\bigoplus",
			"\\bigodot",
			"\\bigsqcup",
			"\\smallint",
			"∏",
			"∐",
			"∑",
			"⋀",
			"⋁",
			"⋂",
			"⋃",
			"⨀",
			"⨁",
			"⨂",
			"⨄",
			"⨆"
		],
		props: { numArgs: 0 },
		handler: (_ref, args) => {
			var { parser, funcName } = _ref;
			var fName = funcName;
			if (fName.length === 1) fName = singleCharBigOps[fName];
			return {
				type: "op",
				mode: parser.mode,
				limits: true,
				parentIsSupSub: false,
				symbol: true,
				name: fName
			};
		},
		htmlBuilder: htmlBuilder$2,
		mathmlBuilder: mathmlBuilder$1
	});
	defineFunction({
		type: "op",
		names: ["\\mathop"],
		props: {
			numArgs: 1,
			primitive: true
		},
		handler: (_ref2, args) => {
			var { parser } = _ref2;
			var body = args[0];
			return {
				type: "op",
				mode: parser.mode,
				limits: false,
				parentIsSupSub: false,
				symbol: false,
				body: ordargument(body)
			};
		},
		htmlBuilder: htmlBuilder$2,
		mathmlBuilder: mathmlBuilder$1
	});
	var singleCharIntegrals = {
		"∫": "\\int",
		"∬": "\\iint",
		"∭": "\\iiint",
		"∮": "\\oint",
		"∯": "\\oiint",
		"∰": "\\oiiint"
	};
	defineFunction({
		type: "op",
		names: [
			"\\arcsin",
			"\\arccos",
			"\\arctan",
			"\\arctg",
			"\\arcctg",
			"\\arg",
			"\\ch",
			"\\cos",
			"\\cosec",
			"\\cosh",
			"\\cot",
			"\\cotg",
			"\\coth",
			"\\csc",
			"\\ctg",
			"\\cth",
			"\\deg",
			"\\dim",
			"\\exp",
			"\\hom",
			"\\ker",
			"\\lg",
			"\\ln",
			"\\log",
			"\\sec",
			"\\sin",
			"\\sinh",
			"\\sh",
			"\\tan",
			"\\tanh",
			"\\tg",
			"\\th"
		],
		props: { numArgs: 0 },
		handler(_ref3) {
			var { parser, funcName } = _ref3;
			return {
				type: "op",
				mode: parser.mode,
				limits: false,
				parentIsSupSub: false,
				symbol: false,
				name: funcName
			};
		},
		htmlBuilder: htmlBuilder$2,
		mathmlBuilder: mathmlBuilder$1
	});
	defineFunction({
		type: "op",
		names: [
			"\\det",
			"\\gcd",
			"\\inf",
			"\\lim",
			"\\max",
			"\\min",
			"\\Pr",
			"\\sup"
		],
		props: { numArgs: 0 },
		handler(_ref4) {
			var { parser, funcName } = _ref4;
			return {
				type: "op",
				mode: parser.mode,
				limits: true,
				parentIsSupSub: false,
				symbol: false,
				name: funcName
			};
		},
		htmlBuilder: htmlBuilder$2,
		mathmlBuilder: mathmlBuilder$1
	});
	defineFunction({
		type: "op",
		names: [
			"\\int",
			"\\iint",
			"\\iiint",
			"\\oint",
			"\\oiint",
			"\\oiiint",
			"∫",
			"∬",
			"∭",
			"∮",
			"∯",
			"∰"
		],
		props: {
			numArgs: 0,
			allowedInArgument: true
		},
		handler(_ref5) {
			var { parser, funcName } = _ref5;
			var fName = funcName;
			if (fName.length === 1) fName = singleCharIntegrals[fName];
			return {
				type: "op",
				mode: parser.mode,
				limits: false,
				parentIsSupSub: false,
				symbol: true,
				name: fName
			};
		},
		htmlBuilder: htmlBuilder$2,
		mathmlBuilder: mathmlBuilder$1
	});
	var htmlBuilder$1 = (grp, options) => {
		var supGroup;
		var subGroup;
		var hasLimits = false;
		var group;
		if (grp.type === "supsub") {
			supGroup = grp.sup;
			subGroup = grp.sub;
			group = assertNodeType(grp.base, "operatorname");
			hasLimits = true;
		} else group = assertNodeType(grp, "operatorname");
		var base;
		if (group.body.length > 0) {
			var expression = buildExpression$1(group.body.map((child) => {
				var childText = "text" in child ? child.text : void 0;
				if (typeof childText === "string") return {
					type: "textord",
					mode: child.mode,
					text: childText
				};
				else return child;
			}), options.withFont("mathrm"), true);
			for (var i = 0; i < expression.length; i++) {
				var child = expression[i];
				if (child instanceof SymbolNode) child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
			}
			base = makeSpan(["mop"], expression, options);
		} else base = makeSpan(["mop"], [], options);
		if (hasLimits) return assembleSupSub(base, supGroup, subGroup, options, options.style, 0, 0);
		else return base;
	};
	var mathmlBuilder = (group, options) => {
		var expression = buildExpression(group.body, options.withFont("mathrm"));
		var isAllString = true;
		for (var i = 0; i < expression.length; i++) {
			var node = expression[i];
			if (node instanceof SpaceNode);
			else if (node instanceof MathNode) switch (node.type) {
				case "mi":
				case "mn":
				case "mspace":
				case "mtext": break;
				case "mo":
					var child = node.children[0];
					if (node.children.length === 1 && child instanceof TextNode) child.text = child.text.replace(/\u2212/, "-").replace(/\u2217/, "*");
					else isAllString = false;
					break;
				default: isAllString = false;
			}
			else isAllString = false;
		}
		if (isAllString) expression = [new TextNode(expression.map((node) => node.toText()).join(""))];
		var identifier = new MathNode("mi", expression);
		identifier.setAttribute("mathvariant", "normal");
		var operator = new MathNode("mo", [makeText("⁡", "text")]);
		if (group.parentIsSupSub) return new MathNode("mrow", [identifier, operator]);
		else return newDocumentFragment([identifier, operator]);
	};
	defineFunction({
		type: "operatorname",
		names: ["\\operatorname@", "\\operatornamewithlimits"],
		props: { numArgs: 1 },
		handler: (_ref, args) => {
			var { parser, funcName } = _ref;
			var body = args[0];
			return {
				type: "operatorname",
				mode: parser.mode,
				body: ordargument(body),
				alwaysHandleSupSub: funcName === "\\operatornamewithlimits",
				limits: false,
				parentIsSupSub: false
			};
		},
		htmlBuilder: htmlBuilder$1,
		mathmlBuilder
	});
	defineMacro("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
	defineFunctionBuilders({
		type: "ordgroup",
		htmlBuilder(group, options) {
			if (group.semisimple) return makeFragment(buildExpression$1(group.body, options, false));
			return makeSpan(["mord"], buildExpression$1(group.body, options, true), options);
		},
		mathmlBuilder(group, options) {
			return buildExpressionRow(group.body, options, true);
		}
	});
	defineFunction({
		type: "overline",
		names: ["\\overline"],
		props: { numArgs: 1 },
		handler(_ref, args) {
			var { parser } = _ref;
			var body = args[0];
			return {
				type: "overline",
				mode: parser.mode,
				body
			};
		},
		htmlBuilder(group, options) {
			var innerGroup = buildGroup$1(group.body, options.havingCrampedStyle());
			var line = makeLineSpan("overline-line", options);
			var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
			return makeSpan(["mord", "overline"], [makeVList({
				positionType: "firstBaseline",
				children: [
					{
						type: "elem",
						elem: innerGroup
					},
					{
						type: "kern",
						size: 3 * defaultRuleThickness
					},
					{
						type: "elem",
						elem: line
					},
					{
						type: "kern",
						size: defaultRuleThickness
					}
				]
			})], options);
		},
		mathmlBuilder(group, options) {
			var operator = new MathNode("mo", [new TextNode("‾")]);
			operator.setAttribute("stretchy", "true");
			var node = new MathNode("mover", [buildGroup(group.body, options), operator]);
			node.setAttribute("accent", "true");
			return node;
		}
	});
	defineFunction({
		type: "phantom",
		names: ["\\phantom"],
		props: {
			numArgs: 1,
			allowedInText: true
		},
		handler: (_ref, args) => {
			var { parser } = _ref;
			var body = args[0];
			return {
				type: "phantom",
				mode: parser.mode,
				body: ordargument(body)
			};
		},
		htmlBuilder: (group, options) => {
			return makeFragment(buildExpression$1(group.body, options.withPhantom(), false));
		},
		mathmlBuilder: (group, options) => {
			return new MathNode("mphantom", buildExpression(group.body, options));
		}
	});
	defineMacro("\\hphantom", "\\smash{\\phantom{#1}}");
	defineFunction({
		type: "vphantom",
		names: ["\\vphantom"],
		props: {
			numArgs: 1,
			allowedInText: true
		},
		handler: (_ref2, args) => {
			var { parser } = _ref2;
			var body = args[0];
			return {
				type: "vphantom",
				mode: parser.mode,
				body
			};
		},
		htmlBuilder: (group, options) => {
			return makeSpan(["mord", "rlap"], [makeSpan(["inner"], [buildGroup$1(group.body, options.withPhantom())]), makeSpan(["fix"], [])], options);
		},
		mathmlBuilder: (group, options) => {
			var node = new MathNode("mpadded", [new MathNode("mphantom", buildExpression(ordargument(group.body), options))]);
			node.setAttribute("width", "0px");
			return node;
		}
	});
	defineFunction({
		type: "raisebox",
		names: ["\\raisebox"],
		props: {
			numArgs: 2,
			argTypes: ["size", "hbox"],
			allowedInText: true
		},
		handler(_ref, args) {
			var { parser } = _ref;
			var amount = assertNodeType(args[0], "size").value;
			var body = args[1];
			return {
				type: "raisebox",
				mode: parser.mode,
				dy: amount,
				body
			};
		},
		htmlBuilder(group, options) {
			var body = buildGroup$1(group.body, options);
			return makeVList({
				positionType: "shift",
				positionData: -calculateSize(group.dy, options),
				children: [{
					type: "elem",
					elem: body
				}]
			});
		},
		mathmlBuilder(group, options) {
			var node = new MathNode("mpadded", [buildGroup(group.body, options)]);
			var dy = group.dy.number + group.dy.unit;
			node.setAttribute("voffset", dy);
			return node;
		}
	});
	defineFunction({
		type: "internal",
		names: ["\\relax"],
		props: {
			numArgs: 0,
			allowedInText: true,
			allowedInArgument: true
		},
		handler(_ref) {
			var { parser } = _ref;
			return {
				type: "internal",
				mode: parser.mode
			};
		}
	});
	defineFunction({
		type: "rule",
		names: ["\\rule"],
		props: {
			numArgs: 2,
			numOptionalArgs: 1,
			allowedInText: true,
			allowedInMath: true,
			argTypes: [
				"size",
				"size",
				"size"
			]
		},
		handler(_ref, args, optArgs) {
			var { parser } = _ref;
			var shift = optArgs[0];
			var width = assertNodeType(args[0], "size");
			var height = assertNodeType(args[1], "size");
			return {
				type: "rule",
				mode: parser.mode,
				shift: shift && assertNodeType(shift, "size").value,
				width: width.value,
				height: height.value
			};
		},
		htmlBuilder(group, options) {
			var rule = makeSpan(["mord", "rule"], [], options);
			var width = calculateSize(group.width, options);
			var height = calculateSize(group.height, options);
			var shift = group.shift ? calculateSize(group.shift, options) : 0;
			rule.style.borderRightWidth = makeEm(width);
			rule.style.borderTopWidth = makeEm(height);
			rule.style.bottom = makeEm(shift);
			rule.width = width;
			rule.height = height + shift;
			rule.depth = -shift;
			rule.maxFontSize = height * 1.125 * options.sizeMultiplier;
			return rule;
		},
		mathmlBuilder(group, options) {
			var width = calculateSize(group.width, options);
			var height = calculateSize(group.height, options);
			var shift = group.shift ? calculateSize(group.shift, options) : 0;
			var color = options.color && options.getColor() || "black";
			var rule = new MathNode("mspace");
			rule.setAttribute("mathbackground", color);
			rule.setAttribute("width", makeEm(width));
			rule.setAttribute("height", makeEm(height));
			var wrapper = new MathNode("mpadded", [rule]);
			if (shift >= 0) wrapper.setAttribute("height", makeEm(shift));
			else {
				wrapper.setAttribute("height", makeEm(shift));
				wrapper.setAttribute("depth", makeEm(-shift));
			}
			wrapper.setAttribute("voffset", makeEm(shift));
			return wrapper;
		}
	});
	function sizingGroup(value, options, baseOptions) {
		var inner = buildExpression$1(value, options, false);
		var multiplier = options.sizeMultiplier / baseOptions.sizeMultiplier;
		for (var i = 0; i < inner.length; i++) {
			var pos = inner[i].classes.indexOf("sizing");
			if (pos < 0) Array.prototype.push.apply(inner[i].classes, options.sizingClasses(baseOptions));
			else if (inner[i].classes[pos + 1] === "reset-size" + options.size) inner[i].classes[pos + 1] = "reset-size" + baseOptions.size;
			inner[i].height *= multiplier;
			inner[i].depth *= multiplier;
		}
		return makeFragment(inner);
	}
	var sizeFuncs = [
		"\\tiny",
		"\\sixptsize",
		"\\scriptsize",
		"\\footnotesize",
		"\\small",
		"\\normalsize",
		"\\large",
		"\\Large",
		"\\LARGE",
		"\\huge",
		"\\Huge"
	];
	var htmlBuilder = (group, options) => {
		var newOptions = options.havingSize(group.size);
		return sizingGroup(group.body, newOptions, options);
	};
	defineFunction({
		type: "sizing",
		names: sizeFuncs,
		props: {
			numArgs: 0,
			allowedInText: true
		},
		handler: (_ref, args) => {
			var { breakOnTokenText, funcName, parser } = _ref;
			var body = parser.parseExpression(false, breakOnTokenText);
			return {
				type: "sizing",
				mode: parser.mode,
				size: sizeFuncs.indexOf(funcName) + 1,
				body
			};
		},
		htmlBuilder,
		mathmlBuilder: (group, options) => {
			var newOptions = options.havingSize(group.size);
			var node = new MathNode("mstyle", buildExpression(group.body, newOptions));
			node.setAttribute("mathsize", makeEm(newOptions.sizeMultiplier));
			return node;
		}
	});
	defineFunction({
		type: "smash",
		names: ["\\smash"],
		props: {
			numArgs: 1,
			numOptionalArgs: 1,
			allowedInText: true
		},
		handler: (_ref, args, optArgs) => {
			var { parser } = _ref;
			var smashHeight = false;
			var smashDepth = false;
			var tbArg = optArgs[0] && assertNodeType(optArgs[0], "ordgroup");
			if (tbArg) {
				var letter;
				for (var i = 0; i < tbArg.body.length; ++i) {
					var node = tbArg.body[i];
					letter = assertSymbolNodeType(node).text;
					if (letter === "t") smashHeight = true;
					else if (letter === "b") smashDepth = true;
					else {
						smashHeight = false;
						smashDepth = false;
						break;
					}
				}
			} else {
				smashHeight = true;
				smashDepth = true;
			}
			var body = args[0];
			return {
				type: "smash",
				mode: parser.mode,
				body,
				smashHeight,
				smashDepth
			};
		},
		htmlBuilder: (group, options) => {
			var node = makeSpan([], [buildGroup$1(group.body, options)]);
			if (!group.smashHeight && !group.smashDepth) return node;
			if (group.smashHeight) node.height = 0;
			if (group.smashDepth) node.depth = 0;
			if (group.smashHeight && group.smashDepth) return makeSpan(["mord", "smash"], [node], options);
			if (node.children) for (var i = 0; i < node.children.length; i++) {
				if (group.smashHeight) node.children[i].height = 0;
				if (group.smashDepth) node.children[i].depth = 0;
			}
			return makeSpan(["mord"], [makeVList({
				positionType: "firstBaseline",
				children: [{
					type: "elem",
					elem: node
				}]
			})], options);
		},
		mathmlBuilder: (group, options) => {
			var node = new MathNode("mpadded", [buildGroup(group.body, options)]);
			if (group.smashHeight) node.setAttribute("height", "0px");
			if (group.smashDepth) node.setAttribute("depth", "0px");
			return node;
		}
	});
	defineFunction({
		type: "sqrt",
		names: ["\\sqrt"],
		props: {
			numArgs: 1,
			numOptionalArgs: 1
		},
		handler(_ref, args, optArgs) {
			var { parser } = _ref;
			var index = optArgs[0];
			var body = args[0];
			return {
				type: "sqrt",
				mode: parser.mode,
				body,
				index
			};
		},
		htmlBuilder(group, options) {
			var inner = buildGroup$1(group.body, options.havingCrampedStyle());
			if (inner.height === 0) inner.height = options.fontMetrics().xHeight;
			inner = wrapFragment(inner, options);
			var theta = options.fontMetrics().defaultRuleThickness;
			var phi = theta;
			if (options.style.id < Style$1.TEXT.id) phi = options.fontMetrics().xHeight;
			var lineClearance = theta + phi / 4;
			var { span: img, ruleWidth, advanceWidth } = makeSqrtImage(inner.height + inner.depth + lineClearance + theta, options);
			var delimDepth = img.height - ruleWidth;
			if (delimDepth > inner.height + inner.depth + lineClearance) lineClearance = (lineClearance + delimDepth - inner.height - inner.depth) / 2;
			var imgShift = img.height - inner.height - lineClearance - ruleWidth;
			inner.style.paddingLeft = makeEm(advanceWidth);
			var body = makeVList({
				positionType: "firstBaseline",
				children: [
					{
						type: "elem",
						elem: inner,
						wrapperClasses: ["svg-align"]
					},
					{
						type: "kern",
						size: -(inner.height + imgShift)
					},
					{
						type: "elem",
						elem: img
					},
					{
						type: "kern",
						size: ruleWidth
					}
				]
			});
			if (!group.index) return makeSpan(["mord", "sqrt"], [body], options);
			else {
				var newOptions = options.havingStyle(Style$1.SCRIPTSCRIPT);
				var rootm = buildGroup$1(group.index, newOptions, options);
				return makeSpan(["mord", "sqrt"], [makeSpan(["root"], [makeVList({
					positionType: "shift",
					positionData: -(.6 * (body.height - body.depth)),
					children: [{
						type: "elem",
						elem: rootm
					}]
				})]), body], options);
			}
		},
		mathmlBuilder(group, options) {
			var { body, index } = group;
			return index ? new MathNode("mroot", [buildGroup(body, options), buildGroup(index, options)]) : new MathNode("msqrt", [buildGroup(body, options)]);
		}
	});
	var styleMap = {
		"display": Style$1.DISPLAY,
		"text": Style$1.TEXT,
		"script": Style$1.SCRIPT,
		"scriptscript": Style$1.SCRIPTSCRIPT
	};
	function isStyleStr(s) {
		return s in styleMap;
	}
	defineFunction({
		type: "styling",
		names: [
			"\\displaystyle",
			"\\textstyle",
			"\\scriptstyle",
			"\\scriptscriptstyle"
		],
		props: {
			numArgs: 0,
			allowedInText: true,
			primitive: true
		},
		handler(_ref, args) {
			var { breakOnTokenText, funcName, parser } = _ref;
			var body = parser.parseExpression(true, breakOnTokenText);
			var style = funcName.slice(1, funcName.length - 5);
			if (!isStyleStr(style)) throw new Error("Unknown style: " + style);
			return {
				type: "styling",
				mode: parser.mode,
				style,
				body
			};
		},
		htmlBuilder(group, options) {
			var newStyle = styleMap[group.style];
			var newOptions = options.havingStyle(newStyle);
			if (group.resetFont) newOptions = newOptions.withFont("");
			return sizingGroup(group.body, newOptions, options);
		},
		mathmlBuilder(group, options) {
			var newStyle = styleMap[group.style];
			var newOptions = options.havingStyle(newStyle);
			if (group.resetFont) newOptions = newOptions.withFont("");
			var node = new MathNode("mstyle", buildExpression(group.body, newOptions));
			var attr = {
				"display": ["0", "true"],
				"text": ["0", "false"],
				"script": ["1", "false"],
				"scriptscript": ["2", "false"]
			}[group.style];
			node.setAttribute("scriptlevel", attr[0]);
			node.setAttribute("displaystyle", attr[1]);
			return node;
		}
	});
	var htmlBuilderDelegate = function htmlBuilderDelegate(group, options) {
		var base = group.base;
		if (!base) return null;
		else if (base.type === "op") return base.limits && (options.style.size === Style$1.DISPLAY.size || base.alwaysHandleSupSub) ? htmlBuilder$2 : null;
		else if (base.type === "operatorname") return base.alwaysHandleSupSub && (options.style.size === Style$1.DISPLAY.size || base.limits) ? htmlBuilder$1 : null;
		else if (base.type === "accent") return isCharacterBox(base.base) ? htmlBuilder$a : null;
		else if (base.type === "horizBrace") return !group.sub === base.isOver ? htmlBuilder$3 : null;
		else return null;
	};
	defineFunctionBuilders({
		type: "supsub",
		htmlBuilder(group, options) {
			var builderDelegate = htmlBuilderDelegate(group, options);
			if (builderDelegate) return builderDelegate(group, options);
			var { base: valueBase, sup: valueSup, sub: valueSub } = group;
			var base = buildGroup$1(valueBase, options);
			var supm;
			var subm;
			var metrics = options.fontMetrics();
			var supShift = 0;
			var subShift = 0;
			var isCharBox = valueBase && isCharacterBox(valueBase);
			if (valueSup) {
				var newOptions = options.havingStyle(options.style.sup());
				supm = buildGroup$1(valueSup, newOptions, options);
				if (!isCharBox) supShift = base.height - newOptions.fontMetrics().supDrop * newOptions.sizeMultiplier / options.sizeMultiplier;
			}
			if (valueSub) {
				var _newOptions = options.havingStyle(options.style.sub());
				subm = buildGroup$1(valueSub, _newOptions, options);
				if (!isCharBox) subShift = base.depth + _newOptions.fontMetrics().subDrop * _newOptions.sizeMultiplier / options.sizeMultiplier;
			}
			var minSupShift;
			if (options.style === Style$1.DISPLAY) minSupShift = metrics.sup1;
			else if (options.style.cramped) minSupShift = metrics.sup3;
			else minSupShift = metrics.sup2;
			var multiplier = options.sizeMultiplier;
			var marginRight = makeEm(.5 / metrics.ptPerEm / multiplier);
			var marginLeft = null;
			if (subm) {
				var isOiint = group.base && group.base.type === "op" && group.base.name && (group.base.name === "\\oiint" || group.base.name === "\\oiiint");
				if (base instanceof SymbolNode || isOiint) {
					var _base$italic;
					marginLeft = makeEm(-((_base$italic = base.italic) != null ? _base$italic : 0));
				}
			}
			var supsub;
			if (supm && subm) {
				supShift = Math.max(supShift, minSupShift, supm.depth + .25 * metrics.xHeight);
				subShift = Math.max(subShift, metrics.sub2);
				var maxWidth = 4 * metrics.defaultRuleThickness;
				if (supShift - supm.depth - (subm.height - subShift) < maxWidth) {
					subShift = maxWidth - (supShift - supm.depth) + subm.height;
					var psi = .8 * metrics.xHeight - (supShift - supm.depth);
					if (psi > 0) {
						supShift += psi;
						subShift -= psi;
					}
				}
				supsub = makeVList({
					positionType: "individualShift",
					children: [{
						type: "elem",
						elem: subm,
						shift: subShift,
						marginRight,
						marginLeft
					}, {
						type: "elem",
						elem: supm,
						shift: -supShift,
						marginRight
					}]
				});
			} else if (subm) {
				subShift = Math.max(subShift, metrics.sub1, subm.height - .8 * metrics.xHeight);
				supsub = makeVList({
					positionType: "shift",
					positionData: subShift,
					children: [{
						type: "elem",
						elem: subm,
						marginLeft,
						marginRight
					}]
				});
			} else if (supm) {
				supShift = Math.max(supShift, minSupShift, supm.depth + .25 * metrics.xHeight);
				supsub = makeVList({
					positionType: "shift",
					positionData: -supShift,
					children: [{
						type: "elem",
						elem: supm,
						marginRight
					}]
				});
			} else throw new Error("supsub must have either sup or sub.");
			return makeSpan([getTypeOfDomTree(base, "right") || "mord"], [base, makeSpan(["msupsub"], [supsub])], options);
		},
		mathmlBuilder(group, options) {
			var isBrace = false;
			var isOver;
			var isSup;
			if (group.base && group.base.type === "horizBrace") {
				isSup = !!group.sup;
				if (isSup === group.base.isOver) {
					isBrace = true;
					isOver = group.base.isOver;
				}
			}
			if (group.base && (group.base.type === "op" || group.base.type === "operatorname")) group.base.parentIsSupSub = true;
			var children = [buildGroup(group.base, options)];
			if (group.sub) children.push(buildGroup(group.sub, options));
			if (group.sup) children.push(buildGroup(group.sup, options));
			var nodeType;
			if (isBrace) nodeType = isOver ? "mover" : "munder";
			else if (!group.sub) {
				var base = group.base;
				if (base && base.type === "op" && base.limits && (options.style === Style$1.DISPLAY || base.alwaysHandleSupSub)) nodeType = "mover";
				else if (base && base.type === "operatorname" && base.alwaysHandleSupSub && (base.limits || options.style === Style$1.DISPLAY)) nodeType = "mover";
				else nodeType = "msup";
			} else if (!group.sup) {
				var _base = group.base;
				if (_base && _base.type === "op" && _base.limits && (options.style === Style$1.DISPLAY || _base.alwaysHandleSupSub)) nodeType = "munder";
				else if (_base && _base.type === "operatorname" && _base.alwaysHandleSupSub && (_base.limits || options.style === Style$1.DISPLAY)) nodeType = "munder";
				else nodeType = "msub";
			} else {
				var _base2 = group.base;
				if (_base2 && _base2.type === "op" && _base2.limits && options.style === Style$1.DISPLAY) nodeType = "munderover";
				else if (_base2 && _base2.type === "operatorname" && _base2.alwaysHandleSupSub && (options.style === Style$1.DISPLAY || _base2.limits)) nodeType = "munderover";
				else nodeType = "msubsup";
			}
			return new MathNode(nodeType, children);
		}
	});
	defineFunctionBuilders({
		type: "atom",
		htmlBuilder(group, options) {
			return mathsym(group.text, group.mode, options, ["m" + group.family]);
		},
		mathmlBuilder(group, options) {
			var node = new MathNode("mo", [makeText(group.text, group.mode)]);
			if (group.family === "bin") {
				var variant = getVariant(group, options);
				if (variant === "bold-italic") node.setAttribute("mathvariant", variant);
			} else if (group.family === "punct") node.setAttribute("separator", "true");
			else if (group.family === "open" || group.family === "close") node.setAttribute("stretchy", "false");
			return node;
		}
	});
	var defaultVariant = {
		"mi": "italic",
		"mn": "normal",
		"mtext": "normal"
	};
	defineFunctionBuilders({
		type: "mathord",
		htmlBuilder(group, options) {
			return makeOrd(group, options, "mathord");
		},
		mathmlBuilder(group, options) {
			var node = new MathNode("mi", [makeText(group.text, group.mode, options)]);
			var variant = getVariant(group, options) || "italic";
			if (variant !== defaultVariant[node.type]) node.setAttribute("mathvariant", variant);
			return node;
		}
	});
	defineFunctionBuilders({
		type: "textord",
		htmlBuilder(group, options) {
			return makeOrd(group, options, "textord");
		},
		mathmlBuilder(group, options) {
			var text = makeText(group.text, group.mode, options);
			var variant = getVariant(group, options) || "normal";
			var node;
			if (group.mode === "text") node = new MathNode("mtext", [text]);
			else if (/[0-9]/.test(group.text)) node = new MathNode("mn", [text]);
			else if (group.text === "\\prime") node = new MathNode("mo", [text]);
			else node = new MathNode("mi", [text]);
			if (variant !== defaultVariant[node.type]) node.setAttribute("mathvariant", variant);
			return node;
		}
	});
	var cssSpace = {
		"\\nobreak": "nobreak",
		"\\allowbreak": "allowbreak"
	};
	var regularSpace = {
		" ": {},
		"\\ ": {},
		"~": { className: "nobreak" },
		"\\space": {},
		"\\nobreakspace": { className: "nobreak" }
	};
	defineFunctionBuilders({
		type: "spacing",
		htmlBuilder(group, options) {
			if (regularSpace.hasOwnProperty(group.text)) {
				var className = regularSpace[group.text].className || "";
				if (group.mode === "text") {
					var ord = makeOrd(group, options, "textord");
					ord.classes.push(className);
					return ord;
				} else return makeSpan(["mspace", className], [mathsym(group.text, group.mode, options)], options);
			} else if (cssSpace.hasOwnProperty(group.text)) return makeSpan(["mspace", cssSpace[group.text]], [], options);
			else throw new ParseError("Unknown type of space \"" + group.text + "\"");
		},
		mathmlBuilder(group, options) {
			var node;
			if (regularSpace.hasOwnProperty(group.text)) node = new MathNode("mtext", [new TextNode("\xA0")]);
			else if (cssSpace.hasOwnProperty(group.text)) return new MathNode("mspace");
			else throw new ParseError("Unknown type of space \"" + group.text + "\"");
			return node;
		}
	});
	var pad = () => {
		var padNode = new MathNode("mtd", []);
		padNode.setAttribute("width", "50%");
		return padNode;
	};
	defineFunctionBuilders({
		type: "tag",
		mathmlBuilder(group, options) {
			var table = new MathNode("mtable", [new MathNode("mtr", [
				pad(),
				new MathNode("mtd", [buildExpressionRow(group.body, options)]),
				pad(),
				new MathNode("mtd", [buildExpressionRow(group.tag, options)])
			])]);
			table.setAttribute("width", "100%");
			return table;
		}
	});
	var textFontFamilies = {
		"\\text": void 0,
		"\\textrm": "textrm",
		"\\textsf": "textsf",
		"\\texttt": "texttt",
		"\\textnormal": "textrm"
	};
	var textFontWeights = {
		"\\textbf": "textbf",
		"\\textmd": "textmd"
	};
	var textFontShapes = {
		"\\textit": "textit",
		"\\textup": "textup"
	};
	var optionsWithFont = (group, options) => {
		var font = group.font;
		if (!font) return options;
		else if (textFontFamilies[font]) return options.withTextFontFamily(textFontFamilies[font]);
		else if (textFontWeights[font]) return options.withTextFontWeight(textFontWeights[font]);
		else if (font === "\\emph") return options.fontShape === "textit" ? options.withTextFontShape("textup") : options.withTextFontShape("textit");
		return options.withTextFontShape(textFontShapes[font]);
	};
	defineFunction({
		type: "text",
		names: [
			"\\text",
			"\\textrm",
			"\\textsf",
			"\\texttt",
			"\\textnormal",
			"\\textbf",
			"\\textmd",
			"\\textit",
			"\\textup",
			"\\emph"
		],
		props: {
			numArgs: 1,
			argTypes: ["text"],
			allowedInArgument: true,
			allowedInText: true
		},
		handler(_ref, args) {
			var { parser, funcName } = _ref;
			var body = args[0];
			return {
				type: "text",
				mode: parser.mode,
				body: ordargument(body),
				font: funcName
			};
		},
		htmlBuilder(group, options) {
			var newOptions = optionsWithFont(group, options);
			return makeSpan(["mord", "text"], buildExpression$1(group.body, newOptions, true), newOptions);
		},
		mathmlBuilder(group, options) {
			var newOptions = optionsWithFont(group, options);
			return buildExpressionRow(group.body, newOptions);
		}
	});
	defineFunction({
		type: "underline",
		names: ["\\underline"],
		props: {
			numArgs: 1,
			allowedInText: true
		},
		handler(_ref, args) {
			var { parser } = _ref;
			return {
				type: "underline",
				mode: parser.mode,
				body: args[0]
			};
		},
		htmlBuilder(group, options) {
			var innerGroup = buildGroup$1(group.body, options);
			var line = makeLineSpan("underline-line", options);
			var defaultRuleThickness = options.fontMetrics().defaultRuleThickness;
			return makeSpan(["mord", "underline"], [makeVList({
				positionType: "top",
				positionData: innerGroup.height,
				children: [
					{
						type: "kern",
						size: defaultRuleThickness
					},
					{
						type: "elem",
						elem: line
					},
					{
						type: "kern",
						size: 3 * defaultRuleThickness
					},
					{
						type: "elem",
						elem: innerGroup
					}
				]
			})], options);
		},
		mathmlBuilder(group, options) {
			var operator = new MathNode("mo", [new TextNode("‾")]);
			operator.setAttribute("stretchy", "true");
			var node = new MathNode("munder", [buildGroup(group.body, options), operator]);
			node.setAttribute("accentunder", "true");
			return node;
		}
	});
	defineFunction({
		type: "vcenter",
		names: ["\\vcenter"],
		props: {
			numArgs: 1,
			argTypes: ["original"],
			allowedInText: false
		},
		handler(_ref, args) {
			var { parser } = _ref;
			return {
				type: "vcenter",
				mode: parser.mode,
				body: args[0]
			};
		},
		htmlBuilder(group, options) {
			var body = buildGroup$1(group.body, options);
			var axisHeight = options.fontMetrics().axisHeight;
			return makeVList({
				positionType: "shift",
				positionData: .5 * (body.height - axisHeight - (body.depth + axisHeight)),
				children: [{
					type: "elem",
					elem: body
				}]
			});
		},
		mathmlBuilder(group, options) {
			return new MathNode("mrow", [new MathNode("mpadded", [buildGroup(group.body, options)], ["vcenter"])]);
		}
	});
	defineFunction({
		type: "verb",
		names: ["\\verb"],
		props: {
			numArgs: 0,
			allowedInText: true
		},
		handler(context, args, optArgs) {
			throw new ParseError("\\verb ended by end of line instead of matching delimiter");
		},
		htmlBuilder(group, options) {
			var text = makeVerb(group);
			var body = [];
			var newOptions = options.havingStyle(options.style.text());
			for (var i = 0; i < text.length; i++) {
				var c = text[i];
				if (c === "~") c = "\\textasciitilde";
				body.push(makeSymbol(c, "Typewriter-Regular", group.mode, newOptions, ["mord", "texttt"]));
			}
			return makeSpan(["mord", "text"].concat(newOptions.sizingClasses(options)), tryCombineChars(body), newOptions);
		},
		mathmlBuilder(group, options) {
			var node = new MathNode("mtext", [new TextNode(makeVerb(group))]);
			node.setAttribute("mathvariant", "monospace");
			return node;
		}
	});
	var makeVerb = (group) => group.body.replace(/ /g, group.star ? "␣" : "\xA0");
	var functions = _functions;
	var spaceRegexString = "[ \r\n	]";
	var controlWordRegexString = "\\\\[a-zA-Z@]+";
	var controlSymbolRegexString = "\\\\[^\ud800-\udfff]";
	var controlWordWhitespaceRegexString = "(" + controlWordRegexString + ")" + spaceRegexString + "*";
	var controlSpaceRegexString = "\\\\(\n|[ \r	]+\n?)[ \r	]*";
	var combiningDiacriticalMarkString = "[̀-ͯ]";
	var combiningDiacriticalMarksEndRegex = new RegExp(combiningDiacriticalMarkString + "+$");
	var tokenRegexString = "(" + spaceRegexString + "+)|" + (controlSpaceRegexString + "|") + "([!-\\[\\]-‧‪-퟿豈-￿]" + (combiningDiacriticalMarkString + "*") + "|[\ud800-\udbff][\udc00-\udfff]" + (combiningDiacriticalMarkString + "*") + "|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + ("|" + controlWordWhitespaceRegexString) + ("|" + controlSymbolRegexString + ")");
	var Lexer = class {
		constructor(input, settings) {
			this.input = void 0;
			this.settings = void 0;
			this.tokenRegex = void 0;
			this.catcodes = void 0;
			this.input = input;
			this.settings = settings;
			this.tokenRegex = new RegExp(tokenRegexString, "g");
			this.catcodes = {
				"%": 14,
				"~": 13
			};
		}
		setCatcode(char, code) {
			this.catcodes[char] = code;
		}
		lex() {
			var input = this.input;
			var pos = this.tokenRegex.lastIndex;
			if (pos === input.length) return new Token("EOF", new SourceLocation(this, pos, pos));
			var match = this.tokenRegex.exec(input);
			if (match === null || match.index !== pos) throw new ParseError("Unexpected character: '" + input[pos] + "'", new Token(input[pos], new SourceLocation(this, pos, pos + 1)));
			var text = match[6] || match[3] || (match[2] ? "\\ " : " ");
			if (this.catcodes[text] === 14) {
				var nlIndex = input.indexOf("\n", this.tokenRegex.lastIndex);
				if (nlIndex === -1) {
					this.tokenRegex.lastIndex = input.length;
					this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)");
				} else this.tokenRegex.lastIndex = nlIndex + 1;
				return this.lex();
			}
			return new Token(text, new SourceLocation(this, pos, this.tokenRegex.lastIndex));
		}
	};
	var Namespace = class {
		constructor(builtins, globalMacros) {
			if (builtins === void 0) builtins = {};
			if (globalMacros === void 0) globalMacros = {};
			this.current = void 0;
			this.builtins = void 0;
			this.undefStack = void 0;
			this.current = globalMacros;
			this.builtins = builtins;
			this.undefStack = [];
		}
		beginGroup() {
			this.undefStack.push({});
		}
		endGroup() {
			if (this.undefStack.length === 0) throw new ParseError("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
			var undefs = this.undefStack.pop();
			for (var undef in undefs) if (undefs.hasOwnProperty(undef)) {
				if (undefs[undef] == null) delete this.current[undef];
				else this.current[undef] = undefs[undef];
			}
		}
		endGroups() {
			while (this.undefStack.length > 0) this.endGroup();
		}
		has(name) {
			return this.current.hasOwnProperty(name) || this.builtins.hasOwnProperty(name);
		}
		get(name) {
			if (this.current.hasOwnProperty(name)) return this.current[name];
			else return this.builtins[name];
		}
		set(name, value, global) {
			if (global === void 0) global = false;
			if (global) {
				for (var i = 0; i < this.undefStack.length; i++) delete this.undefStack[i][name];
				if (this.undefStack.length > 0) this.undefStack[this.undefStack.length - 1][name] = value;
			} else {
				var top = this.undefStack[this.undefStack.length - 1];
				if (top && !top.hasOwnProperty(name)) top[name] = this.current[name];
			}
			if (value == null) delete this.current[name];
			else this.current[name] = value;
		}
	};
	var macros = _macros;
	defineMacro("\\noexpand", function(context) {
		var t = context.popToken();
		if (context.isExpandable(t.text)) {
			t.noexpand = true;
			t.treatAsRelax = true;
		}
		return {
			tokens: [t],
			numArgs: 0
		};
	});
	defineMacro("\\expandafter", function(context) {
		var t = context.popToken();
		context.expandOnce(true);
		return {
			tokens: [t],
			numArgs: 0
		};
	});
	defineMacro("\\@firstoftwo", function(context) {
		return {
			tokens: context.consumeArgs(2)[0],
			numArgs: 0
		};
	});
	defineMacro("\\@secondoftwo", function(context) {
		return {
			tokens: context.consumeArgs(2)[1],
			numArgs: 0
		};
	});
	defineMacro("\\@ifnextchar", function(context) {
		var args = context.consumeArgs(3);
		context.consumeSpaces();
		var nextToken = context.future();
		if (args[0].length === 1 && args[0][0].text === nextToken.text) return {
			tokens: args[1],
			numArgs: 0
		};
		else return {
			tokens: args[2],
			numArgs: 0
		};
	});
	defineMacro("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
	defineMacro("\\TextOrMath", function(context) {
		var args = context.consumeArgs(2);
		if (context.mode === "text") return {
			tokens: args[0],
			numArgs: 0
		};
		else return {
			tokens: args[1],
			numArgs: 0
		};
	});
	var digitToNumber = {
		"0": 0,
		"1": 1,
		"2": 2,
		"3": 3,
		"4": 4,
		"5": 5,
		"6": 6,
		"7": 7,
		"8": 8,
		"9": 9,
		"a": 10,
		"A": 10,
		"b": 11,
		"B": 11,
		"c": 12,
		"C": 12,
		"d": 13,
		"D": 13,
		"e": 14,
		"E": 14,
		"f": 15,
		"F": 15
	};
	defineMacro("\\char", function(context) {
		var token = context.popToken();
		var base;
		var number = 0;
		if (token.text === "'") {
			base = 8;
			token = context.popToken();
		} else if (token.text === "\"") {
			base = 16;
			token = context.popToken();
		} else if (token.text === "`") {
			token = context.popToken();
			if (token.text[0] === "\\") number = token.text.charCodeAt(1);
			else if (token.text === "EOF") throw new ParseError("\\char` missing argument");
			else number = token.text.charCodeAt(0);
		} else base = 10;
		if (base) {
			number = digitToNumber[token.text];
			if (number == null || number >= base) throw new ParseError("Invalid base-" + base + " digit " + token.text);
			var digit;
			while ((digit = digitToNumber[context.future().text]) != null && digit < base) {
				number *= base;
				number += digit;
				context.popToken();
			}
		}
		return "\\@char{" + number + "}";
	});
	var newcommand = (context, existsOK, nonexistsOK, skipIfExists) => {
		var arg = context.consumeArg().tokens;
		if (arg.length !== 1) throw new ParseError("\\newcommand's first argument must be a macro name");
		var name = arg[0].text;
		var exists = context.isDefined(name);
		if (exists && !existsOK) throw new ParseError("\\newcommand{" + name + "} attempting to redefine " + (name + "; use \\renewcommand"));
		if (!exists && !nonexistsOK) throw new ParseError("\\renewcommand{" + name + "} when command " + name + " does not yet exist; use \\newcommand");
		var numArgs = 0;
		arg = context.consumeArg().tokens;
		if (arg.length === 1 && arg[0].text === "[") {
			var argText = "";
			var token = context.expandNextToken();
			while (token.text !== "]" && token.text !== "EOF") {
				argText += token.text;
				token = context.expandNextToken();
			}
			if (!argText.match(/^\s*[0-9]+\s*$/)) throw new ParseError("Invalid number of arguments: " + argText);
			numArgs = parseInt(argText);
			arg = context.consumeArg().tokens;
		}
		if (!(exists && skipIfExists)) context.macros.set(name, {
			tokens: arg,
			numArgs
		});
		return "";
	};
	defineMacro("\\newcommand", (context) => newcommand(context, false, true, false));
	defineMacro("\\renewcommand", (context) => newcommand(context, true, false, false));
	defineMacro("\\providecommand", (context) => newcommand(context, true, true, true));
	defineMacro("\\message", (context) => {
		var arg = context.consumeArgs(1)[0];
		console.log(arg.reverse().map((token) => token.text).join(""));
		return "";
	});
	defineMacro("\\errmessage", (context) => {
		var arg = context.consumeArgs(1)[0];
		console.error(arg.reverse().map((token) => token.text).join(""));
		return "";
	});
	defineMacro("\\show", (context) => {
		var tok = context.popToken();
		var name = tok.text;
		console.log(tok, context.macros.get(name), functions[name], symbols.math[name], symbols.text[name]);
		return "";
	});
	defineMacro("\\bgroup", "{");
	defineMacro("\\egroup", "}");
	defineMacro("~", "\\nobreakspace");
	defineMacro("\\lq", "`");
	defineMacro("\\rq", "'");
	defineMacro("\\aa", "\\r a");
	defineMacro("\\AA", "\\r A");
	defineMacro("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`©}");
	defineMacro("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
	defineMacro("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}");
	defineMacro("ℬ", "\\mathscr{B}");
	defineMacro("ℰ", "\\mathscr{E}");
	defineMacro("ℱ", "\\mathscr{F}");
	defineMacro("ℋ", "\\mathscr{H}");
	defineMacro("ℐ", "\\mathscr{I}");
	defineMacro("ℒ", "\\mathscr{L}");
	defineMacro("ℳ", "\\mathscr{M}");
	defineMacro("ℛ", "\\mathscr{R}");
	defineMacro("ℭ", "\\mathfrak{C}");
	defineMacro("ℌ", "\\mathfrak{H}");
	defineMacro("ℨ", "\\mathfrak{Z}");
	defineMacro("\\Bbbk", "\\Bbb{k}");
	defineMacro("\\llap", "\\mathllap{\\textrm{#1}}");
	defineMacro("\\rlap", "\\mathrlap{\\textrm{#1}}");
	defineMacro("\\clap", "\\mathclap{\\textrm{#1}}");
	defineMacro("\\mathstrut", "\\vphantom{(}");
	defineMacro("\\underbar", "\\underline{\\text{#1}}");
	defineMacro("\\not", "\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char\"338}");
	defineMacro("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");
	defineMacro("\\ne", "\\neq");
	defineMacro("≠", "\\neq");
	defineMacro("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}");
	defineMacro("∉", "\\notin");
	defineMacro("≘", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}");
	defineMacro("≙", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");
	defineMacro("≚", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");
	defineMacro("≛", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");
	defineMacro("≝", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}");
	defineMacro("≞", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");
	defineMacro("≟", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");
	defineMacro("⟂", "\\perp");
	defineMacro("‼", "\\mathclose{!\\mkern-0.8mu!}");
	defineMacro("∌", "\\notni");
	defineMacro("⌜", "\\ulcorner");
	defineMacro("⌝", "\\urcorner");
	defineMacro("⌞", "\\llcorner");
	defineMacro("⌟", "\\lrcorner");
	defineMacro("©", "\\copyright");
	defineMacro("®", "\\textregistered");
	defineMacro("\\ulcorner", "\\html@mathml{\\@ulcorner}{\\mathop{\\char\"231c}}");
	defineMacro("\\urcorner", "\\html@mathml{\\@urcorner}{\\mathop{\\char\"231d}}");
	defineMacro("\\llcorner", "\\html@mathml{\\@llcorner}{\\mathop{\\char\"231e}}");
	defineMacro("\\lrcorner", "\\html@mathml{\\@lrcorner}{\\mathop{\\char\"231f}}");
	defineMacro("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
	defineMacro("⋮", "\\vdots");
	defineMacro("\\varGamma", "\\mathit{\\Gamma}");
	defineMacro("\\varDelta", "\\mathit{\\Delta}");
	defineMacro("\\varTheta", "\\mathit{\\Theta}");
	defineMacro("\\varLambda", "\\mathit{\\Lambda}");
	defineMacro("\\varXi", "\\mathit{\\Xi}");
	defineMacro("\\varPi", "\\mathit{\\Pi}");
	defineMacro("\\varSigma", "\\mathit{\\Sigma}");
	defineMacro("\\varUpsilon", "\\mathit{\\Upsilon}");
	defineMacro("\\varPhi", "\\mathit{\\Phi}");
	defineMacro("\\varPsi", "\\mathit{\\Psi}");
	defineMacro("\\varOmega", "\\mathit{\\Omega}");
	defineMacro("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
	defineMacro("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");
	defineMacro("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
	defineMacro("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
	defineMacro("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
	defineMacro("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
	defineMacro("\\dddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");
	defineMacro("\\ddddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");
	var dotsByToken = {
		",": "\\dotsc",
		"\\not": "\\dotsb",
		"+": "\\dotsb",
		"=": "\\dotsb",
		"<": "\\dotsb",
		">": "\\dotsb",
		"-": "\\dotsb",
		"*": "\\dotsb",
		":": "\\dotsb",
		"\\DOTSB": "\\dotsb",
		"\\coprod": "\\dotsb",
		"\\bigvee": "\\dotsb",
		"\\bigwedge": "\\dotsb",
		"\\biguplus": "\\dotsb",
		"\\bigcap": "\\dotsb",
		"\\bigcup": "\\dotsb",
		"\\prod": "\\dotsb",
		"\\sum": "\\dotsb",
		"\\bigotimes": "\\dotsb",
		"\\bigoplus": "\\dotsb",
		"\\bigodot": "\\dotsb",
		"\\bigsqcup": "\\dotsb",
		"\\And": "\\dotsb",
		"\\longrightarrow": "\\dotsb",
		"\\Longrightarrow": "\\dotsb",
		"\\longleftarrow": "\\dotsb",
		"\\Longleftarrow": "\\dotsb",
		"\\longleftrightarrow": "\\dotsb",
		"\\Longleftrightarrow": "\\dotsb",
		"\\mapsto": "\\dotsb",
		"\\longmapsto": "\\dotsb",
		"\\hookrightarrow": "\\dotsb",
		"\\doteq": "\\dotsb",
		"\\mathbin": "\\dotsb",
		"\\mathrel": "\\dotsb",
		"\\relbar": "\\dotsb",
		"\\Relbar": "\\dotsb",
		"\\xrightarrow": "\\dotsb",
		"\\xleftarrow": "\\dotsb",
		"\\DOTSI": "\\dotsi",
		"\\int": "\\dotsi",
		"\\oint": "\\dotsi",
		"\\iint": "\\dotsi",
		"\\iiint": "\\dotsi",
		"\\iiiint": "\\dotsi",
		"\\idotsint": "\\dotsi",
		"\\DOTSX": "\\dotsx"
	};
	var dotsbGroups = new Set(["bin", "rel"]);
	defineMacro("\\dots", function(context) {
		var thedots = "\\dotso";
		var next = context.expandAfterFuture().text;
		if (next in dotsByToken) thedots = dotsByToken[next];
		else if (next.slice(0, 4) === "\\not") thedots = "\\dotsb";
		else if (next in symbols.math) {
			if (dotsbGroups.has(symbols.math[next].group)) thedots = "\\dotsb";
		}
		return thedots;
	});
	var spaceAfterDots = {
		")": true,
		"]": true,
		"\\rbrack": true,
		"\\}": true,
		"\\rbrace": true,
		"\\rangle": true,
		"\\rceil": true,
		"\\rfloor": true,
		"\\rgroup": true,
		"\\rmoustache": true,
		"\\right": true,
		"\\bigr": true,
		"\\biggr": true,
		"\\Bigr": true,
		"\\Biggr": true,
		"$": true,
		";": true,
		".": true,
		",": true
	};
	defineMacro("\\dotso", function(context) {
		if (context.future().text in spaceAfterDots) return "\\ldots\\,";
		else return "\\ldots";
	});
	defineMacro("\\dotsc", function(context) {
		var next = context.future().text;
		if (next in spaceAfterDots && next !== ",") return "\\ldots\\,";
		else return "\\ldots";
	});
	defineMacro("\\cdots", function(context) {
		if (context.future().text in spaceAfterDots) return "\\@cdots\\,";
		else return "\\@cdots";
	});
	defineMacro("\\dotsb", "\\cdots");
	defineMacro("\\dotsm", "\\cdots");
	defineMacro("\\dotsi", "\\!\\cdots");
	defineMacro("\\dotsx", "\\ldots\\,");
	defineMacro("\\DOTSI", "\\relax");
	defineMacro("\\DOTSB", "\\relax");
	defineMacro("\\DOTSX", "\\relax");
	defineMacro("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
	defineMacro("\\,", "\\tmspace+{3mu}{.1667em}");
	defineMacro("\\thinspace", "\\,");
	defineMacro("\\>", "\\mskip{4mu}");
	defineMacro("\\:", "\\tmspace+{4mu}{.2222em}");
	defineMacro("\\medspace", "\\:");
	defineMacro("\\;", "\\tmspace+{5mu}{.2777em}");
	defineMacro("\\thickspace", "\\;");
	defineMacro("\\!", "\\tmspace-{3mu}{.1667em}");
	defineMacro("\\negthinspace", "\\!");
	defineMacro("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
	defineMacro("\\negthickspace", "\\tmspace-{5mu}{.277em}");
	defineMacro("\\enspace", "\\kern.5em ");
	defineMacro("\\enskip", "\\hskip.5em\\relax");
	defineMacro("\\quad", "\\hskip1em\\relax");
	defineMacro("\\qquad", "\\hskip2em\\relax");
	defineMacro("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
	defineMacro("\\tag@paren", "\\tag@literal{({#1})}");
	defineMacro("\\tag@literal", (context) => {
		if (context.macros.get("\\df@tag")) throw new ParseError("Multiple \\tag");
		return "\\gdef\\df@tag{\\text{#1}}";
	});
	defineMacro("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");
	defineMacro("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");
	defineMacro("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
	defineMacro("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");
	defineMacro("\\newline", "\\\\\\relax");
	defineMacro("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
	var latexRaiseA = makeEm(fontMetricsData["Main-Regular"]["T".charCodeAt(0)][1] - .7 * fontMetricsData["Main-Regular"]["A".charCodeAt(0)][1]);
	defineMacro("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}");
	defineMacro("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + latexRaiseA + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}");
	defineMacro("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
	defineMacro("\\@hspace", "\\hskip #1\\relax");
	defineMacro("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
	defineMacro("\\ordinarycolon", ":");
	defineMacro("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
	defineMacro("\\dblcolon", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char\"2237}}");
	defineMacro("\\coloneqq", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char\"2254}}");
	defineMacro("\\Coloneqq", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char\"2237\\char\"3d}}");
	defineMacro("\\coloneq", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char\"3a\\char\"2212}}");
	defineMacro("\\Coloneq", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char\"2237\\char\"2212}}");
	defineMacro("\\eqqcolon", "\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char\"2255}}");
	defineMacro("\\Eqqcolon", "\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char\"3d\\char\"2237}}");
	defineMacro("\\eqcolon", "\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char\"2239}}");
	defineMacro("\\Eqcolon", "\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char\"2212\\char\"2237}}");
	defineMacro("\\colonapprox", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char\"3a\\char\"2248}}");
	defineMacro("\\Colonapprox", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char\"2237\\char\"2248}}");
	defineMacro("\\colonsim", "\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char\"3a\\char\"223c}}");
	defineMacro("\\Colonsim", "\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char\"2237\\char\"223c}}");
	defineMacro("∷", "\\dblcolon");
	defineMacro("∹", "\\eqcolon");
	defineMacro("≔", "\\coloneqq");
	defineMacro("≕", "\\eqqcolon");
	defineMacro("⩴", "\\Coloneqq");
	defineMacro("\\ratio", "\\vcentcolon");
	defineMacro("\\coloncolon", "\\dblcolon");
	defineMacro("\\colonequals", "\\coloneqq");
	defineMacro("\\coloncolonequals", "\\Coloneqq");
	defineMacro("\\equalscolon", "\\eqqcolon");
	defineMacro("\\equalscoloncolon", "\\Eqqcolon");
	defineMacro("\\colonminus", "\\coloneq");
	defineMacro("\\coloncolonminus", "\\Coloneq");
	defineMacro("\\minuscolon", "\\eqcolon");
	defineMacro("\\minuscoloncolon", "\\Eqcolon");
	defineMacro("\\coloncolonapprox", "\\Colonapprox");
	defineMacro("\\coloncolonsim", "\\Colonsim");
	defineMacro("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
	defineMacro("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
	defineMacro("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
	defineMacro("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");
	defineMacro("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");
	defineMacro("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
	defineMacro("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
	defineMacro("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
	defineMacro("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
	defineMacro("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
	defineMacro("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
	defineMacro("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
	defineMacro("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
	defineMacro("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{≩}");
	defineMacro("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{≨}");
	defineMacro("\\ngeqq", "\\html@mathml{\\@ngeqq}{≱}");
	defineMacro("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{≱}");
	defineMacro("\\nleqq", "\\html@mathml{\\@nleqq}{≰}");
	defineMacro("\\nleqslant", "\\html@mathml{\\@nleqslant}{≰}");
	defineMacro("\\nshortmid", "\\html@mathml{\\@nshortmid}{∤}");
	defineMacro("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{∦}");
	defineMacro("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{⊈}");
	defineMacro("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{⊉}");
	defineMacro("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{⊊}");
	defineMacro("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{⫋}");
	defineMacro("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{⊋}");
	defineMacro("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{⫌}");
	defineMacro("\\imath", "\\html@mathml{\\@imath}{ı}");
	defineMacro("\\jmath", "\\html@mathml{\\@jmath}{ȷ}");
	defineMacro("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}");
	defineMacro("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}");
	defineMacro("⟦", "\\llbracket");
	defineMacro("⟧", "\\rrbracket");
	defineMacro("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}");
	defineMacro("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}");
	defineMacro("⦃", "\\lBrace");
	defineMacro("⦄", "\\rBrace");
	defineMacro("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}");
	defineMacro("⦵", "\\minuso");
	defineMacro("\\darr", "\\downarrow");
	defineMacro("\\dArr", "\\Downarrow");
	defineMacro("\\Darr", "\\Downarrow");
	defineMacro("\\lang", "\\langle");
	defineMacro("\\rang", "\\rangle");
	defineMacro("\\uarr", "\\uparrow");
	defineMacro("\\uArr", "\\Uparrow");
	defineMacro("\\Uarr", "\\Uparrow");
	defineMacro("\\N", "\\mathbb{N}");
	defineMacro("\\R", "\\mathbb{R}");
	defineMacro("\\Z", "\\mathbb{Z}");
	defineMacro("\\alef", "\\aleph");
	defineMacro("\\alefsym", "\\aleph");
	defineMacro("\\Alpha", "\\mathrm{A}");
	defineMacro("\\Beta", "\\mathrm{B}");
	defineMacro("\\bull", "\\bullet");
	defineMacro("\\Chi", "\\mathrm{X}");
	defineMacro("\\clubs", "\\clubsuit");
	defineMacro("\\cnums", "\\mathbb{C}");
	defineMacro("\\Complex", "\\mathbb{C}");
	defineMacro("\\Dagger", "\\ddagger");
	defineMacro("\\diamonds", "\\diamondsuit");
	defineMacro("\\empty", "\\emptyset");
	defineMacro("\\Epsilon", "\\mathrm{E}");
	defineMacro("\\Eta", "\\mathrm{H}");
	defineMacro("\\exist", "\\exists");
	defineMacro("\\harr", "\\leftrightarrow");
	defineMacro("\\hArr", "\\Leftrightarrow");
	defineMacro("\\Harr", "\\Leftrightarrow");
	defineMacro("\\hearts", "\\heartsuit");
	defineMacro("\\image", "\\Im");
	defineMacro("\\infin", "\\infty");
	defineMacro("\\Iota", "\\mathrm{I}");
	defineMacro("\\isin", "\\in");
	defineMacro("\\Kappa", "\\mathrm{K}");
	defineMacro("\\larr", "\\leftarrow");
	defineMacro("\\lArr", "\\Leftarrow");
	defineMacro("\\Larr", "\\Leftarrow");
	defineMacro("\\lrarr", "\\leftrightarrow");
	defineMacro("\\lrArr", "\\Leftrightarrow");
	defineMacro("\\Lrarr", "\\Leftrightarrow");
	defineMacro("\\Mu", "\\mathrm{M}");
	defineMacro("\\natnums", "\\mathbb{N}");
	defineMacro("\\Nu", "\\mathrm{N}");
	defineMacro("\\Omicron", "\\mathrm{O}");
	defineMacro("\\plusmn", "\\pm");
	defineMacro("\\rarr", "\\rightarrow");
	defineMacro("\\rArr", "\\Rightarrow");
	defineMacro("\\Rarr", "\\Rightarrow");
	defineMacro("\\real", "\\Re");
	defineMacro("\\reals", "\\mathbb{R}");
	defineMacro("\\Reals", "\\mathbb{R}");
	defineMacro("\\Rho", "\\mathrm{P}");
	defineMacro("\\sdot", "\\cdot");
	defineMacro("\\sect", "\\S");
	defineMacro("\\spades", "\\spadesuit");
	defineMacro("\\sub", "\\subset");
	defineMacro("\\sube", "\\subseteq");
	defineMacro("\\supe", "\\supseteq");
	defineMacro("\\Tau", "\\mathrm{T}");
	defineMacro("\\thetasym", "\\vartheta");
	defineMacro("\\weierp", "\\wp");
	defineMacro("\\Zeta", "\\mathrm{Z}");
	defineMacro("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
	defineMacro("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
	defineMacro("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
	defineMacro("\\bra", "\\mathinner{\\langle{#1}|}");
	defineMacro("\\ket", "\\mathinner{|{#1}\\rangle}");
	defineMacro("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
	defineMacro("\\Bra", "\\left\\langle#1\\right|");
	defineMacro("\\Ket", "\\left|#1\\right\\rangle");
	var braketHelper = (one) => (context) => {
		var left = context.consumeArg().tokens;
		var middle = context.consumeArg().tokens;
		var middleDouble = context.consumeArg().tokens;
		var right = context.consumeArg().tokens;
		var oldMiddle = context.macros.get("|");
		var oldMiddleDouble = context.macros.get("\\|");
		context.macros.beginGroup();
		var midMacro = (double) => (context) => {
			if (one) {
				context.macros.set("|", oldMiddle);
				if (middleDouble.length) context.macros.set("\\|", oldMiddleDouble);
			}
			var doubled = double;
			if (!double && middleDouble.length) {
				if (context.future().text === "|") {
					context.popToken();
					doubled = true;
				}
			}
			return {
				tokens: doubled ? middleDouble : middle,
				numArgs: 0
			};
		};
		context.macros.set("|", midMacro(false));
		if (middleDouble.length) context.macros.set("\\|", midMacro(true));
		var arg = context.consumeArg().tokens;
		var expanded = context.expandTokens([
			...right,
			...arg,
			...left
		]);
		context.macros.endGroup();
		return {
			tokens: expanded.reverse(),
			numArgs: 0
		};
	};
	defineMacro("\\bra@ket", braketHelper(false));
	defineMacro("\\bra@set", braketHelper(true));
	defineMacro("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");
	defineMacro("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");
	defineMacro("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
	defineMacro("\\angln", "{\\angl n}");
	defineMacro("\\blue", "\\textcolor{##6495ed}{#1}");
	defineMacro("\\orange", "\\textcolor{##ffa500}{#1}");
	defineMacro("\\pink", "\\textcolor{##ff00af}{#1}");
	defineMacro("\\red", "\\textcolor{##df0030}{#1}");
	defineMacro("\\green", "\\textcolor{##28ae7b}{#1}");
	defineMacro("\\gray", "\\textcolor{gray}{#1}");
	defineMacro("\\purple", "\\textcolor{##9d38bd}{#1}");
	defineMacro("\\blueA", "\\textcolor{##ccfaff}{#1}");
	defineMacro("\\blueB", "\\textcolor{##80f6ff}{#1}");
	defineMacro("\\blueC", "\\textcolor{##63d9ea}{#1}");
	defineMacro("\\blueD", "\\textcolor{##11accd}{#1}");
	defineMacro("\\blueE", "\\textcolor{##0c7f99}{#1}");
	defineMacro("\\tealA", "\\textcolor{##94fff5}{#1}");
	defineMacro("\\tealB", "\\textcolor{##26edd5}{#1}");
	defineMacro("\\tealC", "\\textcolor{##01d1c1}{#1}");
	defineMacro("\\tealD", "\\textcolor{##01a995}{#1}");
	defineMacro("\\tealE", "\\textcolor{##208170}{#1}");
	defineMacro("\\greenA", "\\textcolor{##b6ffb0}{#1}");
	defineMacro("\\greenB", "\\textcolor{##8af281}{#1}");
	defineMacro("\\greenC", "\\textcolor{##74cf70}{#1}");
	defineMacro("\\greenD", "\\textcolor{##1fab54}{#1}");
	defineMacro("\\greenE", "\\textcolor{##0d923f}{#1}");
	defineMacro("\\goldA", "\\textcolor{##ffd0a9}{#1}");
	defineMacro("\\goldB", "\\textcolor{##ffbb71}{#1}");
	defineMacro("\\goldC", "\\textcolor{##ff9c39}{#1}");
	defineMacro("\\goldD", "\\textcolor{##e07d10}{#1}");
	defineMacro("\\goldE", "\\textcolor{##a75a05}{#1}");
	defineMacro("\\redA", "\\textcolor{##fca9a9}{#1}");
	defineMacro("\\redB", "\\textcolor{##ff8482}{#1}");
	defineMacro("\\redC", "\\textcolor{##f9685d}{#1}");
	defineMacro("\\redD", "\\textcolor{##e84d39}{#1}");
	defineMacro("\\redE", "\\textcolor{##bc2612}{#1}");
	defineMacro("\\maroonA", "\\textcolor{##ffbde0}{#1}");
	defineMacro("\\maroonB", "\\textcolor{##ff92c6}{#1}");
	defineMacro("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
	defineMacro("\\maroonD", "\\textcolor{##ca337c}{#1}");
	defineMacro("\\maroonE", "\\textcolor{##9e034e}{#1}");
	defineMacro("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
	defineMacro("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
	defineMacro("\\purpleC", "\\textcolor{##aa87ff}{#1}");
	defineMacro("\\purpleD", "\\textcolor{##7854ab}{#1}");
	defineMacro("\\purpleE", "\\textcolor{##543b78}{#1}");
	defineMacro("\\mintA", "\\textcolor{##f5f9e8}{#1}");
	defineMacro("\\mintB", "\\textcolor{##edf2df}{#1}");
	defineMacro("\\mintC", "\\textcolor{##e0e5cc}{#1}");
	defineMacro("\\grayA", "\\textcolor{##f6f7f7}{#1}");
	defineMacro("\\grayB", "\\textcolor{##f0f1f2}{#1}");
	defineMacro("\\grayC", "\\textcolor{##e3e5e6}{#1}");
	defineMacro("\\grayD", "\\textcolor{##d6d8da}{#1}");
	defineMacro("\\grayE", "\\textcolor{##babec2}{#1}");
	defineMacro("\\grayF", "\\textcolor{##888d93}{#1}");
	defineMacro("\\grayG", "\\textcolor{##626569}{#1}");
	defineMacro("\\grayH", "\\textcolor{##3b3e40}{#1}");
	defineMacro("\\grayI", "\\textcolor{##21242c}{#1}");
	defineMacro("\\kaBlue", "\\textcolor{##314453}{#1}");
	defineMacro("\\kaGreen", "\\textcolor{##71B307}{#1}");
	var implicitCommands = {
		"^": true,
		"_": true,
		"\\limits": true,
		"\\nolimits": true
	};
	var MacroExpander = class {
		constructor(input, settings, mode) {
			this.settings = void 0;
			this.expansionCount = void 0;
			this.lexer = void 0;
			this.macros = void 0;
			this.stack = void 0;
			this.mode = void 0;
			this.settings = settings;
			this.expansionCount = 0;
			this.feed(input);
			this.macros = new Namespace(macros, settings.macros);
			this.mode = mode;
			this.stack = [];
		}
		feed(input) {
			this.lexer = new Lexer(input, this.settings);
		}
		switchMode(newMode) {
			this.mode = newMode;
		}
		beginGroup() {
			this.macros.beginGroup();
		}
		endGroup() {
			this.macros.endGroup();
		}
		endGroups() {
			this.macros.endGroups();
		}
		future() {
			if (this.stack.length === 0) this.pushToken(this.lexer.lex());
			return this.stack[this.stack.length - 1];
		}
		popToken() {
			this.future();
			return this.stack.pop();
		}
		pushToken(token) {
			this.stack.push(token);
		}
		pushTokens(tokens) {
			this.stack.push(...tokens);
		}
		scanArgument(isOptional) {
			var start;
			var end;
			var tokens;
			if (isOptional) {
				this.consumeSpaces();
				if (this.future().text !== "[") return null;
				start = this.popToken();
				({tokens, end} = this.consumeArg(["]"]));
			} else ({tokens, start, end} = this.consumeArg());
			this.pushToken(new Token("EOF", end.loc));
			this.pushTokens(tokens);
			return new Token("", SourceLocation.range(start, end));
		}
		consumeSpaces() {
			for (;;) if (this.future().text === " ") this.stack.pop();
			else break;
		}
		consumeArg(delims) {
			var tokens = [];
			var isDelimited = delims && delims.length > 0;
			if (!isDelimited) this.consumeSpaces();
			var start = this.future();
			var tok;
			var depth = 0;
			var match = 0;
			do {
				tok = this.popToken();
				tokens.push(tok);
				if (tok.text === "{") ++depth;
				else if (tok.text === "}") {
					--depth;
					if (depth === -1) throw new ParseError("Extra }", tok);
				} else if (tok.text === "EOF") throw new ParseError("Unexpected end of input in a macro argument, expected '" + (delims && isDelimited ? delims[match] : "}") + "'", tok);
				if (delims && isDelimited) {
					if ((depth === 0 || depth === 1 && delims[match] === "{") && tok.text === delims[match]) {
						++match;
						if (match === delims.length) {
							tokens.splice(-match, match);
							break;
						}
					} else match = 0;
				}
			} while (depth !== 0 || isDelimited);
			if (start.text === "{" && tokens[tokens.length - 1].text === "}") {
				tokens.pop();
				tokens.shift();
			}
			tokens.reverse();
			return {
				tokens,
				start,
				end: tok
			};
		}
		consumeArgs(numArgs, delimiters) {
			if (delimiters) {
				if (delimiters.length !== numArgs + 1) throw new ParseError("The length of delimiters doesn't match the number of args!");
				var delims = delimiters[0];
				for (var i = 0; i < delims.length; i++) {
					var tok = this.popToken();
					if (delims[i] !== tok.text) throw new ParseError("Use of the macro doesn't match its definition", tok);
				}
			}
			var args = [];
			for (var _i = 0; _i < numArgs; _i++) args.push(this.consumeArg(delimiters && delimiters[_i + 1]).tokens);
			return args;
		}
		countExpansion(amount) {
			this.expansionCount += amount;
			if (this.expansionCount > this.settings.maxExpand) throw new ParseError("Too many expansions: infinite loop or need to increase maxExpand setting");
		}
		expandOnce(expandableOnly) {
			var topToken = this.popToken();
			var name = topToken.text;
			var expansion = !topToken.noexpand ? this._getExpansion(name) : null;
			if (expansion == null || expandableOnly && expansion.unexpandable) {
				if (expandableOnly && expansion == null && name[0] === "\\" && !this.isDefined(name)) throw new ParseError("Undefined control sequence: " + name);
				this.pushToken(topToken);
				return false;
			}
			this.countExpansion(1);
			var tokens = expansion.tokens;
			var args = this.consumeArgs(expansion.numArgs, expansion.delimiters);
			if (expansion.numArgs) {
				tokens = tokens.slice();
				for (var i = tokens.length - 1; i >= 0; --i) {
					var tok = tokens[i];
					if (tok.text === "#") {
						if (i === 0) throw new ParseError("Incomplete placeholder at end of macro body", tok);
						tok = tokens[--i];
						if (tok.text === "#") tokens.splice(i + 1, 1);
						else if (/^[1-9]$/.test(tok.text)) tokens.splice(i, 2, ...args[+tok.text - 1]);
						else throw new ParseError("Not a valid argument number", tok);
					}
				}
			}
			this.pushTokens(tokens);
			return tokens.length;
		}
		expandAfterFuture() {
			this.expandOnce();
			return this.future();
		}
		expandNextToken() {
			for (;;) if (this.expandOnce() === false) {
				var token = this.stack.pop();
				if (token.treatAsRelax) token.text = "\\relax";
				return token;
			}
		}
		expandMacro(name) {
			return this.macros.has(name) ? this.expandTokens([new Token(name)]) : void 0;
		}
		expandTokens(tokens) {
			var output = [];
			var oldStackLength = this.stack.length;
			this.pushTokens(tokens);
			while (this.stack.length > oldStackLength) if (this.expandOnce(true) === false) {
				var token = this.stack.pop();
				if (token.treatAsRelax) {
					token.noexpand = false;
					token.treatAsRelax = false;
				}
				output.push(token);
			}
			this.countExpansion(output.length);
			return output;
		}
		expandMacroAsText(name) {
			var tokens = this.expandMacro(name);
			if (tokens) return tokens.map((token) => token.text).join("");
			else return tokens;
		}
		_getExpansion(name) {
			var definition = this.macros.get(name);
			if (definition == null) return definition;
			if (name.length === 1) {
				var catcode = this.lexer.catcodes[name];
				if (catcode != null && catcode !== 13) return;
			}
			var expansion = typeof definition === "function" ? definition(this) : definition;
			if (typeof expansion === "string") {
				var numArgs = 0;
				if (expansion.includes("#")) {
					var stripped = expansion.replace(/##/g, "");
					while (stripped.includes("#" + (numArgs + 1))) ++numArgs;
				}
				var bodyLexer = new Lexer(expansion, this.settings);
				var tokens = [];
				var tok = bodyLexer.lex();
				while (tok.text !== "EOF") {
					tokens.push(tok);
					tok = bodyLexer.lex();
				}
				tokens.reverse();
				return {
					tokens,
					numArgs
				};
			}
			return expansion;
		}
		isDefined(name) {
			return this.macros.has(name) || functions.hasOwnProperty(name) || symbols.math.hasOwnProperty(name) || symbols.text.hasOwnProperty(name) || implicitCommands.hasOwnProperty(name);
		}
		isExpandable(name) {
			var macro = this.macros.get(name);
			return macro != null ? typeof macro === "string" || typeof macro === "function" || !macro.unexpandable : functions.hasOwnProperty(name) && !functions[name].primitive;
		}
	};
	var unicodeSubRegEx = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/;
	var uSubsAndSups = Object.freeze({
		"₊": "+",
		"₋": "-",
		"₌": "=",
		"₍": "(",
		"₎": ")",
		"₀": "0",
		"₁": "1",
		"₂": "2",
		"₃": "3",
		"₄": "4",
		"₅": "5",
		"₆": "6",
		"₇": "7",
		"₈": "8",
		"₉": "9",
		"ₐ": "a",
		"ₑ": "e",
		"ₕ": "h",
		"ᵢ": "i",
		"ⱼ": "j",
		"ₖ": "k",
		"ₗ": "l",
		"ₘ": "m",
		"ₙ": "n",
		"ₒ": "o",
		"ₚ": "p",
		"ᵣ": "r",
		"ₛ": "s",
		"ₜ": "t",
		"ᵤ": "u",
		"ᵥ": "v",
		"ₓ": "x",
		"ᵦ": "β",
		"ᵧ": "γ",
		"ᵨ": "ρ",
		"ᵩ": "ϕ",
		"ᵪ": "χ",
		"⁺": "+",
		"⁻": "-",
		"⁼": "=",
		"⁽": "(",
		"⁾": ")",
		"⁰": "0",
		"¹": "1",
		"²": "2",
		"³": "3",
		"⁴": "4",
		"⁵": "5",
		"⁶": "6",
		"⁷": "7",
		"⁸": "8",
		"⁹": "9",
		"ᴬ": "A",
		"ᴮ": "B",
		"ᴰ": "D",
		"ᴱ": "E",
		"ᴳ": "G",
		"ᴴ": "H",
		"ᴵ": "I",
		"ᴶ": "J",
		"ᴷ": "K",
		"ᴸ": "L",
		"ᴹ": "M",
		"ᴺ": "N",
		"ᴼ": "O",
		"ᴾ": "P",
		"ᴿ": "R",
		"ᵀ": "T",
		"ᵁ": "U",
		"ⱽ": "V",
		"ᵂ": "W",
		"ᵃ": "a",
		"ᵇ": "b",
		"ᶜ": "c",
		"ᵈ": "d",
		"ᵉ": "e",
		"ᶠ": "f",
		"ᵍ": "g",
		"ʰ": "h",
		"ⁱ": "i",
		"ʲ": "j",
		"ᵏ": "k",
		"ˡ": "l",
		"ᵐ": "m",
		"ⁿ": "n",
		"ᵒ": "o",
		"ᵖ": "p",
		"ʳ": "r",
		"ˢ": "s",
		"ᵗ": "t",
		"ᵘ": "u",
		"ᵛ": "v",
		"ʷ": "w",
		"ˣ": "x",
		"ʸ": "y",
		"ᶻ": "z",
		"ᵝ": "β",
		"ᵞ": "γ",
		"ᵟ": "δ",
		"ᵠ": "ϕ",
		"ᵡ": "χ",
		"ᶿ": "θ"
	});
	var unicodeAccents = {
		"́": {
			"text": "\\'",
			"math": "\\acute"
		},
		"̀": {
			"text": "\\`",
			"math": "\\grave"
		},
		"̈": {
			"text": "\\\"",
			"math": "\\ddot"
		},
		"̃": {
			"text": "\\~",
			"math": "\\tilde"
		},
		"̄": {
			"text": "\\=",
			"math": "\\bar"
		},
		"̆": {
			"text": "\\u",
			"math": "\\breve"
		},
		"̌": {
			"text": "\\v",
			"math": "\\check"
		},
		"̂": {
			"text": "\\^",
			"math": "\\hat"
		},
		"̇": {
			"text": "\\.",
			"math": "\\dot"
		},
		"̊": {
			"text": "\\r",
			"math": "\\mathring"
		},
		"̋": { "text": "\\H" },
		"̧": { "text": "\\c" }
	};
	var unicodeSymbols = {
		"á": "á",
		"à": "à",
		"ä": "ä",
		"ǟ": "ǟ",
		"ã": "ã",
		"ā": "ā",
		"ă": "ă",
		"ắ": "ắ",
		"ằ": "ằ",
		"ẵ": "ẵ",
		"ǎ": "ǎ",
		"â": "â",
		"ấ": "ấ",
		"ầ": "ầ",
		"ẫ": "ẫ",
		"ȧ": "ȧ",
		"ǡ": "ǡ",
		"å": "å",
		"ǻ": "ǻ",
		"ḃ": "ḃ",
		"ć": "ć",
		"ḉ": "ḉ",
		"č": "č",
		"ĉ": "ĉ",
		"ċ": "ċ",
		"ç": "ç",
		"ď": "ď",
		"ḋ": "ḋ",
		"ḑ": "ḑ",
		"é": "é",
		"è": "è",
		"ë": "ë",
		"ẽ": "ẽ",
		"ē": "ē",
		"ḗ": "ḗ",
		"ḕ": "ḕ",
		"ĕ": "ĕ",
		"ḝ": "ḝ",
		"ě": "ě",
		"ê": "ê",
		"ế": "ế",
		"ề": "ề",
		"ễ": "ễ",
		"ė": "ė",
		"ȩ": "ȩ",
		"ḟ": "ḟ",
		"ǵ": "ǵ",
		"ḡ": "ḡ",
		"ğ": "ğ",
		"ǧ": "ǧ",
		"ĝ": "ĝ",
		"ġ": "ġ",
		"ģ": "ģ",
		"ḧ": "ḧ",
		"ȟ": "ȟ",
		"ĥ": "ĥ",
		"ḣ": "ḣ",
		"ḩ": "ḩ",
		"í": "í",
		"ì": "ì",
		"ï": "ï",
		"ḯ": "ḯ",
		"ĩ": "ĩ",
		"ī": "ī",
		"ĭ": "ĭ",
		"ǐ": "ǐ",
		"î": "î",
		"ǰ": "ǰ",
		"ĵ": "ĵ",
		"ḱ": "ḱ",
		"ǩ": "ǩ",
		"ķ": "ķ",
		"ĺ": "ĺ",
		"ľ": "ľ",
		"ļ": "ļ",
		"ḿ": "ḿ",
		"ṁ": "ṁ",
		"ń": "ń",
		"ǹ": "ǹ",
		"ñ": "ñ",
		"ň": "ň",
		"ṅ": "ṅ",
		"ņ": "ņ",
		"ó": "ó",
		"ò": "ò",
		"ö": "ö",
		"ȫ": "ȫ",
		"õ": "õ",
		"ṍ": "ṍ",
		"ṏ": "ṏ",
		"ȭ": "ȭ",
		"ō": "ō",
		"ṓ": "ṓ",
		"ṑ": "ṑ",
		"ŏ": "ŏ",
		"ǒ": "ǒ",
		"ô": "ô",
		"ố": "ố",
		"ồ": "ồ",
		"ỗ": "ỗ",
		"ȯ": "ȯ",
		"ȱ": "ȱ",
		"ő": "ő",
		"ṕ": "ṕ",
		"ṗ": "ṗ",
		"ŕ": "ŕ",
		"ř": "ř",
		"ṙ": "ṙ",
		"ŗ": "ŗ",
		"ś": "ś",
		"ṥ": "ṥ",
		"š": "š",
		"ṧ": "ṧ",
		"ŝ": "ŝ",
		"ṡ": "ṡ",
		"ş": "ş",
		"ẗ": "ẗ",
		"ť": "ť",
		"ṫ": "ṫ",
		"ţ": "ţ",
		"ú": "ú",
		"ù": "ù",
		"ü": "ü",
		"ǘ": "ǘ",
		"ǜ": "ǜ",
		"ǖ": "ǖ",
		"ǚ": "ǚ",
		"ũ": "ũ",
		"ṹ": "ṹ",
		"ū": "ū",
		"ṻ": "ṻ",
		"ŭ": "ŭ",
		"ǔ": "ǔ",
		"û": "û",
		"ů": "ů",
		"ű": "ű",
		"ṽ": "ṽ",
		"ẃ": "ẃ",
		"ẁ": "ẁ",
		"ẅ": "ẅ",
		"ŵ": "ŵ",
		"ẇ": "ẇ",
		"ẘ": "ẘ",
		"ẍ": "ẍ",
		"ẋ": "ẋ",
		"ý": "ý",
		"ỳ": "ỳ",
		"ÿ": "ÿ",
		"ỹ": "ỹ",
		"ȳ": "ȳ",
		"ŷ": "ŷ",
		"ẏ": "ẏ",
		"ẙ": "ẙ",
		"ź": "ź",
		"ž": "ž",
		"ẑ": "ẑ",
		"ż": "ż",
		"Á": "Á",
		"À": "À",
		"Ä": "Ä",
		"Ǟ": "Ǟ",
		"Ã": "Ã",
		"Ā": "Ā",
		"Ă": "Ă",
		"Ắ": "Ắ",
		"Ằ": "Ằ",
		"Ẵ": "Ẵ",
		"Ǎ": "Ǎ",
		"Â": "Â",
		"Ấ": "Ấ",
		"Ầ": "Ầ",
		"Ẫ": "Ẫ",
		"Ȧ": "Ȧ",
		"Ǡ": "Ǡ",
		"Å": "Å",
		"Ǻ": "Ǻ",
		"Ḃ": "Ḃ",
		"Ć": "Ć",
		"Ḉ": "Ḉ",
		"Č": "Č",
		"Ĉ": "Ĉ",
		"Ċ": "Ċ",
		"Ç": "Ç",
		"Ď": "Ď",
		"Ḋ": "Ḋ",
		"Ḑ": "Ḑ",
		"É": "É",
		"È": "È",
		"Ë": "Ë",
		"Ẽ": "Ẽ",
		"Ē": "Ē",
		"Ḗ": "Ḗ",
		"Ḕ": "Ḕ",
		"Ĕ": "Ĕ",
		"Ḝ": "Ḝ",
		"Ě": "Ě",
		"Ê": "Ê",
		"Ế": "Ế",
		"Ề": "Ề",
		"Ễ": "Ễ",
		"Ė": "Ė",
		"Ȩ": "Ȩ",
		"Ḟ": "Ḟ",
		"Ǵ": "Ǵ",
		"Ḡ": "Ḡ",
		"Ğ": "Ğ",
		"Ǧ": "Ǧ",
		"Ĝ": "Ĝ",
		"Ġ": "Ġ",
		"Ģ": "Ģ",
		"Ḧ": "Ḧ",
		"Ȟ": "Ȟ",
		"Ĥ": "Ĥ",
		"Ḣ": "Ḣ",
		"Ḩ": "Ḩ",
		"Í": "Í",
		"Ì": "Ì",
		"Ï": "Ï",
		"Ḯ": "Ḯ",
		"Ĩ": "Ĩ",
		"Ī": "Ī",
		"Ĭ": "Ĭ",
		"Ǐ": "Ǐ",
		"Î": "Î",
		"İ": "İ",
		"Ĵ": "Ĵ",
		"Ḱ": "Ḱ",
		"Ǩ": "Ǩ",
		"Ķ": "Ķ",
		"Ĺ": "Ĺ",
		"Ľ": "Ľ",
		"Ļ": "Ļ",
		"Ḿ": "Ḿ",
		"Ṁ": "Ṁ",
		"Ń": "Ń",
		"Ǹ": "Ǹ",
		"Ñ": "Ñ",
		"Ň": "Ň",
		"Ṅ": "Ṅ",
		"Ņ": "Ņ",
		"Ó": "Ó",
		"Ò": "Ò",
		"Ö": "Ö",
		"Ȫ": "Ȫ",
		"Õ": "Õ",
		"Ṍ": "Ṍ",
		"Ṏ": "Ṏ",
		"Ȭ": "Ȭ",
		"Ō": "Ō",
		"Ṓ": "Ṓ",
		"Ṑ": "Ṑ",
		"Ŏ": "Ŏ",
		"Ǒ": "Ǒ",
		"Ô": "Ô",
		"Ố": "Ố",
		"Ồ": "Ồ",
		"Ỗ": "Ỗ",
		"Ȯ": "Ȯ",
		"Ȱ": "Ȱ",
		"Ő": "Ő",
		"Ṕ": "Ṕ",
		"Ṗ": "Ṗ",
		"Ŕ": "Ŕ",
		"Ř": "Ř",
		"Ṙ": "Ṙ",
		"Ŗ": "Ŗ",
		"Ś": "Ś",
		"Ṥ": "Ṥ",
		"Š": "Š",
		"Ṧ": "Ṧ",
		"Ŝ": "Ŝ",
		"Ṡ": "Ṡ",
		"Ş": "Ş",
		"Ť": "Ť",
		"Ṫ": "Ṫ",
		"Ţ": "Ţ",
		"Ú": "Ú",
		"Ù": "Ù",
		"Ü": "Ü",
		"Ǘ": "Ǘ",
		"Ǜ": "Ǜ",
		"Ǖ": "Ǖ",
		"Ǚ": "Ǚ",
		"Ũ": "Ũ",
		"Ṹ": "Ṹ",
		"Ū": "Ū",
		"Ṻ": "Ṻ",
		"Ŭ": "Ŭ",
		"Ǔ": "Ǔ",
		"Û": "Û",
		"Ů": "Ů",
		"Ű": "Ű",
		"Ṽ": "Ṽ",
		"Ẃ": "Ẃ",
		"Ẁ": "Ẁ",
		"Ẅ": "Ẅ",
		"Ŵ": "Ŵ",
		"Ẇ": "Ẇ",
		"Ẍ": "Ẍ",
		"Ẋ": "Ẋ",
		"Ý": "Ý",
		"Ỳ": "Ỳ",
		"Ÿ": "Ÿ",
		"Ỹ": "Ỹ",
		"Ȳ": "Ȳ",
		"Ŷ": "Ŷ",
		"Ẏ": "Ẏ",
		"Ź": "Ź",
		"Ž": "Ž",
		"Ẑ": "Ẑ",
		"Ż": "Ż",
		"ά": "ά",
		"ὰ": "ὰ",
		"ᾱ": "ᾱ",
		"ᾰ": "ᾰ",
		"έ": "έ",
		"ὲ": "ὲ",
		"ή": "ή",
		"ὴ": "ὴ",
		"ί": "ί",
		"ὶ": "ὶ",
		"ϊ": "ϊ",
		"ΐ": "ΐ",
		"ῒ": "ῒ",
		"ῑ": "ῑ",
		"ῐ": "ῐ",
		"ό": "ό",
		"ὸ": "ὸ",
		"ύ": "ύ",
		"ὺ": "ὺ",
		"ϋ": "ϋ",
		"ΰ": "ΰ",
		"ῢ": "ῢ",
		"ῡ": "ῡ",
		"ῠ": "ῠ",
		"ώ": "ώ",
		"ὼ": "ὼ",
		"Ύ": "Ύ",
		"Ὺ": "Ὺ",
		"Ϋ": "Ϋ",
		"Ῡ": "Ῡ",
		"Ῠ": "Ῠ",
		"Ώ": "Ώ",
		"Ὼ": "Ὼ"
	};
	var Parser = class Parser {
		constructor(input, settings) {
			this.mode = void 0;
			this.gullet = void 0;
			this.settings = void 0;
			this.leftrightDepth = void 0;
			this.nextToken = void 0;
			this.mode = "math";
			this.gullet = new MacroExpander(input, settings, this.mode);
			this.settings = settings;
			this.leftrightDepth = 0;
			this.nextToken = null;
		}
		expect(text, consume) {
			if (consume === void 0) consume = true;
			if (this.fetch().text !== text) throw new ParseError("Expected '" + text + "', got '" + this.fetch().text + "'", this.fetch());
			if (consume) this.consume();
		}
		consume() {
			this.nextToken = null;
		}
		fetch() {
			if (this.nextToken == null) this.nextToken = this.gullet.expandNextToken();
			return this.nextToken;
		}
		switchMode(newMode) {
			this.mode = newMode;
			this.gullet.switchMode(newMode);
		}
		parse() {
			if (!this.settings.globalGroup) this.gullet.beginGroup();
			if (this.settings.colorIsTextColor) this.gullet.macros.set("\\color", "\\textcolor");
			try {
				var parse = this.parseExpression(false);
				this.expect("EOF");
				if (!this.settings.globalGroup) this.gullet.endGroup();
				return parse;
			} finally {
				this.gullet.endGroups();
			}
		}
		subparse(tokens) {
			var oldToken = this.nextToken;
			this.consume();
			this.gullet.pushToken(new Token("}"));
			this.gullet.pushTokens(tokens);
			var parse = this.parseExpression(false);
			this.expect("}");
			this.nextToken = oldToken;
			return parse;
		}
		parseExpression(breakOnInfix, breakOnTokenText) {
			var body = [];
			while (true) {
				if (this.mode === "math") this.consumeSpaces();
				var lex = this.fetch();
				if (Parser.endOfExpression.has(lex.text)) break;
				if (breakOnTokenText && lex.text === breakOnTokenText) break;
				if (breakOnInfix && functions[lex.text] && functions[lex.text].infix) break;
				var atom = this.parseAtom(breakOnTokenText);
				if (!atom) break;
				else if (atom.type === "internal") continue;
				body.push(atom);
			}
			if (this.mode === "text") this.formLigatures(body);
			return this.handleInfixNodes(body);
		}
		handleInfixNodes(body) {
			var overIndex = -1;
			var funcName;
			for (var i = 0; i < body.length; i++) {
				var node = body[i];
				if (node.type === "infix") {
					if (overIndex !== -1) throw new ParseError("only one infix operator per group", node.token);
					overIndex = i;
					funcName = node.replaceWith;
				}
			}
			if (overIndex !== -1 && funcName) {
				var numerNode;
				var denomNode;
				var numerBody = body.slice(0, overIndex);
				var denomBody = body.slice(overIndex + 1);
				if (numerBody.length === 1 && numerBody[0].type === "ordgroup") numerNode = numerBody[0];
				else numerNode = {
					type: "ordgroup",
					mode: this.mode,
					body: numerBody
				};
				if (denomBody.length === 1 && denomBody[0].type === "ordgroup") denomNode = denomBody[0];
				else denomNode = {
					type: "ordgroup",
					mode: this.mode,
					body: denomBody
				};
				var _node;
				if (funcName === "\\\\abovefrac") _node = this.callFunction(funcName, [
					numerNode,
					body[overIndex],
					denomNode
				], []);
				else _node = this.callFunction(funcName, [numerNode, denomNode], []);
				return [_node];
			} else return body;
		}
		handleSupSubscript(name) {
			var symbolToken = this.fetch();
			var symbol = symbolToken.text;
			this.consume();
			this.consumeSpaces();
			var group;
			do {
				var _group;
				group = this.parseGroup(name);
			} while (((_group = group) == null ? void 0 : _group.type) === "internal");
			if (!group) throw new ParseError("Expected group after '" + symbol + "'", symbolToken);
			return group;
		}
		formatUnsupportedCmd(text) {
			var textordArray = [];
			for (var i = 0; i < text.length; i++) textordArray.push({
				type: "textord",
				mode: "text",
				text: text[i]
			});
			var textNode = {
				type: "text",
				mode: this.mode,
				body: textordArray
			};
			return {
				type: "color",
				mode: this.mode,
				color: this.settings.errorColor,
				body: [textNode]
			};
		}
		parseAtom(breakOnTokenText) {
			var base = this.parseGroup("atom", breakOnTokenText);
			if ((base == null ? void 0 : base.type) === "internal") return base;
			if (this.mode === "text") return base;
			var superscript;
			var subscript;
			while (true) {
				this.consumeSpaces();
				var lex = this.fetch();
				if (lex.text === "\\limits" || lex.text === "\\nolimits") {
					if (base && base.type === "op") {
						base.limits = lex.text === "\\limits";
						base.alwaysHandleSupSub = true;
					} else if (base && base.type === "operatorname") {
						if (base.alwaysHandleSupSub) base.limits = lex.text === "\\limits";
					} else throw new ParseError("Limit controls must follow a math operator", lex);
					this.consume();
				} else if (lex.text === "^") {
					if (superscript) throw new ParseError("Double superscript", lex);
					superscript = this.handleSupSubscript("superscript");
				} else if (lex.text === "_") {
					if (subscript) throw new ParseError("Double subscript", lex);
					subscript = this.handleSupSubscript("subscript");
				} else if (lex.text === "'") {
					if (superscript) throw new ParseError("Double superscript", lex);
					var prime = {
						type: "textord",
						mode: this.mode,
						text: "\\prime"
					};
					var primes = [prime];
					this.consume();
					while (this.fetch().text === "'") {
						primes.push(prime);
						this.consume();
					}
					if (this.fetch().text === "^") primes.push(this.handleSupSubscript("superscript"));
					superscript = {
						type: "ordgroup",
						mode: this.mode,
						body: primes
					};
				} else if (uSubsAndSups[lex.text]) {
					var isSub = unicodeSubRegEx.test(lex.text);
					var subsupTokens = [];
					subsupTokens.push(new Token(uSubsAndSups[lex.text]));
					this.consume();
					while (true) {
						var token = this.fetch().text;
						if (!uSubsAndSups[token]) break;
						if (unicodeSubRegEx.test(token) !== isSub) break;
						subsupTokens.unshift(new Token(uSubsAndSups[token]));
						this.consume();
					}
					var body = this.subparse(subsupTokens);
					if (isSub) subscript = {
						type: "ordgroup",
						mode: "math",
						body
					};
					else superscript = {
						type: "ordgroup",
						mode: "math",
						body
					};
				} else break;
			}
			if (superscript || subscript) return {
				type: "supsub",
				mode: this.mode,
				base,
				sup: superscript,
				sub: subscript
			};
			else return base;
		}
		parseFunction(breakOnTokenText, name) {
			var token = this.fetch();
			var func = token.text;
			var funcData = functions[func];
			if (!funcData) return null;
			this.consume();
			if (name && name !== "atom" && !funcData.allowedInArgument) throw new ParseError("Got function '" + func + "' with no arguments" + (name ? " as " + name : ""), token);
			else if (this.mode === "text" && !funcData.allowedInText) throw new ParseError("Can't use function '" + func + "' in text mode", token);
			else if (this.mode === "math" && funcData.allowedInMath === false) throw new ParseError("Can't use function '" + func + "' in math mode", token);
			var { args, optArgs } = this.parseArguments(func, funcData);
			return this.callFunction(func, args, optArgs, token, breakOnTokenText);
		}
		callFunction(name, args, optArgs, token, breakOnTokenText) {
			var context = {
				funcName: name,
				parser: this,
				token,
				breakOnTokenText
			};
			var func = functions[name];
			if (func && func.handler) return func.handler(context, args, optArgs);
			else throw new ParseError("No function handler for " + name);
		}
		parseArguments(func, funcData) {
			var totalArgs = funcData.numArgs + funcData.numOptionalArgs;
			if (totalArgs === 0) return {
				args: [],
				optArgs: []
			};
			var args = [];
			var optArgs = [];
			for (var i = 0; i < totalArgs; i++) {
				var argType = funcData.argTypes && funcData.argTypes[i];
				var isOptional = i < funcData.numOptionalArgs;
				if ("primitive" in funcData && funcData.primitive && argType == null || funcData.type === "sqrt" && i === 1 && optArgs[0] == null) argType = "primitive";
				var arg = this.parseGroupOfType("argument to '" + func + "'", argType, isOptional);
				if (isOptional) optArgs.push(arg);
				else if (arg != null) args.push(arg);
				else throw new ParseError("Null argument, please report this as a bug");
			}
			return {
				args,
				optArgs
			};
		}
		parseGroupOfType(name, type, optional) {
			switch (type) {
				case "color": return this.parseColorGroup(optional);
				case "size": return this.parseSizeGroup(optional);
				case "url": return this.parseUrlGroup(optional);
				case "math":
				case "text": return this.parseArgumentGroup(optional, type);
				case "hbox":
					var group = this.parseArgumentGroup(optional, "text");
					return group != null ? {
						type: "styling",
						mode: group.mode,
						body: [group],
						style: "text",
						resetFont: true
					} : null;
				case "raw":
					var token = this.parseStringGroup("raw", optional);
					return token != null ? {
						type: "raw",
						mode: "text",
						string: token.text
					} : null;
				case "primitive":
					if (optional) throw new ParseError("A primitive argument cannot be optional");
					var _group2 = this.parseGroup(name);
					if (_group2 == null) throw new ParseError("Expected group as " + name, this.fetch());
					return _group2;
				case "original":
				case null:
				case void 0: return this.parseArgumentGroup(optional);
				default: throw new ParseError("Unknown group type as " + name, this.fetch());
			}
		}
		consumeSpaces() {
			while (this.fetch().text === " ") this.consume();
		}
		parseStringGroup(modeName, optional) {
			var argToken = this.gullet.scanArgument(optional);
			if (argToken == null) return null;
			var str = "";
			var nextToken;
			while ((nextToken = this.fetch()).text !== "EOF") {
				str += nextToken.text;
				this.consume();
			}
			this.consume();
			argToken.text = str;
			return argToken;
		}
		parseRegexGroup(regex, modeName) {
			var firstToken = this.fetch();
			var lastToken = firstToken;
			var str = "";
			var nextToken;
			while ((nextToken = this.fetch()).text !== "EOF" && regex.test(str + nextToken.text)) {
				lastToken = nextToken;
				str += lastToken.text;
				this.consume();
			}
			if (str === "") throw new ParseError("Invalid " + modeName + ": '" + firstToken.text + "'", firstToken);
			return firstToken.range(lastToken, str);
		}
		parseColorGroup(optional) {
			var res = this.parseStringGroup("color", optional);
			if (res == null) return null;
			var match = /^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(res.text);
			if (!match) throw new ParseError("Invalid color: '" + res.text + "'", res);
			var color = match[0];
			if (/^[0-9a-f]{6}$/i.test(color)) color = "#" + color;
			return {
				type: "color-token",
				mode: this.mode,
				color
			};
		}
		parseSizeGroup(optional) {
			var res;
			var isBlank = false;
			this.gullet.consumeSpaces();
			if (!optional && this.gullet.future().text !== "{") res = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size");
			else res = this.parseStringGroup("size", optional);
			if (!res) return null;
			if (!optional && res.text.length === 0) {
				res.text = "0pt";
				isBlank = true;
			}
			var match = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(res.text);
			if (!match) throw new ParseError("Invalid size: '" + res.text + "'", res);
			var data = {
				number: +(match[1] + match[2]),
				unit: match[3]
			};
			if (!validUnit(data)) throw new ParseError("Invalid unit: '" + data.unit + "'", res);
			return {
				type: "size",
				mode: this.mode,
				value: data,
				isBlank
			};
		}
		parseUrlGroup(optional) {
			this.gullet.lexer.setCatcode("%", 13);
			this.gullet.lexer.setCatcode("~", 12);
			var res = this.parseStringGroup("url", optional);
			this.gullet.lexer.setCatcode("%", 14);
			this.gullet.lexer.setCatcode("~", 13);
			if (res == null) return null;
			var url = res.text.replace(/\\([#$%&~_^{}])/g, "$1");
			return {
				type: "url",
				mode: this.mode,
				url
			};
		}
		parseArgumentGroup(optional, mode) {
			var argToken = this.gullet.scanArgument(optional);
			if (argToken == null) return null;
			var outerMode = this.mode;
			if (mode) this.switchMode(mode);
			this.gullet.beginGroup();
			var expression = this.parseExpression(false, "EOF");
			this.expect("EOF");
			this.gullet.endGroup();
			var result = {
				type: "ordgroup",
				mode: this.mode,
				loc: argToken.loc,
				body: expression
			};
			if (mode) this.switchMode(outerMode);
			return result;
		}
		parseGroup(name, breakOnTokenText) {
			var firstToken = this.fetch();
			var text = firstToken.text;
			var result;
			if (text === "{" || text === "\\begingroup") {
				this.consume();
				var groupEnd = text === "{" ? "}" : "\\endgroup";
				this.gullet.beginGroup();
				var expression = this.parseExpression(false, groupEnd);
				var lastToken = this.fetch();
				this.expect(groupEnd);
				this.gullet.endGroup();
				result = {
					type: "ordgroup",
					mode: this.mode,
					loc: SourceLocation.range(firstToken, lastToken),
					body: expression,
					semisimple: text === "\\begingroup" || void 0
				};
			} else {
				result = this.parseFunction(breakOnTokenText, name) || this.parseSymbol();
				if (result == null && text[0] === "\\" && !implicitCommands.hasOwnProperty(text)) {
					if (this.settings.throwOnError) throw new ParseError("Undefined control sequence: " + text, firstToken);
					result = this.formatUnsupportedCmd(text);
					this.consume();
				}
			}
			return result;
		}
		formLigatures(group) {
			var n = group.length - 1;
			for (var i = 0; i < n; ++i) {
				var a = group[i];
				if (a.type !== "textord") continue;
				var v = a.text;
				var next = group[i + 1];
				if (!next || next.type !== "textord") continue;
				if (v === "-" && next.text === "-") {
					var afterNext = group[i + 2];
					if (i + 1 < n && afterNext && afterNext.type === "textord" && afterNext.text === "-") {
						group.splice(i, 3, {
							type: "textord",
							mode: "text",
							loc: SourceLocation.range(a, afterNext),
							text: "---"
						});
						n -= 2;
					} else {
						group.splice(i, 2, {
							type: "textord",
							mode: "text",
							loc: SourceLocation.range(a, next),
							text: "--"
						});
						n -= 1;
					}
				}
				if ((v === "'" || v === "`") && next.text === v) {
					group.splice(i, 2, {
						type: "textord",
						mode: "text",
						loc: SourceLocation.range(a, next),
						text: v + v
					});
					n -= 1;
				}
			}
		}
		parseSymbol() {
			var nucleus = this.fetch();
			var text = nucleus.text;
			if (/^\\verb[^a-zA-Z]/.test(text)) {
				this.consume();
				var arg = text.slice(5);
				var star = arg.charAt(0) === "*";
				if (star) arg = arg.slice(1);
				if (arg.length < 2 || arg.charAt(0) !== arg.slice(-1)) throw new ParseError("\\verb assertion failed --\n                    please report what input caused this bug");
				arg = arg.slice(1, -1);
				return {
					type: "verb",
					mode: "text",
					body: arg,
					star
				};
			}
			if (unicodeSymbols.hasOwnProperty(text[0]) && !symbols[this.mode][text[0]]) {
				if (this.settings.strict && this.mode === "math") this.settings.reportNonstrict("unicodeTextInMathMode", "Accented Unicode text character \"" + text[0] + "\" used in math mode", nucleus);
				text = unicodeSymbols[text[0]] + text.slice(1);
			}
			var match = combiningDiacriticalMarksEndRegex.exec(text);
			if (match) {
				text = text.substring(0, match.index);
				if (text === "i") text = "ı";
				else if (text === "j") text = "ȷ";
			}
			var symbol;
			if (symbols[this.mode][text]) {
				if (this.settings.strict && this.mode === "math" && extraLatin.includes(text)) this.settings.reportNonstrict("unicodeTextInMathMode", "Latin-1/Unicode text character \"" + text[0] + "\" used in math mode", nucleus);
				var group = symbols[this.mode][text].group;
				var loc = SourceLocation.range(nucleus);
				var s;
				if (isAtom(group)) s = {
					type: "atom",
					mode: this.mode,
					family: group,
					loc,
					text
				};
				else s = {
					type: group,
					mode: this.mode,
					loc,
					text
				};
				symbol = s;
			} else if (text.charCodeAt(0) >= 128) {
				if (this.settings.strict) {
					if (!supportedCodepoint(text.charCodeAt(0))) this.settings.reportNonstrict("unknownSymbol", "Unrecognized Unicode character \"" + text[0] + "\"" + (" (" + text.charCodeAt(0) + ")"), nucleus);
					else if (this.mode === "math") this.settings.reportNonstrict("unicodeTextInMathMode", "Unicode text character \"" + text[0] + "\" used in math mode", nucleus);
				}
				symbol = {
					type: "textord",
					mode: "text",
					loc: SourceLocation.range(nucleus),
					text
				};
			} else return null;
			this.consume();
			if (match) for (var i = 0; i < match[0].length; i++) {
				var accent = match[0][i];
				if (!unicodeAccents[accent]) throw new ParseError("Unknown accent ' " + accent + "'", nucleus);
				var command = unicodeAccents[accent][this.mode] || unicodeAccents[accent].text;
				if (!command) throw new ParseError("Accent " + accent + " unsupported in " + this.mode + " mode", nucleus);
				symbol = {
					type: "accent",
					mode: this.mode,
					loc: SourceLocation.range(nucleus),
					label: command,
					isStretchy: false,
					isShifty: true,
					base: symbol
				};
			}
			return symbol;
		}
	};
	Parser.endOfExpression = new Set([
		"}",
		"\\endgroup",
		"\\end",
		"\\right",
		"&"
	]);
	var parseTree = function parseTree(toParse, settings) {
		if (!(typeof toParse === "string" || toParse instanceof String)) throw new TypeError("KaTeX can only parse string typed expression");
		var parser = new Parser(toParse, settings);
		delete parser.gullet.macros.current["\\df@tag"];
		var tree = parser.parse();
		delete parser.gullet.macros.current["\\current@color"];
		delete parser.gullet.macros.current["\\color"];
		if (parser.gullet.macros.get("\\df@tag")) {
			if (!settings.displayMode) throw new ParseError("\\tag works only in display equations");
			tree = [{
				type: "tag",
				mode: "text",
				body: tree,
				tag: parser.subparse([new Token("\\df@tag")])
			}];
		}
		return tree;
	};
	var render = function render(expression, baseNode, options) {
		baseNode.textContent = "";
		var node = renderToDomTree(expression, options).toNode();
		baseNode.appendChild(node);
	};
	if (typeof document !== "undefined") {
		if (document.compatMode !== "CSS1Compat") {
			typeof console !== "undefined" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.");
			render = function render() {
				throw new ParseError("KaTeX doesn't work in quirks mode.");
			};
		}
	}
	var renderToString = function renderToString(expression, options) {
		return renderToDomTree(expression, options).toMarkup();
	};
	var generateParseTree = function generateParseTree(expression, options) {
		return parseTree(expression, new Settings(options));
	};
	var renderError = function renderError(error, expression, options) {
		if (options.throwOnError || !(error instanceof ParseError)) throw error;
		var node = makeSpan(["katex-error"], [new SymbolNode(expression)]);
		node.setAttribute("title", error.toString());
		node.setAttribute("style", "color:" + options.errorColor);
		return node;
	};
	var renderToDomTree = function renderToDomTree(expression, options) {
		var settings = new Settings(options);
		try {
			return buildTree(parseTree(expression, settings), expression, settings);
		} catch (error) {
			return renderError(error, expression, settings);
		}
	};
	var katex = {
		version: "0.16.47",
		render,
		renderToString,
		ParseError,
		SETTINGS_SCHEMA,
		__parse: generateParseTree,
		__renderToDomTree: renderToDomTree,
		__renderToHTMLTree: function renderToHTMLTree(expression, options) {
			var settings = new Settings(options);
			try {
				return buildHTMLTree(parseTree(expression, settings), expression, settings);
			} catch (error) {
				return renderError(error, expression, settings);
			}
		},
		__setFontMetrics: setFontMetrics,
		__defineSymbol: defineSymbol,
		__defineFunction: defineFunction,
		__defineMacro: defineMacro,
		__domTree: {
			Span,
			Anchor,
			SymbolNode,
			SvgNode,
			PathNode,
			LineNode
		}
	};
	var En = Object.defineProperty;
	var Sn = Object.defineProperties;
	var On = Object.getOwnPropertyDescriptors;
	var w = Object.getOwnPropertySymbols;
	var Tn = Object.prototype.hasOwnProperty;
	var Mn = Object.prototype.propertyIsEnumerable;
	var F = (n, e, r) => e in n ? En(n, e, {
		enumerable: true,
		configurable: true,
		writable: true,
		value: r
	}) : n[e] = r;
	var L = (n, e) => {
		for (var r in e || (e = {})) Tn.call(e, r) && F(n, r, e[r]);
		if (w) for (var r of w(e)) Mn.call(e, r) && F(n, r, e[r]);
		return n;
	};
	var P = (n, e) => Sn(n, On(e));
	var c = {
		PROSE: 0,
		FENCE_MARKER: 1,
		FENCE_INFO: 2,
		FENCE_BODY: 3,
		CODE_SPAN: 4,
		CODE_SPAN_OPEN: 5
	};
	var Cn = /^(`{3,}|~{3,})(.*)$/;
	var Ln = (n) => n !== void 0 && n >= "0" && n <= "9";
	var Pn = (n, e) => {
		let r = e;
		if (n[r] === "-" || n[r] === "*" || n[r] === "+") r += 1;
		else {
			for (; Ln(n[r]) && r - e < 9;) r += 1;
			if (r === e || n[r] !== "." && n[r] !== ")") return -1;
			r += 1;
		}
		return n[r] === " " ? r + 1 : -1;
	};
	var _n = (n, e, r) => {
		let t = 0, i = e, o = false, s = e;
		for (;;) {
			for (; s < r && n[s] === " ";) s += 1;
			if (n[s] === ">") {
				t += 1, s += n[s + 1] === " " ? 2 : 1, i = s, o = false;
				continue;
			}
			let l = s < r ? Pn(n, s) : -1;
			if (l === -1) return {
				contentStart: s,
				listIndent: o ? s - i : 0,
				quoteDepth: t
			};
			s = l, o = true;
		}
	};
	var Rn = (n, e, r, t) => {
		let i = e;
		for (let o = 0; o < t; o += 1) {
			for (; i < r && n[i] === " ";) i += 1;
			if (n[i] !== ">") return -1;
			i += 1, n[i] === " " && (i += 1);
		}
		return i;
	};
	var Nn = (n, e, r, t, i) => {
		let o = e + t;
		n.fill(c.FENCE_MARKER, o, o + i), n.fill(c.FENCE_INFO, o + i, Math.min(r + 1, n.length));
	};
	var yn = (n, e, r, t) => {
		let i = e;
		for (; i < r && n[i] === " ";) i += 1;
		let o = 0;
		for (; i < r && n[i] === t.char;) i += 1, o += 1;
		if (o < t.length) return false;
		for (; i < r;) {
			if (n[i] !== " " && n[i] !== "	" && n[i] !== "\r") return false;
			i += 1;
		}
		return true;
	};
	var $n = (n, e, r, t) => {
		let i = t > r && n[t - 1] === "\r" ? t - 1 : t, o = _n(n, r, i), s = n.slice(o.contentStart, i).match(Cn);
		if (!s) return null;
		let [, l, a] = s, u = l[0];
		return u === "`" && a.includes("`") ? null : (Nn(e, r, t, o.contentStart - r, l.length), {
			char: u,
			length: l.length,
			listIndent: o.listIndent,
			quoteDepth: o.quoteDepth
		});
	};
	var Un = (n, e, r, t) => {
		let i = Rn(n, e, r, t.quoteDepth);
		if (i === -1 || t.listIndent === 0) return i;
		let o = i;
		for (; o < r && n[o] === " ";) o += 1;
		return o === r || n[o] === "\r" && o + 1 === r || o - i >= t.listIndent ? i : -1;
	};
	var Dn = (n, e) => {
		let r = n.length, t = null, i = 0;
		for (; i < r;) {
			let o = n.indexOf(`
`, i);
			o === -1 && (o = r);
			let s = t ? Un(n, i, o, t) : -1;
			t && s === -1 && (t = null), t ? yn(n, s, o, t) ? (e.fill(c.FENCE_MARKER, i, o), t = null) : e.fill(c.FENCE_BODY, i, Math.min(o + 1, r)) : t = $n(n, e, i, o), i = o + 1;
		}
		return t;
	};
	var W = (n, e) => {
		let r = e + 1;
		for (; r < n.length && n[r] === "`";) r += 1;
		return r;
	};
	var Bn = (n, e) => {
		let r = e + 1;
		for (; r < n.length && (n[r] === " " || n[r] === "	" || n[r] === "\r");) r += 1;
		return r < n.length && n[r] === `
`;
	};
	var wn = (n, e, r) => {
		let t = r;
		for (;;) {
			let i = n.indexOf("`", t);
			if (i === -1) return -1;
			let o = i > t && n[i - 1] === "\\" && e[i - 1] === c.PROSE;
			if (e[i] === c.PROSE && !o) return i;
			t = i + 1;
		}
	};
	var Fn = (n, e) => {
		let r = n.length, t = -1, i = 0, o = 0;
		for (; o < r;) {
			if (t < 0) {
				if (o = wn(n, e, o), o === -1) break;
				let l = W(n, o);
				t = o, i = l - o, o = l;
				continue;
			}
			if (e[o] !== c.PROSE) {
				e.fill(c.CODE_SPAN_OPEN, t, o), t = -1, o += 1;
				continue;
			}
			if (n[o] === `
` && Bn(n, o)) {
				t = -1, o += 1;
				continue;
			}
			if (n[o] !== "`") {
				o += 1;
				continue;
			}
			let s = W(n, o);
			s - o === i && (e.fill(c.CODE_SPAN, t, s), t = -1), o = s;
		}
		return t >= 0 ? (e.fill(c.CODE_SPAN_OPEN, t, r), {
			start: t,
			runLength: i
		}) : null;
	};
	var Wn = (n) => {
		let e = new Uint8Array(n.length);
		return {
			text: n,
			regions: e,
			openFence: Dn(n, e),
			openSpan: Fn(n, e),
			mathMask: null,
			linkUrlMask: null,
			htmlTagMask: null
		};
	};
	var _ = null;
	var T = null;
	var g = (n) => {
		if (T !== null && n === _) return T;
		let e = Wn(n);
		return _ = n, T = e, e;
	};
	var K = () => {
		_ = null, T = null;
	};
	var H = (n, e) => e >= n.regions.length ? n.openFence !== null || n.openSpan !== null : e < 0 ? false : n.regions[e] !== c.PROSE;
	var X = (n, e) => n.regions[e] === c.CODE_SPAN;
	var I = (n, e) => {
		let r = g(n), t = e + e, i = 0;
		for (let o = n.indexOf(t); o !== -1; o = n.indexOf(t, o)) r.regions[o] === c.PROSE ? (i += 1, o += 2) : o += 1;
		return i;
	};
	var R = new Uint8Array(0);
	var Kn = (n) => n === "inlineLatex" || n === "blockLatex";
	var Hn = (n, e) => e === "[" && n === "none" ? "blockLatex" : e === "]" && n === "blockLatex" ? "none" : e === "(" && n === "none" ? "inlineLatex" : e === ")" && n === "inlineLatex" ? "none" : null;
	var Gn = (n, e) => e ? n === "blockDollar" ? "none" : "blockDollar" : n === "blockDollar" ? n : n === "inlineDollar" ? "none" : "inlineDollar";
	var Xn = (n) => n.includes("$") || n.includes("\\(") || n.includes("\\[");
	var Yn = (n, e, r) => {
		let t = n[e + 1];
		if (n[e] === "\\") {
			if (t === "$") return {
				context: r,
				length: 2
			};
			let i = Hn(r, t);
			return i === null ? null : {
				context: i,
				length: 2
			};
		}
		if (n[e] === "$" && !Kn(r)) {
			let i = t === "$";
			return {
				context: Gn(r, i),
				length: i ? 2 : 1
			};
		}
		return null;
	};
	var qn = (n) => {
		let { text: e, regions: r } = n, t = e.length, i = new Uint8Array(t), o = "none", s = 0;
		for (; s < t;) {
			i[s] = o === "none" ? 0 : 1;
			let l = r[s] === c.PROSE ? Yn(e, s, o) : null;
			if (l === null) {
				s += 1;
				continue;
			}
			o = l.context, l.length === 2 && (i[s + 1] = o === "none" ? 0 : 1), s += l.length;
		}
		return i;
	};
	var k = (n, e) => e < 0 || e >= n.text.length ? false : (n.mathMask === null && (n.mathMask = Xn(n.text) ? qn(n) : R), n.mathMask[e] === 1);
	var vn = (n, e, r, t) => {
		let { text: i, regions: o } = n, s = new Uint8Array(r - e), l = 0;
		for (let u = r - 1; u >= e; u -= 1) i[u] === ")" && o[u] === c.PROSE && (l = 1), s[u - e] = l;
		let a = false;
		for (let u = e; u < r; u += 1) a && s[u - e] === 1 && (t[u] = 1), o[u] === c.PROSE && (i[u] === ")" ? a = false : i[u] === "(" && (a = u > 0 && i[u - 1] === "]"));
	};
	var zn = (n) => {
		let { text: e } = n, r = e.length, t = new Uint8Array(r), i = 0;
		for (; i < r;) {
			let o = e.indexOf(`
`, i);
			o === -1 && (o = r), vn(n, i, o, t), i = o + 1;
		}
		return t;
	};
	var A = (n, e) => e < 0 || e >= n.text.length ? false : (n.linkUrlMask === null && (n.linkUrlMask = n.text.includes("](") ? zn(n) : R), n.linkUrlMask[e] === 1);
	var Qn = (n) => {
		let { text: e, regions: r } = n, t = e.length, i = new Uint8Array(t), o = false;
		for (let s = 0; s < t; s += 1) {
			if (e[s] === `
`) {
				o = false;
				continue;
			}
			if (i[s] = o ? 1 : 0, r[s] === c.PROSE) {
				if (e[s] === ">") o = false;
				else if (e[s] === "<") {
					let l = e[s + 1];
					o = l !== void 0 && (l >= "a" && l <= "z" || l >= "A" && l <= "Z" || l === "/");
				}
			}
		}
		return i;
	};
	var M = (n, e) => e < 0 || e >= n.text.length ? false : (n.htmlTagMask === null && (n.htmlTagMask = n.text.includes("<") ? Qn(n) : R), n.htmlTagMask[e] === 1);
	var f = (n, e) => H(g(n), e);
	var h = (n, e) => X(g(n), e);
	var Zn = /^(\s*(?:[-*+]|\d+[.)]) +)>(=?\s*[$]?\d)/gm;
	var Y = (n) => !n || typeof n != "string" || !n.includes(">") ? n : n.replace(Zn, (e, r, t, i) => f(n, i) ? e : `${r}\\>${t}`);
	var p = (n, { delimiter: e, markerLength: r, regex: t }) => {
		let i = n.lastIndexOf(e, n.length - 2), o = i === -1 ? n.length - 1 : i;
		return n.slice(Math.max(0, o - r + 1)).match(t);
	};
	var q = {
		delimiter: "*",
		markerLength: 2,
		regex: /(\*\*)([^*]*\*?)$/
	};
	var v = {
		delimiter: "_",
		markerLength: 2,
		regex: /(__)([^_]*?)$/
	};
	var z = {
		delimiter: "*",
		markerLength: 3,
		regex: /(\*\*\*)([^*]*?)$/
	};
	var Q = {
		delimiter: "*",
		markerLength: 1,
		regex: /(\*)([^*]*?)$/
	};
	var Z = {
		delimiter: "_",
		markerLength: 1,
		regex: /(_)([^_]*?)$/
	};
	var j = {
		delimiter: "~",
		markerLength: 2,
		regex: /(~~)([^~]*?)$/
	};
	var J = {
		delimiter: "_",
		markerLength: 2,
		regex: /(__)([^_]+)_$/
	};
	var V = {
		delimiter: "~",
		markerLength: 2,
		regex: /(~~)([^~]+)~$/
	};
	var b = /^[\s_~*`]*$/;
	var N = /^[\s]*[-*+][\s]+$/;
	var x = /[\p{L}\p{N}_]/u;
	var nn = /^\*{4,}$/;
	var m = (n) => {
		if (!n) return false;
		let e = n.charCodeAt(0);
		return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95 ? true : x.test(n);
	};
	var en = (n, e) => {
		let r = 1;
		for (let t = e - 1; t >= 0; t -= 1) if (n[t] === "]") r += 1;
		else if (n[t] === "[" && (r -= 1, r === 0)) return t;
		return -1;
	};
	var y = (n, e) => {
		let r = 1;
		for (let t = e + 1; t < n.length; t += 1) if (n[t] === "[") r += 1;
		else if (n[t] === "]" && (r -= 1, r === 0)) return t;
		return -1;
	};
	var $ = (n, e) => k(g(n), e);
	var O = (n, e, r) => {
		let t = 0;
		for (let a = e - 1; a >= 0; a -= 1) if (n[a] === `
`) {
			t = a + 1;
			break;
		}
		let i = n.length;
		for (let a = e; a < n.length; a += 1) if (n[a] === `
`) {
			i = a;
			break;
		}
		let o = n.substring(t, i), s = 0, l = false;
		for (let a of o) if (a === r) s += 1;
		else if (a !== " " && a !== "	") {
			l = true;
			break;
		}
		return s >= 3 && !l;
	};
	var Vn = (n, e, r, t) => r === "\\" || k(n, e) ? true : r !== "*" && t === "*" ? (e < n.text.length - 2 ? n.text[e + 2] : "") !== "*" : r === "*" || (!r || r === " " || r === "	" || r === `
`) && (!t || t === " " || t === "	" || t === `
`);
	var C = (n) => n === " " || n === "	" || n === `
`;
	var xn = (n, e) => !!(n && e && m(n) && m(e));
	var ne = (n, e, r, t) => {
		let i = xn(n, e), o = !!e && !C(e), s = !!n && !C(n);
		return i && r % 2 === 0 && !t ? { count: false } : s && r % 2 === 1 || o ? {
			count: true,
			inWordAsteriskChain: i
		} : { count: false };
	};
	var on = (n) => {
		let e = g(n), r = 0, t = false, i = n.length;
		for (let o = 0; o < i; o += 1) {
			if (n[o] !== "*" || e.regions[o] !== c.PROSE) {
				m(n[o]) || (t = false);
				continue;
			}
			let s = o > 0 ? n[o - 1] : "", l = o < i - 1 ? n[o + 1] : "";
			if (Vn(e, o, s, l)) continue;
			let a = ne(s, l, r, t);
			a.count && (r += 1, t = a.inWordAsteriskChain);
		}
		return r;
	};
	var ee = (n, e, r, t) => !!(r === "\\" || k(n, e) || A(n, e) || M(n, e) || r === "_" || t === "_" || r && t && m(r) && m(t));
	var re = (n) => {
		let e = g(n), r = 0, t = n.length;
		for (let i = 0; i < t; i += 1) {
			if (n[i] !== "_" || e.regions[i] !== c.PROSE) continue;
			let o = i > 0 ? n[i - 1] : "", s = i < t - 1 ? n[i + 1] : "";
			ee(e, i, o, s) || (r += 1);
		}
		return r;
	};
	var te = (n) => {
		let e = g(n), r = 0, t = 0;
		for (let i = 0; i < n.length; i += 1) n[i] === "*" && e.regions[i] === c.PROSE ? t += 1 : (t >= 3 && (r += Math.floor(t / 3)), t = 0);
		return t >= 3 && (r += Math.floor(t / 3)), r;
	};
	var U = (n) => I(n, "*");
	var rn = (n) => n === "" || n === " " || n === "	" || n === `
`;
	var ie = (n, e, r, t, i) => {
		if (!(rn(r) && rn(t))) return false;
		if (e > i.lineEnd) {
			let o = n.indexOf(`
`, e);
			i.lineEnd = o === -1 ? n.length : o, i.result = O(n, e, "_");
		}
		return i.result;
	};
	var oe = (n, e, r, t) => {
		let i = n.text, o = e, s = false;
		o > 0 && i[o - 1] === "\\" && (o += 1, s = true);
		let l = r - o;
		if (l < 2) return false;
		let a = o > 0 ? i[o - 1] : "", u = s ? "\\" : a, S = r < i.length ? i[r] : "";
		return m(u) && m(S) || ie(i, o, u, S, t) || k(n, o) || A(n, o) || M(n, o) ? false : Math.floor(l / 2) % 2 === 1;
	};
	var tn = (n) => {
		let e = g(n), r = n.length, t = {
			lineEnd: -1,
			result: false
		}, i = false, o = 0;
		for (; o < r;) {
			if (n[o] !== "_" || e.regions[o] !== c.PROSE) {
				o += 1;
				continue;
			}
			let s = o, l = o + 1;
			for (; l < r && n[l] === "_" && e.regions[l] === c.PROSE;) l += 1;
			o = l, oe(e, s, l, t) && (i = !i);
		}
		return i;
	};
	var se = (n, e, r) => {
		if (!e || b.test(e)) return true;
		let i = n.substring(0, r).lastIndexOf(`
`), o = i === -1 ? 0 : i + 1, s = n.substring(o, r);
		return N.test(s) && e.includes(`
`) ? true : O(n, r, "*");
	};
	var sn = (n) => {
		let e = p(n, q);
		if (!e) return n;
		let r = e[2], t = n.lastIndexOf(e[1]);
		return f(n, t) || h(n, t) || se(n, r, t) ? n : U(n) % 2 === 1 ? r.endsWith("*") ? `${n}*` : `${n}**` : n;
	};
	var le = (n, e, r) => {
		if (!e || b.test(e)) return true;
		let i = n.substring(0, r).lastIndexOf(`
`), o = i === -1 ? 0 : i + 1, s = n.substring(o, r);
		return N.test(s) && e.includes(`
`) ? true : O(n, r, "_");
	};
	var ln = (n) => {
		let e = p(n, v);
		if (!e) {
			let i = p(n, J);
			if (i) {
				let o = n.lastIndexOf(i[1]);
				if (!(f(n, o) || h(n, o)) && tn(n)) return `${n}_`;
			}
			return n;
		}
		let r = e[2], t = n.lastIndexOf(e[1]);
		return f(n, t) || h(n, t) || le(n, r, t) ? n : tn(n) ? `${n}__` : n;
	};
	var ae = (n, e) => {
		let { text: r } = n;
		return r[e] === "*" && n.regions[e] === c.PROSE && r[e - 1] !== "*" && r[e + 1] !== "*" && r[e - 1] !== "\\" && !k(n, e);
	};
	var ce = (n) => {
		let e = g(n);
		for (let r = n.indexOf("*"); r !== -1; r = n.indexOf("*", r + 1)) {
			if (!ae(e, r)) continue;
			let t = r > 0 ? n[r - 1] : "", i = r < n.length - 1 ? n[r + 1] : "", o = !t || C(t), s = !i || C(i);
			if (!(o && s) && !(t && i && m(t) && m(i)) && !s) return r;
		}
		return -1;
	};
	var an = (n) => {
		if (!p(n, Q)) return n;
		let r = ce(n);
		if (r === -1 || f(n, r) || h(n, r)) return n;
		let t = n.substring(r + 1);
		return !t || b.test(t) ? n : on(n) % 2 === 1 ? `${n}*` : n;
	};
	var cn = (n) => {
		let e = g(n);
		for (let r = n.indexOf("_"); r !== -1; r = n.indexOf("_", r + 1)) if (e.regions[r] === c.PROSE && n[r - 1] !== "_" && n[r + 1] !== "_" && n[r - 1] !== "\\" && !k(e, r) && !A(e, r)) {
			let t = r > 0 ? n[r - 1] : "", i = r < n.length - 1 ? n[r + 1] : "";
			if (t && i && m(t) && m(i)) continue;
			return r;
		}
		return -1;
	};
	var ue = (n) => {
		let e = n.length;
		for (; e > 0 && n[e - 1] === `
`;) e -= 1;
		if (e < n.length) return `${n.slice(0, e)}_${n.slice(e)}`;
		return `${n}_`;
	};
	var fe = (n) => {
		if (!n.endsWith("**")) return null;
		let e = n.slice(0, -2);
		if (U(e) % 2 !== 1) return null;
		let t = e.indexOf("**"), i = cn(e);
		return t !== -1 && i !== -1 && t < i ? `${e}_**` : null;
	};
	var un = (n) => {
		if (!p(n, Z)) return n;
		let r = cn(n);
		if (r === -1) return n;
		let t = n.substring(r + 1);
		if (!t || b.test(t) || f(n, r) || h(n, r)) return n;
		if (re(n) % 2 === 1) {
			let o = fe(n);
			return o !== null ? o : ue(n);
		}
		return n;
	};
	var ge = (n) => {
		let e = U(n), r = on(n);
		return e % 2 === 0 && r % 2 === 0;
	};
	var de = (n, e, r) => !e || b.test(e) || f(n, r) || h(n, r) ? true : O(n, r, "*");
	var fn = (n) => {
		if (nn.test(n)) return n;
		let e = p(n, z);
		if (!e) return n;
		let r = e[2];
		return de(n, r, n.lastIndexOf(e[1])) ? n : te(n) % 2 === 1 ? ge(n) ? n : `${n}***` : n;
	};
	var me = /<[a-zA-Z/][^>]*$/;
	var he = /[a-zA-Z/]/;
	var pe = (n) => n.includes("$") || n.includes("\\(") || n.includes("\\[");
	var be = (n, e) => {
		let r = n[e + 1];
		return r !== void 0 && he.test(r);
	};
	var gn = (n) => {
		let e = n.match(me);
		if (!e || e.index === void 0) return n;
		let r = pe(n);
		for (let t = e.index; t < n.length; t += 1) if (!(n[t] !== "<" || !be(n, t)) && !f(n, t) && !(r && $(n, t))) return n.substring(0, t).trimEnd();
		return n;
	};
	var dn = (n) => {
		let e = g(n);
		if (e.openFence) return n;
		let r = e.openSpan;
		if (!r) return n;
		let t = n.slice(r.start + r.runLength);
		if (!t || b.test(t)) return n;
		let i = 0, o = n.length - 1;
		for (; o >= 0 && n[o] === "`";) i += 1, o -= 1;
		return i >= r.runLength ? n : n + "`".repeat(r.runLength - i);
	};
	var ke = (n) => I(n, "$");
	var Ie = (n) => {
		let e = g(n), r = 0;
		for (let t = 0; t < n.length; t += 1) {
			if (n[t] === "\\") {
				t += 1;
				continue;
			}
			e.regions[t] === c.PROSE && n[t] === "$" && (t + 1 < n.length && n[t + 1] === "$" ? t += 1 : r += 1);
		}
		return r;
	};
	var Ae = (n) => {
		if (n.endsWith("$") && !n.endsWith("$$")) return `${n}$`;
		let e = n.indexOf("$$");
		return e !== -1 && n.indexOf(`
`, e) !== -1 && !n.endsWith(`
`) ? `${n}
$$` : `${n}$$`;
	};
	var mn = (n) => ke(n) % 2 === 0 ? n : Ae(n);
	var hn = (n) => Ie(n) % 2 === 1 ? `${n}$` : n;
	var E = "streamdown:incomplete-image";
	var Ee = (n, e, r) => {
		if (n.substring(e + 2).includes(")")) return null;
		let i = en(n, e);
		if (i === -1 || f(n, i)) return null;
		let o = i > 0 && n[i - 1] === "!", s = o ? i - 1 : i, l = n.substring(0, s), a = n.substring(i + 1, e);
		return o ? `${l}![${a}](${E})` : r === "text-only" ? `${l}${a}` : `${l}[${a}](streamdown:incomplete-link)`;
	};
	var pn = (n, e) => {
		for (let r = 0; r < e; r++) if (n[r] === "[" && !f(n, r)) {
			if (r > 0 && n[r - 1] === "!") continue;
			let t = y(n, r);
			if (t === -1) return r;
			if (t + 1 < n.length && n[t + 1] === "(") {
				let i = n.indexOf(")", t + 2);
				i !== -1 && (r = i);
			}
		}
		return e;
	};
	var Se = (n, e, r) => {
		let t = e > 0 && n[e - 1] === "!", i = t ? e - 1 : e;
		if (!n.substring(e + 1).includes("]")) {
			let l = n.substring(0, i);
			if (t) return `${l}![${n.substring(e + 1)}](${E})`;
			if (r === "text-only") {
				let a = pn(n, e);
				return n.substring(0, a) + n.substring(a + 1);
			}
			return `${n}](streamdown:incomplete-link)`;
		}
		if (y(n, e) === -1) {
			let l = n.substring(0, i);
			if (t) return `${l}![${n.substring(e + 1)}](${E})`;
			if (r === "text-only") {
				let a = pn(n, e);
				return n.substring(0, a) + n.substring(a + 1);
			}
			return `${n}](streamdown:incomplete-link)`;
		}
		return null;
	};
	var Oe = (n, e) => {
		let r = n.lastIndexOf("](");
		if (r !== -1 && !f(n, r)) {
			let t = Ee(n, r, e);
			if (t !== null) return t;
		}
		for (let t = n.lastIndexOf("["); t !== -1; t = t === 0 ? -1 : n.lastIndexOf("[", t - 1)) if (!f(n, t)) {
			let i = Se(n, t, e);
			if (i !== null) return i;
		}
		return n;
	};
	var Te = 32;
	var D = (n, e = "protocol") => {
		let r = n;
		for (let t = 0; t < Te; t += 1) {
			let i = Oe(r, e);
			if (i.length >= r.length) return i;
			r = i;
		}
		return r;
	};
	var Me = /^-{1,2}$/;
	var Ce = /^[\s]*-{1,2}[\s]+$/;
	var Le = /^={1,2}$/;
	var Pe = /^[\s]*={1,2}[\s]+$/;
	var bn = (n) => {
		if (!n || typeof n != "string") return n;
		let e = n.lastIndexOf(`
`);
		if (e === -1) return n;
		let r = n.substring(e + 1), t = n.substring(0, e), i = r.trim();
		if (Me.test(i) && !r.match(Ce)) {
			let s = t.split(`
`).at(-1);
			if (s && s.trim().length > 0) return `${n}\u200B`;
		}
		if (Le.test(i) && !r.match(Pe)) {
			let s = t.split(`
`).at(-1);
			if (s && s.trim().length > 0) return `${n}\u200B`;
		}
		return n;
	};
	var _e = /([\p{L}\p{N}_])~(?!~)(?=[\p{L}\p{N}_])/gu;
	var kn = (n) => !n || typeof n != "string" || !n.includes("~") ? n : n.replace(_e, (e, r, t) => {
		return f(n, t + r.length) ? e : `${r}\\~`;
	});
	var In = (n) => I(n, "~");
	var An = (n) => {
		let e = p(n, j);
		if (e) {
			let r = e[2];
			if (!r || b.test(r)) return n;
			let t = n.lastIndexOf(e[1]);
			if (f(n, t) || h(n, t)) return n;
			if (In(n) % 2 === 1) return `${n}~~`;
		} else {
			let r = p(n, V);
			if (r) {
				let t = n.lastIndexOf(r[0].slice(0, 2));
				if (f(n, t) || h(n, t)) return n;
				if (In(n) % 2 === 1) return `${n}~`;
			}
		}
		return n;
	};
	var B = (n) => n !== false;
	var Re = (n) => n === true;
	var d = {
		SINGLE_TILDE: 0,
		COMPARISON_OPERATORS: 5,
		HTML_TAGS: 10,
		SETEXT_HEADINGS: 15,
		LINKS: 20,
		BOLD_ITALIC: 30,
		BOLD: 35,
		ITALIC_DOUBLE_UNDERSCORE: 40,
		ITALIC_SINGLE_ASTERISK: 41,
		ITALIC_SINGLE_UNDERSCORE: 42,
		INLINE_CODE: 50,
		STRIKETHROUGH: 60,
		KATEX: 70,
		INLINE_KATEX: 75,
		DEFAULT: 100
	};
	var Ne = [
		{
			handler: {
				name: "singleTilde",
				handle: kn,
				priority: d.SINGLE_TILDE
			},
			optionKey: "singleTilde"
		},
		{
			handler: {
				name: "comparisonOperators",
				handle: Y,
				priority: d.COMPARISON_OPERATORS
			},
			optionKey: "comparisonOperators"
		},
		{
			handler: {
				name: "htmlTags",
				handle: gn,
				priority: d.HTML_TAGS
			},
			optionKey: "htmlTags"
		},
		{
			handler: {
				name: "setextHeadings",
				handle: bn,
				priority: d.SETEXT_HEADINGS
			},
			optionKey: "setextHeadings"
		},
		{
			handler: {
				name: "links",
				handle: D,
				priority: d.LINKS
			},
			optionKey: "links",
			earlyReturn: (n) => n.endsWith("](streamdown:incomplete-link)") || n.endsWith(`](streamdown:incomplete-image)`)
		},
		{
			handler: {
				name: "boldItalic",
				handle: fn,
				priority: d.BOLD_ITALIC
			},
			optionKey: "boldItalic"
		},
		{
			handler: {
				name: "bold",
				handle: sn,
				priority: d.BOLD
			},
			optionKey: "bold"
		},
		{
			handler: {
				name: "italicDoubleUnderscore",
				handle: ln,
				priority: d.ITALIC_DOUBLE_UNDERSCORE
			},
			optionKey: "italic"
		},
		{
			handler: {
				name: "italicSingleAsterisk",
				handle: an,
				priority: d.ITALIC_SINGLE_ASTERISK
			},
			optionKey: "italic"
		},
		{
			handler: {
				name: "italicSingleUnderscore",
				handle: un,
				priority: d.ITALIC_SINGLE_UNDERSCORE
			},
			optionKey: "italic"
		},
		{
			handler: {
				name: "inlineCode",
				handle: dn,
				priority: d.INLINE_CODE
			},
			optionKey: "inlineCode"
		},
		{
			handler: {
				name: "strikethrough",
				handle: An,
				priority: d.STRIKETHROUGH
			},
			optionKey: "strikethrough"
		},
		{
			handler: {
				name: "katex",
				handle: mn,
				priority: d.KATEX
			},
			optionKey: "katex"
		},
		{
			handler: {
				name: "inlineKatex",
				handle: hn,
				priority: d.INLINE_KATEX
			},
			optionKey: "inlineKatex"
		}
	];
	var ye = (n) => {
		var r;
		let e = (r = n == null ? void 0 : n.linkMode) != null ? r : "protocol";
		return Ne.filter(({ handler: t, optionKey: i }) => t.name === "links" ? B(n == null ? void 0 : n.links) || B(n == null ? void 0 : n.images) : t.name === "inlineKatex" ? Re(n == null ? void 0 : n.inlineKatex) : B(n == null ? void 0 : n[i])).map(({ handler: t, earlyReturn: i }) => t.name === "links" ? {
			handler: P(L({}, t), { handle: (o) => D(o, e) }),
			earlyReturn: e === "protocol" ? i : void 0
		} : {
			handler: t,
			earlyReturn: i
		});
	};
	var $e = (n, e) => {
		var s;
		if (!n || typeof n != "string") return n;
		let r = n.endsWith(" ") && !n.endsWith("  ") ? n.slice(0, -1) : n, t = ye(e), i = ((s = e == null ? void 0 : e.handlers) != null ? s : []).map((l) => {
			var a;
			return {
				handler: P(L({}, l), { priority: (a = l.priority) != null ? a : d.DEFAULT }),
				earlyReturn: void 0
			};
		}), o = [...t, ...i].sort((l, a) => {
			var u, S;
			return ((u = l.handler.priority) != null ? u : 0) - ((S = a.handler.priority) != null ? S : 0);
		});
		try {
			for (let { handler: l, earlyReturn: a } of o) if (r = l.handle(r), a != null && a(r)) return r;
			return r.endsWith(" ") && !r.endsWith("  ") ? r.slice(0, -1) : r;
		} finally {
			K();
		}
	};
	var Or = $e;
	function extend(destination) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) destination[key] = source[key];
		}
		return destination;
	}
	function repeat(character, count) {
		return Array(count + 1).join(character);
	}
	function trimLeadingNewlines(string) {
		return string.replace(/^\n*/, "");
	}
	function trimTrailingNewlines(string) {
		var indexEnd = string.length;
		while (indexEnd > 0 && string[indexEnd - 1] === "\n") indexEnd--;
		return string.substring(0, indexEnd);
	}
	function trimNewlines(string) {
		return trimTrailingNewlines(trimLeadingNewlines(string));
	}
	var blockElements = [
		"ADDRESS",
		"ARTICLE",
		"ASIDE",
		"AUDIO",
		"BLOCKQUOTE",
		"BODY",
		"CANVAS",
		"CENTER",
		"DD",
		"DIR",
		"DIV",
		"DL",
		"DT",
		"FIELDSET",
		"FIGCAPTION",
		"FIGURE",
		"FOOTER",
		"FORM",
		"FRAMESET",
		"H1",
		"H2",
		"H3",
		"H4",
		"H5",
		"H6",
		"HEADER",
		"HGROUP",
		"HR",
		"HTML",
		"ISINDEX",
		"LI",
		"MAIN",
		"MENU",
		"NAV",
		"NOFRAMES",
		"NOSCRIPT",
		"OL",
		"OUTPUT",
		"P",
		"PRE",
		"SECTION",
		"TABLE",
		"TBODY",
		"TD",
		"TFOOT",
		"TH",
		"THEAD",
		"TR",
		"UL"
	];
	function isBlock(node) {
		return is(node, blockElements);
	}
	var voidElements = [
		"AREA",
		"BASE",
		"BR",
		"COL",
		"COMMAND",
		"EMBED",
		"HR",
		"IMG",
		"INPUT",
		"KEYGEN",
		"LINK",
		"META",
		"PARAM",
		"SOURCE",
		"TRACK",
		"WBR"
	];
	function isVoid(node) {
		return is(node, voidElements);
	}
	function hasVoid(node) {
		return has(node, voidElements);
	}
	var meaningfulWhenBlankElements = [
		"A",
		"TABLE",
		"THEAD",
		"TBODY",
		"TFOOT",
		"TH",
		"TD",
		"IFRAME",
		"SCRIPT",
		"AUDIO",
		"VIDEO"
	];
	function isMeaningfulWhenBlank(node) {
		return is(node, meaningfulWhenBlankElements);
	}
	function hasMeaningfulWhenBlank(node) {
		return has(node, meaningfulWhenBlankElements);
	}
	function is(node, tagNames) {
		return tagNames.indexOf(node.nodeName) >= 0;
	}
	function has(node, tagNames) {
		return node.getElementsByTagName && tagNames.some(function(tagName) {
			return node.getElementsByTagName(tagName).length;
		});
	}
	var markdownEscapes = [
		[/\\/g, "\\\\"],
		[/\*/g, "\\*"],
		[/^-/g, "\\-"],
		[/^\+ /g, "\\+ "],
		[/^(=+)/g, "\\$1"],
		[/^(#{1,6}) /g, "\\$1 "],
		[/`/g, "\\`"],
		[/^~~~/g, "\\~~~"],
		[/\[/g, "\\["],
		[/\]/g, "\\]"],
		[/^>/g, "\\>"],
		[/_/g, "\\_"],
		[/^(\d+)\. /g, "$1\\. "]
	];
	function escapeMarkdown(string) {
		return markdownEscapes.reduce(function(accumulator, escape) {
			return accumulator.replace(escape[0], escape[1]);
		}, string);
	}
	var rules = {};
	rules.paragraph = {
		filter: "p",
		replacement: function(content) {
			return "\n\n" + content + "\n\n";
		}
	};
	rules.lineBreak = {
		filter: "br",
		replacement: function(content, node, options) {
			return options.br + "\n";
		}
	};
	rules.heading = {
		filter: [
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6"
		],
		replacement: function(content, node, options) {
			var hLevel = Number(node.nodeName.charAt(1));
			if (options.headingStyle === "setext" && hLevel < 3) {
				var underline = repeat(hLevel === 1 ? "=" : "-", content.length);
				return "\n\n" + content + "\n" + underline + "\n\n";
			} else return "\n\n" + repeat("#", hLevel) + " " + content + "\n\n";
		}
	};
	rules.blockquote = {
		filter: "blockquote",
		replacement: function(content) {
			content = trimNewlines(content).replace(/^/gm, "> ");
			return "\n\n" + content + "\n\n";
		}
	};
	rules.list = {
		filter: ["ul", "ol"],
		replacement: function(content, node) {
			var parent = node.parentNode;
			if (parent.nodeName === "LI" && parent.lastElementChild === node) return "\n" + content;
			else return "\n\n" + content + "\n\n";
		}
	};
	rules.listItem = {
		filter: "li",
		replacement: function(content, node, options) {
			var prefix = options.bulletListMarker + "   ";
			var parent = node.parentNode;
			if (parent.nodeName === "OL") {
				var start = parent.getAttribute("start");
				var index = Array.prototype.indexOf.call(parent.children, node);
				prefix = (start ? Number(start) + index : index + 1) + ".  ";
			}
			var isParagraph = /\n$/.test(content);
			content = trimNewlines(content) + (isParagraph ? "\n" : "");
			content = content.replace(/\n/gm, "\n" + " ".repeat(prefix.length));
			return prefix + content + (node.nextSibling ? "\n" : "");
		}
	};
	rules.indentedCodeBlock = {
		filter: function(node, options) {
			return options.codeBlockStyle === "indented" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
		},
		replacement: function(content, node, options) {
			return "\n\n    " + node.firstChild.textContent.replace(/\n/g, "\n    ") + "\n\n";
		}
	};
	rules.fencedCodeBlock = {
		filter: function(node, options) {
			return options.codeBlockStyle === "fenced" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
		},
		replacement: function(content, node, options) {
			var language = ((node.firstChild.getAttribute("class") || "").match(/language-(\S+)/) || [null, ""])[1];
			var code = node.firstChild.textContent;
			var fenceChar = options.fence.charAt(0);
			var fenceSize = 3;
			var fenceInCodeRegex = new RegExp("^" + fenceChar + "{3,}", "gm");
			var match;
			while (match = fenceInCodeRegex.exec(code)) if (match[0].length >= fenceSize) fenceSize = match[0].length + 1;
			var fence = repeat(fenceChar, fenceSize);
			return "\n\n" + fence + language + "\n" + code.replace(/\n$/, "") + "\n" + fence + "\n\n";
		}
	};
	rules.horizontalRule = {
		filter: "hr",
		replacement: function(content, node, options) {
			return "\n\n" + options.hr + "\n\n";
		}
	};
	rules.inlineLink = {
		filter: function(node, options) {
			return options.linkStyle === "inlined" && node.nodeName === "A" && node.getAttribute("href");
		},
		replacement: function(content, node) {
			var href = escapeLinkDestination(node.getAttribute("href"));
			var title = escapeLinkTitle(cleanAttribute(node.getAttribute("title")));
			var titlePart = title ? " \"" + title + "\"" : "";
			return "[" + content + "](" + href + titlePart + ")";
		}
	};
	rules.referenceLink = {
		filter: function(node, options) {
			return options.linkStyle === "referenced" && node.nodeName === "A" && node.getAttribute("href");
		},
		replacement: function(content, node, options) {
			var href = escapeLinkDestination(node.getAttribute("href"));
			var title = cleanAttribute(node.getAttribute("title"));
			if (title) title = " \"" + escapeLinkTitle(title) + "\"";
			var replacement;
			var reference;
			switch (options.linkReferenceStyle) {
				case "collapsed":
					replacement = "[" + content + "][]";
					reference = "[" + content + "]: " + href + title;
					break;
				case "shortcut":
					replacement = "[" + content + "]";
					reference = "[" + content + "]: " + href + title;
					break;
				default:
					var id = this.references.length + 1;
					replacement = "[" + content + "][" + id + "]";
					reference = "[" + id + "]: " + href + title;
			}
			this.references.push(reference);
			return replacement;
		},
		references: [],
		append: function(options) {
			var references = "";
			if (this.references.length) {
				references = "\n\n" + this.references.join("\n") + "\n\n";
				this.references = [];
			}
			return references;
		}
	};
	rules.emphasis = {
		filter: ["em", "i"],
		replacement: function(content, node, options) {
			if (!content.trim()) return "";
			return options.emDelimiter + content + options.emDelimiter;
		}
	};
	rules.strong = {
		filter: ["strong", "b"],
		replacement: function(content, node, options) {
			if (!content.trim()) return "";
			return options.strongDelimiter + content + options.strongDelimiter;
		}
	};
	rules.code = {
		filter: function(node) {
			var hasSiblings = node.previousSibling || node.nextSibling;
			var isCodeBlock = node.parentNode.nodeName === "PRE" && !hasSiblings;
			return node.nodeName === "CODE" && !isCodeBlock;
		},
		replacement: function(content) {
			if (!content) return "";
			content = content.replace(/\r?\n|\r/g, " ");
			var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
			var delimiter = "`";
			var matches = content.match(/`+/gm) || [];
			while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + "`";
			return delimiter + extraSpace + content + extraSpace + delimiter;
		}
	};
	rules.image = {
		filter: "img",
		replacement: function(content, node) {
			var alt = escapeMarkdown(cleanAttribute(node.getAttribute("alt")));
			var src = escapeLinkDestination(node.getAttribute("src") || "");
			var title = cleanAttribute(node.getAttribute("title"));
			var titlePart = title ? " \"" + escapeLinkTitle(title) + "\"" : "";
			return src ? "![" + alt + "](" + src + titlePart + ")" : "";
		}
	};
	function cleanAttribute(attribute) {
		return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
	}
	function escapeLinkDestination(destination) {
		var escaped = destination.replace(/([<>()])/g, "\\$1");
		return escaped.indexOf(" ") >= 0 ? "<" + escaped + ">" : escaped;
	}
	function escapeLinkTitle(title) {
		return title.replace(/"/g, "\\\"");
	}
	function Rules(options) {
		this.options = options;
		this._keep = [];
		this._remove = [];
		this.blankRule = { replacement: options.blankReplacement };
		this.keepReplacement = options.keepReplacement;
		this.defaultRule = { replacement: options.defaultReplacement };
		this.array = [];
		for (var key in options.rules) this.array.push(options.rules[key]);
	}
	Rules.prototype = {
		add: function(key, rule) {
			this.array.unshift(rule);
		},
		keep: function(filter) {
			this._keep.unshift({
				filter,
				replacement: this.keepReplacement
			});
		},
		remove: function(filter) {
			this._remove.unshift({
				filter,
				replacement: function() {
					return "";
				}
			});
		},
		forNode: function(node) {
			if (node.isBlank) return this.blankRule;
			var rule;
			if (rule = findRule(this.array, node, this.options)) return rule;
			if (rule = findRule(this._keep, node, this.options)) return rule;
			if (rule = findRule(this._remove, node, this.options)) return rule;
			return this.defaultRule;
		},
		forEach: function(fn) {
			for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
		}
	};
	function findRule(rules, node, options) {
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (filterValue(rule, node, options)) return rule;
		}
	}
	function filterValue(rule, node, options) {
		var filter = rule.filter;
		if (typeof filter === "string") {
			if (filter === node.nodeName.toLowerCase()) return true;
		} else if (Array.isArray(filter)) {
			if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true;
		} else if (typeof filter === "function") {
			if (filter.call(rule, node, options)) return true;
		} else throw new TypeError("`filter` needs to be a string, array, or function");
	}
	function collapseWhitespace(options) {
		var element = options.element;
		var isBlock = options.isBlock;
		var isVoid = options.isVoid;
		var isPre = options.isPre || function(node) {
			return node.nodeName === "PRE";
		};
		if (!element.firstChild || isPre(element)) return;
		var prevText = null;
		var keepLeadingWs = false;
		var prev = null;
		var node = next(prev, element, isPre);
		while (node !== element) {
			if (node.nodeType === 3 || node.nodeType === 4) {
				var text = node.data.replace(/[ \r\n\t]+/g, " ");
				if ((!prevText || / $/.test(prevText.data)) && !keepLeadingWs && text[0] === " ") text = text.substr(1);
				if (!text) {
					node = remove(node);
					continue;
				}
				node.data = text;
				prevText = node;
			} else if (node.nodeType === 1) {
				if (isBlock(node) || node.nodeName === "BR") {
					if (prevText) prevText.data = prevText.data.replace(/ $/, "");
					prevText = null;
					keepLeadingWs = false;
				} else if (isVoid(node) || isPre(node)) {
					prevText = null;
					keepLeadingWs = true;
				} else if (prevText) keepLeadingWs = false;
			} else {
				node = remove(node);
				continue;
			}
			var nextNode = next(prev, node, isPre);
			prev = node;
			node = nextNode;
		}
		if (prevText) {
			prevText.data = prevText.data.replace(/ $/, "");
			if (!prevText.data) remove(prevText);
		}
	}
	function remove(node) {
		var next = node.nextSibling || node.parentNode;
		node.parentNode.removeChild(node);
		return next;
	}
	function next(prev, current, isPre) {
		if (prev && prev.parentNode === current || isPre(current)) return current.nextSibling || current.parentNode;
		return current.firstChild || current.nextSibling || current.parentNode;
	}
	var root = typeof window !== "undefined" ? window : {};
	function canParseHTMLNatively() {
		var Parser = root.DOMParser;
		var canParse = false;
		try {
			if (new Parser().parseFromString("", "text/html")) canParse = true;
		} catch (e) {}
		return canParse;
	}
	function createHTMLParser() {
		var Parser = function() {};
		if (shouldUseActiveX()) Parser.prototype.parseFromString = function(string) {
			var doc = new window.ActiveXObject("htmlfile");
			doc.designMode = "on";
			doc.open();
			doc.write(string);
			doc.close();
			return doc;
		};
		else Parser.prototype.parseFromString = function(string) {
			var doc = document.implementation.createHTMLDocument("");
			doc.open();
			doc.write(string);
			doc.close();
			return doc;
		};
		return Parser;
	}
	function shouldUseActiveX() {
		var useActiveX = false;
		try {
			document.implementation.createHTMLDocument("").open();
		} catch (e) {
			if (root.ActiveXObject) useActiveX = true;
		}
		return useActiveX;
	}
	var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();
	function RootNode(input, options) {
		var root;
		if (typeof input === "string") root = htmlParser().parseFromString("<x-turndown id=\"turndown-root\">" + input + "</x-turndown>", "text/html").getElementById("turndown-root");
		else root = input.cloneNode(true);
		collapseWhitespace({
			element: root,
			isBlock,
			isVoid,
			isPre: options.preformattedCode ? isPreOrCode : null
		});
		return root;
	}
	var _htmlParser;
	function htmlParser() {
		_htmlParser = _htmlParser || new HTMLParser();
		return _htmlParser;
	}
	function isPreOrCode(node) {
		return node.nodeName === "PRE" || node.nodeName === "CODE";
	}
	function Node(node, options) {
		node.isBlock = isBlock(node);
		node.isCode = node.nodeName === "CODE" || node.parentNode.isCode;
		node.isBlank = isBlank(node);
		node.flankingWhitespace = flankingWhitespace(node, options);
		return node;
	}
	function isBlank(node) {
		return !isVoid(node) && !isMeaningfulWhenBlank(node) && /^\s*$/i.test(node.textContent) && !hasVoid(node) && !hasMeaningfulWhenBlank(node);
	}
	function flankingWhitespace(node, options) {
		if (node.isBlock || options.preformattedCode && node.isCode) return {
			leading: "",
			trailing: ""
		};
		var edges = edgeWhitespace(node.textContent);
		if (edges.leadingAscii && isFlankedByWhitespace("left", node, options)) edges.leading = edges.leadingNonAscii;
		if (edges.trailingAscii && isFlankedByWhitespace("right", node, options)) edges.trailing = edges.trailingNonAscii;
		return {
			leading: edges.leading,
			trailing: edges.trailing
		};
	}
	function edgeWhitespace(string) {
		var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
		return {
			leading: m[1],
			leadingAscii: m[2],
			leadingNonAscii: m[3],
			trailing: m[4],
			trailingNonAscii: m[5],
			trailingAscii: m[6]
		};
	}
	function isFlankedByWhitespace(side, node, options) {
		var sibling;
		var regExp;
		var isFlanked;
		if (side === "left") {
			sibling = node.previousSibling;
			regExp = / $/;
		} else {
			sibling = node.nextSibling;
			regExp = /^ /;
		}
		if (sibling) {
			if (sibling.nodeType === 3) isFlanked = regExp.test(sibling.nodeValue);
			else if (options.preformattedCode && sibling.nodeName === "CODE") isFlanked = false;
			else if (sibling.nodeType === 1 && !isBlock(sibling)) isFlanked = regExp.test(sibling.textContent);
		}
		return isFlanked;
	}
	var reduce = Array.prototype.reduce;
	function TurndownService(options) {
		if (!(this instanceof TurndownService)) return new TurndownService(options);
		var defaults = {
			rules,
			headingStyle: "setext",
			hr: "* * *",
			bulletListMarker: "*",
			codeBlockStyle: "indented",
			fence: "```",
			emDelimiter: "_",
			strongDelimiter: "**",
			linkStyle: "inlined",
			linkReferenceStyle: "full",
			br: "  ",
			preformattedCode: false,
			blankReplacement: function(content, node) {
				return node.isBlock ? "\n\n" : "";
			},
			keepReplacement: function(content, node) {
				return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
			},
			defaultReplacement: function(content, node) {
				return node.isBlock ? "\n\n" + content + "\n\n" : content;
			}
		};
		this.options = extend({}, defaults, options);
		this.rules = new Rules(this.options);
	}
	TurndownService.prototype = {
		turndown: function(input) {
			if (!canConvert(input)) throw new TypeError(input + " is not a string, or an element/document/fragment node.");
			if (input === "") return "";
			var output = process.call(this, new RootNode(input, this.options));
			return postProcess.call(this, output);
		},
		use: function(plugin) {
			if (Array.isArray(plugin)) for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
			else if (typeof plugin === "function") plugin(this);
			else throw new TypeError("plugin must be a Function or an Array of Functions");
			return this;
		},
		addRule: function(key, rule) {
			this.rules.add(key, rule);
			return this;
		},
		keep: function(filter) {
			this.rules.keep(filter);
			return this;
		},
		remove: function(filter) {
			this.rules.remove(filter);
			return this;
		},
		escape: function(string) {
			return escapeMarkdown(string);
		}
	};
	function process(parentNode) {
		var self = this;
		return reduce.call(parentNode.childNodes, function(output, node) {
			node = new Node(node, self.options);
			var replacement = "";
			if (node.nodeType === 3) replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
			else if (node.nodeType === 1) replacement = replacementForNode.call(self, node);
			return join(output, replacement);
		}, "");
	}
	function postProcess(output) {
		var self = this;
		this.rules.forEach(function(rule) {
			if (typeof rule.append === "function") output = join(output, rule.append(self.options));
		});
		return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
	}
	function replacementForNode(node) {
		var rule = this.rules.forNode(node);
		var content = process.call(this, node);
		var whitespace = node.flankingWhitespace;
		if (whitespace.leading || whitespace.trailing) content = content.trim();
		return whitespace.leading + rule.replacement(content, node, this.options) + whitespace.trailing;
	}
	function join(output, replacement) {
		var s1 = trimTrailingNewlines(output);
		var s2 = trimLeadingNewlines(replacement);
		var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
		return s1 + "\n\n".substring(0, nls) + s2;
	}
	function canConvert(input) {
		return input != null && (typeof input === "string" || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
	}
	var streamingMode = false;
	var unclosedMath = [];
	function createTurndown() {
		const td = new TurndownService({
			headingStyle: "atx",
			codeBlockStyle: "fenced",
			bulletListMarker: "-",
			emDelimiter: "*"
		});
		td.addRule("spoiler", {
			filter: (node) => node.nodeName === "DIV" && /(spoiler|collapse|fold)/i.test(node.className ?? ""),
			replacement: (content) => `\n\n${content}\n\n`
		});
		td.addRule("fencedCodeBlock", {
			filter: (node, options) => options.codeBlockStyle === "fenced" && node.nodeName === "PRE" && node.firstChild != null && node.firstChild.nodeName === "CODE",
			replacement: (_content, node, options) => {
				const code = node.firstChild;
				const className = code.getAttribute("class") ?? "";
				const language = /language-(\S+)/.exec(className)?.[1] ?? "";
				const text = code.textContent ?? "";
				return `\n\n${options.fence}${language}\n${text.replace(/\n$/, "")}\n${options.fence}\n\n`;
			}
		});
		addGfmTables(td);
		td.addRule("strikethrough", {
			filter: (node) => [
				"DEL",
				"S",
				"STRIKE"
			].includes(node.nodeName),
			replacement: (content) => `~~${content}~~`
		});
		td.addRule("math", {
			filter: (node) => node.nodeName === "SPAN" && node.hasAttribute("data-ojpp-math"),
			replacement: (_content, node) => {
				const latex = node.textContent ?? "";
				const delimiter = node.dataset.ojppMath === "display" ? "$$" : "$";
				return `${delimiter}${latex}${delimiter}`;
			}
		});
		return td;
	}
	function addGfmTables(td) {
		td.addRule("tableCell", {
			filter: ["th", "td"],
			replacement: (content, node) => {
				return `${Array.prototype.indexOf.call(node.parentNode.childNodes, node) === 0 ? "| " : " "}${content.trim().replace(/\|/g, "\\|")} |`;
			}
		});
		td.addRule("tableRow", {
			filter: "tr",
			replacement: (content, node) => {
				const parent = node.parentNode;
				const isHeading = parent.nodeName === "THEAD" || parent.nodeName === "TABLE" && parent.rows[0] === node;
				let out = `\n${content}\n`;
				if (isHeading) {
					const count = node.childNodes.length;
					out += `|${" --- |".repeat(count)}\n`;
				}
				return out;
			}
		});
		td.addRule("table", {
			filter: "table",
			replacement: (content) => `\n\n${content}\n\n`
		});
		td.addRule("tableSection", {
			filter: [
				"thead",
				"tbody",
				"tfoot"
			],
			replacement: (content) => content
		});
	}
	var turndown = createTurndown();
	function unescapeInline(text) {
		return text.replace(/(?<=\S)\\\-/g, "-");
	}
	function htmlToMarkdown(node, prepareContent) {
		const clone = node.cloneNode(true);
		prepareContent(clone);
		return unescapeInline(turndown.turndown(clone)).replace(/\n{3,}/g, "\n\n").trim();
	}
	function looksLikeLatex(text) {
		const head = text.slice(0, 60);
		if (/\\[a-zA-Z]+|[_^{}]|\\[(),;:]/.test(head)) return true;
		return !/^[\d\s]/.test(head);
	}
	function mathPlugin(md) {
		const inlineRule = (state, silent) => {
			const start = state.pos;
			if (state.src[start] !== "$") return false;
			const max = state.posMax;
			const display = state.src[start + 1] === "$";
			const open = display ? 2 : 1;
			let pos = start + open;
			while (pos < max) {
				const ch = state.src[pos];
				if (ch === "\\") {
					pos += 2;
					continue;
				}
				if (ch === "\n") {
					if (streamingMode && looksLikeLatex(state.src.slice(start + open))) unclosedMath.push({
						source: state.src,
						offset: start
					});
					return false;
				}
				if (ch === "$") {
					if (display) {
						if (state.src[pos + 1] !== "$") {
							pos += 1;
							continue;
						}
					} else if (state.src[pos + 1] === "$") {
						pos += 1;
						continue;
					}
					const content = state.src.slice(start + open, pos);
					if (!content.trim()) {
						pos += open;
						continue;
					}
					if (!display && /^\s|\s$/.test(content)) {
						pos += 1;
						continue;
					}
					if (silent) return true;
					const token = state.push("math_inline", "math", 0);
					token.content = content;
					token.meta = { display };
					state.pos = pos + open;
					return true;
				}
				pos += 1;
			}
			if (streamingMode && looksLikeLatex(state.src.slice(start + open))) unclosedMath.push({
				source: state.src,
				offset: start
			});
			return false;
		};
		const blockRule = (state, startLine, endLine, silent) => {
			const startPos = state.bMarks[startLine] + state.tShift[startLine];
			const max = state.eMarks[startLine];
			const line = state.src.slice(startPos, max).trim();
			if (!line.startsWith("$$")) return false;
			if (silent) return true;
			let content = line.slice(2);
			let nextLine = startLine;
			let closed = content.trimEnd().endsWith("$$");
			if (closed) content = content.trimEnd().slice(0, -2);
			else while (++nextLine < endLine) {
				const pos = state.bMarks[nextLine] + state.tShift[nextLine];
				const lineMax = state.eMarks[nextLine];
				const text = state.src.slice(pos, lineMax);
				if (text.trimEnd().endsWith("$$")) {
					content += `\n${text.trimEnd().slice(0, -2)}`;
					closed = true;
					break;
				}
				content += `\n${text}`;
			}
			if (!closed) return false;
			const token = state.push("math_block", "math", 0);
			token.block = true;
			token.content = content.trim();
			token.map = [startLine, nextLine + 1];
			state.line = nextLine + 1;
			return true;
		};
		md.inline.ruler.before("escape", "math_inline", inlineRule);
		md.block.ruler.before("fence", "math_block", blockRule, { alt: [
			"paragraph",
			"reference",
			"blockquote",
			"list"
		] });
		const render = (latex, displayMode) => {
			try {
				return katex.renderToString(latex, {
					displayMode,
					throwOnError: false,
					strict: false,
					trust: false
				});
			} catch {
				return `<code>${escapeHtml(latex)}</code>`;
			}
		};
		md.renderer.rules.math_inline = (tokens, idx) => {
			const display = tokens[idx].meta?.display === true;
			const html = render(tokens[idx].content, display);
			return display ? `<p>${html}</p>\n` : html;
		};
		md.renderer.rules.math_block = (tokens, idx) => `<p>${render(tokens[idx].content, true)}</p>\n`;
	}
	function escapeHtml(text) {
		return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
	var md = new MarkdownIt({
		html: false,
		linkify: true,
		breaks: false
	});
	md.use(mathPlugin);
	function renderMarkdown(source) {
		return md.render(source);
	}
	function stabilizeMarkdown(source) {
		let text = Or(source, { katex: false });
		for (let attempt = 0; attempt < 8; attempt += 1) {
			const cut = incompleteStart(text);
			if (cut === null) return text;
			const next = text.slice(0, cut);
			if (next === text) return text;
			text = next;
		}
		return text;
	}
	function incompleteStart(text) {
		if (!text) return null;
		const partialFence = /(^|\n)[ \t]*(?:`{1,2}|~{1,2})$/.exec(text);
		if (partialFence) return partialFence.index + (partialFence[1] ? 1 : 0);
		const fences = [...text.matchAll(/^(?:`{3,}|~{3,})/gm)];
		if (fences.length % 2 === 1) return fences[fences.length - 1].index;
		const ticks = [...text.matchAll(/(?<!`)`(?!`)/g)];
		if (ticks.length % 2 === 1) return ticks[ticks.length - 1].index;
		const doubles = [...text.matchAll(/\$\$/g)];
		if (doubles.length % 2 === 1) return doubles[doubles.length - 1].index;
		const marks = [...text.matchAll(/\*{1,3}|_{1,3}|~{2}|`/g)];
		const trailing = /(?:\*{1,3}|_{1,3}|~{2}|`)$/.exec(text);
		if (trailing) {
			const kind = trailing[0];
			if (marks.filter((m) => m[0] === kind).length % 2 === 1) return trailing.index;
		}
		streamingMode = true;
		unclosedMath = [];
		let positions = [];
		try {
			md.render(text);
			positions = unclosedMath.filter((entry) => entry.source === text).map((entry) => entry.offset);
		} finally {
			streamingMode = false;
			unclosedMath = [];
		}
		return positions.length ? Math.min(...positions) : null;
	}
	var KATEX_CSS_URL = `https://cdn.jsdelivr.net/npm/katex@${katex.version}/dist/katex.min.css`;
	var katexCssInjected = false;
	function ensureKatexStyles() {
		if (katexCssInjected) return;
		katexCssInjected = true;
		if (document.querySelector("link[data-ojpp-katex]")) return;
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = KATEX_CSS_URL;
		link.dataset.ojppKatex = "1";
		document.head.appendChild(link);
	}
	function createResultPanel(writeClipboard) {
		ensureKatexStyles();
		const el = document.createElement("div");
		el.className = "ojpp-result";
		const header = document.createElement("div");
		header.className = "ojpp-result-header";
		const title = document.createElement("span");
		title.className = "ojpp-result-title";
		title.textContent = t("result.title");
		const status = document.createElement("span");
		status.className = "ojpp-result-status";
		status.setAttribute("role", "status");
		const actions = document.createElement("span");
		actions.className = "ojpp-result-actions";
		const copy = iconButton(ICON_COPY, t("result.copy"));
		const toggle = iconButton(ICON_CHEVRON, t("result.collapse"));
		toggle.setAttribute("aria-expanded", "true");
		actions.append(copy, toggle);
		header.append(title, status, actions);
		const body = document.createElement("div");
		body.className = "ojpp-result-body";
		el.append(header, body);
		let currentMarkdown = "";
		let streaming = false;
		const update = (markdown) => {
			currentMarkdown = markdown;
			body.innerHTML = renderMarkdown(streaming ? stabilizeMarkdown(markdown) : markdown);
		};
		const setStatus = (text, kind = "info") => {
			status.textContent = text;
			status.dataset.kind = kind;
		};
		bindCopy(copy, () => currentMarkdown, writeClipboard);
		toggle.addEventListener("click", () => {
			const collapsed = el.classList.toggle("ojpp-collapsed");
			setIcon(toggle, collapsed ? ICON_CHEVRON_RIGHT : ICON_CHEVRON, collapsed ? t("result.expand") : t("result.collapse"));
			toggle.setAttribute("aria-expanded", String(!collapsed));
		});
		return {
			el,
			update,
			setStatus,
			begin() {
				streaming = true;
				el.classList.add("ojpp-streaming");
			},
			finish(result) {
				streaming = false;
				el.classList.remove("ojpp-streaming");
				update(result.markdown);
				setStatus(`${result.providerName} · ${result.model} · ${(result.elapsedMs / 1e3).toFixed(1)}s`);
			},
			remove: () => el.remove()
		};
	}
	function mountSection(section, options) {
		const { platform, getSettings, prepareContent } = options;
		const toolbar = document.createElement("span");
		toolbar.className = "ojpp-toolbar";
		toolbar.setAttribute("role", "group");
		toolbar.setAttribute("aria-label", t("toolbar.group", { label: section.label }));
		const translate = iconButton(ICON_TRANSLATE, t("toolbar.translate"), "ojpp-translate-btn");
		const markdown = iconButton(ICON_MARKDOWN, t("toolbar.markdown"), "ojpp-md-btn");
		const copy = iconButton(ICON_COPY, t("toolbar.copyOriginal"), "ojpp-copy-btn");
		toolbar.append(translate, markdown, copy);
		if (section.toolbar.align === "right") {
			toolbar.classList.add("ojpp-toolbar-right");
			section.toolbar.anchor.append(toolbar);
		} else if (section.toolbar.align === "block-right") {
			toolbar.classList.add("ojpp-toolbar-block");
			section.toolbar.anchor.insertAdjacentElement(section.toolbar.position, toolbar);
		} else section.toolbar.anchor.insertAdjacentElement(section.toolbar.position, toolbar);
		const readMarkdown = () => htmlToMarkdown(section.content, prepareContent);
		bindCopy(copy, readMarkdown, platform.writeClipboard);
		let controller;
		let result;
		let source;
		let feedbackTimer;
		let disposed = false;
		const originallyHidden = section.content.hidden;
		const state = (value, icon, title) => {
			translate.dataset.state = value;
			setIcon(translate, icon, title);
		};
		const run = async () => {
			if (controller) {
				controller.abort();
				return;
			}
			clearTimeout(feedbackTimer);
			if (translate.dataset.state === "done") state("idle", ICON_TRANSLATE, t("toolbar.retranslate"));
			const text = readMarkdown();
			if (!text.trim()) {
				state("error", ICON_CROSS, t("toolbar.noContent"));
				return;
			}
			result?.remove();
			const panel = createResultPanel(platform.writeClipboard);
			result = panel;
			section.result.anchor.insertAdjacentElement(section.result.position, panel.el);
			controller = new AbortController();
			const signal = controller.signal;
			state("busy", ICON_SPINNER, t("toolbar.translating"));
			panel.begin();
			try {
				const snapshot = structuredClone(getSettings());
				const translated = await translateMarkdown(platform.request, {
					settings: snapshot,
					markdown: text,
					signal,
					stream: platform.stream,
					streaming: snapshot.streaming,
					onStatus: panel.setStatus,
					onPartial: panel.update
				});
				signal.throwIfAborted();
				panel.finish(translated);
				state("done", ICON_CHECK, t("toolbar.retranslate"));
				feedbackTimer = setTimeout(() => state("idle", ICON_TRANSLATE, t("toolbar.retranslate")), 3e3);
			} catch (error) {
				if (signal.aborted) {
					panel.remove();
					if (!disposed) state("idle", ICON_TRANSLATE, t("toolbar.translate"));
				} else {
					const message = error instanceof Error ? error.message : String(error);
					panel.setStatus(t("toolbar.translateFailed", { message }), "error");
					state("error", ICON_CROSS, t("toolbar.retry", { message: message.slice(0, 60) }));
				}
			} finally {
				controller = void 0;
			}
		};
		translate.addEventListener("click", () => void run());
		markdown.addEventListener("click", () => {
			if (source) {
				source.remove();
				source = void 0;
				section.content.hidden = originallyHidden;
				markdown.dataset.state = "idle";
				setIcon(markdown, ICON_MARKDOWN, t("toolbar.markdown"));
			} else {
				source = document.createElement("pre");
				source.className = "ojpp-md-source";
				source.textContent = readMarkdown();
				section.content.after(source);
				section.content.hidden = true;
				markdown.dataset.state = "active";
				setIcon(markdown, ICON_MARKDOWN, t("toolbar.backToOriginal"));
			}
		});
		return {
			toolbar,
			translate: run,
			dispose() {
				disposed = true;
				controller?.abort();
				clearTimeout(feedbackTimer);
				toolbar.remove();
				result?.remove();
				source?.remove();
				section.content.hidden = originallyHidden;
			}
		};
	}
	var THEME_ATTR = "data-ojpp-theme";
	function resolveTheme(setting) {
		if (setting === "light" || setting === "dark") return setting;
		return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	function applyTheme(setting) {
		const root = document.documentElement;
		const theme = resolveTheme(setting);
		const previous = root.getAttribute(THEME_ATTR);
		root.setAttribute(THEME_ATTR, theme);
		root.style.colorScheme = theme;
		if (previous === "dark" && theme !== "dark") restoreInlineColors();
		if (theme === "dark") stripInlineColors(document);
	}
	function watchSystemTheme(onChange) {
		if (typeof matchMedia !== "function") return () => {};
		const media = matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}
	var strippedInline = new Map();
	function stripInlineColors(root) {
		for (const el of root.querySelectorAll("[style*=\"color\"], [style*=\"background\"], [style*=\"background-color\"]")) {
			const style = el.getAttribute("style");
			if (!style || strippedInline.has(el)) continue;
			const cleaned = style.split(";").filter((part) => {
				const prop = part.trim().toLowerCase();
				return !/^color\s*:/.test(prop) && !/^background(-color)?\s*:/.test(prop);
			}).join(";").trim();
			if (cleaned === style.trim()) continue;
			strippedInline.set(el, style);
			if (cleaned) el.setAttribute("style", cleaned);
			else el.removeAttribute("style");
		}
	}
	function restoreInlineColors() {
		for (const [el, style] of strippedInline) if (el.isConnected) el.setAttribute("style", style);
		strippedInline.clear();
	}
	function watchInlineColors() {
		const run = () => {
			if (document.documentElement.getAttribute("data-ojpp-theme") === "dark") stripInlineColors(document);
		};
		run();
		const observer = new MutationObserver(() => run());
		observer.observe(document.documentElement, {
			childList: true,
			subtree: true
		});
		return () => {
			observer.disconnect();
			restoreInlineColors();
		};
	}
	var EASING = {
		out: "cubic-bezier(0.23, 1, 0.32, 1)",
		inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
		drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
		standard: "ease"
	};
	var DURATION = {
		press: 100,
		tooltip: 150,
		dropdown: 200,
		modal: 300,
		page: 400
	};
	function applyStagger(elements, baseDelay = 0, staggerDelay = 50) {
		elements.forEach((el, i) => {
			el.style.opacity = "0";
			el.style.transform = "translateY(8px)";
			setTimeout(() => {
				el.style.transition = `opacity ${DURATION.dropdown}ms ${EASING.out}, transform ${DURATION.dropdown}ms ${EASING.out}`;
				el.style.opacity = "1";
				el.style.transform = "translateY(0)";
			}, baseDelay + i * staggerDelay);
		});
	}
	var iconChevronLeft = "<svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m15 18-6-6 6-6\"/></svg>";
	var iconPlus = "<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14m-7-7h14\"/></svg>";
	var iconPencil = "<svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z\"/></svg>";
	var iconX = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6 6 18M6 6l12 12\"/></svg>";
	var iconCheck = "<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6 9 17l-5-5\"/></svg>";
	function el(tag, className, text) {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== void 0) node.textContent = text;
		return node;
	}
	function openSettingsPanel(options) {
		const draft = structuredClone(options.settings);
		const mask = el("div", "ojpp-mask");
		const panel = el("div", "ojpp-panel");
		panel.setAttribute("role", "dialog");
		panel.setAttribute("aria-modal", "true");
		const head = el("div", "ojpp-panel-head");
		const backBtn = el("button", "ojpp-back-btn");
		backBtn.innerHTML = iconChevronLeft;
		backBtn.style.display = "none";
		const titleNode = el("h3");
		const closeBtn = el("button", "ojpp-panel-close");
		closeBtn.innerHTML = iconX;
		closeBtn.setAttribute("aria-label", t("common.close"));
		head.append(backBtn, titleNode, closeBtn);
		const body = el("div", "ojpp-panel-body");
		const foot = el("div", "ojpp-panel-foot");
		const resetBtn = el("button", "ojpp-btn ojpp-btn-danger", t("settings.reset"));
		const saveBtn = el("button", "ojpp-btn ojpp-btn-primary", t("common.save"));
		const saveStatus = el("span", "ojpp-status");
		saveStatus.setAttribute("role", "status");
		foot.append(resetBtn, saveStatus, saveBtn);
		panel.append(head, body, foot);
		mask.append(panel);
		const retitle = () => {
			closeBtn.setAttribute("aria-label", t("common.close"));
			resetBtn.textContent = t("settings.reset");
			saveBtn.textContent = t("common.save");
		};
		const switchView = (view, data) => {
			retitle();
			if (view === "main") {
				titleNode.textContent = APP_NAME;
				backBtn.style.display = "none";
				body.replaceChildren(renderMain());
			} else if (view === "providers") {
				titleNode.textContent = t("settings.providers");
				backBtn.style.display = "flex";
				backBtn.onclick = () => switchView("main");
				body.replaceChildren(renderProviders());
			} else if (view === "edit" && data) {
				const provider = draft.providers.find((p) => p.id === data);
				if (provider) {
					titleNode.textContent = provider.name || t("common.unnamed");
					backBtn.style.display = "flex";
					backBtn.onclick = () => switchView("providers");
					body.replaceChildren(renderEdit(provider));
				}
			} else if (view === "picker") {
				titleNode.textContent = t("settings.addProvider");
				backBtn.style.display = "flex";
				backBtn.onclick = () => switchView("providers");
				body.replaceChildren(renderPicker());
			}
		};
		function renderMain() {
			const container = el("div");
			const sec1 = section(t("settings.general"));
			const row1 = el("div", "ojpp-row");
			const localeSelect = select([
				["auto", t("settings.localeAuto")],
				["zh", "中文"],
				["en", "English"]
			], draft.locale);
			localeSelect.onchange = () => {
				draft.locale = localeSelect.value;
				setLocale(resolveLocale(draft.locale));
				switchView("main");
			};
			const themeSelect = select([
				["auto", t("settings.themeAuto")],
				["light", t("settings.themeLight")],
				["dark", t("settings.themeDark")]
			], draft.theme);
			themeSelect.onchange = () => {
				draft.theme = themeSelect.value;
				applyTheme(draft.theme);
			};
			row1.append(field(t("settings.language"), localeSelect), field(t("settings.theme"), themeSelect));
			const targetInput = input(draft.targetLang, t("settings.targetLangPlaceholder"));
			targetInput.oninput = () => draft.targetLang = targetInput.value;
			const promptArea = el("textarea");
			promptArea.value = draft.extraPrompt;
			promptArea.placeholder = t("settings.extraPromptPlaceholder");
			promptArea.style.minHeight = "60px";
			promptArea.oninput = () => draft.extraPrompt = promptArea.value;
			sec1.body.append(row1, field(t("settings.targetLang"), targetInput), field(t("settings.extraPrompt"), promptArea));
			container.append(sec1.container);
			const sec2 = section(t("settings.behavior"));
			sec2.body.append(check(t("settings.wholeBlock"), draft.translateWholeBlock, (v) => draft.translateWholeBlock = v), check(t("settings.autoTranslate"), draft.autoTranslate, (v) => draft.autoTranslate = v), check(t("settings.streaming"), draft.streaming, (v) => draft.streaming = v));
			const row2 = el("div", "ojpp-row");
			const timeoutInput = input(String(draft.timeoutMs), "120000");
			timeoutInput.type = "number";
			timeoutInput.oninput = () => {
				const n = Number(timeoutInput.value);
				if (Number.isFinite(n) && n > 0) draft.timeoutMs = n;
			};
			const retriesInput = input(String(draft.retries), "1");
			retriesInput.type = "number";
			retriesInput.oninput = () => {
				const n = Number(retriesInput.value);
				if (Number.isFinite(n) && n >= 0) draft.retries = n;
			};
			row2.append(field(t("settings.timeout"), timeoutInput), field(t("settings.retries"), retriesInput));
			sec2.body.append(row2);
			container.append(sec2.container);
			const sec3 = section(t("settings.providers"), String(draft.providers.length));
			const active = draft.providers.find((p) => p.id === draft.activeProviderId);
			const summary = el("div", "ojpp-provider-summary");
			if (active) summary.textContent = `${active.name || t("common.unnamed")} · ${active.model || "—"}`;
			else summary.textContent = t("settings.noProvider");
			const manageBtn = el("button", "ojpp-btn ojpp-btn-primary", t("settings.manage"));
			manageBtn.onclick = () => switchView("providers");
			sec3.body.append(summary, manageBtn);
			container.append(sec3.container);
			requestAnimationFrame(() => {
				applyStagger(Array.from(container.querySelectorAll(".ojpp-section")), 0, 15);
			});
			return container;
		}
		function renderProviders() {
			const container = el("div", "ojpp-section-body");
			container.style.padding = "16px";
			const addBtn = el("button", "ojpp-add-provider");
			addBtn.innerHTML = iconPlus;
			addBtn.title = t("settings.addProvider");
			addBtn.onclick = () => switchView("picker");
			container.append(addBtn);
			if (draft.providers.length === 0) {
				const empty = el("div", "ojpp-hint", t("settings.noProvider"));
				empty.style.textAlign = "center";
				empty.style.padding = "40px 20px";
				container.append(empty);
				return container;
			}
			const list = el("div", "ojpp-provider-list");
			draft.providers.forEach((p) => {
				const item = el("div", "ojpp-provider-item");
				item.dataset.active = p.id === draft.activeProviderId ? "1" : "0";
				const radio = el("input");
				radio.type = "radio";
				radio.name = "provider";
				radio.checked = p.id === draft.activeProviderId;
				radio.onclick = () => {
					draft.activeProviderId = p.id;
					switchView("providers");
				};
				const text = el("div", "ojpp-provider-text");
				text.append(el("div", "ojpp-provider-name", p.name || t("common.unnamed")), el("div", "ojpp-provider-meta", `${PROTOCOL_LABEL[p.protocol]} · ${p.model || "—"}`));
				const badge = el("span", "ojpp-provider-badge", iconCheck);
				badge.innerHTML = iconCheck;
				if (p.id !== draft.activeProviderId) badge.style.visibility = "hidden";
				const editBtn = el("button", "ojpp-provider-edit");
				editBtn.innerHTML = iconPencil;
				editBtn.title = t("settings.edit");
				editBtn.onclick = (e) => {
					e.stopPropagation();
					switchView("edit", p.id);
				};
				item.onclick = () => switchView("edit", p.id);
				item.append(radio, text, badge, editBtn);
				list.append(item);
			});
			container.append(list);
			requestAnimationFrame(() => {
				applyStagger(Array.from(list.children), 0, 15);
			});
			return container;
		}
		function renderEdit(provider) {
			const container = el("div");
			const sec1 = section(t("settings.basic"));
			const nameInput = input(provider.name, t("settings.providerNamePlaceholder"));
			nameInput.oninput = () => {
				provider.name = nameInput.value;
				titleNode.textContent = nameInput.value || t("common.unnamed");
			};
			const protocolSelect = select(Object.keys(PROTOCOL_LABEL).map((k) => [k, PROTOCOL_LABEL[k]]), provider.protocol);
			protocolSelect.onchange = () => {
				provider.protocol = protocolSelect.value;
			};
			const baseInput = input(provider.baseUrl, "https://api.openai.com/v1");
			baseInput.oninput = () => {
				provider.baseUrl = baseInput.value;
			};
			const modelInput = input(provider.model, "gpt-4o");
			modelInput.oninput = () => {
				provider.model = modelInput.value;
			};
			const keyInput = input(provider.apiKey, "", "password");
			keyInput.oninput = () => {
				provider.apiKey = keyInput.value;
			};
			const protocolModelRow = el("div", "ojpp-row");
			protocolModelRow.append(field(t("settings.protocol"), protocolSelect), field(t("settings.model"), modelInput));
			sec1.body.append(field(t("settings.providerName"), nameInput), protocolModelRow, field(t("settings.baseUrl"), baseInput), field("API Key", keyInput));
			container.append(sec1.container);
			const sec2 = section(t("settings.advancedOptions"));
			const row1 = el("div", "ojpp-row");
			const reasoningSelect = select([
				["", t("settings.effortDefault")],
				["enabled", t("settings.effortEnabled")],
				["disabled", t("settings.effortDisabled")]
			], provider.reasoning.enabled === null ? "" : provider.reasoning.enabled ? "enabled" : "disabled");
			reasoningSelect.onchange = () => {
				const v = reasoningSelect.value;
				provider.reasoning.enabled = v === "" ? null : v === "enabled";
			};
			const effortSelect = select([
				["", t("settings.effortDefault")],
				["low", "Low"],
				["medium", "Medium"],
				["high", "High"]
			], provider.reasoning.effort || "");
			effortSelect.onchange = () => {
				provider.reasoning.effort = effortSelect.value;
			};
			row1.append(field(t("settings.reasoning"), reasoningSelect), field(t("settings.reasoningEffort"), effortSelect));
			sec2.body.append(row1);
			const headersArea = el("textarea");
			headersArea.value = Object.entries(provider.headers).map(([k, v]) => `${k}: ${v}`).join("\n");
			headersArea.placeholder = t("settings.headersPlaceholder");
			headersArea.style.minHeight = "60px";
			headersArea.oninput = () => {
				provider.headers = parsePairs(headersArea.value);
			};
			sec2.body.append(field(t("settings.headers"), headersArea));
			const bodyArea = el("textarea");
			bodyArea.value = JSON.stringify(provider.body ?? {}, null, 2);
			bodyArea.placeholder = "{}";
			bodyArea.style.minHeight = "60px";
			bodyArea.oninput = () => {
				try {
					const parsed = JSON.parse(bodyArea.value || "{}");
					if (parsed && typeof parsed === "object") {
						provider.body = parsed;
						bodyArea.style.borderColor = "";
					}
				} catch {
					bodyArea.style.borderColor = "var(--color-danger)";
				}
			};
			sec2.body.append(field(t("settings.body"), bodyArea));
			container.append(sec2.container);
			const sec3 = section(t("settings.actions"));
			const status = el("div", "ojpp-status");
			const actions = el("div", "ojpp-row");
			const testBtn = el("button", "ojpp-btn", t("settings.test"));
			testBtn.onclick = async () => {
				testBtn.disabled = true;
				status.textContent = t("settings.testing");
				status.dataset.kind = "";
				try {
					const reply = await testConnection(options.request, draft, provider);
					status.dataset.kind = "ok";
					status.textContent = t("settings.testOk", { reply: reply.slice(0, 100) });
				} catch (error) {
					status.dataset.kind = "error";
					status.textContent = t("settings.testFail", { message: error instanceof Error ? error.message : String(error) });
				} finally {
					testBtn.disabled = false;
				}
			};
			const dupBtn = el("button", "ojpp-btn", t("settings.duplicate"));
			dupBtn.onclick = () => {
				const copy = {
					...structuredClone(provider),
					id: newId(),
					name: t("settings.providerCopySuffix", { name: provider.name })
				};
				draft.providers.push(copy);
				draft.activeProviderId = copy.id;
				switchView("edit", copy.id);
			};
			const delBtn = el("button", "ojpp-btn ojpp-btn-danger", t("settings.delete"));
			delBtn.onclick = () => {
				if (draft.providers.length <= 1) {
					status.dataset.kind = "error";
					status.textContent = t("settings.keepOne");
					return;
				}
				if (!confirm(t("settings.deleteConfirm", { name: provider.name || t("common.unnamed") }))) return;
				draft.providers = draft.providers.filter((p) => p.id !== provider.id);
				if (draft.activeProviderId === provider.id) draft.activeProviderId = draft.providers[0]?.id ?? null;
				switchView("providers");
			};
			actions.append(testBtn, dupBtn, delBtn);
			sec3.body.append(actions, status);
			container.append(sec3.container);
			requestAnimationFrame(() => {
				applyStagger(Array.from(container.querySelectorAll(".ojpp-section")), 0, 15);
			});
			return container;
		}
		function parsePairs(text) {
			const out = {};
			for (const line of text.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const index = trimmed.indexOf(":");
				if (index <= 0) continue;
				out[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim();
			}
			return out;
		}
		function renderPicker() {
			const container = el("div");
			container.style.padding = "16px";
			const search = input("", t("settings.search"));
			search.oninput = () => paint(search.value);
			container.append(search);
			const grid = el("div", "ojpp-preset-grid");
			container.append(grid);
			const paint = (query) => {
				grid.replaceChildren();
				const q = query.trim().toLowerCase();
				const matched = PROVIDER_PRESETS.filter((preset) => !q || preset.label.toLowerCase().includes(q) || preset.baseUrl.toLowerCase().includes(q)).sort((a, b) => a.key === "custom" ? -1 : b.key === "custom" ? 1 : 0);
				matched.forEach((preset) => {
					const item = el("button", "ojpp-preset-item");
					item.append(el("span", "ojpp-preset-name", preset.label));
					const meta = preset.baseUrl.replace(/^https?:\/\//, "");
					if (meta) item.append(el("span", "ojpp-preset-meta", meta));
					item.onclick = () => {
						const provider = createProvider(preset);
						draft.providers.push(provider);
						draft.activeProviderId = provider.id;
						switchView("edit", provider.id);
					};
					grid.append(item);
				});
				if (matched.length === 0) grid.append(el("div", "ojpp-hint", t("settings.noMatch")));
				requestAnimationFrame(() => {
					applyStagger(Array.from(grid.querySelectorAll(".ojpp-preset-item")), 0, 10);
				});
			};
			paint("");
			requestAnimationFrame(() => search.focus());
			return container;
		}
		function section(title, badge) {
			const container = el("div", "ojpp-section");
			const header = el("div", "ojpp-section-header");
			const titleEl = el("h4", "ojpp-section-title", title);
			header.append(titleEl);
			if (badge) header.append(el("span", "ojpp-section-badge", badge));
			const body = el("div", "ojpp-section-body");
			container.append(header, body);
			return {
				header,
				body,
				container
			};
		}
		function field(label, control) {
			const wrap = el("div", "ojpp-field");
			const labelNode = el("label", void 0, label);
			if (/^(INPUT|SELECT|TEXTAREA)$/.test(control.tagName)) {
				control.id ||= `ojpp-${newId()}`;
				labelNode.htmlFor = control.id;
			}
			wrap.append(labelNode, control);
			return wrap;
		}
		function input(value, placeholder = "", type = "text") {
			const input = el("input");
			input.type = type;
			input.value = value;
			input.placeholder = placeholder;
			return input;
		}
		function select(options, value) {
			const select = el("select");
			options.forEach(([val, label]) => {
				const option = el("option");
				option.value = val;
				option.textContent = label;
				option.selected = val === value;
				select.append(option);
			});
			return select;
		}
		function check(label, value, onChange) {
			const row = el("div", "ojpp-check");
			const input = el("input");
			input.type = "checkbox";
			input.checked = value;
			input.id = `ojpp-${newId()}`;
			input.onchange = () => onChange(input.checked);
			const labelEl = el("label", void 0, label);
			labelEl.htmlFor = input.id;
			row.append(input, labelEl);
			return row;
		}
		let closed = false;
		const close = () => {
			if (closed) return;
			closed = true;
			mask.style.transition = "opacity 300ms var(--ease-out)";
			mask.style.opacity = "0";
			panel.style.transition = "opacity 300ms var(--ease-out), transform 300ms var(--ease-out)";
			panel.style.opacity = "0";
			panel.style.transform = "scale(0.96) translateY(20px)";
			setTimeout(() => {
				mask.remove();
				document.removeEventListener("keydown", onKey);
				options.onClose();
			}, 300);
		};
		const onKey = (e) => {
			if (e.key === "Escape") close();
		};
		const persist = async (next) => {
			saveBtn.disabled = resetBtn.disabled = true;
			saveStatus.textContent = "";
			try {
				await options.onChange(next);
				close();
			} catch (error) {
				saveStatus.dataset.kind = "error";
				saveStatus.textContent = t("settings.saveFailed", { message: error instanceof Error ? error.message : String(error) });
			} finally {
				saveBtn.disabled = resetBtn.disabled = false;
			}
		};
		saveBtn.onclick = () => {
			if (!draft.activeProviderId && draft.providers[0]) draft.activeProviderId = draft.providers[0].id;
			persist(draft);
		};
		closeBtn.onclick = close;
		resetBtn.onclick = () => {
			if (confirm(t("settings.resetConfirm"))) persist(null);
		};
		let maskPress;
		mask.onpointerdown = (e) => {
			if (e.button !== 0) {
				maskPress = void 0;
				return;
			}
			maskPress = {
				id: e.pointerId,
				fromMask: e.target === mask
			};
		};
		mask.onpointercancel = () => {
			maskPress = void 0;
		};
		mask.onpointerup = (e) => {
			const press = maskPress;
			maskPress = void 0;
			if (!press || press.id !== e.pointerId || !press.fromMask) return;
			if (e.target !== mask) return;
			close();
		};
		panel.addEventListener("pointerdown", (e) => {
			maskPress = {
				id: e.pointerId,
				fromMask: false
			};
		}, true);
		document.addEventListener("keydown", onKey);
		switchView("main");
		document.body.append(mask);
		return close;
	}
	var CSS = `
/* ---------- CSS 变量：设计 Token ---------- */
:root {
  /* 缓动曲线 */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  
  /* 时长 */
  --duration-press: 100ms;
  --duration-tooltip: 150ms;
  --duration-dropdown: 200ms;
  --duration-modal: 300ms;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  
  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.08);
  
  /* 颜色 */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-bg-tertiary: #f1f3f5;
  --color-bg-hover: rgba(0, 0, 0, 0.04);
  
  --color-border: #e9ecef;
  --color-border-hover: #dee2e6;
  --color-border-focus: #4c6ef5;
  
  --color-text-primary: #212529;
  --color-text-secondary: #495057;
  --color-text-tertiary: #868e96;
  
  --color-accent: #4c6ef5;
  --color-accent-bg: rgba(76, 110, 245, 0.08);
  --color-accent-light: #dbe4ff;
  
  --color-success: #40c057;
  --color-success-bg: rgba(64, 192, 87, 0.08);
  --color-danger: #fa5252;
  --color-danger-bg: rgba(250, 82, 82, 0.08);
}

/* ---------- 工具栏 ---------- */
.ojpp-toolbar {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  margin-left: var(--spacing-sm);
  vertical-align: middle;
}

.ojpp-toolbar-right {
  float: right;
  margin-left: var(--spacing-md);
  margin-right: 0;
}

.ojpp-toolbar-block {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;
  width: 100%;
  margin: 2px 0 6px;
}

.ojpp-toolbar-block .ojpp-icon-btn {
  width: 28px;
  height: 28px;
}

.ojpp-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.ojpp-icon-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.ojpp-icon-btn:active {
  transform: scale(0.92);
}

.ojpp-icon-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

.ojpp-icon-btn[data-state="busy"] { 
  color: var(--color-accent); 
  pointer-events: none;
}
.ojpp-icon-btn[data-state="busy"] svg { 
  animation: ojpp-spin 1s linear infinite; 
}
.ojpp-icon-btn[data-state="done"] { color: var(--color-success); }
.ojpp-icon-btn[data-state="error"] { color: var(--color-danger); }
.ojpp-icon-btn[data-state="active"] { 
  color: var(--color-accent); 
  background: var(--color-accent-bg); 
}
.ojpp-icon-btn:disabled { 
  cursor: not-allowed; 
  opacity: 0.4;
}

@keyframes ojpp-spin { 
  to { transform: rotate(360deg); } 
}

.ojpp-icon-btn.ojpp-settings-floating {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 2147482998;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);
  transition: 
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out);
}

.ojpp-icon-btn.ojpp-settings-floating:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-lg);
  color: var(--color-text-primary);
}

.ojpp-icon-btn.ojpp-settings-floating:active {
  transform: scale(0.9);
  box-shadow: var(--shadow-sm);
}

/* ---------- 结果面板 ---------- */
.ojpp-result {
  margin: 12px 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-result:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-md);
}

.ojpp-result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  font-size: 12px;
}

.ojpp-result-title { 
  font-weight: 600; 
  color: var(--color-text-secondary); 
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.ojpp-result-status { 
  color: var(--color-text-tertiary); 
  flex: 1;
  font-size: 11px;
}
.ojpp-result-status[data-kind="error"] { color: var(--color-danger); }

.ojpp-result-actions { 
  display: flex; 
  gap: 2px;
  margin: -4px -4px -4px 0;
}
.ojpp-result-actions .ojpp-icon-btn { 
  width: 24px; 
  height: 24px; 
}

.ojpp-result-body {
  padding: 16px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-primary);
  overflow-x: auto;
}

.ojpp-result-body > :first-child { margin-top: 0; }
.ojpp-result-body > :last-child { margin-bottom: 0; }
.ojpp-result-body img { max-width: 100%; }
.ojpp-result-body table { 
  border-collapse: collapse; 
  margin: 12px 0; 
}
.ojpp-result-body th, 
.ojpp-result-body td {
  border: 1px solid var(--color-border);
  padding: 6px 10px;
}
.ojpp-result-body pre {
  background: var(--color-bg-secondary);
  padding: 12px;
  border-radius: var(--radius-sm);
  overflow-x: auto;
}
.ojpp-result-body code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  background: var(--color-bg-tertiary);
  padding: 2px 5px;
  border-radius: 3px;
}
.ojpp-result-body pre code { 
  background: none; 
  padding: 0; 
}

.ojpp-collapsed .ojpp-result-body { 
  display: none; 
}

.ojpp-streaming .ojpp-result-body > :last-child::after {
  content: '';
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  vertical-align: text-bottom;
  background: var(--color-accent);
  opacity: 1;
  animation: ojpp-caret 1s steps(2) infinite;
}
@keyframes ojpp-caret { 
  50% { opacity: 0; } 
}

.ojpp-md-source {
  white-space: pre-wrap;
  word-break: break-word;
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
}

/* ---------- 设置面板 ---------- */
.ojpp-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ojpp-mask-in var(--duration-modal) var(--ease-out);
}

@keyframes ojpp-mask-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ojpp-panel {
  width: min(620px, 100%);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  font-size: 13px;
  line-height: 1.5;
  animation: ojpp-panel-in var(--duration-modal) var(--ease-out);
  overflow: hidden;
}

@keyframes ojpp-panel-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.ojpp-panel * { 
  box-sizing: border-box; 
}

.ojpp-panel-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
}

.ojpp-back-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-back-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.ojpp-back-btn:active {
  transform: scale(0.92);
}

.ojpp-panel-head h3 { 
  margin: 0; 
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  letter-spacing: -0.01em;
}

.ojpp-panel-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-panel-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.ojpp-panel-close:active {
  transform: scale(0.9);
}

.ojpp-panel-body { 
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.ojpp-panel-foot {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

/* 分段 */
.ojpp-section {
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
}

.ojpp-section:last-child {
  border-bottom: none;
}

.ojpp-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.ojpp-section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.ojpp-section-badge {
  padding: 2px 6px;
  border-radius: 10px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1;
}

.ojpp-section-body {
  display: grid;
  gap: 10px;
}

/* 表单 */
.ojpp-field { 
  display: grid;
  gap: 5px;
}

.ojpp-field > label { 
  font-weight: 500;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.ojpp-panel input[type="text"],
.ojpp-panel input[type="password"],
.ojpp-panel input[type="number"],
.ojpp-panel select,
.ojpp-panel textarea {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font: inherit;
  font-size: 13px;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-panel textarea {
  height: auto;
  padding: 8px 10px;
  resize: vertical;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
}

.ojpp-panel input:hover,
.ojpp-panel select:hover,
.ojpp-panel textarea:hover {
  border-color: var(--color-border-hover);
}

.ojpp-panel input:focus, 
.ojpp-panel select:focus,
.ojpp-panel textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-accent-bg);
}

.ojpp-row { 
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

/* 复选框 */
.ojpp-check { 
  display: flex; 
  align-items: center; 
  gap: 8px;
  padding: 8px;
  border-radius: var(--radius-sm);
  transition: background var(--duration-tooltip) var(--ease-out);
  cursor: pointer;
}

.ojpp-check:hover {
  background: var(--color-bg-hover);
}

.ojpp-check input[type="checkbox"] { 
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
}

.ojpp-check label { 
  flex: 1;
  cursor: pointer;
  font-size: 12px;
  line-height: 1.4;
  margin: 0;
}

/* 提供商摘要 */
.ojpp-provider-summary {
  padding: 10px 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

/* 提供商列表 */
.ojpp-provider-list { 
  display: grid;
  gap: 6px;
}

.ojpp-provider-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-provider-item:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
  box-shadow: var(--shadow-sm);
}

.ojpp-provider-item:active {
  transform: scale(0.99);
}

.ojpp-provider-item[data-active="1"] { 
  border-color: var(--color-accent);
  background: var(--color-accent-bg);
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.06);
}

.ojpp-provider-item input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
}

.ojpp-provider-text { 
  min-width: 0;
  display: grid;
  gap: 2px;
}

.ojpp-provider-name { 
  font-weight: 600;
  font-size: 12px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ojpp-provider-meta { 
  color: var(--color-text-tertiary); 
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ojpp-provider-badge {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-success-bg);
  color: var(--color-success);
  font-size: 12px;
}

.ojpp-provider-edit { 
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-provider-edit:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.ojpp-provider-edit:active {
  transform: scale(0.9);
}

/* 添加按钮 */
.ojpp-add-provider {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  margin-bottom: 10px;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-tertiary);
  font: inherit;
  font-size: 24px;
  cursor: pointer;
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out);
}

.ojpp-add-provider:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-bg);
}

.ojpp-add-provider:active {
  transform: scale(0.99);
}

/* 预设网格 */
.ojpp-preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.ojpp-preset-item {
  display: grid;
  gap: 4px;
  padding: 10px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: 
    border-color var(--duration-tooltip) var(--ease-out),
    background var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-preset-item:hover { 
  border-color: var(--color-accent);
  background: var(--color-accent-bg);
  box-shadow: var(--shadow-sm);
}

.ojpp-preset-item:active {
  transform: scale(0.98);
}

.ojpp-preset-name { 
  font-weight: 600;
  font-size: 12px;
}

.ojpp-preset-meta { 
  font-size: 10px; 
  color: var(--color-text-tertiary); 
  word-break: break-all;
  line-height: 1.3;
}

/* 状态 */
.ojpp-status {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 120px;
  overflow-y: auto;
}

.ojpp-status[data-kind="error"] { 
  color: var(--color-danger);
  background: var(--color-danger-bg);
}

.ojpp-status[data-kind="ok"] { 
  color: var(--color-success);
  background: var(--color-success-bg);
}

/* 按钮 */
.ojpp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: 
    background var(--duration-tooltip) var(--ease-out),
    border-color var(--duration-tooltip) var(--ease-out),
    color var(--duration-tooltip) var(--ease-out),
    transform var(--duration-press) var(--ease-out),
    box-shadow var(--duration-tooltip) var(--ease-out);
}

.ojpp-btn:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
}

.ojpp-btn:active {
  transform: scale(0.96);
}

.ojpp-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.ojpp-btn-primary { 
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.ojpp-btn-primary:hover {
  background: #4263eb;
  border-color: #4263eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ojpp-btn-primary:active {
  background: #3b5bdb;
  border-color: #3b5bdb;
}

.ojpp-btn-danger { 
  color: var(--color-danger);
  border-color: transparent;
  background: transparent;
}

.ojpp-btn-danger:hover {
  background: var(--color-danger-bg);
  border-color: var(--color-danger);
}

.ojpp-btn:disabled { 
  cursor: not-allowed;
  opacity: 0.4;
  pointer-events: none;
}

/* Toast */
.ojpp-toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2147483001;
  background: var(--color-text-primary);
  color: white;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  max-width: 320px;
  animation: ojpp-toast-in var(--duration-dropdown) var(--ease-out);
  backdrop-filter: blur(12px);
}

@keyframes ojpp-toast-in {
  from {
    opacity: 0;
    transform: translateY(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ojpp-toast[data-kind="error"] { 
  background: var(--color-danger);
}

.ojpp-toast[data-kind="success"] {
  background: var(--color-success);
}

/* 响应式 */
@media (max-width: 640px) {
  .ojpp-panel {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .ojpp-preset-grid {
    grid-template-columns: 1fr;
  }
  
  .ojpp-row {
    grid-template-columns: 1fr;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .ojpp-icon-btn:active,
  .ojpp-btn:active,
  .ojpp-provider-item:active,
  .ojpp-preset-item:active {
    transform: none;
  }
}
`;
	var DARK_CSS = `
html[data-ojpp-theme="dark"] {
  --color-bg-primary: #1a1b1e;
  --color-bg-secondary: #25262b;
  --color-bg-tertiary: #2c2e33;
  --color-bg-hover: rgba(255, 255, 255, 0.05);
  
  --color-border: #373a40;
  --color-border-hover: #495057;
  --color-border-focus: #748ffc;
  
  --color-text-primary: #ececec;
  --color-text-secondary: #c1c2c5;
  --color-text-tertiary: #909296;
  
  --color-accent: #748ffc;
  --color-accent-bg: rgba(116, 143, 252, 0.12);
  --color-accent-light: rgba(116, 143, 252, 0.15);
  
  --color-success: #51cf66;
  --color-success-bg: rgba(81, 207, 102, 0.12);
  --color-danger: #ff6b6b;
  --color-danger-bg: rgba(255, 107, 107, 0.12);
  
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 12px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4);
}

html[data-ojpp-theme="dark"] .ojpp-mask {
  background: rgba(0, 0, 0, 0.6);
}

html[data-ojpp-theme="dark"] .ojpp-icon-btn.ojpp-settings-floating {
  background: rgba(37, 38, 43, 0.92);
}

html[data-ojpp-theme="dark"] .ojpp-icon-btn.ojpp-settings-floating:hover {
  background: rgba(37, 38, 43, 0.98);
}

html[data-ojpp-theme="dark"] .ojpp-panel {
  border: 1px solid var(--color-border);
}

html[data-ojpp-theme="dark"] .ojpp-toast {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

html[data-ojpp-theme="dark"] .ojpp-toast[data-kind="error"] {
  background: var(--color-danger);
  color: white;
  border: none;
}

html[data-ojpp-theme="dark"] .ojpp-toast[data-kind="success"] {
  background: var(--color-success);
  color: white;
  border: none;
}
`;
	var timer;
	var currentToast;
	function toast(message, kind = "info") {
		if (currentToast) {
			const old = currentToast;
			old.style.animation = "none";
			old.style.transition = "opacity var(--duration-dropdown) var(--ease-out), transform var(--duration-dropdown) var(--ease-out)";
			old.style.opacity = "0";
			old.style.transform = "translateY(100%) scale(0.9)";
			setTimeout(() => old.remove(), 200);
		}
		clearTimeout(timer);
		const node = document.createElement("div");
		node.className = "ojpp-toast";
		node.dataset.kind = kind;
		node.setAttribute("role", kind === "error" ? "alert" : "status");
		node.textContent = message;
		document.body.append(node);
		currentToast = node;
		timer = setTimeout(() => {
			if (node === currentToast) {
				node.style.transition = "opacity var(--duration-dropdown) var(--ease-out), transform var(--duration-dropdown) var(--ease-out)";
				node.style.opacity = "0";
				node.style.transform = "translateY(100%) scale(0.9)";
				setTimeout(() => {
					node.remove();
					if (currentToast === node) currentToast = void 0;
				}, 200);
			}
		}, kind === "error" ? 6e3 : 3e3);
	}
	async function startApp(platform, site) {
		if (document.readyState === "loading") await new Promise((resolve) => document.addEventListener("DOMContentLoaded", () => resolve(), { once: true }));
		let settings = await loadSettings(platform.storage);
		setLocale(resolveLocale(settings.locale));
		applyTheme(settings.theme);
		const style = document.createElement("style");
		style.textContent = CSS + (site.styles ?? "") + DARK_CSS + (site.darkStyles ?? "");
		document.head.append(style);
		const stopThemeWatch = watchSystemTheme(() => applyTheme(settings.theme));
		const stopInlineWatch = watchInlineColors();
		let closeSettings;
		const settingsButton = iconButton(ICON_SETTINGS, t("app.settingsTitle", { name: APP_NAME }), "ojpp-settings-btn");
		settingsButton.addEventListener("click", () => {
			if (closeSettings) return;
			closeSettings = openSettingsPanel({
				settings,
				request: platform.request,
				async onChange(next) {
					const updated = next ?? defaultSettings();
					await saveSettings(platform.storage, updated);
					settings = updated;
					setLocale(resolveLocale(updated.locale));
					applyTheme(settings.theme);
					toast(t("app.settingsSaved"));
					if (getLocale() !== renderedLocale) remountAll();
				},
				onClose() {
					closeSettings = void 0;
				}
			});
		});
		const mounted = new Map();
		let renderedLocale = getLocale();
		const remountAll = () => {
			for (const handle of mounted.values()) handle.dispose();
			mounted.clear();
			settingsButton.remove();
			renderedLocale = getLocale();
			reconcile();
		};
		const reconcile = () => {
			const sections = site.collectSections(document);
			if (!settingsButton.isConnected) site.mountSettingsButton(settingsButton, document);
			if (sections.length === 0) {
				for (const handle of mounted.values()) handle.dispose();
				mounted.clear();
				return;
			}
			const active = new Set(sections.map((section) => section.content));
			for (const [content, handle] of mounted) if (!active.has(content) || !handle.toolbar.isConnected) {
				handle.dispose();
				mounted.delete(content);
			}
			for (const section of sections) {
				if (mounted.has(section.content)) continue;
				const handle = mountSection(section, {
					platform,
					getSettings: () => settings,
					prepareContent: (root) => site.prepareContent(root)
				});
				mounted.set(section.content, handle);
				if (settings.autoTranslate && section.kind === "statement") handle.translate();
			}
		};
		reconcile();
		const stopObserving = site.observe(document, reconcile);
		return () => {
			stopObserving();
			stopThemeWatch();
			stopInlineWatch();
			closeSettings?.();
			for (const handle of mounted.values()) handle.dispose();
			mounted.clear();
			settingsButton.remove();
			style.remove();
		};
	}
	var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
	var _GM_setClipboard = (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
	var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
	var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
	var request = (req) => new Promise((resolve, reject) => {
		if (req.signal?.aborted) {
			reject(new DOMException("Aborted", "AbortError"));
			return;
		}
		const cleanup = () => req.signal?.removeEventListener("abort", onAbort);
		const fail = (error) => {
			cleanup();
			reject(error);
		};
		const handle = _GM_xmlhttpRequest({
			method: req.method,
			url: req.url,
			headers: req.headers,
			data: req.body,
			timeout: req.timeoutMs,
			responseType: "text",
			onload(res) {
				cleanup();
				resolve({
					status: res.status,
					statusText: res.statusText,
					text: res.responseText
				});
			},
			onerror: () => fail(new Error(t("error.network"))),
			ontimeout: () => fail(new Error(t("error.timeout"))),
			onabort: () => fail(new DOMException("Aborted", "AbortError"))
		});
		function onAbort() {
			fail(new DOMException("Aborted", "AbortError"));
			handle.abort();
		}
		req.signal?.addEventListener("abort", onAbort, { once: true });
	});
	function isReadableStream(value) {
		return !!value && typeof value === "object" && typeof value.getReader === "function";
	}
	function decodeStreamChunk(decoder, value, final = false) {
		if (typeof value === "string") return value;
		if (value instanceof ArrayBuffer) return decoder.decode(new Uint8Array(value), { stream: !final });
		if (ArrayBuffer.isView(value)) return decoder.decode(new Uint8Array(value.buffer, value.byteOffset, value.byteLength), { stream: !final });
		return "";
	}
	var stream = (req) => new Promise((resolve, reject) => {
		if (req.signal?.aborted) {
			reject(new DOMException("Aborted", "AbortError"));
			return;
		}
		let settled = false;
		let accumulated = "";
		let readerTask = null;
		let fallbackTimer;
		const decoder = new TextDecoder();
		const cleanup = () => {
			if (fallbackTimer) clearTimeout(fallbackTimer);
			req.signal?.removeEventListener("abort", onAbort);
		};
		const fail = (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(error);
		};
		const push = (value, final = false) => {
			if (settled) return;
			const text = decodeStreamChunk(decoder, value, final);
			if (!text) return;
			accumulated += text;
			req.onChunk?.(accumulated);
		};
		const consume = (response) => {
			if (readerTask) return readerTask;
			if (!isReadableStream(response)) return Promise.resolve();
			readerTask = (async () => {
				const reader = response.getReader();
				try {
					for (;;) {
						const { done, value } = await reader.read();
						if (done) break;
						push(value);
					}
					push(decoder.decode(), true);
				} finally {
					reader.releaseLock?.();
				}
			})();
			return readerTask;
		};
		const finish = (res, waitMs = 0) => {
			const complete = () => {
				if (settled) return;
				settled = true;
				cleanup();
				const text = accumulated || (typeof res.responseText === "string" ? res.responseText : "");
				resolve({
					status: res.status,
					statusText: res.statusText,
					text
				});
			};
			consume(res.response).then(complete).catch((error) => {
				fail(error instanceof Error ? error : new Error(t("error.streamRead")));
			});
			if (waitMs > 0) fallbackTimer = setTimeout(complete, waitMs);
		};
		const handle = _GM_xmlhttpRequest({
			method: req.method,
			url: req.url,
			headers: req.headers,
			data: req.body,
			timeout: req.timeoutMs,
			responseType: "stream",
			partialSize: 64,
			onreadystatechange(res) {
				if ((res.readyState ?? 0) >= 2) consume(res.response).catch((error) => {
					fail(error instanceof Error ? error : new Error(t("error.streamRead")));
				});
			},
			onload: (res) => finish(res, 250),
			onloadend: finish,
			onerror: () => fail(new Error(t("error.network"))),
			ontimeout: () => fail(new Error(t("error.timeout"))),
			onabort: () => fail(new DOMException("Aborted", "AbortError"))
		});
		function onAbort() {
			fail(new DOMException("Aborted", "AbortError"));
			handle.abort();
		}
		req.signal?.addEventListener("abort", onAbort, { once: true });
	});
	function createUserscriptPlatform() {
		if ([
			_GM_getValue,
			_GM_setValue,
			_GM_xmlhttpRequest,
			_GM_setClipboard
		].some((api) => typeof api !== "function")) throw new Error(t("error.notUserscript"));
		return {
			id: "userscript",
			storage: {
				async get(key) {
					return _GM_getValue(key, void 0);
				},
				async set(key, value) {
					_GM_setValue(key, value);
				}
			},
			request,
			stream,
			async writeClipboard(text) {
				_GM_setClipboard(text, "text");
			}
		};
	}
	var MATHJAX_RENDERED = [
		".MathJax",
		".MathJax_Display",
		".MathJax_Preview",
		".MathJax_CHTML",
		".MathJax_SVG",
		".MathJax_SVG_Display",
		".mjx-chtml",
		".MJXc-display",
		".MJX_Assistive_MathML",
		".MJXp-math"
	].join(", ");
	var TEX_CHAR_MAP = {
		"×": "\\times ",
		"≤": "\\le ",
		"≥": "\\ge ",
		"≠": "\\ne ",
		"±": "\\pm ",
		"∞": "\\infty ",
		"·": "\\cdot ",
		"−": "-",
		"–": "-",
		"⌊": "\\lfloor ",
		"⌋": "\\rfloor ",
		"⌈": "\\lceil ",
		"⌉": "\\rceil ",
		"∑": "\\sum ",
		"∏": "\\prod ",
		"→": "\\to ",
		"⋅": "\\cdot "
	};
	function texSpanToLatex(node) {
		let out = "";
		for (const child of node.childNodes) {
			if (child.nodeType === 3) {
				const text = child.textContent ?? "";
				let mapped = "";
				for (const ch of text) mapped += TEX_CHAR_MAP[ch] ?? ch;
				out += mapped;
				continue;
			}
			if (child.nodeType !== 1) continue;
			const el = child;
			const tag = el.tagName.toLowerCase();
			const inner = texSpanToLatex(el);
			if (tag === "i" || tag === "em") out += /^[a-zA-Z]$/.test(inner) ? inner : `\\mathrm{${inner}}`;
			else if (tag === "sub") out += `_{${inner}}`;
			else if (tag === "sup") out += `^{${inner}}`;
			else out += inner;
		}
		return out.replace(/\u2009|\u00a0|\u2002|\u2003/g, " ").trim();
	}
	function isStandaloneSpan(span) {
		const parent = span.closest("p, div");
		if (!parent) return false;
		return (parent.textContent ?? "").trim() === (span.textContent ?? "").trim() && (parent.textContent ?? "").trim().length > 0;
	}
	var codeforces = {
		id: "codeforces",
		get name() {
			return t("site.codeforces");
		},
		hosts: [
			"codeforces.com",
			"m1.codeforces.com",
			"m2.codeforces.com",
			"codeforces.ml"
		],
		styles: `
    /* 齿轮放在登录区、用户名左边 */
    .ojpp-codeforces-settings {
      display: inline-flex; align-items: center;
      margin-right: 6px; vertical-align: middle;
    }
    .ojpp-codeforces-settings .ojpp-icon-btn {
      width: 22px; height: 22px; vertical-align: middle;
    }
  `,
		darkStyles: `
    /* ---------- 页面骨架 ---------- */
    html[data-ojpp-theme="dark"],
    html[data-ojpp-theme="dark"] body,
    html[data-ojpp-theme="dark"] #body,
    html[data-ojpp-theme="dark"] #pageContent,
    html[data-ojpp-theme="dark"] .content-with-sidebar {
      background: #1c2128 !important;
      color: #cdd9e5;
    }

    /* ---------- 题面 ---------- */
    html[data-ojpp-theme="dark"] .ttypography,
    html[data-ojpp-theme="dark"] .problem-statement {
      color: #cdd9e5;
    }
    /* 题面容器自带背景：站点给 .ttypography 和 .problem-statement 都设过底色，
       暗色下会与页面背景形成色差。全部置为透明，让它们统一继承页面背景。 */
    html[data-ojpp-theme="dark"] .problem-statement,
    html[data-ojpp-theme="dark"] .problemindexholder,
    html[data-ojpp-theme="dark"] .problem-frames,
    html[data-ojpp-theme="dark"] .ttypography {
      background-color: transparent !important;
    }
    html[data-ojpp-theme="dark"] .problem-statement .header .title {
      color: #e6edf3;
    }
    /* 时限、内存限制的标签是 #666，暗色下几乎看不见 */
    html[data-ojpp-theme="dark"] .problem-statement .property-title,
    html[data-ojpp-theme="dark"] .problem-statement .section-title {
      color: #e6edf3;
    }
    html[data-ojpp-theme="dark"] .problem-statement .section-title {
      border-bottom-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .ttypography a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .problem-statement a:not(.rated-user):not([class*="user-"]) {
      color: #539bf5;
    }

    /* 样例的输入/输出：站点把 pre 设成 #efefef，必须显式覆盖 */
    html[data-ojpp-theme="dark"] .problem-statement .sample-tests pre,
    html[data-ojpp-theme="dark"] .problem-statement pre {
      background-color: #22272e !important;
      color: #cdd9e5;
    }
    /* 样例按行高亮：偶数行 #E0E0E0，奇数行白 */
    html[data-ojpp-theme="dark"] .problem-statement .test-example-line-even {
      background-color: #2d333b !important;
    }
    html[data-ojpp-theme="dark"] .problem-statement .test-example-line-odd {
      background-color: #22272e !important;
    }
    /* 站点脚本会把高亮的测试行染成 #FFFDE7（内联样式），
       以及配套的 .testCaseMarker 标记块。
       这里只覆盖带内联高亮色的行，不要写成 .test-example-line，
       否则会盖掉奇偶行的交替底色。 */
    html[data-ojpp-theme="dark"] .problem-statement [style*="FFFDE7"],
    html[data-ojpp-theme="dark"] .problem-statement [style*="fffde7"] {
      background-color: #3a3320 !important;
    }
    html[data-ojpp-theme="dark"] .testCaseMarker {
      border-color: #d9a441 !important;
    }
    html[data-ojpp-theme="dark"] .notice {
      background: #2d333b;
      color: #cdd9e5;
      border-color: #444c56;
    }
    html[data-ojpp-theme="dark"] .problem-statement .sample-test,
    html[data-ojpp-theme="dark"] .problem-statement .sample-test .input,
    html[data-ojpp-theme="dark"] .problem-statement .sample-test .output {
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .problem-statement .sample-test .title {
      color: #909dab;
    }
    /* 样例块的输入输出标题栏（站点用 .input .title / .output .title） */
    html[data-ojpp-theme="dark"] .problem-statement .input .title,
    html[data-ojpp-theme="dark"] .problem-statement .output .title {
      background: #2d333b;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .problem-statement .input-output-copier {
      color: #909dab;
      border-color: #444c56;
    }
    /* 悬停时站点把背景设成 #def，暗色下会闪一下亮蓝 */
    html[data-ojpp-theme="dark"] .problem-statement .input-output-copier:hover,
    html[data-ojpp-theme="dark"] .copier-small:hover {
      background-color: #373e47 !important;
      color: #cdd9e5 !important;
    }

    html[data-ojpp-theme="dark"] .problem-statement code,
    html[data-ojpp-theme="dark"] .ttypography code {
      background: rgba(99, 110, 123, .4);
      color: #cdd9e5;
    }
    /* 站点把 .ttypography 里的 pre 设成深红（#800000），
       暗色下像一块深红色字。统一改成正常文本色 */
    html[data-ojpp-theme="dark"] .problem-statement pre,
    html[data-ojpp-theme="dark"] .ttypography pre {
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .problem-statement table,
    html[data-ojpp-theme="dark"] .ttypography table,
    html[data-ojpp-theme="dark"] .problem-statement th,
    html[data-ojpp-theme="dark"] .problem-statement td,
    html[data-ojpp-theme="dark"] .ttypography th,
    html[data-ojpp-theme="dark"] .ttypography td {
      border-color: #373e47;
    }
    /* 题面里的引用与分隔线 */
    html[data-ojpp-theme="dark"] .problem-statement blockquote,
    html[data-ojpp-theme="dark"] .ttypography blockquote {
      border-left-color: #373e47;
      color: #adbac7;
    }
    html[data-ojpp-theme="dark"] .problem-statement hr,
    html[data-ojpp-theme="dark"] .ttypography hr {
      border-color: #373e47;
    }

    /* ---------- 折叠博客底部的渐隐 ---------- */
    /* /top 折叠的博文在底部用 ::before 铺一条 rgba(255,255,255,0)→#fff
       的渐隐遮罩，暗色下是一条浅蓝白带。改成渐隐到页面底色 */
    html[data-ojpp-theme="dark"] .collapsible-topic.collapsed .content .collapsible-topic-options::before {
      background-image: linear-gradient(rgba(28, 33, 40, 0), #1c2128) !important;
    }

    /* ---------- 公式 ---------- */
    html[data-ojpp-theme="dark"] .MathJax,
    html[data-ojpp-theme="dark"] .MathJax_Preview,
    html[data-ojpp-theme="dark"] .MathJax_Display,
    html[data-ojpp-theme="dark"] .MJXp-math,
    html[data-ojpp-theme="dark"] .mjx-chtml {
      color: #cdd9e5 !important;
    }

    /* ---------- 侧边栏信息框 ---------- */
    /* .roundbox 的圆角是四张 png 图片，暗色下会露出白角，直接去掉 */
    html[data-ojpp-theme="dark"] .roundbox,
    html[data-ojpp-theme="dark"] .sidebox {
      background: #22272e !important;
      border-color: #373e47;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .roundbox .roundbox-lt,
    html[data-ojpp-theme="dark"] .roundbox .roundbox-rt,
    html[data-ojpp-theme="dark"] .roundbox .roundbox-lb,
    html[data-ojpp-theme="dark"] .roundbox .roundbox-rb {
      background-image: none;
    }
    html[data-ojpp-theme="dark"] .roundbox .caption,
    html[data-ojpp-theme="dark"] .sidebox .caption {
      color: #e6edf3;
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .roundbox .titled,
    html[data-ojpp-theme="dark"] .roundbox .bottom-links {
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .roundbox .bottom-links,
    html[data-ojpp-theme="dark"] .roundbox .dark {
      background-color: #2d333b;
    }
    /* 侧边栏里的“Practice”按钮：站点是白底，暗色下太刺眼 */
    html[data-ojpp-theme="dark"] .sidebox .button,
    html[data-ojpp-theme="dark"] .sidebox a.button,
    html[data-ojpp-theme="dark"] .roundbox a.button {
      background: #2d333b !important;
      color: #cdd9e5 !important;
      border-color: #444c56;
    }
    /* 收藏星星那一行 */
    html[data-ojpp-theme="dark"] .sidebox .favourite,
    html[data-ojpp-theme="dark"] .sidebox .star {
      background: #2d333b;
    }

    /* ---------- 表格（最近提交、标签等） ---------- */
    html[data-ojpp-theme="dark"] .datatable,
    html[data-ojpp-theme="dark"] .datatable th,
    html[data-ojpp-theme="dark"] .datatable td,
    /* datatable 外面还有一层包装容器，站点给它设了 #e1e1e1 */
    html[data-ojpp-theme="dark"] .datatable > div,
    html[data-ojpp-theme="dark"] div.datatable > div {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    /* 分页信息那一行（“1-50 of 1234”） */
    html[data-ojpp-theme="dark"] .datatable .pagination,
    html[data-ojpp-theme="dark"] .datatable > div:last-child {
      background: #22272e !important;
      color: #909dab;
    }
    html[data-ojpp-theme="dark"] .datatable th {
      background: #2d333b;
    }
    html[data-ojpp-theme="dark"] .datatable tr:hover td {
      background: #2d333b;
    }
    html[data-ojpp-theme="dark"] .roundbox table.rtable td,
    html[data-ojpp-theme="dark"] .roundbox table.rtable th {
      border-color: #373e47;
    }
    /* 提交结果的颜色：按站点真实语义映射到暗色可读版——
       CF 亮态是 accepted=#00aa00 绿、rejected(WA/TLE/RE)=#0000aa 深蓝、
       failed/hacked=红、waiting=灰。暗色里换成对应的可读色 */
    html[data-ojpp-theme="dark"] .verdict-accepted,
    html[data-ojpp-theme="dark"] .verdict-accepted-challenged,
    html[data-ojpp-theme="dark"] .verdict-successful-challenge {
      color: #57ab5a !important;
    }
    /* rejected 在 CF 是深蓝色（WA/TLE/RE），暗色下提亮成可读蓝 */
    html[data-ojpp-theme="dark"] .verdict-rejected,
    html[data-ojpp-theme="dark"] .verdict-unsuccessful-challenge,
    html[data-ojpp-theme="dark"] .verdict-format-judged {
      color: #8ab4ff !important;
    }
    html[data-ojpp-theme="dark"] .verdict-failed,
    html[data-ojpp-theme="dark"] .verdict-challenged,
    html[data-ojpp-theme="dark"] .verdict-wrong-answer {
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .verdict-waiting,
    html[data-ojpp-theme="dark"] .verdict-in-queue,
    html[data-ojpp-theme="dark"] .verdict-judging {
      color: #909dab !important;
    }
    /* 逐条测试的 verdict_type：welldone=OK 绿、error=失败红、pending 灰 */
    html[data-ojpp-theme="dark"] .welldone,
    html[data-ojpp-theme="dark"] .welldone .verdict {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .verdict_type.error,
    html[data-ojpp-theme="dark"] .verdict_type.error .verdict {
      color: #f85149 !important;
    }
    /* 未判定的 "Verdict: ?" 用灰，别用亮白 */
    html[data-ojpp-theme="dark"] .verdict_type:not(.welldone):not(.error),
    html[data-ojpp-theme="dark"] .verdict_type:not(.welldone):not(.error) .verdict {
      color: #909dab !important;
    }
    /* 比赛状态（Finished / Running 等）：站点用 #3b5998 深蓝，深底上看不清 */
    html[data-ojpp-theme="dark"] .contest-state-phase {
      color: #79b8ff !important;
    }
    /* 页脚链接：站点用 #0000cc 深蓝 */
    html[data-ojpp-theme="dark"] #footer,
    html[data-ojpp-theme="dark"] #footer a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .switchToMobile {
      color: #768390 !important;
    }
    html[data-ojpp-theme="dark"] #footer a:hover {
      color: #adbac7 !important;
    }
    /* 标签块 */
    html[data-ojpp-theme="dark"] .tag-box,
    html[data-ojpp-theme="dark"] .tag-box a,
    html[data-ojpp-theme="dark"] .roundbox .tag-box {
      background: #2d333b;
      border-color: #444c56;
      color: #cdd9e5;
    }

    /* ---------- 顶部导航 ---------- */
    /* 站点给菜单项设了 color:#000（style.css 的 .menu-list li a），
       背景被我们压暗后黑字就看不见了 */
    html[data-ojpp-theme="dark"] .menu-list li a {
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .menu-list li a:hover {
      color: #e6edf3 !important;
    }
    html[data-ojpp-theme="dark"] .menu-list li.current {
      border-bottom-color: #539bf5;
    }

    /* 顶部区域分两条：上面是 logo / 登录，下面是主导航。
       站点本来就是这样分的（#header 与 .menu-box）。
       上条与页面底色一致，不留色块；下条稍亮一点，把导航栏衬托出来。 */
    html[data-ojpp-theme="dark"] #header {
      background: #1c2128 !important;
      border-color: transparent !important;
    }
    html[data-ojpp-theme="dark"] .menu-box,
    html[data-ojpp-theme="dark"] .roundbox.menu-box,
    html[data-ojpp-theme="dark"] .menu-list-container {
      background: #2a313c !important;
      border-color: transparent !important;
    }
    /* 两层之间加一条细线，让分隔看得出来 */
    html[data-ojpp-theme="dark"] .menu-box {
      border-top: 1px solid #3b434e !important;
    }
    /* 登录区与语言选择：站点用的是深蓝 #0000cc，在深底上几乎看不清 */
    html[data-ojpp-theme="dark"] #header a,
    html[data-ojpp-theme="dark"] .lang-chooser a {
      color: #79b8ff !important;
    }
    html[data-ojpp-theme="dark"] #header a:hover,
    html[data-ojpp-theme="dark"] .lang-chooser a:hover {
      color: #a5d6ff !important;
    }

    /* Codeforces 的 logo 是白底深字的 PNG（无 alpha）。
       invert 把白底变黑、深字变亮，再用 screen 混合让黑色消失，
       于是白底透明、文字反色，不需要额外的图片资源。 */
    html[data-ojpp-theme="dark"] #header img[alt="Codeforces"] {
      filter: invert(1) hue-rotate(180deg) brightness(1.1);
      mix-blend-mode: screen;
    }

    /* ---------- 二级菜单（题目页的 Problems / Submit code 那一排） ---------- */
    /* 站点的当前项背景是两张 PNG 圆角图（backLava/leftLava）定位出来的，
       暗色下会形成一条条横向色带。全部去掉图片，改成扁平的纯色。 */
    html[data-ojpp-theme="dark"] .second-level-menu,
    html[data-ojpp-theme="dark"] .second-level-menu-list {
      background: transparent !important;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava,
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava .leftLava,
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava .bottomLava,
    html[data-ojpp-theme="dark"] .second-level-menu-list li.backLava .cornerLava {
      background-image: none !important;
      background-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li a {
      background: transparent !important;
      color: #adbac7 !important;
      border: none;
      border-radius: 4px;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li a:hover {
      color: #e6edf3 !important;
    }
    html[data-ojpp-theme="dark"] .second-level-menu-list li.current a {
      color: #e6edf3 !important;
    }

    /* ---------- 全局链接 ---------- */
    /* 站点几乎所有正文链接都是 #0000cc 这种深蓝，深底上对比不足。
       这是提交记录、状态、博客、题面里最普遍的问题，所以放在最前面兜底。 */
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):visited {
      color: #539bf5;
    }
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):hover,
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):active {
      color: #79b8ff;
    }
    /* 已访问过的链接不要变成紫色，暗色下同样难读 */
    html[data-ojpp-theme="dark"] a:not(.rated-user):not([class*="user-"]):visited {
      color: #b083f0;
    }

    /* ---------- 评级颜色 ---------- */
    /* 站点用 .user-* 类给用户名上色，色值是纯红/纯蓝/gray 这类，
       在深底上要么刺眼要么看不清。这里换成同色系的亮版本，
       保持“颜色代表段位”这个语义，只调整明度。 */
    /* 用户名几乎总是 <a class="rated-user user-段位">。
       段位色必须同时命中 a 和普通元素：站点自己的 a { color } 会跟
       .user-* 抢，而 color: inherit 是错的——那会继承父元素（通常是
       没有段位类的 td），段位色就整个丢了。
       所以这里对两类元素都直接写死颜色，并且一律 !important。 */
    html[data-ojpp-theme="dark"] .user-black,
    html[data-ojpp-theme="dark"] a.user-black { color: #9aa4b2 !important; }
    html[data-ojpp-theme="dark"] .user-gray,
    html[data-ojpp-theme="dark"] a.user-gray { color: #9aa4b2 !important; }
    html[data-ojpp-theme="dark"] .user-green,
    html[data-ojpp-theme="dark"] a.user-green { color: #57ab5a !important; }
    html[data-ojpp-theme="dark"] .user-cyan,
    html[data-ojpp-theme="dark"] a.user-cyan { color: #39c5bb !important; }
    html[data-ojpp-theme="dark"] .user-blue,
    html[data-ojpp-theme="dark"] a.user-blue { color: #539bf5 !important; }
    html[data-ojpp-theme="dark"] .user-violet,
    html[data-ojpp-theme="dark"] a.user-violet { color: #c297ff !important; }
    html[data-ojpp-theme="dark"] .user-orange,
    html[data-ojpp-theme="dark"] a.user-orange { color: #f0883e !important; }
    html[data-ojpp-theme="dark"] .user-red,
    html[data-ojpp-theme="dark"] a.user-red { color: #f85149 !important; }
    /* 站点还按具体分数给类名（user-1200 ~ user-4000），
       这些也是段位色：>=4000 红，2400-3999 橙，2100-2399 紫，1600-2099 蓝，
       1200-1599 青，<1200 灰。覆盖最常见的几档。 */
    html[data-ojpp-theme="dark"] .user-4000,
    html[data-ojpp-theme="dark"] a.user-4000,
    html[data-ojpp-theme="dark"] [class*="user-4"] { color: #f85149 !important; }
    html[data-ojpp-theme="dark"] [class*="user-3"],
    html[data-ojpp-theme="dark"] [class*="user-2"],
    html[data-ojpp-theme="dark"] [class*="user-24"],
    html[data-ojpp-theme="dark"] [class*="user-25"],
    html[data-ojpp-theme="dark"] [class*="user-26"],
    html[data-ojpp-theme="dark"] [class*="user-27"],
    html[data-ojpp-theme="dark"] [class*="user-28"],
    html[data-ojpp-theme="dark"] [class*="user-29"],
    html[data-ojpp-theme="dark"] [class*="user-30"],
    html[data-ojpp-theme="dark"] [class*="user-31"],
    html[data-ojpp-theme="dark"] [class*="user-32"],
    html[data-ojpp-theme="dark"] [class*="user-33"],
    html[data-ojpp-theme="dark"] [class*="user-34"],
    html[data-ojpp-theme="dark"] [class*="user-35"],
    html[data-ojpp-theme="dark"] [class*="user-36"],
    html[data-ojpp-theme="dark"] [class*="user-37"],
    html[data-ojpp-theme="dark"] [class*="user-38"],
    html[data-ojpp-theme="dark"] [class*="user-39"] { color: #f0883e !important; }
    html[data-ojpp-theme="dark"] [class*="user-21"],
    html[data-ojpp-theme="dark"] [class*="user-22"],
    html[data-ojpp-theme="dark"] [class*="user-23"] { color: #c297ff !important; }
    html[data-ojpp-theme="dark"] [class*="user-16"],
    html[data-ojpp-theme="dark"] [class*="user-17"],
    html[data-ojpp-theme="dark"] [class*="user-18"],
    html[data-ojpp-theme="dark"] [class*="user-19"],
    html[data-ojpp-theme="dark"] [class*="user-20"] { color: #539bf5 !important; }
    html[data-ojpp-theme="dark"] [class*="user-12"],
    html[data-ojpp-theme="dark"] [class*="user-13"],
    html[data-ojpp-theme="dark"] [class*="user-14"],
    html[data-ojpp-theme="dark"] [class*="user-15"] { color: #39c5bb !important; }
    html[data-ojpp-theme="dark"] [class*="user-1"],
    html[data-ojpp-theme="dark"] [class*="user-0"] { color: #9aa4b2 !important; }
    html[data-ojpp-theme="dark"] .user-legendary,
    html[data-ojpp-theme="dark"] a.user-legendary { color: #f85149 !important; }
    /* admin/头衔类没有段位色，给个中性亮色 */
    html[data-ojpp-theme="dark"] .user-admin,
    html[data-ojpp-theme="dark"] a.user-admin { color: #cdd9e5 !important; }
    /* legendary 段位的首字母被站点强制成黑色（.user-legendary::first-letter），
       深底上就变成“首字母看不见、其余红色”。改成白色首字母。
       注意 ::first-letter 只能对块级容器生效，站点在 span 上也做了处理。 */
    html[data-ojpp-theme="dark"] .user-legendary::first-letter,
    html[data-ojpp-theme="dark"] a.user-legendary::first-letter,
    html[data-ojpp-theme="dark"] .legendary-user-first-letter,
    html[data-ojpp-theme="dark"] .legendary-user-first-letter::first-letter {
      color: #ffffff !important;
    }
    /* 段位色写在里面的 span 上时（站点有这种结构），别被外层规则盖掉 */
    html[data-ojpp-theme="dark"] .rated-user span[class*="user-"] {
      color: inherit !important;
    }

    /* ---------- 表格（提交记录、状态、排行榜等） ---------- */
    /* 站点给状态表用了浅色底与斑马纹，暗色下是整片亮块 */
    html[data-ojpp-theme="dark"] table.status-frame-datatable,
    html[data-ojpp-theme="dark"] .status-frame-datatable,
    html[data-ojpp-theme="dark"] table.problems,
    html[data-ojpp-theme="dark"] table.standings,
    html[data-ojpp-theme="dark"] .datatable,
    html[data-ojpp-theme="dark"] table {
      background: #22272e;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .status-frame-datatable tr,
    html[data-ojpp-theme="dark"] .datatable tr,
    html[data-ojpp-theme="dark"] table tr {
      background: #22272e !important;
      border-color: #373e47 !important;
    }
    /* 斑马纹：隔行稍亮一点，保留可读性 */
    html[data-ojpp-theme="dark"] .status-frame-datatable tr:nth-child(even),
    html[data-ojpp-theme="dark"] .datatable tr:nth-child(even),
    html[data-ojpp-theme="dark"] table tr:nth-child(even) {
      background: #272d36 !important;
    }
    html[data-ojpp-theme="dark"] .status-frame-datatable th,
    html[data-ojpp-theme="dark"] .status-frame-datatable td,
    html[data-ojpp-theme="dark"] .datatable th,
    html[data-ojpp-theme="dark"] .datatable td,
    html[data-ojpp-theme="dark"] table th,
    html[data-ojpp-theme="dark"] table td {
      background: transparent !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .status-frame-datatable th,
    html[data-ojpp-theme="dark"] .datatable th,
    html[data-ojpp-theme="dark"] table th {
      background: #2d333b !important;
      color: #e6edf3;
    }
    html[data-ojpp-theme="dark"] table tr:hover td,
    html[data-ojpp-theme="dark"] .datatable tr:hover td {
      background: #2d333b !important;
    }
    /* 表头里的排序箭头/小图标是深色 PNG */
    html[data-ojpp-theme="dark"] table th img,
    html[data-ojpp-theme="dark"] .datatable th img {
      filter: invert(1) brightness(1.3);
    }
    /* 比赛报名/设置这类表单：.table-form 是表单布局表，不是数据表。
       站点本来就让它透明贴页面，但上面 table 的全局斑马纹把它
       染成了花花绿绿的隔行。统一还原透明，贴回 #1c2128 底色 */
    html[data-ojpp-theme="dark"] .table-form,
    html[data-ojpp-theme="dark"] .table-form tr,
    html[data-ojpp-theme="dark"] .table-form tr:nth-child(even),
    html[data-ojpp-theme="dark"] .table-form th,
    html[data-ojpp-theme="dark"] .table-form td,
    html[data-ojpp-theme="dark"] .table-form .field-name,
    /* 协议条款的滚框（站点是 #ffffdd 高亮框）也统一回底色——
       它仍留边框，能看出是个可滚动的框 */
    html[data-ojpp-theme="dark"] .table-form textarea {
      background: transparent !important;
    }
    /* 表格分页条 */
    html[data-ojpp-theme="dark"] .pagination,
    html[data-ojpp-theme="dark"] .pagination span,
    html[data-ojpp-theme="dark"] .pagination a:not(.rated-user):not([class*="user-"]) {
      background: transparent !important;
      color: #adbac7;
      border-color: #373e47;
    }
    html[data-ojpp-theme="dark"] .pagination span.active {
      background: #2d333b !important;
      color: #e6edf3;
    }
    html[data-ojpp-theme="dark"] .pagination a:hover {
      background: #2d333b !important;
    }

    /* ---------- 表单（提交页、筛选面板） ---------- */
    /* 站点大量使用原生 select / input，暗色下会是白底。
       这里统一处理，并去掉 Chrome 的原生立体感。 */
    html[data-ojpp-theme="dark"] select,
    html[data-ojpp-theme="dark"] input[type="text"],
    html[data-ojpp-theme="dark"] input[type="password"],
    html[data-ojpp-theme="dark"] input[type="number"],
    html[data-ojpp-theme="dark"] input[type="email"],
    html[data-ojpp-theme="dark"] input:not([type]),
    html[data-ojpp-theme="dark"] textarea {
      background-color: #2d333b !important;
      color: #cdd9e5 !important;
      border: 1px solid #444c56 !important;
      border-radius: 4px;
      -webkit-appearance: none;
      appearance: none;
    }
    /* select 被去掉原生外观后需要自己补一个下拉箭头 */
    html[data-ojpp-theme="dark"] select {
      background-image: linear-gradient(45deg, transparent 50%, #909dab 50%),
                        linear-gradient(135deg, #909dab 50%, transparent 50%);
      background-position: calc(100% - 14px) calc(50% - 2px), calc(100% - 9px) calc(50% - 2px);
      background-size: 5px 5px, 5px 5px;
      background-repeat: no-repeat;
      padding-right: 24px;
    }
    html[data-ojpp-theme="dark"] input::placeholder,
    html[data-ojpp-theme="dark"] textarea::placeholder {
      color: #768390;
    }
    /* 提交页的代码编辑器（站点用 CodeMirror 或 textarea） */
    html[data-ojpp-theme="dark"] .CodeMirror,
    html[data-ojpp-theme="dark"] .CodeMirror-scroll,
    html[data-ojpp-theme="dark"] .CodeMirror-gutters,
    html[data-ojpp-theme="dark"] #editor,
    html[data-ojpp-theme="dark"] .editor {
      background: #22272e !important;
      color: #cdd9e5 !important;
      border-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] .CodeMirror-gutters {
      background: #1c2128 !important;
      border-right-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] .CodeMirror-linenumber { color: #768390; }
    html[data-ojpp-theme="dark"] .CodeMirror-cursor { border-left-color: #cdd9e5; }
    html[data-ojpp-theme="dark"] .CodeMirror-selected { background: #373e47 !important; }
    html[data-ojpp-theme="dark"] .CodeMirror-activeline-background { background: #2d333b !important; }
    /* 文件选择按钮 */
    html[data-ojpp-theme="dark"] input[type="file"]::file-selector-button {
      background: #2d333b;
      color: #cdd9e5;
      border: 1px solid #444c56;
      border-radius: 4px;
    }

    /* ---------- 首页 / 公告 ---------- */
    /* 首页公告里的标题与表格：站点用深色文字，暗色下看不见 */
    html[data-ojpp-theme="dark"] .topic,
    html[data-ojpp-theme="dark"] .topic h1,
    html[data-ojpp-theme="dark"] .topic h2,
    html[data-ojpp-theme="dark"] .topic h3,
    html[data-ojpp-theme="dark"] .topic p,
    html[data-ojpp-theme="dark"] .topic li,
    html[data-ojpp-theme="dark"] .topic div,
    html[data-ojpp-theme="dark"] .ttypography h1,
    html[data-ojpp-theme="dark"] .ttypography h2,
    html[data-ojpp-theme="dark"] .ttypography h3,
    html[data-ojpp-theme="dark"] .ttypography h4,
    html[data-ojpp-theme="dark"] .ttypography h5,
    html[data-ojpp-theme="dark"] .ttypography h6 {
      color: #e6edf3;
    }
    /* 首页的评分表：表头原本是深色底、正文是白底 */
    html[data-ojpp-theme="dark"] .topic table,
    html[data-ojpp-theme="dark"] .ttypography table {
      border-color: #373e47 !important;
    }
    /* 公告里的引用块左侧竖线 */
    html[data-ojpp-theme="dark"] .topic blockquote,
    html[data-ojpp-theme="dark"] .ttypography blockquote {
      border-left-color: #475060;
      color: #adbac7;
    }
    /* 隐藏的公告标题（首页 “Hello, Codeforces!” 那种被压暗的标题） */
    html[data-ojpp-theme="dark"] .topic .spoiler-title,
    html[data-ojpp-theme="dark"] .spoiler-title {
      color: #e6edf3;
    }

    /* ---------- 博客 / changelog ---------- */
    html[data-ojpp-theme="dark"] .blog-entry,
    html[data-ojpp-theme="dark"] .blog-entry .title,
    html[data-ojpp-theme="dark"] .blog-entry .info,
    html[data-ojpp-theme="dark"] .comment,
    html[data-ojpp-theme="dark"] .comment .content {
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .blog-entry .title a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .comment a:not(.rated-user):not([class*="user-"]) {
      color: #539bf5 !important;
    }
    /* changelog 里的日期与作者信息 */
    html[data-ojpp-theme="dark"] .blog-entry .info,
    html[data-ojpp-theme="dark"] .comment .info {
      color: #909dab;
    }

    /* ---------- 日历 ---------- */
    html[data-ojpp-theme="dark"] .calendar,
    html[data-ojpp-theme="dark"] .calendar-table,
    html[data-ojpp-theme="dark"] table.calendar {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .calendar td,
    html[data-ojpp-theme="dark"] .calendar th,
    html[data-ojpp-theme="dark"] table.calendar td,
    html[data-ojpp-theme="dark"] table.calendar th {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .calendar .day,
    html[data-ojpp-theme="dark"] table.calendar td.day {
      color: #cdd9e5;
    }
    /* 日历里表示“有比赛”的标记色块，原色在深底上过暗 */
    html[data-ojpp-theme="dark"] .calendar .contest,
    html[data-ojpp-theme="dark"] table.calendar .contest {
      background: #2d333b !important;
      color: #adbac7;
    }

    /* ---------- 搜索框与筛选表单 ---------- */
    /* 状态页的筛选面板：站点用 fieldset 包裹，标题是蓝色 */
    html[data-ojpp-theme="dark"] fieldset,
    html[data-ojpp-theme="dark"] .filter-box {
      border-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] fieldset legend,
    html[data-ojpp-theme="dark"] .filter-box label {
      color: #adbac7;
    }
    /* 筛选面板里的蓝色标签（Problem: / Verdict: 等） */
    html[data-ojpp-theme="dark"] .status-filter label,
    html[data-ojpp-theme="dark"] .filter-box b,
    html[data-ojpp-theme="dark"] .filter-box strong {
      color: #79b8ff;
    }

    /* ---------- 首页列表 ---------- */
    /* 公告与比赛的标题：站点用 #3b5998 深蓝（.topic .title 里的链接）。
       这些链接里混着 .rated-user 用户名（Top rated 那栏就是链接列表），
       不能把段位色一起刷掉，所以一律 :not(.rated-user)。 */
    html[data-ojpp-theme="dark"] .topic .title a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .topic .title,
    html[data-ojpp-theme="dark"] .topic a:not(.rated-user):not([class*="user-"]),
    /* 标题文字实际落在 a 里的 <p> 上，颜色设在那里而不是 a 上 */
    html[data-ojpp-theme="dark"] .topic .title a p,
    html[data-ojpp-theme="dark"] .topic a p,
    html[data-ojpp-theme="dark"] .contestList .contestName a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .recent-actions a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .roundbox .caption a:not(.rated-user):not([class*="user-"]) {
      color: #79b8ff !important;
    }
    /* 首页右栏的“Top rated”之类列表：默认文字色即可。
       必须排除 .rated-user，否则会把段位色一起刷掉——
       “Top rated”里全是红名/橙名，正是最需要保留颜色的地方。 */
    html[data-ojpp-theme="dark"] .personal-sidebar a:not(.rated-user),
    html[data-ojpp-theme="dark"] .sidebox a:not(.rated-user),
    html[data-ojpp-theme="dark"] .roundbox a:not(.rated-user) {
      color: #cdd9e5 !important;
    }
    /* 公告的 rating 变化：.topic-rating 是 #008000 深绿 */
    html[data-ojpp-theme="dark"] .topic-rating,
    html[data-ojpp-theme="dark"] .green,
    html[data-ojpp-theme="dark"] .rating-up {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .red,
    html[data-ojpp-theme="dark"] .rating-down {
      color: #f85149 !important;
    }

    /* ---------- 博客与评论区 ---------- */
    /* 博客标题：站点的结构是 h3 > a，没有稳定的 class，
       所以直接按标签层级选，并排除页脚等区域 */
    html[data-ojpp-theme="dark"] #pageContent h3 a,
    html[data-ojpp-theme="dark"] #pageContent h3,
    html[data-ojpp-theme="dark"] .blog-entry h3 a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .blog-entry .title {
      color: #79b8ff !important;
    }
    /* 评论的投票分数：正值 #008000、负值 #800000 */
    html[data-ojpp-theme="dark"] .commentRating,
    html[data-ojpp-theme="dark"] .commentRating span {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .commentRating.negative,
    html[data-ojpp-theme="dark"] .commentRating.negative span {
      color: #f85149 !important;
    }
    /* 代码高亮（Google prettify）：站点为浅色背景设计的配色，
       深底上几乎全是深色，直接按语法类别换成亮色版本 */
    html[data-ojpp-theme="dark"] .prettyprint,
    html[data-ojpp-theme="dark"] code.prettyprint,
    html[data-ojpp-theme="dark"] pre.prettyprint {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .prettyprint .pln,
    html[data-ojpp-theme="dark"] .prettyprint .pun { color: #cdd9e5 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .kwd,
    html[data-ojpp-theme="dark"] .prettyprint .kwd span { color: #f47067 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .typ,
    html[data-ojpp-theme="dark"] .prettyprint .atn { color: #79b8ff !important; }
    html[data-ojpp-theme="dark"] .prettyprint .lit,
    html[data-ojpp-theme="dark"] .prettyprint .str,
    html[data-ojpp-theme="dark"] .prettyprint .atv { color: #8ddb8c !important; }
    html[data-ojpp-theme="dark"] .prettyprint .com { color: #768390 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .tag { color: #f47067 !important; }
    html[data-ojpp-theme="dark"] .prettyprint .dec,
    html[data-ojpp-theme="dark"] .prettyprint .var { color: #dcbdfb !important; }
    html[data-ojpp-theme="dark"] .prettyprint .fun { color: #dcbdfb !important; }

    /* ---------- 提交结果单元格 ---------- */
    /* .cell-rejected（-1/被拒绝）、.cell-accepted（已解决）等
       站点用的是浅灰/浅蓝，深底上都偏暗。按语义上色 */
    html[data-ojpp-theme="dark"] .cell-rejected {
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .cell-accepted,
    html[data-ojpp-theme="dark"] .cell-solved,
    html[data-ojpp-theme="dark"] .cell-ok {
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .cell-verdict,
    html[data-ojpp-theme="dark"] .cell-time {
      color: #909dab;
    }
    /* standings 里的得分与名次 */
    html[data-ojpp-theme="dark"] .cell-rank,
    html[data-ojpp-theme="dark"] .cell-points {
      color: #cdd9e5;
    }

    /* ---------- 表单控件（筛选、提交等） ---------- */
    /* SumoSelect 下拉框：站点给它设了白底，暗色下是个白块 */
    html[data-ojpp-theme="dark"] .SumoSelect p.CaptionCont,
    html[data-ojpp-theme="dark"] .SumoSelect .CaptionCont,
    html[data-ojpp-theme="dark"] .SumoSelect select,
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper {
      background: #2d333b !important;
      border-color: #373e47 !important;
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper ul li {
      background: #2d333b !important;
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper ul li:hover {
      background: #373e47 !important;
    }
    /* 展开列表的底色也要深——展开才是用户常看的样子 */
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper.multiple,
    html[data-ojpp-theme="dark"] .SumoSelect.open .optWrapper,
    html[data-ojpp-theme="dark"] .SumoSelect .MultiControls {
      background: #2d333b !important;
      border-color: #373e47 !important;
      color: #cdd9e5 !important;
    }
    /* 选项里的复选框 i：站点是白底小方框 */
    html[data-ojpp-theme="dark"] .SumoSelect .optWrapper li.opt i,
    html[data-ojpp-theme="dark"] .SumoSelect .select-all > span i {
      background: #22272e !important;
      border-color: #373e47 !important;
    }
    html[data-ojpp-theme="dark"] .SumoSelect .select-all.partial > span i,
    html[data-ojpp-theme="dark"] .SumoSelect .select-all.selected > span i {
      background: #57ab5a !important;
      border-color: transparent !important;
    }
    /* 下拉箭头：站点把一张黑色三角 PNG 放在 label>i 的 background-image，
       直接改色没用——是图片。用 filter 反成亮色箭头。 */
    html[data-ojpp-theme="dark"] .SumoSelect p.CaptionCont label i,
    html[data-ojpp-theme="dark"] .SumoSelect .CaptionCont label i {
      filter: invert(0.8) !important;
    }
    /* 展开时的底色 */
    html[data-ojpp-theme="dark"] .SumoSelect.open > .CaptionCont,
    html[data-ojpp-theme="dark"] .SumoSelect:focus > .CaptionCont {
      background: #2d333b !important;
      border-color: #539bf5 !important;
    }
    /* 筛选标签（“Gym”那类的蓝色） */
    html[data-ojpp-theme="dark"] .setting-name label,
    html[data-ojpp-theme="dark"] .setting-name,
    html[data-ojpp-theme="dark"] .settings-form label {
      color: #cdd9e5 !important;
    }
    /* 站点把部分 label 设成 #3b5998 深蓝，暗色下看不见 */
    html[data-ojpp-theme="dark"] label {
      color: #cdd9e5;
    }

    /* ---------- 星级评分控件（gym 筛选的 Difficulty） ---------- */
    /* 站点用 rating.png 精灵图画“空星+白底”的整条，反转颜色
       太突兀。改成纯 CSS 重绘：隐藏精灵图，用 ::before 画 5 颗
       空星（深色实心星，视觉上像描边），已选中的那一条叠金色
       实心星，靠 li 的宽度裁掉多余的部分——站点本来就是用
       width 控制选几颗，所以 hover/选择都能自动工作。 */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"],
    html[data-ojpp-theme="dark"] ul.vote-list {
      background-image: none !important;
      filter: none !important;
      position: relative;
    }
    /* 未选中的空星：深色实心星，读作“空/未选” */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"]::before {
      content: "★★★★★";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22px;
      line-height: 1;
      letter-spacing: 3px;
      color: #3d434d;
      white-space: nowrap;
      pointer-events: none;
    }
    /* 已选中的那一条：同样 5 颗星，亮金色。li 用 overflow:hidden
       + 站点设置的 width 来裁，所以选几颗就显示几颗。 */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li[id^="vote-current-"],
    html[data-ojpp-theme="dark"] ul.vote-list li[id^="vote-current-"] {
      background-image: none !important;
      overflow: hidden;
      white-space: nowrap;
      filter: none !important;
    }
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li[id^="vote-current-"]::before,
    html[data-ojpp-theme="dark"] ul.vote-list li[id^="vote-current-"]::before {
      content: "★★★★★";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22px;
      line-height: 1;
      letter-spacing: 3px;
      color: #f0883e;
      white-space: nowrap;
      pointer-events: none;
    }
    /* hover 预览：站点给 a.vote-item:hover 铺 rating.gif 下半截
       （白底金星精灵，GIF 无 alpha），暗色下是一条白块。去精灵，
       同样用 ::before 画金星，锚点 width 裁掉多余的星 */
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li a.vote-item,
    html[data-ojpp-theme="dark"] ul.vote-list li a.vote-item,
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li a.vote-item:hover,
    html[data-ojpp-theme="dark"] ul.vote-list li a.vote-item:hover {
      background-image: none !important;
      overflow: hidden;
    }
    html[data-ojpp-theme="dark"] ul[id^="vote-list-"] li a.vote-item:hover::before,
    html[data-ojpp-theme="dark"] ul.vote-list li a.vote-item:hover::before {
      content: "★★★★★";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22px;
      line-height: 1;
      letter-spacing: 3px;
      color: #f0883e;
      white-space: nowrap;
      text-indent: 0;
      pointer-events: none;
    }

    /* ---------- 题目副标签（standard input/output、时限） ---------- */
    /* 站点给这些 .notice 设了浅灰底做“信息条”，暗色下是一块
       和背景不一样的灰块。直接透明，只留文字色 */
    html[data-ojpp-theme="dark"] .notice {
      background: transparent !important;
      border: none !important;
      color: #909dab !important;
    }
    /* 但 .notice 里的文字要可读——站点给 td .notice 设过灰，优先级不够会输 */
    html[data-ojpp-theme="dark"] .notice *,
    html[data-ojpp-theme="dark"] td .notice,
    html[data-ojpp-theme="dark"] .notice a {
      color: #909dab !important;
    }

    /* ---------- 倒计时/截止标签 ---------- */
    /* “Until closing X days” 里的时间是 span.countdown，站点给 #777 深灰。
       按“截止”语义上色成琥珀色。注意别用 .irt——那其实是 datatable
       的圆角精灵图 class，之前误认作倒计时元素 */
    html[data-ojpp-theme="dark"] .countdown,
    html[data-ojpp-theme="dark"] .countdown * {
      color: #f0883e !important;
      border-color: #f0883e !important;
    }

    /* ---------- datatable/roundbox 的角精灵图 ---------- */
    /* CF 的圆角是靠 ilt/irt/ilb/irb 几个小 PNG 角落图拼出来的。
       暗色下这些白色角落图会变成白块。全部去掉，容器自己给
       border-radius 保持圆角 */
    html[data-ojpp-theme="dark"] .ilt,
    html[data-ojpp-theme="dark"] .irt,
    html[data-ojpp-theme="dark"] .ilb,
    html[data-ojpp-theme="dark"] .irb,
    html[data-ojpp-theme="dark"] .lt,
    html[data-ojpp-theme="dark"] .rt,
    html[data-ojpp-theme="dark"] .lb,
    html[data-ojpp-theme="dark"] .rb {
      background-image: none !important;
    }
    html[data-ojpp-theme="dark"] .datatable,
    html[data-ojpp-theme="dark"] .borderTopRound {
      border-radius: 4px;
    }

    /* ---------- 个人资料与图表 ---------- */
    /* 评分曲线图例的白底 */
    html[data-ojpp-theme="dark"] .legend,
    html[data-ojpp-theme="dark"] .legend div {
      background: transparent !important;
      color: #cdd9e5;
    }
    /* 评分曲线图本体是 canvas，不动它 */

    /* ---------- 题号行的通过/未通过标记 ---------- */
    /* 站点的做/未做标记分两处：① td.act（操作列图标格）上浅底色，
       ② td.id 左侧 6px 彩色条（border-left）。两处都用同色。
       之前写成 .accepted-problem td 把整行染绿——多了，且 td.id 的
       6px 浅绿条在暗底下太刺眼。改成：td.act 给深色底，td.id 的左条
       换成就感分明但不刺眼的色相 */
    html[data-ojpp-theme="dark"] tr.accepted-problem td.act,
    html[data-ojpp-theme="dark"] .accepted-problem td.act,
    html[data-ojpp-theme="dark"] td.act.accepted-problem {
      background: #1d2b1d !important;
      color: #a6d189;
    }
    html[data-ojpp-theme="dark"] tr.accepted-problem td.id,
    html[data-ojpp-theme="dark"] .accepted-problem td.id {
      border-left-color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] tr.rejected-problem td.act,
    html[data-ojpp-theme="dark"] .rejected-problem td.act,
    html[data-ojpp-theme="dark"] td.act.rejected-problem {
      background: #451d1d !important;
      color: #f85149;
    }
    html[data-ojpp-theme="dark"] tr.rejected-problem td.id,
    html[data-ojpp-theme="dark"] .rejected-problem td.id {
      border-left-color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] tr.submitted-verdict-problem td.act,
    html[data-ojpp-theme="dark"] .submitted-verdict-problem td.act,
    html[data-ojpp-theme="dark"] td.act.submitted-verdict-problem {
      background: #1c2b3d !important;
      color: #79b8ff;
    }
    html[data-ojpp-theme="dark"] tr.submitted-verdict-problem td.id,
    html[data-ojpp-theme="dark"] .submitted-verdict-problem td.id {
      border-left-color: #79b8ff !important;
    }
    /* 普通行的 td.act（尤其斑马行 td.act.dark）：站点是 #f8f8f8 白底，
       暗色下是白块。改成透明让它跟行底色一致 */
    html[data-ojpp-theme="dark"] td.act,
    html[data-ojpp-theme="dark"] td.act.dark,
    html[data-ojpp-theme="dark"] .act.dark {
      background: transparent !important;
    }

    /* ---------- 排行榜标记 ---------- */
    /* 站点用 #ff0000 纯红和 #008000 纯绿标“失败/成功”，
       深底上要么刺眼要么太暗。换成亮版本，语义不变 */
    html[data-ojpp-theme="dark"] .cell-failed-system-test,
    html[data-ojpp-theme="dark"] .cell-challenged {
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .successfulChallengeCount,
    html[data-ojpp-theme="dark"] .successful-submission,
    html[data-ojpp-theme="dark"] .successful-test {
      color: #57ab5a !important;
    }

    /* ---------- 提交详情的 I/O 对比块 ---------- */
    /* .file .text 是 #ddd，test-for-popup pre #eee，sample-tests pre #efefef，
       test-example-line-even #e0e0e0——全是浅块，暗色下是大片白 */
    html[data-ojpp-theme="dark"] .file,
    html[data-ojpp-theme="dark"] .file .text,
    html[data-ojpp-theme="dark"] .file .name,
    html[data-ojpp-theme="dark"] .test-for-popup pre,
    html[data-ojpp-theme="dark"] .test-for-popup,
    html[data-ojpp-theme="dark"] .sample-tests pre {
      background: #22272e !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    /* 别碰 .test-example-line-even/odd——题面里靠它做奇偶交替，
       前面已有专门规则（even #2d333b / odd #22272e），盖掉就分不清行了 */
    html[data-ojpp-theme="dark"] .file pre,
    html[data-ojpp-theme="dark"] .file .text pre,
    html[data-ojpp-theme="dark"] .sample-tests pre * {
      color: #cdd9e5 !important;
    }
    /* .file 的标题行（Input / Participant's output / Jury's answer） */
    html[data-ojpp-theme="dark"] .file .name {
      color: #909dab !important;
    }

    /* ---------- facebox 弹窗（view source / hack 等所有弹层） ---------- */
    /* #facebox .content 站点给的是 #fff，a.close 也是白底，暗色下
       整个弹窗是一块大白板。内部 .source-popup / pre 都是透明的，
       把容器压成页面底色即可 */
    html[data-ojpp-theme="dark"] #facebox .content,
    html[data-ojpp-theme="dark"] #facebox .popup .content {
      background-color: #1d2127 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] #facebox a.close {
      background-color: #1d2127 !important;
    }
    html[data-ojpp-theme="dark"] #facebox .source-popup pre,
    html[data-ojpp-theme="dark"] #facebox pre {
      background-color: #22272e;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] #facebox hr {
      border-color: #373e47;
      background-color: #373e47;
    }
    /* 高亮块：站点用 --highlighted-* 浅彩底，暗色下深底 */
    html[data-ojpp-theme="dark"] [style*="background-color: rgb(221, 238, 255)"],
    html[data-ojpp-theme="dark"] [style*="background-color: #ddeeff"],
    html[data-ojpp-theme="dark"] [style*="background-color: rgb(239, 239, 239)"] {
      background-color: #22272e !important;
    }
    /* 过滤框/代码预览的输入与预览区 */
    html[data-ojpp-theme="dark"] .filter-box input,
    html[data-ojpp-theme="dark"] .datatable .filter input,
    html[data-ojpp-theme="dark"] .datatable input {
      background: #2d333b !important;
      border-color: #373e47 !important;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .markItUpPreviewFrame {
      background: #22272e !important;
      border-color: #373e47;
    }
    /* ---------- text-label-* 状态徽章 ---------- */
    /* 站点用浅彩底+深字，暗色下要反成深底+亮字 */
    html[data-ojpp-theme="dark"] .text-label-blue,
    html[data-ojpp-theme="dark"] .text-label-info {
      background: #1c3a5e !important;
      color: #79b8ff !important;
    }
    html[data-ojpp-theme="dark"] .text-label-green,
    html[data-ojpp-theme="dark"] .text-label-success {
      background: #1d3a2c !important;
      color: #57ab5a !important;
    }
    html[data-ojpp-theme="dark"] .text-label-yellow,
    html[data-ojpp-theme="dark"] .text-label-warning {
      background: #4a3a1a !important;
      color: #f0883e !important;
    }
    html[data-ojpp-theme="dark"] .text-label-red,
    html[data-ojpp-theme="dark"] .text-label-error {
      background: #4a2323 !important;
      color: #f85149 !important;
    }
    html[data-ojpp-theme="dark"] .text-label-gray,
    html[data-ojpp-theme="dark"] .text-label-muted {
      background: #373e47 !important;
      color: #909dab !important;
    }

    /* ---------- 目录页（Catalog） ---------- */
    /* 目录/更新历史里的深蓝字与黑色时间戳 */
    html[data-ojpp-theme="dark"] ._catalogFolderName,
    html[data-ojpp-theme="dark"] ._CatalogHistorySidebarFrame_name,
    html[data-ojpp-theme="dark"] ._catalogNode ._nameBody,
    html[data-ojpp-theme="dark"] .caption {
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .format-humantime,
    html[data-ojpp-theme="dark"] .humantime,
    html[data-ojpp-theme="dark"] time {
      color: #909dab !important;
    }
    /* 目录的增删记录：del 浅红、ins 浅绿 */
    html[data-ojpp-theme="dark"] ._CatalogHistorySidebarFrame_value del,
    html[data-ojpp-theme="dark"] del {
      background: #3d2b2b !important;
      color: #f85149 !important;
      text-decoration-color: #f85149;
    }
    html[data-ojpp-theme="dark"] ._CatalogHistorySidebarFrame_value ins,
    html[data-ojpp-theme="dark"] ins {
      background: #1d2b1d !important;
      color: #57ab5a !important;
      text-decoration-color: #57ab5a;
    }
    /* 目录的文件/文件夹图标：站点用 icon-* 字体渲染，
       还把颜色写进 style="color:black" 或站点 !important 规则里。
       必须 !important + 覆盖 ::before 才能抢到。 */
    html[data-ojpp-theme="dark"] [class*="icon-"],
    html[data-ojpp-theme="dark"] [class*="icon-"]::before,
    html[data-ojpp-theme="dark"] [class*="icon-"]::after,
    html[data-ojpp-theme="dark"] .icon-file,
    html[data-ojpp-theme="dark"] .icon-folder {
      color: #cdd9e5 !important;
    }
    /* 站点对目录树里的 icon 用 black !important，点名覆盖 */
    html[data-ojpp-theme="dark"] ._catalogBlogEntry ._name i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._catalogFolder ._name i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._catalogNode i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._name i[class*="icon-"],
    html[data-ojpp-theme="dark"] ._nameContent i[class*="icon-"] {
      color: #909dab !important;
    }

    /* ---------- 提示条与代码编辑器 ---------- */
    html[data-ojpp-theme="dark"] div.alert-info,
    html[data-ojpp-theme="dark"] div.alert-warning,
    html[data-ojpp-theme="dark"] div.alert-error,
    html[data-ojpp-theme="dark"] div.alert-success {
      background: #2d333b;
      border-color: #444c56;
      color: #cdd9e5;
    }
    html[data-ojpp-theme="dark"] .highlight {
      background: #3a3320 !important;
    }
    /* 顶部搜索框：站点给它设了 #f4f4f4 和放大镜背景图 */
    html[data-ojpp-theme="dark"] input.search,
    html[data-ojpp-theme="dark"] .search {
      background-color: #232a33 !important;
      color: #cdd9e5;
      border-color: #475060;
    }
    /* 输入框、下拉框、按钮：站点默认白底，暗色下会刺眼 */
    html[data-ojpp-theme="dark"] input:not([type="checkbox"]):not([type="radio"]),
    html[data-ojpp-theme="dark"] select,
    html[data-ojpp-theme="dark"] textarea {
      background-color: #2d333b;
      color: #cdd9e5;
      border-color: #444c56;
    }
    /* 提交类按钮：站点用 border:2px outset 做立体感，
       暗色下看起来像 90 年代的控件。改成扁平样式。 */
    html[data-ojpp-theme="dark"] input[type="submit"],
    html[data-ojpp-theme="dark"] input[type="button"],
    html[data-ojpp-theme="dark"] button,
    html[data-ojpp-theme="dark"] .button {
      background-color: #2d333b !important;
      color: #cdd9e5 !important;
      border: 1px solid #444c56 !important;
      border-radius: 4px;
    }
    html[data-ojpp-theme="dark"] input[type="submit"]:hover,
    html[data-ojpp-theme="dark"] input[type="button"]:hover,
    html[data-ojpp-theme="dark"] button:hover {
      background-color: #373e47 !important;
    }

    /* ---------- 侧边栏里的链接 ---------- */
    /* 站点给侧边栏链接设了黑色（a.not-decorated 等），
       有些还写成内联 style="color: black"，所以要用 !important。
       但必须排除 .rated-user：“Top rated”这类列表里全是
       红名/橙名，笼统的 a 规则会把段位色一起刷掉。 */
    html[data-ojpp-theme="dark"] .roundbox a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .sidebox a:not(.rated-user):not([class*="user-"]),
    html[data-ojpp-theme="dark"] .roundbox li,
    html[data-ojpp-theme="dark"] .sidebox li {
      color: #cdd9e5 !important;
    }
    html[data-ojpp-theme="dark"] .roundbox a:hover,
    html[data-ojpp-theme="dark"] .sidebox a:hover {
      color: #539bf5 !important;
    }
    /* 侧边栏列表项的圆点标记 */
    html[data-ojpp-theme="dark"] .roundbox ul li::before,
    html[data-ojpp-theme="dark"] .sidebox ul li::before {
      color: #768390;
    }
    /* “Contest materials”这类列表：站点给 li 加了 1px 白边框，
       暗色下每行都套一圈亮框。改成素色分隔线，鼠标悬停时再高亮。 */
    html[data-ojpp-theme="dark"] .sidebar-menu ul li,
    html[data-ojpp-theme="dark"] .sidebox ul li {
      border: none !important;
      border-bottom: 1px solid #2d333b !important;
      border-radius: 0;
      background: transparent;
    }
    html[data-ojpp-theme="dark"] .sidebar-menu ul li:last-child,
    html[data-ojpp-theme="dark"] .sidebox ul li:last-child {
      border-bottom: none !important;
    }
    html[data-ojpp-theme="dark"] .sidebar-menu ul li:hover,
    html[data-ojpp-theme="dark"] .sidebox ul li:hover {
      background: #2d333b !important;
    }
    /* 悬停时链接要变亮。站点没有给 hover 设颜色，
       之前悬停后文字仍然很淡，看起来像被禁用。 */
    html[data-ojpp-theme="dark"] .sidebar-menu ul li a:hover,
    html[data-ojpp-theme="dark"] .sidebox ul li a:hover {
      color: #e6edf3 !important;
    }
    /* 资源语言标记（如 (en)）：站点是 #666，深底上看不清 */
    html[data-ojpp-theme="dark"] .resource-locale {
      color: #768390 !important;
    }
    /* 删除资源的小叉：原图是 10x10 灰度 PNG（白底 + 深色叉），
       深底上几乎看不见。invert 会把白底也变成深色方块，
       所以用 mix-blend-mode: screen 让白色消失、只留叉的轮廓。 */
    html[data-ojpp-theme="dark"] .delete-resource-link {
      filter: invert(1);
      mix-blend-mode: screen;
      opacity: .75;
    }
    html[data-ojpp-theme="dark"] .delete-resource-link:hover {
      opacity: 1;
    }
    /* 侧边栏顶部收起/展开的箭头图标（同样是深色小图） */
    html[data-ojpp-theme="dark"] .sidebar-menu .caption .top-links img,
    html[data-ojpp-theme="dark"] .sidebox .caption img {
      filter: invert(1);
      mix-blend-mode: screen;
    }
  `,
		collectSections(doc) {
			const sections = [];
			const statement = doc.querySelector(".problem-statement");
			if (!statement) return sections;
			const add = (content, heading, kind, label, toolbarAnchor) => {
				if (!content || !heading || !content.textContent?.trim()) return;
				const blockLevel = !!toolbarAnchor;
				const anchor = toolbarAnchor ?? heading;
				sections.push({
					kind,
					label,
					content,
					toolbar: blockLevel ? {
						anchor,
						position: "afterend",
						align: "block-right"
					} : {
						anchor,
						position: "beforeend",
						align: "right"
					},
					result: {
						anchor: content,
						position: "afterend"
					}
				});
			};
			const header = statement.querySelector(".header");
			add([...statement.children].filter((node) => node instanceof HTMLElement).find((node) => node !== header && !node.classList.contains("ojpp-toolbar")) ?? null, statement.querySelector(".header .title"), "statement", t("section.statement"), header);
			add(statement.querySelector(".input-specification"), statement.querySelector(".input-specification .section-title"), "input", t("section.input"));
			add(statement.querySelector(".output-specification"), statement.querySelector(".output-specification .section-title"), "output", t("section.output"));
			add(statement.querySelector(".note"), statement.querySelector(".note .section-title"), "output", t("section.note"));
			return sections;
		},
		prepareContent(root) {
			const doc = root.ownerDocument;
			for (const rendered of root.querySelectorAll(MATHJAX_RENDERED)) {
				const next = rendered.nextElementSibling;
				const prev = rendered.previousElementSibling;
				if (next?.matches("script[type^=\"math/tex\"]") || prev?.matches("script[type^=\"math/tex\"]")) rendered.remove();
			}
			for (const script of root.querySelectorAll("script[type^=\"math/tex\"]")) {
				const latex = (script.textContent ?? "").trim();
				if (!latex) {
					script.remove();
					continue;
				}
				const math = doc.createElement("span");
				math.setAttribute("data-ojpp-math", /mode\s*=\s*display/.test(script.type) ? "display" : "inline");
				math.textContent = latex;
				script.replaceWith(math);
			}
			for (const span of root.querySelectorAll(".tex-span")) {
				if (span.parentElement?.closest(".tex-span")) continue;
				const latex = texSpanToLatex(span);
				if (!latex) {
					span.remove();
					continue;
				}
				const math = doc.createElement("span");
				math.setAttribute("data-ojpp-math", isStandaloneSpan(span) ? "display" : "inline");
				math.textContent = latex;
				span.replaceWith(math);
			}
			for (const tt of root.querySelectorAll(".tex-font-style-tt, .text-verb")) {
				const code = doc.createElement("code");
				code.textContent = tt.textContent ?? "";
				tt.replaceWith(code);
			}
			for (const [selector, open, close] of [
				[
					".tex-font-style-bf",
					"**",
					"**"
				],
				[
					".tex-font-style-it",
					"*",
					"*"
				],
				[
					".tex-font-style-sl",
					"*",
					"*"
				],
				[
					".tex-font-style-striked",
					"~~",
					"~~"
				]
			]) for (const el of root.querySelectorAll(selector)) {
				const text = el.textContent ?? "";
				if (!text) continue;
				el.replaceWith(doc.createTextNode(`${open}${text}${close}`));
			}
			for (const el of root.querySelectorAll(".section-title, .property-title")) {
				const text = (el.textContent ?? "").trim();
				if (!text) continue;
				const bold = doc.createElement("strong");
				bold.textContent = selectorEndsWithProperty(el) ? `${text}: ` : text;
				el.replaceWith(bold);
			}
			for (const el of root.querySelectorAll(".input-output-copier")) el.remove();
		},
		mountSettingsButton(button, doc) {
			const loginRow = doc.querySelector(".lang-chooser > div:last-child");
			if (loginRow) {
				const host = doc.createElement("span");
				host.className = "ojpp-codeforces-settings";
				host.append(button);
				loginRow.prepend(host);
				return;
			}
			const menu = doc.querySelector(".menu-list.main-menu-list") ?? doc.querySelector("#header");
			if (menu) {
				const host = doc.createElement("li");
				host.className = "ojpp-codeforces-settings";
				host.append(button);
				menu.append(host);
				return;
			}
			button.classList.add("ojpp-settings-floating");
			doc.body.append(button);
		},
		observe(doc, onChange) {
			let timer;
			const schedule = () => {
				if (timer !== void 0) return;
				timer = setTimeout(() => {
					timer = void 0;
					onChange();
				}, 150);
			};
			const observer = new MutationObserver(schedule);
			observer.observe(doc.body, {
				childList: true,
				subtree: true
			});
			const onReady = () => schedule();
			doc.addEventListener("DOMContentLoaded", onReady);
			window.addEventListener("load", onReady);
			return () => {
				observer.disconnect();
				clearTimeout(timer);
				doc.removeEventListener("DOMContentLoaded", onReady);
				window.removeEventListener("load", onReady);
			};
		}
	};
	function selectorEndsWithProperty(el) {
		return el.classList.contains("property-title");
	}
	function equationFromImg(img) {
		const src = img.getAttribute("src") ?? "";
		const alt = img.getAttribute("alt")?.trim();
		if (alt && /equation|tex/i.test(src)) return alt;
		const match = /[?&]tex=([^&]+)/.exec(src);
		if (!match) return null;
		try {
			return decodeURIComponent(match[1]);
		} catch {
			return match[1];
		}
	}
	function isSpacingOnly(latex) {
		return !latex.replace(/\\(hspace|hfill|quad|qquad|,|;|:|!)\s*(\{[^{}]*\})?/g, "").replace(/[\s~]/g, "");
	}
	function isBullet(latex) {
		return /^\\(hspace\s*\{[^{}]*\})?\s*\\bullet\b/.test(latex.trim());
	}
	var sites = [{
		id: "nowcoder",
		get name() {
			return t("site.nowcoder");
		},
		hosts: ["ac.nowcoder.com", "www.nowcoder.com"],
		styles: `
    .ojpp-nowcoder-settings {
      display: inline-flex; align-items: center; margin-left: 8px;
    }
    .ojpp-nowcoder-settings .ojpp-icon-btn { color: #cfd3d8; }
    .ojpp-nowcoder-settings .ojpp-icon-btn:hover {
      background: rgba(255, 255, 255, .14); color: #fff;
    }
  `,
		collectSections(doc) {
			const sections = [];
			const add = (content, heading, kind, label) => {
				if (!content || !heading || !content.textContent?.trim()) return;
				sections.push({
					kind,
					label,
					content,
					toolbar: {
						anchor: heading,
						position: "beforeend",
						align: "right"
					},
					result: {
						anchor: content,
						position: "afterend"
					}
				});
			};
			add(doc.querySelector(".subject-question"), doc.querySelector(".subject-item-title"), "statement", t("section.statement"));
			for (const heading of doc.querySelectorAll(".subject-describe > h2")) {
				const label = heading.textContent ?? "";
				if (!/描述/.test(label)) continue;
				let sibling = heading.nextElementSibling;
				while (sibling && sibling.tagName !== "PRE" && sibling.tagName !== "H2") sibling = sibling.nextElementSibling;
				if (sibling?.tagName !== "PRE") continue;
				const isInput = /输入/.test(label);
				add(sibling, heading, isInput ? "input" : "output", isInput ? t("section.input") : t("section.output"));
			}
			for (const heading of doc.querySelectorAll("h2")) {
				const label = (heading.textContent ?? "").trim();
				if (!/^(说明|备注|提示|注意)/.test(label)) continue;
				const body = heading.nextElementSibling;
				if (!body || !body.textContent?.trim()) continue;
				if (body.querySelector("textarea")) continue;
				add(body, heading, "output", label.replace(/[:：]\s*$/, ""));
			}
			for (const content of doc.querySelectorAll("div.nc-post-content")) add(content, content, "solution", t("section.solution"));
			return sections;
		},
		prepareContent(root) {
			for (const katex of root.querySelectorAll(".katex")) {
				const tex = katex.querySelector("annotation[encoding=\"application/x-tex\"]")?.textContent?.trim();
				if (!tex) continue;
				const wrapper = katex.parentElement;
				const display = wrapper?.classList.contains("katex-display") ?? false;
				const target = display && wrapper ? wrapper : katex;
				if (isSpacingOnly(tex)) {
					target.remove();
					continue;
				}
				const math = root.ownerDocument.createElement("span");
				if (isBullet(tex)) {
					math.textContent = "• ";
					target.replaceWith(math);
					continue;
				}
				math.setAttribute("data-ojpp-math", display ? "display" : "inline");
				math.textContent = tex;
				target.replaceWith(math);
			}
			for (const img of root.querySelectorAll("img")) {
				const latex = equationFromImg(img);
				if (latex === null) continue;
				const math = root.ownerDocument.createElement("span");
				math.setAttribute("data-ojpp-math", "inline");
				math.textContent = latex;
				img.replaceWith(math);
			}
			if (root.tagName === "PRE" && !root.querySelector("code")) {
				const paragraph = root.ownerDocument.createElement("div");
				paragraph.innerHTML = root.innerHTML;
				root.replaceChildren(paragraph);
			}
		},
		mountSettingsButton(button, doc) {
			const header = doc.querySelector(".header-right") ?? doc.querySelector(".header-bar");
			if (header) {
				const host = doc.createElement("span");
				host.className = "ojpp-nowcoder-settings";
				if (header.matches(".header-bar")) host.style.marginLeft = "auto";
				host.append(button);
				header.append(host);
			} else {
				button.classList.add("ojpp-settings-floating");
				doc.body.append(button);
			}
		},
		observe(doc, onChange) {
			let timer;
			const schedule = () => {
				if (timer !== void 0) return;
				timer = setTimeout(() => {
					timer = void 0;
					onChange();
				}, 100);
			};
			const observer = new MutationObserver(schedule);
			observer.observe(doc.body, {
				childList: true,
				subtree: true
			});
			const onClick = (event) => {
				if (event.target instanceof Element && event.target.closest(".more-unfold, .js-full-question, .js-small-question")) schedule();
			};
			doc.addEventListener("click", onClick);
			return () => {
				observer.disconnect();
				clearTimeout(timer);
				doc.removeEventListener("click", onClick);
			};
		}
	}, codeforces];
	sites.flatMap((site) => site.hosts.map((host) => `https://${host}/*`));
	function resolveSite(url) {
		if (url.protocol !== "https:") return void 0;
		return sites.find((site) => site.hosts.includes(url.hostname));
	}
	var site = resolveSite(new URL(location.href));
	if (site) try {
		startApp(createUserscriptPlatform(), site).catch((error) => toast(String(error), "error"));
	} catch (error) {
		console.error("[OJ++]", error);
		alert(error instanceof Error ? error.message : String(error));
	}
})();
