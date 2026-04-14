// 临时脚本：为 models.json 添加 links 字段
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/models.json', 'utf8'));

const linksMap = {
  glm: {
    chatPlatform: 'https://chat.z.ai/',
    codingPlan: 'https://www.bigmodel.cn/glm-coding?ic=CWJW4TEIY7',
    apiDocs: 'https://docs.bigmodel.cn/cn/coding-plan/overview',
    openclawGuide: 'https://docs.bigmodel.cn/cn/coding-plan/tool/openclaw',
    claudeCodeGuide: 'https://docs.bigmodel.cn/cn/coding-plan/tool/claude',
    apiPricing: 'https://www.bigmodel.cn/pricing'
  },
  deepseek: {
    chatPlatform: 'https://chat.deepseek.com/',
    apiDocs: 'https://api-docs.deepseek.com/zh-cn/',
    apiPricing: 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing',
    openclawGuide: 'https://www.notion.so/sitinme/6-304489879d7b81809b2bcf477f4676ba',
    subscription: 'https://github.com/deepseek-ai/awesome-deepseek-integration'
  },
  kimi: {
    chatPlatform: 'https://www.kimi.com/websites',
    apiDocs: 'https://platform.kimi.com/docs/overview',
    apiPricing: 'https://platform.kimi.com/docs/pricing/chat',
    openclawGuide: 'https://platform.kimi.com/docs/guide/use-kimi-in-openclaw',
    codingPlan: 'https://www.kimi.com/code?track_id=f08ed765-c5b6-436a-ad28-9f97784c6fcd'
  },
  minimax: {
    chatPlatform: 'https://agent.minimaxi.com/',
    apiDocs: 'https://platform.minimaxi.com/docs/guides/models-intro',
    codingPlan: 'https://platform.minimaxi.com/subscribe/token-plan?code=CtXxhdeqpi&source=link',
    openclawGuide: 'https://platform.minimaxi.com/docs/token-plan/openclaw',
    apiPricing: 'https://platform.minimaxi.com/docs/guides/pricing-paygo'
  },
  doubao: {
    chatPlatform: 'https://www.doubao.com/chat/',
    apiPricing: 'https://www.volcengine.com/docs/82379/1544106?lang=zh',
    codingPlan: 'https://www.volcengine.com/activity/codingplan?ac=MMAP8JTTCAQ2&rc=CD3TAS2T',
    openclawGuide: 'https://www.volcengine.com/docs/82379/2183190?lang=zh'
  },
  qwen: {
    chatPlatform: 'https://www.qianwen.com/',
    codingPlan: 'https://bailian.console.aliyun.com/cn-beijing/?spm=5176.29619931.J_SEsSjsNv72yRuRFS2VknO.2.671b10d7LP4rlD&tab=coding-plan#/efm/coding-plan-index',
    apiPricing: 'https://bailian.console.aliyun.com/cn-beijing/?spm=5176.29619931.J_SEsSjsNv72yRuRFS2VknO.2.671b10d7LP4rlD&tab=doc#/doc/?type=model&url=2987148',
    openclawGuide: 'https://bailian.console.aliyun.com/cn-beijing/?spm=5176.29619931.J_SEsSjsNv72yRuRFS2VknO.2.671b10d7LP4rlD&tab=doc#/doc/?type=model&url=3023085'
  },
  ernie: {
    chatPlatform: 'https://yiyan.baidu.com/',
    codingPlan: 'https://console.bce.baidu.com/qianfan/resource/subscribe',
    apiPricing: 'https://cloud.baidu.com/doc/qianfan/s/wmh4sv6ya',
    openclawGuide: 'https://cloud.baidu.com/doc/qianfan/s/Rmn2ms2nm'
  },
  gpt: {
    chatPlatform: 'https://chatgpt.com/',
    subscription: 'https://chatgpt.com/#pricing',
    apiDocs: 'https://developers.openai.com/'
  },
  claude: {
    chatPlatform: 'https://claude.ai/new',
    apiDocs: 'https://platform.claude.com/docs/zh-CN/home',
    subscription: 'https://claude.com/pricing'
  },
  gemini: {
    chatPlatform: 'https://gemini.google.com/app',
    subscription: 'https://aistudio.google.com/apps',
    apiDocs: 'https://ai.google.dev/gemini-api/docs?hl=zh-cn'
  }
};

data.models.forEach(m => {
  if (linksMap[m.id]) m.links = linksMap[m.id];
});

fs.writeFileSync('src/data/models.json', JSON.stringify(data, null, 2) + '\n');
console.log('Updated', data.models.filter(m => m.links).length, 'models');
