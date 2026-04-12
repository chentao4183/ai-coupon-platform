const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/models.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Define benchmark and performance data for each version ID
const versionData = {
  // GLM Series
  'glm-5.1': {
    benchmarks: { mmlu: 88.2, humaneval: 84.5, math: 78.3, gsm8k: 95.8, mt_bench: 9.0 },
    performance: { speed: { inputTokensPerSec: 4500, outputTokensPerSec: 65 }, concurrency: { maxConcurrentRequests: 200, maxTokensPerMinute: 300000 } }
  },
  'glm-5-turbo': {
    benchmarks: { mmlu: 87.5, humaneval: 83.8, math: 77.0, gsm8k: 95.2, mt_bench: 8.9 },
    performance: { speed: { inputTokensPerSec: 5500, outputTokensPerSec: 78 }, concurrency: { maxConcurrentRequests: 200, maxTokensPerMinute: 350000 } }
  },
  'glm-5': {
    benchmarks: { mmlu: 86.0, humaneval: 81.2, math: 75.5, gsm8k: 93.8, mt_bench: 8.7 },
    performance: { speed: { inputTokensPerSec: 5000, outputTokensPerSec: 70 }, concurrency: { maxConcurrentRequests: 200, maxTokensPerMinute: 320000 } }
  },
  'glm-4.7': {
    benchmarks: { mmlu: 82.5, humaneval: 76.8, math: 70.2, gsm8k: 90.5, mt_bench: 8.4 },
    performance: { speed: { inputTokensPerSec: 8000, outputTokensPerSec: 95 }, concurrency: { maxConcurrentRequests: 300, maxTokensPerMinute: 500000 } }
  },
  'glm-4.5-air': {
    benchmarks: { mmlu: 76.3, humaneval: 68.5, math: 62.1, gsm8k: 84.2, mt_bench: 7.8 },
    performance: { speed: { inputTokensPerSec: 12000, outputTokensPerSec: 130 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 800000 } }
  },
  'glm-4.7-flashx': {
    benchmarks: { mmlu: 78.8, humaneval: 72.0, math: 66.5, gsm8k: 87.3, mt_bench: 8.0 },
    performance: { speed: { inputTokensPerSec: 15000, outputTokensPerSec: 150 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 1000000 } }
  },
  'glm-4.7-flash': {
    benchmarks: { mmlu: 74.5, humaneval: 65.2, math: 58.8, gsm8k: 82.0, mt_bench: 7.5 },
    performance: { speed: { inputTokensPerSec: 18000, outputTokensPerSec: 180 }, concurrency: { maxConcurrentRequests: 1000, maxTokensPerMinute: 1500000 } }
  },
  'glm-coding': {
    benchmarks: { mmlu: 75.0, humaneval: 80.5, math: 68.0, gsm8k: 85.5, mt_bench: 7.6 },
    performance: { speed: { inputTokensPerSec: 10000, outputTokensPerSec: 120 }, concurrency: { maxConcurrentRequests: 300, maxTokensPerMinute: 600000 } }
  },

  // GPT Series
  'o3': {
    benchmarks: { mmlu: 91.5, humaneval: 92.3, math: 96.8, gsm8k: 98.5, mt_bench: 9.4 },
    performance: { speed: { inputTokensPerSec: 3800, outputTokensPerSec: 45 }, concurrency: { maxConcurrentRequests: 50, maxTokensPerMinute: 200000 } }
  },
  'o1': {
    benchmarks: { mmlu: 90.2, humaneval: 90.8, math: 95.2, gsm8k: 97.8, mt_bench: 9.2 },
    performance: { speed: { inputTokensPerSec: 3200, outputTokensPerSec: 38 }, concurrency: { maxConcurrentRequests: 50, maxTokensPerMinute: 180000 } }
  },
  'gpt-4o': {
    benchmarks: { mmlu: 88.7, humaneval: 86.5, math: 76.8, gsm8k: 95.3, mt_bench: 9.0 },
    performance: { speed: { inputTokensPerSec: 5000, outputTokensPerSec: 75 }, concurrency: { maxConcurrentRequests: 100, maxTokensPerMinute: 300000 } }
  },
  'gpt-4o-mini': {
    benchmarks: { mmlu: 82.0, humaneval: 75.8, math: 68.5, gsm8k: 89.2, mt_bench: 8.2 },
    performance: { speed: { inputTokensPerSec: 14000, outputTokensPerSec: 140 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 1000000 } }
  },

  // Claude Series
  'claude-4-opus': {
    benchmarks: { mmlu: 91.0, humaneval: 91.5, math: 88.5, gsm8k: 97.2, mt_bench: 9.5 },
    performance: { speed: { inputTokensPerSec: 3500, outputTokensPerSec: 42 }, concurrency: { maxConcurrentRequests: 75, maxTokensPerMinute: 200000 } }
  },
  'claude-4-sonnet': {
    benchmarks: { mmlu: 88.3, humaneval: 85.2, math: 78.0, gsm8k: 95.0, mt_bench: 9.0 },
    performance: { speed: { inputTokensPerSec: 6000, outputTokensPerSec: 85 }, concurrency: { maxConcurrentRequests: 150, maxTokensPerMinute: 400000 } }
  },
  'claude-4-haiku': {
    benchmarks: { mmlu: 82.5, humaneval: 76.0, math: 70.2, gsm8k: 89.8, mt_bench: 8.3 },
    performance: { speed: { inputTokensPerSec: 16000, outputTokensPerSec: 160 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 1200000 } }
  },

  // Gemini Series
  'gemini-2.5-pro': {
    benchmarks: { mmlu: 90.5, humaneval: 88.8, math: 83.2, gsm8k: 96.5, mt_bench: 9.2 },
    performance: { speed: { inputTokensPerSec: 4200, outputTokensPerSec: 60 }, concurrency: { maxConcurrentRequests: 100, maxTokensPerMinute: 250000 } }
  },
  'gemini-2.5-flash': {
    benchmarks: { mmlu: 77.8, humaneval: 72.5, math: 65.0, gsm8k: 85.8, mt_bench: 8.0 },
    performance: { speed: { inputTokensPerSec: 16000, outputTokensPerSec: 165 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 1000000 } }
  },
  'gemini-2.5-flash-lite': {
    benchmarks: { mmlu: 72.0, humaneval: 65.8, math: 58.5, gsm8k: 80.2, mt_bench: 7.4 },
    performance: { speed: { inputTokensPerSec: 22000, outputTokensPerSec: 200 }, concurrency: { maxConcurrentRequests: 1000, maxTokensPerMinute: 2000000 } }
  },

  // Qwen Series
  'qwen3-235b': {
    benchmarks: { mmlu: 86.8, humaneval: 82.0, math: 75.5, gsm8k: 93.5, mt_bench: 8.7 },
    performance: { speed: { inputTokensPerSec: 4200, outputTokensPerSec: 55 }, concurrency: { maxConcurrentRequests: 300, maxTokensPerMinute: 400000 } }
  },
  'qwen3-32b': {
    benchmarks: { mmlu: 82.2, humaneval: 76.5, math: 69.8, gsm8k: 89.5, mt_bench: 8.2 },
    performance: { speed: { inputTokensPerSec: 8000, outputTokensPerSec: 100 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 800000 } }
  },
  'qwen3-mt-flash': {
    benchmarks: { mmlu: 70.5, humaneval: 62.0, math: 55.2, gsm8k: 78.5, mt_bench: 7.2 },
    performance: { speed: { inputTokensPerSec: 25000, outputTokensPerSec: 220 }, concurrency: { maxConcurrentRequests: 1000, maxTokensPerMinute: 2000000 } }
  },
  'qwen-vl-max': {
    benchmarks: { mmlu: 78.5, humaneval: 68.0, math: 62.0, gsm8k: 82.5, mt_bench: 7.8 },
    performance: { speed: { inputTokensPerSec: 5000, outputTokensPerSec: 70 }, concurrency: { maxConcurrentRequests: 300, maxTokensPerMinute: 400000 } }
  },

  // DeepSeek Series
  'deepseek-r1': {
    benchmarks: { mmlu: 87.0, humaneval: 85.5, math: 92.5, gsm8k: 97.0, mt_bench: 8.8 },
    performance: { speed: { inputTokensPerSec: 4000, outputTokensPerSec: 48 }, concurrency: { maxConcurrentRequests: 200, maxTokensPerMinute: 300000 } }
  },
  'deepseek-v3': {
    benchmarks: { mmlu: 82.8, humaneval: 77.2, math: 72.0, gsm8k: 90.5, mt_bench: 8.3 },
    performance: { speed: { inputTokensPerSec: 7500, outputTokensPerSec: 95 }, concurrency: { maxConcurrentRequests: 300, maxTokensPerMinute: 500000 } }
  },

  // Kimi Series
  'kimi-k2': {
    benchmarks: { mmlu: 85.5, humaneval: 79.8, math: 73.5, gsm8k: 92.0, mt_bench: 8.6 },
    performance: { speed: { inputTokensPerSec: 5000, outputTokensPerSec: 68 }, concurrency: { maxConcurrentRequests: 200, maxTokensPerMinute: 350000 } }
  },
  'moonshot-v1-128k': {
    benchmarks: { mmlu: 78.2, humaneval: 70.5, math: 64.0, gsm8k: 84.8, mt_bench: 7.9 },
    performance: { speed: { inputTokensPerSec: 4000, outputTokensPerSec: 50 }, concurrency: { maxConcurrentRequests: 100, maxTokensPerMinute: 200000 } }
  },

  // Doubao Series
  'doubao-1.5-pro': {
    benchmarks: { mmlu: 80.5, humaneval: 74.0, math: 68.5, gsm8k: 88.5, mt_bench: 8.1 },
    performance: { speed: { inputTokensPerSec: 12000, outputTokensPerSec: 140 }, concurrency: { maxConcurrentRequests: 1000, maxTokensPerMinute: 1500000 } }
  },
  'doubao-1.5-lite': {
    benchmarks: { mmlu: 71.8, humaneval: 63.5, math: 56.0, gsm8k: 79.5, mt_bench: 7.3 },
    performance: { speed: { inputTokensPerSec: 25000, outputTokensPerSec: 230 }, concurrency: { maxConcurrentRequests: 2000, maxTokensPerMinute: 3000000 } }
  },

  // ERNIE Series
  'ernie-4.0': {
    benchmarks: { mmlu: 79.8, humaneval: 73.5, math: 67.0, gsm8k: 87.8, mt_bench: 8.0 },
    performance: { speed: { inputTokensPerSec: 8000, outputTokensPerSec: 90 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 800000 } }
  },
  'ernie-3.5': {
    benchmarks: { mmlu: 70.2, humaneval: 61.5, math: 54.5, gsm8k: 78.0, mt_bench: 7.2 },
    performance: { speed: { inputTokensPerSec: 15000, outputTokensPerSec: 160 }, concurrency: { maxConcurrentRequests: 1000, maxTokensPerMinute: 1500000 } }
  },

  // MiniMax Series
  'minimax-01': {
    benchmarks: { mmlu: 76.5, humaneval: 70.0, math: 63.5, gsm8k: 84.0, mt_bench: 7.8 },
    performance: { speed: { inputTokensPerSec: 10000, outputTokensPerSec: 120 }, concurrency: { maxConcurrentRequests: 500, maxTokensPerMinute: 800000 } }
  },
  'minimax-text-01': {
    benchmarks: { mmlu: 72.5, humaneval: 64.2, math: 57.0, gsm8k: 80.8, mt_bench: 7.4 },
    performance: { speed: { inputTokensPerSec: 18000, outputTokensPerSec: 175 }, concurrency: { maxConcurrentRequests: 800, maxTokensPerMinute: 1200000 } }
  }
};

// Apply data to each version
let updated = 0;
for (const model of data.models) {
  for (const version of model.versions) {
    if (versionData[version.id]) {
      version.benchmarks = versionData[version.id].benchmarks;
      version.performance = versionData[version.id].performance;
      updated++;
    } else {
      console.warn(`WARNING: No data for version "${version.id}"`);
    }
  }
}

console.log(`Updated ${updated} versions`);

// Write back with consistent formatting
fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('File written successfully');
