import React from 'react';

// 평점을 소수점까지 별 모양으로 표시하는 읽기 전용 컴포넌트
const StarRating = ({ rating, size = 16 }) => {
    const maxRating = 5;
    // 평점 값이 0과 5 사이를 벗어나지 않도록 보정
    const clampedRating = Math.max(0, Math.min(rating, maxRating));

    return (
        <div style={{ display: 'inline-block', position: 'relative', fontSize: `${size}px`, color: '#E5E7EB' }}>
            {/* 회색 별 5개를 기본 배경으로 깔아둠 */}
            {'★★★★★'}
            {/* 평점 값에 따라 너비가 변하는 노란색 별을 위에 겹침 */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${(clampedRating / maxRating) * 100}%`,
                overflow: 'hidden',
                color: '#FACC15'
            }}>
                {'★★★★★'}
            </div>
        </div>
    );
};

export default StarRating;