# [BiioGram](http://biiogram.ga)
http://biiogram.ga  
  
<img src="https://postfiles.pstatic.net/MjAyMTAyMDJfMTcy/MDAxNjEyMjQ2OTM3MzAy.Hwb4lzjIbFDUZEKmur5bJHC55asg4OpOeE7U16HAhxkg.81ypipjv3d_nLbi2qDPP-F09aN-tkRXcNhiDcKstnEwg.GIF.bohwajung/biiogram.gif?type=w966">
Next, express, MYSql 를 사용하여 만든 인스타그램 클론 코딩입니다.  
AWS를 사용하여 배포했으며, 이미지업로드는 S3를 사용합니다.

## 주요 기술
Next, Redux, Redux-saga, express, sequelize

## 주요 기능

### Passport를 사용한 사용자 인증 및 로그인 기능
- Passport를 사용하여 사용자 인증 및 로그인기능 구현.  
- bycrypt를 사용하여 비밀번호를 암호화하여 이중보안 구현.

### 페이지네이션
```js
useEffect(() => {
  function onScroll() {
    const { pageYOffset } = window;
    const { clientHeight, scrollHeight } = document.documentElement;
    if (pageYOffset + clientHeight > scrollHeight - 300) {
      if (hasMorePosts && !loadPostsLoading) {
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch(whatPosts({ lastId, query }));
      }
    }
  }
  window.addEventListener('scroll', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}, [hasMorePosts, loadPostsLoading, mainPosts]);
```
- 처음에 포스트를 5개만 가져오고, 스크롤 시 5개씩 추가로 더 가져오는 페이지네이션 기능을 만들어 레이지로딩 구현.

### 게시글 좋아요, 덧글, 팔로우 기능
```js
function addLikersAPI(data) {
  return axios.patch(`/post/${data}/like`); // PATCH /post/postId/like
}
function* addLikers({ payload }) {
  try {
    const result = yield call(addLikersAPI, payload);
    yield put(addLikersSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(addLikersFail(err));
  }
}
```
- axios를 사용하여 ajax 기능 구현. 
- 데이터를 가져오는 비즈니스로직 컴포넌트를 분리하여, 비동기 작업 유지보수에 용이  

### 게시글 이미지 슬라이드 기능

```js
const prevSlide = useCallback(
    () => (currentSlider === 1 ? null : setCurrentSlider((prev) => prev - 1)),
    [currentSlider],
  );
  const nextSlide = useCallback(() => {
    currentSlider >= LEN ? null : setCurrentSlider((prev) => prev + 1);
  }, [currentSlider]);

  useEffect(() => {
    const moveSliderSize = ((currentSlider - 1) * 100) / LEN;
    slideRef.current.style.transition = 'all 0.5s ease-in-out';
    slideRef.current.style.transform = `translateX(-${moveSliderSize}%)`;
    slideRef.current.style.width = `${LEN * 100}%`;
  }, [currentSlider]);
  ```
  - 게시글 이미지 2개 이상일 경우, 슬라이드 기능 구현  

### 프로필 페이지  

- 작성한 게시글 확인 가능, 마우스 오버 시 덧글 및 좋아요 갯수 확인 가능  
- 팔로워와 내가 팔로우하는 유저 확인 가능  


### 게시글 및 프로필 이미지 업로드
- 게시글 이미지 혹은 프로필 이미지 등록 시 AWS S3에 이미지 업로드 

### SEO
```js
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  context.store.dispatch(loadPostsRequest({ lastId: 0 })); // 처음 목록 불러오기
  const cookie = context.req?.headers.cookie;
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch(getMyInfoRequest());
    axios.defaults.headers.Cookie = '';
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
```
- 서버사이드 렌더링을 사용하여 검색엔진 최적화  
- 메타 태그 사용

### CSS
#### styled-components
- styled-components를 사용하여 style 코드 재사용
#### semantic-ui
