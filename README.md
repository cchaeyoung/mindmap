<div align="center">

<img width="1200" height="400" alt="banner" src="https://github.com/user-attachments/assets/316270f7-af34-4ea9-b9a2-58f0bd976b77" />

<h1>Mindot</h1>

**생각의 흐름을 노드와 연결선으로 시각화하는 Canvas 기반 마인드맵 웹 서비스**

<br />

[![Demo](https://img.shields.io/badge/🔗%20Demo-black?style=for-the-badge)](https://mindot-map.vercel.app)

<br />

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React Konva](https://img.shields.io/badge/React--Konva-FF6B6B?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

<br />

## 📖 소개

**Mind** + **Dot** — 생각을 점으로 연결하다.

Mindot은 생각과 아이디어를 연결하고 시각화하는 마인드맵 도구입니다.

노드와 연결선을 통해 복잡한 흐름을 직관적으로 정리할 수 있습니다.

<br />

## ✨ 주요 기능

### 마인드맵 편집

- 노드 추가, 삭제, 인라인 텍스트 편집
- 드래그로 노드 이동 및 하위 트리 연쇄 이동
- 노드 색상, 크기, 모양, 텍스트 스타일 변경
- 키보드 단축키 지원 (Tab, Enter, Delete, Ctrl+Z, Ctrl+Shift+Z 등)

### 오토 레이아웃

- 재귀 트리 알고리즘 기반 자동 정렬
- 드래그 후 애니메이션으로 부드러운 레이아웃 복귀

### 자동저장 & 다중 맵 관리

- debounce 기반 자동저장, 맵 전환, 이탈 시 즉시 반영
- 사이드바에서 다중 마인드맵 생성, 전환, 삭제

### 비로그인 작업 보존

- 비로그인 상태에서 작업 후 로그인 시 자동 저장 및 이동
- Google, GitHub OAuth 지원

<br />

## 🛠 기술 스택

<table>
  <tr>
    <td align="center"><b>Framework</b></td>
    <td>
      <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Language</b></td>
    <td>
      <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Canvas</b></td>
    <td>
      <img src="https://img.shields.io/badge/React--Konva-FF6B6B?style=flat-square" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>상태관리</b></td>
    <td>
      <img src="https://img.shields.io/badge/Zustand-433E38?style=flat-square" />
      <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>스타일</b></td>
    <td>
      <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Auth / DB</b></td>
    <td>
      <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>테스트</b></td>
    <td>
      <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>CI/CD</b></td>
    <td>
      <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" />
      <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
    </td>
  </tr>
</table>

<br />

## 🚀 로컬 실행

> Node.js 20+, pnpm 10+ 필요

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```
