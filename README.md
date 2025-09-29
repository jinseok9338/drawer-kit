# 🎯 Drawer-Kit

> **React용 선언적 drawer 관리 라이브러리** - [toss/overlay-kit](https://github.com/toss/overlay-kit)에서 영감을 받아 제작

간단하고 직관적인 API로 drawer 컴포넌트를 관리할 수 있는 강력하고 유연한 React 라이브러리입니다. [vaul](https://vaul.dev/)을 기반으로 구축되었으며, toss/overlay-kit의 우아한 디자인에서 영감을 받았습니다.

[![npm version](https://badge.fury.io/js/drawer-kit.svg)](https://badge.fury.io/js/drawer-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 주요 기능

- 🎨 **선언적 API** - 간단하고 직관적인 drawer 관리
- 🚀 **TypeScript 우선** - 완전한 TypeScript 지원과 뛰어난 개발자 경험
- 📱 **모바일 최적화** - 부드러운 모바일 상호작용을 위한 vaul 기반
- 🎭 **다양한 방향** - 상단, 하단, 좌측, 우측 drawer 지원
- 🔄 **비동기 지원** - Promise 기반 drawer 상호작용
- 🎪 **이벤트 시스템** - drawer 생명주기에 대한 풍부한 이벤트 콜백

## 📦 설치

```bash
npm install drawer-kit
# 또는
yarn add drawer-kit
# 또는
pnpm add drawer-kit
```

## 🚀 빠른 시작

### 1. Provider 설정

앱을 `DrawerProvider`로 감싸세요:

```tsx
import { DrawerProvider } from "drawer-kit";

function App() {
  return (
    <DrawerProvider>
      <YourApp />
    </DrawerProvider>
  );
}
```

### 2. 기본 사용법

```tsx
import { drawer } from "drawer-kit";

function MyComponent() {
  const openDrawer = () => {
    drawer.open(({ close, unmount }) => (
      <div style={{ padding: "20px" }}>
        <h2>Drawer에서 안녕하세요!</h2>
        <p>이것은 간단한 drawer 예제입니다.</p>
        <button onClick={close}>닫기</button>
        <button onClick={unmount}>언마운트</button>
      </div>
    ));
  };

  return <button onClick={openDrawer}>Drawer 열기</button>;
}
```

### 3. 비동기 Drawer

```tsx
import { drawer } from "drawer-kit";

function MyComponent() {
  const openAsyncDrawer = async () => {
    try {
      const result = await drawer.openAsync(({ close, unmount }) => (
        <div style={{ padding: "20px" }}>
          <h2>작업 확인</h2>
          <p>정말로 진행하시겠습니까?</p>
          <button onClick={() => close("confirmed")}>예</button>
          <button onClick={() => close("cancelled")}>아니오</button>
        </div>
      ));

      console.log("사용자 선택:", result); // 'confirmed' 또는 'cancelled'
    } catch (error) {
      console.log("Drawer가 취소되었습니다");
    }
  };

  return <button onClick={openAsyncDrawer}>비동기 Drawer 열기</button>;
}
```

## 📚 API 참조

### 핵심 API

#### `drawer.open(controller, options?)`

주어진 컨트롤러 컴포넌트로 drawer를 엽니다.

```tsx
const drawerId = drawer.open(MyDrawerComponent, {
  direction: "bottom",
  modal: true,
  dismissible: true,
});
```

#### `drawer.openAsync(controller, options?)`

drawer를 열고 결과와 함께 Promise를 반환합니다.

```tsx
const result = await drawer.openAsync(MyAsyncDrawerComponent, {
  direction: "right",
  modal: false,
});
```

#### `drawer.close(drawerId)`

ID로 특정 drawer를 닫습니다.

```tsx
drawer.close("drawer-123");
```

#### `drawer.unmount(drawerId)`

ID로 특정 drawer를 언마운트합니다.

```tsx
drawer.unmount("drawer-123");
```

#### `drawer.closeAll()`

모든 열린 drawer를 닫습니다.

```tsx
drawer.closeAll();
```

#### `drawer.unmountAll()`

모든 열린 drawer를 언마운트합니다.

```tsx
drawer.unmountAll();
```

### DrawerOptions

| 옵션               | 타입                                     | 기본값          | 설명                                           |
| ------------------ | ---------------------------------------- | --------------- | ---------------------------------------------- |
| `direction`        | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'`      | drawer가 열리는 방향                           |
| `modal`            | `boolean`                                | `true`          | drawer가 모달인지 여부 (배경 상호작용 차단)    |
| `dismissible`      | `boolean`                                | `true`          | 드래그나 외부 클릭으로 닫을 수 있는지 여부     |
| `container`        | `HTMLElement`                            | `document.body` | drawer 포털의 컨테이너 요소                    |
| `handleOnly`       | `boolean`                                | `false`         | 핸들 영역만 드래그 가능한지 여부               |
| `repositionInputs` | `boolean`                                | `false`         | 키보드가 나타날 때 입력 필드를 재배치할지 여부 |
| `onOpenChange`     | `(open: boolean) => void`                | -               | drawer 열림 상태 변경 시 콜백                  |
| `onClose`          | `() => void`                             | -               | drawer가 닫힐 때 콜백                          |
| `onAnimationEnd`   | `(open: boolean) => void`                | -               | drawer 애니메이션 종료 시 콜백                 |

### Controller Props

컨트롤러 컴포넌트는 다음 props를 받습니다:

```tsx
interface DrawerControllerProps {
  isOpen: boolean; // 현재 열림 상태
  close: () => void; // drawer를 닫는 함수
  unmount: () => void; // drawer를 언마운트하는 함수
}

// 비동기 drawer용
interface DrawerAsyncControllerProps<T> {
  isOpen: boolean;
  close: (result: T) => void; // 결과와 함께 닫는 함수
  unmount: () => void;
}
```

## 🎨 예제

### 방향별 예제

```tsx
// 하단 drawer (기본값)
drawer.open(MyComponent, { direction: "bottom" });

// 상단 drawer
drawer.open(MyComponent, { direction: "top" });

// 좌측 drawer
drawer.open(MyComponent, { direction: "left" });

// 우측 drawer
drawer.open(MyComponent, { direction: "right" });
```

### 모달 vs 비모달

```tsx
// 모달 drawer (배경 상호작용 차단)
drawer.open(MyComponent, { modal: true });

// 비모달 drawer (배경 상호작용 허용)
drawer.open(MyComponent, { modal: false });
```

### 이벤트 콜백

```tsx
drawer.open(MyComponent, {
  onOpenChange: (open) => {
    console.log("Drawer 상태:", open ? "열림" : "닫힘");
  },
  onClose: () => {
    console.log("Drawer가 닫혔습니다");
  },
  onAnimationEnd: (open) => {
    console.log("애니메이션 완료, drawer 상태:", open ? "열림" : "닫힘");
  },
});
```

### 핸들 전용 드래그

```tsx
drawer.open(MyComponent, {
  handleOnly: true, // 핸들 영역만 드래그 가능
  direction: "bottom",
});
```

### 입력 필드 재배치

```tsx
drawer.open(MyComponent, {
  repositionInputs: true, // 키보드가 나타날 때 입력 필드 재배치
  direction: "bottom",
});
```

## 🧪 테스트

라이브러리에는 포괄적인 테스트 유틸리티가 포함되어 있습니다:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { drawer } from "drawer-kit";

test("drawer 열기 및 닫기", () => {
  const TestComponent = () => (
    <button
      onClick={() =>
        drawer.open(({ close }) => (
          <div>
            <h1>테스트 Drawer</h1>
            <button onClick={close}>닫기</button>
          </div>
        ))
      }
    >
      Drawer 열기
    </button>
  );

  render(<TestComponent />);

  fireEvent.click(screen.getByText("Drawer 열기"));
  expect(screen.getByText("테스트 Drawer")).toBeInTheDocument();

  fireEvent.click(screen.getByText("닫기"));
  expect(screen.queryByText("테스트 Drawer")).not.toBeInTheDocument();
});
```

## 🎯 고급 사용법

### 커스텀 컨테이너

```tsx
const customContainer = document.getElementById("drawer-container");

drawer.open(MyComponent, {
  container: customContainer,
});
```

### 다중 Drawer

```tsx
// 여러 drawer 열기
const drawer1 = drawer.open(Component1, { direction: "bottom" });
const drawer2 = drawer.open(Component2, { direction: "right" });

// 특정 drawer 닫기
drawer.close(drawer1);

// 모든 drawer 닫기
drawer.closeAll();
```

### 복잡한 비동기 플로우

```tsx
const handleComplexFlow = async () => {
  try {
    // 첫 번째 drawer - 사용자 확인 받기
    const confirmed = await drawer.openAsync(({ close }) => (
      <div>
        <h2>항목 삭제</h2>
        <p>정말로 이 항목을 삭제하시겠습니까?</p>
        <button onClick={() => close(true)}>예, 삭제</button>
        <button onClick={() => close(false)}>취소</button>
      </div>
    ));

    if (!confirmed) return;

    // 두 번째 drawer - 진행 상황 표시
    const progressDrawer = drawer.open(({ close }) => (
      <div>
        <h2>삭제 중...</h2>
        <div>항목을 삭제하는 동안 잠시만 기다려주세요.</div>
        <button onClick={close}>닫기</button>
      </div>
    ));

    // 비동기 작업 시뮬레이션
    await deleteItem();
    drawer.close(progressDrawer);

    // 세 번째 drawer - 성공 표시
    await drawer.openAsync(({ close }) => (
      <div>
        <h2>성공!</h2>
        <p>항목이 성공적으로 삭제되었습니다.</p>
        <button onClick={() => close()}>확인</button>
      </div>
    ));
  } catch (error) {
    console.error("작업이 취소되었습니다:", error);
  }
};
```

## 🎨 스타일링

Drawer-kit은 합리적인 기본값을 제공하지만 완전한 커스터마이징을 허용합니다:

```css
/* 커스텀 drawer 스타일 */
[data-vaul-drawer] {
  background-color: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

[data-vaul-overlay] {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 방향별 스타일 */
[data-vaul-drawer][data-vaul-drawer-direction="left"] {
  border-radius: 0 12px 12px 0;
}

[data-vaul-drawer][data-vaul-drawer-direction="right"] {
  border-radius: 12px 0 0 12px;
}
```

## 🔧 개발

### 사전 요구사항

- Node.js 18+
- pnpm (권장) 또는 npm

### 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/drawer-kit.git
cd drawer-kit

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 테스트 실행
pnpm test

# 라이브러리 빌드
pnpm build
```

### 프로젝트 구조

```
src/
├── drawer-kit/           # 메인 라이브러리 코드
│   ├── components/       # React 컴포넌트
│   ├── context/         # React context와 hooks
│   ├── events/          # 이벤트 시스템
│   ├── types/           # TypeScript 정의
│   └── utils/           # 유틸리티 함수
├── test-ui/             # 개발 테스트 UI
└── tests/               # 테스트 파일
```

## 🤝 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드](CONTRIBUTING.md)를 참조하세요.

1. 저장소를 포크하세요
2. 기능 브랜치를 만드세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m '멋진 기능 추가'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 열어주세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- [toss/overlay-kit](https://github.com/toss/overlay-kit) - 우아한 API 디자인 영감을 주셔서 감사합니다
- [vaul](https://vaul.dev/) - 부드러운 drawer 애니메이션과 모바일 상호작용을 위해
- [React](https://reactjs.org/) - 훌륭한 프레임워크를 위해
- [TypeScript](https://www.typescriptlang.org/) - 타입 안전성을 위해

## 📞 지원

- 📧 이메일: support@drawer-kit.dev
- 🐛 이슈: [GitHub Issues](https://github.com/your-username/drawer-kit/issues)
- 💬 토론: [GitHub Discussions](https://github.com/your-username/drawer-kit/discussions)

---

<div align="center">
  <p>Drawer-Kit 팀이 ❤️로 만들었습니다</p>
  <p>
    <a href="https://github.com/your-username/drawer-kit">⭐ GitHub에서 스타를 눌러주세요</a>
    •
    <a href="https://twitter.com/drawer_kit">🐦 트위터 팔로우</a>
    •
    <a href="https://discord.gg/drawer-kit">💬 Discord 참여</a>
  </p>
</div>
