import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stories = [
  {
    id: "heungbu-nolbu",
    title: "흥부와 놀부",
    summary: "착한 흥부와 욕심 많은 놀부 형제의 이야기. 제비 다리를 고쳐준 흥부는 보상을 받고, 욕심을 부린 놀부는 벌을 받는다.",
    keyScenes: [
      "제비 다리를 고쳐주는 흥부",
      "박에서 보물이 나오는 장면",
      "욕심을 부려 제비 다리를 일부러 다치게 하는 놀부"
    ],
    whatIfSeeds: [
      "만약에 흥부가 제비 다리를 고쳐주지 않았다면 어땠을까?",
      "만약에 놀부가 착했다면 어떤 일이 일어났을까?"
    ]
  },
  {
    id: "kongji-patji",
    title: "콩쥐팥쥐",
    summary: "계모와 언니의 구박을 받던 콩쥐가 도깨비들의 도움으로 행복을 찾는 이야기.",
    keyScenes: [
      "콩쥐가 집안일을 혼자 하는 장면",
      "도깨비들이 콩쥐를 도와주는 장면",
      "콩쥐가 원님과 결혼하는 장면"
    ],
    whatIfSeeds: [
      "만약에 콩쥐가 도깨비들의 도움을 받지 못했다면?",
      "만약에 팥쥐가 콩쥐에게 친절했다면?"
    ]
  },
  {
    id: "sun-moon-siblings",
    title: "해와 달이 된 오누이",
    summary: "호랑이에게 쫓긴 오누이가 하늘로 올라가 해와 달이 되는 이야기.",
    keyScenes: [
      "어머니가 떡을 팔러 가는 장면",
      "호랑이가 오누이를 쫓아오는 장면",
      "하늘에서 동아줄이 내려오는 장면"
    ],
    whatIfSeeds: [
      "만약에 오누이가 호랑이에게 문을 열어줬다면?",
      "만약에 썩은 동아줄을 잡았다면?"
    ]
  },
  {
    id: "fairy-woodcutter",
    title: "선녀와 나무꾼",
    summary: "사슴의 도움으로 선녀와 결혼한 나무꾼의 이야기.",
    keyScenes: [
      "나무꾼이 사슴을 구해주는 장면",
      "선녀의 날개옷을 숨기는 장면",
      "선녀가 하늘로 돌아가는 장면"
    ],
    whatIfSeeds: [
      "만약에 나무꾼이 날개옷을 숨기지 않았다면?",
      "만약에 사슴의 말을 듣지 않았다면?"
    ]
  },
  {
    id: "rabbit-tale",
    title: "토끼전",
    summary: "바다 용왕의 병을 고치기 위해 토끼를 데려오려는 자라와 영리한 토끼의 이야기.",
    keyScenes: [
      "자라가 토끼를 설득하는 장면",
      "토끼가 용궁에 도착하는 장면",
      "토끼가 기지로 탈출하는 장면"
    ],
    whatIfSeeds: [
      "만약에 토끼가 자라를 처음부터 의심했다면?",
      "만약에 토끼가 용궁에서 도망치지 못했다면?"
    ]
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const naverApiKey = Deno.env.get('NAVER_CLOUD_API_KEY');
    
    if (!naverApiKey) {
      throw new Error('NAVER_CLOUD_API_KEY is not configured');
    }

    // 랜덤하게 동화 선택
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    const randomSeed = randomStory.whatIfSeeds[Math.floor(Math.random() * randomStory.whatIfSeeds.length)];

    // 세션 ID 생성
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 네이버 클라우드 HyperCLOVA X API 호출
    const response = await fetch('https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003', {
      method: 'POST',
      headers: {
        'X-NCP-CLOVASTUDIO-API-KEY': naverApiKey,
        'X-NCP-APIGW-API-KEY': naverApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `당신은 초등학교 저학년 아이들과 전래동화에 대해 "만약에" 질문으로 대화하는 선생님입니다.

규칙:
1. 초등 저학년이 이해할 수 있는 쉬운 말로 대화하세요
2. 폭력적이거나 무서운 내용은 피하세요
3. 아이들의 상상력과 인과 추론 능력을 키우는 질문을 하세요
4. 첫 질문은 "만약에 ~ 어땠을까?"로 시작하는 1문장으로 하세요
5. 긍정적이고 교육적인 방향으로 대화를 이어가세요

현재 동화: ${randomStory.title}
동화 요약: ${randomStory.summary}
핵심 장면들: ${randomStory.keyScenes.join(', ')}

이 동화를 바탕으로 아이의 상상력을 자극하는 첫 번째 "만약에" 질문을 해주세요.`
          }
        ],
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
      // 백업 질문 사용
      return new Response(JSON.stringify({
        sessionId,
        storyId: randomStory.id,
        title: `만약에: ${randomStory.title}`,
        firstQuestion: randomSeed
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const firstQuestion = data.result?.message?.content || randomSeed;

    return new Response(JSON.stringify({
      sessionId,
      storyId: randomStory.id,
      title: `만약에: ${randomStory.title}`,
      firstQuestion
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('세션 시작 오류:', error);
    
    // 에러 시 백업 질문 반환
    const backupStory = stories[0];
    const backupSessionId = `session-${Date.now()}-backup`;
    
    return new Response(JSON.stringify({
      sessionId: backupSessionId,
      storyId: backupStory.id,
      title: `만약에: ${backupStory.title}`,
      firstQuestion: backupStory.whatIfSeeds[0]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});