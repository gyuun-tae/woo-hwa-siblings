import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 금칙어 필터
const bannedWords = ['죽', '때리', '죽이', '폭력', '나쁜말', '바보', '멍청'];

function containsBannedWords(text: string): boolean {
  return bannedWords.some(word => text.includes(word));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, storyContext, conversationHistory } = await req.json();
    
    const naverApiKey = Deno.env.get('NAVER_CLOUD_API_KEY');
    
    if (!naverApiKey) {
      throw new Error('NAVER_CLOUD_API_KEY is not configured');
    }

    // 금칙어 체크
    if (containsBannedWords(message)) {
      return new Response(JSON.stringify({
        reply: "더 좋은 말로 다시 생각해 볼까요? 어떤 다른 아이디어가 있나요?"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 대화 기록 구성
    const messages = [
      {
        role: 'system',
        content: `당신은 초등학교 저학년 아이들과 전래동화에 대해 "만약에" 질문으로 대화하는 친근한 선생님입니다.

규칙:
1. 초등 저학년이 이해할 수 있는 쉬운 말로 대화하세요
2. 아이의 답변을 긍정적으로 받아주고 격려하세요
3. 아이의 상상력을 더 자극하는 후속 질문을 1-2문장으로 해주세요
4. 폭력적이거나 무서운 내용은 피하고, 교육적 방향으로 이끌어주세요
5. "왜 그렇게 생각해?", "그러면 어떤 일이 일어날까?" 같은 질문으로 사고를 확장시켜주세요
6. 아이가 창의적인 아이디어를 냈을 때는 충분히 칭찬해주세요

현재 동화 맥락: ${storyContext || '전래동화'}

아이의 답변에 대해 따뜻하게 응답하고, 다음 "만약에" 질문이나 생각을 더 깊게 하는 질문을 해주세요.`
      }
    ];

    // 대화 기록 추가
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((turn: any) => {
        messages.push({
          role: turn.role === 'user' ? 'user' : 'assistant',
          content: turn.content
        });
      });
    }

    // 현재 사용자 메시지 추가
    messages.push({
      role: 'user',
      content: message
    });

    // 네이버 클라우드 HyperCLOVA X API 호출
    const response = await fetch('https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003', {
      method: 'POST',
      headers: {
        'X-NCP-CLOVASTUDIO-API-KEY': naverApiKey,
        'X-NCP-APIGW-API-KEY': naverApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        topP: 0.8,
        topK: 0,
        maxTokens: 256,
        temperature: 0.7,
        repeatPenalty: 1.2,
        stopBefore: [],
        includeAiFilters: true
      })
    });

    if (!response.ok) {
      console.error('네이버 API 오류:', response.status, await response.text());
      
      // 백업 응답
      const backupReplies = [
        "정말 재미있는 생각이네요! 그러면 또 어떤 일이 일어났을까요?",
        "와, 창의적인 아이디어예요! 그 다음에는 어떻게 되었을까요?",
        "좋은 상상이에요! 다른 등장인물들은 어떻게 느꼈을까요?"
      ];
      
      return new Response(JSON.stringify({
        reply: backupReplies[Math.floor(Math.random() * backupReplies.length)]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const reply = data.result?.message?.content || "정말 흥미로운 생각이네요! 더 자세히 말해줄 수 있나요?";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('채팅 오류:', error);
    
    return new Response(JSON.stringify({
      reply: "잠깐, 생각을 정리하고 있어요. 다시 한번 말해줄래요?"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});