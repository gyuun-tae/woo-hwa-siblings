# 전래동화 '만약에?' 프로젝트

## ✅ **모든 작업 완료!**
- [x] 1. 디자인 시스템 구축 (ChatGPT 스타일의 깔끔한 디자인)
- [x] 2. 전래동화 데이터 준비 (5개 동화 + 샘플 질문)
- [x] 3. 세션 관리 및 로컬 저장소 로직
- [x] 4. LLM API 엔드포인트 구현 (네이버 클라우드 연동)
- [x] 5. 메인 랜딩 페이지 및 중앙 시작 버튼
- [x] 6. 사이드바와 세션 목록 구현
- [x] 7. 대화 인터페이스 구현
- [x] 8. 오류 처리 및 로딩 상태 (자동 재시도, 네트워크 오류 감지)
- [x] 9. 모바일 반응형 최적화 (터치 친화적 UI, 적응형 레이아웃)
- [x] 10. 최종 테스트 및 폴리시 (접근성, UX 개선, 성능 최적화)
- [x] 11. **메시지 표시 스타일 개선** (사용자 메시지 오른쪽 검은 말풍선)
- [x] 12. **새 대화 기능 수정** (세션 저장 및 초기화)
- [x] 13. **백엔드 동기화** (이전 대화 자동 저장 및 동기화)
- [x] 14. **대화 삭제 기능** (휴지통 아이콘으로 대화 내역 삭제)

## 🎯 **프로젝트 완성!**
전래동화 기반 '만약에?' 상상 여행 플랫폼이 성공적으로 구축되었습니다.

### 🔥 **핵심 완성 기능**
- **깔끔한 ChatGPT 스타일 디자인**
- **완벽한 접근성 지원** (ARIA, 키보드 네비게이션)
- **스마트 오류 복구** (자동 재시도, 메시지 복구)
- **모바일 최적화** (반응형, 터치 친화적)
- **안정성 강화** (ErrorBoundary, 타입 안전성)
- **✅ 메시지 정렬 개선** (사용자 오른쪽, AI 왼쪽)
- **✅ 새 대화 기능** (세션 자동 저장 및 초기화)
- **✅ 백엔드 동기화** (데이터 지속성 보장)
- **✅ 대화 삭제 기능** (완전한 데이터 정리)

## 🆕 **최근 수정사항 (v3.2)**

### **백엔드 동기화 개선**
- `+ 새 대화` 버튼 클릭 시 이전 대화를 백엔드에 자동 저장
- 대화 창 완전 초기화 후 새로운 동화로 시작
- Mock API를 통한 백엔드 연결 시뮬레이션

### **대화 삭제 기능 추가**
- 사이드바에서 대화 내역에 커서를 올리면 휴지통 아이콘 표시
- 휴지통 버튼 클릭 시 대화 완전 삭제
- 백엔드 메모리에서도 해당 데이터 삭제
- 삭제 중 로딩 스피너 표시

### **세션 관리 강화**
- 모든 대화는 `localStorage`에 자동 저장
- 백엔드와 프론트엔드 데이터 동기화
- 세션 전환 시 즉시 반영
- 안정적인 데이터 지속성

## 🚀 **로컬 실행 방법**

### **중요: 올바른 디렉토리에서 실행하기**

이 프로젝트는 **중첩된 폴더 구조**를 가지고 있습니다. 반드시 올바른 디렉토리에서 실행해야 합니다.

#### **올바른 디렉토리 구조**
```
Downloads/
└── korean-traditional-tales-whatif-main/
    └── korean-traditional-tales-whatif-main/  ← 여기서 npm 실행!
        ├── package.json
        ├── src/
        ├── public/
        └── ...
```

#### **실행 방법 1: 수동으로 디렉토리 이동**
```bash
# 1단계: Downloads 폴더로 이동
cd C:\Users\국윤태\Downloads

# 2단계: 프로젝트 폴더로 이동
cd korean-traditional-tales-whatif-main\korean-traditional-tales-whatif-main

# 3단계: package.json 확인
dir package.json

# 4단계: 개발 서버 실행
npm run dev
```

#### **실행 방법 2: 자동화 스크립트 사용 (권장)**
```powershell
# PowerShell에서 스크립트 실행
.\start-dev.ps1
```

**⚠️ 스크립트 실행이 안 될 경우 (PowerShell 정책 설정)**
```powershell
# 관리자 권한으로 PowerShell 실행 후
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 또는 더 간단하게
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

#### **실행 방법 3: 직접 명령어 실행**
```bash
# 한 번에 올바른 디렉토리로 이동하고 실행
cd C:\Users\국윤태\Downloads\korean-traditional-tales-whatif-main\korean-traditional-tales-whatif-main && npm run dev
```

### **🚨 자주 발생하는 에러와 해결 방법**

#### **에러 1: "Could not read package.json"**
```
npm error code ENOENT
npm error syscall open
npm error path C:\Users\...\package.json
npm error errno -4058
npm error enoent Could not read package.json
```

**원인**: 잘못된 디렉토리에서 `npm run dev` 실행

**해결 방법**:
1. 현재 디렉토리 확인: `pwd` 또는 `Get-Location`
2. 올바른 디렉토리로 이동: `cd korean-traditional-tales-whatif-main\korean-traditional-tales-whatif-main`
3. `package.json` 파일 존재 확인: `dir package.json`
4. 개발 서버 실행: `npm run dev`

#### **에러 2: "npm is not recognized"**
**원인**: Node.js가 설치되지 않음

**해결 방법**:
1. [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. 설치 후 터미널 재시작
3. 설치 확인: `node --version` 및 `npm --version`

#### **에러 3: "Module not found"**
**원인**: 의존성이 설치되지 않음

**해결 방법**:
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### **✅ 성공적인 실행 확인 방법**

1. **올바른 디렉토리 확인**
   ```bash
   dir package.json
   # package.json 파일이 보여야 함
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

3. **성공 메시지 확인**
   ```
   VITE v5.4.19  ready in XXX ms
   ➜  Local:   http://localhost:8080/
   ```

4. **브라우저에서 접속**
   - http://localhost:8080/ 으로 접속
   - "만약에...? v3.2" 화면이 표시되어야 함

### **🔧 문제 해결 도구**

#### **디버깅 체크리스트**
- [ ] 현재 디렉토리에 `package.json` 파일이 있는지 확인
- [ ] 올바른 프로젝트 폴더인지 확인
- [ ] Node.js와 npm이 설치되어 있는지 확인
- [ ] 의존성이 설치되어 있는지 확인 (`npm install` 실행)

#### **유용한 명령어**
```bash
# 현재 디렉토리 확인
pwd                    # Linux/Mac
Get-Location          # Windows PowerShell

# 파일 목록 확인
ls                     # Linux/Mac
dir                    # Windows

# 디렉토리 이동
cd 폴더명

# 상위 디렉토리로 이동
cd ..
```

## Project info

**URL**: https://lovable.dev/projects/d6e69e79-4c30-4041-bafe-4c64093dca53

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d6e69e79-4c30-4041-bafe-4c64093dca53) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d6e69e79-4c30-4041-bafe-4c64093dca53) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
