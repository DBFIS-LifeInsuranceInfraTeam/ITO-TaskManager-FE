<div align="center">
    <img src="https://github.com/user-attachments/assets/0bf28796-3c5b-467f-ae64-3c542b5ac04b" alt="logo" />
</div>


### 🔗 **[배포물 바로가기](http://taskmanager-test.binc.co.kr:31427)**
<br/>

---
# 📋 프로젝트 개요

- 『ITO경쟁력강화』 과제 일환으로 주기적 업무를 명확히 정의하고, 전사 확장 가능한 관리방안 도출을 목표

- 반복 업무 표준화 및 정규화
    <br>: 반복/주기적 업무 ITO프로세스별 카테고리화
    <br>: 적기 알림 및 관리를 통한 ITO 품질 서비스 수준 향상

- 업무정의 및 주기 업무 관리방안 실제 실행 및 검증
    <br>: 생명인프라팀 반복 주기에 따른 실제 변경 업무를 스케줄링
    <br>: 표준주기업무관리표 및 주기업무 수행가이드라인 실행 및 검증

- 협업 도구 활용 (캘린더 및 할일 기능)
    <br>: 수작업 엑셀기반 관리가 아닌 협업관리툴을 이용한 주기업무 관리

- 알림설정 및 완료여부 피드백
    <br>: 메신저 및 메일로 적기에 담당자 알림으로 누락 없는 업무 관리 

- 시스템 구축시 기능 및 요구사항 정리
    <br>: PoC 결과 및 보완점 정리하여 향후 시스템의 기능 및 요구사항 도출 



<br/>

---

# 🧩 ITO-TaskManager 기능 소개

## 🔒 인증

### 회원가입

![signup](https://github.com/user-attachments/assets/857a5abe-7ffa-447b-bb19-95d473d44300)


### 로그인

![login](https://github.com/user-attachments/assets/3c07989e-df04-41b4-9899-fdbaf416f4e4)

<br>

## 🔍 업무 조회

### 대시보드

![dashboard](https://github.com/user-attachments/assets/e157bc57-8848-4a36-9f76-ea5dfa1c4143)


### 검색

![search](https://github.com/user-attachments/assets/ca65d658-a2fb-44cf-a381-edc9175e7b16)


<br>

## 📝 업무 등록

![add](https://github.com/user-attachments/assets/ec6fc577-7aa3-4b76-95e3-39e8c4376ee0)

<br>

## ✅ 업무 상세 및 진척도 관리
![detail](https://github.com/user-attachments/assets/b855abff-6580-4411-8276-db4eae958af4)

<br>


---

<br>

## 📁 폴더 구조 설명

```bash
ITO-TaskManager-FE
├─ 📁 public
│  
├─ 📁 src
│  ├─ 📁 api  # api와 통신하는 계층 폴더입니다.
│  │  ├─ 📁 auth # 인증 관련 api
│  │  ├─ 📁 comment # 댓글 관련 api
│  │  ├─ 📁 statisitcs # 통계 관련 api
│  │  ├─ 📁 task # 업무 관련 api
│  │  └─ 📁 user # 사용자 관련 api
│  │  
│  ├─ 📁 components  # 공통 컴포넌트들이 있습니다.
│  │  
│  ├─ 📁 pages  # 라우팅 별 페이지들이 있습니다.
│  │  
│  ├─ 📁 styles # css 및 정적 자원(image, font)들이 있습니다.
│  │  ├─ 📁 components # 컴포넌트의 css를 관리합니다.
│  │  ├─ 📁 font # font를 관리
│  │  ├─ 📁 images # 이미지 리소스를 관리
│  │  └─ 📁 pages # 페이지의 css를 관리합니다.
│  │  
│  ├─ index.tsx
│  └─ App.tsx  # App 전체를 구성하는 컴포넌트입니다. 내부에 Router가 있습니다.
│
├─ ⚙️ .dockerignore
├─ ⚙️ .gitignore
├─ 🐳 Dockerfile
├─ README.md
├─ ⚙️ babel.config.js
├─ ⚙️ default.conf
├─ ⚙️ package-lock.json
├─ ⚙️ package.json       
└─ ⚙️ tsconfig.json
```

<br>

---

# 💬 회고

## 프로젝트 진행 시 주안점

- typescript 사용
- axios 모듈화

<br>

## 한계점 및 개선 사항

- typescript 타입을 완벽하게 지정하지 못한 것이 아쉽다.
- 중복되는 부분을 공통으로 빼고 상속으로 구현해야 하는데 설계를 완벽하게 하지 못하고 개발에 들어가서 해당 부분은 개선이 필요하다.
- skeleton ui를 100% 구현하지 못했다.
- 시간적인 한계로 인해 인라인 스타일도 많이 사용했다. 이 부분은 코드 가독성이나 컴포넌트 재사용성을 위해 리팩토링이 필요하다.
