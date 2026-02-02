const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

/**
 * WebSocket 测试脚本
 * 用于验证 gemini-proxy-cloudflare 是否能正常代理 WebSocket 连接
 */

// 配置参数
const PROXY_URL = process.env.PROXY_URL || 'ws://localhost:8787';
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || 'your-proxy-key';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'your-google-api-key';

// 音频输出配置
const AUDIO_OUTPUT_PATH = path.join(__dirname, 'output.pcm');
const audioStream = fs.createWriteStream(AUDIO_OUTPUT_PATH);

// Gemini Multimodal Live API 路径
const PATH = '/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';
const FULL_URL = `${PROXY_URL}${PATH}?key=${GOOGLE_API_KEY}`;

console.log('🚀 正在连接到代理:', FULL_URL);

const ws = new WebSocket(FULL_URL, {
  headers: {
    'Authorization': `Bearer ${GEMINI_PROXY_KEY}`
  }
});

ws.on('open', () => {
  console.log('✅ WebSocket 连接已成功建立！');
  
  // 发送一个标准的语音 setup 消息
  const setupMessage = {
    setup: {
      model: "models/gemini-2.5-flash-native-audio-latest",
      generation_config: {
        response_modalities: ["audio"],
        speech_config: {
          voice_config: {
            prebuilt_voice_config: {
              voice_name: "Puck" // 可选: Puck, Charon, Kore, Fenrir, Aoede
            }
          }
        }
      }
    }
  };
  
  console.log('📤 发送语音 Setup 消息...');
  ws.send(JSON.stringify(setupMessage));
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());
  
  // 1. 处理 Setup 完成
  if (response.setupComplete) {
    console.log('🎉 验证成功：代理正常工作，且已收到 setupComplete！');
    
    // 2. Setup 完成后，发送一个简单的文本提示，要求它用语音回答
    const clientContent = {
      client_content: {
        turns: [{
          role: "user",
          parts: [{ text: "你好，请帮我介绍一下北京王府井、奶子房、炮房的有趣的事情，不能少于1分钟。" }]
        }],
        turn_complete: true
      }
    };
    console.log('📤 发送测试指令: "你好，请用简短的语音跟我打个招呼。"');
    ws.send(JSON.stringify(clientContent));
  }

  // 2. 处理音频返回
   if (response.serverContent && response.serverContent.modelTurn) {
     const parts = response.serverContent.modelTurn.parts;
     parts.forEach(part => {
       if (part.inlineData && part.inlineData.mimeType.includes('audio')) {
         // 将 base64 音频数据写入文件
         const buffer = Buffer.from(part.inlineData.data, 'base64');
         audioStream.write(buffer);
         console.log(`📥 收到音频数据块 (${buffer.length} bytes)...`);
       }
     });
   }
 });

 ws.on('error', (error) => {
   console.error('❌ WebSocket 错误:', error.message);
   if (error.message.includes('401')) {
     console.error('💡 提示：请检查 GEMINI_PROXY_KEY 是否正确。');
   } else if (error.message.includes('ECONNREFUSED')) {
     console.error('💡 提示：请确保本地代理已启动 (npm run dev)。');
   }
 });

 ws.on('close', (code, reason) => {
   audioStream.end();
   console.log(`ℹ️ 连接已关闭 (代码: ${code}, 原因: ${reason || '无'})`);
   console.log(`🎵 音频已保存至: ${AUDIO_OUTPUT_PATH}`);
   console.log(`👉 请使用以下命令在 Mac 上播放:`);
   console.log(`   ffplay -f s16le -ar 24000 -ac 1 ${AUDIO_OUTPUT_PATH}`);
   console.log(`   或使用 afplay (可能需要指定格式):`);
   console.log(`   afplay -f LEI16 -r 24000 ${AUDIO_OUTPUT_PATH}`);
   process.exit(0);
 });

// 设置超时，防止脚本一直运行
setTimeout(() => {
  console.log('⏱️ 测试超时，正在关闭...');
  ws.close();
  process.exit(1);
}, 600000);
