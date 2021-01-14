import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Slider = ({ Images }) => {
  const LEN = Images.length;
  const [currentSlider, setCurrentSlider] = useState(1);
  const slideRef = useRef();

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

  const dotStyle = useMemo(() => ({ background: '#999' }), []);
  return (
    <s.container>
      {currentSlider !== 1 && (
        <Icon
          className="prevPointer"
          name="arrow alternate circle left outline"
          onClick={prevSlide}
        />
      )}
      {currentSlider !== LEN && (
        <Icon
          className="nextPointer"
          name="arrow alternate circle right outline"
          onClick={nextSlide}
        />
      )}
      <s.slider ref={slideRef}>
        {Images.map((v, i) => (
          <div key={i}>
            <img src={v.src} alt={v.src} />
          </div>
        ))}
      </s.slider>
      {LEN > 1 && (
        <s.dots>
          {Images.map((v, i) => (
            <span key={i} style={i + 1 === currentSlider ? dotStyle : null} />
          ))}
        </s.dots>
      )}
    </s.container>
  );
};

const s = {};
s.container = styled.div`
  width: 100%;
  max-height: 640px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  & i {
    padding: 50px 0;
    position: absolute;
    top: calc(50% - 58px);
    z-index: 490;
    margin: 0 0.25rem;
    cursor: pointer;
  }
  & i.prevPointer {
    left: 0;
  }
  & i.nextPointer {
    right: 0;
  }
`;
s.slider = styled.div`
  display: flex;
  & div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    & img {
      max-width: 100%;
      max-height: 640px;
    }
  }
`;
s.dots = styled.div`
  text-align: center;
  & span {
    display: inline-block;
    padding: 4px;
    border-radius: 50%;
    background: #eee;
    margin-right: 3px;
  }
`;

Slider.propTypes = {
  Images: PropTypes.array.isRequired,
};
export default Slider;
