# 智谱AI（Z.AI）模型清单

> 最后更新：2026-04-11
> 数据来源：docs.bigmodel.cn/cn/guide/start/model-overview

---

## 一、文本模型

### 1.1 旗舰模型

| 模型 | 定位 | 上下文 | 最大输出 | 特点 | API ID |
|------|------|--------|----------|------|--------|
| GLM-5.1 | 最新旗舰 | 200K | 128K | 最新旗舰模型，可独立工作 8 小时的 Agentic 模型。Coding 对齐 Claude Opus 4.6 | glm-5.1 |
| GLM-5 | 高智能基座 | 200K | 128K | 高智能基座模型，编程对齐 Claude Opus 4.5 | glm-5 |
| GLM-5-Turbo | 龙虾增强基座 | 200K | 128K | 龙虾增强基座模型，性价比之选 | glm-5-turbo |
| GLM-4.7 | 高智能模型 | 200K | 128K | LM Arena 开源第一、全球第四，OpenRouter 趋势榜第一 | glm-4.7 |

### 1.2 高性价比模型

| 模型 | 定位 | 上下文 | 最大输出 | 特点 | API ID |
|------|------|--------|----------|------|--------|
| GLM-4.7-FlashX | 轻量高速 | 200K | 128K | GLM-4.7 的轻量高速版本 | glm-4.7-flashx |
| GLM-4.6 | 超强性能 | 200K | 128K | 代码对齐 Claude Sonnet 4，全球开源 SOTA | glm-4.6 |
| GLM-4.5-Air | 高性价比 | 128K | 96K | 高性价比模型，适合日常开发任务 | glm-4.5-air |
| GLM-4.5-AirX | 高性价比极速版 | 128K | 96K | 高性价比极速版本 | glm-4.5-airx |

### 1.3 长文本模型

| 模型 | 定位 | 上下文 | 最大输出 | 特点 | API ID |
|------|------|--------|----------|------|--------|
| GLM-4-Long | 超长输入 | 1M | 4K | 支持 100 万 token 超长上下文输入 | glm-4-long |

### 1.4 高速低价模型

| 模型 | 定位 | 上下文 | 最大输出 | 特点 | API ID |
|------|------|--------|----------|------|--------|
| GLM-4-FlashX-250414 | 高速低价 | 128K | 16K | 高速低价版本（快照） | glm-4-flashx-250414 |

### 1.5 免费模型

| 模型 | 定位 | 上下文 | 最大输出 | 特点 | API ID |
|------|------|--------|----------|------|--------|
| GLM-4.7-Flash | 轻量免费 | 200K | 128K | 免费体验 GLM-4.7 系列能力 | glm-4.7-flash |
| GLM-4.5-Flash（即将下线） | 轻量免费 | 128K | 96K | 免费体验 GLM-4.5 系列能力 | glm-4.5-flash |
| GLM-4-Flash-250414 | 免费高速 | 128K | 16K | 免费高速版（快照） | glm-4-flash-250414 |

### 1.6 即将弃用模型

| 模型 | 定位 | 上下文 | 最大输出 | 特点 | API ID |
|------|------|--------|----------|------|--------|
| GLM-4.1-Plus | - | 128K | 4K | 即将弃用 | glm-4.1-plus |
| GLM-4.1-Flash | - | 128K | 4K | 即将弃用 | glm-4.1-flash |
| GLM-4.0-Plus | - | 128K | 4K | 即将弃用 | glm-4-plus |
| GLM-4-Flash | - | 128K | 4K | 即将弃用 | glm-4-flash |
| GLM-4-AirX | - | 8K | 4K | 即将弃用 | glm-4-airx |
| GLM-4-Air | - | 128K | 4K | 即将弃用 | glm-4-air |
| GLM-3-Turbo | - | 128K | 4K | 即将弃用 | glm-3-turbo |

---

## 二、视觉理解模型

