export interface Story {
  id: string;
  title: string;
  summary: string;
  keyScenes: string[];
  whatIfSeeds: string[];
  backupQuestion?: string;
}

export const KOREAN_FOLKTALES: Story[] = [
  {
    id: "heungbu-nolbu",
    title: "흥부와 놀부",
    summary: "착한 동생 흥부와 욕심 많은 형 놀부의 이야기입니다. 흥부는 제비 다리를 고쳐주어 보물을 얻었지만, 놀부는 욕심을 부려 벌을 받았습니다.",
    keyScenes: [
      "흥부가 다친 제비를 발견하고 정성껏 치료해주는 장면",
      "제비가 박씨를 물어다 주는 장면",
      "흥부가 박을 타서 보물을 얻는 장면",
      "놀부가 제비 다리를 일부러 부러뜨리는 장면",
      "놀부가 박을 타자 도깨비들이 나오는 장면"
    ],
    whatIfSeeds: [
      "만약에 흥부가 제비 다리를 고쳐주지 않았다면 어땠을까?",
      "만약에 놀부가 처음부터 착한 마음을 가졌다면 어떻게 되었을까?"
    ],
    backupQuestion: "만약에 흥부와 놀부가 서로 도우며 살았다면 어떤 일이 벌어졌을까?"
  },
  {
    id: "kongji-patji",
    title: "콩쥐팥쥐",
    summary: "착한 콩쥐와 심술궂은 팥쥐의 이야기입니다. 콩쥐는 동물들의 도움으로 궁궐 잔치에 가서 원님과 결혼하게 됩니다.",
    keyScenes: [
      "콩쥐가 계모와 팥쥐에게 구박받는 장면",
      "동물들이 콩쥐를 도와 일을 해주는 장면",
      "콩쥐가 아름다운 옷을 입고 잔치에 가는 장면",
      "콩쥐가 신발을 잃어버리는 장면",
      "원님이 신발의 주인을 찾는 장면"
    ],
    whatIfSeeds: [
      "만약에 동물들이 콩쥐를 도와주지 않았다면 어땠을까?",
      "만약에 팥쥐가 콩쥐를 질투하지 않고 친하게 지냈다면 어떨까?"
    ],
    backupQuestion: "만약에 콩쥐가 잔치에 가지 않았다면 어떻게 되었을까?"
  },
  {
    id: "sun-moon-siblings",
    title: "해와 달이 된 오누이",
    summary: "가난한 오누이가 호랑이에게 쫓기다가 하늘로 올라가 해와 달이 되는 이야기입니다.",
    keyScenes: [
      "어머니가 떡을 팔러 가는 장면",
      "호랑이가 어머니를 잡아먹고 변장하는 장면",
      "오누이가 호랑이를 의심하며 문을 열지 않는 장면",
      "오누이가 나무 위로 올라가 숨는 장면",
      "하늘에서 내려온 동아줄을 타고 올라가는 장면"
    ],
    whatIfSeeds: [
      "만약에 오누이가 호랑이를 만났을 때 문을 열어줬다면 어떻게 되었을까?",
      "만약에 호랑이가 착한 마음을 갖고 있었다면 어땠을까?"
    ],
    backupQuestion: "만약에 어머니가 호랑이를 만나지 않았다면 어떻게 되었을까?"
  },
  {
    id: "fairy-woodcutter",
    title: "선녀와 나무꾼",
    summary: "착한 나무꾼이 사슴의 도움으로 선녀와 만나 결혼하지만, 욕심을 부려 선녀를 잃게 되는 이야기입니다.",
    keyScenes: [
      "나무꾼이 사냥꾼에게 쫓기는 사슴을 구해주는 장면",
      "사슴이 선녀들의 목욕 장소를 알려주는 장면",
      "나무꾼이 선녀의 날개옷을 숨기는 장면",
      "선녀와 나무꾼이 결혼하여 행복하게 사는 장면",
      "선녀가 날개옷을 찾아 하늘로 돌아가는 장면"
    ],
    whatIfSeeds: [
      "만약에 나무꾼이 선녀의 날개옷을 숨기지 않았다면 어떻게 되었을까?",
      "만약에 나무꾼이 사슴을 구해주지 않았다면 어땠을까?"
    ],
    backupQuestion: "만약에 선녀가 처음부터 나무꾼에게 자신의 정체를 말했다면 어떨까?"
  },
  {
    id: "rabbit-turtle",
    title: "토끼전 (별주부전)",
    summary: "용왕의 병을 고치기 위해 자라가 토끼를 데려가려 하지만, 꾀 많은 토끼가 지혜로 위기를 벗어나는 이야기입니다.",
    keyScenes: [
      "용왕이 병에 걸려 고민하는 장면",
      "자라가 토끼의 간이 필요하다는 말을 듣는 장면",
      "자라가 토끼를 속여 바다로 데려가는 장면",
      "토끼가 용궁에서 진실을 알게 되는 장면",
      "토끼가 꾀를 써서 용궁에서 탈출하는 장면"
    ],
    whatIfSeeds: [
      "만약에 토끼가 자라를 바로 의심하지 않았다면 어떻게 되었을까?",
      "만약에 용왕이 다른 방법으로 병을 고치려 했다면 어땠을까?"
    ],
    backupQuestion: "만약에 자라가 토끼에게 처음부터 진실을 말했다면 어떨까?"
  }
];

export const getRandomStory = (): Story => {
  const randomIndex = Math.floor(Math.random() * KOREAN_FOLKTALES.length);
  return KOREAN_FOLKTALES[randomIndex];
};

export const getStoryById = (id: string): Story | undefined => {
  return KOREAN_FOLKTALES.find(story => story.id === id);
};