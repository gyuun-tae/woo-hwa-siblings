import { getRandomStory } from "@/data/stories";

// Mock API 응답 지연 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock start-session API
export const mockStartSession = async () => {
  await delay(1000); // 1초 지연
  
  const story = getRandomStory();
  
  // 동화별 맞춤형 질문 생성
  const storySpecificQuestions = {
    "heungbu-nolbu": [
      "만약에 흥부가 제비 다리를 고쳐주지 않았다면 어땠을까?",
      "만약에 놀부가 처음부터 착한 마음을 가졌다면 어떻게 되었을까?",
      "만약에 흥부와 놀부가 서로 도우며 살았다면 어떤 일이 벌어졌을까?"
    ],
    "kongji-patji": [
      "만약에 동물들이 콩쥐를 도와주지 않았다면 어땠을까?",
      "만약에 팥쥐가 콩쥐를 질투하지 않고 친하게 지냈다면 어떨까?",
      "만약에 콩쥐가 잔치에 가지 않았다면 어떻게 되었을까?"
    ],
    "sun-moon-siblings": [
      "만약에 오누이가 호랑이를 만났을 때 문을 열어줬다면 어떻게 되었을까?",
      "만약에 호랑이가 착한 마음을 갖고 있었다면 어땠을까?",
      "만약에 어머니가 호랑이를 만나지 않았다면 어떻게 되었을까?"
    ],
    "fairy-woodcutter": [
      "만약에 나무꾼이 선녀의 날개옷을 숨기지 않았다면 어떻게 되었을까?",
      "만약에 나무꾼이 사슴을 구해주지 않았다면 어땠을까?",
      "만약에 선녀가 처음부터 나무꾼에게 자신의 정체를 말했다면 어떨까?"
    ],
    "rabbit-turtle": [
      "만약에 토끼가 자라를 바로 의심하지 않았다면 어떻게 되었을까?",
      "만약에 용왕이 다른 방법으로 병을 고치려 했다면 어땠을까?",
      "만약에 자라가 토끼에게 처음부터 진실을 말했다면 어떨까?"
    ]
  };
  
  // 동화별 맞춤형 질문 선택
  const questions = storySpecificQuestions[story.id as keyof typeof storySpecificQuestions] || story.whatIfSeeds;
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    sessionId: `session-${Date.now()}`,
    storyId: story.id,
    title: `만약에: ${story.title}`,
    firstQuestion: randomQuestion
  };
};

// Mock chat API
export const mockChat = async (message: string, storyContext: string, conversationHistory: any[]) => {
  await delay(1500); // 1.5초 지연
  
  // 동화별 맞춤형 응답 생성
  const storyResponses = {
    "흥부와 놀부": [
      `흥미로운 질문이네요! ${storyContext}에서 "${message}"라는 상황이 벌어진다면...`,
      `정말 재미있는 상상이에요! ${storyContext}의 맥락에서 생각해보면...`,
      `좋은 질문입니다! ${storyContext}의 세계에서 이런 일이 일어난다면...`
    ],
    "콩쥐팥쥐": [
      `흥미로운 관점이에요! ${storyContext}의 이야기를 바탕으로 생각해보면...`,
      `정말 창의적인 생각이네요! ${storyContext}에서 이런 변화가 생긴다면...`,
      `좋은 질문입니다! ${storyContext}의 세계에서 이런 일이 일어난다면...`
    ],
    "해와 달이 된 오누이": [
      `흥미로운 질문이네요! ${storyContext}에서 "${message}"라는 상황이 벌어진다면...`,
      `정말 재미있는 상상이에요! ${storyContext}의 맥락에서 생각해보면...`,
      `좋은 질문입니다! ${storyContext}의 세계에서 이런 일이 일어난다면...`
    ],
    "선녀와 나무꾼": [
      `흥미로운 관점이에요! ${storyContext}의 이야기를 바탕으로 생각해보면...`,
      `정말 창의적인 생각이네요! ${storyContext}에서 이런 변화가 생긴다면...`,
      `좋은 질문입니다! ${storyContext}의 세계에서 이런 일이 일어난다면...`
    ],
    "토끼전": [
      `흥미로운 질문이네요! ${storyContext}에서 "${message}"라는 상황이 벌어진다면...`,
      `정말 재미있는 상상이에요! ${storyContext}의 맥락에서 생각해보면...`,
      `좋은 질문입니다! ${storyContext}의 세계에서 이런 일이 일어난다면...`
    ]
  };
  
  // 동화별 맞춤형 응답 선택
  const responses = storyResponses[storyContext as keyof typeof storyResponses] || [
    `흥미로운 질문이네요! ${storyContext}에서 "${message}"라는 상황이 벌어진다면...`,
    `정말 재미있는 상상이에요! ${storyContext}의 맥락에서 생각해보면...`,
    `좋은 질문입니다! ${storyContext}의 세계에서 이런 일이 일어난다면...`
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    reply: randomResponse + " 계속해서 더 구체적으로 이야기해보세요! 어떤 일이 벌어질 것 같나요?"
  };
};
