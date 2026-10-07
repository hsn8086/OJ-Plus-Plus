/**
 * 中文文案，同时作为键的唯一定义来源。
 *
 * 新增文案时先在这里加键，再在 en.ts 补对应翻译。
 * 键按界面区域分组，用 `.` 分隔，便于查找。
 */
export const zh = {
  // 通用
  'common.copied': '已复制',
  'common.copyFailed': '复制失败',
  'common.close': '关闭',
  'common.cancel': '取消',
  'common.save': '保存',
  'common.unnamed': '未命名',
  'common.notFilled': '未填',

  // 设置入口
  'app.settingsTitle': '{name} 设置',
  'app.settingsSaved': '设置已保存',

  // 区域工具栏
  'toolbar.group': '{label}工具栏',
  'toolbar.translate': 'AI 翻译',
  'toolbar.retranslate': '重新翻译',
  'toolbar.markdown': 'Markdown 视图',
  'toolbar.backToOriginal': '返回原始内容',
  'toolbar.copyOriginal': '复制原文',
  'toolbar.noContent': '没有可翻译的内容',
  'toolbar.translating': '翻译中，点击中止',
  'toolbar.translateFailed': '翻译失败：{message}',
  'toolbar.retry': '重试：{message}',

  // 译文面板
  'result.title': 'AI 翻译',
  'result.copy': '复制译文',
  'result.collapse': '收起',
  'result.expand': '展开',

  // 设置面板：分页与操作
  'settings.tab.general': '翻译设置',
  'settings.tab.provider': '提供商',
  'settings.tab.advanced': '高级',
  'settings.reset': '恢复默认',
  'settings.resetConfirm': '确定恢复默认设置？当前配置会被清空。',
  'settings.saveFailed': '保存失败：{message}',
  'settings.uiLanguage': '界面语言',
  'settings.uiLanguageHint': '设置面板和按钮使用的语言。自动跟随浏览器语言。',
  'settings.localeAuto': '跟随浏览器',
  'settings.localeZh': '简体中文',
  'settings.localeEn': 'English',

  // 设置面板：翻译设置
  'settings.targetLang': '目标语言',
  'settings.targetLangHint': '译文使用的语言，例如 简体中文 / English / 日本語。',
  'settings.targetLangPlaceholder': '简体中文',
  'settings.extraPrompt': '追加提示词',
  'settings.extraPromptPlaceholder': '例如：专有名词保留英文原文；解释尽量简短。',
  'settings.extraPromptHint': '会拼接到内置翻译提示词之后。',
  'settings.wholeBlock': '整段翻译',
  'settings.wholeBlockHint': '开启后把整块内容一次性发给模型，上下文更完整；关闭则按标题和段落切块，适合超长题面或上下文窗口较小的模型。',
  'settings.autoTranslate': '自动翻译题面',
  'settings.autoTranslateHint': '打开题目页后自动翻译题目描述区域。',
  'settings.streaming': '流式显示',
  'settings.streamingHint': '边生成边渲染，首屏更快。关闭后等整段译完再一次性显示；服务商或脚本管理器不支持时会自动回退。',
  'settings.theme': '站点配色',
  'settings.themeHint': '只影响脚本为站点补的样式；站点自身有暗色模式时选「跟随系统」即可。',
  'settings.themeAuto': '跟随系统',
  'settings.themeLight': '浅色',
  'settings.themeDark': '暗色',
  'settings.timeout': '超时（毫秒）',
  'settings.retries': '失败重试次数',
  'settings.retriesHint': '仅对网络错误和 5xx 生效。',

  // 设置面板：提供商
  'settings.addFromPreset': '从预设新增',
  'settings.add': '新增',
  'settings.providerName': '备注名',
  'settings.providerNamePlaceholder': '给这个配置起个名字',
  'settings.protocol': '接口协议',
  'settings.protocolHint': '决定请求体格式与响应解析方式。',
  'settings.baseUrl': '接口地址',
  'settings.baseUrlHint': '填到 /v1 即可，脚本会自动补 /chat/completions、/responses 或 /messages；也可直接填完整端点。',
  'settings.model': '模型',
  'settings.apiKeyPlaceholder': '本地服务可留空',
  'settings.apiKeyHint': '保存在当前平台的本地存储中，随请求发送到你配置的接口。本地推理服务可以留空，此时不会发送认证头。',
  'settings.reasoning': '推理开关',
  'settings.reasoningHint': '对应 thinking 字段，部分服务商才支持。',
  'settings.reasoningEffort': '推理强度',
  'settings.reasoningEffortHint': '对应 reasoning_effort / reasoning.effort。',
  'settings.effortDefault': '跟随模型默认',
  'settings.effortEnabled': '开启',
  'settings.effortDisabled': '关闭',
  'settings.headers': '额外请求头',
  'settings.headersPlaceholder': 'X-Custom-Header: value\n每行一个',
  'settings.headersHint': '每行 Key: Value，会覆盖同名默认请求头。',
  'settings.body': '额外请求体字段',
  'settings.bodyHint': 'JSON 对象，会合并进请求体，可覆盖任意字段，例如 top_p、max_tokens。',
  'settings.test': '测试连接',
  'settings.testing': '正在测试…',
  'settings.testOk': '连接成功，模型回复：{reply}',
  'settings.testFail': '连接失败：{message}',
  'settings.copyProvider': '复制配置',
  'settings.deleteProvider': '删除配置',
  'settings.providerCopySuffix': '{name} 副本',
  'settings.keepOne': '至少保留一个配置。',
  'settings.providerFooter': '配置保存在当前平台的本地存储中。翻译内容与 API Key 发往你配置的提供商；可在「提供商」页测试连接。',

  // 设置面板：导入导出
  'settings.preview': '配置预览（已隐藏 Key）',
  'settings.importPlaceholder': '粘贴导出的 JSON 后点「导入」',
  'settings.import': '导入',
  'settings.importMissing': '缺少 providers 数组',
  'settings.importOk': '导入成功，保存后生效。',
  'settings.importFail': '导入失败：{message}',
  'settings.importTitle': '导入配置',

  // 翻译流程
  'translate.status': '正在翻译…',
  'translate.statusChunk': '正在翻译第 {index}/{total} 段…',
  'translate.unknownProvider': '未配置',

  // 错误
  'error.noProvider': '还没有配置任何提供商，请先打开设置面板添加一个',
  'error.noModel': '未填写模型名',
  'error.requestFailed': '翻译请求失败',
  'error.emptyResponse': '接口返回了空内容，可能是模型不支持或提示词被拒绝',
  'error.emptyButOk': '(空响应，但状态码正常)',
  'error.network': '网络请求失败，请检查网络或接口地址',
  'error.timeout': '请求超时',
  'error.streamRead': '读取流式响应失败',
  'error.notUserscript': '请通过 Tampermonkey 或 Violentmonkey 安装 OJ++，并允许脚本所需权限',
  'error.baseUrlEmpty': '接口地址为空，请在设置里填写',

  // 站点名称与区域
  'site.nowcoder': '牛客',
  'site.codeforces': 'Codeforces',
  'section.statement': '题目描述',
  'section.input': '输入描述',
  'section.output': '输出描述',
  'section.note': '提示',
  'section.solution': '题解',

  // 预设
  'preset.customOpenAI': '自定义（兼容 OpenAI Chat）',
};

export type MessageKey = keyof typeof zh;
