# 한국 전래동화 '만약에?' 프로젝트 개발 서버 실행 스크립트
# Windows PowerShell용

Write-Host "🚀 한국 전래동화 '만약에?' 프로젝트 개발 서버 시작 중..." -ForegroundColor Green

# 현재 디렉토리 확인
$currentDir = Get-Location
Write-Host "현재 디렉토리: $currentDir" -ForegroundColor Yellow

# package.json 파일 존재 확인
if (Test-Path "package.json") {
    Write-Host "✅ package.json 파일을 찾았습니다!" -ForegroundColor Green
    
    # 의존성 설치 확인
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 의존성 설치 중..." -ForegroundColor Yellow
        npm install
    }
    
    # 개발 서버 시작
    Write-Host "🔥 개발 서버 시작 중..." -ForegroundColor Green
    Write-Host "🌐 접속 URL: http://localhost:8080/" -ForegroundColor Cyan
    Write-Host "⏹️  중지하려면 Ctrl+C를 누르세요" -ForegroundColor Red
    
    npm run dev
} else {
    Write-Host "❌ package.json 파일을 찾을 수 없습니다!" -ForegroundColor Red
    Write-Host "올바른 프로젝트 디렉토리로 이동해주세요." -ForegroundColor Yellow
    Write-Host "예: cd korean-traditional-tales-whatif-main/korean-traditional-tales-whatif-main" -ForegroundColor Yellow
    
    # 올바른 디렉토리 찾기 시도
    $parentDir = Split-Path $currentDir -Parent
    $targetDir = Join-Path $parentDir "korean-traditional-tales-whatif-main"
    
    if (Test-Path (Join-Path $targetDir "package.json")) {
        Write-Host "💡 올바른 디렉토리를 찾았습니다: $targetDir" -ForegroundColor Green
        Write-Host "다음 명령어로 이동하세요: cd `"$targetDir`"" -ForegroundColor Cyan
    }
    
    exit 1
}
