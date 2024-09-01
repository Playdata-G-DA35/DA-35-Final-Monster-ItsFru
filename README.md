# DA-35-Final-Monster-ItsFru


## It's Fru : 객체 인식을 이용한 무인 과일 매장 결제 서비스
1. 인건비 절감을 위해 무인 매장이 늘어나는 추세<br> 
  [계속된 최저임금 인상에 더 빨라진 편의점 무인점포 시대](https://www.ajunews.com/view/20240123145301069)
2. 과일 가격에 대한 소비자 부담은 늘어나고 있으며, 하자가 있는 과일을 저렴하게 팔았을 때 수요가 높았음<br>
  [국내 과일 가격, 연이은 고공행진](https://www.mydailybyte.com/post/%EA%B3%BC%EC%9D%BC-%EA%B0%80%EA%B2%A9-%EA%B3%A0%EA%B3%B5%ED%96%89%EC%A7%84) <br>
  [‘맛 좋고, 속 멀쩡하면 그만’... 널뛰는 물가에 ‘못난이 상품’ 효자로](https://www.ajunews.com/view/20240123145301069)
3. 무인 과일 매장은 이미 존재하는데, 비교적 문제가 되었던 점은 재고 처리 및 가격 태깅<br>
  [무인 과일 매장 브랜드 오롯 소개글](https://post.naver.com/viewer/postView.naver?volumeNo=35733569&vType=VERTICAL)

-> 이러한 배경을 바탕으로, 객체 인식을 통해 가격 태깅 및 손상율에 따른 할인 제공, 무인 결제 자동화를 프로젝트의 목표로 함
<br><br>

## 레포지토리 구조
ItsFru/ 프로젝트 폴더 <br>
├── data/ 데이터셋 관련 <br>
├── backend/ 백엔드, Fast API <br>
├── frontend/ 프론트엔드, Next.JS React <br>
├── models/ Yolo 및 기타 비전, 회귀 모델 관련 코드 및 노트북 파일 <br>
├── notebooks/ 프로젝트 최종 작업물에 직접 포함되지 않은 노트북 파일들 <br>
Reports/ 산출물 <br>
