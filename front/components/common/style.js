import styled from 'styled-components';

// Auth 카드
export const StyleAuthCard = styled.article`
  width: 348px;
  border: 1px solid #eee;
  border-radius: 2px;
  box-shadow: 0 0 2px #8c8c8c;
  margin: 15px auto 0;
  padding: 30px;
  text-align: center;
  & h1 {
    margin-bottom: 30px;
  }
`;

// 작성 시간 표시 - 포스트, 덧글
export const StyleDate = styled.span`
  font-size: 0.85rem;
  font-weight: lighter;
  margin-left: 10px;
  margin-bottom: 0;
  color: #aaa;
`;