| 模型 | 定位 | 上下文 | 最大输出 | 特点 | API ID |
|------|------|--------|----------|------|--------|
| GLM-5V-Turbo | 多模态Coding基座 | 200K | 128K | 最强视觉Coding能力，适用于复杂视觉推理任务 | glm-5v-turbo |
| GLM-4.6V | 视觉推理 | 128K | 32K | 高性能视觉理解，适合多模态推理任务 | glm-4.6v |
| GLM-OCR | 轻量图文解析 | 16K | 4K | 专为文档解析优化，轻量高效 | glm-ocr |
| AutoGLM-Phone | 手机智能助理框架 | 20K | 2048 | 手机智能体专用视觉模型 | autoglm-phone |
| GLM-4.1V-Thinking-FlashX | 轻量视觉推理 | 64K | 16K | 轻量视觉推理版本 | glm-4.1v-thinking-flashx |
| GLM-4.6V-Flash | 轻量视觉理解 | 128K | 32K | 免费 | glm-4.6v-flash |
| GLM-4.1V-Thinking-Flash | 轻量视觉推理 | 64K | 16K | 免费 | glm-4.1v-thinking-flash |
| GLM-4V-Flash | 轻量视觉理解 | 16K | 1K | 免费 | glm-4v-flash |
| GLM-4.1V | 视觉理解 | 8K | 4K | - | glm-4.1v |
| CogView-4-Detailer | 图像理解 | 32K | 4K | - | cogview-4-detailer |

---

## 三、图像生成模型

| 模型 | 定位 | 特点 | API ID |
|------|------|------|--------|
| GLM-Image | 旗舰图像生成 | 旗舰级图像生成能力 | glm-image |
| CogView-4 | 图像生成 | 高质量图像生成 | cogview-4 |
| CogView-3-Flash | 轻量图像生成 | 免费图像生成 | cogview-3-flash |

---

## 四、视频生成模型

| 模型 | 定位 | 特点 | API ID |
|------|------|------|--------|
| CogVideoX-3 | 高智能旗舰 | 旗舰视频生成 | cogvideox-3 |
| Vidu Q1 | 质量较优 | 质量优先的视频生成 | vidu-q1 |
| Vidu 2 | 高速低价 | 高速低价的视频生成 | vidu-2 |
| CogVideoX-Flash | 轻量视频生成 | 免费视频生成 | cogvideox-flash |

---

## 五、音视频模型

| 模型 | 定位 | 特点 | API ID |
|------|------|------|--------|
| GLM-TTS | 语音合成 | 高质量文本转语音 | glm-tts |
| GLM-TTS-Clone | 音色克隆 | 个性化音色克隆 | glm-tts-clone |
| GLM-ASR-2512 | 语音识别 | 语音转文本 | glm-asr-2512 |
| GLM-Realtime | 实时音视频 | 实时音视频交互 | glm-realtime |
| GLM-4-Voice | 语音模型 | 语音交互 | glm-4-voice |

---

## 六、向量模型（Embedding）

| 模型 | 维度 | 最大输入 | 特点 | API ID |
|------|------|----------|------|--------|
| Embedding-3 | 2048 | 8K | 第三代，性能更强 | embedding-3 |
| Embedding-2 | 1024 | 8K | 第二代 | embedding-2 |

---

## 七、其他模型

| 模型 | 定位 | 特点 | API ID |
|------|------|------|--------|
| CharGLM-4 | 拟人模型 | 角色扮演 | charglm-4 |
| Emohaa | 心理模型 | 情感陪伴 | emohaa |
| CodeGeeX-4 | 代码模型 | AI 编程 | codegeex-4 |
| Rerank | 重排序模型 | 文档重排序 | rerank |

---

## 免费模型汇总

| 类别 | 模型 | 上下文 | 最大输出 |
|------|------|--------|----------|
| 文本 | GLM-4.7-Flash | 200K | 128K |
| 文本 | GLM-4.5-Flash（即将下线） | 128K | 96K |
| 文本 | GLM-4-Flash-250414 | 128K | 16K |
| 视觉 | GLM-4.6V-Flash | 128K | 32K |
| 视觉 | GLM-4.1V-Thinking-Flash | 64K | 16K |
| 视觉 | GLM-4V-Flash | 16K | 1K |
| 图像 | CogView-3-Flash | - | - |
| 视频 | CogVideoX-Flash | - | - |
