# 코드 컨벤션 문서

이 문서는 프로젝트에서 지켜야 할 코드 스타일과 협업 규칙을 정의합니다. 모든 코드 기여자는 이 문서를 읽고 준수해야 합니다.

## 코드 스타일 가이드

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
