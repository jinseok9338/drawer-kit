# 🤝 기여 가이드

Drawer-Kit 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 📋 목차

- [개발 환경 설정](#개발-환경-설정)
- [프로젝트 구조](#프로젝트-구조)
- [개발 워크플로우](#개발-워크플로우)
- [코딩 스타일](#코딩-스타일)
- [테스트](#테스트)
- [Pull Request 가이드라인](#pull-request-가이드라인)
- [이슈 리포팅](#이슈-리포팅)
- [기여 유형](#기여-유형)

## 🛠 개발 환경 설정

### 사전 요구사항

- **Node.js**: 18.0.0 이상
- **pnpm**: 8.0.0 이상 (권장) 또는 npm 9.0.0 이상
- **Git**: 2.30.0 이상

### 초기 설정

1. **저장소 포크 및 클론**

   ```bash
   # GitHub에서 저장소를 포크한 후
   git clone https://github.com/jinseok9338/drawer-kit.git
   cd drawer-kit
   ```

2. **의존성 설치**

   ```bash
   pnpm install
   # 또는
   npm install
   ```

3. **개발 서버 시작**

   ```bash
   # 메인 라이브러리 개발
   pnpm dev

   # 테스트 UI 개발
   pnpm dev:test-ui
   ```

4. **테스트 실행**

   ```bash
   # 모든 테스트 실행
   pnpm test

   # 테스트 UI로 실행
   pnpm test:ui

   # 커버리지와 함께 실행
   pnpm test:coverage
   ```

5. **린팅 및 포맷팅**

   ```bash
   # 린팅 실행
   pnpm lint

   # 코드 포맷팅 (Prettier)
   pnpm format
   ```

## 📁 프로젝트 구조

```
drawer-kit/
├── src/
│   ├── drawer-kit/           # 메인 라이브러리 코드
│   │   ├── components/       # React 컴포넌트
│   │   │   ├── DrawerController.tsx
│   │   │   └── index.css
│   │   ├── context/          # React Context와 Hooks
│   │   │   ├── context.ts
│   │   │   ├── hooks.ts
│   │   │   ├── provider.tsx
│   │   │   └── reducer.ts
│   │   ├── events/           # 이벤트 시스템
│   │   │   └── index.ts
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── types/            # TypeScript 타입 정의
│   │   │   └── index.ts
│   │   ├── utils/            # 유틸리티 함수
│   │   └── index.ts          # 메인 진입점
│   ├── test-ui/              # 개발 및 테스트용 UI
│   │   ├── components/
│   │   └── examples/
│   └── tests/                # 테스트 파일
│       ├── unit/             # 단위 테스트
│       ├── integration/      # 통합 테스트
│       └── e2e/              # E2E 테스트
├── tests/                    # 테스트 설정 및 유틸리티
├── public/                   # 정적 파일
└── docs/                     # 문서 (향후 추가 예정)
```

## 🔄 개발 워크플로우

### 1. 브랜치 전략

- **main**: 안정적인 프로덕션 브랜치
- **develop**: 개발 브랜치 (향후 추가 예정)
- **feature/**: 새로운 기능 개발
- **fix/**: 버그 수정
- **docs/**: 문서 개선
- **test/**: 테스트 개선
- **refactor/**: 리팩토링

### 2. 브랜치 생성 및 작업

```bash
# 최신 main 브랜치로 업데이트
git checkout main
git pull origin main

# 새 기능 브랜치 생성
git checkout -b feature/your-feature-name

# 또는 버그 수정 브랜치
git checkout -b fix/issue-number-description
```

### 3. 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 스타일을 따릅니다:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**타입:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 프로세스, 도구 변경 등

**예시:**

```bash
git commit -m "feat: add support for custom drawer animations"
git commit -m "fix: resolve drawer positioning issue on mobile"
git commit -m "docs: update API documentation for drawer options"
git commit -m "test: add unit tests for drawer context"
```

## 🎨 코딩 스타일

### TypeScript

- **엄격한 타입 체크**: `strict: true` 설정 준수
- **명시적 타입**: `any` 타입 사용 금지
- **인터페이스 우선**: 타입 정의 시 `interface` 사용
- **제네릭 활용**: 재사용 가능한 타입 정의

```typescript
// ✅ 좋은 예
interface DrawerOptions {
  direction: "top" | "bottom" | "left" | "right";
  modal: boolean;
  onClose?: () => void;
}

// ❌ 나쁜 예
const options: any = { direction: "bottom" };
```

### React

- **함수형 컴포넌트**: 클래스 컴포넌트 대신 함수형 컴포넌트 사용
- **Hooks 활용**: 상태 관리 및 사이드 이펙트 처리
- **Props 타입 정의**: 모든 props에 대한 명시적 타입 정의

```typescript
// ✅ 좋은 예
interface DrawerControllerProps {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
}

const DrawerController: React.FC<DrawerControllerProps> = ({ isOpen, close, unmount }) => {
  // 컴포넌트 로직
};
```

### ESLint 규칙

프로젝트는 다음 ESLint 설정을 사용합니다:

- **@eslint/js/recommended**: 기본 JavaScript 규칙
- **@typescript-eslint/recommended**: TypeScript 규칙
- **eslint-plugin-react-hooks**: React Hooks 규칙
- **eslint-plugin-react-refresh**: React Refresh 규칙

### 코드 포맷팅

- **Prettier**: 자동 코드 포맷팅
- **세미콜론**: 필수 사용
- **따옴표**: 작은따옴표 사용
- **들여쓰기**: 2칸 스페이스

## 🧪 테스트

### 테스트 구조

- **단위 테스트** (`tests/unit/`): 개별 함수/컴포넌트 테스트
- **통합 테스트** (`tests/integration/`): 여러 컴포넌트 간 상호작용 테스트
- **E2E 테스트** (`tests/e2e/`): 전체 사용자 플로우 테스트

### 테스트 작성 가이드라인

1. **테스트 파일 명명**: `*.test.ts` 또는 `*.test.tsx`
2. **테스트 커버리지**: 최소 80% 유지
3. **테스트 설명**: 명확하고 구체적인 테스트 설명
4. **AAA 패턴**: Arrange, Act, Assert 구조

```typescript
// ✅ 좋은 테스트 예시
describe('DrawerController', () => {
  it('should call onClose when close button is clicked', () => {
    // Arrange
    const mockOnClose = vi.fn();
    const { getByRole } = render(
      <DrawerController isOpen={true} close={mockOnClose} unmount={vi.fn()} />
    );

    // Act
    fireEvent.click(getByRole('button', { name: '닫기' }));

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
```

### 테스트 실행

```bash
# 모든 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test drawer-api.test.ts

# 커버리지와 함께 실행
pnpm test:coverage

# 테스트 UI로 실행
pnpm test:ui
```

## 📝 Pull Request 가이드라인

### PR 생성 전 체크리스트

- [ ] 코드가 최신 `main` 브랜치와 동기화됨
- [ ] 모든 테스트가 통과함
- [ ] 린팅 오류가 없음
- [ ] 커밋 메시지가 컨벤션을 따름
- [ ] 변경사항에 대한 테스트가 추가됨
- [ ] 문서가 필요시 업데이트됨

### PR 템플릿

```markdown
## 📋 변경사항

- [ ] 새로운 기능 추가
- [ ] 버그 수정
- [ ] 문서 업데이트
- [ ] 테스트 추가/수정
- [ ] 리팩토링

## 🔍 상세 설명

변경사항에 대한 자세한 설명을 작성해주세요.

## 🧪 테스트

- [ ] 기존 테스트가 통과함
- [ ] 새로운 테스트가 추가됨
- [ ] 수동 테스트 완료

## 📸 스크린샷 (UI 변경시)

변경 전후 스크린샷을 첨부해주세요.

## 🔗 관련 이슈

Closes #이슈번호
```

### PR 리뷰 프로세스

1. **자동 검사**: CI/CD 파이프라인 실행
2. **코드 리뷰**: 최소 1명의 리뷰어 승인 필요
3. **테스트 통과**: 모든 테스트가 성공해야 함
4. **승인 후 병합**: 리뷰어 승인 후 병합

## 🐛 이슈 리포팅

### 버그 리포트

버그를 발견하셨다면 다음 정보를 포함해주세요:

```markdown
## 🐛 버그 설명

간단하고 명확한 버그 설명

## 🔄 재현 단계

1. '...'로 이동
2. '...' 클릭
3. '...' 스크롤
4. 오류 확인

## 🎯 예상 동작

어떤 일이 일어나야 하는지 설명

## 🚫 실제 동작

실제로 일어난 일을 설명

## 📱 환경 정보

- OS: [예: iOS, Android, Windows, macOS]
- 브라우저: [예: Chrome, Safari, Firefox]
- 버전: [예: 22]
- Drawer-Kit 버전: [예: 1.0.0]

## 📸 스크린샷

가능하다면 스크린샷을 첨부해주세요

## 📋 추가 컨텍스트

기타 유용한 정보를 추가해주세요
```

### 기능 요청

새로운 기능을 제안하실 때는:

```markdown
## 🚀 기능 요청

간단하고 명확한 기능 설명

## 💡 동기

이 기능이 왜 필요한지 설명

## 📋 상세 설명

기능에 대한 자세한 설명

## 🎯 사용 사례

이 기능이 어떻게 사용될지 설명

## 🔄 대안

고려해본 다른 해결책이 있다면 설명
```

## 🎯 기여 유형

### 코드 기여

- **버그 수정**: 이슈에 보고된 버그 수정
- **기능 추가**: 새로운 기능 구현
- **성능 개선**: 코드 최적화 및 성능 향상
- **리팩토링**: 코드 품질 개선

### 문서 기여

- **README 업데이트**: 프로젝트 설명 개선
- **API 문서**: 코드 주석 및 JSDoc 작성
- **예제 추가**: 사용 예제 및 튜토리얼
- **번역**: 다국어 지원

### 테스트 기여

- **단위 테스트**: 개별 함수/컴포넌트 테스트
- **통합 테스트**: 컴포넌트 간 상호작용 테스트
- **E2E 테스트**: 전체 사용자 플로우 테스트
- **테스트 유틸리티**: 테스트 헬퍼 함수

### 디자인 기여

- **UI/UX 개선**: 사용자 인터페이스 개선
- **애니메이션**: 부드러운 전환 효과
- **접근성**: 웹 접근성 표준 준수
- **반응형 디자인**: 다양한 화면 크기 지원

## 📞 지원 및 문의

- **이메일**: jinseok9338@gmail.com
- **GitHub Issues**: [이슈 페이지](https://github.com/jinseok9338/drawer-kit/issues)
- **GitHub Discussions**: [토론 페이지](https://github.com/jinseok9338/drawer-kit/discussions)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 기여하시는 코드는 동일한 라이선스 하에 배포됩니다.

---

**감사합니다!** Drawer-Kit 프로젝트에 기여해주셔서 정말 감사합니다. 여러분의 기여가 더 나은 라이브러리를 만드는 데 도움이 됩니다! 🎉
