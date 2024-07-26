# 코드 컨벤션 문서

이 문서는 프로젝트에서 지켜야 할 코드 스타일과 협업 규칙을 정의합니다. 모든 코드 기여자는 이 문서를 읽고 준수해야 합니다.

## TypeScript 컨벤션

### 함수 선언

- `function` 키워드는 가능하면 사용하지 않고, 화살표 함수로 통일하여 일관된 함수 선언을 유지합니다.

### 함수 인자 구성

- 함수의 인자가 1개일 때는 flat한 구조를 사용합니다.
- 함수의 인자가 2개 이상일 때는 객체 형태로 인자를 전달합니다.

```typescript
// 인자가 1개일 때 (flat한 구조)
const getSomethingById = (id: number) => {
  console.log(`Something ID: ${id}`);
};

// 인자가 2개 이상일 때 (객체 형태)
const getSomething = ({ id, name }: { id: number; name: string }) => {
  console.log(`Something ID: ${id}, Name: ${name}`);
};
```

## React 컨벤션

### Prop 정렬

컴포넌트의 Props 정렬 규칙은 다음과 같습니다:

- 알파벳 오름차순 정렬: 특별한 이유가 없는 한, Props는 알파벳 오름차순으로 정렬합니다.
- 고유한 prop 예외: key, id와 같이 중요하며 고유한 인자는 제일 앞에 위치할 수 있습니다.
- 인라인 함수 선언부 예외: 인라인 함수 선언부가 너무 길 경우, Props의 가독성을 위해 해당 인자를 뒤로 배치할 수 있습니다.

```typescript
// 예시: 기본 알파벳 순 정렬
const MyComponent = ({
  age,
  name,
  value,
}: {
  age: number;
  name: string;
  value: string;
}) => {
  // ...
};

// 예시: 프라이머리한 인자가 제일 앞에 오는 경우
const MyComponent = ({
  id,
  age,
  name,
  value,
}: {
  id: string;
  age: number;
  name: string;
  value: string;
}) => {
  // ...
};

// 예시: 인라인 함수 선언부가 긴 경우
const MyComponent = ({
  age,
  name,
  value,
  onClick,
}: {
  age: number;
  name: string;
  value: string;
  onClick: () => void;
}) => {
  // ...
};
```

### Chakra UI 스타일 Prop 약어 사용

Chakra UI의 스타일 prop을 사용할 때는 다음과 같이 약어를 사용하는 것을 규칙으로 합니다:

// 예시

```
paddingX -> px
marginY -> my
backgroundColor -> bgColor
```

### Import 개행 규칙
