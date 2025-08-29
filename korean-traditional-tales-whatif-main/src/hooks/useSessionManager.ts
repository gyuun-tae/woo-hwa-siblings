import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatSession, ChatTurn } from '@/types/session';

// 강제 리빌드를 위한 버전 식별자 v3.0
const SESSION_MANAGER_VERSION = "3.0";

const SESSIONS_STORAGE_KEY = 'whatif-sessions-v3';
const CURRENT_SESSION_KEY = 'whatif-current-session-v3';
const MAX_SESSIONS = 20;

export const useSessionManager = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  console.log(`세션 매니저 초기화 - 버전 ${SESSION_MANAGER_VERSION}`);

  // 초기 로드
  useEffect(() => {
    const loadData = () => {
      console.log("세션 데이터 로드 시작 - v3.0");
      
      try {
        // 세션 목록 로드 (localStorage 우선, sessionStorage 대체)
        let storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
        if (!storedSessions) {
          storedSessions = sessionStorage.getItem(SESSIONS_STORAGE_KEY);
        }
        
        if (storedSessions) {
          const parsed = JSON.parse(storedSessions);
          setSessions(Array.isArray(parsed) ? parsed : []);
          console.log('세션 로드 성공 - v3.0:', parsed.length, '개 세션');
        } else {
          setSessions([]);
          console.log('저장된 세션이 없습니다 - v3.0');
        }

        // 현재 세션 ID 로드
        let storedCurrentId = localStorage.getItem(CURRENT_SESSION_KEY);
        if (!storedCurrentId) {
          storedCurrentId = sessionStorage.getItem(CURRENT_SESSION_KEY);
        }
        setCurrentSessionId(storedCurrentId);
        console.log('현재 세션 ID 로드 - v3.0:', storedCurrentId);
      } catch (error) {
        console.error('데이터 로드 실패 - v3.0:', error);
        setSessions([]);
        setCurrentSessionId(null);
      }
    };

    loadData();

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSIONS_STORAGE_KEY || e.key === CURRENT_SESSION_KEY) {
        console.log('Storage 변경 감지 - v3.0:', e.key);
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 현재 세션 조회 (메모이제이션)
  const currentSession = useMemo(() => {
    if (!currentSessionId) return null;
    const session = sessions.find(session => session.id === currentSessionId) || null;
    console.log('현재 세션 조회 - v3.0:', session?.id, session?.title);
    return session;
  }, [sessions, currentSessionId]);

  // 세션 저장 (콜백 메모이제이션)
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    console.log('세션 저장 시작 - v3.0:', newSessions.length, '개 세션');
    
    try {
      setSessions(newSessions);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
      
      // 저장 확인을 위한 검증
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (!saved) {
        throw new Error('localStorage 저장 실패');
      }
      console.log('localStorage 저장 성공 - v3.0');
    } catch (error) {
      console.error('세션 저장 실패 - v3.0:', error);
      
      // 저장 실패 시 대체 저장소 시도 (sessionStorage)
      try {
        sessionStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
        console.warn('localStorage 실패로 sessionStorage 사용 - v3.0');
      } catch (fallbackError) {
        console.error('sessionStorage도 실패 - v3.0:', fallbackError);
      }
    }
  }, []);

  // 새 세션 생성
  const createSession = useCallback((story: any, firstQuestion: string) => {
    const sessionId = `session-v3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('새 세션 생성 - v3.0:', sessionId, story.title);
    
    const newSession: ChatSession = {
      id: sessionId,
      storyId: story.id || 'unknown',
      title: story.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      turns: [{
        id: `turn-v3-${Date.now()}`,
        role: 'assistant',
        content: firstQuestion,
        timestamp: Date.now()
      }],
      isActive: true
    };

    const updatedSessions = [newSession, ...sessions.map(s => ({ ...s, isActive: false }))].slice(0, MAX_SESSIONS);
    saveSessions(updatedSessions);
    setCurrentSessionId(sessionId);
    
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
      console.log('현재 세션 ID 저장 - v3.0:', sessionId);
    } catch (error) {
      try {
        sessionStorage.setItem(CURRENT_SESSION_KEY, sessionId);
        console.warn('현재 세션 ID sessionStorage 저장 - v3.0');
      } catch (fallbackError) {
        console.error('현재 세션 ID 저장 실패 - v3.0:', fallbackError);
      }
    }
    
    return sessionId;
  }, [sessions, saveSessions]);

  // 세션 전환
  const switchToSession = useCallback((sessionId: string) => {
    console.log('세션 전환 - v3.0:', sessionId);
    
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
        console.error('세션 전환 ID 저장 실패 - v3.0:', fallbackError);
      }
    }
  }, [sessions, saveSessions]);

  // 턴 추가
  const addTurn = useCallback((sessionId: string, turn: Omit<ChatTurn, 'id' | 'timestamp'>) => {
    const newTurn: ChatTurn = {
      id: `turn-v3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...turn
    };

    console.log('턴 추가 시작 - v3.0:', sessionId, turn.role, turn.content.substring(0, 50) + '...');

    const updatedSessions = sessions.map(session => {
      if (session.id === sessionId) {
        const updatedSession = {
          ...session,
          turns: [...session.turns, newTurn],
          updatedAt: Date.now(),
          isActive: true
        };
        console.log('세션 업데이트 완료 - v3.0:', updatedSession.turns.length, '개 턴');
        return updatedSession;
      }
      return { ...session, isActive: false };
    });

    console.log('세션 저장 중 - v3.0...');
    saveSessions(updatedSessions);
    
    // 저장 후 즉시 확인
    setTimeout(() => {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY) || sessionStorage.getItem(SESSIONS_STORAGE_KEY);
      if (saved) {
        const parsedSessions = JSON.parse(saved);
        const savedSession = parsedSessions.find((s: ChatSession) => s.id === sessionId);
        if (savedSession) {
          console.log('저장 확인 성공 - v3.0:', savedSession.turns.length, '개 턴 저장됨');
        } else {
          console.error('저장 확인 실패 - v3.0: 세션을 찾을 수 없음');
        }
      } else {
        console.error('저장 확인 실패 - v3.0: 저장소에서 데이터를 찾을 수 없음');
      }
    }, 100);
  }, [sessions, saveSessions]);

  // 세션 삭제
  const deleteSession = useCallback((sessionId: string) => {
    console.log('세션 삭제 - v3.0:', sessionId);
    
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
            console.error('세션 삭제 후 전환 실패 - v3.0:', fallbackError);
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
            console.error('세션 삭제 후 ID 제거 실패 - v3.0:', fallbackError);
          }
        }
      }
    } else {
      saveSessions(updatedSessions);
    }
  }, [sessions, currentSessionId, saveSessions]);

  return {
    sessions,
    currentSessionId,
    currentSession,
    createSession,
    switchToSession,
    addTurn,
    deleteSession
  };
};