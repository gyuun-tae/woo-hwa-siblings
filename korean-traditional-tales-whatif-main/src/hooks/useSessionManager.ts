import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatSession, ChatTurn } from '@/types/session';

// 강제 리빌드를 위한 버전 식별자 v3.2
const SESSION_MANAGER_VERSION = "3.2";

const SESSIONS_STORAGE_KEY = 'whatif-sessions-v3.2';
const CURRENT_SESSION_KEY = 'whatif-current-session-v3.2';
const MAX_SESSIONS = 20;

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0); // 강제 리렌더링을 위한 상태

  console.log(`세션 매니저 초기화 - 버전 ${SESSION_MANAGER_VERSION}`);

  // 강제 리렌더링 함수
  const forceRerender = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // 강제 초기화 함수 (새 대화 시작 시 사용)
  const forceReset = useCallback(() => {
    console.log('강제 초기화 시작 - v3.2');
    setForceUpdate(prev => prev + 1);
    
    // localStorage 키 강제 업데이트
    const newKey = `force-reset-${Date.now()}`;
    try {
      localStorage.setItem('force-reset-key', newKey);
      console.log('강제 초기화 키 설정 완료 - v3.2');
    } catch (error) {
      console.error('강제 초기화 키 설정 실패 - v3.2:', error);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    const loadData = () => {
      console.log("세션 데이터 로드 시작 - v3.2");
      
      try {
        // 세션 목록 로드 (localStorage 우선, sessionStorage 대체)
        let storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
        if (!storedSessions) {
          storedSessions = sessionStorage.getItem(SESSIONS_STORAGE_KEY);
        }
        
        if (storedSessions) {
          const parsed = JSON.parse(storedSessions);
          setSessions(Array.isArray(parsed) ? parsed : []);
          console.log('세션 로드 성공 - v3.2:', parsed.length, '개 세션');
        } else {
          setSessions([]);
          console.log('저장된 세션이 없습니다 - v3.2');
        }

        // 현재 세션 ID 로드
        let storedCurrentId = localStorage.getItem(CURRENT_SESSION_KEY);
        if (!storedCurrentId) {
          storedCurrentId = sessionStorage.getItem(CURRENT_SESSION_KEY);
        }
        setCurrentSessionId(storedCurrentId);
        console.log('현재 세션 ID 로드 - v3.2:', storedCurrentId);
      } catch (error) {
        console.error('데이터 로드 실패 - v3.2:', error);
        setSessions([]);
        setCurrentSessionId(null);
      }
    };

    loadData();

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSIONS_STORAGE_KEY || e.key === CURRENT_SESSION_KEY || e.key === 'force-reset-key' || e.key === 'session-update') {
        console.log('Storage 변경 감지 - v3.2:', e.key);
        loadData();
        // 강제 리렌더링 추가
        forceRerender();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 현재 세션 조회 (메모이제이션)
  const currentSession = useMemo(() => {
    if (!currentSessionId) return null;
    const session = sessions.find(session => session.id === currentSessionId) || null;
    console.log('현재 세션 조회 - v3.2:', session?.id, session?.title);
    return session;
  }, [sessions, currentSessionId, forceUpdate]); // forceUpdate 의존성 추가

  // 세션 저장 (콜백 메모이제이션)
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    console.log('세션 저장 시작 - v3.2:', newSessions.length, '개 세션');
    
    try {
      setSessions(newSessions);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
      
      // 저장 확인을 위한 검증
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (!saved) {
        throw new Error('localStorage 저장 실패');
      }
      console.log('localStorage 저장 성공 - v3.2');
      
      // 강제 리렌더링 트리거
      forceRerender();
    } catch (error) {
      console.error('세션 저장 실패 - v3.2:', error);
      
      // 저장 실패 시 대체 저장소 시도 (sessionStorage)
      try {
        sessionStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
        console.warn('localStorage 실패로 sessionStorage 사용 - v3.2');
        forceRerender();
      } catch (fallbackError) {
        console.error('sessionStorage도 실패 - v3.2:', fallbackError);
      }
    }
  }, [forceRerender]);

  // 백엔드에 세션 저장 (Mock API)
  const saveSessionToBackend = useCallback(async (session: ChatSession) => {
    try {
      // 실제 백엔드 API 호출을 시뮬레이션
      console.log('백엔드에 세션 저장 중 - v3.2:', session.id);
      
      // Mock API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('백엔드 저장 완료 - v3.2:', session.id);
      return true;
    } catch (error) {
      console.error('백엔드 저장 실패 - v3.2:', error);
      return false;
    }
  }, []);

  // 새 세션 생성 (개선된 버전)
  const createSession = useCallback(async (story: any, firstQuestion: string) => {
    const sessionId = `session-v3.2-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('새 세션 생성 - v3.2:', sessionId, story.title);
    
    // 현재 세션을 백엔드에 저장 (있는 경우)
    if (currentSession && currentSession.turns.length > 1) {
      console.log('이전 세션을 백엔드에 저장 중 - v3.2');
      await saveSessionToBackend(currentSession);
    }

    const newSession: ChatSession = {
      id: sessionId,
      storyId: story.id || 'unknown',
      title: story.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      turns: [{
        id: `turn-v3.2-${Date.now()}`,
        role: 'assistant',
        content: firstQuestion,
        timestamp: Date.now()
      }],
      isActive: true
    };

    // 현재 세션을 비활성화하고 새 세션을 맨 위에 추가
    const updatedSessions = [
      newSession, 
      ...sessions.map(s => ({ ...s, isActive: false }))
    ].slice(0, MAX_SESSIONS);
    
    // 세션 목록 업데이트
    saveSessions(updatedSessions);
    
    // 현재 세션 ID를 새 세션으로 변경 (대화 창 초기화)
    setCurrentSessionId(sessionId);
    
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
      console.log('현재 세션 ID 저장 - v3.2:', sessionId);
    } catch (error) {
      try {
        sessionStorage.setItem(CURRENT_SESSION_KEY, sessionId);
        console.warn('현재 세션 ID sessionStorage 저장 - v3.2');
      } catch (fallbackError) {
        console.error('현재 세션 ID 저장 실패 - v3.2:', fallbackError);
      }
    }
    
    // 강제 리렌더링으로 UI 즉시 업데이트
    forceRerender();
    
    // 추가 강제 초기화
    setTimeout(() => {
      console.log('추가 강제 초기화 실행 - v3.2');
      forceRerender();
      // localStorage 키 강제 업데이트
      try {
        localStorage.setItem('session-update', Date.now().toString());
      } catch (error) {
        console.error('추가 강제 초기화 실패 - v3.2:', error);
      }
    }, 100);
    
    console.log('새 세션 생성 완료 - v3.2:', sessionId);
    return sessionId;
  }, [sessions, currentSession, saveSessions, saveSessionToBackend, forceRerender]);

  // 세션 전환
  const switchToSession = useCallback((sessionId: string) => {
    console.log('세션 전환 - v3.2:', sessionId);
    
    const updatedSessions = sessions.map(session => ({
      ...session,
      isActive: session.id === sessionId
    }));
    saveSessions(updatedSessions);
    setCurrentSessionId(sessionId);
    
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
    } catch (error) {
      try {
        sessionStorage.setItem(CURRENT_SESSION_KEY, sessionId);
      } catch (fallbackError) {
        console.error('세션 전환 ID 저장 실패 - v3.2:', fallbackError);
      }
    }
    
    // 강제 리렌더링
    forceRerender();
  }, [sessions, saveSessions, forceRerender]);

  // 턴 추가 (수정된 버전)
  const addTurn = useCallback((sessionId: string, turn: Omit<ChatTurn, 'id' | 'timestamp'>) => {
    const newTurn: ChatTurn = {
      id: `turn-v3.2-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...turn
    };

    console.log('턴 추가 시작 - v3.2:', sessionId, turn.role, turn.content.substring(0, 50) + '...');

    // 현재 세션 상태를 기반으로 업데이트
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.map(session => {
        if (session.id === sessionId) {
          const updatedSession = {
            ...session,
            turns: [...session.turns, newTurn],
            updatedAt: Date.now(),
            isActive: true
          };
          console.log('세션 업데이트 완료 - v3.2:', updatedSession.turns.length, '개 턴');
          return updatedSession;
        }
        return { ...session, isActive: false };
      });

      // 즉시 저장
      try {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
        console.log('즉시 저장 완료 - v3.2');
      } catch (error) {
        console.error('즉시 저장 실패 - v3.2:', error);
        try {
          sessionStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
        } catch (fallbackError) {
          console.error('sessionStorage 저장도 실패 - v3.2:', fallbackError);
        }
      }

      return updatedSessions;
    });
    
    // 강제 리렌더링
    forceRerender();
  }, [forceRerender]);

  // 세션 삭제 (백엔드 동기화 포함)
  const deleteSession = useCallback(async (sessionId: string) => {
    console.log('세션 삭제 시작 - v3.2:', sessionId);
    
    // 삭제할 세션을 백엔드에서도 제거
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    if (sessionToDelete) {
      console.log('백엔드에서 세션 삭제 중 - v3.2:', sessionId);
      try {
        // Mock API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('백엔드에서 세션 삭제 완료 - v3.2:', sessionId);
      } catch (error) {
        console.error('백엔드 삭제 실패 - v3.2:', error);
      }
    }
    
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    
    if (currentSessionId === sessionId) {
      // 가장 최근 세션으로 전환하거나 null 설정
      const nextSession = updatedSessions[0];
      if (nextSession) {
        const finalSessions = updatedSessions.map((s, index) => ({
          ...s,
          isActive: index === 0
        }));
        saveSessions(finalSessions);
        setCurrentSessionId(nextSession.id);
        
        try {
          localStorage.setItem(CURRENT_SESSION_KEY, nextSession.id);
        } catch (error) {
          try {
            sessionStorage.setItem(CURRENT_SESSION_KEY, nextSession.id);
          } catch (fallbackError) {
            console.error('세션 삭제 후 전환 실패 - v3.2:', fallbackError);
          }
        }
      } else {
        saveSessions(updatedSessions);
        setCurrentSessionId(null);
        
        try {
          localStorage.removeItem(CURRENT_SESSION_KEY);
        } catch (error) {
          try {
            sessionStorage.removeItem(CURRENT_SESSION_KEY);
          } catch (fallbackError) {
            console.error('세션 삭제 후 ID 제거 실패 - v3.2:', fallbackError);
          }
        }
      }
    } else {
      saveSessions(updatedSessions);
    }
    
    // 강제 리렌더링
    forceRerender();
  }, [sessions, currentSessionId, saveSessions, forceRerender]);

  return {
    sessions,
    currentSessionId,
    currentSession,
    createSession,
    switchToSession,
    addTurn,
    deleteSession,
    forceReset // 강제 초기화 함수 추가
  };
};