import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useToast } from "@/hooks/use-toast";
import { mockChat } from "@/lib/mockApi";
import { ChatTurn } from "@/types/session";
import { cn } from "@/lib/utils";

// 강제 리빌드를 위한 버전 식별자 v3.2
const CHAT_VERSION = "3.2";

interface ChatInterfaceProps {
  sessionId: string;
}

export const ChatInterface = ({ sessionId }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { currentSession, addTurn } = useSessionManager();
  const { toast } = useToast();

  console.log(`채팅 인터페이스 렌더링 - 버전 ${CHAT_VERSION}, 세션ID: ${sessionId}`);

  // 스크롤을 아래로 이동
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // 새 메시지가 추가될 때마다 스크롤 이동
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [currentSession?.turns]);

  const handleSendMessage = async (retryCount = 0) => {
    if (!message.trim() || isLoading || !currentSession) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    console.log(`메시지 전송 시작 - v${CHAT_VERSION}:`, userMessage);

    try {
      // 사용자 메시지 추가 (즉시 저장)
      console.log("사용자 메시지 추가 중...");
      addTurn(sessionId, {
        role: 'user',
        content: userMessage
      });

      console.log("AI 응답 요청 중...");
      // Mock AI 응답 요청
      const data = await mockChat(userMessage, currentSession.title, currentSession.turns.slice(-6));

      console.log("AI 응답 수신:", data);
      // AI 응답 추가
      addTurn(sessionId, {
        role: 'assistant',
        content: data.reply
      });

      console.log("메시지 전송 완료 - v3.2");
    } catch (error: any) {
      console.error('메시지 전송 실패 - v3.2:', error);
      
      // 네트워크 오류인 경우 자동 재시도 (최대 2회)
      if (retryCount < 2 && (error.message?.includes('fetch') || error.message?.includes('network'))) {
        console.log(`재시도 중... (${retryCount + 1}/2)`);
        setTimeout(() => {
          setMessage(userMessage); // 메시지 복구
          handleSendMessage(retryCount + 1);
        }, 1000 * (retryCount + 1)); // 점진적 지연
        return;
      }

      // 오류 유형별 메시지
      let errorMessage = "잠시 후 다시 시도해 주세요.";
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "인터넷 연결을 확인해 주세요.";
      } else if (error.status === 429) {
        errorMessage = "요청이 너무 많습니다. 잠시 기다려 주세요.";
      } else if (error.status >= 500) {
        errorMessage = "서버에 문제가 있습니다. 잠시 후 시도해 주세요.";
      }

      toast({
        title: "메시지 전송에 실패했어요",
        description: errorMessage,
        variant: "destructive",
      });

      // 실패한 메시지 복구
      setMessage(userMessage);
    } finally {
      setIsLoading(false);
      // 포커스를 다시 입력창으로
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter 키로 메시지 전송 - v3.2");
      handleSendMessage();
    }
  };

  if (!currentSession) {
    console.error("세션을 찾을 수 없음 - v3.2");
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">세션을 찾을 수 없습니다. (v{CHAT_VERSION})</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 대화 내용 */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" role="log" aria-live="polite" aria-label="대화 내용">
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center text-xs text-muted-foreground mb-4">
            채팅 v{CHAT_VERSION} - 총 {currentSession.turns.length}개 메시지
          </div>
          
          {currentSession.turns.map((turn) => (
            <div key={turn.id} className={cn(
              "flex",
              turn.role === 'user' ? "justify-end" : "justify-start"
            )}>
              <ChatMessage turn={turn} />
            </div>
          ))}
          
          {/* 로딩 중일 때 표시 */}
          {isLoading && (
            <div className="flex items-start gap-3" role="status" aria-label="AI가 응답을 생성하고 있습니다">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-muted-foreground ml-2">생각하고 있어요... (v{CHAT_VERSION})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 입력 영역 */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 pb-safe" role="region" aria-label="메시지 입력">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="어떤 생각이 드나요? 자유롭게 말해보세요..."
                disabled={isLoading}
                className="bg-background border-border focus:border-primary resize-none min-h-[44px] text-base sm:text-sm"
                aria-label="메시지 입력"
                maxLength={1000}
              />
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!message.trim() || isLoading}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 min-w-[44px] min-h-[44px] flex-shrink-0"
              aria-label={isLoading ? "메시지 전송 중" : "메시지 전송"}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* 힌트 텍스트 - 모바일에서는 더 간단하게 */}
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              <span className="hidden sm:inline">Enter 키로 전송 • </span>
              상상력을 마음껏 펼쳐보세요! (v{CHAT_VERSION})
            </p>
            <p className="text-xs text-muted-foreground">
              {message.length}/1000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatMessageProps {
  turn: ChatTurn;
}

const ChatMessage = ({ turn }: ChatMessageProps) => {
  const isUser = turn.role === 'user';
  
  console.log(`메시지 렌더링 - ${turn.role}: ${turn.content.substring(0, 30)}...`);
  
  return (
    <div className={cn(
      "flex items-start gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
      isUser ? "flex-row-reverse justify-start" : "justify-start"
    )} role="article">
      {/* 아바타 */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser 
          ? "bg-foreground/10"
          : "bg-primary/10"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-foreground" aria-hidden="true" />
        ) : (
          <Bot className="w-4 h-4 text-primary" aria-hidden="true" />
        )}
      </div>

      {/* 메시지 내용 - 사용자 메시지는 검은 말풍선으로 오른쪽에 표시 */}
      <div className={cn(
        "relative max-w-[75%] rounded-2xl p-3 transition-all duration-200 shadow-sm",
        isUser 
          ? "bg-foreground text-background" // 검은 배경, 흰 텍스트
          : "bg-card border border-border"
      )}>
        <p className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap break-words",
          isUser ? "text-background" : "text-foreground"
        )}>
          {turn.content}
        </p>
        
        {/* 타임스탬프 */}
        <time className={cn(
          "text-xs mt-1 opacity-60 block",
          isUser ? "text-background" : "text-muted-foreground"
        )} dateTime={new Date(turn.timestamp).toISOString()}>
          {new Date(turn.timestamp).toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </time>
      </div>
    </div>
  );
};