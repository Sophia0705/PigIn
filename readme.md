# 목차

1. [**서비스 소개**](#서비스-소개)
2. [**기획 배경**](#기획-배경)
3. [**개발 멤버**](#개발-멤버-및-일정-소개)
4. [**기능 소개**](#기능-소개)
5. [**시연 영상**](#시연-영상)
6. [**기술 스택**](#기술-스택)
7. [**프로젝트 일정 및 산출물**](#프로젝트-산출물)
8. [**회고**](#회고)
   <br/>

---

<br/>

# 서비스 소개

## 서비스 설명

### 개요

- 서비스 명 : **`Pig In`**
- 한줄 소개 : **`소액 분산 투자 자동화 서비스`**

### 타겟 🎯

- 가볍게 소액으로 투자하고 싶은 사람
- 자동 투자 관리가 필요한 사람
- 일정 금애글 자동 저축하여 투자하고 싶은 사람

# 기획 배경

## 배경

고물가 고금리 시대에 소액투자에 대한 관심은 나날이 증가하고 있지만 투자할 종목은 많고, 배워야 할 금융 지식 또한 많습니다. 저희 `Pig In`은 좀 더 가볍고 쉽게 투자를 경험해볼 수 있도록 기획된 `소액 분산 투자 자동화 플랫폼`입니다.

## 목적 ☁

**저축 자동화, 투자 자동화를 통한 투자 근육 키우기**

- 저축 자동화 : 소비 금액의 일정 비율을 투자 계좌에 저축합니다.

- 투자 자동화 : 금액과 비율을 설정하면 저축된 금액을 비율에 맞게 투자해드립니다.

- 자동화 투자 관련 포트폴리오를 제공합니다.

# 💌개발 멤버 및 일정 소개

## 📆 프로젝트 기간

### 24.08. ~ 24.10.11

- 기획 및 설계 :
- 프로젝트 구현 :
- 버그 수정 및 산출물 정리 : 24.10.11 ~ 24.10.18

<br />

<table>
    <tr>
        <td height="140px" align="center"> <a href="https://github.com/heon118">
            <img src="https://avatars.githubusercontent.com/heon118" width="140px" /> <br><br> 👑 최승현 <br>(Back-End) </a> <br></td>
        <td height="140px" align="center"> <a href="https://github.com/hyojin030">
            <img src="https://avatars.githubusercontent.com/hyojin030" width="140px" /> <br><br> ⛑ 남혁준 <br>(Back-End) </a> <br></td>
        <td height="140px" align="center"> <a href="https://github.com/olrlobt">
            <img src="https://avatars.githubusercontent.com/olrlobt" width="140px" /> <br><br> ⛑ 이중현 <br>(Back-End) </a> <br></td>
        <td height="140px" align="center"> <a href="https://github.com/youngkimi">
            <img src="https://avatars.githubusercontent.com/youngkimi" width="140px" /> <br><br> ⛑ 최승필 <br>(Front-End) </a> <br></td>
        <td height="140px" align="center"> <a href="https://github.com/lainlnya">
            <img src="https://avatars.githubusercontent.com/lainlnya" width="140px" /> <br><br> ⛑ 이예지 <br>(Front-End) </a> <br></td>
        <td height="140px" align="center"> <a href="https://github.com/NamjunKim12">
            <img src="https://avatars.githubusercontent.com/NamjunKim12" width="140px" /> <br><br> ⛑ 김태연 <br>(Front-End) </a> <br></td>
    </tr>
    <tr>
        <td align="center">Infra<br/>CI/CD</td>
        <td align="center">AI/ML</td>
        <td align="center">AI/ML<br/>Backend</td>
        <td align="center">Backend</td>
        <td align="center">Frontend</td>
        <td align="center">Frontend</td>
    </tr>
</table>

# 💌기능 소개

## 투자 계좌 자동 생성, 소비 계좌 연동

- 회원가입 시 투자 계좌가 자동 개설되며, 이후 소비 계좌를 연동하여 설정한 저축률에 따라 소비한 금액의 일부가 생성된 투자 계좌로 입금됩니다.

<figure>
  <img src="./assets/gif/로그인.gif" align="center" width="50%" />
</figure>

## MAIN PAGE

- 메인 화면에서 매일 금융 상식 QUIZ를 풀고 리워드를 받을 수 있습니다.
- '내 투자' 포트폴리오를 확인할 수 있습니다.
- 이용자들이 많이 거래한 주식, 가상화폐 TOP 5 종목들을 보고 상세페이지로 이동할 수 있습니다.

<figure>
  <img src="./assets/gif/일기쓰기.gif" align="center" width="50%" />
</figure>

## PORTFOLIO PAGE

- 주식, 암호화폐, 금 3가지 종목에 대한 본인의 투자 정보를 원형 그래프로 쉽게 볼 수 있습니다.
- 항목 별로 투자한 종목에 대한 비율, 수익 등을 자세하게 볼 수 있습니다.

<figure>
  <img src="./assets/gif/GPT코멘트.gif" align="center" width="50%" />
</figure>

## INVESTMENT PAGE

- 주식, 가상화폐, 금 시세 데이터를 조회할 수 있습니다.
- 각 종목의 상세페이지에서 변동률, 시가, 고가, 저가, 거래량 등의 정보를 실시간, 일주일, 1개월, 1년 단위로 확인할 수 있습니다.
- 해당 종목에 대한 뉴스 기사들을 보고 가격 변동 추이를 예측하는데 도움을 줄 수 있습니다.
- 종목 매수, 매도 시 금액 단위로 퍼센테이지를 보며 거래할 수 있습니다.
- 자동화 투자 활성화를 통해 금액, 비율을 설정하면 투자 계좌의 돈이 모였을 때 그에 맞게 투자를 진행합니다.

<figure>
  <img src="./assets/gif/추천사연.gif" align="center" width="50%" />
</figure>

## MY FAVORITE PAGE

- 각 항목 페이지에서 원하는 종목을 골라 찜해둘 수 있습니다.
- 주식, 가상화폐 찜해준 종목에 대한 정보를 간략하게 차트와 함께 볼 수 있고, 상세페이지로의 접근도 제공합니다.

<figure>
  <img src="./assets/gif/스크랩.gif" align="center" width="50%"/>
</figure>

## MY PAGE

- 이름, 생년월일, 이메일, 전화번호, 설정해둔 저축률을 볼 수 있습니다.
- 회원 정보 수정, 회원 탈퇴, 로그아웃 기능을 제공합니다.
- 회원가입 시 투자 계좌는 자동 생성되며, 소비 계좌를 연동하여 쓰는 금액의 일정 비율을 투자 계좌로 저축해둘 수 있습니다.
- 투자 계좌, 소비 계좌의 잔액을 확인할 수 있습니다.

<figure class="half">
  <img src='./assets/gif/채팅방입장.gif' align='left' width="50%"/>
  <img src='./assets/gif/채팅.gif' align='right' width="50%"/>
</figure>

# 기술 스택

## 1.

![타로카드추천](./assets/image/타로카드추천.JPG)

몰러유

## 2.

![일기추천](./assets/image/일기추천.JPG)

멀루

## 3. 개발 환경

<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Spring Security-6DB33F?style=for-the-badge&logo=Spring Security&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/JSON Web Tokens-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=Gradle&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <br/> <img src="https://img.shields.io/badge/Amazon EC2-569A31?style=for-the-badge&logo=Amazon EC2&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=Amazon S3&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=NGINX&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=Ubuntu&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/mySql-007ec6?style=for-the-badge&logo=mySql&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <br/>
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/>
<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/zustand-764ABC?style=for-the-badge&logo=react&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Node.js-339939?style=for-the-badge&logo=Node.js&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Scss-cc6699?style=for-the-badge&logo=sass&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <img src="https://img.shields.io/badge/GitLab-FCA121?style=for-the-badge&logo=GitLab&logoColor=white" style="height : auto; margin-left : 10px; margin-right : 10px;"/> <br/>

# 💌프로젝트 산출물

## 프로젝트 진행

### 1. Git flow

---

- Git flow 사용을 위해 우아한 형제들의 [gitflow](https://techblog.woowahan.com/2553/)을 참고했습니다.
- 최종 `master`브랜치에서 프론트엔드와 백엔드의 작업공간을 나누어 `develop`, `dev-front` 두 하위 브랜치를 각각 분기하여 작업합니다.
- 긴급한 버그발생시 `hotfix`를 수행할 브랜치 또한 따로 분기하였습니다.
- `develop` 브랜치의 작업 내용을 QA하며 수정할 `release` 브랜치를 분기하여 작업하였습니다.

`commit message`는 git hooks 파일을 활용해 `feature/[지라티켓번호]-[기능명(영어)]`로 통일하여 작성했습니다.<br>

### 2. Jira

---

매주 월요일 오전 금주의 진행 이슈를 백로그에 등록했습니다. 전주에 완료하지 못한 이슈나, 앞으로 진행할 이슈들을 추가하였습니다.

- 에픽은 몇 번의 스프린트가 요구되는 큰 업무 덩어리로, `프로젝트 기획/프로젝트 설계/유저 서비스/다이어리 서비스/추천 서비스/인프라`의 6개 분류로 구성했습니다.
- 스토리는 유저의 요구사항을 명시하는 역할로, 명확한 전달을 위하여 `[BE][경매] 유저는 경매 입찰을 통해 물건을 구매할 수 있다.`와 같이 작성했습니다.
- 작업현황을 지라에 반영함으로써 각 팀원이 어떤 작업을 하고있는지, 일정에 딜레이가 있는지 파악하여 애자일 원칙을 준수하고자 노력했습니다.<br>

## 프로젝트 설계

### 1. Figma

[![figma](./assets/image/figma.png)](https://www.figma.com/file/QkvXoQ8tU6SJqGmFpRw24H/%EB%B0%A4%ED%8E%B8%EC%A7%80?type=design&node-id=0-1&mode=design&t=8kVHN06rz2Zyp7cj-0)
<br>

### 2. ERD

![erd](./assets/image/ERD.png)
<br>

### 3. Architecture

![architecture](./assets/image/architecture.png)

### 3. API 문서

[![api](./assets/image/API명세.png)](https://acoustic-waiter-143.notion.site/API-ef4fbd209fbf45ec8f2b6c2c2e9d4526)

### 4. 포팅 매뉴얼

[포팅 매뉴얼](./assets/porting-manual.md)

# 회고

- [최승현(팀장)](https://github.com/heon118) : 팀장으로써 기술적인 부분에서 도움을 주지 못해서 아쉬운 생각이 있었습니다. 백엔드와 빅데이터를 도와주며 함께 공부하고 싶었는데 생각보다 배포가 오래 걸려 그렇게 하지 못한 것이 아쉽고 팀원들에게 미안했습니다. 팀원들이 개발하기 더 편한 환경으로 배포해주지 못했기에 이런 부분을 공부해봐야겠다는 생각을 했습니다.
- [남혁준](https://github.com/hyojin030) : 관심 있던 추천 시스템에 대해 배우고 구현해 볼 수 있어서 좋은 경험이었습니다. 일기를 추천한다는 주제가 흔치 않아 고민하는 시간이 길었지만, 그만큼 평범하지 않아 즐거운 과정이었습니다. 기회가 된다면 사용자의 데이터를 받아 더 맞춤화된 추천으로 만족도 높은 서비스를 개발해 보고 싶습니다.
- [이중현](https://github.com/olrlobt) : 새로운 기술들에 많이 도전하면서 배움이 많았던 프로젝트였습니다. Fast API, ANNOY 알고리즘, KoSBERT, GPT 파인튜닝 등 다양한 기술에 많이 도전하며 부딪히면서 성장했던 기간이었습니다. 이 프로젝트에서 많은 도전을 한 덕분에, 앞으로 새로운 기술을 만나게 되어도 두려워하지 않을 자신이 생겼습니다. 한 가지 아쉬운 점은 JIRA 사용을 적극적으로 하지 않았다는 점입니다. 일정이 하나 둘 밀리기 시작하면서 처음 기획가 달라진 부분이 많이 보여서 아쉽습니다. 다음에는 일정 관리에 더욱 몰두하겠습니다.
- [최승필](https://github.com/youngkimi) : 아직 엉성한 부분이 많아 차근차근 개선해나가야할 것 같습니다. 초기 기획했던 것보다는 프로젝트 사이즈가 많이 줄어들어 아쉽습니다. 기획적으로 보다 완성도 있는 프로젝트를 위한 몇 가지 기능을 추가하고, 단위 테스트 작성과 안정적 서비스 제공, 성능 개선을 위한 리팩토링 작업이 필요하겠다는 생각이 듭니다.
- [이예지](https://github.com/lainlnya) : 마지막에 시간에 쫓겨 최적화를 하지 못한 점이 아쉬웠습니다. 또한 타로카드가 뽑혀질 때 로딩 시간 없이 카드가 갑작스럽게 뽑히는 느낌이 들어 사용자 경험 향상을 위해 개선해보고 싶다는 생각이 들었습니다.
  프론트엔드 팀원과 코드리뷰를 하며 진행하면 서로의 부분을 디버깅하거나, 구조를 일관성있게 유지하는 것에 도움이 되지 않았을까 하는 아쉬움이 남았습니다. 다음 번에는 코드리뷰를 도입하여 서로의 코드에 대해 피드백을 갖는 시간이 있었으면 좋을 것 같습니다.
- [김태연](https://github.com/NamjunKim12) : 프로젝트에 도입할 기술에 대해 공부하며 근거있는 기술을 선정하기 위해 노력했고, useEffect 의 생명주기에 관련된 트러블 슈팅 과정에서 기술의 작동원리를 더 잘 파악해야겠다는 생각이 들었습니다.
