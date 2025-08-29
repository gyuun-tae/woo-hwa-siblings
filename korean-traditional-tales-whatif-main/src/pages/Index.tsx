import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, BookOpen, Menu } from "lucide-react";
import { mockStartSession } from "@/lib/mockApi";
import { ChatInterface } from "@/components/ChatInterface";
import { Sidebar } from "@/components/Sidebar";

// 강제 리빌드를 위한 버전 식별자 v3.2
const APP_VERSION = "3.2";

const Index = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { createSession, currentSession } = useSessionManager();
  const { toast } = useToast();

  console.log(`앱 시작됨 - 버전 ${APP_VERSION}`);

  const handleStartSession = async () => {
    console.log("세션 시작 요청 - v3.2");
    setIsStarting(true);
    
    try {
      // Mock API 호출 (Supabase Edge Function 대신)
      console.log("Mock API 호출 중...");
      const data = await mockStartSession();
      
      console.log("Mock API 응답:", data);

      // 세션 생성 (이전 세션을 백엔드에 저장)
      const { storyId, title, firstQuestion } = data;
      
      await createSession(
        { id: storyId, title: title.replace('만약에: ', ''), summary: '', keyScenes: [], whatIfSeeds: [] },
        firstQuestion
      );

      toast({
        title: "새로운 이야기 시작!",
        description: "재미있는 '만약에' 여행을 떠나볼까요?",
      });
      
    } catch (error) {
      console.error('세션 시작 실패:', error);
      toast({
        title: "앗, 문제가 생겼어요",
        description: "다시 한번 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleNewChat = async () => {
    console.log("새 대화 요청 - v3.2");
    
    // 현재 대화가 있다면 저장되었음을 알림
    if (currentSession && currentSession.turns.length > 1) {
      toast({
        title: "이전 대화를 저장했어요",
        description: "백엔드에 동기화하고 새로운 이야기를 시작할게요!",
      });
    }
    
    setIsSidebarOpen(false);
    
    try {
      // 현재 세션을 백엔드에 저장하고 새 세션 생성
      console.log("새 대화 시작 중...");
      await handleStartSession();
      console.log("새 대화 생성 완료 - v3.2");
      
      // 성공 알림
      toast({
        title: "새로운 이야기 시작!",
        description: "새로운 동화로 상상 여행을 떠나보세요!",
      });
    } catch (error) {
      console.error("새 대화 생성 실패:", error);
      toast({
        title: "새 대화 시작 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const toggleSidebar = () => {
    console.log("사이드바 토글:", !isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    console.log("사이드바 닫기");
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* 사이드바 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onNewChat={handleNewChat}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          // 대화 화면
          <>
            {/* 헤더 - 항상 표시 */}
            <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="flex items-center gap-2"
              >
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline">메뉴</span>
              </Button>
              <h1 className="text-lg font-semibold text-foreground truncate flex-1 text-center mx-4">
                {currentSession.title}
              </h1>
              <div className="w-[60px]"></div> {/* 균형을 위한 빈 공간 */}
            </header>

            {/* 대화 인터페이스 */}
            <div className="flex-1 flex flex-col">
              <ChatInterface sessionId={currentSession.id} />
            </div>
          </>
        ) : (
          // 랜딩 페이지
          <div className="flex-1 flex items-center justify-center p-6 relative">
            {/* 햄버거 메뉴 버튼 - 항상 표시 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border shadow-sm"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">메뉴</span>
            </Button>

            <div className="max-w-xl mx-auto text-center">
              {/* 로고/아이콘 */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  만약에...? v{APP_VERSION}
                </h1>
                
                <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                  전래동화 속 상상의 세계로 들어가
                  <br />
                  "만약에" 질문으로 함께 생각해봐요!
                </p>
              </div>

              {/* 시작 버튼 */}
              <Button
                onClick={handleStartSession}
                disabled={isStarting}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                aria-describedby="start-button-desc"
              >
                {isStarting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" aria-hidden="true"></div>
                    이야기를 준비하고 있어요...
                    <span className="sr-only">로딩 중입니다</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" aria-hidden="true" />
                    상상 여행 시작하기
                  </>
                )}
              </Button>

              <div id="start-button-desc" className="sr-only">
                버튼을 누르면 전래동화 기반의 상상 여행이 시작됩니다
              </div>

              {/* 설명 */}
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  흥부와 놀부, 콩쥐팥쥐, 선녀와 나무꾼 등<br />
                  친숙한 전래동화로 상상력을 키워보세요!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;